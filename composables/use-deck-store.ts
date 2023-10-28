import _ from "lodash";
import { joinURL } from "ufo";
import type { LiteralUnion } from "type-fest";

// Store

export const useDeckStore = defineStore("decks", () => {
    // State

    const decks = useLocalStorage<Record<string, Deck>>("decks", {});

    // CRUD Actions

    function createNewRandomDeck() {
        const deck = generateRandomDeck();
        decks.value[deck.slug] = deck;
        return deck;
    }
    function deleteDeck(slug: string) {
        _.unset(decks.value, slug);
    }
    function readDeck(slug: string) {
        return decks.value[slug];
    }

    // Online deck actions

    /** Fetch deck definition from a URL */
    async function fetchDeck(url: LiteralUnion<DefaultDeckPath, string>) {
        const maybeDeck = await $fetch<Partial<Deck>>(joinURL("/decks", `${url}.json`));
        const slug = getDeckSlug(url);
        const deck: Deck = {
            slug,
            url,
            name: maybeDeck.name || slug,
            cards: maybeDeck.cards || [],
        };
        decks.value[slug] = deck;
        return deck;
    }

    /** Fetch all default decks */
    async function fetchDefaultDecks(force?: boolean) {
        const urls = force ? DEFAULT_DECK_PATHS : DEFAULT_DECK_PATHS.filter((deckPath) => !decks.value[getDeckSlug(deckPath)]);
        if (urls.length > 0)
            await Promise.all(urls.map((path) => fetchDeck(path)));
        return decks.value;
    }

    // Async Actions

    async function hardReset() {
        // Delete all decks
        _.chain(decks.value).keys().forEach((slug) => deleteDeck(slug)).value();

        // Fetch default decks
        await fetchDefaultDecks(true);
    }

    // Return

    return {
        // State
        decks,

        // Actions
        createNewRandomDeck,
        deleteDeck,
        fetchDeck,
        fetchDefaultDecks,
        hardReset,
        readDeck,
    };
});

// Shorthand Actions
export function useHardReset() {
    const { execute, isLoading } = useAsyncState(
        async () => await useDeckStore().hardReset(),
        null,
        { immediate: false },
    );
    function confirm() {
        useToast().add({
            id: "hard-reset",
            title: "Confirm Hard Reset",
            icon: "i-heroicons-exclamation-triangle",
            color: "amber",
            description: "This will delete all custom decks and restore the default decks.",
            actions: [
                {
                    label: "Confirm",
                    click: () => execute(),
                },
                {
                    label: "Cancel",
                    click: () => useToast().remove("hard-reset"),
                },
            ],
        });
    }
    return {
        isLoading,
        confirm,
    };
}
export function useDeleteDeck(slug: string) {
    const toastId = `delete-deck-${slug}`;
    function confirm() {
        useToast().add({
            id: toastId,
            title: `Confirm delete deck`,
            description: `Delete deck '${useDeckStore().readDeck(slug)?.name}' and all its cards.`,
            icon: "i-heroicons-trash",
            color: "amber",
            actions: [
                {
                    label: "Confirm",
                    click: () => {
                        useDeckStore().deleteDeck(slug);
                        navigateTo({ name: "index" });
                    },
                },
                {
                    label: "Cancel",
                    click: () => useToast().remove(toastId),
                },
            ],
        });
    }
    return {
        confirm,
    };
}
export function navigateToNewDeck() {
    const deck = useDeckStore().createNewRandomDeck();
    navigateTo({ name: "deck-deck-edit", params: { deck: deck.slug } });
}
export function useCopyJSONToClipboard(slug: string) {
    const deck = useDeckStore().readDeck(slug);
    const json = JSON.stringify({ name: deck?.name, cards: deck?.cards }, null, 2);
    useClipboard().copy(json);
    useToast().add({ title: "JSON copied to clipboard", timeout: 1500, icon: "i-heroicons-clipboard" });
}

// Utils

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
function getDeckSlug(url: string) {
    return _.kebabCase(url);
}

// Default Decks

export const DEFAULT_DECK_PATHS = [
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
export type DefaultDeckPath = typeof DEFAULT_DECK_PATHS[number];

// Type

export type Deck = {
    slug: string
    url?: string
    name: string
    cards: string[]
};
