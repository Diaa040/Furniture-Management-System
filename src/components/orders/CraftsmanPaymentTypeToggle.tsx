"use client";

export type CraftsmanPaymentType = "contract" | "daily";

interface CraftsmanPaymentTypeToggleProps {
  value: CraftsmanPaymentType;
  onChange: (value: CraftsmanPaymentType) => void;
}

const OPTIONS: { value: CraftsmanPaymentType; label: string }[] = [
  { value: "contract", label: "مصنعية" },
  { value: "daily", label: "يومية" },
];

export default function CraftsmanPaymentTypeToggle({
  value,
  onChange,
}: CraftsmanPaymentTypeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-5 py-2 rounded-full text-sm font-black transition-all border ${
            value === option.value
              ? "bg-[#6B4226] text-white border-[#6B4226]"
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}