<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Model tab states matching isladjan.com
const currentModelTab = ref('MODEL ONE')
const selectModelTab = (tab: string) => {
    currentModelTab.value = tab
    if (tab === 'MODEL ONE') openProjectModal('siswa-rent')
    if (tab === 'MODEL TWO') openProjectModal('malware-detection')
    if (tab === 'MODEL THREE') openProjectModal('polycc-llm')
}
</script>

<template>
    <div class="screen-layout">
        <!-- 3D Dithered Model Canvas centered in background -->
        <modelDisplay />

        <!-- Top Navigation matching [ ISLADJAN.COM ] & [ MENU ] -->
        <Navbar @open-section="openSection" />

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

            <!-- Bottom-Right: Model / Project Selector Tabs -->
            <div class="right-model-tabs">
                <button
                    class="tab-box"
                    :class="{ active: currentModelTab === 'MODEL ONE' }"
                    @click="selectModelTab('MODEL ONE')"
                >
                    MODEL ONE
                </button>
                <button
                    class="tab-box"
                    :class="{ active: currentModelTab === 'MODEL TWO' }"
                    @click="selectModelTab('MODEL TWO')"
                >
                    MODEL TWO
                </button>
                <button
                    class="tab-box"
                    :class="{ active: currentModelTab === 'MODEL THREE' }"
                    @click="selectModelTab('MODEL THREE')"
                >
                    MODEL THREE
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

            <!-- Bottom Bar matching isladjan.com -->
            <footer class="bottom-hud-bar">
                <div class="bottom-left-index">
                    <span class="boxed-num">01</span>
                    <span class="index-label">Start</span>
                </div>

                <div class="bottom-center-nav">
                    <button class="arrow-btn" @click="openSection('about')">
                        ⇦
                    </button>
                    <button class="arrow-btn" @click="openSection('projects')">
                        ⇨
                    </button>
                    <span class="copyright-text">
                        2026 IMAN HAKIMI. ALL RIGHT RESERVED
                    </span>
                </div>

                <div class="bottom-right-extra">
                    <span class="boxed-alert" @click="openSection('contact')">!</span>
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
                                <!-- Profile Picture Frame loaded from /ImanPFP.png -->
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
                                        <span>HTML5</span>
                                        <span>CSS3</span>
                                        <span>JavaScript</span>
                                        <span>TypeScript</span>
                                        <span>React JS</span>
                                        <span>Vue.js</span>
                                        <span>TresJS 3D</span>
                                        <span>WordPress</span>
                                    </div>
                                </div>

                                <div class="skill-category">
                                    <div class="tape-black">BACKEND & DATABASES</div>
                                    <div class="tag-cloud">
                                        <span>PostgreSQL</span>
                                        <span>Supabase</span>
                                        <span>MySQL</span>
                                        <span>ASP.NET Core</span>
                                        <span>C#</span>
                                        <span>Python</span>
                                        <span>PHP</span>
                                        <span>Firebase</span>
                                        <span>Google Apps Script</span>
                                    </div>
                                </div>

                                <div class="skill-category">
                                    <div class="tape-red">CLOUD & DEVOPS</div>
                                    <div class="tag-cloud">
                                        <span>GCP Cloud Run</span>
                                        <span>AWS SageMaker AI</span>
                                        <span>Docker</span>
                                        <span>Kubernetes</span>
                                        <span>GitHub / GitLab</span>
                                        <span>Jenkins</span>
                                        <span>Grafana</span>
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
    height: 100vh;
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
    padding: 68px 36px 20px 36px;
}

/* Allow interactive elements inside HUD to be clicked */
.tape-statement-block,
.left-arrow-menu,
.right-model-tabs,
.right-rail,
.bottom-hud-bar,
button,
a {
    pointer-events: auto;
}

/* ================= TOP-LEFT TAPE STATEMENT ================= */
.tape-statement-block {
    max-width: 580px;
}

.tape-statement {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0.05em;
    margin-bottom: 14px;
}

.identity-subtext {
    font-family: var(--font-pixel);
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
}

.id-name {
    font-weight: 700;
    background-color: #000000;
    color: #ffffff;
    display: inline-block;
    padding: 2px 6px;
    width: fit-content;
}

.id-role {
    color: #333333;
    font-size: 0.78rem;
}

/* ================= BOTTOM-LEFT ARROW MENU ================= */
.left-arrow-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 50px;
}

/* ================= BOTTOM-RIGHT MODEL TABS ================= */
.right-model-tabs {
    position: absolute;
    right: 54px;
    bottom: 90px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
}

.tab-box {
    font-family: var(--font-pixel);
    font-size: 0.85rem;
    font-weight: 700;
    background-color: var(--bg-color);
    color: #000000;
    border: 1px solid #000000;
    padding: 5px 16px;
    cursor: pointer;
    min-width: 140px;
    text-align: center;
    transition: all 0.1s ease;
}

.tab-box:hover {
    background-color: var(--tape-red);
    color: #000000;
}

.tab-box.active {
    background-color: #000000;
    color: #ffffff;
}

/* ================= FAR-RIGHT VERTICAL RAIL ================= */
.right-rail {
    position: absolute;
    right: 0;
    top: 50px;
    bottom: 0;
    width: 38px;
    border-left: 1px solid var(--border-color);
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
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
    padding-top: 10px;
    margin-right: 38px;
}

.bottom-left-index {
    display: flex;
    align-items: center;
    gap: 8px;
}

.boxed-num {
    border: 1px solid #000000;
    padding: 4px 8px;
    font-size: 1.4rem;
    font-weight: 700;
    background-color: var(--bg-color);
}

.index-label {
    font-size: 1.1rem;
    font-weight: 700;
}

.bottom-center-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.arrow-btn {
    font-size: 1.3rem;
    background: transparent;
    border: 1px solid #000000;
    padding: 2px 10px;
    cursor: pointer;
    transition: all 0.1s ease;
}

.arrow-btn:hover {
    background-color: var(--tape-red);
}

.copyright-text {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
}

.boxed-alert {
    border: 1px solid #000000;
    padding: 3px 8px;
    background-color: #000000;
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
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
    padding: 30px;
}

.terminal-window {
    width: 100%;
    max-width: 1100px;
    max-height: 88vh;
    background-color: var(--bg-color);
    border: 2px solid #000000;
    display: flex;
    flex-direction: column;
}

.terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 2px solid #000000;
    background-color: var(--bg-color);
}

.terminal-title {
    font-size: 1rem;
}

.close-btn {
    font-weight: 700;
}

.terminal-body {
    padding: 24px;
    overflow-y: auto;
}

.panel-heading {
    font-size: 1.25rem;
    margin: 0 0 16px 0;
    border-bottom: 1px solid #000000;
    padding-bottom: 6px;
}

/* About Layout */
.about-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 30px;
}

.pfp-terminal-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pfp-border {
    border: 2px solid #000000;
    background-color: #ffffff;
    padding: 6px;
}

.pfp-img {
    width: 100%;
    aspect-ratio: 1 / 1.15;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: contrast(1.05);
}

.pfp-meta {
    font-size: 0.78rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.panel-block {
    margin-bottom: 24px;
}

.panel-para {
    font-family: var(--font-mono);
    font-size: 0.92rem;
    line-height: 1.7;
    margin: 0;
}

.mono-entry {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.entry-title {
    font-size: 1rem;
    font-weight: 700;
}

.entry-sub {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: #444;
}

.entry-desc {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.5;
    margin-top: 4px;
}

/* Projects Terminal Layout */
.terminal-projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

.terminal-card {
    border: 1px solid #000000;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
}

.terminal-card.highlighted {
    border: 2px solid var(--tape-red);
}

.card-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.card-id {
    font-size: 0.78rem;
    color: #555;
}

.card-proj-title {
    font-size: 1.25rem;
    margin: 0 0 4px 0;
}

.card-proj-sub {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--tape-red);
    margin-bottom: 10px;
}

.card-proj-desc {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0 0 12px 0;
}

.card-bullet-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    margin-bottom: 14px;
    background-color: rgba(0, 0, 0, 0.04);
    padding: 8px;
    border-left: 2px solid #000000;
}

.card-stack-row {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.72rem;
}

.stack-badge {
    color: #000000;
    font-weight: 700;
}

/* Experience Terminal Layout */
.experience-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.experience-block {
    border-left: 3px solid #000000;
    padding-left: 16px;
}

.exp-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}

.exp-company {
    font-size: 0.82rem;
    color: #333;
}

.exp-title {
    font-size: 1.15rem;
    margin: 0 0 8px 0;
}

.exp-bullets {
    font-family: var(--font-mono);
    font-size: 0.86rem;
    line-height: 1.6;
    margin: 0;
    padding-left: 20px;
}

/* Skills Terminal Layout */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.skill-category {
    border: 1px solid #000000;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.4);
}

.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
}

.tag-cloud span {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    border: 1px solid #000000;
    padding: 3px 8px;
    background-color: #ffffff;
}

/* Contact Terminal Layout */
.contact-terminal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
}

.contact-box {
    border: 1px solid #000000;
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.4);
}

.contact-value {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    word-break: break-all;
}

/* Responsive */
@media (max-width: 900px) {
    .tape-statement {
        font-size: 1.15rem;
    }
    .hud-container {
        padding: 60px 16px 16px 16px;
    }
    .right-model-tabs {
        display: none;
    }
    .right-rail {
        display: none;
    }
    .bottom-hud-bar {
        margin-right: 0;
    }
    .about-grid {
        grid-template-columns: 1fr;
    }
}
</style>
