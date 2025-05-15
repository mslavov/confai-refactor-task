# Test Plan Implementation - High-Level Plan

## Overview

This document outlines the implementation plan for enhancing the test plan
generation feature in Bugzy AI. The goal is to replace the current mock
implementation with real LLM-powered functionality, save test cases to the
database, and display them on the dashboard.

## 1. Implement AI-Powered Test Case Generation

### 1.1 Create AI Library in `lib/ai.ts`

```typescript
// Define interface for AI response
export interface AiTestCaseGeneration {
    generateTestCases(documentation: string): Promise<TestCase[]>;
}

// Implement OpenAI integration
export class OpenAiTestCaseGenerator implements AiTestCaseGeneration {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = "gpt-4") {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateTestCases(documentation: string): Promise<TestCase[]> {
        try {
            // Construct prompt with documentation and formatting instructions
            const prompt = `
        Analyze the following documentation and generate comprehensive test cases:
        
        ${documentation}
        
        Generate test cases that include:
        1. A descriptive name
        2. Step-by-step instructions
        3. Expected results
        4. Severity level (high, medium, or low)
        
        Format your response as JSON with the following structure:
        [
          {
            "name": "Test case name",
            "steps": "Numbered steps to execute",
            "expected": "Expected outcome",
            "severity": "high|medium|low"
          }
        ]
      `;

            // Make API call to OpenAI
            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are a QA expert specialized in creating comprehensive test plans.",
                            },
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                        temperature: 0.7,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    `API error: ${data.error?.message || "Unknown error"}`,
                );
            }

            // Parse response and convert to TestCase[] format
            const testCasesJson = JSON.parse(data.choices[0].message.content);

            // Add IDs and accepted=false to each test case
            return testCasesJson.map((tc: any, index: number) => ({
                id: `ai-${Date.now()}-${index}`,
                name: tc.name,
                steps: tc.steps,
                expected: tc.expected,
                severity: tc.severity as "high" | "medium" | "low",
                accepted: false,
            }));
        } catch (error) {
            console.error("Error generating test cases:", error);
            throw error;
        }
    }
}
```

### 1.2 Update Environment Configuration

Add OpenAI API key to environment variables:

```
OPENAI_API_KEY=your_openai_api_key
```

### 1.3 Update `lib/api.ts` to Use Real LLM Implementation

```typescript
import { OpenAiTestCaseGenerator } from "@/lib/ai";

// Replace mock implementation with real LLM call
export async function generateTestPlan(
    documentation: string,
): Promise<TestCase[]> {
    // Create AI generator with API key from environment
    const generator = new OpenAiTestCaseGenerator(
        process.env.OPENAI_API_KEY || "",
    );

    try {
        // Generate test cases using AI
        return await generator.generateTestCases(documentation);
    } catch (error) {
        console.error("Failed to generate test plan:", error);
        throw new Error("Failed to generate test plan. Please try again.");
    }
}
```

## 2. Store Test Cases in Supabase Database

### 2.1 Create Database Schema

Create the following tables in Supabase:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Test plans table
CREATE TABLE test_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  documentation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test cases table
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_plan_id UUID NOT NULL REFERENCES test_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  steps TEXT NOT NULL,
  expected TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test runs table
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_plan_id UUID NOT NULL REFERENCES test_plans(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('idle', 'queued', 'running', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_run_id UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
  test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'unaccepted')),
  description TEXT,
  linear_issue_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Update `lib/api.ts` with Database Functions

Add the following functions to interact with Supabase:

```typescript
import { supabaseServer } from "@/utils/supabase/server";

// Create a new project
export async function createProject(
    name: string,
    baseUrl?: string,
): Promise<string> {
    const supabase = await supabaseServer();

    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("projects")
        .insert({
            name,
            base_url: baseUrl,
            user_id: user.user.id,
        })
        .select("id")
        .single();

    if (error) throw error;
    return data.id;
}

// Create a test plan and store test cases
export async function saveTestPlan(
    projectId: string,
    documentation: string,
    testCases: TestCase[],
): Promise<string> {
    const supabase = await supabaseServer();

    // 1. Create test plan
    const { data: testPlan, error: testPlanError } = await supabase
        .from("test_plans")
        .insert({
            project_id: projectId,
            documentation,
        })
        .select("id")
        .single();

    if (testPlanError) throw testPlanError;

    // 2. Create test cases linked to the test plan
    const formattedTestCases = testCases.map((tc) => ({
        test_plan_id: testPlan.id,
        name: tc.name,
        steps: tc.steps,
        expected: tc.expected,
        severity: tc.severity,
        accepted: tc.accepted,
    }));

    const { error: testCasesError } = await supabase
        .from("test_cases")
        .insert(formattedTestCases);

    if (testCasesError) throw testCasesError;

    return testPlan.id;
}

// Get test cases for a test plan
export async function getTestCases(testPlanId: string): Promise<TestCase[]> {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
        .from("test_cases")
        .select("*")
        .eq("test_plan_id", testPlanId);

    if (error) throw error;
    return data;
}

// Update test case acceptance
export async function updateTestAcceptance(
    id: string,
    accepted: boolean,
): Promise<void> {
    const supabase = await supabaseServer();

    const { error } = await supabase
        .from("test_cases")
        .update({ accepted })
        .eq("id", id);

    if (error) throw error;
}
```

## 3. Display Test Cases on Dashboard

### 3.1 Update the Onboarding Process to Store Data

Modify `app/onboarding/page.tsx` to:

1. Create a project record
2. Save documentation
3. Generate test cases with the AI
4. Store test cases in the database

### 3.2 Update Review Page to Load from Database

Update `app/review/page.tsx` to:

1. Fetch test cases from database instead of using mock data
2. Update test acceptance in the database when toggled
3. Create a test run record when tests are run

### 3.3 Add Dashboard Page to Show Results

Enhance `app/dashboard/page.tsx` to:

1. Show all projects for the current user
2. Display test plans for each project
3. Show test run history with results
4. Allow initiating new test runs

## 4. Testing and Deployment

1. Implement proper error handling throughout the application
2. Add loading states for all asynchronous operations
3. Test the entire flow from onboarding to test results
4. Deploy with environment variables set for production
