<script setup lang="ts">

// Types

export type GameState = "idle" | "playing";
export type CardGuess = {
    card: string
    correct: boolean | null
};

// Props, Emits, Model

const props = defineProps<{
    state: GameState
    cards: string[] | null
    time: number
}>();
const emit = defineEmits<{
    (e: "update:state", v: GameState): void
    (e: "roundEnd", v: CardGuess[]): void
}>();
const state = useVModel(props, "state", emit);

// Refs

const cardHistory = ref<CardGuess[]>([]);
const cardIndex = useCounter(0);
const countdown = useCounter(props.time, { min: 0 });
const interval = useIntervalFn(() => countdown.dec(), 1000, { immediate: false, immediateCallback: false });
const randomCards = ref<string[]>([]);

// Watch countdown & cardIndex

watch([countdown.count, cardIndex.count], () => {
    // If no more time
    if (countdown.count.value <= 0)
        endRound();

    // If no more cards
    if (cardIndex.count.value > randomCards.value.length - 1)
        endRound();
});

/** Commit guess to history */
function commitGuess(guess: boolean | null) {
    // Skip if no more cards
    if (cardIndex.count.value > randomCards.value.length - 1)
        return;

    // Commit guess
    cardHistory.value.push({ card: randomCards.value[cardIndex.count.value], correct: guess });

    // Increment card index
    cardIndex.inc();
}

// Methods

function startRound() {
    // Shuffle cards
    shuffleCards();

    // Reset counters & history
    cardIndex.reset();
    countdown.reset();
    cardHistory.value = [];

    // Set state
    state.value = "playing";

    // Start interval
    interval.resume();
}
function endRound() {
    // Pause interval
    interval.pause();

    // Commit last card to history
    commitGuess(null);

    // Emit roundEnd
    emit("roundEnd", cardHistory.value);

    // Reset state
    state.value = "idle";
}
function shuffleCards() {
    randomCards.value = useShuffle(props.cards);
}

onMounted(() => {
    // Set default state
    state.value = "idle";
});
</script>

<template>
    <UButton
        v-bind="$attrs"
        class="w-full"
        :loading="props.cards == null || props.cards.length === 0"
        @click="startRound()"
    >
        Start
    </UButton>
    <UModal class="grid gap-2 text-3xl" fullscreen :model-value="state === 'playing'" :transition="false">
        <span>{{ countdown.count }}</span>
        <span> {{ randomCards[cardIndex.count.value] }}</span>
        <UButton class="h-[20vh]" color="green" @click="commitGuess(true)">
            Correct
        </UButton>
        <UButton class="h-[20vh]" color="red" @click="commitGuess(false)">
            Wrong
        </UButton>
        <UButton color="gray" @click="endRound">
            End
        </UButton>
    </UModal>
</template>
