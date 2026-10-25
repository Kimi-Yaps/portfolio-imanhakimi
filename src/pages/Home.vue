<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/navbar.vue'
import modelDisplay from '../components/modelDisplay.vue'
import { usePixelTransition } from '../composables/usePixelTransition'

const { triggerPixelTransition } = usePixelTransition()

// Active modal / drawer state ('about' | 'projects' | 'experience' | 'skills' | 'contact' | null)
const activeSection = ref<string | null>(null)
const selectedProject = ref<string | null>(null)

const openSection = (section: string) => {
    triggerPixelTransition(() => {
        activeSection.value = section
    })
}

const closeSection = () => {
    triggerPixelTransition(() => {
        activeSection.value = null
        selectedProject.value = null
    })
}

// Copy to clipboard with visual confirmation
const copiedField = ref<string | null>(null)
const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => {
        copiedField.value = null
    }, 2000)
}

// Tech Stack Icon Mapping (Clean, Open-Source Monochrome Black SVGs)
const techIconMap: Record<string, string> = {
    // Frontend
    'React': '/icons/react.svg',
    'React JS': '/icons/react.svg',
    'TypeScript': '/icons/typescript.svg',
    'JavaScript': '/icons/javascript.svg',
    'HTML5': '/icons/html5.svg',
    'HTML/CSS': '/icons/html5.svg',
    'CSS3': '/icons/css3.svg',
    'Vue.js': '/icons/vue.svg',
    'TresJS 3D': '/icons/threejs.svg',
    'WordPress': '/icons/wordpress.svg',
    'jQuery': '/icons/jquery.svg',
    'Bootstrap': '/icons/bootstrap.svg',

    // Backend & Databases
    'PostgreSQL': '/icons/postgresql.svg',
    'Supabase': '/icons/supabase.svg',
    'MySQL': '/icons/mysql.svg',
    'ASP.NET Core': '/icons/dotnet.svg',
    'C#': '/icons/csharp.svg',
    'Python': '/icons/python.svg',
    'PHP': '/icons/php.svg',
    'Firebase': '/icons/firebase.svg',
    'Google Apps Script': '/icons/google.svg',
    'ClamAV': '/icons/shield.svg',

    // Cloud, AI & Data Tools
    'GCP Cloud Run': '/icons/googlecloud.svg',
    'AWS SageMaker': '/icons/amazonaws.svg',
    'AWS SageMaker AI': '/icons/amazonaws.svg',
    'Docker': '/icons/docker.svg',
    'Kubernetes': '/icons/kubernetes.svg',
    'GitHub / GitLab': '/icons/github.svg',
    'Jenkins': '/icons/jenkins.svg',
    'Grafana': '/icons/grafana.svg',
    'PyTorch': '/icons/pytorch.svg',
    'LLaMA 3': '/icons/meta.svg',
    'Google Sheets': '/icons/googlesheets.svg',
    'Google Looker Studio': '/icons/looker.svg',
    'Power BI': '/icons/powerbi.svg',
    'DataPrep': '/icons/dataprep.svg',
    'Data Analytics': '/icons/analytics.svg',
}

const getTechIcon = (name: string): string => {
    return techIconMap[name] || '/icons/dataprep.svg'
}

// Skills Arrays
const frontendSkills = [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React JS',
    'Vue.js',
    'TresJS 3D',
    'WordPress',
]

const backendSkills = [
    'PostgreSQL',
    'Supabase',
    'MySQL',
    'ASP.NET Core',
    'C#',
    'Python',
    'PHP',
    'Firebase',
    'Google Apps Script',
]

const cloudSkills = [
    'GCP Cloud Run',
    'AWS SageMaker AI',
    'Docker',
    'Kubernetes',
    'GitHub / GitLab',
    'Jenkins',
    'Grafana',
]

// Projects from Resume
const projects = [
    {
        id: 'siswa-rent',
        title: 'SISWA-RENT',
        badge: 'HACKATHON SUBMISSION',
        subtitle: 'Student Housing Discovery Platform',
        description:
            'Siswa-Rent solves a practical, high-frequency problem: student housing discovery. It directly addresses the gap between how students naturally search and how current platforms force them to search.',
        impact: [
            'Reduced coding errors using TypeScript for safer, more reliable architecture.',
            'Architected database with PostgreSQL / Supabase, saving 2-3 hours weekly through clear documentation.',
        ],
        stack: ['React', 'TypeScript', 'HTML/CSS', 'PostgreSQL', 'Supabase'],
    },
    {
        id: 'malware-detection',
        title: 'CSV MALWARE DETECTION',
        badge: 'SECURITY & AUTOMATION',
        subtitle: 'Automated Antivirus Dashboard Engine',
        description:
            'A security system that detects malware embedded in uploaded CSV files using the ClamAV antivirus engine and displays telemetry in an administrative dashboard.',
        impact: [
            'Significantly reduced human error while reducing manual labor for office personnel.',
            'Containerized scanning queues using Docker with ASP.NET Core backend.',
        ],
        stack: ['ASP.NET Core', 'MySQL', 'Docker', 'ClamAV', 'jQuery', 'Bootstrap'],
    },
    {
        id: 'polycc-llm',
        title: 'POLYCC LLM LEAGUE',
        badge: 'AI & CLOUD',
        subtitle: 'LLaMA 3 Fine-Tuning on AWS SageMaker',
        description:
            'Engineered custom AI training and inference workflows using LLaMA 3 under competitive cloud scenarios, generating new iterations of datasets for fine-tuning.',
        impact: [
            'Deployed scalable LLaMA 3 models inside AWS SageMaker AI cloud environments.',
            'Automated dataset pipeline iterations and prompt evaluation workflows.',
        ],
        stack: ['Python', 'LLaMA 3', 'AWS SageMaker', 'PyTorch', 'DataPrep'],
    },
    {
        id: 'data-hackathon',
        title: 'DATAHACKATHON 2024',
        badge: 'TOP 4 FINISH',
        subtitle: 'National Business Intelligence Analytics',
        description:
            'Secured Top 4 national finish through interactive dataset preparation, predictive analytics, and executive dashboarding presented directly to industry judges.',
        impact: [
            'Built visual analytics dashboards using Google Looker Studio and Power BI.',
            'Delivered live technical findings to a professional evaluation panel.',
        ],
        stack: ['Google Looker Studio', 'Power BI', 'Google Sheets', 'Data Analytics'],
    },
]

const openProjectModal = (projId: string) => {
    selectedProject.value = projId
    openSection('projects')
}
</script>

<template>
    <div class="screen-layout">
        <!-- 3D Dithered Model Canvas centered in background -->
        <modelDisplay />

        <!-- Top Navigation (Streamlined: Logo & Hire Me only) -->
        <Navbar />

        <!-- Main HUD Overlay -->
        <div class="hud-container">
            <!-- Top-Left: Statement with Red & Black Tape Highlighting -->
            <div class="tape-statement-block">
                <div class="tape-statement">
                    <span class="tape-red">DEVELOPMENT IS ALL ABOUT</span><br />
                    <span class="tape-black">MOVEMENT.</span><br />
                    <span class="tape-red">ONE PROJECT ENDS,</span><br />
                    <span class="tape-red">ANOTHER BEGINS,</span><br />
                    <span class="tape-red">AND THE RHYTHM NEVER STOPS.</span>
                </div>

                <div class="identity-subtext">
                    <span class="id-name">MUHAMMAD IMAN HAKIMI</span>
                    <span class="id-role">[ WEB & CLOUD DEVELOPER • SKUDAI, JOHOR ]</span>
                </div>
            </div>

            <!-- Bottom-Left: Menu with Arrow Links -->
            <div class="left-arrow-menu">
                <button class="nav-arrow-link" @click="openSection('about')">
                    → ABOUT_ME
                </button>
                <button class="nav-arrow-link" @click="openSection('projects')">
                    → MY_WORK
                </button>
                <button class="nav-arrow-link" @click="openSection('experience')">
                    → EXPERIENCE
                </button>
                <button class="nav-arrow-link" @click="openSection('skills')">
                    → SKILLS
                </button>
                <button class="nav-arrow-link" @click="openSection('contact')">
                    → CONTACT
                </button>
            </div>

            <!-- Far-Right: Vertical Sidebar Rail -->
            <aside class="right-rail">
                <a
                    href="mailto:hakimiiman342ab@gmail.com"
                    class="feedback-tab"
                >
                    FEEDBACK ↗
                </a>

                <div class="rail-scroll-indicator">
                    <span class="rail-arrow">^</span>
                    <span class="rail-dot">■</span>
                    <span class="rail-dot active">■</span>
                    <span class="rail-dot">■</span>
                    <span class="rail-arrow">v</span>
                </div>

                <div class="rail-index">
                    <span>06</span>
                </div>

                <button class="pixel-dino-btn" title="Contact Iman Hakimi" @click="openSection('contact')">
                    <img src="/Star.svg" alt="Star Icon" class="dino-star-img" />
                </button>
            </aside>

            <!-- Bottom Bar -->
            <footer class="bottom-hud-bar">
                <div class="bottom-left-index">
                    <span class="boxed-num">01</span>
                    <span class="index-label">Start</span>
                </div>

                <div class="bottom-center-nav">
                    <button class="arrow-btn" aria-label="Previous section" @click="openSection('about')">
                        ⇦
                    </button>
                    <button class="arrow-btn" aria-label="Next section" @click="openSection('projects')">
                        ⇨
                    </button>
                    <span class="copyright-text">
                        2026 IMAN HAKIMI. ALL RIGHT RESERVED
                    </span>
                </div>

                <div class="bottom-right-extra">
                    <span class="boxed-alert" title="Quick Contact" @click="openSection('contact')">!</span>
                </div>
            </footer>
        </div>

        <!-- ================= DETAIL TERMINAL MODAL ================= -->
        <transition name="terminal">
            <div v-if="activeSection" class="terminal-modal-backdrop" @click.self="closeSection">
                <div class="terminal-window">
                    <!-- Terminal Top Bar -->
                    <div class="terminal-header">
                        <div class="terminal-title">
                            <span class="tape-red">[ TERMINAL: {{ activeSection.toUpperCase() }} ]</span>
                        </div>
                        <button class="bracket-btn bordered close-btn" @click="closeSection">
                            [ X CLOSE ]
                        </button>
                    </div>

                    <!-- Terminal Content Body -->
                    <div class="terminal-body">
                        <!-- ================= SECTION: ABOUT_ME ================= -->
                        <div v-if="activeSection === 'about'" class="section-content">
                            <div class="about-grid">
                                <!-- Profile Picture Card -->
                                <div class="pfp-terminal-card">
                                    <div class="pfp-border">
                                        <img
                                            src="/ImanPFP.png"
                                            alt="Muhammad Iman Hakimi"
                                            class="pfp-img"
                                        />
                                    </div>
                                    <div class="pfp-status">
                                        <span class="tape-black">STATUS: AVAILABLE</span>
                                    </div>
                                    <div class="pfp-meta">
                                        <div><span class="tape-red">NAME:</span> MUHAMMAD IMAN HAKIMI</div>
                                        <div><span class="tape-red">LOCATION:</span> SKUDAI, JOHOR</div>
                                        <div><span class="tape-red">ROLE:</span> WEB & CLOUD DEVELOPER</div>
                                    </div>
                                </div>

                                <div class="about-details">
                                    <div class="panel-block">
                                        <h2 class="panel-heading">/// EXECUTIVE_SUMMARY</h2>
                                        <p class="panel-para">
                                            Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS & Vue.
                                            Proved able to leverage technical platforms for data analytics by using Google Looker Studio to secure top 10 in Data Hackathon 2024.
                                            Created AI solutions utilizing LLaMA 3 and iterative dataset generation on AWS SageMaker AI.
                                        </p>
                                    </div>

                                    <div class="panel-block">
                                        <h2 class="panel-heading">/// EDUCATION</h2>
                                        <div class="mono-entry">
                                            <span class="tape-red">2023 - 2026</span>
                                            <div class="entry-title">Polytechnic Mersing Johor</div>
                                            <div class="entry-sub">Diploma in Information Technology — Networking Track (CGPA 3.07)</div>
                                        </div>
                                    </div>

                                    <div class="panel-block">
                                        <h2 class="panel-heading">/// CERTIFICATIONS</h2>
                                        <div class="mono-entry">
                                            <div class="entry-title">CAE Cloud Service Associate (CCSA)</div>
                                            <div class="entry-sub">Siri Number: <span class="tape-black">DEJ1SQMK8Q</span></div>
                                            <div class="entry-desc">
                                                Trained on cloud platform deployments, cloud service monitoring, IAM User governance, and scalable web hosting.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ================= SECTION: MY_WORK ================= -->
                        <div v-if="activeSection === 'projects'" class="section-content">
                            <h2 class="panel-heading">/// FEATURED_PROJECTS_&_SYSTEMS</h2>
                            <div class="terminal-projects-grid">
                                <article
                                    v-for="p in projects"
                                    :key="p.id"
                                    class="terminal-card"
                                    :class="{ highlighted: selectedProject === p.id }"
                                >
                                    <div class="card-bar">
                                        <span class="tape-red">{{ p.badge }}</span>
                                        <span class="card-id">#{{ p.id }}</span>
                                    </div>

                                    <h3 class="card-proj-title">{{ p.title }}</h3>
                                    <div class="card-proj-sub">{{ p.subtitle }}</div>
                                    <p class="card-proj-desc">{{ p.description }}</p>

                                    <div class="card-bullet-box">
                                        <div v-for="(imp, i) in p.impact" :key="i" class="impact-line">
                                            ▸ {{ imp }}
                                        </div>
                                    </div>

                                    <div class="card-stack-row">
                                        <span v-for="t in p.stack" :key="t" class="stack-badge">
                                            <img :src="getTechIcon(t)" :alt="t" class="tech-icon" />
                                            [{{ t }}]
                                        </span>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <!-- ================= SECTION: EXPERIENCE ================= -->
                        <div v-if="activeSection === 'experience'" class="section-content">
                            <h2 class="panel-heading">/// WORK_HISTORY_&_TRACK_RECORD</h2>
                            <div class="experience-list">
                                <div class="experience-block">
                                    <div class="exp-header">
                                        <span class="tape-red">1 OCTOBER 2026 - PRESENT</span>
                                        <span class="exp-company">UNIVERSITI TEKNOLOGI MALAYSIA</span>
                                    </div>
                                    <h3 class="exp-title">Assistant Administrative Officer (MySTEP)</h3>
                                    <ul class="exp-bullets">
                                        <li>Structured and cleansed datasets in Google Sheets to ensure data integrity for automated Google Apps Script workflows.</li>
                                        <li>Designed and built responsive WordPress page layouts for university events, embedding custom HTML and CSS.</li>
                                    </ul>
                                </div>

                                <div class="experience-block">
                                    <div class="exp-header">
                                        <span class="tape-black">MARCH - JULY 2026</span>
                                        <span class="exp-company">UTM DIGITAL, UNIVERSITI TEKNOLOGI MALAYSIA</span>
                                    </div>
                                    <h3 class="exp-title">Information Technology Intern</h3>
                                    <ul class="exp-bullets">
                                        <li>Collaborated with network team to diagnose and resolve hardware faults on wireless access points and point-to-point links.</li>
                                        <li>Developed Google Apps Script automations that streamlined recurring team workflows, reducing manual processing time by 35%.</li>
                                        <li>Built Power BI reports for data analytics, turning raw operational data into visual insights for team decision-making.</li>
                                        <li>Migrated CRUD operations from a legacy ASP.NET Web Forms/MVC application to ASP.NET Core.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- ================= SECTION: SKILLS ================= -->
                        <div v-if="activeSection === 'skills'" class="section-content">
                            <h2 class="panel-heading">/// TECHNICAL_ARSENAL</h2>
                            <div class="skills-grid">
                                <div class="skill-category">
                                    <div class="tape-red">FRONTEND DEVELOPMENT</div>
                                    <div class="tag-cloud">
                                        <span v-for="skill in frontendSkills" :key="skill">
                                            <img :src="getTechIcon(skill)" :alt="skill" class="tech-icon" />
                                            {{ skill }}
                                        </span>
                                    </div>
                                </div>

                                <div class="skill-category">
                                    <div class="tape-black">BACKEND & DATABASES</div>
                                    <div class="tag-cloud">
                                        <span v-for="skill in backendSkills" :key="skill">
                                            <img :src="getTechIcon(skill)" :alt="skill" class="tech-icon" />
                                            {{ skill }}
                                        </span>
                                    </div>
                                </div>

                                <div class="skill-category">
                                    <div class="tape-red">CLOUD & DEVOPS</div>
                                    <div class="tag-cloud">
                                        <span v-for="skill in cloudSkills" :key="skill">
                                            <img :src="getTechIcon(skill)" :alt="skill" class="tech-icon" />
                                            {{ skill }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ================= SECTION: CONTACT ================= -->
                        <div v-if="activeSection === 'contact'" class="section-content">
                            <h2 class="panel-heading">/// DIRECT_COMMUNICATIONS</h2>
                            <div class="contact-terminal-grid">
                                <div class="contact-box">
                                    <div class="tape-red">DIRECT EMAIL</div>
                                    <div class="contact-value">hakimiiman342ab@gmail.com</div>
                                    <button
                                        class="bracket-btn bordered"
                                        @click="copyToClipboard('hakimiiman342ab@gmail.com', 'email')"
                                    >
                                        [ {{ copiedField === 'email' ? '✓ COPIED' : 'COPY EMAIL' }} ]
                                    </button>
                                </div>

                                <div class="contact-box">
                                    <div class="tape-black">TELEPHONE</div>
                                    <div class="contact-value">0163210744</div>
                                    <button
                                        class="bracket-btn bordered"
                                        @click="copyToClipboard('0163210744', 'phone')"
                                    >
                                        [ {{ copiedField === 'phone' ? '✓ COPIED' : 'COPY PHONE' }} ]
                                    </button>
                                </div>

                                <div class="contact-box">
                                    <div class="tape-red">LINKEDIN</div>
                                    <div class="contact-value">linkedin.com/in/iman-hakimi</div>
                                    <a
                                        href="https://www.linkedin.com/in/iman-hakimi-867a1b2a5/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="bracket-btn bordered"
                                    >
                                        [ OPEN LINKEDIN ↗ ]
                                    </a>
                                </div>

                                <div class="contact-box">
                                    <div class="tape-black">LOCATION</div>
                                    <div class="contact-value">Skudai, Johor, Malaysia</div>
                                    <div class="tape-red">AVAILABLE FOR HIRE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.screen-layout {
    position: relative;
    width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    background-color: var(--bg-color);
}

/* Fixed HUD container matching isladjan.com layout */
.hud-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(56px, 7vh, 68px) clamp(14px, 3.2vw, 36px) clamp(10px, 1.8vh, 20px) clamp(14px, 3.2vw, 36px);
    overflow: hidden;
    box-sizing: border-box;
}

/* Allow interactive elements inside HUD to be clicked */
.tape-statement-block,
.left-arrow-menu,
.right-rail,
.bottom-hud-bar,
button,
a {
    pointer-events: auto;
}

/* ================= TOP-LEFT TAPE STATEMENT ================= */
.tape-statement-block {
    max-width: min(580px, 100%);
    box-sizing: border-box;
}

.tape-statement {
    /* Fluid responsive font size that shrinks properly on small screens */
    font-size: clamp(0.72rem, 3.4vw, 1.55rem);
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0.04em;
    margin-bottom: clamp(6px, 1.2vh, 14px);
    word-break: break-word;
    overflow-wrap: break-word;
}

.tape-statement span {
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
    padding: clamp(2px, 0.8vw, 4px) clamp(4px, 1.2vw, 8px);
    margin-bottom: clamp(2px, 0.5vh, 4px);
}

.identity-subtext {
    font-family: var(--font-pixel);
    font-size: clamp(0.68rem, 2.4vw, 0.85rem);
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
    word-break: break-word;
}

.id-name {
    font-weight: 700;
    background-color: #000000;
    color: #ffffff;
    display: inline-block;
    padding: 2px 6px;
    width: fit-content;
    max-width: 100%;
}

.id-role {
    color: #333333;
    font-size: clamp(0.62rem, 2.2vw, 0.78rem);
    word-break: break-word;
}

/* ================= BOTTOM-LEFT ARROW MENU ================= */
.left-arrow-menu {
    display: flex;
    flex-direction: column;
    gap: clamp(4px, 1vh, 8px);
    margin-bottom: clamp(8px, 4vh, 45px);
}

.left-arrow-menu .nav-arrow-link {
    font-size: clamp(0.72rem, 2.8vw, 0.98rem);
    padding: 3px 6px;
    width: fit-content;
}

/* ================= FAR-RIGHT VERTICAL RAIL ================= */
.right-rail {
    position: absolute;
    right: 0;
    top: 45px;
    bottom: 0;
    width: 38px;
    border-left: 1px solid var(--border-color);
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    z-index: 15;
}

.feedback-tab {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: var(--font-pixel);
    font-size: 0.75rem;
    background-color: #000000;
    color: #ffffff;
    padding: 10px 4px;
    text-decoration: none;
    letter-spacing: 0.1em;
}

.feedback-tab:hover {
    background-color: var(--tape-red);
    color: #000000;
}

.rail-scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
}

.rail-dot.active {
    color: var(--tape-red);
}

.rail-index {
    font-family: var(--font-pixel);
    font-size: 0.82rem;
    font-weight: 700;
}

.pixel-dino-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dino-star-img {
    width: 22px;
    height: 22px;
    transition: transform 0.3s ease;
}

.pixel-dino-btn:hover .dino-star-img {
    transform: rotate(90deg);
}

/* ================= BOTTOM BAR ================= */
.bottom-hud-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border-color);
    padding-top: clamp(6px, 1.2vh, 10px);
    margin-right: 38px;
    gap: 8px;
}

.bottom-left-index {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    flex-shrink: 0;
}

.boxed-num {
    border: 1px solid #000000;
    padding: 2px clamp(5px, 1vw, 8px);
    font-size: clamp(0.95rem, 3.2vw, 1.35rem);
    font-weight: 700;
    background-color: var(--bg-color);
}

.index-label {
    font-size: clamp(0.78rem, 2.5vw, 1.05rem);
    font-weight: 700;
}

.bottom-center-nav {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.4vw, 12px);
    overflow: hidden;
}

.arrow-btn {
    font-size: clamp(0.95rem, 3vw, 1.25rem);
    background: transparent;
    border: 1px solid #000000;
    padding: 1px clamp(6px, 1.2vw, 10px);
    cursor: pointer;
    transition: all 0.1s ease;
    flex-shrink: 0;
}

.arrow-btn:hover {
    background-color: var(--tape-red);
}

.copyright-text {
    font-size: clamp(0.55rem, 1.8vw, 0.75rem);
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: min(360px, 46vw);
}

.bottom-right-extra {
    flex-shrink: 0;
}

.boxed-alert {
    border: 1px solid #000000;
    padding: 2px clamp(6px, 1.2vw, 8px);
    background-color: #000000;
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
    font-size: clamp(0.8rem, 2.5vw, 1rem);
}

.boxed-alert:hover {
    background-color: var(--tape-red);
    color: #000000;
}

/* ================= TERMINAL MODAL ================= */
.terminal-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background-color: rgba(223, 223, 223, 0.94);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(6px, 2.5vw, 24px);
    overscroll-behavior: contain;
}

.terminal-window {
    width: 100%;
    max-width: 1100px;
    max-height: 94dvh;
    background-color: var(--bg-color);
    border: 2px solid #000000;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 0 #000000;
    overflow: hidden;
}

.terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(8px, 1.8vw, 12px) clamp(10px, 2.2vw, 18px);
    border-bottom: 2px solid #000000;
    background-color: var(--bg-color);
    gap: 8px;
    flex-shrink: 0;
}

.terminal-title {
    font-size: clamp(0.72rem, 2.8vw, 1rem);
    word-break: break-word;
}

.terminal-title .tape-red {
    padding: 2px clamp(4px, 1.2vw, 8px);
    margin-bottom: 0;
}

.close-btn {
    font-weight: 700;
    font-size: clamp(0.72rem, 2.6vw, 0.88rem);
    padding: 4px clamp(6px, 1.5vw, 10px);
    flex-shrink: 0;
    white-space: nowrap;
}

.terminal-body {
    padding: clamp(10px, 2.8vw, 24px);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    flex: 1 1 auto;
    word-break: break-word;
    overflow-wrap: break-word;
}

.panel-heading {
    font-size: clamp(0.95rem, 3.2vw, 1.25rem);
    margin: 0 0 clamp(10px, 2vh, 16px) 0;
    border-bottom: 1px solid #000000;
    padding-bottom: 6px;
    word-break: break-word;
}

/* ================= SECTION: ABOUT LAYOUT ================= */
.about-grid {
    display: grid;
    grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
    gap: clamp(14px, 3vw, 28px);
}

.pfp-terminal-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 100%;
}

.pfp-border {
    border: 2px solid #000000;
    background-color: #ffffff;
    padding: 5px;
    width: 100%;
    max-width: 220px;
}

.pfp-img {
    width: 100%;
    aspect-ratio: 1 / 1.15;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: contrast(1.05);
}

.pfp-status .tape-black {
    font-size: clamp(0.68rem, 2.2vw, 0.78rem);
    padding: 2px 6px;
}

.pfp-meta {
    font-size: clamp(0.7rem, 2.3vw, 0.78rem);
    display: flex;
    flex-direction: column;
    gap: 4px;
    word-break: break-word;
}

.panel-block {
    margin-bottom: clamp(14px, 2.5vh, 24px);
}

.panel-para {
    font-family: var(--font-mono);
    font-size: clamp(0.78rem, 2.4vw, 0.92rem);
    line-height: 1.65;
    margin: 0;
    word-break: break-word;
    overflow-wrap: break-word;
}

.mono-entry {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    word-break: break-word;
}

.entry-title {
    font-size: clamp(0.85rem, 2.8vw, 1rem);
    font-weight: 700;
    word-break: break-word;
}

.entry-sub {
    font-family: var(--font-mono);
    font-size: clamp(0.74rem, 2.3vw, 0.85rem);
    color: #444;
    word-break: break-word;
}

.entry-desc {
    font-family: var(--font-mono);
    font-size: clamp(0.72rem, 2.2vw, 0.82rem);
    line-height: 1.5;
    margin-top: 4px;
    word-break: break-word;
}

/* ================= SECTION: PROJECTS LAYOUT ================= */
.terminal-projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: clamp(12px, 2vw, 20px);
}

.terminal-card {
    border: 1px solid #000000;
    padding: clamp(12px, 2vw, 16px);
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    word-break: break-word;
}

.terminal-card.highlighted {
    border: 2px solid var(--tape-red);
}

.card-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 6px;
}

.card-bar .tape-red {
    font-size: clamp(0.65rem, 2.2vw, 0.78rem);
    padding: 2px 6px;
    margin-bottom: 0;
}

.card-id {
    font-size: clamp(0.68rem, 2vw, 0.78rem);
    color: #555;
}

.card-proj-title {
    font-size: clamp(1rem, 3.2vw, 1.25rem);
    margin: 0 0 4px 0;
    line-height: 1.2;
    word-break: break-word;
}

.card-proj-sub {
    font-family: var(--font-mono);
    font-size: clamp(0.72rem, 2.3vw, 0.82rem);
    font-weight: 700;
    color: var(--tape-red);
    margin-bottom: 8px;
    word-break: break-word;
}

.card-proj-desc {
    font-family: var(--font-mono);
    font-size: clamp(0.76rem, 2.4vw, 0.85rem);
    line-height: 1.55;
    margin: 0 0 10px 0;
    word-break: break-word;
}

.card-bullet-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: clamp(0.7rem, 2.2vw, 0.78rem);
    margin-bottom: 12px;
    background-color: rgba(0, 0, 0, 0.04);
    padding: clamp(6px, 1.8vw, 10px);
    border-left: 2px solid #000000;
    word-break: break-word;
}

.impact-line {
    line-height: 1.45;
}

.card-stack-row {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.stack-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #000000;
    font-weight: 700;
    font-size: clamp(0.65rem, 2vw, 0.74rem);
    word-break: break-word;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 2px 6px;
}

/* Tech Icon Style: Aesthetic pure black icon */
.tech-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    display: inline-block;
    vertical-align: middle;
    filter: brightness(0);
    flex-shrink: 0;
}

/* ================= SECTION: EXPERIENCE LAYOUT ================= */
.experience-list {
    display: flex;
    flex-direction: column;
    gap: clamp(14px, 2.5vw, 24px);
}

.experience-block {
    border-left: 3px solid #000000;
    padding-left: clamp(8px, 2vw, 16px);
    word-break: break-word;
}

.exp-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;
}

.exp-header .tape-red,
.exp-header .tape-black {
    font-size: clamp(0.65rem, 2.2vw, 0.78rem);
    padding: 2px 6px;
    margin-bottom: 0;
}

.exp-company {
    font-size: clamp(0.7rem, 2.3vw, 0.82rem);
    color: #333;
    word-break: break-word;
}

.exp-title {
    font-size: clamp(0.92rem, 3vw, 1.15rem);
    margin: 0 0 8px 0;
    line-height: 1.25;
    word-break: break-word;
}

.exp-bullets {
    font-family: var(--font-mono);
    font-size: clamp(0.74rem, 2.3vw, 0.86rem);
    line-height: 1.55;
    margin: 0;
    padding-left: clamp(14px, 3.2vw, 20px);
    word-break: break-word;
}

.exp-bullets li {
    margin-bottom: 4px;
}

/* ================= SECTION: SKILLS LAYOUT ================= */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: clamp(12px, 2vw, 20px);
}

.skill-category {
    border: 1px solid #000000;
    padding: clamp(12px, 2vw, 16px);
    background-color: rgba(255, 255, 255, 0.4);
    word-break: break-word;
}

.skill-category .tape-red,
.skill-category .tape-black {
    font-size: clamp(0.7rem, 2.3vw, 0.82rem);
    padding: 2px 6px;
}

.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(5px, 1.2vw, 8px);
    margin-top: 10px;
}

.tag-cloud span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: clamp(0.68rem, 2.1vw, 0.8rem);
    border: 1px solid #000000;
    padding: 3px clamp(5px, 1.2vw, 8px);
    background-color: #ffffff;
    word-break: break-word;
    transition: background-color 0.12s ease;
}

.tag-cloud span:hover {
    background-color: var(--tape-red);
}

/* ================= SECTION: CONTACT LAYOUT ================= */
.contact-terminal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: clamp(12px, 2vw, 20px);
}

.contact-box {
    border: 1px solid #000000;
    padding: clamp(12px, 2.5vw, 18px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    background-color: rgba(255, 255, 255, 0.4);
    word-break: break-word;
}

.contact-box .tape-red,
.contact-box .tape-black {
    font-size: clamp(0.7rem, 2.3vw, 0.82rem);
    padding: 2px 6px;
    margin-bottom: 0;
}

.contact-value {
    font-family: var(--font-mono);
    font-size: clamp(0.75rem, 2.6vw, 0.95rem);
    word-break: break-all;
    overflow-wrap: anywhere;
}

.contact-box button,
.contact-box a {
    font-size: clamp(0.7rem, 2.3vw, 0.85rem);
    padding: 4px clamp(6px, 1.8vw, 10px);
}

/* ================= RESPONSIVE MEDIA QUERIES ================= */
@media (max-width: 900px) {
    .hud-container {
        padding: clamp(50px, 6.5vh, 60px) 38px clamp(8px, 1.5vh, 16px) clamp(10px, 2.5vw, 16px);
    }
    .right-rail {
        display: flex;
        width: 30px;
        top: 44px;
        padding: 10px 0;
    }
    .feedback-tab {
        font-size: 0.62rem;
        padding: 6px 2px;
        letter-spacing: 0.05em;
    }
    .rail-scroll-indicator {
        font-size: 0.6rem;
        gap: 4px;
    }
    .rail-index {
        font-size: 0.72rem;
    }
    .pixel-dino-btn {
        padding: 2px;
    }
    .dino-star-img {
        width: 17px;
        height: 17px;
    }
    .bottom-hud-bar {
        margin-right: 0;
    }
}

@media (max-width: 820px) {
    .about-grid {
        grid-template-columns: 1fr;
    }
    .pfp-terminal-card {
        flex-direction: row;
        align-items: center;
        gap: 14px;
        max-width: 100%;
    }
    .pfp-border {
        max-width: 110px;
        flex-shrink: 0;
    }
}

@media (max-width: 520px) {
    .pfp-terminal-card {
        flex-direction: column;
        align-items: flex-start;
    }
    .pfp-border {
        max-width: 140px;
    }
    .bottom-center-nav .copyright-text {
        display: none;
    }
    .terminal-window {
        max-height: 96dvh;
    }
}
</style>
