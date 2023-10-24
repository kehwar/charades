<script setup lang="ts">
import _ from "lodash";
import { joinURL } from "ufo";

const route = useRoute();

const slug = computed(() => (route.params as any).slug as string);

const cards = useFetch<string[]>(joinURL("/decks/en", `${slug.value}.json`), { immediate: false });

const randomCards = ref<string[]>([]);

const countdown = useCounter(120, { min: 0 });

const interval = useIntervalFn(() => countdown.dec(), 1000, { immediate: false, immediateCallback: false });

const cardIndex = useCounter(0);

const cardHistory = ref<{
    card: string
    correct: boolean
}[]>([]);

watch([countdown.count, cardIndex.count], () => {
    if (countdown.count.value <= 0)
        endRound();
    if (cardIndex.count.value > randomCards.value.length - 1)
        endRound();
});

function correctAction() {
    cardHistory.value.push({ card: randomCards.value[cardIndex.count.value], correct: true });
    cardIndex.inc();
};
function wrongAction() {
    cardHistory.value.push({ card: randomCards.value[cardIndex.count.value], correct: false });
    cardIndex.inc();
};
function startRound() {
    cardIndex.reset();
    countdown.reset();
    cardHistory.value = [];
    shuffleCards();
    interval.resume();
}
function endRound() {
    interval.pause();
}
function shuffleCards() {
    randomCards.value = _.shuffle(cards.data.value);
}

onMounted(async () => {
    await cards.refresh();
});
</script>

<template>
    <div v-if="!interval.isActive.value" class="grid gap-2 text-3xl">
        <h1>Deck: {{ JSON.stringify(slug) }}</h1>
        <UButton :loading="cards.status.value !== 'success'" @click="startRound()">
            Start
        </UButton>
        <UButton to="/">
            Back
        </UButton>
        <ul v-if="cardHistory.length > 0" class="grid grid-cols-2 gap-1">
            <li
                v-for="(card, index) in cardHistory" :key="index" :class="{
                    'text-green-500': card.correct,
                    'text-red-500': !card.correct,
                }"
            >
                {{ card.card }}
            </li>
        </ul>
    </div>
    <div v-if="interval.isActive.value" class="grid gap-2 text-3xl">
        <span>{{ countdown.count }}</span>
        <span> {{ randomCards[cardIndex.count.value] }}</span>
        <UButton class="h-[20vh]" color="green" @click="correctAction">
            Correct
        </UButton>
        <UButton class="h-[20vh]" color="red" @click="wrongAction">
            Wrong
        </UButton>
        <UButton color="gray" @click="endRound">
            End
        </UButton>
    </div>
</template>
