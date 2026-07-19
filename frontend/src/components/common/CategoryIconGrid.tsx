import { productCategories } from "@/data/productCategories";

interface CategoryIconGridProps {
  active?: string;
  onSelect: (slug: string | null) => void;
}

export function CategoryIconGrid({ active, onSelect }: CategoryIconGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {productCategories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect(isActive ? null : cat.slug)}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-colors ${
              isActive
                ? "border-volt bg-volt/5"
                : "border-line bg-white hover:border-volt/40"
            }`}
          >
            {isActive && (
              <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-volt ring-2 ring-white" />
            )}
            <cat.icon size={22} className={isActive ? "text-volt" : "text-slate"} />
            <span className="text-[11px] font-medium leading-tight text-navy">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
