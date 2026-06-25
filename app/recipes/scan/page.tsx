import { Header } from "@/components/layout/Header";
import { ScanRecipeForm } from "@/components/forms/ScanRecipeForm";

export default function ScanRecipePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            Scan Recipe
          </h1>
          <p className="mt-1 text-stone">
            Take a photo of a handwritten or printed recipe. AI will transcribe it
            for you to review before saving.
          </p>
        </div>
        <div className="rounded-2xl border border-stone/15 bg-warm-white p-6 shadow-sm">
          <ScanRecipeForm />
        </div>
      </main>
    </>
  );
}
