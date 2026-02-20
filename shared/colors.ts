/**
 * Predefined color palette for products
 * Each color has an ID, name, hex code, and display name
 */
export const COLOR_PALETTE = [
  { id: 1, name: "Rosa Pink", hex: "#FF1493", displayName: "Rosa Pink" },
  { id: 2, name: "Branco", hex: "#FFFFFF", displayName: "Branco" },
  { id: 3, name: "Preto", hex: "#1a1a1a", displayName: "Preto" },
  { id: 4, name: "Laranja", hex: "#FF8C00", displayName: "Laranja" },
  { id: 5, name: "Roxo", hex: "#9933FF", displayName: "Roxo" },
  { id: 6, name: "Verde", hex: "#00CC00", displayName: "Verde" },
  { id: 7, name: "Azul", hex: "#0099FF", displayName: "Azul" },
  { id: 8, name: "Vermelho", hex: "#FF0000", displayName: "Vermelho" },
  { id: 9, name: "Amarelo", hex: "#FFFF00", displayName: "Amarelo" },
  { id: 10, name: "Cinza", hex: "#808080", displayName: "Cinza" },
  { id: 11, name: "Marrom", hex: "#8B4513", displayName: "Marrom" },
  { id: 12, name: "Rosa Claro", hex: "#FFB6C1", displayName: "Rosa Claro" },
] as const;

export type ColorId = typeof COLOR_PALETTE[number]["id"];

/**
 * Get color by ID
 */
export function getColorById(id: number) {
  return COLOR_PALETTE.find((c) => c.id === id);
}

/**
 * Parse color IDs from string (comma-separated)
 */
export function parseColorIds(colorString: string | null | undefined): ColorId[] {
  if (!colorString) return [];
  return colorString
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id) && COLOR_PALETTE.some((c) => c.id === id)) as ColorId[];
}

/**
 * Convert color IDs to string (comma-separated)
 */
export function stringifyColorIds(colorIds: number[]): string {
  return colorIds.join(",");
}
