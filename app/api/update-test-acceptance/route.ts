import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { id, accepted } = await request.json();

        const supabase = await supabaseServer();

        const { error } = await supabase
            .from("test_cases")
            .update({ accepted })
            .eq("id", id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update test acceptance:", error);
        return NextResponse.json(
            { error: "Failed to update test acceptance" },
            { status: 500 }
        );
    }
} 