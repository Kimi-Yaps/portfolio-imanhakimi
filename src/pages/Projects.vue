<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from '../components/navbar.vue'
import modelDisplay from '../components/modelDisplay.vue'
import { usePortfolioData, type ProjectItem } from '../composables/usePortfolioData'

const { projects, getTechIcon, loadData } = usePortfolioData()

type FilterKey = 'all' | 'web' | 'cloud-security' | 'event' | '3d'
const activeFilter = ref<FilterKey>('all')
const selectedProject = ref<ProjectItem | null>(null)

onMounted(async () => {
    await loadData()
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedProject.value) {
        selectedProject.value = null
    }
}

const openDetails = (p: ProjectItem) => {
    selectedProject.value = p
}

const closeDetails = () => {
    selectedProject.value = null
}

const filteredProjects = computed(() => {
    if (activeFilter.value === 'all') return projects.value
    return projects.value.filter(p => {
        if (activeFilter.value === 'web') return p.category === 'web'
        if (activeFilter.value === 'cloud-security') return p.category === 'cloud' || p.category === 'security'
        if (activeFilter.value === 'event') return p.category === 'event'
        if (activeFilter.value === '3d') return p.category === '3d' || !!p.modelPath
        return true
    })
})

const getCategoryCount = (key: FilterKey): number => {
    if (key === 'all') return projects.value.length
    return projects.value.filter(p => {
        if (key === 'web') return p.category === 'web'
        if (key === 'cloud-security') return p.category === 'cloud' || p.category === 'security'
        if (key === 'event') return p.category === 'event'
        if (key === '3d') return p.category === '3d' || !!p.modelPath
        return true
    }).length
}

const is3DModel = (p: ProjectItem | null): boolean => {
    if (!p) return false
    return p.category === '3d' || !!p.modelPath
}
</script>

<template>
    <div class="projects-page">
        <Navbar />

        <main class="projects-wrapper">
            <!-- Header -->
            <header class="page-header">
                <span class="highlight-orange header-tag">ENGINEERING PORTFOLIO</span>
                <h1 class="page-title">MY WORK &amp; PROJECTS</h1>
                <p class="page-desc">
                    A curated archive of full-stack platforms, cloud AI systems, cybersecurity solutions, hackathon achievements, and interactive 3D assets.
                </p>
            </header>

            <!-- Category Filter Bar (Displayed First) -->
            <nav class="project-filter-bar" aria-label="Project category filters">
                <button 
                    class="bracket-btn filter-btn" 
                    :class="{ active: activeFilter === 'all' }"
                    @click="activeFilter = 'all'"
                >
                    [ ALL ({{ getCategoryCount('all') }}) ]
                </button>
                <button 
                    class="bracket-btn filter-btn" 
                    :class="{ active: activeFilter === 'web' }"
                    @click="activeFilter = 'web'"
                >
                    [ 🌐 WEB APPS ({{ getCategoryCount('web') }}) ]
                </button>
                <button 
                    class="bracket-btn filter-btn" 
                    :class="{ active: activeFilter === 'cloud-security' }"
                    @click="activeFilter = 'cloud-security'"
                >
                    [ ☁️ CLOUD AI &amp; SECURITY ({{ getCategoryCount('cloud-security') }}) ]
                </button>
                <button 
                    class="bracket-btn filter-btn" 
                    :class="{ active: activeFilter === 'event' }"
                    @click="activeFilter = 'event'"
                >
                    [ 🏆 HACKATHONS ({{ getCategoryCount('event') }}) ]
                </button>
                <button 
                    class="bracket-btn filter-btn" 
                    :class="{ active: activeFilter === '3d' }"
                    @click="activeFilter = '3d'"
                >
                    [ ❖ 3D ASSETS ({{ getCategoryCount('3d') }}) ]
                </button>
            </nav>

            <!-- Projects Grid: Scannable Glimpse of Title & Icons -->
            <section class="projects-grid" aria-label="Projects and case studies">
                <article
                    v-for="(p, idx) in filteredProjects"
                    :key="p.id || idx"
                    class="project-glimpse-card"
                    @click="openDetails(p)"
                >
                    <div class="card-header-row">
                        <span class="highlight-orange badge">{{ p.badge }}</span>
                        <span class="card-index">PROJ_0{{ idx + 1 }}</span>
                    </div>

                    <!-- Visual Banner Preview -->
                    <div class="card-glimpse-media">
                        <template v-if="p.imageUrl">
                            <img 
                                :src="p.imageUrl" 
                                :alt="p.title" 
                                loading="lazy"
                                decoding="async"
                                class="glimpse-img" 
                            />
                        </template>
                        <template v-else-if="is3DModel(p)">
                            <div class="model-banner">
                                <span class="cube-icon">❖</span>
                                <span class="banner-title">INTERACTIVE 3D ASSET</span>
                                <span class="banner-path">{{ p.modelPath || '/Models/mee_sup.glb' }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="blueprint-banner">
                                <span class="blueprint-icon">
                                    {{ p.category === 'security' ? '🛡️' : p.category === 'cloud' ? '⚡' : p.category === 'event' ? '🏆' : '💻' }}
                                </span>
                                <span class="blueprint-tag">ENGINEERING ARCHITECTURE</span>
                            </div>
                        </template>
                    </div>

                    <div class="glimpse-body">
                        <h2 class="project-name">{{ p.title }}</h2>
                        <p class="project-tagline">{{ p.subtitle }}</p>

                        <!-- Glimpse of Tech Icons -->
                        <div class="glimpse-stack-row">
                            <span class="stack-glimpse-label">STACK:</span>
                            <div class="stack-icons-wrap">
                                <span 
                                    v-for="t in p.stack" 
                                    :key="t" 
                                    class="tech-mini-tag"
                                    :title="t"
                                >
                                    <img :src="getTechIcon(t)" :alt="t" class="tech-icon" />
                                    <span class="mini-tag-text">{{ t }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Action Button to View Details -->
                        <div class="card-action-row">
                            <button class="bracket-btn bordered view-details-btn" @click.stop="openDetails(p)">
                                [ VIEW DETAILS → ]
                            </button>
                        </div>
                    </div>
                </article>
            </section>

            <!-- Bottom Return Navigation (No Database / Admin access) -->
            <footer class="projects-bottom-nav">
                <a href="/" class="bracket-btn bordered highlight">[ ← RETURN TO HOME ]</a>
                <a href="/about" class="bracket-btn bordered">[ ABOUT MUHAMMAD IMAN HAKIMI → ]</a>
            </footer>
        </main>

        <!-- ================= DETAIL MODAL / CASE STUDY INSPECTOR ================= -->
        <div 
            v-if="selectedProject" 
            class="modal-backdrop" 
            @click.self="closeDetails"
        >
            <div class="detail-modal-card" role="dialog" aria-modal="true">
                <!-- Modal Topbar -->
                <div class="modal-topbar">
                    <div class="modal-badge-group">
                        <span class="tape-red">{{ selectedProject.badge }}</span>
                        <span v-if="selectedProject.year" class="modal-year">
                            [ {{ selectedProject.year }} ]
                        </span>
                    </div>
                    <button class="bracket-btn close-btn" @click="closeDetails" title="Close (ESC)">
                        [ ✕ CLOSE ]
                    </button>
                </div>

                <div class="modal-scroll-body">
                    <!-- Title & Tagline -->
                    <header class="modal-detail-header">
                        <h2 class="detail-title">{{ selectedProject.title }}</h2>
                        <p class="detail-subtitle">{{ selectedProject.subtitle }}</p>
                    </header>

                    <!-- 3D Interactive Model Viewport (Strictly Contained in Display Box Border) -->
                    <section v-if="is3DModel(selectedProject)" class="viewport-box" aria-label="3D Model Viewer">
                        <div class="viewport-box-header">
                            <span class="tape-black">[ THREE.JS REAL-TIME 3D VIEWPORT ]</span>
                            <span class="asset-path">{{ selectedProject.modelPath || '/Models/mee_sup.glb' }}</span>
                        </div>

                        <!-- Strictly bounded mount: pointer & touch events confined to this container only -->
                        <div class="canvas-mount">
                            <modelDisplay 
                                :contained="true" 
                                :model-path="selectedProject.modelPath || '/Models/mee_sup.glb'"
                                :custom-vertex-shader="selectedProject.vertexShader"
                                :custom-fragment-shader="selectedProject.fragmentShader"
                                :use-custom-shader="selectedProject.customShader"
                            />
                        </div>

                        <div class="viewport-tech-footer">
                            <div class="tech-spec"><span class="spec-label">ENGINE:</span> Three.js / TresJS</div>
                            <div class="tech-spec"><span class="spec-label">COMPRESSION:</span> Google Draco 1.5.6 GLTF</div>
                            <div class="tech-spec"><span class="spec-label">SHADER:</span> {{ selectedProject.customShader ? 'Custom GLSL Shader' : 'Custom Bayer Dither / Ink Stipple' }}</div>
                            <div class="tech-spec"><span class="spec-label">INTERACTION:</span> Drag inside box to rotate</div>
                        </div>
                    </section>

                    <!-- High-Resolution JPG / PNG Image Showcase -->
                    <div v-else-if="selectedProject.imageUrl" class="image-showcase-box">
                        <img 
                            :src="selectedProject.imageUrl" 
                            :alt="selectedProject.title" 
                            loading="lazy"
                            decoding="async"
                            class="full-showcase-img" 
                        />
                    </div>

                    <!-- Comprehensive Project Description -->
                    <div class="detail-section">
                        <h3 class="section-heading">/// PROJECT OVERVIEW &amp; PROBLEM SOLVED</h3>
                        <p class="full-description-text">{{ selectedProject.description }}</p>
                    </div>

                    <!-- Key Highlights & Architecture Bullets -->
                    <div v-if="selectedProject.impact && selectedProject.impact.length" class="detail-section highlights-box">
                        <h3 class="section-heading">/// KEY HIGHLIGHTS &amp; ARCHITECTURE</h3>
                        <ul class="highlights-list">
                            <li v-for="(pt, pIdx) in selectedProject.impact" :key="pIdx" class="highlight-item">
                                <span class="bullet-arrow">▸</span>
                                <span>{{ pt }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Full Tech Stack with Large Icons & Badges -->
                    <div class="detail-section">
                        <h3 class="section-heading">/// TECH STACK &amp; TOOLING</h3>
                        <div class="full-stack-flex">
                            <span v-for="t in selectedProject.stack" :key="t" class="tech-badge-large">
                                <img :src="getTechIcon(t)" :alt="t" class="tech-icon-large" />
                                <span>{{ t }}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Modal Bottom Actions -->
                <div class="modal-footer">
                    <button class="bracket-btn bordered" @click="closeDetails">
                        [ ✕ CLOSE DETAILS ]
                    </button>
                    <a v-if="selectedProject.linkUrl" :href="selectedProject.linkUrl" target="_blank" rel="noopener" class="bracket-btn bordered highlight">
                        [ OPEN REPOSITORY / DEMO ↗ ]
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.projects-page {
    min-height: 100vh;
    background-color: var(--bg-color);
    padding-top: 65px;
    padding-bottom: 70px;
}

.projects-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(16px, 4vw, 36px);
}

.page-header {
    margin-bottom: 24px;
    border-bottom: 2px solid var(--ink-color);
    padding-bottom: 1.5em;
}

.header-tag {
    font-family: var(--font-bebas);
    font-size: 1.1rem;
    margin-bottom: 0.5em;
    display: inline-block;
}

.page-title {
    font-family: var(--font-boxing);
    font-size: clamp(2rem, 5vw, 3.4rem);
    margin: 0 0 0.4em 0;
    line-height: 1;
}

.page-desc {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: #333;
    max-width: 760px;
    line-height: 1.6;
    margin: 0;
}

/* ================= FILTER BAR (FIRST ELEMENT) ================= */
.project-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #000000;
}

.filter-btn {
    border: 1px solid #000000;
    font-size: 0.82rem;
    padding: 6px 14px;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 2px 2px 0px #000000;
    transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.filter-btn:hover {
    background: #000000;
    color: #ffffff;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000000;
}

.filter-btn.active {
    background: #000000;
    color: #ffffff;
    box-shadow: 3px 3px 0px var(--tape-red);
}

/* ================= PROJECTS GRID (GLIMPSE) ================= */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 44px;
}

.project-glimpse-card {
    background-color: var(--bg-card, #dfdfdf);
    border: 2px solid var(--ink-color, #000000);
    box-shadow: 4px 4px 0px var(--ink-color, #000000);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.project-glimpse-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000000;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid #000000;
}

.badge {
    font-family: var(--font-bebas);
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    padding: 2px 6px;
}

.card-index {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
}

/* Glimpse Media Banners */
.card-glimpse-media {
    width: 100%;
    aspect-ratio: 16/9;
    background: #ffffff;
    border-bottom: 1px solid #000000;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.glimpse-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.project-glimpse-card:hover .glimpse-img {
    transform: scale(1.03);
}

.model-banner {
    width: 100%;
    height: 100%;
    background: #141414;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 14px;
}

.cube-icon {
    font-size: 2.2rem;
    color: #00ff66;
    margin-bottom: 4px;
    filter: drop-shadow(0 0 6px #00ff66);
}

.banner-title {
    font-family: var(--font-pixel);
    font-size: 0.82rem;
    letter-spacing: 1px;
}

.banner-path {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: #888888;
    margin-top: 2px;
}

.blueprint-banner {
    width: 100%;
    height: 100%;
    background: #ececec;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 14px;
}

.blueprint-icon {
    font-size: 2rem;
    margin-bottom: 4px;
}

.blueprint-tag {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    color: #555555;
}

/* Glimpse Body */
.glimpse-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.project-name {
    font-family: var(--font-boxing);
    font-size: 1.4rem;
    margin: 0 0 6px 0;
    line-height: 1.15;
}

.project-tagline {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: #444444;
    margin: 0 0 14px 0;
    line-height: 1.4;
    flex-grow: 1;
}

/* Stack Icons Glimpse */
.glimpse-stack-row {
    margin-bottom: 16px;
}

.stack-glimpse-label {
    font-family: var(--font-bebas);
    font-size: 0.85rem;
    color: #666666;
    display: block;
    margin-bottom: 6px;
}

.stack-icons-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tech-mini-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 700;
    background: #ffffff;
    border: 1px solid #000000;
    padding: 2px 7px;
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
}

.tech-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    flex-shrink: 0;
}

.mini-tag-text {
    line-height: 1;
}

.card-action-row {
    border-top: 1px dashed #aaaaaa;
    padding-top: 12px;
    display: flex;
    justify-content: flex-end;
}

.view-details-btn {
    font-size: 0.8rem;
    padding: 5px 12px;
    background: #ffffff;
}

.view-details-btn:hover {
    background: #000000;
    color: #ffffff;
}

/* ================= BOTTOM RETURN NAVIGATION ================= */
.projects-bottom-nav {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 24px;
    border-top: 2px solid #000000;
}

.highlight {
    background-color: var(--tape-red);
    color: #000000;
    font-weight: 700;
}

/* ================= DETAIL MODAL ================= */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
    backdrop-filter: blur(2px);
}

.detail-modal-card {
    background: #dfdfdf;
    border: 3px solid #000000;
    box-shadow: 8px 8px 0px #000000;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-topbar {
    background: #000000;
    color: #ffffff;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #000000;
    flex-shrink: 0;
}

.modal-badge-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-year {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: #aaaaaa;
}

.close-btn {
    background: transparent;
    border: 1px solid #ffffff;
    color: #ffffff;
    font-size: 0.78rem;
    padding: 3px 8px;
    cursor: pointer;
}

.close-btn:hover {
    background: var(--tape-red);
    color: #000000;
    border-color: var(--tape-red);
}

.modal-scroll-body {
    padding: clamp(16px, 3vw, 28px);
    overflow-y: auto;
    flex-grow: 1;
}

.modal-detail-header {
    margin-bottom: 20px;
    border-bottom: 2px solid #000000;
    padding-bottom: 12px;
}

.detail-title {
    font-family: var(--font-boxing);
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    margin: 0 0 4px 0;
    line-height: 1.1;
}

.detail-subtitle {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    color: #444444;
    margin: 0;
}

/* Strictly Contained 3D Viewport Box */
.viewport-box {
    background: #ffffff;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #000000;
    margin-bottom: 24px;
    overflow: hidden;
}

.viewport-box-header {
    background: #000000;
    color: #ffffff;
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.8rem;
}

.asset-path {
    color: #88ff88;
    font-size: 0.75rem;
}

.canvas-mount {
    position: relative;
    width: 100%;
    height: clamp(300px, 42vh, 440px);
    background: #dfdfdf;
    overflow: hidden;
    border-bottom: 2px solid #000000;
    touch-action: pan-y !important;
}

.viewport-tech-footer {
    background: #e4e4e4;
    padding: 10px 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-family: var(--font-mono);
    font-size: 0.76rem;
}

.spec-label {
    font-weight: 700;
}

/* Image Showcase */
.image-showcase-box {
    margin-bottom: 24px;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #000000;
    background: #000000;
    overflow: hidden;
}

.full-showcase-img {
    width: 100%;
    max-height: 480px;
    object-fit: contain;
    display: block;
}

/* Detail Sections */
.detail-section {
    margin-bottom: 22px;
}

.section-heading {
    font-family: var(--font-pixel);
    font-size: 0.92rem;
    margin: 0 0 8px 0;
    color: #000000;
}

.full-description-text {
    font-family: var(--font-tech);
    font-size: 0.95rem;
    line-height: 1.65;
    margin: 0;
    color: #111111;
}

.highlights-box {
    background: #ececec;
    border: 1px solid #000000;
    padding: 16px;
}

.highlights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.highlight-item {
    font-family: var(--font-tech);
    font-size: 0.92rem;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.bullet-arrow {
    color: var(--tape-red);
    font-weight: 700;
}

.full-stack-flex {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tech-badge-large {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #000000;
    padding: 4px 10px;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.tech-icon-large {
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
}

.modal-footer {
    padding: 12px 18px;
    background: #cecece;
    border-top: 2px solid #000000;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
}
</style>
