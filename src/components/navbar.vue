<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { usePixelTransition } from '../composables/usePixelTransition'

const router = useRouter()
const route = useRoute()
const { triggerPixelTransition } = usePixelTransition()

const navigateToRoute = (path: string) => {
    if (route.path === path) return
    triggerPixelTransition(async () => {
        await router.push(path)
    })
}
</script>

<template>
    <header class="navbar-wrapper">
        <nav class="navigation">
            <!-- Brand Link / Logo -->
            <a href="/" class="bracket-btn brand-link" @click.prevent="navigateToRoute('/')">
                <img src="/Star.svg" alt="Star Logo" class="brand-star" />
                <span class="brand-text">[ IMANHAKIMI.COM ]</span>
            </a>
        </nav>
    </header>
</template>

<style scoped>
.navbar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
}

.navigation {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 10px clamp(12px, 3vw, 24px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.brand-link {
    display: inline-flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
    font-size: clamp(0.76rem, 3.2vw, 0.95rem);
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
    padding: 4px 6px;
}

.brand-star {
    width: clamp(16px, 3.5vw, 20px);
    height: clamp(16px, 3.5vw, 20px);
    display: inline-block;
    flex-shrink: 0;
    transition: transform 0.4s ease;
}

.brand-link:hover .brand-star {
    transform: rotate(90deg);
}

.brand-text {
    overflow: hidden;
    text-overflow: ellipsis;
}

.highlight-link {
    background-color: var(--tape-red);
    color: #000000;
    border: 1px solid #000000;
    font-weight: 700;
    font-size: clamp(0.75rem, 2.8vw, 0.88rem);
    padding: 4px clamp(8px, 2vw, 12px);
    white-space: nowrap;
}

.highlight-link:hover {
    background-color: #000000;
    color: #ffffff;
}
</style>
