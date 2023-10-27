<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";
import { useDeckStore } from "~/composables/use-deck-store";

const decks = useDeckStore().decks;

const deckList = computed(() => _.sortBy(decks, (deck) => deck.name));
</script>

<template>
    <UCard>
        <div class="flex flex-wrap gap-2">
            <UButton v-for="(deck, index) in deckList" :key="index" class="grow" icon="i-heroicons-book-open" :to="joinURL('deck', deck.slug)">
                {{ deck.name }}
            </UButton>
        </div>
    </UCard>
</template>
