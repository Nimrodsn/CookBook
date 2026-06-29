import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CategoriesProvider } from "@/components/providers/CategoriesProvider";
import { getCategories, seedDefaultCategories } from "@/lib/appwrite/categories";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Cookbook",
  description: "A personal digital recipe book for the family",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    await seedDefaultCategories();
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso">
        <CategoriesProvider categories={categories}>
          {children}
        </CategoriesProvider>
      </body>
    </html>
  );
}
