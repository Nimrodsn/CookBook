import { NextResponse } from "next/server";
import { getRecipes } from "@/lib/appwrite/recipes";

export async function GET() {
  try {
    const recipes = await getRecipes();
    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}
