<script setup lang="ts">
import _ from "lodash";

const route = useRoute();
const slug = (route.params as any).deck as string;
const deck = useDeckStore().decks[slug];
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

function deleteDeck() {
    useDeckStore().deleteDeck(slug);
    navigateTo({ name: "index" });
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
            <span>Cards: {{ parsedCards.length }}</span>
            <UTextarea v-model="cards" class="border" resize :rows="10" variant="none" />
            <UButton :to="{ name: 'deck-deck', params: { deck: slug } }">
                Return
            </UButton>
            <UButton @click="cards = parsedCards.join('\n')">
                Clean
            </UButton>
            <UButton @click="deleteDeck()">
                Delete
            </UButton>
            <UButton @click="useCopyToClipboard().copy(JSON.stringify({ name: deck.name, cards: deck.cards }, null, 2), { title: 'JSON Copied' })">
                Copy JSON
            </UButton>
        </div>
    </UCard>
</template>
