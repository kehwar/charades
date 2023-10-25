const { gamma } = useDeviceOrientation();

export function useTilt(){
    return computed(() => {
        const thresshold = 60;
        if (gamma.value == null)
            return null;
        if (gamma.value > 0 && gamma.value < thresshold)
            return "upwards";
        else if (gamma.value > -thresshold && gamma.value < 0)
            return "downwards";
        else
            return "straight";
    });
}
