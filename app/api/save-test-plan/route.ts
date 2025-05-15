import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { TestCase } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const { projectId, documentation, testCases } = await request.json();

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

        if (testPlanError) {
            throw testPlanError;
        }

        // 2. Create test cases linked to the test plan
        const formattedTestCases = testCases.map((tc: TestCase) => ({
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

        if (testCasesError) {
            throw testCasesError;
        }

        return NextResponse.json({ id: testPlan.id });
    } catch (error) {
        console.error("Failed to save test plan:", error);
        return NextResponse.json(
            { error: "Failed to save test plan" },
            { status: 500 }
        );
    }
} 