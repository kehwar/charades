export function useTilt(thresshold: number = 60) {
    const { beta, gamma } = useDeviceOrientation();
    return computed(() => {
        if (beta.value == null || gamma.value == null)
            return null;
        if (Math.abs(gamma.value) < thresshold)
            return Math.abs(beta.value) < 90 ? "upwards" : "downwards";
        else
            return "straight";
    });
}
