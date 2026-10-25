<script setup lang="ts">
import Navbar from '../components/navbar.vue'
import { usePixelTransition } from '../composables/usePixelTransition'

const { triggerPixelTransition } = usePixelTransition()

const projects = [
    {
        title: 'Siswa-Rent: Student Housing Discovery',
        category: 'HACKATHON SUBMISSION',
        badgeColor: 'orange',
        tagline: 'Bridging the student rental search divide with safer TypeScript architecture and PostgreSQL.',
        overview:
            'Siswa-Rent solves a practical, high-frequency problem: student housing discovery. It directly addresses the gap between how students naturally search and how current platforms force them to search.',
        keyPoints: [
            'Applied TypeScript for rigorous static typing, dramatically cutting coding & runtime errors.',
            'Designed PostgreSQL & Supabase database schema, saving 2-3 hours weekly through clear documentation.',
            'Created responsive UI components with clean design mock-up parity.',
        ],
        stack: ['React', 'TypeScript', 'HTML5', 'CSS3', 'PostgreSQL', 'Supabase'],
    },
    {
        title: 'CSV Upload Malware Detection System',
        category: 'SECURITY & AUTOMATION',
        badgeColor: 'orange',
        tagline: 'Automated antivirus file inspection engine with real-time analytics dashboard.',
        overview:
            'A security system that detects malware embedded in CSV uploads using the ClamAV antivirus engine and visualizes inspection results in an administrative dashboard, protecting internal office systems.',
        keyPoints: [
            'Automated manual file inspection tasks, significantly reducing human error for office workers.',
            'Engineered with ASP.NET Core and containerized with Docker for reliable isolated testing.',
            'Integrated MySQL database for audit logs and historical threat analysis.',
        ],
        stack: ['ASP.NET Core', 'MySQL', 'Docker', 'ClamAV', 'jQuery', 'Bootstrap'],
    },
    {
        title: 'POLYCC Large Language Model League',
        category: 'AI & CLOUD',
        badgeColor: 'orange',
        tagline: 'Generative AI fine-tuning and dataset engineering on AWS SageMaker AI.',
        overview:
            'Explored and implemented an open-source LLaMA 3 pipeline under competitive conditions on AWS infrastructure, developing custom iteration pipelines for prompt engineering and model fine-tuning.',
        keyPoints: [
            'Provisioned and utilized AWS SageMaker AI cloud compute instances.',
            'Engineered automated dataset generation and cleansing iterations.',
            'Tested and evaluated inference quality across domain-specific test sets.',
        ],
        stack: ['Python', 'LLaMA 3', 'AWS SageMaker', 'PyTorch', 'DataPrep'],
    },
]
const techIconMap: Record<string, string> = {
    'React': '/icons/react.svg',
    'TypeScript': '/icons/typescript.svg',
    'HTML5': '/icons/html5.svg',
    'CSS3': '/icons/css3.svg',
    'PostgreSQL': '/icons/postgresql.svg',
    'Supabase': '/icons/supabase.svg',
    'ASP.NET Core': '/icons/dotnet.svg',
    'MySQL': '/icons/mysql.svg',
    'Docker': '/icons/docker.svg',
    'ClamAV': '/icons/shield.svg',
    'jQuery': '/icons/jquery.svg',
    'Bootstrap': '/icons/bootstrap.svg',
    'Python': '/icons/python.svg',
    'LLaMA 3': '/icons/meta.svg',
    'AWS SageMaker': '/icons/amazonaws.svg',
    'PyTorch': '/icons/pytorch.svg',
    'DataPrep': '/icons/dataprep.svg',
}

const getTechIcon = (name: string): string => {
    return techIconMap[name] || '/icons/dataprep.svg'
}
</script>

<template>
    <div class="projects-page">
        <Navbar />

        <main class="projects-wrapper">
            <header class="page-header">
                <span class="highlight-orange header-tag">ENGINEERING PORTFOLIO</span>
                <h1 class="page-title">ALL PROJECTS & CASE STUDIES</h1>
                <p class="page-desc">
                    Comprehensive overview of software engineering, cybersecurity, and cloud AI projects
                    built by Muhammad Iman Hakimi Bin Hashim.
                </p>
            </header>

            <div class="projects-list">
                <article
                    v-for="(p, idx) in projects"
                    :key="idx"
                    class="project-detail-card"
                >
                    <div class="card-header-row">
                        <span class="highlight-orange badge">{{ p.category }}</span>
                        <span class="card-index">PROJ_0{{ idx + 1 }}</span>
                    </div>

                    <h2 class="project-name">{{ p.title }}</h2>
                    <p class="project-tagline">{{ p.tagline }}</p>
                    <p class="project-overview">{{ p.overview }}</p>

                    <div class="highlights-box">
                        <h4 class="highlights-heading">KEY HIGHLIGHTS & ARCHITECTURE</h4>
                        <ul>
                            <li v-for="(pt, pIdx) in p.keyPoints" :key="pIdx">
                                <span class="bullet">▸</span> {{ pt }}
                            </li>
                        </ul>
                    </div>

                    <div class="stack-row">
                        <span class="stack-label">STACK:</span>
                        <div class="stack-tags">
                            <span v-for="t in p.stack" :key="t" class="tech-tag">
                                <img :src="getTechIcon(t)" :alt="t" class="tech-icon" />
                                {{ t }}
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    </div>
</template>

<style scoped>
.projects-page {
    min-height: 100vh;
    background-color: var(--bg-color);
}

.projects-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3em 2em 6em;
}

.page-header {
    margin-bottom: 3.5em;
    border-bottom: 2px solid var(--ink-color);
    padding-bottom: 2em;
}

.header-tag {
    font-family: var(--font-bebas);
    font-size: 1.1rem;
    margin-bottom: 0.5em;
}

.page-title {
    font-family: var(--font-boxing);
    font-size: 3.6rem;
    margin: 0 0 0.4em 0;
    line-height: 1;
}

.page-desc {
    font-family: var(--font-mono);
    font-size: 1.05rem;
    color: #333;
    max-width: 680px;
    line-height: 1.6;
    margin: 0;
}

.projects-list {
    display: flex;
    flex-direction: column;
    gap: 3em;
}

.project-detail-card {
    background-color: var(--bg-card);
    border: 3px solid var(--ink-color);
    padding: 2.5em;
    box-shadow: 8px 8px 0px var(--ink-color);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-detail-card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 12px 12px 0px var(--orange-highlight);
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2em;
}

.badge {
    font-family: var(--font-bebas);
    font-size: 1rem;
}

.card-index {
    font-family: var(--font-mono);
    font-weight: bold;
    color: #666;
}

.project-name {
    font-family: var(--font-boxing);
    font-size: 2.4rem;
    line-height: 1.1;
    margin: 0 0 0.3em 0;
}

.project-tagline {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    font-weight: bold;
    color: var(--orange-highlight);
    margin: 0 0 1.2em 0;
}

.project-overview {
    font-size: 0.96rem;
    line-height: 1.7;
    color: #2e2e2e;
    margin: 0 0 1.6em 0;
}

.highlights-box {
    background-color: rgba(223, 223, 223, 0.65);
    border-left: 4px solid var(--orange-highlight);
    padding: 1.2em 1.4em;
    margin-bottom: 1.6em;
}

.highlights-heading {
    font-family: var(--font-bebas);
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    margin: 0 0 0.8em 0;
    color: var(--ink-color);
}

.highlights-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.highlights-box li {
    font-size: 0.9rem;
    line-height: 1.6;
}

.bullet {
    color: var(--orange-highlight);
    font-weight: bold;
}

.stack-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.8em;
    padding-top: 1.2em;
    border-top: 1px dashed var(--ink-color);
}

.stack-label {
    font-family: var(--font-bebas);
    font-size: 1rem;
    letter-spacing: 0.05em;
    color: #444;
}

.stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

.tech-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: bold;
    background-color: #ffffff;
    border: 1px solid var(--ink-color);
    padding: 0.25em 0.6em;
    box-shadow: 2px 2px 0px rgba(20, 20, 20, 0.3);
}

.tech-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: brightness(0);
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .projects-wrapper {
        padding: 1.5em 1em 4em;
    }
    .page-title {
        font-size: clamp(1.8rem, 6vw, 2.6rem);
    }
    .project-name {
        font-size: clamp(1.3rem, 4.5vw, 1.8rem);
    }
    .project-detail-card {
        padding: 1.2em;
        box-shadow: 4px 4px 0px var(--ink-color);
    }
}
</style>
