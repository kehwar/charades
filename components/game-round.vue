<script setup lang="ts">
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

const { vibrate } = useVibrate();
const cardHistory = ref<CardGuess[]>([]);
const cardIndex = useCounter(0);
const countdown = useCounter(props.time, { min: 0 });
const el = ref<HTMLElement | null>(null);
const fullscreen = useFullscreen(el);
const interval = useIntervalFn(() => countdown.dec(), 1000, { immediate: false, immediateCallback: false });
const orientation = useScreenOrientation();
const randomCards = ref<string[]>([]);
const tilt = useTilt();
const wakeLock = useWakeLock();

// Watchers

/** Watch countdown & card index */
watch([countdown.count, cardIndex.count], () => {
    // If no more time
    if (countdown.count.value <= 0)
        endRound();

    // If no more cards
    if (cardIndex.count.value > randomCards.value.length - 1)
        endRound();
});
watch(tilt, () => {
    if (state.value === "playing")
        commitGuessByMotion();
});

// Methods

/** Commit guess to history */
function commitGuess(guess: boolean | null) {
    // Skip if no more cards
    if (cardIndex.count.value > randomCards.value.length - 1)
        return;

    // Commit guess
    cardHistory.value.push({ card: randomCards.value[cardIndex.count.value], correct: guess });

    // Feedback
    if (guess != null)
        vibrate(guess ? [100] : [100, 50, 100]);

    // Increment card index
    cardIndex.inc();
}

function startRound() {
    // Shuffle cards
    shuffleCards();

    // Reset counters & history
    cardIndex.reset();
    countdown.reset();
    cardHistory.value = [];

    // Set state
    state.value = "playing";

    // Lock screen
    fullscreen.enter();
    orientation.lockOrientation("landscape");
    wakeLock.request("screen");
    vibrate([100]);

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

    // Release screen
    orientation.unlockOrientation();
    fullscreen.exit();
    wakeLock.release();
}
function shuffleCards() {
    randomCards.value = useShuffle(props.cards);
}
const commitGuessByMotion = useThrottleFn(
    () => {
        if (tilt.value === "upwards")
            commitGuess(false);
        else if (tilt.value === "downwards")
            commitGuess(true);
    },
    500,
);

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
    <UModal fullscreen :model-value="state === 'playing'" :transition="false">
        <div ref="el" class="grid gap-2 text-3xl">
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
        </div>
    </UModal>
</template>
