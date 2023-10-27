<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";
import { useDeckStore } from "~/composables/use-deck-store";

const decks = useDeckStore().decks;

const deckList = computed(() => _.sortBy(decks, (deck) => deck.name));

function newDeck() {
    const deck = useDeckStore().newDeck();
    navigateTo({ name: "deck-deck-edit", params: { deck: deck.slug } });
}
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
    </UCard>
</template>
