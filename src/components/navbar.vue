<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePixelTransition } from '../composables/usePixelTransition'

const router = useRouter()
const route = useRoute()
const { triggerPixelTransition } = usePixelTransition()

const emit = defineEmits<{
    (e: 'open-section', section: string): void
}>()

const isMenuOpen = ref(false)

const handleNavClick = (section: string) => {
    isMenuOpen.value = false
    emit('open-section', section)
}

const navigateToRoute = (path: string) => {
    isMenuOpen.value = false
    if (route.path === path) return
    triggerPixelTransition(async () => {
        await router.push(path)
    })
}
</script>

<template>
    <header class="navbar-wrapper">
        <nav class="navigation">
            <!-- Brand Link matching [ ISLADJAN.COM ] -->
            <a href="/" class="bracket-btn brand-link" @click.prevent="navigateToRoute('/')">
                <img src="/Star.svg" alt="Star Logo" class="brand-star" />
                <span class="brand-text">[ IMANHAKIMI.COM ]</span>
            </a>

            <!-- Right Side Navigation -->
            <div class="nav-links">
                <button class="bracket-btn" @click="handleNavClick('about')">
                    [ ABOUT_ME ]
                </button>
                <button class="bracket-btn" @click="handleNavClick('projects')">
                    [ MY_WORK ]
                </button>
                <button class="bracket-btn" @click="handleNavClick('contact')">
                    [ CONTACT ]
                </button>
                <a
                    href="mailto:hakimiiman342ab@gmail.com"
                    class="bracket-btn bordered highlight-link"
                >
                    [ HIRE ME ]
                </a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button
                class="bracket-btn mobile-toggle"
                @click="isMenuOpen = !isMenuOpen"
            >
                [ {{ isMenuOpen ? 'CLOSE' : 'MENU' }} ]
            </button>
        </nav>

        <!-- Mobile Drawer -->
        <div v-if="isMenuOpen" class="mobile-drawer">
            <button class="bracket-btn mobile-item" @click="handleNavClick('about')">
                → ABOUT_ME
            </button>
            <button class="bracket-btn mobile-item" @click="handleNavClick('projects')">
                → MY_WORK
            </button>
            <button class="bracket-btn mobile-item" @click="handleNavClick('experience')">
                → EXPERIENCE
            </button>
            <button class="bracket-btn mobile-item" @click="handleNavClick('contact')">
                → CONTACT
            </button>
            <a href="mailto:hakimiiman342ab@gmail.com" class="bracket-btn mobile-item highlight-link">
                → HIRE ME (EMAIL)
            </a>
        </div>
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
    max-width: 1400px;
    margin: 0 auto;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 700;
}

.brand-star {
    width: 20px;
    height: 20px;
    display: inline-block;
    transition: transform 0.4s ease;
}

.brand-link:hover .brand-star {
    transform: rotate(90deg);
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 12px;
}

.highlight-link {
    background-color: var(--tape-red);
    color: #000000;
    border: 1px solid #000000;
    font-weight: 700;
}

.highlight-link:hover {
    background-color: #000000;
    color: #ffffff;
}

.mobile-toggle {
    display: none;
    font-weight: 700;
}

.mobile-drawer {
    display: none;
    flex-direction: column;
    padding: 16px 24px;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    gap: 8px;
}

.mobile-item {
    font-size: 1rem;
    padding: 8px;
    text-align: left;
    width: 100%;
}

@media (max-width: 820px) {
    .nav-links {
        display: none;
    }
    .mobile-toggle {
        display: block;
    }
    .mobile-drawer {
        display: flex;
    }
}
</style>
