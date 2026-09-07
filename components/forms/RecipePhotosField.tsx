"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MAX_RECIPE_IMAGES } from "@/lib/constants";
import type { RecipeImage } from "@/lib/utils";

type RecipePhotosFieldProps = {
  mode: "local" | "external";
  label?: string;
  hint?: string;
  initialImages?: RecipeImage[];
  seedFiles?: File[];
  imageUrls?: string[];
  onImageUrlsChange?: (urls: string[]) => void;
};

type KeptImage = RecipeImage & { key: string };

export function RecipePhotosField({
  mode,
  label = "Photos",
  hint,
  initialImages = [],
  seedFiles = [],
  imageUrls,
  onImageUrlsChange,
}: RecipePhotosFieldProps) {
  const [keptImages, setKeptImages] = useState<KeptImage[]>(() =>
    initialImages.map((image, index) => ({
      ...image,
      key: `existing-${index}-${image.url}`,
    })),
  );
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>(() => [...seedFiles]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [localError, setLocalError] = useState("");
  const [externalUrls, setExternalUrls] = useState<string[]>(
    imageUrls?.length ? imageUrls : [""],
  );

  const hiddenFilesRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const controlledExternal = imageUrls !== undefined && onImageUrlsChange !== undefined;
  const urls = controlledExternal ? imageUrls : externalUrls;
  const setUrls = controlledExternal ? onImageUrlsChange : setExternalUrls;

  const totalCount =
    mode === "local"
      ? keptImages.length + pendingFiles.length
      : urls.filter(Boolean).length;

  useEffect(() => {
    const previews = pendingFiles.map((file) => URL.createObjectURL(file));
    setPendingPreviews(previews);
    return () => {
      for (const preview of previews) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [pendingFiles]);

  useEffect(() => {
    if (!hiddenFilesRef.current) return;
    const transfer = new DataTransfer();
    for (const file of pendingFiles) {
      transfer.items.add(file);
    }
    hiddenFilesRef.current.files = transfer.files;
  }, [pendingFiles]);

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const nextFiles = [...pendingFiles];
    for (const file of Array.from(fileList)) {
      if (nextFiles.length + keptImages.length >= MAX_RECIPE_IMAGES) {
        setLocalError(`Maximum ${MAX_RECIPE_IMAGES} photos allowed.`);
        break;
      }
      nextFiles.push(file);
    }

    setLocalError("");
    setPendingFiles(nextFiles);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeKeptImage(key: string) {
    setKeptImages((current) => {
      const target = current.find((image) => image.key === key);
      if (target?.fileId) {
        setRemovedFileIds((ids) => [...ids, target.fileId!]);
      }
      return current.filter((image) => image.key !== key);
    });
  }

  function removePendingFile(index: number) {
    setPendingFiles((current) => current.filter((_, i) => i !== index));
    setLocalError("");
  }

  function addExternalUrlField() {
    if (urls.filter(Boolean).length >= MAX_RECIPE_IMAGES) {
      setLocalError(`Maximum ${MAX_RECIPE_IMAGES} photos allowed.`);
      return;
    }
    setLocalError("");
    setUrls([...urls, ""]);
  }

  function updateExternalUrl(index: number, value: string) {
    const next = [...urls];
    next[index] = value;
    setUrls(next);
    setLocalError("");
  }

  function removeExternalUrl(index: number) {
    setUrls(urls.filter((_, i) => i !== index));
    setLocalError("");
  }

  if (mode === "external") {
    const filledUrls = urls.filter(Boolean);

    return (
      <div className="space-y-3">
        <Field
          label={label}
          hint={
            hint ??
            `Add up to ${MAX_RECIPE_IMAGES} image URLs. The first image is the cover.`
          }
        >
          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={`url-${index}`} className="flex gap-2">
                <Input
                  name="image_urls"
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(event) =>
                    updateExternalUrl(index, event.target.value)
                  }
                />
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => removeExternalUrl(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addExternalUrlField}
              disabled={filledUrls.length >= MAX_RECIPE_IMAGES}
            >
              Add photo URL
            </Button>
          </div>
        </Field>

        {localError && (
          <p className="text-sm text-red-700">{localError}</p>
        )}

        {filledUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filledUrls.map((url) => (
              <div
                key={url}
                className="relative aspect-video overflow-hidden rounded-xl border border-stone/15"
              >
                <Image
                  src={url}
                  alt="Recipe photo preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {keptImages.map((image) => (
        <div key={image.key}>
          <input type="hidden" name="image_urls" value={image.url} />
          <input
            type="hidden"
            name="image_file_ids"
            value={image.fileId ?? ""}
          />
        </div>
      ))}

      {removedFileIds.map((fileId) => (
        <input key={fileId} type="hidden" name="removed_file_ids" value={fileId} />
      ))}

      <input
        ref={hiddenFilesRef}
        type="file"
        name="images"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <Field
        label={label}
        hint={
          hint ??
          `Add up to ${MAX_RECIPE_IMAGES} photos. The first photo is the cover.`
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="min-h-11 w-full rounded-xl border border-stone/30 bg-white px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-terracotta-light"
          onChange={(event) => handleAddFiles(event.target.files)}
          disabled={totalCount >= MAX_RECIPE_IMAGES}
        />
      </Field>

      {localError && <p className="text-sm text-red-700">{localError}</p>}

      {(keptImages.length > 0 || pendingPreviews.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {keptImages.map((image) => (
            <div
              key={image.key}
              className="relative aspect-video overflow-hidden rounded-xl border border-stone/15"
            >
              <Image
                src={image.url}
                alt="Recipe photo"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeKeptImage(image.key)}
                className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white"
              >
                Remove
              </button>
            </div>
          ))}

          {pendingPreviews.map((preview, index) => (
            <div
              key={preview}
              className="relative aspect-video overflow-hidden rounded-xl border border-stone/15"
            >
              <Image
                src={preview}
                alt="New recipe photo"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removePendingFile(index)}
                className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
