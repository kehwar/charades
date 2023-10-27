import { joinURL } from "ufo";
import type { LiteralUnion } from "type-fest";

export const useDeckStore = defineStore("decks", () => {
    const decks = useLocalStorage<Record<string, Deck>>("decks", {});

    async function fetchDeck(url: LiteralUnion<DeckPath, string>) {
        const slug = useKebabCase(url);
        const maybeDeck = await $fetch<Partial<Deck>>(joinURL("/decks", `${url}.json`));
        const deck: Deck = {
            slug,
            url,
            name: maybeDeck.name || slug,
            cards: maybeDeck.cards || [],
        };
        decks.value[slug] = deck;
        return maybeDeck;
    }
    async function fetchDecks(force?: boolean) {
        const deckPaths = force ? DECK_PATHS : DECK_PATHS.filter((deckPath) => !decks.value[deckPath]);
        const deckPromises = deckPaths.map((path) => fetchDeck(path));
        await Promise.all(deckPromises);
        return decks.value;
    }

    return {
        decks,
        fetchDeck,
        fetchDecks,
    };
});

export const DECK_PATHS = [
    // @index('../public/**/*.json', f => `"${f.path.split("/").slice(-2).join("/")}",`)
    "en/animals",
    "en/countries",
    "en/dc-characters",
    "en/disney-songs",
    "en/harry-potter-characters",
    "en/harry-potter-spells",
    "en/marvel-characters",
    "en/mime",
    "en/objects",
    "en/pokemon-1-151",
    "en/professions",
    "en/simpson-characters",
    "en/sports",
    "en/star-wars-characters",
    // @endindex
] as const;

export type DeckPath = typeof DECK_PATHS[number];

type Deck = {
    slug: string
    url?: string
    name: string
    cards: string[]
};
