import _, { unset } from "lodash";
import { joinURL } from "ufo";
import type { LiteralUnion } from "type-fest";

export const useDeckStore = defineStore("decks", () => {
    const decks = useLocalStorage<Record<string, Deck>>("decks", {});

    function newDeck() {
        const deck = generateRandomDeck();
        decks.value[deck.slug] = deck;
        return deck;
    }
    function deleteDeck(slug: string) {
        unset(decks.value, slug);
    }

    async function fetchDeck(url: LiteralUnion<DeckPath, string>) {
        const slug = getDeckSlug(url);
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
        const deckPaths = force ? DECK_PATHS : DECK_PATHS.filter((deckPath) => !decks.value[getDeckSlug(deckPath)]);
        const deckPromises = deckPaths.map((path) => fetchDeck(path));
        await Promise.all(deckPromises);
        return decks.value;
    }

    return {
        decks,
        fetchDeck,
        fetchDecks,
        newDeck,
        deleteDeck,
    };
});

function getDeckSlug(url: string) {
    return _.kebabCase(url);
}
export function generateRandomDeck(): Deck {
    return {
        slug: crypto.randomUUID(),
        name: "* New Deck *",
        cards: [
            "Card 1",
            "Card 2",
            "Card 3",
        ],
    };
}

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

export type Deck = {
    slug: string
    url?: string
    name: string
    cards: string[]
};
