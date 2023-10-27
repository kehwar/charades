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
    <div>
        <UContainer>
            <NuxtPage />
        </UContainer>
        <UNotifications />
    </div>
</template>
