<script setup lang="ts">
import type { CardGuess, GameState } from "~/components/game-round.vue";

const route = useRoute();
const slug = (route.params as any).deck as string;
const deck = useDeckStore().decks[slug];
if (deck == null)
    throw createError("Deck doesn't exist");

const cards = deck.cards;
const cardHistory = ref<CardGuess[]>([]);
const state = ref<GameState>("idle");
</script>

<template>
    <UCard class="h-full overflow-auto">
        <template #header>
            <span class="text-xl font-semibold">
                {{ deck.name }}</span>
        </template>
        <div class="flex flex-wrap gap-2">
            <UButton
                class="w-[10rem]"
                icon="i-heroicons-play-circle"
                size="xl"
                @click="state = 'playing'"
            >
                {{ cardHistory.length === 0 ? 'Start' : 'Start again' }}
            </UButton>
            <UButton
                class="w-[10rem]"
                icon="i-heroicons-home"
                size="xl"
                to="/"
            >
                Return
            </UButton>
        </div>
        <UCard v-if="state === 'idle' && cardHistory.length > 0" class="mt-4">
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
            <div class="flex justify-between gap-2 overflow-auto">
                <div class="flex flex-wrap gap-2">
                    <UButton
                        class="w-[6rem]"
                        icon="i-heroicons-play-circle"
                        @click="state = 'playing'"
                    >
                        Start
                    </UButton>
                    <UButton
                        class="w-[6rem]"
                        icon="i-heroicons-pencil-square"
                        @click="navigateTo({ name: 'deck-deck-edit', params: { deck: deck.slug } })"
                    >
                        Edit
                    </UButton>
                    <UButton
                        class="w-[6rem]"
                        icon="i-heroicons-trash"
                        @click="useDeleteDeck(slug).confirm"
                    >
                        Delete
                    </UButton>
                </div>
                <div class="flex flex-wrap justify-end gap-2">
                    <UButton
                        class="w-[6rem]"
                        icon="i-heroicons-code-bracket"
                        @click="useCopyJSONToClipboard(slug)"
                    >
                        JSON
                    </UButton>
                    <UButton
                        v-if="deck.url != null"
                        class="w-[6rem]"
                        external
                        icon="i-heroicons-code-bracket"
                        :to="`/decks/${deck.url}.json`"
                    >
                        Source
                    </UButton>
                    <UButton
                        class="w-[6rem]"
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
