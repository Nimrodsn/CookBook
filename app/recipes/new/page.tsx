import { Header } from "@/components/layout/Header";
import { LocalRecipeForm } from "@/components/forms/LocalRecipeForm";

export default function NewRecipePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            Add Recipe
          </h1>
          <p className="mt-1 text-stone">
            Write down a family recipe with ingredients and instructions.
          </p>
        </div>
        <div className="rounded-2xl border border-stone/15 bg-warm-white p-6 shadow-sm">
          <LocalRecipeForm />
        </div>
      </main>
    </>
  );
}
