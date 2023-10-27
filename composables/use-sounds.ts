import { Howl } from "howler";

export function useSounds() {
    const downer = new Howl({ src: "/sounds/downer-01.mp3" });
    const rise = new Howl({ src: "/sounds/rise-03.mp3" });

    return {
        downer,
        rise,
    };
}
