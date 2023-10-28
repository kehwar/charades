<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";
import { useDeckStore } from "~/composables/use-deck-store";

const decks = useDeckStore().decks;

const deckList = computed(() => _.sortBy(decks, (deck) => deck.name));

function newDeck() {
    const deck = useDeckStore().createNewRandomDeck();
    navigateTo({ name: "deck-deck-edit", params: { deck: deck.slug } });
}
function requestHardReset() {
    useToast().add({
        id: "hard-reset",
        title: "Confirm Hard Reset",
        description: "This will delete all custom decks and restore the default decks.",
        actions: [
            {
                label: "Confirm",
                click: () => hardReset.execute(),
            },
            {
                label: "Cancel",
                click: () => useToast().remove("hard-reset"),
            },
        ],
    });
}
const hardReset = useAsyncData(async () => await useDeckStore().hardReset(), { immediate: false });
</script>

<template>
    <UCard class="h-full overflow-auto">
        <template #header>
            <span class="text-3xl">Decks</span>
        </template>
        <div class="flex flex-wrap gap-2 overflow-auto">
            <UButton icon="i-heroicons-book-open" @click="newDeck()">
                New Deck
            </UButton>
            <UButton v-for="(deck, index) in deckList" :key="index" class="grow" icon="i-heroicons-book-open" size="xl" :to="joinURL('deck', deck.slug)">
                {{ deck.name }}
            </UButton>
        </div>
        <template #footer>
            <UButton :loading="hardReset.status.value === 'pending'" @click="requestHardReset()">
                Hard Reset
            </UButton>
        </template>
    </UCard>
</template>
