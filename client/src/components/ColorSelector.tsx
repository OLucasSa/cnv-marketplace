import { useMemo, useCallback } from 'react';
import { COLOR_PALETTE, ColorId, parseColorIds, stringifyColorIds } from "@shared/colors";
import { Button } from "@/components/ui/button";

interface ColorSelectorProps {
  value: string | null | undefined;
  onChange: (colorIds: string) => void;
  disabled?: boolean;
}

export default function ColorSelector({ value, onChange, disabled = false }: ColorSelectorProps) {
  const selectedIds = useMemo(() => parseColorIds(value), [value]);

  const toggleColor = useCallback((colorId: ColorId) => {
    const newIds = selectedIds.includes(colorId)
      ? selectedIds.filter((id) => id !== colorId)
      : [...selectedIds, colorId];
    const stringified = stringifyColorIds(newIds);
    onChange(stringified);
  }, [selectedIds, onChange]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Cores Disponíveis</label>
      <div className="grid grid-cols-6 gap-3">
        {COLOR_PALETTE.map((color) => {
          const isSelected = selectedIds.includes(color.id as ColorId);
          return (
            <button
              key={color.id}
              onClick={() => toggleColor(color.id as ColorId)}
              disabled={disabled}
              className={`relative w-full aspect-square rounded-lg transition-all border-2 ${
                isSelected ? "border-foreground ring-2 ring-offset-2 ring-accent" : "border-border hover:border-accent"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              style={{ backgroundColor: color.hex }}
              title={color.displayName}
              type="button"
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        {selectedIds.length > 0 ? (
          <span>
            {selectedIds.length} cor{selectedIds.length > 1 ? "es" : ""} selecionada{selectedIds.length > 1 ? "s" : ""}: {selectedIds.map((id) => COLOR_PALETTE.find((c) => c.id === id)?.displayName).join(", ")}
          </span>
        ) : (
          <span>Nenhuma cor selecionada</span>
        )}
      </div>
    </div>
  );
}
