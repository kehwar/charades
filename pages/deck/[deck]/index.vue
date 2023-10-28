<script setup lang="ts">
import type { CardGuess, GameState } from "~/components/game-round.vue";

const route = useRoute();
const slug = (route.params as any).deck as string;
const deck = useDeckStore().decks[slug];
if (deck == null)
    throw createError("Deck doesn't exist");
const cards = deck.cards;
const state = ref<GameState>("idle");
const cardHistory = ref<CardGuess[]>([]);
</script>

<template>
    <UCard class="h-full overflow-auto">
        <template #header>
            <span class="text-3xl">
                {{ deck.name }}</span>
        </template>
        <UButton
            icon="i-heroicons-play-circle"
            size="xl"
            @click="state = 'playing'"
        >
            {{ cardHistory.length === 0 ? 'Start' : 'Restart' }}
        </UButton>
        <UCard v-if="state === 'idle' && cardHistory.length > 0" class="mt-4">
            <template #header>
                <span>Results</span>
            </template>
            <ul class="flex flex-wrap gap-2">
                <li
                    v-for="(card, index) in cardHistory"
                    :key="index"
                    class="grow break-words rounded bg-gray-100 p-2 text-center text-xl"
                    :class="{
                        'text-green-500': card.correct === true,
                        'text-red-500': card.correct === false,
                        'text-gray-500': card.correct === null,
                    }"
                >
                    {{ card.card }}
                </li>
            </ul>
        </UCard>
        <GameRound
            v-if="state === 'playing'"
            v-model:state="state"
            :cards="cards"
            class="w-full"
            :time="!isDevelopment ? 120 : 9999"
            @round-end="(h) => cardHistory = h"
        />
        <template #footer>
            <div class="flex justify-between gap-2">
                <div class="flex gap-2">
                    <UButton
                        icon="i-heroicons-play-circle"
                        @click="state = 'playing'"
                    >
                        Start
                    </UButton>
                    <UButton
                        icon="i-heroicons-pencil-square"
                        @click="navigateTo({ name: 'deck-deck-edit', params: { deck: deck.slug } })"
                    >
                        Edit
                    </UButton>
                </div>
                <div class="flex gap-2">
                    <UButton
                        v-if="deck.url != null"
                        external
                        icon="i-heroicons-code-bracket"
                        :to="`/decks/${deck.url}.json`"
                    >
                        Source
                    </UButton>
                    <UButton
                        icon="i-heroicons-home"
                        to="/"
                    >
                        Return
                    </UButton>
                </div>
            </div>
        </template>
    </UCard>
</template>
