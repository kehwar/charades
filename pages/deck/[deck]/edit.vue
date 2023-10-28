<script setup lang="ts">
import _ from "lodash";

const route = useRoute();
const slug = (route.params as any).deck as string;
const deck = useDeckStore().readDeck(slug);
if (deck == null)
    throw createError("Deck doesn't exist");

const cards = ref(deck.cards.join("\n"));
const parsedCards = computed(() => {
    return _
        .chain(cards.value)
        .split(/\r?\n/)
        .map((card) => card.trim())
        .filter((card) => card !== "")
        .uniqBy((card) => _.deburr(card).toLowerCase())
        .sortBy((card) => _.deburr(card).toLowerCase())
        .value();
});
watch(parsedCards, (value) => deck.cards = value);
function cleanCards() {
    cards.value = parsedCards.value.join("\n");
    useToast().add({ title: "Cards cleaned", timeout: 1000 });
}
</script>

<template>
    <UCard
        class="h-full"
    >
        <template #header>
            <UInput v-model="deck.name" size="xl" />
        </template>
        <div class="flex h-full flex-col gap-2">
            <UTextarea v-model="cards" class="border" resize :rows="15" variant="none" />
            <div class="flex gap-2">
                <UBadge size="lg">
                    {{ parsedCards.length }} cards
                </UBadge>
                <UButton
                    class="w-[6rem]"
                    icon="i-heroicons-sparkles"
                    @click="cleanCards()"
                >
                    Clean
                </UButton>
                <UButton
                    class="w-[6rem]"
                    icon="i-heroicons-arrow-left-on-rectangle"
                    :to="{ name: 'deck-deck', params: { deck: slug } }"
                >
                    Return
                </UButton>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between gap-2 overflow-auto">
                <div class="flex flex-wrap gap-2">
                    <UButton
                        class="w-[6rem]"
                        icon="i-heroicons-sparkles"
                        @click="cleanCards()"
                    >
                        Clean
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
                        class="w-[6rem]"
                        icon="i-heroicons-arrow-left-on-rectangle"
                        :to="{ name: 'deck-deck', params: { deck: slug } }"
                    >
                        Return
                    </UButton>
                </div>
            </div>
        </template>
    </UCard>
</template>
