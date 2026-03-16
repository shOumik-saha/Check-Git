import { NextRequest, NextResponse } from "next/server";
import { getRepoInfo, analyzeRepo } from "@/lib/github";
import { generateAnalysis } from "@/lib/agent";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    const repoRaw = await getRepoInfo(repoUrl);
    const repoData = analyzeRepo(repoRaw);
    const analysis = await generateAnalysis(repoData);

    // ✅ Save to Supabase
    await supabase.from("repo_history").insert({
      url: repoUrl,
      repo_name: repoData.fullName,
    });

    return NextResponse.json({ repoData, analysis });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}