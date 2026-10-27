<script setup lang="ts">
import Navbar from '../components/navbar.vue'
import modelDisplay from '../components/modelDisplay.vue'
</script>

<template>
    <div class="gallery-page">
        <Navbar />

        <main class="gallery-container">
            <header class="page-header">
                <span class="tape-red header-tag">INTERACTIVE 3D & SHADERS</span>
                <h1 class="page-title">DIGITAL GALLERY & EXPERIMENTS</h1>
                <p class="page-subtitle">
                    Real-time WebGL graphics, custom GLSL dither shaders, and tactile 3D models developed with Three.js & TresJS.
                </p>
            </header>

            <div class="canvas-showcase">
                <div class="canvas-window">
                    <div class="canvas-header">
                        <span class="tape-black">[ THREE.JS // WEBGL DITHER VIEWPORT ]</span>
                        <span class="fps-badge">60 FPS</span>
                    </div>
                    <div class="canvas-mount">
                        <modelDisplay />
                    </div>
                </div>
            </div>

            <div class="gallery-links">
                <a href="/" class="bracket-btn bordered highlight">[ ← RETURN TO MAIN TERMINAL ]</a>
                <a href="/projects" class="bracket-btn bordered">[ EXPLORE ALL PROJECTS → ]</a>
                <a href="/about" class="bracket-btn bordered">[ ABOUT THE ARCHITECT ]</a>
            </div>
        </main>
    </div>
</template>

<style scoped>
.gallery-page {
    min-height: 100vh;
    background-color: var(--bg-color);
    padding-top: 65px;
    padding-bottom: 60px;
}

.gallery-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(16px, 4vw, 36px);
}

.page-header {
    margin-bottom: 28px;
}

.header-tag {
    font-size: 0.8rem;
    margin-bottom: 10px;
}

.page-title {
    font-family: var(--font-pixel);
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    margin: 10px 0 6px 0;
    line-height: 1.2;
}

.page-subtitle {
    font-family: var(--font-tech);
    font-size: clamp(0.85rem, 2vw, 1.05rem);
    color: var(--ink-dim);
    margin: 0;
}

.canvas-showcase {
    margin-bottom: 32px;
}

.canvas-window {
    background: #dfdfdf;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #000000;
    overflow: hidden;
}

.canvas-header {
    background: #000000;
    color: #ffffff;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.85rem;
}

.canvas-mount {
    position: relative;
    width: 100%;
    height: clamp(350px, 50vh, 550px);
    background: #dfdfdf;
    overflow: hidden;
}

.fps-badge {
    color: #00ff66;
    font-weight: 700;
}

.gallery-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.bracket-btn.highlight {
    background-color: var(--tape-red);
    color: #000000;
}
</style>
