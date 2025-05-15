import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { name, baseUrl } = await request.json();

        const supabase = await supabaseServer();

        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        const { data, error } = await supabase
            .from("projects")
            .insert({
                name,
                base_url: baseUrl,
                user_id: userData.user.id,
            })
            .select("id")
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ id: data.id });
    } catch (error) {
        console.error("Failed to create project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
} 