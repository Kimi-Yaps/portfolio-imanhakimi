import { ref } from 'vue'
import { gsap } from 'gsap'

const isTransitioning = ref(false)

type TransitionCallback = () => void | Promise<void>
let listeners: Array<(callback?: TransitionCallback) => void> = []

export function usePixelTransition() {
    const triggerPixelTransition = (callback?: TransitionCallback) => {
        if (isTransitioning.value) return
        isTransitioning.value = true
        for (const listener of listeners) {
            listener(callback)
        }
    }

    const registerListener = (fn: (callback?: TransitionCallback) => void) => {
        listeners.push(fn)
        return () => {
            listeners = listeners.filter((l) => l !== fn)
        }
    }

    const setTransitioning = (val: boolean) => {
        isTransitioning.value = val
    }

    return {
        isTransitioning,
        triggerPixelTransition,
        registerListener,
        setTransitioning,
    }
}
