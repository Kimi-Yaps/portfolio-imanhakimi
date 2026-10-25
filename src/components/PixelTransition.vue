<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { usePixelTransition } from '../composables/usePixelTransition'

const { registerListener, setTransitioning } = usePixelTransition()

const COLS = 16
const ROWS = 12
const totalTiles = COLS * ROWS

// Alternating retro tiles matching the reference image (#ed0707 red, #000000 black)
const tiles = Array.from({ length: totalTiles }, (_, index) => {
    const isRed = (index * 7 + 3) % 2 === 0
    return {
        id: index,
        color: isRed ? '#ed0707' : '#000000',
    }
})

const containerRef = ref<HTMLElement | null>(null)
const isActive = ref(false)
let unregister: (() => void) | null = null

const runTransition = (callback?: () => void | Promise<void>) => {
    if (!containerRef.value) {
        if (callback) callback()
        setTransitioning(false)
        return
    }

    isActive.value = true
    const tileElements = containerRef.value.querySelectorAll('.pixel-tile')

    // Phase 1: Pixels expand with 8-bit dissolve
    gsap.fromTo(
        tileElements,
        { scale: 0, opacity: 0 },
        {
            scale: 1.02,
            opacity: 1,
            duration: 0.22,
            ease: 'power2.inOut',
            stagger: {
                amount: 0.28,
                from: 'random',
                grid: [ROWS, COLS],
            },
            onComplete: async () => {
                if (callback) {
                    try {
                        await callback()
                    } catch (err) {
                        console.error('Error during pixel transition callback:', err)
                    }
                }

                // Phase 2: Pixels dissolve away
                gsap.to(tileElements, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.22,
                    delay: 0.05,
                    ease: 'power2.inOut',
                    stagger: {
                        amount: 0.28,
                        from: 'random',
                        grid: [ROWS, COLS],
                    },
                    onComplete: () => {
                        isActive.value = false
                        setTransitioning(false)
                    },
                })
            },
        },
    )
}

onMounted(() => {
    unregister = registerListener(runTransition)
})

onUnmounted(() => {
    if (unregister) unregister()
})
</script>

<template>
    <div
        ref="containerRef"
        class="pixel-transition-overlay"
        :class="{ active: isActive }"
        :style="{
            '--cols': COLS,
            '--rows': ROWS,
        }"
    >
        <div
            v-for="tile in tiles"
            :key="tile.id"
            class="pixel-tile"
            :style="{ backgroundColor: tile.color }"
        />
    </div>
</template>

<style scoped>
.pixel-transition-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    pointer-events: none;
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
}

.pixel-transition-overlay.active {
    pointer-events: all;
}

.pixel-tile {
    width: 100%;
    height: 100%;
    transform: scale(0);
    opacity: 0;
}
</style>
