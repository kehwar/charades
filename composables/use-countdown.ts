export function useCountdown(time: MaybeRef<number>, callback?: (count: number) => void) {
    const counter = useCounter(unref(time) + 1, { min: 0 });
    const { count, reset } = counter;
    const interval = useIntervalFn(() => {
        counter.dec();
        if (callback)
            callback(count.value);
    }, 1000, { immediate: false, immediateCallback: true });
    const { pause, resume, isActive } = interval;
    return {
        count,
        reset,
        pause,
        resume,
        isActive,
        counter,
        interval,
    };
}
