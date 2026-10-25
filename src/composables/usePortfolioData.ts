import { ref, computed } from 'vue'

export interface ProjectItem {
    id: string
    title: string
    badge: string
    subtitle: string
    description: string
    impact: string[]
    stack: string[]
}

export interface SkillItem {
    id: number | string
    name: string
    icon: string
}

export interface ExperienceItem {
    id: number | string
    period: string
    company: string
    title: string
    tag_color: string
    bullets: string[]
}

export interface EducationItem {
    id: number | string
    period?: string
    title: string
    subtitle: string
    description: string
}

export interface ProfileInfo {
    full_name: string
    role_title: string
    location: string
    status_badge: string
    statement_lines: string[]
    executive_summary: string
    email: string
    phone: string
    linkedin_url: string
}

const STORAGE_KEY = 'imanhakimi_portfolio_data'

// Initial Default Data (Preserves exact current content)
const defaultData = {
    profile: {
        full_name: 'MUHAMMAD IMAN HAKIMI',
        role_title: 'WEB & CLOUD DEVELOPER • SKUDAI, JOHOR',
        location: 'Skudai, Johor, Malaysia',
        status_badge: 'STATUS: AVAILABLE',
        statement_lines: [
            'DEVELOPMENT IS ALL ABOUT',
            'MOVEMENT.',
            'ONE PROJECT ENDS,',
            'ANOTHER BEGINS,',
            'AND THE RHYTHM NEVER STOPS.'
        ],
        executive_summary: 'Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS & Vue. Proved able to leverage technical platforms for data analytics by using Google Looker Studio to secure top 10 in Data Hackathon 2024. Created AI solutions utilizing LLaMA 3 and iterative dataset generation on AWS SageMaker AI.',
        email: 'hakimiiman342ab@gmail.com',
        phone: '',
        linkedin_url: 'https://www.linkedin.com/in/iman-hakimi-867a1b2a5/'
    },
    projects: [
        {
            id: 'siswa-rent',
            title: 'SISWA-RENT',
            badge: 'HACKATHON SUBMISSION',
            subtitle: 'Student Housing Discovery Platform',
            description: 'Siswa-Rent solves a practical, high-frequency problem: student housing discovery. It directly addresses the gap between how students naturally search and how current platforms force them to search.',
            impact: [
                'Reduced coding errors using TypeScript for safer, more reliable architecture.',
                'Architected database with PostgreSQL / Supabase, saving 2-3 hours weekly through clear documentation.'
            ],
            stack: ['React', 'TypeScript', 'HTML/CSS', 'PostgreSQL', 'Supabase']
        },
        {
            id: 'malware-detection',
            title: 'CSV MALWARE DETECTION',
            badge: 'SECURITY & AUTOMATION',
            subtitle: 'Automated Antivirus Dashboard Engine',
            description: 'A security system that detects malware embedded in uploaded CSV files using the ClamAV antivirus engine and displays telemetry in an administrative dashboard.',
            impact: [
                'Significantly reduced human error while reducing manual labor for office personnel.',
                'Containerized scanning queues using Docker with ASP.NET Core backend.'
            ],
            stack: ['ASP.NET Core', 'MySQL', 'Docker', 'ClamAV', 'jQuery', 'Bootstrap']
        },
        {
            id: 'polycc-llm',
            title: 'POLYCC LLM LEAGUE',
            badge: 'AI & CLOUD',
            subtitle: 'LLaMA 3 Fine-Tuning on AWS SageMaker',
            description: 'Engineered custom AI training and inference workflows using LLaMA 3 under competitive cloud scenarios, generating new iterations of datasets for fine-tuning.',
            impact: [
                'Deployed scalable LLaMA 3 models inside AWS SageMaker AI cloud environments.',
                'Automated dataset pipeline iterations and prompt evaluation workflows.'
            ],
            stack: ['Python', 'LLaMA 3', 'AWS SageMaker', 'PyTorch', 'DataPrep']
        },
        {
            id: 'data-hackathon',
            title: 'DATAHACKATHON 2024',
            badge: 'TOP 4 FINISH',
            subtitle: 'National Business Intelligence Analytics',
            description: 'Secured Top 4 national finish through interactive dataset preparation, predictive analytics, and executive dashboarding presented directly to industry judges.',
            impact: [
                'Built visual analytics dashboards using Google Looker Studio and Power BI.',
                'Delivered live technical findings to a professional evaluation panel.'
            ],
            stack: ['Google Looker Studio', 'Power BI', 'Google Sheets', 'Data Analytics']
        }
    ],
    skills: {
        frontend: [
            { id: 1, name: 'HTML5', icon: 'html5.svg' },
            { id: 2, name: 'CSS3', icon: 'css3.svg' },
            { id: 3, name: 'JavaScript', icon: 'javascript.svg' },
            { id: 4, name: 'TypeScript', icon: 'typescript.svg' },
            { id: 5, name: 'React JS', icon: 'react.svg' },
            { id: 6, name: 'Vue.js', icon: 'vue.svg' },
            { id: 7, name: 'TresJS 3D', icon: 'threejs.svg' },
            { id: 8, name: 'WordPress', icon: 'wordpress.svg' }
        ],
        backend: [
            { id: 9, name: 'PostgreSQL', icon: 'postgresql.svg' },
            { id: 10, name: 'Supabase', icon: 'supabase.svg' },
            { id: 11, name: 'MySQL', icon: 'mysql.svg' },
            { id: 12, name: 'ASP.NET Core', icon: 'dotnet.svg' },
            { id: 13, name: 'C#', icon: 'csharp.svg' },
            { id: 14, name: 'Python', icon: 'python.svg' },
            { id: 15, name: 'PHP', icon: 'php.svg' },
            { id: 16, name: 'Firebase', icon: 'firebase.svg' },
            { id: 17, name: 'Google Apps Script', icon: 'google.svg' }
        ],
        cloud: [
            { id: 18, name: 'GCP Cloud Run', icon: 'googlecloud.svg' },
            { id: 19, name: 'AWS SageMaker AI', icon: 'amazonaws.svg' },
            { id: 20, name: 'Docker', icon: 'docker.svg' },
            { id: 21, name: 'Kubernetes', icon: 'kubernetes.svg' },
            { id: 22, name: 'GitHub / GitLab', icon: 'github.svg' },
            { id: 23, name: 'Jenkins', icon: 'jenkins.svg' },
            { id: 24, name: 'Grafana', icon: 'grafana.svg' }
        ]
    },
    experiences: [
        {
            id: 1,
            period: '1 OCTOBER 2026 - PRESENT',
            company: 'UNIVERSITI TEKNOLOGI MALAYSIA',
            title: 'Assistant Administrative Officer (MySTEP)',
            tag_color: 'red',
            bullets: [
                'Structured and cleansed datasets in Google Sheets to ensure data integrity for automated Google Apps Script workflows.',
                'Designed and built responsive WordPress page layouts for university events, embedding custom HTML and CSS.'
            ]
        },
        {
            id: 2,
            period: 'MARCH - JULY 2026',
            company: 'UTM DIGITAL, UNIVERSITI TEKNOLOGI MALAYSIA',
            title: 'Information Technology Intern',
            tag_color: 'black',
            bullets: [
                'Collaborated with network team to diagnose and resolve hardware faults on wireless access points and point-to-point links.',
                'Developed Google Apps Script automations that streamlined recurring team workflows, reducing manual processing time by 35%.',
                'Built Power BI reports for data analytics, turning raw operational data into visual insights for team decision-making.',
                'Migrated CRUD operations from a legacy ASP.NET Web Forms/MVC application to ASP.NET Core.'
            ]
        }
    ],
    education: [
        {
            id: 1,
            period: '2023 - 2026',
            title: 'Polytechnic Mersing Johor',
            subtitle: 'Diploma in Information Technology — Networking Track (CGPA 3.07)',
            description: ''
        }
    ],
    certifications: [
        {
            id: 2,
            title: 'CAE Cloud Service Associate (CCSA)',
            subtitle: 'Siri Number: DEJ1SQMK8Q',
            description: 'Trained on cloud platform deployments, cloud service monitoring, IAM User governance, and scalable web hosting.'
        }
    ]
}

// Global Singleton State
const profile = ref<ProfileInfo>(defaultData.profile)
const projects = ref<ProjectItem[]>(defaultData.projects)
const skills = ref<{ frontend: SkillItem[]; backend: SkillItem[]; cloud: SkillItem[] }>(defaultData.skills)
const experiences = ref<ExperienceItem[]>(defaultData.experiences)
const education = ref<EducationItem[]>(defaultData.education)
const certifications = ref<EducationItem[]>(defaultData.certifications)

const isDbConnected = ref(false)
const isLoading = ref(false)
const isLoaded = ref(false)
const lastSaved = ref<Date | null>(null)
const availableIcons = ref<{ name: string; filename: string; url: string }[]>([])

// Built-in map for fast lookup (uses /tech-icons/ to bypass Apache /icons/ alias collisions)
const techIconMap: Record<string, string> = {
    'react': '/tech-icons/react.svg',
    'react js': '/tech-icons/react.svg',
    'typescript': '/tech-icons/typescript.svg',
    'javascript': '/tech-icons/javascript.svg',
    'html': '/tech-icons/html5.svg',
    'html5': '/tech-icons/html5.svg',
    'html/css': '/tech-icons/html5.svg',
    'css': '/tech-icons/css3.svg',
    'css3': '/tech-icons/css3.svg',
    'vue': '/tech-icons/vue.svg',
    'vue.js': '/tech-icons/vue.svg',
    'threejs': '/tech-icons/threejs.svg',
    'tresjs 3d': '/tech-icons/threejs.svg',
    'wordpress': '/tech-icons/wordpress.svg',
    'postgresql': '/tech-icons/postgresql.svg',
    'supabase': '/tech-icons/supabase.svg',
    'mysql': '/tech-icons/mysql.svg',
    'asp.net core': '/tech-icons/dotnet.svg',
    'dotnet': '/tech-icons/dotnet.svg',
    'c#': '/tech-icons/csharp.svg',
    'csharp': '/tech-icons/csharp.svg',
    'python': '/tech-icons/python.svg',
    'php': '/tech-icons/php.svg',
    'firebase': '/tech-icons/firebase.svg',
    'google apps script': '/tech-icons/google.svg',
    'clamav': '/tech-icons/shield.svg',
    'gcp cloud run': '/tech-icons/googlecloud.svg',
    'google cloud': '/tech-icons/googlecloud.svg',
    'aws sagemaker': '/tech-icons/amazonaws.svg',
    'aws sagemaker ai': '/tech-icons/amazonaws.svg',
    'docker': '/tech-icons/docker.svg',
    'kubernetes': '/tech-icons/kubernetes.svg',
    'github / gitlab': '/tech-icons/github.svg',
    'github': '/tech-icons/github.svg',
    'gitlab': '/tech-icons/gitlab.svg',
    'jenkins': '/tech-icons/jenkins.svg',
    'grafana': '/tech-icons/grafana.svg',
    'pytorch': '/tech-icons/pytorch.svg',
    'jquery': '/tech-icons/jquery.svg',
    'bootstrap': '/tech-icons/bootstrap.svg',
    'llama 3': '/tech-icons/meta.svg',
    'meta': '/tech-icons/meta.svg',
    'google sheets': '/tech-icons/googlesheets.svg',
    'google looker studio': '/tech-icons/looker.svg',
    'looker': '/tech-icons/looker.svg',
    'power bi': '/tech-icons/powerbi.svg',
    'dataprep': '/tech-icons/dataprep.svg',
    'data analytics': '/tech-icons/analytics.svg'
}

export function usePortfolioData() {
    // Resolve icon URL from skill/tech name or file name
    const getTechIcon = (nameOrFile: string): string => {
        if (!nameOrFile) return '/tech-icons/dataprep.svg'
        if (nameOrFile.endsWith('.svg')) {
            if (nameOrFile.startsWith('/icons/')) {
                return nameOrFile.replace('/icons/', '/tech-icons/')
            }
            return nameOrFile.startsWith('/') ? nameOrFile : '/tech-icons/' + nameOrFile
        }
        const key = nameOrFile.toLowerCase().trim()
        if (techIconMap[key]) return techIconMap[key]

        // Check in availableIcons
        const found = availableIcons.value.find(i => i.name.toLowerCase() === key)
        if (found) return found.url

        return '/tech-icons/dataprep.svg'
    }

    // Load initial data from localStorage or API
    const loadData = async () => {
        if (isLoaded.value) return
        isLoading.value = true

        // 1. Check local storage first for instant render
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem(STORAGE_KEY)
                if (cached) {
                    const parsed = JSON.parse(cached)
                    if (parsed.profile) profile.value = parsed.profile
                    if (parsed.projects) projects.value = parsed.projects
                    if (parsed.skills) skills.value = parsed.skills
                    if (parsed.experiences) experiences.value = parsed.experiences
                    if (parsed.education) education.value = parsed.education
                    if (parsed.certifications) certifications.value = parsed.certifications
                }
            } catch (e) {
                console.warn('Could not parse cached portfolio data', e)
            }
        }

        // 2. Fetch from PHP API
        try {
            const res = await fetch('/api/data.php')
            if (res.ok) {
                const json = await res.json()
                if (json.success && json.data) {
                    isDbConnected.value = !!json.database_connected
                    if (json.data.profile) profile.value = json.data.profile
                    if (json.data.projects) projects.value = json.data.projects
                    if (json.data.skills) skills.value = json.data.skills
                    if (json.data.experiences) experiences.value = json.data.experiences
                    if (json.data.education) education.value = json.data.education
                    if (json.data.certifications) certifications.value = json.data.certifications

                    // Cache to localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data))
                    }
                }
            }
        } catch (err) {
            console.info('API data fetch skipped or offline, using fallback state.')
        }

        // 3. Fetch available icons list
        try {
            const iconRes = await fetch('/api/icons.php')
            if (iconRes.ok) {
                const iconJson = await iconRes.json()
                if (iconJson.success && iconJson.icons) {
                    availableIcons.value = iconJson.icons
                }
            }
        } catch (e) {
            // offline icons list fallback
        }

        isLoading.value = false
        isLoaded.value = true
    }

    // Save data via PHP backend API and local store
    const saveData = async (section: string = 'all'): Promise<{ success: boolean; message: string }> => {
        const payload = {
            profile: profile.value,
            projects: projects.value,
            skills: skills.value,
            experiences: experiences.value,
            education: education.value,
            certifications: certifications.value,
        }

        // Save to browser localStorage immediately
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        }

        // Sync with PHP backend
        try {
            const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null
            const res = await fetch(`/api/data.php?section=${section}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            })

            const json = await res.json()
            lastSaved.value = new Date()
            if (json.success) {
                if (json.source === 'mysql') isDbConnected.value = true
                return { success: true, message: json.message || 'Saved to MySQL database successfully!' }
            } else {
                return { success: false, message: json.error || 'Failed to save to database' }
            }
        } catch (e: any) {
            return {
                success: true,
                message: 'Saved to local cache. (When deployed on cPanel/Plesk with MySQL, changes will sync directly into your database).'
            }
        }
    }

    // Reset to defaults
    const resetToDefaults = () => {
        profile.value = JSON.parse(JSON.stringify(defaultData.profile))
        projects.value = JSON.parse(JSON.stringify(defaultData.projects))
        skills.value = JSON.parse(JSON.stringify(defaultData.skills))
        experiences.value = JSON.parse(JSON.stringify(defaultData.experiences))
        education.value = JSON.parse(JSON.stringify(defaultData.education))
        certifications.value = JSON.parse(JSON.stringify(defaultData.certifications))
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    return {
        profile,
        projects,
        skills,
        experiences,
        education,
        certifications,
        availableIcons,
        isDbConnected,
        isLoading,
        lastSaved,
        loadData,
        saveData,
        resetToDefaults,
        getTechIcon
    }
}
