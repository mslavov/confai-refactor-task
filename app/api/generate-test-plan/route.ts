import { NextRequest, NextResponse } from "next/server";
import { OpenAiTestCaseGenerator } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const { documentation } = await request.json();

        // Create AI generator with API key from environment
        const generator = new OpenAiTestCaseGenerator(
            process.env.OPENAI_API_KEY || "",
        );

        // Generate test cases using AI
        const testCases = await generator.generateTestCases(documentation);

        return NextResponse.json(testCases);
    } catch (error) {
        console.error("Failed to generate test plan:", error);
        return NextResponse.json(
            { error: "Failed to generate test plan. Please try again." },
            { status: 500 }
        );
    }
} 