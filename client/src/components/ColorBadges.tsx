import { COLOR_PALETTE, parseColorIds } from "@shared/colors";

interface ColorBadgesProps {
  colorString: string | null | undefined;
  maxDisplay?: number;
}

export default function ColorBadges({ colorString, maxDisplay = 6 }: ColorBadgesProps) {
  const colorIds = parseColorIds(colorString);

  if (colorIds.length === 0) {
    return <span className="text-sm text-muted-foreground">Sem cores definidas</span>;
  }

  const displayedColors = colorIds.slice(0, maxDisplay);
  const hiddenCount = colorIds.length - displayedColors.length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayedColors.map((colorId) => {
        const color = COLOR_PALETTE.find((c) => c.id === colorId);
        if (!color) return null;
        return (
          <div
            key={color.id}
            className="w-6 h-6 rounded-full border-2 border-border hover:border-accent transition-colors cursor-help"
            style={{ backgroundColor: color.hex }}
            title={color.displayName}
          />
        );
      })}
      {hiddenCount > 0 && (
        <span className="text-xs text-muted-foreground font-medium">+{hiddenCount}</span>
      )}
    </div>
  );
}
