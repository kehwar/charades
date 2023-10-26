<script setup lang="ts">
const color = useColorMode();
onMounted(() => {
    color.forced = true;
    color.preference = "light";
    color.value = "light";
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
