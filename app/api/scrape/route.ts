import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";
import { scrapeUrlSchema } from "@/lib/validations/recipe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = scrapeUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid URL" },
        { status: 400 },
      );
    }

    const { result } = await ogs({
      url: parsed.data.url,
      timeout: 8000,
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; CookBookBot/1.0; +https://vercel.app)",
        },
      },
    });

    const ogImage = result.ogImage;
    const imageUrl = Array.isArray(ogImage)
      ? (ogImage[0]?.url ?? "")
      : typeof ogImage === "object" && ogImage !== null && "url" in ogImage
        ? String((ogImage as { url?: string }).url ?? "")
        : "";

    return NextResponse.json({
      title: result.ogTitle ?? result.twitterTitle ?? result.dcTitle ?? "",
      image: imageUrl,
      description:
        result.ogDescription ?? result.twitterDescription ?? result.dcDescription ?? "",
    });
  } catch {
    return NextResponse.json({
      title: "",
      image: "",
      description: "",
    });
  }
}
