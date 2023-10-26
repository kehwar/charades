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
const showCorrectOverlay = ref(false);
const showPassOverlay = ref(false);
const tilt = useTilt();
const wakeLock = useWakeLock();

// Computed

const cardLabel = computed(() => {
    const raw = randomCards.value[cardIndex.count.value];
    return raw?.split(/ - /gm) ?? [""];
});

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
function _commitGuess(guess: boolean | null) {
    // Skip if no more cards
    if (cardIndex.count.value > randomCards.value.length - 1)
        return;

    // Commit guess
    cardHistory.value.push({ card: randomCards.value[cardIndex.count.value] as any, correct: guess });

    // Feedback
    if (guess != null) {
        // Vibrate
        vibrate(guess ? [100] : [100, 50, 100]);

        // Show overlay
        if (guess === true) {
            showCorrectOverlay.value = true;
            setTimeout(() => showCorrectOverlay.value = false, 500);
        }
        else if (guess === false) {
            showPassOverlay.value = true;
            setTimeout(() => showPassOverlay.value = false, 500);
        }
    }

    // Increment card index
    cardIndex.inc();
}
const commitGuess = useThrottleFn(_commitGuess, 500);

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
function commitGuessByMotion() {
    if (tilt.value === "upwards")
        commitGuess(false);
    else if (tilt.value === "downwards")
        commitGuess(true);
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
    <UModal fullscreen :model-value="state === 'playing'" :transition="false">
        <div
            ref="el"
            class="relative h-full w-full bg-blue-600"
        >
            <!-- Countdown -->
            <span
                class="absolute left-1/2 top-6 h-fit -translate-x-1/2 text-2xl font-extrabold text-orange-400"
            >
                {{ countdown.count }}'
            </span>
            <!-- Card label -->
            <div
                class="absolute left-1/2 top-1/2 grid w-10/12 -translate-x-1/2 -translate-y-1/2 gap-6 px-10 text-center text-6xl font-bold text-white"
            >
                <span
                    v-for="(label, index) in cardLabel"
                    :key="index"
                    class="w-full overflow-hidden break-words"
                    :class="{ '!text-3xl': index > 0 }"
                >
                    {{ label }}
                </span>
            </div>
            <!-- Correct button -->
            <UButton
                v-if="isDevelopment"
                class="absolute left-6 top-1/2 flex h-20 w-20 -translate-y-1/2 place-content-center rounded-full border-none bg-black/10 text-white/50 [&_span]:h-10 [&_span]:w-10"
                color="gray"
                icon="i-mdi-check"
                variant="ghost"
                @click="commitGuess(true)"
            />
            <!-- Pass button -->
            <UButton
                v-if="isDevelopment"
                class="absolute right-6 top-1/2 flex h-20 w-20 -translate-y-1/2 place-content-center rounded-full border-none bg-black/10 text-white/50 [&_span]:h-10 [&_span]:w-10"
                color="gray"
                icon="i-mdi-arrow-right"
                variant="ghost"
                @click="commitGuess(false)"
            />
            <!-- Correct feedback overlay -->
            <template v-if="showCorrectOverlay">
                <div class="absolute h-full w-full bg-cyan-500" />
                <span
                    class="absolute top-1/2 w-full -translate-y-1/2 px-10 text-center text-6xl font-bold text-white"
                >
                    Correct
                </span>
            </template>
            <!-- Pass feedback overlay -->
            <template v-if="showPassOverlay">
                <div class="absolute h-full w-full bg-red-400" />
                <span
                    class="absolute top-1/2 w-full -translate-y-1/2 px-10 text-center text-6xl font-bold text-white"
                >
                    Pass
                </span>
            </template>
            <!-- Close button -->
            <UButton
                class="absolute left-4 top-4 flex h-10 w-10 place-content-center rounded-full border-none bg-black/20 text-white"
                color="gray"
                icon="i-mdi-close"
                variant="ghost"
                @click="endRound"
            />
        </div>
    </UModal>
</template>
