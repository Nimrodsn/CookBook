"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createLocalRecipe,
  type ActionState,
} from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RecipePhotosField } from "@/components/forms/RecipePhotosField";
import { CategorySelect } from "@/components/forms/CategorySelect";
import type { TranscribedRecipeResponse } from "@/lib/validations/transcription";
import { formatTagsForInput } from "@/lib/utils";

const initialState: ActionState = {};

type Step = "capture" | "review";

export function ScanRecipeForm() {
  const [step, setStep] = useState<Step>("capture");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState("");
  const [warning, setWarning] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    createLocalRecipe,
    initialState,
  );

  function handleImageSelect(file: File | null) {
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTranscribeError("");
    setWarning("");
    setStep("capture");
  }

  async function handleTranscribe() {
    if (!imageFile) return;

    setTranscribing(true);
    setTranscribeError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/ai/transcribe-recipe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setTranscribeError(data.error ?? "Transcription failed.");
        return;
      }

      const result = data as TranscribedRecipeResponse;
      setTitle(result.title);
      setIngredients(result.ingredients);
      setInstructions(result.instructions);
      setCategory(result.category ?? "");
      setTags(formatTagsForInput(result.tags ?? []));
      setWarning(result.warning ?? "");
      setStep("review");
    } catch {
      setTranscribeError("Could not reach the transcription service.");
    } finally {
      setTranscribing(false);
    }
  }

  function handleRetake() {
    setStep("capture");
    setImageFile(null);
    setPreviewUrl(null);
    setTitle("");
    setCategory("");
    setTags("");
    setIngredients("");
    setInstructions("");
    setWarning("");
    setTranscribeError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (step === "capture") {
    return (
      <div className="space-y-5">
        <Field label="Recipe photo" hint="Take a photo or upload from your gallery">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="min-h-11 w-full rounded-xl border border-stone/30 bg-white px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
          />
        </Field>

        {previewUrl && (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-stone/15">
            <Image
              src={previewUrl}
              alt="Recipe preview"
              fill
              className="object-contain bg-cream"
              unoptimized
            />
          </div>
        )}

        {transcribeError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {transcribeError}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            disabled={!imageFile || transcribing}
            onClick={handleTranscribe}
            className="flex-1"
          >
            {transcribing ? "Transcribing..." : "Transcribe with AI"}
          </Button>
          <Link href="/" className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {warning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warning}
        </div>
      )}

      <RecipePhotosField
        mode="local"
        label="Photos"
        hint="The scanned photo is included. Add more photos before saving if needed."
        seedFiles={imageFile ? [imageFile] : []}
      />

      <Field label="Title">
        <Input
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Category">
        <CategorySelect
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
      </Field>

      <Field label="Tags" hint="Comma-separated">
        <Input
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </Field>

      <Field label="Ingredients">
        <Textarea
          name="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="min-h-40"
        />
      </Field>

      <Field label="Instructions">
        <Textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="min-h-48"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving..." : "Save Recipe"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={handleRetake}
        >
          Retake Photo
        </Button>
      </div>
    </form>
  );
}
