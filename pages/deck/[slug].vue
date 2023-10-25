<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";
import type { CardGuess, GameState } from "~/components/game-round.vue";

const route = useRoute();

const slug = computed(() => (route.params as any).slug as string);

const cards = useFetch<string[]>(joinURL("/decks/en", `${slug.value}.json`), { immediate: false, cache: "force-cache" });

const state = ref<GameState>("idle");

const cardHistory = ref<CardGuess[]>([]);

onMounted(async () => {
    await cards.refresh();
});
</script>

<template>
    <div class="grid gap-2 text-3xl">
        <h1 v-if="state === 'idle'">
            Deck: {{ JSON.stringify(slug) }}
        </h1>
        <GameRound
            v-model:state="state"
            :cards="cards.data.value"
            class="w-full"
            :time="120"
            @round-end="(h) => cardHistory = h"
        />
        <UButton v-if="state === 'idle'" to="/">
            Back
        </UButton>
        <ul v-if="state === 'idle' && cardHistory.length > 0" class="grid grid-cols-2 gap-1">
            <li
                v-for="(card, index) in cardHistory" :key="index" :class="{
                    'text-green-500': card.correct === true,
                    'text-red-500': card.correct === false,
                    'text-gray-500': card.correct === null,
                }"
            >
                {{ card.card }}
            </li>
        </ul>
    </div>
</template>
