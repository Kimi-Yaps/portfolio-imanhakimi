import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')

const SITE_URL = 'https://imanhakimi.com'

const routes = [
  {
    path: '/',
    title: 'Muhammad Iman Hakimi | Creative & Cloud Developer',
    description: 'Portfolio of Muhammad Iman Hakimi - Creative Web & Cloud Developer based in Skudai, Johor. Specializing in Vue.js, React, Cloud AI (AWS SageMaker, LLaMA 3), and Cybersecurity. Top 4 National Data Hackathon 2024.',
    canonical: `${SITE_URL}/`,
    bodyHtml: `
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">[ IMANHAKIMI.COM ]</a>
        <a href="/projects">[ PROJECTS ]</a>
        <a href="/about">[ ABOUT ]</a>
        <a href="/blog">[ BLOG ]</a>
        <a href="mailto:hakimiiman342ab@gmail.com">[ HIRE ME ↗ ]</a>
      </nav>
    </header>
    <main>
      <h1>Muhammad Iman Hakimi | Creative &amp; Cloud Developer</h1>
      <p>Web &amp; Cloud Developer based in Skudai, Johor, Malaysia. Specializing in Vue.js, React, Cloud AI (AWS SageMaker, LLaMA 3), and Cybersecurity.</p>
      
      <section>
        <h2>Featured Projects &amp; Case Studies</h2>
        <ul>
          <li><a href="/projects">Siswa-Rent &mdash; Student Housing Discovery Platform</a></li>
          <li><a href="/projects">CSV Malware Detection &mdash; Automated Antivirus Dashboard Engine</a></li>
          <li><a href="/projects">PolyCC LLM League &mdash; LLaMA 3 Fine-Tuning on AWS SageMaker</a></li>
          <li><a href="/projects">Data Hackathon 2024 &mdash; Top 4 National Finish in Business Intelligence</a></li>
        </ul>
        <p><a href="/projects">View all engineering projects and architectures &rarr;</a></p>
      </section>

      <section>
        <h2>About &amp; Track Record</h2>
        <p>Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS &amp; Vue. Secured top 10 and top 4 national hackathon finishes.</p>
        <p><a href="/about">Learn more about education, experience, and certifications &rarr;</a></p>
      </section>

      <section>
        <h2>Direct Contact</h2>
        <p>Email: <a href="mailto:hakimiiman342ab@gmail.com">hakimiiman342ab@gmail.com</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/iman-hakimi-867a1b2a5/" target="_blank" rel="noopener noreferrer">Iman Hakimi on LinkedIn</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2026 Muhammad Iman Hakimi. All rights reserved.</p>
    </footer>`
  },
  {
    path: '/projects',
    title: 'All Projects & Case Studies | Muhammad Iman Hakimi',
    description: 'Explore full-stack, cloud AI, and cybersecurity projects by Muhammad Iman Hakimi, including Siswa-Rent, CSV Malware Detection, and PolyCC LLM League.',
    canonical: `${SITE_URL}/projects`,
    bodyHtml: `
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">[ IMANHAKIMI.COM ]</a>
        <a href="/projects">[ PROJECTS ]</a>
        <a href="/about">[ ABOUT ]</a>
        <a href="/blog">[ BLOG ]</a>
        <a href="mailto:hakimiiman342ab@gmail.com">[ HIRE ME ↗ ]</a>
      </nav>
    </header>
    <main>
      <h1>ALL PROJECTS &amp; CASE STUDIES</h1>
      <p>Comprehensive overview of software engineering, cybersecurity, and cloud AI projects built by Muhammad Iman Hakimi Bin Hashim.</p>
      
      <article>
        <h2>Siswa-Rent &mdash; Student Housing Discovery Platform</h2>
        <p>Solves student housing discovery by eliminating friction between search intent and platform filtering.</p>
        <ul>
          <li>Reduced coding errors using TypeScript for reliable architecture.</li>
          <li>Architected database with PostgreSQL / Supabase, saving 2-3 hours weekly through clear documentation.</li>
        </ul>
        <p>Stack: React, TypeScript, HTML/CSS, PostgreSQL, Supabase</p>
      </article>

      <article>
        <h2>CSV Malware Detection &mdash; Automated Antivirus Dashboard Engine</h2>
        <p>Security system that detects malware embedded in uploaded CSV files using ClamAV antivirus engine and telemetry dashboards.</p>
        <ul>
          <li>Significantly reduced human error while reducing manual labor for office personnel.</li>
          <li>Containerized scanning queues using Docker with ASP.NET Core backend.</li>
        </ul>
        <p>Stack: ASP.NET Core, MySQL, Docker, ClamAV, jQuery, Bootstrap</p>
      </article>

      <article>
        <h2>PolyCC LLM League &mdash; LLaMA 3 Fine-Tuning on AWS SageMaker</h2>
        <p>Engineered custom AI training and inference workflows using LLaMA 3 under competitive cloud scenarios.</p>
        <ul>
          <li>Deployed scalable LLaMA 3 models inside AWS SageMaker AI cloud environments.</li>
          <li>Automated dataset pipeline iterations and prompt evaluation workflows.</li>
        </ul>
        <p>Stack: Python, LLaMA 3, AWS SageMaker, PyTorch, DataPrep</p>
      </article>

      <article>
        <h2>Data Hackathon 2024 &mdash; Top 4 National Finish</h2>
        <p>National business intelligence analytics, interactive dataset preparation, and executive dashboarding presented to industry judges.</p>
        <p>Stack: Google Looker Studio, Power BI, Google Sheets, Data Analytics</p>
      </article>

      <nav>
        <p><a href="/">&larr; Return to Home Terminal</a> | <a href="/about">About Muhammad Iman Hakimi</a></p>
      </nav>
    </main>
    <footer>
      <p>&copy; 2026 Muhammad Iman Hakimi. All rights reserved.</p>
    </footer>`
  },
  {
    path: '/about',
    title: 'About Muhammad Iman Hakimi | Bio, Education & Skills',
    description: 'Learn more about Muhammad Iman Hakimi - Web & Cloud Developer in Skudai, Johor. Background in software engineering, cloud computing, and AI hackathon achievements.',
    canonical: `${SITE_URL}/about`,
    bodyHtml: `
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">[ IMANHAKIMI.COM ]</a>
        <a href="/projects">[ PROJECTS ]</a>
        <a href="/about">[ ABOUT ]</a>
        <a href="/blog">[ BLOG ]</a>
        <a href="mailto:hakimiiman342ab@gmail.com">[ HIRE ME ↗ ]</a>
      </nav>
    </header>
    <main>
      <h1>ABOUT MUHAMMAD IMAN HAKIMI</h1>
      <p>Web &amp; Cloud Developer based in Skudai, Johor, Malaysia.</p>

      <section>
        <h2>Executive Summary</h2>
        <p>Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS &amp; Vue. Proved able to leverage technical platforms for data analytics by using Google Looker Studio to secure top 10 in Data Hackathon 2024. Created AI solutions utilizing LLaMA 3 and iterative dataset generation on AWS SageMaker AI.</p>
      </section>

      <section>
        <h2>Experience &amp; Track Record</h2>
        <ul>
          <li><strong>Web &amp; Cloud Development:</strong> Frontend and full-stack implementations with Vue 3, React, TypeScript, and Docker.</li>
          <li><strong>Cloud AI &amp; SageMaker:</strong> LLaMA 3 model fine-tuning and inference pipelines.</li>
          <li><strong>Data Analytics:</strong> Top 4 national ranking in National Data Hackathon.</li>
        </ul>
      </section>

      <section>
        <h2>Technical Arsenal</h2>
        <p><strong>Frontend:</strong> Vue.js, React, TypeScript, JavaScript, HTML5/CSS3, Three.js, Tailwind CSS</p>
        <p><strong>Backend &amp; DB:</strong> ASP.NET Core, Python, Node.js, PostgreSQL, MySQL, Supabase</p>
        <p><strong>Cloud &amp; DevOps:</strong> AWS SageMaker, Docker, Git, ClamAV, Linux</p>
      </section>

      <section>
        <h2>Connect</h2>
        <p>Email: <a href="mailto:hakimiiman342ab@gmail.com">hakimiiman342ab@gmail.com</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/iman-hakimi-867a1b2a5/" target="_blank" rel="noopener noreferrer">linkedin.com/in/iman-hakimi</a></p>
        <p><a href="/projects">Explore Projects &rarr;</a> | <a href="/">&larr; Return to Home</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2026 Muhammad Iman Hakimi. All rights reserved.</p>
    </footer>`
  },

  {
    path: '/blog',
    title: 'Engineering Blog & Tech Insights | Muhammad Iman Hakimi',
    description: 'Technical articles, cloud architecture guides, and developer insights by Muhammad Iman Hakimi.',
    canonical: `${SITE_URL}/blog`,
    bodyHtml: `
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">[ IMANHAKIMI.COM ]</a>
        <a href="/projects">[ PROJECTS ]</a>
        <a href="/about">[ ABOUT ]</a>
        <a href="/blog">[ BLOG ]</a>
        <a href="mailto:hakimiiman342ab@gmail.com">[ HIRE ME ↗ ]</a>
      </nav>
    </header>
    <main>
      <h1>TECHNICAL BLOG &amp; CASE STUDIES</h1>
      <p>Deep dives into cloud computing, machine learning deployments, cybersecurity pipelines, and modern frontend architecture.</p>
      <article>
        <h2>Fine-Tuning LLaMA 3 on AWS SageMaker: Lessons Learned</h2>
        <p>Engineering scalable training pipelines, handling iterative dataset preparation, and optimizing inference endpoints under competitive cloud hackathon constraints.</p>
        <p><a href="/projects">View Related Project &rarr;</a></p>
      </article>
      <article>
        <h2>Automating CSV Malware Detection with ClamAV &amp; Docker</h2>
        <p>Designing an automated antivirus dashboard engine using ASP.NET Core and containerized ClamAV instances to inspect enterprise batch uploads.</p>
        <p><a href="/projects">View Related Project &rarr;</a></p>
      </article>
      <article>
        <h2>Building High-Performance 3D Shaders with Vue 3 &amp; Three.js</h2>
        <p>Creating retro pen-and-ink dithered materials, custom GLSL fragment shaders, and pixel transitions while keeping bundle sizes light and SEO-friendly.</p>
        <p><a href="/projects">View 3D Project &rarr;</a></p>
      </article>
      <nav>
        <p><a href="/">&larr; Return to Home</a> | <a href="/about">About the Author &rarr;</a></p>
      </nav>
    </main>
    <footer>
      <p>&copy; 2026 Muhammad Iman Hakimi. All rights reserved.</p>
    </footer>`
  }
]

function prerender() {
  const templatePath = path.resolve(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found! Run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8')

  console.log('Starting static route pre-rendering for SEO & Plesk audit...')

  for (const route of routes) {
    let html = baseHtml

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)

    // Replace or Inject Meta Description
    if (html.includes('name="description"')) {
      html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${route.description}" />`)
    }

    // Replace or Inject Canonical
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${route.canonical}" />`)
    }

    // Replace Open Graph metadata
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.title}" />`)
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.description}" />`)
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${route.canonical}" />`)

    // Replace Twitter metadata
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`)
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`)

    // Inject route-specific body HTML inside <div id="app">
    const appRegex = /<div id="app">[\s\S]*?<\/div>/i
    if (appRegex.test(html)) {
      html = html.replace(appRegex, `<div id="app">\n${route.bodyHtml}\n  </div>`)
    }

    // Write file
    if (route.path === '/') {
      fs.writeFileSync(templatePath, html, 'utf8')
      console.log(`✓ Prerendered: dist/index.html`)
    } else {
      const targetDir = path.resolve(distDir, route.path.replace(/^\//, ''))
      fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(path.resolve(targetDir, 'index.html'), html, 'utf8')
      console.log(`✓ Prerendered: dist/${route.path.replace(/^\//, '')}/index.html`)
    }
  }

  console.log('Static route pre-rendering completed successfully.')
}

prerender()
