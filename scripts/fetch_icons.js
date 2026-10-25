import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.resolve(__dirname, '../public/icons')

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
}

const iconSources = [
    { name: 'react', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg' },
    { name: 'typescript', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg' },
    { name: 'javascript', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/javascript.svg' },
    { name: 'html5', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/html5.svg' },
    { name: 'css3', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/css3.svg' },
    { name: 'vue', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vuedotjs.svg' },
    { name: 'threejs', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/threedotjs.svg' },
    { name: 'wordpress', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wordpress.svg' },
    { name: 'postgresql', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postgresql.svg' },
    { name: 'supabase', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/supabase.svg' },
    { name: 'mysql', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg' },
    { name: 'dotnet', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dotnet.svg' },
    { name: 'csharp', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/csharp.svg' },
    { name: 'python', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg' },
    { name: 'php', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/php.svg' },
    { name: 'firebase', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/firebase.svg' },
    { name: 'googlecloud', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg' },
    { name: 'amazonaws', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg' },
    { name: 'docker', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg' },
    { name: 'kubernetes', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kubernetes.svg' },
    { name: 'github', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg' },
    { name: 'gitlab', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gitlab.svg' },
    { name: 'jenkins', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jenkins.svg' },
    { name: 'grafana', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/grafana.svg' },
    { name: 'pytorch', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pytorch.svg' },
    { name: 'jquery', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jquery.svg' },
    { name: 'bootstrap', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bootstrap.svg' },
    { name: 'meta', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/meta.svg' },
    { name: 'googlesheets', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlesheets.svg' },
    { name: 'google', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg' },
    { name: 'looker', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/looker.svg' },
    { name: 'powerbi', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/powerbi.svg' },
]

// Open source custom SVGs for Security / ClamAV, DataPrep, Analytics
const customIcons = {
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`,
    dataprep: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7-2h2v-4h4V8h-4V4h-2v4H9v2h4z"/></svg>`,
    analytics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`
}

async function run() {
    for (const [name, svgContent] of Object.entries(customIcons)) {
        fs.writeFileSync(path.join(iconsDir, `${name}.svg`), svgContent, 'utf-8')
        console.log(`Saved custom icon: ${name}.svg`)
    }

    for (const icon of iconSources) {
        try {
            const res = await fetch(icon.url)
            if (!res.ok) {
                console.warn(`Failed to fetch ${icon.name} from ${icon.url}: ${res.status}`)
                continue
            }
            let svgText = await res.text()
            // Turn it aesthetic pure black (#000000)
            if (!svgText.includes('fill=')) {
                svgText = svgText.replace('<svg ', '<svg fill="#000000" ')
            } else {
                svgText = svgText.replace(/fill="[^"]*"/g, 'fill="#000000"')
            }
            // Ensure width and height are clean
            svgText = svgText.replace(/<title>[^<]*<\/title>/g, '')

            fs.writeFileSync(path.join(iconsDir, `${icon.name}.svg`), svgText, 'utf-8')
            console.log(`Downloaded and stylized black SVG: ${icon.name}.svg`)
        } catch (e) {
            console.error(`Error processing ${icon.name}:`, e)
        }
    }
    console.log('All icons successfully processed!')
}

run()
