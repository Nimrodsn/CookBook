import { Header } from "@/components/layout/Header";
import { LinkRecipeForm } from "@/components/forms/LinkRecipeForm";

export default function NewLinkRecipePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            Save a Link
          </h1>
          <p className="mt-1 text-stone">
            Paste a recipe URL — we&apos;ll fetch the preview and you can add your notes.
          </p>
        </div>
        <div className="rounded-2xl border border-stone/15 bg-warm-white p-6 shadow-sm">
          <LinkRecipeForm />
        </div>
      </main>
    </>
  );
}
