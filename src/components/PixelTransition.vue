<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { usePixelTransition } from '../composables/usePixelTransition'

export interface PixelTile {
    id: number
    row: number
    col: number
    color: string
    isRed: boolean
}

const { registerListener, setTransitioning } = usePixelTransition()

// Structured 2D Array data structure & flattened list
const pixelGrid = ref<PixelTile[][]>([])
const tiles = ref<PixelTile[]>([])
const gridCols = ref(16)
const gridRows = ref(12)

const containerRef = ref<HTMLElement | null>(null)
const isActive = ref(false)
let unregister: (() => void) | null = null
let resizeTimer: number | null = null

// Dynamically compute the grid data structure based on viewport dimensions
const buildPixelGrid = () => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight

    // Responsive square pixel tile sizing:
    // ~28px on small mobile, ~36px on tablet, ~42px on desktop for crisp retro 8-bit chunky look
    let targetSize = 42
    if (width < 480) {
        targetSize = 28
    } else if (width < 768) {
        targetSize = 34
    }

    const cols = Math.ceil(width / targetSize)
    const rows = Math.ceil(height / targetSize)

    const gridData: PixelTile[][] = []
    const flatData: PixelTile[] = []

    let id = 0
    for (let r = 0; r < rows; r++) {
        const rowItems: PixelTile[] = []
        for (let c = 0; c < cols; c++) {
            // Retro 8-bit checkered pattern with #ed0707 red and #000000 black
            const isRed = (r + c + (r % 2 === 0 ? 0 : 1)) % 2 === 0
            const tile: PixelTile = {
                id: id++,
                row: r,
                col: c,
                color: isRed ? '#ed0707' : '#000000',
                isRed,
            }
            rowItems.push(tile)
            flatData.push(tile)
        }
        gridData.push(rowItems)
    }

    gridCols.value = cols
    gridRows.value = rows
    pixelGrid.value = gridData
    tiles.value = flatData
}

const handleResize = () => {
    if (resizeTimer) window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
        buildPixelGrid()
    }, 120)
}

const runTransition = (callback?: () => void | Promise<void>) => {
    if (!containerRef.value) {
        if (callback) callback()
        setTransitioning(false)
        return
    }

    isActive.value = true
    const tileElements = containerRef.value.querySelectorAll('.pixel-tile')

    // Kill any active tweens on container or tiles
    gsap.killTweensOf(containerRef.value)
    gsap.killTweensOf(tileElements)

    const tl = gsap.timeline()

    // 1. Shake effect using GSAP: Rapid violent CRT glitch tremor
    tl.to(
        containerRef.value,
        {
            x: () => gsap.utils.random(-10, 10),
            y: () => gsap.utils.random(-8, 8),
            duration: 0.04,
            repeat: 7,
            yoyo: true,
            ease: 'none',
        },
        0
    )

    // 2. Full pixels scale in with 8-bit random stagger
    // Scale 1.08 ensures seamless solid screen coverage without subpixel rounding lines
    tl.fromTo(
        tileElements,
        { scale: 0, opacity: 0 },
        {
            scale: 1.08,
            opacity: 1,
            duration: 0.22,
            ease: 'power2.inOut',
            stagger: {
                amount: 0.26,
                from: 'random',
                grid: [gridRows.value, gridCols.value],
            },
        },
        0
    )

    // Reset container offset after shake
    tl.set(containerRef.value, { x: 0, y: 0 })

    // 3. Trigger screen/modal/route change while pixels fully cover screen
    tl.add(async () => {
        if (callback) {
            try {
                await callback()
            } catch (err) {
                console.error('Error during pixel transition callback:', err)
            }
        }
    })

    // Brief impact hold
    tl.to({}, { duration: 0.06 })

    // 4. Secondary exit shake effect as pixels break apart and dissolve
    tl.to(containerRef.value, {
        x: () => gsap.utils.random(-6, 6),
        y: () => gsap.utils.random(-5, 5),
        duration: 0.035,
        repeat: 5,
        yoyo: true,
        ease: 'none',
    })

    // 5. Pixels dissolve out
    tl.to(
        tileElements,
        {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.inOut',
            stagger: {
                amount: 0.24,
                from: 'random',
                grid: [gridRows.value, gridCols.value],
            },
            onComplete: () => {
                gsap.set(containerRef.value, { x: 0, y: 0 })
                isActive.value = false
                setTransitioning(false)
            },
        },
        '-=0.12'
    )
}

onMounted(() => {
    buildPixelGrid()
    window.addEventListener('resize', handleResize)
    unregister = registerListener(runTransition)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (unregister) unregister()
})
</script>

<template>
    <div
        ref="containerRef"
        class="pixel-transition-overlay"
        :class="{ active: isActive }"
        :style="{
            '--cols': gridCols,
            '--rows': gridRows,
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
    /* -20px inset ensures GSAP container shaking never exposes edge gaps */
    inset: -20px;
    width: calc(100vw + 40px);
    height: calc(100dvh + 40px);
    z-index: 99999;
    pointer-events: none;
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    overflow: hidden;
    will-change: transform;
}

.pixel-transition-overlay.active {
    pointer-events: all;
}

.pixel-tile {
    width: 100%;
    height: 100%;
    transform: scale(0);
    opacity: 0;
    will-change: transform, opacity;
}
</style>
