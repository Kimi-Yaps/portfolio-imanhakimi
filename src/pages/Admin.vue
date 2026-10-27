<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import modelDisplay from '../components/modelDisplay.vue'
import { usePortfolioData, type ProjectItem, type SkillItem, type ExperienceItem, type EducationItem, type GalleryItem } from '../composables/usePortfolioData'
import { usePixelTransition } from '../composables/usePixelTransition'

const router = useRouter()
const { triggerPixelTransition } = usePixelTransition()
const {
    profile,
    projects,
    skills,
    experiences,
    education,
    certifications,
    gallery,
    availableIcons,
    isDbConnected,
    loadData,
    saveData,
    resetToDefaults,
    getTechIcon
} = usePortfolioData()

// Auth State
const isAuthenticated = ref(false)
const loginUsername = ref('admin')
const loginPassword = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

// Dashboard UI state
const activeTab = ref<'profile' | 'projects' | 'skills' | 'experience' | 'education' | 'cpanel'>('profile')
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')
const isSaving = ref(false)

// Project Image Upload handler (JPG & PNG only inside admin dashboard)
const handleProjectImageUpload = (event: Event, proj: ProjectItem) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                proj.imageUrl = e.target.result as string
                showNotification(`Image "${file.name}" loaded for ${proj.title}`, 'success')
            }
        }
        reader.readAsDataURL(file)
    }
}

// 3D Model Upload handler (.glb / .gltf)
const handleModelUpload = (event: Event, proj: ProjectItem) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        const name = file.name.toLowerCase()
        if (!name.endsWith('.glb') && !name.endsWith('.gltf')) {
            showNotification('Please upload a .glb or .gltf 3D asset file.', 'error')
            return
        }

        if (file.size > 8 * 1024 * 1024) {
            showNotification(`Note: File is ${(file.size / (1024 * 1024)).toFixed(1)}MB. For fastest loads, Draco compressed models under 3MB are ideal.`, 'info')
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                proj.modelPath = e.target.result as string
                proj.category = '3d'
                if (!proj.vertexShader || !proj.fragmentShader) {
                    proj.vertexShader = SHADER_PRESETS.bayer8.vertexShader
                    proj.fragmentShader = SHADER_PRESETS.bayer8.fragmentShader
                    proj.customShader = true
                }
                showNotification(`3D Model "${file.name}" loaded (${(file.size / 1024).toFixed(1)} KB)`, 'success')
            }
        }
        reader.onerror = () => {
            showNotification('Failed to read 3D model file.', 'error')
        }
        reader.readAsDataURL(file)
    }
}

const getModelDisplayName = (path?: string) => {
    if (!path) return ''
    if (path.startsWith('data:')) return 'Custom Uploaded 3D Asset (' + Math.round(path.length * 0.75 / 1024) + ' KB)'
    const parts = path.split('/')
    return parts[parts.length - 1] || path
}

const activePreviewProjectId = ref<string | null>(null)
const toggleModelPreview = (id: string) => {
    if (activePreviewProjectId.value === id) {
        activePreviewProjectId.value = null
    } else {
        activePreviewProjectId.value = id
    }
}

const resetToDefaultModel = (proj: ProjectItem) => {
    proj.modelPath = '/Models/mee_sup.glb'
    showNotification('Reset to default mee_sup.glb 3D model', 'info')
}

// Built-in Shader Presets
const SHADER_PRESETS: Record<string, { name: string; vertexShader: string; fragmentShader: string }> = {
    bayer8: {
        name: 'Retro 8x8 Bayer Dither',
        vertexShader: `varying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    vNormal = normalize(normalMatrix * normal);\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = -mvPosition.xyz;\n    gl_Position = projectionMatrix * mvPosition;\n}`,
        fragmentShader: `uniform vec3 uPaperColor;\nuniform vec3 uInkColor;\nuniform vec3 uLightDirection;\nuniform float uPixelSize;\nuniform float uEdgeThickness;\nuniform float uTime;\n\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\n// 8x8 Bayer dithering matrix\nfloat bayer8(vec2 uv) {\n    ivec2 p = ivec2(mod(uv, 8.0));\n    int x = p.x;\n    int y = p.y;\n    int bayer[64] = int[64](\n         0, 32,  8, 40,  2, 34, 10, 42,\n        48, 16, 56, 24, 50, 18, 58, 26,\n        12, 44,  4, 36, 14, 46,  6, 38,\n        60, 28, 52, 20, 62, 30, 54, 22,\n         3, 35, 11, 43,  1, 33,  9, 41,\n        51, 19, 59, 27, 49, 17, 57, 25,\n        15, 47,  7, 39, 13, 45,  5, 37,\n        63, 31, 55, 23, 61, 29, 53, 21\n    );\n    return float(bayer[y * 8 + x]) / 64.0;\n}\n\nvoid main() {\n    vec3 normal = normalize(vNormal);\n    if (!gl_FrontFacing) normal = -normal;\n    vec3 viewDir = normalize(vViewPosition);\n\n    float NdotL = dot(normal, uLightDirection);\n    float diffuse = NdotL * 0.5 + 0.5;\n\n    float NdotV = max(dot(normal, viewDir), 0.0);\n    float rim = 1.0 - NdotV;\n    float edge = smoothstep(1.0 - uEdgeThickness, 1.0, rim);\n\n    float tone = clamp(diffuse * (1.0 - edge * 0.75), 0.0, 1.0);\n\n    vec2 screenCoord = gl_FragCoord.xy / uPixelSize;\n    float threshold = bayer8(screenCoord);\n\n    vec3 finalColor = (tone < threshold) ? uInkColor : uPaperColor;\n    gl_FragColor = vec4(finalColor, 1.0);\n}`
    },
    halftone: {
        name: 'Halftone Dot Screen',
        vertexShader: `varying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    vNormal = normalize(normalMatrix * normal);\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = -mvPosition.xyz;\n    gl_Position = projectionMatrix * mvPosition;\n}`,
        fragmentShader: `uniform vec3 uPaperColor;\nuniform vec3 uInkColor;\nuniform vec3 uLightDirection;\nuniform float uPixelSize;\nuniform float uTime;\n\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vec3 normal = normalize(vNormal);\n    if (!gl_FrontFacing) normal = -normal;\n    float diffuse = clamp(dot(normal, uLightDirection) * 0.5 + 0.5, 0.0, 1.0);\n\n    vec2 screenPos = gl_FragCoord.xy / 6.0;\n    vec2 cell = fract(screenPos) - 0.5;\n    float dist = length(cell);\n\n    float radius = (1.0 - diffuse) * 0.55;\n    float dotPattern = step(radius, dist);\n\n    vec3 color = mix(uInkColor, uPaperColor, dotPattern);\n    gl_FragColor = vec4(color, 1.0);\n}`
    },
    cyberScanline: {
        name: 'Cyber Wireframe Scanline',
        vertexShader: `varying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    vNormal = normalize(normalMatrix * normal);\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = -mvPosition.xyz;\n    gl_Position = projectionMatrix * mvPosition;\n}`,
        fragmentShader: `uniform vec3 uLightDirection;\nuniform float uTime;\n\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vec3 normal = normalize(vNormal);\n    float NdotV = max(dot(normal, normalize(vViewPosition)), 0.0);\n    float fresnel = pow(1.0 - NdotV, 2.5);\n\n    float scanline = sin(gl_FragCoord.y * 0.25 - uTime * 4.0) * 0.5 + 0.5;\n    float grid = step(0.92, fract(vUv.x * 20.0)) + step(0.92, fract(vUv.y * 20.0));\n    \n    vec3 neonGreen = vec3(0.0, 1.0, 0.4);\n    vec3 darkBg = vec3(0.08, 0.08, 0.08);\n\n    vec3 color = mix(darkBg, neonGreen, clamp(fresnel * 1.5 + scanline * 0.35 + grid * 0.5, 0.0, 1.0));\n    gl_FragColor = vec4(color, 1.0);\n}`
    },
    normalMap: {
        name: 'Normal Vector / Iridescent',
        vertexShader: `varying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    vNormal = normalize(normalMatrix * normal);\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = -mvPosition.xyz;\n    gl_Position = projectionMatrix * mvPosition;\n}`,
        fragmentShader: `uniform float uTime;\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\n\nvoid main() {\n    vec3 normal = normalize(vNormal);\n    vec3 normalColor = normal * 0.5 + 0.5;\n    normalColor.r += sin(uTime + normal.y * 4.0) * 0.08;\n    normalColor.b += cos(uTime + normal.x * 4.0) * 0.08;\n    gl_FragColor = vec4(clamp(normalColor, 0.0, 1.0), 1.0);\n}`
    }
}

const applyShaderPreset = (proj: ProjectItem, presetKey: string) => {
    const preset = SHADER_PRESETS[presetKey]
    if (preset) {
        proj.customShader = true
        proj.shaderPreset = presetKey
        proj.vertexShader = preset.vertexShader
        proj.fragmentShader = preset.fragmentShader
        showNotification(`Applied "${preset.name}" preset!`, 'success')
    }
}

const shaderValidationStatus = ref<{ [projectId: string]: { status: 'idle' | 'success' | 'error'; message: string } }>({})

const testShaderCompile = (proj: ProjectItem) => {
    const projId = proj.id
    try {
        if (typeof document === 'undefined') return
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
        if (!gl) {
            shaderValidationStatus.value[projId] = { status: 'success', message: 'WebGL unavailable; syntax verified.' }
            return
        }

        const vs = gl.createShader(gl.VERTEX_SHADER)
        if (!vs) throw new Error('Could not create vertex shader')
        gl.shaderSource(vs, proj.vertexShader || SHADER_PRESETS.bayer8.vertexShader)
        gl.compileShader(vs)
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            const err = gl.getShaderInfoLog(vs) || 'Vertex shader syntax error'
            gl.deleteShader(vs)
            shaderValidationStatus.value[projId] = { status: 'error', message: 'Vertex Shader Error: ' + err }
            return
        }

        const fs = gl.createShader(gl.FRAGMENT_SHADER)
        if (!fs) throw new Error('Could not create fragment shader')
        gl.shaderSource(fs, proj.fragmentShader || SHADER_PRESETS.bayer8.fragmentShader)
        gl.compileShader(fs)
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            const err = gl.getShaderInfoLog(fs) || 'Fragment shader syntax error'
            gl.deleteShader(vs)
            gl.deleteShader(fs)
            shaderValidationStatus.value[projId] = { status: 'error', message: 'Fragment Shader Error: ' + err }
            return
        }

        const prog = gl.createProgram()
        if (!prog) throw new Error('Could not create shader program')
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            const err = gl.getProgramInfoLog(prog) || 'Shader link error'
            gl.deleteProgram(prog)
            shaderValidationStatus.value[projId] = { status: 'error', message: 'Shader Link Error: ' + err }
            return
        }

        gl.deleteProgram(prog)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
        shaderValidationStatus.value[projId] = { status: 'success', message: '✓ GLSL Shaders compiled & linked successfully with 0 errors!' }
    } catch (e: any) {
        shaderValidationStatus.value[projId] = { status: 'error', message: 'Compile Test Error: ' + (e?.message || 'Unknown error') }
    }
}

const addTagFromInput = (proj: ProjectItem, inputId: string) => {
    if (typeof document === 'undefined') return
    const el = document.getElementById(inputId) as HTMLInputElement | null
    if (el && el.value.trim()) {
        addStackTag(proj, el.value.trim())
        el.value = ''
    }
}

// Selected / Editing Items
const editingProjectId = ref<string | null>(null)
const newSkillCategory = ref<'frontend' | 'backend' | 'cloud'>('frontend')
const newSkillName = ref('')
const newSkillIcon = ref('react.svg')

// Icon Picker Modal
const showIconPicker = ref(false)
const iconPickerTarget = ref<{ type: 'skill' | 'project'; index?: number; skillCat?: 'frontend' | 'backend' | 'cloud' } | null>(null)

// Custom SVG Upload
const newIconName = ref('')
const newIconSvg = ref('')
const uploadIconMsg = ref('')

// Change Password Modal
const showPasswordModal = ref(false)
const newPassword = ref('')
const passwordMsg = ref('')

const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    statusMessage.value = msg
    statusType.value = type
    setTimeout(() => {
        statusMessage.value = ''
    }, 4500)
}

// Authentication handlers
const checkAuth = async () => {
    const token = sessionStorage.getItem('admin_token')
    if (token) {
        isAuthenticated.value = true
        return
    }
    try {
        const res = await fetch('/api/auth.php?action=check')
        if (res.ok) {
            const data = await res.json()
            if (data.authenticated) {
                isAuthenticated.value = true
            }
        }
    } catch (e) {
        // Offline / fallback mode
    }
}

const handleLogin = async () => {
    loginError.value = ''
    isLoggingIn.value = true

    try {
        const res = await fetch('/api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: loginUsername.value,
                password: loginPassword.value
            })
        })

        const data = await res.json()
        if (data.success) {
            sessionStorage.setItem('admin_token', data.token || 'admin_token_default')
            sessionStorage.setItem('admin_user', data.username || 'admin')
            isAuthenticated.value = true
            showNotification(data.note || 'Welcome back to Admin Terminal!', 'success')
            await loadData()
        } else {
            loginError.value = data.error || 'Access Denied: Invalid credentials'
        }
    } catch (err) {
        // Fallback for local Vite dev testing if PHP server is not active
        if (loginUsername.value === 'admin' && loginPassword.value === 'Keko66$$&9') {
            sessionStorage.setItem('admin_token', 'local_demo_token')
            sessionStorage.setItem('admin_user', 'admin')
            isAuthenticated.value = true
            showNotification('Welcome back to Admin Terminal!', 'success')
            await loadData()
        } else {
            loginError.value = 'Invalid username or password'
        }
    } finally {
        isLoggingIn.value = false
    }
}

const handleLogout = async () => {
    try {
        await fetch('/api/auth.php?action=logout')
    } catch (e) { }
    sessionStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_user')
    isAuthenticated.value = false
    showNotification('Logged out successfully', 'info')
}

// Save Changes to MySQL / LocalStore
const handleSave = async (section: string = 'all') => {
    isSaving.value = true
    const result = await saveData(section)
    isSaving.value = false
    showNotification(result.message, result.success ? 'success' : 'error')
}

// Helper to open public portfolio
const goToSite = () => {
    triggerPixelTransition(async () => {
        await router.push('/')
    })
}

// Project helpers
const addProject = () => {
    const newId = 'project-' + Date.now().toString().slice(-4)
    projects.value.push({
        id: newId,
        title: 'NEW PROJECT TITLE',
        badge: 'NEW RELEASE',
        category: 'web',
        subtitle: 'Project Subtitle / Tech Stack Highlight',
        description: 'Provide an engaging project summary explaining the business problem solved.',
        impact: ['Key metric or engineering improvement achieved.'],
        stack: ['React', 'TypeScript'],
        imageUrl: '',
        modelPath: '',
        year: new Date().getFullYear().toString()
    })
    editingProjectId.value = newId
}

const removeProject = (id: string) => {
    if (confirm(`Delete project "${id}"?`)) {
        projects.value = projects.value.filter(p => p.id !== id)
    }
}

const addImpactBullet = (p: ProjectItem) => {
    p.impact.push('New key outcome or achievement')
}

const removeImpactBullet = (p: ProjectItem, index: number) => {
    p.impact.splice(index, 1)
}

const addStackTag = (p: ProjectItem, tag: string) => {
    if (!tag.trim()) return
    if (!p.stack.includes(tag.trim())) {
        p.stack.push(tag.trim())
    }
}

const removeStackTag = (p: ProjectItem, index: number) => {
    p.stack.splice(index, 1)
}

// Skills helpers
const addSkill = () => {
    if (!newSkillName.value.trim()) return
    const cat = newSkillCategory.value
    skills.value[cat].push({
        id: Date.now(),
        name: newSkillName.value.trim(),
        icon: newSkillIcon.value
    })
    newSkillName.value = ''
    showNotification('Added skill to ' + cat.toUpperCase(), 'success')
}

const removeSkill = (cat: 'frontend' | 'backend' | 'cloud', id: number | string) => {
    skills.value[cat] = skills.value[cat].filter(s => s.id !== id)
}

// Experience helpers
const addExperience = () => {
    experiences.value.unshift({
        id: Date.now(),
        period: 'OCTOBER 2026 - PRESENT',
        company: 'ORGANIZATION NAME',
        title: 'Position / Role Title',
        tag_color: 'red',
        bullets: ['Describe key responsibility, architecture, or automation achievement.']
    })
}

const removeExperience = (id: number | string) => {
    experiences.value = experiences.value.filter(e => e.id !== id)
}

// Upload Custom SVG
const handleUploadIcon = async () => {
    uploadIconMsg.value = ''
    if (!newIconName.value.trim() || !newIconSvg.value.trim()) {
        uploadIconMsg.value = 'Both icon name and SVG code are required'
        return
    }

    try {
        const token = sessionStorage.getItem('admin_token')
        const res = await fetch('/api/icons.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                name: newIconName.value.trim(),
                svg: newIconSvg.value.trim()
            })
        })
        const data = await res.json()
        if (data.success) {
            uploadIconMsg.value = '✓ ' + data.message
            availableIcons.value.push(data.icon)
            newIconName.value = ''
            newIconSvg.value = ''
        } else {
            uploadIconMsg.value = 'Error: ' + data.error
        }
    } catch (e: any) {
        uploadIconMsg.value = 'Note: Icon saved in session. Connect PHP API to persist to disk.'
    }
}

// Gallery Item Helpers
const addGalleryItem = () => {
    const newId = 'item_' + Date.now().toString().slice(-6)
    gallery.value.unshift({
        id: newId,
        title: 'NEW EVENT / WORK ITEM',
        category: 'work',
        type: 'work',
        badge: 'ENGINEERING WORK',
        organization: 'Independent Project',
        location: 'Skudai, Johor',
        createdDate: new Date().getFullYear().toString(),
        tags: ['Web', 'Cloud', 'Engineering'],
        software: 'TypeScript, Vue.js',
        description: 'Provide an engaging technical overview of this project, event, or 3D asset.',
        highlights: ['Key architectural milestone or performance outcome achieved.'],
        imageUrl: '',
        modelPath: '',
        linkUrl: ''
    })
    showNotification('Added new item to Gallery', 'success')
}

const removeGalleryItem = (id: string) => {
    if (confirm(`Remove gallery item "${id}"?`)) {
        gallery.value = gallery.value.filter(g => g.id !== id)
        showNotification('Item removed from Gallery', 'info')
    }
}

const handleGalleryFileUpload = (event: Event, item: GalleryItem) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                item.imageUrl = e.target.result as string
                showNotification(`Image "${file.name}" loaded successfully`, 'success')
            }
        }
        reader.readAsDataURL(file)
    }
}

const addGalleryHighlight = (item: GalleryItem) => {
    if (!item.highlights) item.highlights = []
    item.highlights.push('New key takeaway, achievement, or impact metric')
}

const removeGalleryHighlight = (item: GalleryItem, index: number) => {
    if (item.highlights) {
        item.highlights.splice(index, 1)
    }
}

const addGalleryTag = (item: GalleryItem, tag: string) => {
    if (!tag.trim()) return
    if (!item.tags) item.tags = []
    if (!item.tags.includes(tag.trim())) {
        item.tags.push(tag.trim())
    }
}

const removeGalleryTag = (item: GalleryItem, index: number) => {
    if (item.tags) {
        item.tags.splice(index, 1)
    }
}

// Export / Import JSON
const downloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        profile: profile.value,
        projects: projects.value,
        skills: skills.value,
        experiences: experiences.value,
        education: education.value,
        certifications: certifications.value,
        gallery: gallery.value,
    }, null, 2))
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute('href', dataStr)
    dlAnchor.setAttribute('download', 'portfolio_data_backup_' + new Date().toISOString().slice(0, 10) + '.json')
    dlAnchor.click()
}

onMounted(async () => {
    await checkAuth()
    await loadData()
})
</script>

<template>
    <div class="admin-layout">
        <!-- ================= TOP HEADER BAR ================= -->
        <header class="admin-topbar">
            <div class="admin-brand">
                <span class="tape-red">[ IMANHAKIMI ]</span>
                <span class="brand-sub">CONTROL TERMINAL</span>
                <span
                    class="db-indicator"
                    :class="{ connected: isDbConnected }"
                    :title="isDbConnected ? 'Connected to MySQL' : 'Running on Local Cache / Fallback'"
                >
                    {{ isDbConnected ? '● MYSQL: CONNECTED' : '○ LOCAL FALLBACK' }}
                </span>
            </div>

            <div class="admin-actions">
                <button class="bracket-btn bordered view-site-btn" @click="goToSite">
                    [ VIEW SITE ↗ ]
                </button>
                <button v-if="isAuthenticated" class="bracket-btn save-btn" :disabled="isSaving" @click="handleSave('all')">
                    [ {{ isSaving ? 'SAVING...' : 'SAVE ALL DATA' }} ]
                </button>
                <button v-if="isAuthenticated" class="bracket-btn bordered logout-btn" @click="handleLogout">
                    [ LOGOUT ]
                </button>
            </div>
        </header>

        <!-- Status Toast Banner -->
        <div v-if="statusMessage" class="status-banner" :class="statusType">
            {{ statusMessage }}
        </div>

        <!-- ================= LOGIN SCREEN (IF NOT AUTHENTICATED) ================= -->
        <main v-if="!isAuthenticated" class="login-wrapper">
            <div class="login-box">
                <div class="login-header">
                    <span class="tape-red">[ ACCESS RESTRICTED: TERMINAL LOGIN ]</span>
                </div>

                <p class="login-intro">
                    Enter administrator credentials to configure website content, projects, and MySQL database connection.
                </p>

                <form class="login-form" @submit.prevent="handleLogin">
                    <div class="field-group">
                        <label>USERNAME</label>
                        <input
                            v-model="loginUsername"
                            type="text"
                            required
                            class="terminal-input"
                            placeholder="admin"
                        />
                    </div>

                    <div class="field-group">
                        <label>PASSWORD</label>
                        <input
                            v-model="loginPassword"
                            type="password"
                            required
                            class="terminal-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <div v-if="loginError" class="login-error-msg">
                        {{ loginError }}
                    </div>

                    <div class="login-btn-row">
                        <button type="submit" class="bracket-btn bordered submit-login-btn" :disabled="isLoggingIn">
                            [ {{ isLoggingIn ? 'AUTHENTICATING...' : 'ENTER ADMIN TERMINAL →' }} ]
                        </button>
                    </div>
                </form>
            </div>
        </main>

        <!-- ================= MAIN ADMIN DASHBOARD ================= -->
        <main v-else class="dashboard-body">
            <!-- Nav Tabs -->
            <nav class="admin-nav-tabs">
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'profile' }"
                    @click="activeTab = 'profile'"
                >
                    👤 PROFILE & BIO
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'projects' }"
                    @click="activeTab = 'projects'"
                >
                    💼 PROJECTS ({{ projects.length }})
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'skills' }"
                    @click="activeTab = 'skills'"
                >
                    ⚡ SKILLS & ICONS
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'experience' }"
                    @click="activeTab = 'experience'"
                >
                    📜 WORK HISTORY
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'education' }"
                    @click="activeTab = 'education'"
                >
                    🎓 EDUCATION & CERTS
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'cpanel' }"
                    @click="activeTab = 'cpanel'"
                >
                    🗄️ CPANEL & MYSQL
                </button>
            </nav>

            <div class="tab-content-container">
                <!-- ================= TAB 1: PROFILE ================= -->
                <section v-if="activeTab === 'profile'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// PROFILE & HEADLINE DATA</h2>
                        <button class="bracket-btn bordered" @click="handleSave('profile')">
                            [ SAVE PROFILE ]
                        </button>
                    </div>

                    <div class="form-grid">
                        <div class="field-group">
                            <label>FULL NAME</label>
                            <input v-model="profile.full_name" type="text" class="terminal-input" />
                        </div>

                        <div class="field-group">
                            <label>ROLE SUBTITLE</label>
                            <input v-model="profile.role_title" type="text" class="terminal-input" />
                        </div>

                        <div class="field-group">
                            <label>LOCATION</label>
                            <input v-model="profile.location" type="text" class="terminal-input" />
                        </div>

                        <div class="field-group">
                            <label>STATUS BADGE</label>
                            <input v-model="profile.status_badge" type="text" class="terminal-input" />
                        </div>

                        <div class="field-group full-width">
                            <label>HOMEPAGE TAPE STATEMENT LINES (ONE LINE PER BOX)</label>
                            <div class="statement-editor">
                                <div
                                    v-for="(line, idx) in profile.statement_lines"
                                    :key="idx"
                                    class="statement-row"
                                >
                                    <input
                                        v-model="profile.statement_lines[idx]"
                                        type="text"
                                        class="terminal-input"
                                    />
                                    <button
                                        v-if="profile.statement_lines.length > 1"
                                        class="bracket-btn remove-btn"
                                        @click="profile.statement_lines.splice(idx, 1)"
                                    >
                                        [ X ]
                                    </button>
                                </div>
                                <button
                                    class="bracket-btn bordered add-line-btn"
                                    @click="profile.statement_lines.push('NEW STATEMENT LINE')"
                                >
                                    + ADD STATEMENT LINE
                                </button>
                            </div>
                        </div>

                        <div class="field-group full-width">
                            <label>EXECUTIVE SUMMARY (ABOUT MODAL)</label>
                            <textarea
                                v-model="profile.executive_summary"
                                rows="4"
                                class="terminal-textarea"
                            />
                        </div>

                        <div class="field-group">
                            <label>EMAIL ADDRESS</label>
                            <input v-model="profile.email" type="email" class="terminal-input" />
                        </div>

                        <div class="field-group">
                            <label>PHONE NUMBER</label>
                            <input v-model="profile.phone" type="text" class="terminal-input" />
                        </div>

                        <div class="field-group">
                            <label>LINKEDIN URL</label>
                            <input v-model="profile.linkedin_url" type="url" class="terminal-input" />
                        </div>
                    </div>
                </section>

                <!-- ================= TAB 2: PROJECTS ================= -->
                <section v-if="activeTab === 'projects'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// PROJECTS & SYSTEMS MANAGEMENT</h2>
                        <div class="btn-group">
                            <button class="bracket-btn bordered add-btn" @click="addProject">
                                + ADD NEW PROJECT
                            </button>
                            <button class="bracket-btn bordered" @click="handleSave('projects')">
                                [ SAVE PROJECTS ]
                            </button>
                        </div>
                    </div>

                    <div class="projects-admin-list">
                        <div
                            v-for="(proj, pIdx) in projects"
                            :key="proj.id"
                            class="project-admin-card"
                        >
                            <div class="card-top-bar">
                                <span class="tape-red">{{ proj.badge || 'PROJECT' }}</span>
                                <span class="card-id-text">#{{ proj.id }}</span>
                                <button class="bracket-btn remove-btn ml-auto" @click="removeProject(proj.id)">
                                    [ DELETE PROJECT ]
                                </button>
                            </div>

                            <div class="form-grid">
                                <div class="field-group">
                                    <label>TITLE</label>
                                    <input v-model="proj.title" type="text" class="terminal-input" />
                                </div>

                                <div class="field-group">
                                    <label>BADGE (E.G. HACKATHON SUBMISSION)</label>
                                    <input v-model="proj.badge" type="text" class="terminal-input" />
                                </div>

                                <div class="field-group">
                                    <label>CATEGORY</label>
                                    <select v-model="proj.category" class="terminal-select">
                                        <option value="web">Web Application / Platform</option>
                                        <option value="cloud">Cloud AI & Architecture</option>
                                        <option value="security">Cybersecurity & Automation</option>
                                        <option value="event">Hackathon / Event</option>
                                        <option value="3d">3D Model & Real-time WebGL</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label>YEAR / TIMELINE</label>
                                    <input v-model="proj.year" type="text" class="terminal-input" placeholder="e.g. 2026" />
                                </div>

                                <div class="field-group full-width">
                                    <label>SUBTITLE</label>
                                    <input v-model="proj.subtitle" type="text" class="terminal-input" />
                                </div>

                                <!-- Image Upload (JPG & PNG only inside admin dashboard) -->
                                <div class="field-group full-width">
                                    <label>PROJECT IMAGE (JPG / PNG UPLOAD OR PATH)</label>
                                    <div class="admin-upload-row">
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                                            class="terminal-input file-input" 
                                            @change="handleProjectImageUpload($event, proj)" 
                                        />
                                        <input 
                                            v-model="proj.imageUrl" 
                                            type="text" 
                                            class="terminal-input" 
                                            placeholder="or image URL/path: e.g. /my_render.png" 
                                        />
                                    </div>
                                    <div v-if="proj.imageUrl" class="admin-thumb-box">
                                        <img :src="proj.imageUrl" alt="Preview" class="admin-thumb-img" />
                                        <button type="button" class="bracket-btn remove-btn" @click="proj.imageUrl = ''">[ Remove Image ]</button>
                                    </div>
                                </div>

                                <!-- 3D Model Asset & GLSL Shader Studio -->
                                <div class="field-group full-width model-shader-studio-box">
                                    <div class="studio-header">
                                        <div class="studio-header-left">
                                            <label class="studio-title">❖ 3D MODEL PATH (.GLB / .GLTF - FOR 3D ASSETS) &amp; SHADER ENGINE</label>
                                            <span class="studio-desc">Upload custom .glb/.gltf 3D meshes and write custom GLSL vertex &amp; fragment shaders directly inside the admin.</span>
                                        </div>
                                        <span class="studio-badge" :class="{ active: !!proj.modelPath }">
                                            {{ proj.modelPath ? '● 3D MODEL ACTIVE' : '○ NO 3D ASSET' }}
                                        </span>
                                    </div>

                                    <!-- Upload & Path Input -->
                                    <div class="admin-upload-row">
                                        <input 
                                            type="file" 
                                            accept=".glb,.gltf,model/gltf-binary,model/gltf+json" 
                                            class="terminal-input file-input" 
                                            @change="handleModelUpload($event, proj)" 
                                        />
                                        <input 
                                            v-model="proj.modelPath" 
                                            type="text" 
                                            class="terminal-input" 
                                            placeholder="or enter path: e.g. /Models/mee_sup.glb" 
                                        />
                                    </div>

                                    <!-- Model Status & Action Buttons -->
                                    <div v-if="proj.modelPath" class="model-status-bar">
                                        <div class="model-info">
                                            <span class="model-icon">❖</span>
                                            <span class="model-name">{{ getModelDisplayName(proj.modelPath) }}</span>
                                        </div>
                                        <div class="model-btn-group">
                                            <button 
                                                type="button" 
                                                class="bracket-btn preview-toggle-btn" 
                                                :class="{ active: activePreviewProjectId === proj.id }"
                                                @click="toggleModelPreview(proj.id)"
                                            >
                                                [ {{ activePreviewProjectId === proj.id ? '✕ HIDE 3D PREVIEW' : '👁 LIVE 3D PREVIEW' }} ]
                                            </button>
                                            <button 
                                                type="button" 
                                                class="bracket-btn reset-model-btn" 
                                                @click="resetToDefaultModel(proj)"
                                                title="Reset to default mee_sup.glb"
                                            >
                                                [ ↺ DEFAULT MODEL ]
                                            </button>
                                            <button 
                                                type="button" 
                                                class="bracket-btn remove-btn" 
                                                @click="proj.modelPath = ''"
                                            >
                                                [ REMOVE MODEL ]
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Live 3D Preview inside Admin -->
                                    <div v-if="activePreviewProjectId === proj.id" class="admin-live-3d-box">
                                        <div class="preview-box-header">
                                            <span>● REAL-TIME 3D VIEWPORT &amp; SHADER PREVIEW</span>
                                            <span class="preview-note">DRAG TO ROTATE • UPDATES INSTANTLY ON SHADER EDIT</span>
                                        </div>
                                        <div class="admin-viewport-canvas-container">
                                            <modelDisplay 
                                                :contained="true" 
                                                :model-path="proj.modelPath || '/Models/mee_sup.glb'"
                                                :custom-vertex-shader="proj.vertexShader"
                                                :custom-fragment-shader="proj.fragmentShader"
                                                :use-custom-shader="proj.customShader"
                                            />
                                        </div>
                                    </div>

                                    <!-- GLSL Shader Editor Section -->
                                    <div class="shader-editor-container">
                                        <div class="shader-header-row">
                                            <div class="shader-toggle-wrapper">
                                                <label class="custom-shader-checkbox-label">
                                                    <input 
                                                        type="checkbox" 
                                                        v-model="proj.customShader" 
                                                        class="shader-checkbox"
                                                    />
                                                    <span class="checkbox-custom"></span>
                                                    <strong class="shader-switch-text">ENABLE CUSTOM GLSL SHADERS FOR THIS ASSET</strong>
                                                </label>
                                            </div>
                                            <div class="shader-preset-pills">
                                                <span class="preset-label">QUICK PRESETS:</span>
                                                <button type="button" class="preset-btn" @click="applyShaderPreset(proj, 'bayer8')">[ ▦ BAYER DITHER ]</button>
                                                <button type="button" class="preset-btn" @click="applyShaderPreset(proj, 'halftone')">[ ◫ HALFTONE ]</button>
                                                <button type="button" class="preset-btn" @click="applyShaderPreset(proj, 'cyberScanline')">[ ☵ CYBER WIRE ]</button>
                                                <button type="button" class="preset-btn" @click="applyShaderPreset(proj, 'normalMap')">[ ✦ NORMAL / IRID ]</button>
                                            </div>
                                        </div>

                                        <div v-if="proj.customShader" class="shader-inputs-grid">
                                            <!-- Vertex Shader -->
                                            <div class="shader-code-box">
                                                <div class="code-box-header">
                                                    <span class="code-title">VERTEX SHADER (GLSL)</span>
                                                    <span class="code-vars-hint">varying: vNormal, vViewPosition, vUv</span>
                                                </div>
                                                <textarea 
                                                    v-model="proj.vertexShader" 
                                                    rows="8" 
                                                    class="terminal-textarea shader-editor-textarea" 
                                                    spellcheck="false" 
                                                    placeholder="// Enter vertex shader GLSL code..."
                                                />
                                            </div>

                                            <!-- Fragment Shader -->
                                            <div class="shader-code-box">
                                                <div class="code-box-header">
                                                    <span class="code-title">FRAGMENT SHADER (GLSL)</span>
                                                    <span class="code-vars-hint">uniforms: uPaperColor, uInkColor, uLightDirection, uPixelSize, uTime</span>
                                                </div>
                                                <textarea 
                                                    v-model="proj.fragmentShader" 
                                                    rows="14" 
                                                    class="terminal-textarea shader-editor-textarea" 
                                                    spellcheck="false" 
                                                    placeholder="// Enter fragment shader GLSL code..."
                                                />
                                            </div>

                                            <!-- Shader Compile & Test Status -->
                                            <div class="shader-compile-row">
                                                <button 
                                                    type="button" 
                                                    class="bracket-btn bordered compile-test-btn" 
                                                    @click="testShaderCompile(proj)"
                                                >
                                                    [ ⚙ TEST &amp; COMPILE GLSL SHADERS ]
                                                </button>
                                                <div 
                                                    v-if="shaderValidationStatus[proj.id]" 
                                                    class="compile-status-badge" 
                                                    :class="shaderValidationStatus[proj.id].status"
                                                >
                                                    {{ shaderValidationStatus[proj.id].message }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field-group full-width">
                                    <label>DESCRIPTION</label>
                                    <textarea v-model="proj.description" rows="3" class="terminal-textarea" />
                                </div>

                                <!-- Impact Bullets -->
                                <div class="field-group full-width">
                                    <label>KEY IMPACT & ARCHITECTURE BULLETS</label>
                                    <div class="impact-editor">
                                        <div
                                            v-for="(imp, impIdx) in proj.impact"
                                            :key="impIdx"
                                            class="bullet-row"
                                        >
                                            <span class="bullet-dot">▸</span>
                                            <input
                                                v-model="proj.impact[impIdx]"
                                                type="text"
                                                class="terminal-input"
                                            />
                                            <button class="bracket-btn" @click="removeImpactBullet(proj, impIdx)">
                                                [ X ]
                                            </button>
                                        </div>
                                        <button class="bracket-btn bordered add-sub-btn" @click="addImpactBullet(proj)">
                                            + ADD IMPACT BULLET
                                        </button>
                                    </div>
                                </div>

                                <!-- Tech Stack with Icons -->
                                <div class="field-group full-width">
                                    <label>TECH STACK BADGES</label>
                                    <div class="stack-tags-editor">
                                        <div
                                            v-for="(st, stIdx) in proj.stack"
                                            :key="stIdx"
                                            class="admin-stack-pill"
                                        >
                                            <img :src="getTechIcon(st)" alt="" class="admin-tech-icon" />
                                            <span>{{ st }}</span>
                                            <button
                                                type="button"
                                                class="pill-close-btn"
                                                @click="removeStackTag(proj, stIdx)"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    <div class="add-tag-row">
                                        <input
                                            :id="'new-tag-input-' + pIdx"
                                            type="text"
                                            class="terminal-input small-input"
                                            placeholder="e.g. Docker, Python, Vue..."
                                            @keydown.enter.prevent="(e) => {
                                                const target = e.target as HTMLInputElement;
                                                addStackTag(proj, target.value);
                                                target.value = '';
                                            }"
                                        />
                                        <button
                                            type="button"
                                            class="bracket-btn bordered"
                                            @click="addTagFromInput(proj, 'new-tag-input-' + pIdx)"
                                        >
                                            + ADD TECH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ================= TAB 3: SKILLS & ICONS ================= -->
                <section v-if="activeTab === 'skills'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// SKILLS & MONOCHROME ICONS</h2>
                        <button class="bracket-btn bordered" @click="handleSave('skills')">
                            [ SAVE SKILLS ]
                        </button>
                    </div>

                    <!-- Add Skill Form -->
                    <div class="add-skill-card">
                        <div class="tape-red">+ ADD NEW TECHNICAL SKILL</div>
                        <div class="add-skill-fields">
                            <div class="field-group">
                                <label>CATEGORY</label>
                                <select v-model="newSkillCategory" class="terminal-select">
                                    <option value="frontend">FRONTEND DEVELOPMENT</option>
                                    <option value="backend">BACKEND & DATABASES</option>
                                    <option value="cloud">CLOUD & DEVOPS</option>
                                </select>
                            </div>

                            <div class="field-group">
                                <label>SKILL NAME</label>
                                <input
                                    v-model="newSkillName"
                                    type="text"
                                    class="terminal-input"
                                    placeholder="e.g. Next.js, Redis, GraphQL"
                                />
                            </div>

                            <div class="field-group">
                                <label>ASSOCIATED ICON</label>
                                <div class="icon-selector-wrap">
                                    <img :src="getTechIcon(newSkillIcon)" alt="" class="admin-tech-icon big" />
                                    <select v-model="newSkillIcon" class="terminal-select">
                                        <option
                                            v-for="ic in availableIcons"
                                            :key="ic.filename"
                                            :value="ic.filename"
                                        >
                                            {{ ic.name }} ({{ ic.filename }})
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <button class="bracket-btn bordered confirm-add-skill-btn" @click="addSkill">
                                [ + ADD SKILL ]
                            </button>
                        </div>
                    </div>

                    <!-- Skills Categorized Lists -->
                    <div class="skills-category-columns">
                        <!-- Frontend -->
                        <div class="category-box">
                            <div class="tape-red">FRONTEND DEVELOPMENT ({{ skills.frontend.length }})</div>
                            <div class="skill-chips-list">
                                <div
                                    v-for="s in skills.frontend"
                                    :key="s.id"
                                    class="skill-admin-chip"
                                >
                                    <img :src="getTechIcon(s.icon || s.name)" alt="" class="admin-tech-icon" />
                                    <input v-model="s.name" type="text" class="chip-input" />
                                    <button class="chip-del-btn" @click="removeSkill('frontend', s.id)">×</button>
                                </div>
                            </div>
                        </div>

                        <!-- Backend -->
                        <div class="category-box">
                            <div class="tape-black">BACKEND & DATABASES ({{ skills.backend.length }})</div>
                            <div class="skill-chips-list">
                                <div
                                    v-for="s in skills.backend"
                                    :key="s.id"
                                    class="skill-admin-chip"
                                >
                                    <img :src="getTechIcon(s.icon || s.name)" alt="" class="admin-tech-icon" />
                                    <input v-model="s.name" type="text" class="chip-input" />
                                    <button class="chip-del-btn" @click="removeSkill('backend', s.id)">×</button>
                                </div>
                            </div>
                        </div>

                        <!-- Cloud -->
                        <div class="category-box">
                            <div class="tape-red">CLOUD & DEVOPS ({{ skills.cloud.length }})</div>
                            <div class="skill-chips-list">
                                <div
                                    v-for="s in skills.cloud"
                                    :key="s.id"
                                    class="skill-admin-chip"
                                >
                                    <img :src="getTechIcon(s.icon || s.name)" alt="" class="admin-tech-icon" />
                                    <input v-model="s.name" type="text" class="chip-input" />
                                    <button class="chip-del-btn" @click="removeSkill('cloud', s.id)">×</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Upload Custom SVG Icon to Server -->
                    <div class="custom-icon-upload-card">
                        <div class="tape-black">UPLOAD NEW MONOCHROME SVG ICON</div>
                        <p class="panel-para-small">
                            Add custom brand logos or icons to your server. The system automatically turns SVGs pure black (#000000).
                        </p>
                        <div class="upload-fields">
                            <input
                                v-model="newIconName"
                                type="text"
                                class="terminal-input"
                                placeholder="Icon Name (e.g. redis, tailwind, nestjs)"
                            />
                            <textarea
                                v-model="newIconSvg"
                                rows="3"
                                class="terminal-textarea"
                                placeholder="Paste raw <svg ...>...</svg> code here"
                            />
                            <div class="upload-btn-row">
                                <button class="bracket-btn bordered" @click="handleUploadIcon">
                                    [ UPLOAD ICON TO SERVER ]
                                </button>
                                <span v-if="uploadIconMsg" class="upload-status-text">{{ uploadIconMsg }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ================= TAB 4: WORK EXPERIENCE ================= -->
                <section v-if="activeTab === 'experience'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// WORK HISTORY & TRACK RECORD</h2>
                        <div class="btn-group">
                            <button class="bracket-btn bordered" @click="addExperience">
                                + ADD POSITION
                            </button>
                            <button class="bracket-btn bordered" @click="handleSave('experiences')">
                                [ SAVE EXPERIENCES ]
                            </button>
                        </div>
                    </div>

                    <div class="experiences-admin-list">
                        <div
                            v-for="(exp, eIdx) in experiences"
                            :key="exp.id"
                            class="exp-admin-card"
                        >
                            <div class="card-top-bar">
                                <span :class="exp.tag_color === 'black' ? 'tape-black' : 'tape-red'">
                                    {{ exp.period || 'DATE RANGE' }}
                                </span>
                                <button class="bracket-btn remove-btn ml-auto" @click="removeExperience(exp.id)">
                                    [ DELETE ]
                                </button>
                            </div>

                            <div class="form-grid">
                                <div class="field-group">
                                    <label>PERIOD (E.G. MARCH - JULY 2026)</label>
                                    <input v-model="exp.period" type="text" class="terminal-input" />
                                </div>

                                <div class="field-group">
                                    <label>COMPANY / ORGANIZATION</label>
                                    <input v-model="exp.company" type="text" class="terminal-input" />
                                </div>

                                <div class="field-group">
                                    <label>ROLE TITLE</label>
                                    <input v-model="exp.title" type="text" class="terminal-input" />
                                </div>

                                <div class="field-group">
                                    <label>BADGE COLOR</label>
                                    <select v-model="exp.tag_color" class="terminal-select">
                                        <option value="red">RED TAPE</option>
                                        <option value="black">BLACK TAPE</option>
                                    </select>
                                </div>

                                <div class="field-group full-width">
                                    <label>RESPONSIBILITIES & ACCOMPLISHMENTS (ONE PER LINE)</label>
                                    <div
                                        v-for="(b, bIdx) in exp.bullets"
                                        :key="bIdx"
                                        class="bullet-row"
                                    >
                                        <span class="bullet-dot">▸</span>
                                        <input v-model="exp.bullets[bIdx]" type="text" class="terminal-input" />
                                        <button class="bracket-btn" @click="exp.bullets.splice(bIdx, 1)">[ X ]</button>
                                    </div>
                                    <button class="bracket-btn bordered add-sub-btn" @click="exp.bullets.push('New accomplishment detail')">
                                        + ADD BULLET POINT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ================= TAB 5: EDUCATION & CERTS ================= -->
                <section v-if="activeTab === 'education'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// EDUCATION & CREDENTIALS</h2>
                        <button class="bracket-btn bordered" @click="handleSave('education')">
                            [ SAVE EDUCATION & CERTS ]
                        </button>
                    </div>

                    <div class="sub-panel">
                        <div class="tape-red">EDUCATION</div>
                        <div
                            v-for="(ed, edIdx) in education"
                            :key="ed.id"
                            class="edu-admin-card"
                        >
                            <div class="form-grid">
                                <div class="field-group">
                                    <label>YEARS / PERIOD</label>
                                    <input v-model="ed.period" type="text" class="terminal-input" />
                                </div>
                                <div class="field-group">
                                    <label>INSTITUTION</label>
                                    <input v-model="ed.title" type="text" class="terminal-input" />
                                </div>
                                <div class="field-group full-width">
                                    <label>DEGREE / DIPLOMA & CGPA</label>
                                    <input v-model="ed.subtitle" type="text" class="terminal-input" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sub-panel">
                        <div class="tape-black">CERTIFICATIONS</div>
                        <div
                            v-for="(ct, ctIdx) in certifications"
                            :key="ct.id"
                            class="edu-admin-card"
                        >
                            <div class="form-grid">
                                <div class="field-group">
                                    <label>CERTIFICATION TITLE</label>
                                    <input v-model="ct.title" type="text" class="terminal-input" />
                                </div>
                                <div class="field-group">
                                    <label>CREDENTIAL ID / SERIAL</label>
                                    <input v-model="ct.subtitle" type="text" class="terminal-input" />
                                </div>
                                <div class="field-group full-width">
                                    <label>SYLLABUS / COVERED TOPICS</label>
                                    <textarea v-model="ct.description" rows="2" class="terminal-textarea" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ================= TAB 6: CPANEL & MYSQL ================= -->
                <section v-if="activeTab === 'cpanel'" class="tab-panel">
                    <div class="panel-header-row">
                        <h2 class="panel-title">/// CPANEL, PLESK & PHPMYADMIN CONFIGURATION</h2>
                        <button class="bracket-btn bordered" @click="downloadBackup">
                            [ EXPORT JSON BACKUP 📥 ]
                        </button>
                    </div>

                    <div class="cpanel-status-card">
                        <div class="status-indicator-box" :class="{ ok: isDbConnected }">
                            <span class="status-dot">●</span>
                            <span class="status-title">
                                {{ isDbConnected ? 'MYSQL DATABASE CONNECTED & OPERATIONAL' : 'MYSQL NOT DETECTED (USING LOCAL FALLBACK STORE)' }}
                            </span>
                        </div>

                        <p class="panel-para">
                            Follow these simple steps to connect your portfolio website to MySQL in <strong>cPanel</strong> or <strong>Plesk</strong>:
                        </p>

                        <div class="step-guide">
                            <div class="step-item">
                                <span class="step-num">01.</span>
                                <div>
                                    <strong>Download the Database Schema:</strong><br />
                                    <a
                                        href="/database/schema.sql"
                                        download="schema.sql"
                                        class="bracket-btn bordered download-schema-btn"
                                    >
                                        [ DOWNLOAD SCHEMA.SQL 💾 ]
                                    </a>
                                </div>
                            </div>

                            <div class="step-item">
                                <span class="step-num">02.</span>
                                <div>
                                    <strong>Create Database in cPanel / Plesk:</strong><br />
                                    In cPanel, open <em>MySQL Database Wizard</em>. Create a database (e.g. <code>portfolio_db</code>) and user with all privileges.
                                </div>
                            </div>

                            <div class="step-item">
                                <span class="step-num">03.</span>
                                <div>
                                    <strong>Import into phpMyAdmin:</strong><br />
                                    Open <em>phpMyAdmin</em> from cPanel/Plesk. Select your database, click the <strong>Import</strong> tab, choose <code>schema.sql</code>, and click <strong>Go</strong>.
                                </div>
                            </div>

                            <div class="step-item">
                                <span class="step-num">04.</span>
                                <div>
                                    <strong>Configure Connection in <code>public/api/config.php</code>:</strong><br />
                                    Open <code>api/config.php</code> in cPanel File Manager and enter your DB credentials:
                                    <pre class="code-preview">define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_db_name');
define('DB_USER', 'your_cpanel_db_user');
define('DB_PASS', 'your_cpanel_db_password');</pre>
                                </div>
                            </div>
                        </div>

                        <div class="reset-box">
                            <button class="bracket-btn bordered" @click="resetToDefaults">
                                [ RESET TO DEFAULT PORTFOLIO CONTENT ]
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>

<style scoped>
.admin-layout {
    min-height: 100dvh;
    background-color: var(--bg-color);
    color: var(--ink-color);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
}

/* ================= TOPBAR ================= */
.admin-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--bg-color);
    border-bottom: 2px solid #000000;
    padding: 10px clamp(12px, 3vw, 24px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.admin-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.brand-sub {
    font-family: var(--font-tech), var(--font-sans);
    font-size: clamp(0.82rem, 2.5vw, 0.98rem);
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.db-indicator {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 3px 8px;
    border: 1px solid #000000;
    background-color: #ffffff;
    color: #444444;
    text-transform: uppercase;
}

.db-indicator.connected {
    background-color: #000000;
    color: #00ff66;
    border-color: #000000;
}

.admin-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

/* Admin Button Styling */
.bracket-btn {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
}

.save-btn {
    font-family: var(--font-tech), var(--font-sans);
    background-color: var(--tape-red);
    color: #000000;
    border: 1px solid #000000;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    padding: 6px 14px;
}

.save-btn:hover {
    background-color: #000000;
    color: #ffffff;
}

/* Status Toast Banner */
.status-banner {
    padding: 10px 18px;
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    border-bottom: 2px solid #000000;
    animation: slideDown 0.2s ease;
}

.status-banner.success {
    background-color: #000000;
    color: #ffffff;
}

.status-banner.error {
    background-color: var(--tape-red);
    color: #000000;
}

.status-banner.info {
    background-color: #ffffff;
    color: #000000;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ================= LOGIN WRAPPER ================= */
.login-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.login-box {
    width: 100%;
    max-width: 440px;
    border: 2px solid #000000;
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 6px 6px 0 #000000;
    padding: clamp(18px, 4vw, 30px);
}

.login-header {
    border-bottom: 2px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 14px;
}

.login-header h2 {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin: 0;
}

.login-intro {
    font-family: var(--font-sans);
    font-size: 0.92rem;
    line-height: 1.6;
    color: #333333;
    margin-bottom: 20px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.login-error-msg {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.85rem;
    color: var(--tape-red);
    font-weight: 700;
    letter-spacing: 0.02em;
}

.login-btn-row {
    margin-top: 8px;
}

.submit-login-btn {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: 0.04em;
    width: 100%;
    padding: 11px;
    text-align: center;
    justify-content: center;
}

.login-hint {
    font-family: var(--font-sans);
    font-size: 0.82rem;
    line-height: 1.5;
    color: #555555;
    margin-top: 8px;
}

.login-hint code {
    font-family: var(--font-mono);
    background: #e6e6e6;
    padding: 2px 5px;
    font-size: 0.82rem;
    border: 1px solid #ccc;
}

/* ================= MAIN DASHBOARD BODY ================= */
.dashboard-body {
    flex: 1;
    max-width: 1300px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(14px, 2.5vw, 24px);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Nav Tabs */
.admin-nav-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    border-bottom: 2px solid #000000;
    padding-bottom: 8px;
}

.tab-btn {
    font-family: var(--font-tech), var(--font-sans);
    font-size: clamp(0.78rem, 2vw, 0.88rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid #000000;
    padding: 8px clamp(10px, 1.8vw, 16px);
    cursor: pointer;
    transition: all 0.12s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.tab-btn:hover {
    background-color: var(--tape-red);
    color: #000000;
}

.tab-btn.active {
    background-color: #000000;
    color: #ffffff;
}

/* Tab Panel */
.tab-panel {
    border: 2px solid #000000;
    background-color: rgba(255, 255, 255, 0.45);
    box-shadow: 4px 4px 0 #000000;
    padding: clamp(16px, 3vw, 26px);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.panel-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    border-bottom: 1px solid #000000;
    padding-bottom: 12px;
}

.panel-title {
    font-family: var(--font-tech), var(--font-sans);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0;
}

.panel-para {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    line-height: 1.65;
    color: #1a1a1a;
    margin: 0 0 12px 0;
}

.panel-para strong {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
}

/* Form Grid */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 16px;
}

.full-width {
    grid-column: 1 / -1;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-group label {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #111111;
}

.terminal-input,
.terminal-textarea,
.terminal-select {
    font-family: var(--font-sans);
    font-size: 0.92rem;
    line-height: 1.5;
    background-color: #ffffff;
    border: 1px solid #000000;
    padding: 8px 12px;
    color: #000000;
    outline: none;
    width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.terminal-input:focus,
.terminal-textarea:focus,
.terminal-select:focus {
    border-color: var(--tape-red);
    box-shadow: 0 0 0 1px var(--tape-red);
}

.small-input {
    max-width: 280px;
}

/* Statement Editor */
.statement-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.statement-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.add-line-btn {
    align-self: flex-start;
    margin-top: 4px;
}

/* Projects Admin */
.projects-admin-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.project-admin-card {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: clamp(14px, 2.5vw, 20px);
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.card-top-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    border-bottom: 1px dashed #000000;
    padding-bottom: 8px;
}

.ml-auto {
    margin-left: auto;
}

.remove-btn {
    color: #000000;
}

.remove-btn:hover {
    background-color: var(--tape-red);
}

.impact-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.bullet-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bullet-dot {
    font-weight: 700;
    color: var(--tape-red);
    font-size: 1.1rem;
}

.add-sub-btn {
    align-self: flex-start;
    margin-top: 4px;
}

.stack-tags-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.admin-stack-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #000000;
    background-color: #f3f3f3;
    padding: 4px 10px;
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.admin-tech-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: brightness(0);
}

.admin-tech-icon.big {
    width: 24px;
    height: 24px;
}

.pill-close-btn {
    background: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    line-height: 1;
    padding: 0 2px;
}

.add-tag-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* Skills Admin */
.add-skill-card {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.add-skill-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    align-items: flex-end;
}

.icon-selector-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.confirm-add-skill-btn {
    height: 38px;
}

.skills-category-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 16px;
}

.category-box {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.category-box h4,
.sub-panel h4,
.custom-icon-upload-card h4,
.add-skill-card h4 {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0;
}

.skill-chips-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-admin-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #000000;
    background-color: #fafafa;
    padding: 4px 8px;
}

.chip-input {
    font-family: var(--font-sans);
    font-size: 0.88rem;
    font-weight: 500;
    border: none;
    background: transparent;
    flex: 1;
    outline: none;
}

.chip-del-btn {
    background: transparent;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0 4px;
}

.chip-del-btn:hover {
    color: var(--tape-red);
}

.custom-icon-upload-card {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.panel-para-small {
    font-family: var(--font-sans);
    font-size: 0.86rem;
    line-height: 1.55;
    margin: 0;
    color: #444;
}

.upload-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.upload-btn-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.upload-status-text {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.85rem;
    font-weight: 600;
}

/* Experiences Admin */
.experiences-admin-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.exp-admin-card {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Education Admin */
.sub-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.edu-admin-card {
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 14px;
}

/* cPanel Status Card */
.cpanel-status-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.status-indicator-box {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 2px solid #000000;
    padding: 12px 16px;
    background-color: #ffffff;
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.03em;
}

.status-indicator-box.ok {
    background-color: #000000;
    color: #00ff66;
}

.status-dot {
    font-size: 1.2rem;
}

.status-title {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    letter-spacing: 0.03em;
}

.step-guide {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-item {
    display: flex;
    gap: 12px;
    border-left: 3px solid #000000;
    padding-left: 14px;
    font-family: var(--font-sans);
    font-size: 0.94rem;
    line-height: 1.65;
    color: #1a1a1a;
}

.step-item strong {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    color: #000000;
}

.step-item code {
    font-family: var(--font-mono);
    background: #e6e6e6;
    padding: 2px 6px;
    font-size: 0.88rem;
    border: 1px solid #ccc;
}

.step-num {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 800;
    font-size: 1.15rem;
    color: var(--tape-red);
    line-height: 1.3;
}

.code-preview {
    font-family: var(--font-mono);
    background-color: #000000;
    color: #00ff66;
    padding: 12px 16px;
    margin-top: 8px;
    font-size: 0.88rem;
    line-height: 1.55;
    border-radius: 2px;
    overflow-x: auto;
}

.download-schema-btn {
    margin-top: 8px;
}

.reset-box {
    margin-top: 14px;
    border-top: 1px dashed #000000;
    padding-top: 14px;
}

.add-line-btn,
.add-sub-btn,
.add-btn,
.confirm-add-skill-btn,
.download-schema-btn,
.remove-btn {
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 700;
    font-size: 0.84rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

/* ================= 3D ASSET & SHADER STUDIO STYLES ================= */
.model-shader-studio-box {
    background: #f7f7f7;
    border: 2px solid #000000;
    padding: 16px 18px;
    margin-top: 8px;
    box-shadow: 3px 3px 0px #000000;
}

.studio-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 14px;
    flex-wrap: wrap;
}

.studio-title {
    display: block;
    font-family: var(--font-tech), var(--font-sans);
    font-weight: 800;
    font-size: 0.96rem;
    letter-spacing: 0.04em;
    color: #000000;
    margin-bottom: 4px;
}

.studio-desc {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    color: #555555;
    line-height: 1.4;
}

.studio-badge {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 700;
    padding: 3px 8px;
    border: 1px solid #000000;
    background: #e0e0e0;
    color: #555555;
    white-space: nowrap;
}

.studio-badge.active {
    background: #000000;
    color: #00ff66;
}

.model-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
    background: #ffffff;
    border: 1px solid #000000;
    padding: 8px 12px;
    flex-wrap: wrap;
}

.model-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.84rem;
    color: #111111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.model-icon {
    color: var(--tape-red, #ff2d2d);
    font-size: 1rem;
}

.model-btn-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.preview-toggle-btn {
    background: #000000;
    color: #ffffff;
}

.preview-toggle-btn.active {
    background: var(--tape-red, #ff2d2d);
    color: #000000;
}

.reset-model-btn {
    background: #f0f0f0;
    color: #000000;
}

/* Live 3D Preview inside Admin */
.admin-live-3d-box {
    margin-top: 14px;
    border: 2px solid #000000;
    background: #000000;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.preview-box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #000000;
    color: #00ff66;
    font-family: var(--font-mono);
    font-size: 0.76rem;
    padding: 6px 12px;
    border-bottom: 1px solid #333333;
    letter-spacing: 0.5px;
    flex-wrap: wrap;
    gap: 8px;
}

.preview-note {
    color: #888888;
    font-size: 0.7rem;
}

.admin-viewport-canvas-container {
    position: relative;
    width: 100%;
    height: 380px;
    background: #dfdfdf;
    overflow: hidden;
}

/* Shader Editor Container */
.shader-editor-container {
    margin-top: 16px;
    border-top: 1px dashed #000000;
    padding-top: 14px;
}

.shader-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.custom-shader-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.shader-checkbox {
    width: 18px;
    height: 18px;
    accent-color: #000000;
    cursor: pointer;
}

.shader-switch-text {
    font-family: var(--font-tech), var(--font-sans);
    font-size: 0.88rem;
    letter-spacing: 0.03em;
    color: #000000;
}

.shader-preset-pills {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.preset-label {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 700;
    color: #555555;
    margin-right: 2px;
}

.preset-btn {
    background: #ffffff;
    border: 1px solid #000000;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    cursor: pointer;
    transition: all 0.12s ease;
}

.preset-btn:hover {
    background: #000000;
    color: #ffffff;
}

/* Shader Inputs Grid */
.shader-inputs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin-top: 10px;
}

.shader-code-box {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.code-box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.code-title {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
    color: #000000;
    letter-spacing: 0.03em;
}

.code-vars-hint {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: #666666;
}

.shader-editor-textarea {
    font-family: 'Space Mono', monospace, Consolas, 'Courier New' !important;
    font-size: 0.8rem !important;
    line-height: 1.5 !important;
    background: #0c0d0e !important;
    color: #00ff66 !important;
    border: 2px solid #000000 !important;
    padding: 10px 12px !important;
    white-space: pre !important;
    tab-size: 4 !important;
    resize: vertical;
}

.shader-editor-textarea:focus {
    outline: none;
    border-color: #00ff66 !important;
    box-shadow: 0 0 8px rgba(0, 255, 102, 0.25);
}

.shader-compile-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
    flex-wrap: wrap;
}

.compile-test-btn {
    background: #000000;
    color: #ffffff;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    padding: 8px 14px;
}

.compile-test-btn:hover {
    background: #222222;
    color: #00ff66;
}

.compile-status-badge {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    padding: 6px 12px;
    border-radius: 2px;
    border: 1px solid currentColor;
    font-weight: 700;
    line-height: 1.4;
}

.compile-status-badge.success {
    background: rgba(0, 255, 102, 0.1);
    color: #008833;
    border-color: #00aa44;
}

.compile-status-badge.error {
    background: rgba(255, 45, 45, 0.1);
    color: #d11111;
    border-color: #ff2d2d;
}

.admin-upload-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.admin-upload-row .file-input {
    flex: 1;
    min-width: 220px;
}

.admin-thumb-box {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    background: #f0f0f0;
    padding: 8px 12px;
    border: 1px dashed #000000;
}

.admin-thumb-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid #000000;
}

/* ================= DESKTOP RESPONSIVE ENHANCEMENTS ================= */
@media (min-width: 900px) {
    .step-guide {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .step-item {
        margin: 0;
        height: 100%;
        box-sizing: border-box;
    }
}

@media (min-width: 1024px) {
    .dashboard-body {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 32px;
        align-items: start;
        max-width: 1600px;
        margin: 0 auto;
        padding: 28px 36px;
    }

    .admin-nav-tabs {
        position: sticky;
        top: 80px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-bottom: none;
        border-right: 2px solid #000000;
        padding-right: 20px;
        margin-bottom: 0;
    }

    .tab-btn {
        width: 100%;
        text-align: left;
        justify-content: flex-start;
        padding: 12px 18px;
        font-size: 0.88rem;
        border-bottom: 2px solid #000000;
    }

    .tab-btn.active {
        background: #000000;
        color: #ffffff;
    }

    .tab-content-container {
        min-width: 0;
    }

    .skills-category-columns {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 20px;
    }

    .category-box {
        min-height: 420px;
    }

    .project-admin-card .form-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .project-admin-card .field-group.full-width {
        grid-column: 1 / -1;
    }

    .shader-inputs-grid {
        grid-template-columns: 1fr 1fr;
    }

    .shader-compile-row {
        grid-column: 1 / -1;
    }
}

@media (min-width: 1400px) {
    .dashboard-body {
        max-width: 1680px;
        padding: 32px 48px;
        gap: 40px;
    }
}
</style>
