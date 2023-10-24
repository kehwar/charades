<script setup lang="ts">
import { joinURL } from "ufo";

const decks = useDecks();
</script>

<template>
    <UCard>
        <div class="flex flex-wrap gap-2">
            <UButton v-for="(deck, index) in decks" :key="index" class="grow" icon="i-heroicons-book-open" :to="joinURL('deck', deck)">
                {{ deck }}
            </UButton>
        </div>
    </UCard>
</template>
