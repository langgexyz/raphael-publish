export interface CardPalette {
    bg: string;
    text: string;
    highlight: string;
    meta: string;
    border: string;
}

export interface CardTheme {
    id: string;
    name: string;
    description: string;
    css: string;          // scoped by [data-card="id"]
    palette: CardPalette;
}
