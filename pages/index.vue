<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";

const decks = useDeckStore().decks;
const deckList = computed(() => _.sortBy(decks, (deck) => deck.name));
const hardReset = useHardReset();
</script>

<template>
    <UCard class="h-full overflow-auto">
        <template #header>
            <span class="text-3xl">Decks</span>
        </template>
        <div class="flex flex-wrap gap-2 overflow-auto">
            <UButton v-for="(deck, index) in deckList" :key="index" class="grow" icon="i-heroicons-book-open" size="xl" :to="joinURL('deck', deck.slug)">
                {{ deck.name }}
            </UButton>
        </div>
        <template #footer>
            <div class="flex justify-between gap-2 overflow-x-auto">
                <UButton icon="i-heroicons-squares-plus" @click="navigateToNewDeck()">
                    New Deck
                </UButton>
                <UButton class="" icon="i-heroicons-exclamation-triangle" :loading="hardReset.isLoading.value" @click="hardReset.confirm()">
                    Hard Reset
                </UButton>
            </div>
        </template>
    </UCard>
</template>
