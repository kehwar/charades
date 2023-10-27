export function useCountdown(time: MaybeRef<number>) {
    const counter = useCounter(time, { min: 0 });
    const { count, reset } = counter;
    const interval = useIntervalFn(() => counter.dec(), 1000, { immediate: false, immediateCallback: false });
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
