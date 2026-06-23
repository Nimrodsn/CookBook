"use client";

import { cn } from "@/lib/utils";
import type { TabId } from "@/lib/constants";
import { TABS } from "@/lib/constants";

type TabNavProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

export function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-warm-white p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "min-h-11 flex-1 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-terracotta text-white shadow-sm"
              : "text-stone hover:text-espresso",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
