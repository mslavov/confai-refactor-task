import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const testPlanId = searchParams.get("testPlanId");

        if (!testPlanId) {
            return NextResponse.json(
                { error: "Test plan ID is required" },
                { status: 400 }
            );
        }

        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from("test_cases")
            .select("*")
            .eq("test_plan_id", testPlanId);

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to get test cases:", error);
        return NextResponse.json(
            { error: "Failed to get test cases" },
            { status: 500 }
        );
    }
} 