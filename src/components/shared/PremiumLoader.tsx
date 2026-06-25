"use client";


export default function PremiumLoader({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{message}</div>
      </div>
    </div>
  );
}
