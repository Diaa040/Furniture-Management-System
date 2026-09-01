import { Calendar } from "lucide-react";

interface DayPickerButtonProps {
  onClick: () => void;
}

export function DayPickerButton({ onClick }: DayPickerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-sm"
    >
      <Calendar className="size-4" />
      <span>اختيار تاريخ</span>
    </button>
  );
}