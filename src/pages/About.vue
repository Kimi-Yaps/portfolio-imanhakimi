<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '../components/navbar.vue'
import { usePortfolioData } from '../composables/usePortfolioData'

const {
    profile,
    skills,
    experiences,
    education,
    certifications,
    getTechIcon,
    loadData
} = usePortfolioData()

onMounted(async () => {
    await loadData()
})
</script>

<template>
    <div class="about-page">
        <Navbar />

        <main class="about-container">
            <header class="page-header">
                <span class="tape-red header-tag">PROFILE & BACKGROUND</span>
                <h1 class="page-title">ABOUT MUHAMMAD IMAN HAKIMI</h1>
                <p class="page-subtitle">
                    {{ profile.role_title }} • {{ profile.location }}
                </p>
            </header>

            <div class="about-grid">
                <!-- Left Column: Profile Card -->
                <aside class="profile-card">
                    <div class="pfp-wrapper">
                        <img src="/ImanPFP.png" alt="Muhammad Iman Hakimi - Creative & Cloud Developer" class="pfp-image" />
                    </div>
                    <div class="status-tape">
                        <span class="tape-black">{{ profile.status_badge }}</span>
                    </div>
                    <div class="meta-details">
                        <div class="meta-row"><span class="tape-red">NAME:</span> {{ profile.full_name }}</div>
                        <div class="meta-row"><span class="tape-red">ROLE:</span> {{ profile.role_title }}</div>
                        <div class="meta-row"><span class="tape-red">LOCATION:</span> {{ profile.location }}</div>
                    </div>

                    <div class="action-links">
                        <a :href="'mailto:' + profile.email" class="bracket-btn bordered">
                            [ EMAIL IMAN ↗ ]
                        </a>
                        <a :href="profile.linkedin_url" target="_blank" rel="noopener noreferrer" class="bracket-btn bordered">
                            [ LINKEDIN PROFILE ↗ ]
                        </a>
                        <a href="/projects" class="bracket-btn bordered highlight">
                            [ VIEW ALL PROJECTS → ]
                        </a>
                    </div>
                </aside>

                <!-- Right Column: Narrative & Credentials -->
                <section class="details-section">
                    <!-- Executive Summary -->
                    <article class="panel-box">
                        <h2 class="panel-title">/// EXECUTIVE_SUMMARY</h2>
                        <p class="panel-text">
                            {{ profile.executive_summary }}
                        </p>
                    </article>

                    <!-- Work History -->
                    <article class="panel-box">
                        <h2 class="panel-title">/// EXPERIENCE_&_TRACK_RECORD</h2>
                        <div class="experience-list">
                            <div v-for="exp in experiences" :key="exp.id" class="exp-item">
                                <div class="exp-top">
                                    <span :class="exp.tag_color === 'black' ? 'tape-black' : 'tape-red'">
                                        {{ exp.period }}
                                    </span>
                                    <strong class="exp-company">{{ exp.company }}</strong>
                                </div>
                                <h3 class="exp-role">{{ exp.title }}</h3>
                                <ul class="exp-bullets">
                                    <li v-for="(b, bi) in exp.bullets" :key="bi">{{ b }}</li>
                                </ul>
                            </div>
                        </div>
                    </article>

                    <!-- Education -->
                    <article class="panel-box">
                        <h2 class="panel-title">/// FORMAL_EDUCATION</h2>
                        <div class="edu-list">
                            <div v-for="ed in education" :key="ed.id" class="edu-item">
                                <span v-if="ed.period" class="tape-red">{{ ed.period }}</span>
                                <h3 class="edu-degree">{{ ed.title }}</h3>
                                <div class="edu-school">{{ ed.subtitle }}</div>
                                <p v-if="ed.description" class="edu-desc">{{ ed.description }}</p>
                            </div>
                        </div>
                    </article>

                    <!-- Certifications -->
                    <article class="panel-box">
                        <h2 class="panel-title">/// PROFESSIONAL_CERTIFICATIONS</h2>
                        <div class="cert-grid">
                            <div v-for="ct in certifications" :key="ct.id" class="cert-card">
                                <h3 class="cert-title">{{ ct.title }}</h3>
                                <div class="cert-issuer"><span class="tape-black">{{ ct.subtitle }}</span></div>
                                <p v-if="ct.description" class="cert-desc">{{ ct.description }}</p>
                            </div>
                        </div>
                    </article>

                    <!-- Skills Matrix -->
                    <article class="panel-box">
                        <h2 class="panel-title">/// TECHNICAL_ARSENAL</h2>
                        <div class="skills-section">
                            <div class="skill-group">
                                <div class="tape-red">FRONTEND DEVELOPMENT</div>
                                <div class="skill-tags">
                                    <span v-for="s in skills.frontend" :key="s.id" class="tag">
                                        <img :src="getTechIcon(s.icon || s.name)" :alt="s.name" class="tech-icon" />
                                        {{ s.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="skill-group">
                                <div class="tape-black">BACKEND & DATABASES</div>
                                <div class="skill-tags">
                                    <span v-for="s in skills.backend" :key="s.id" class="tag">
                                        <img :src="getTechIcon(s.icon || s.name)" :alt="s.name" class="tech-icon" />
                                        {{ s.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="skill-group">
                                <div class="tape-red">CLOUD & DEVOPS</div>
                                <div class="skill-tags">
                                    <span v-for="s in skills.cloud" :key="s.id" class="tag">
                                        <img :src="getTechIcon(s.icon || s.name)" :alt="s.name" class="tech-icon" />
                                        {{ s.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    </div>
</template>

<style scoped>
.about-page {
    min-height: 100vh;
    background-color: var(--bg-color);
    padding-top: 65px;
    padding-bottom: 60px;
}

.about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(16px, 4vw, 36px);
}

.page-header {
    margin-bottom: 32px;
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

.about-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 28px;
    align-items: start;
}

@media (max-width: 900px) {
    .about-grid {
        grid-template-columns: 1fr;
    }
}

.profile-card {
    background: #dfdfdf;
    border: 2px solid #000000;
    padding: 20px;
    box-shadow: 4px 4px 0px #000000;
}

.pfp-wrapper {
    width: 100%;
    aspect-ratio: 1/1;
    border: 2px solid #000000;
    overflow: hidden;
    margin-bottom: 14px;
    background: #ffffff;
}

.pfp-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(120%);
}

.status-tape {
    margin-bottom: 14px;
}

.meta-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    margin-bottom: 20px;
}

.action-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.action-links .bracket-btn {
    width: 100%;
    justify-content: center;
    text-align: center;
}

.bracket-btn.highlight {
    background-color: var(--tape-red);
    color: #000000;
}

.details-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.panel-box {
    background: #dfdfdf;
    border: 2px solid #000000;
    padding: clamp(16px, 3vw, 24px);
    box-shadow: 4px 4px 0px #000000;
}

.panel-title {
    font-family: var(--font-pixel);
    font-size: clamp(0.95rem, 2.5vw, 1.15rem);
    margin-top: 0;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #000000;
}

.panel-text {
    font-family: var(--font-tech);
    font-size: clamp(0.85rem, 2vw, 0.98rem);
    line-height: 1.6;
    margin: 0;
}

.experience-list, .edu-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.exp-item, .edu-item {
    padding-bottom: 14px;
    border-bottom: 1px dashed #666666;
}

.exp-item:last-child, .edu-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.exp-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
}

.exp-company {
    font-family: var(--font-mono);
    font-size: 0.9rem;
}

.exp-role {
    font-family: var(--font-pixel);
    font-size: 1rem;
    margin: 4px 0 8px 0;
}

.exp-bullets {
    margin: 0;
    padding-left: 20px;
    font-family: var(--font-tech);
    font-size: 0.88rem;
    line-height: 1.5;
}

.edu-degree {
    font-family: var(--font-pixel);
    font-size: 1rem;
    margin: 6px 0 2px 0;
}

.edu-school {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    color: var(--ink-dim);
}

.edu-desc {
    font-family: var(--font-tech);
    font-size: 0.85rem;
    margin: 4px 0 0 0;
}

.cert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
}

.cert-card {
    border: 1px solid #000000;
    padding: 12px;
    background: rgba(255, 255, 255, 0.3);
}

.cert-title {
    font-family: var(--font-pixel);
    font-size: 0.88rem;
    margin: 0 0 6px 0;
}

.cert-desc {
    font-family: var(--font-tech);
    font-size: 0.8rem;
    margin: 6px 0 0 0;
}

.skills-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    border: 1px solid #000000;
    padding: 4px 8px;
    background: #ffffff;
}

.tech-icon {
    width: 14px;
    height: 14px;
}
</style>
