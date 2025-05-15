// This file would contain the actual API client for interacting with the backend
// For this demo, we're using mock data, but in a real application, this would
// make fetch requests to the API endpoints defined in the PRD

import { OpenAiTestCaseGenerator } from "@/lib/ai";
import { supabaseClient } from "@/utils/supabase/client";

export type TestCase = {
  id: string
  name: string
  steps: string
  expected: string
  severity: "high" | "medium" | "low"
  accepted: boolean
}

export type TestResult = {
  id: string
  name: string
  status: "passed" | "failed" | "skipped" | "unaccepted"
  description: string
  linearIssueId: string | null
}

export type RunStatus = "idle" | "queued" | "running" | "completed"

// Replace mock implementation with real LLM call
export async function generateTestPlan(documentation: string): Promise<TestCase[]> {
  const response = await fetch('/api/generate-test-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentation }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate test plan');
  }

  return response.json();
}

// Update test case acceptance with Supabase
export async function updateTestAcceptance(id: string, accepted: boolean): Promise<void> {
  const response = await fetch('/api/update-test-acceptance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, accepted }),
  });

  if (!response.ok) {
    throw new Error('Failed to update test acceptance');
  }
}

export async function startTestRun(testIds: string[]): Promise<string> {
  // In a real app, this would call the API
  console.log("Starting test run with test IDs:", testIds)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock run ID
  return "run-123"
}

export async function getRunStatus(runId: string): Promise<RunStatus> {
  // In a real app, this would call the API
  console.log("Getting status for run:", runId)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock status
  return "running"
}

export async function getRunResults(runId: string): Promise<TestResult[]> {
  // In a real app, this would call the API
  console.log("Getting results for run:", runId)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock results
  return [
    {
      id: "1",
      name: "User can log in with valid credentials",
      status: "passed",
      description: "",
      linearIssueId: null,
    },
    // More test results would be returned here
  ]
}

export async function updateCredentials(baseUrl: string, username: string, password: string): Promise<void> {
  // In a real app, this would call the API
  console.log("Updating credentials:", { baseUrl, username, password: "********" })

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

export async function updateLinearPat(linearPat: string): Promise<void> {
  // In a real app, this would call the API
  console.log("Updating Linear PAT:", { linearPat: "********" })

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// Create a new project
export async function createProject(
  name: string,
  baseUrl?: string,
): Promise<string> {
  const response = await fetch('/api/create-project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, baseUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  const data = await response.json();
  return data.id;
}

// Create a test plan and store test cases
export async function saveTestPlan(
  projectId: string,
  documentation: string,
  testCases: TestCase[],
): Promise<string> {
  const response = await fetch('/api/save-test-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, documentation, testCases }),
  });

  if (!response.ok) {
    throw new Error('Failed to save test plan');
  }

  const data = await response.json();
  return data.id;
}

// Get test cases for a test plan
export async function getTestCases(testPlanId: string): Promise<TestCase[]> {
  const response = await fetch(`/api/get-test-cases?testPlanId=${testPlanId}`);

  if (!response.ok) {
    throw new Error('Failed to get test cases');
  }

  return response.json();
}
