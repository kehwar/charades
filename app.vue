<script setup lang="ts">
import { useDeckStore } from "./composables/use-deck-store";

const color = useColorMode();
onMounted(() => {
    color.forced = true;
    color.preference = "light";
    color.value = "light";
    useDeckStore().fetchDecks();
});
</script>

<template>
    <div class="h-full">
        <UContainer class="h-full py-4">
            <NuxtPage />
        </UContainer>
        <UNotifications />
    </div>
</template>

<style>
html, #__nuxt, body {
    @apply h-full
}
</style>
