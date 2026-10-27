<script setup lang="ts">
import Navbar from '../components/navbar.vue'
</script>

<template>
    <div class="blog-page">
        <Navbar />

        <main class="blog-container">
            <header class="page-header">
                <span class="tape-red header-tag">ENGINEERING LOGS & WRITE-UPS</span>
                <h1 class="page-title">TECHNICAL BLOG & CASE STUDIES</h1>
                <p class="page-subtitle">
                    Deep dives into cloud computing, machine learning deployments, cybersecurity pipelines, and modern frontend architecture.
                </p>
            </header>

            <div class="articles-grid">
                <article class="article-card">
                    <div class="card-meta">
                        <span class="tape-red">CLOUD AI</span>
                        <span class="date">OCTOBER 2026</span>
                    </div>
                    <h2 class="article-title">Fine-Tuning LLaMA 3 on AWS SageMaker: Lessons Learned</h2>
                    <p class="article-desc">
                        Engineering scalable training pipelines, handling iterative dataset preparation, and optimizing inference endpoints under competitive cloud hackathon constraints.
                    </p>
                    <div class="card-footer">
                        <a href="/projects" class="bracket-btn bordered">[ VIEW RELATED PROJECT → ]</a>
                    </div>
                </article>

                <article class="article-card">
                    <div class="card-meta">
                        <span class="tape-black">CYBERSECURITY</span>
                        <span class="date">AUGUST 2026</span>
                    </div>
                    <h2 class="article-title">Automating CSV Malware Detection with ClamAV & Docker</h2>
                    <p class="article-desc">
                        Designing an automated antivirus dashboard engine using ASP.NET Core and containerized ClamAV instances to inspect enterprise batch uploads.
                    </p>
                    <div class="card-footer">
                        <a href="/projects" class="bracket-btn bordered">[ VIEW RELATED PROJECT → ]</a>
                    </div>
                </article>

                <article class="article-card">
                    <div class="card-meta">
                        <span class="tape-red">FRONTEND ARCHITECTURE</span>
                        <span class="date">JULY 2026</span>
                    </div>
                    <h2 class="article-title">Building High-Performance 3D Shaders with Vue 3 & Three.js</h2>
                    <p class="article-desc">
                        Creating retro pen-and-ink dithered materials, custom GLSL fragment shaders, and pixel transitions while keeping bundle sizes light and SEO-friendly.
                    </p>
                    <div class="card-footer">
                        <a href="/gallery" class="bracket-btn bordered">[ VIEW 3D GALLERY → ]</a>
                    </div>
                </article>
            </div>
        </main>
    </div>
</template>

<style scoped>
.blog-page {
    min-height: 100vh;
    background-color: var(--bg-color);
    padding-top: 65px;
    padding-bottom: 60px;
}

.blog-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(16px, 4vw, 36px);
}

.page-header {
    margin-bottom: 36px;
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

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
}

.article-card {
    background: #dfdfdf;
    border: 2px solid #000000;
    padding: 24px;
    box-shadow: 4px 4px 0px #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.date {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-dim);
}

.article-title {
    font-family: var(--font-pixel);
    font-size: 1.1rem;
    line-height: 1.35;
    margin: 0 0 12px 0;
}

.article-desc {
    font-family: var(--font-tech);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0 0 20px 0;
}

.card-footer {
    margin-top: auto;
}
</style>
