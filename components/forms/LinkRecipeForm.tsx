"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createExternalRecipe,
  type ActionState,
} from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CATEGORY_IDS, CATEGORIES } from "@/lib/constants";

const initialState: ActionState = {};

export function LinkRecipeForm() {
  const [state, formAction, pending] = useActionState(
    createExternalRecipe,
    initialState,
  );
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  const scrapeUrl = useCallback(async (targetUrl: string) => {
    if (!targetUrl.startsWith("https://")) return;

    setScraping(true);
    setScrapeError("");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!res.ok) {
        setScrapeError("Could not fetch page metadata. Fill in details manually.");
        return;
      }

      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.image) setImageUrl(data.image);
      if (!data.title && !data.image) {
        setScrapeError("No preview found. You can still save with a custom title.");
      }
    } catch {
      setScrapeError("Scraping failed. Fill in details manually.");
    } finally {
      setScraping(false);
    }
  }, []);

  useEffect(() => {
    if (!url.startsWith("https://")) return;

    const timer = setTimeout(() => {
      scrapeUrl(url);
    }, 600);

    return () => clearTimeout(timer);
  }, [url, scrapeUrl]);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Recipe URL">
        <Input
          name="url"
          type="url"
          required
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {scraping && (
          <p className="text-xs text-stone">Fetching preview...</p>
        )}
        {scrapeError && (
          <p className="text-xs text-amber-700">{scrapeError}</p>
        )}
      </Field>

      {imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-stone/15">
          <Image
            src={imageUrl}
            alt="Recipe preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <input type="hidden" name="image_url" value={imageUrl} />

      <Field label="Title">
        <Input
          name="title"
          required
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Category">
        <Select name="category" required defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_IDS.map((id) => (
            <option key={id} value={id}>
              {CATEGORIES[id].en} ({CATEGORIES[id].he})
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tags" hint="Comma-separated">
        <Input name="tags" placeholder="Quick, Weeknight" />
      </Field>

      <Field label="My Custom Notes">
        <Textarea
          name="custom_notes"
          placeholder="Substitutions, timing tips, what the kids liked..."
          className="min-h-48"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving..." : "Save Link"}
        </Button>
        <Link href="/" className="flex-1">
          <Button type="button" variant="secondary" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
