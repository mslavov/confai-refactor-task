import { TestCase } from "./api";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Define interface for AI response
export interface AiTestCaseGeneration {
    generateTestCases(documentation: string): Promise<TestCase[]>;
}

// Schema for test case validation
const TestCaseSchema = z.object({
    name: z.string(),
    steps: z.string(),
    expected: z.string(),
    severity: z.enum(["high", "medium", "low"])
});

type TestCaseType = z.infer<typeof TestCaseSchema>;
// Wrap the array in an object to match OpenAI's requirement
const TestCasesResponseSchema = z.object({
    test_cases: z.array(TestCaseSchema)
});

// Implement OpenAI integration
export class OpenAiTestCaseGenerator implements AiTestCaseGeneration {
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model: string = "gpt-4o-mini") {
        this.client = new OpenAI({ apiKey });
        this.model = model;
    }

    async generateTestCases(documentation: string): Promise<TestCase[]> {
        try {
            // Create system message with instructions
            const systemMessage =
                "You are a QA expert specialized in creating comprehensive test plans. " +
                "Analyze the documentation and generate test cases that include a descriptive name, " +
                "step-by-step instructions, expected results, and severity level (high, medium, or low).";

            // Use structured output via responses API
            const response = await this.client.beta.chat.completions.parse({
                model: this.model,
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: documentation }
                ],
                response_format: zodResponseFormat(TestCasesResponseSchema, "json")
            });

            const result = response.choices[0]?.message.parsed;
            const testCases = result?.test_cases;

            if (!testCases) {
                throw new Error("Failed to generate test cases");
            }

            // Add IDs and accepted=false to each test case
            return testCases.map((tc: TestCaseType, index: number) => ({
                id: `ai-${Date.now()}-${index}`,
                name: tc.name,
                steps: tc.steps,
                expected: tc.expected,
                severity: tc.severity,
                accepted: false,
            }));
        } catch (error) {
            console.error("Error generating test cases:", error);
            throw error;
        }
    }
} 