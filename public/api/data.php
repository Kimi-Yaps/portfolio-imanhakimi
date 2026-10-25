<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

// ============================================================
// 1. GET: Fetch all portfolio data for website & dashboard
// ============================================================
if ($method === 'GET') {
    $dbConnected = ($pdo !== null);

    if ($dbConnected) {
        try {
            // Profile Info
            $stmt = $pdo->query('SELECT * FROM profile_info LIMIT 1');
            $profile = $stmt->fetch() ?: [];

            // Projects
            $stmt = $pdo->query('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC');
            $projectsRaw = $stmt->fetchAll() ?: [];
            $projects = array_map(function ($p) {
                return [
                    'id' => $p['id'],
                    'title' => $p['title'],
                    'badge' => $p['badge'],
                    'subtitle' => $p['subtitle'],
                    'description' => $p['description'],
                    'impact' => array_values(array_filter(explode("\n", str_replace("\r", "", $p['impact_bullets'])))),
                    'stack' => array_values(array_filter(array_map('trim', explode(',', $p['stack_tags'])))),
                ];
            }, $projectsRaw);

            // Skills
            $stmt = $pdo->query('SELECT * FROM skills ORDER BY display_order ASC, id ASC');
            $skillsRaw = $stmt->fetchAll() ?: [];
            $skillsByCategory = [
                'frontend' => [],
                'backend' => [],
                'cloud' => []
            ];
            foreach ($skillsRaw as $s) {
                $cat = strtolower($s['category']);
                if (!isset($skillsByCategory[$cat])) $skillsByCategory[$cat] = [];
                $skillsByCategory[$cat][] = [
                    'id' => (int)$s['id'],
                    'name' => $s['name'],
                    'icon' => $s['icon_file']
                ];
            }

            // Experiences
            $stmt = $pdo->query('SELECT * FROM experiences ORDER BY display_order ASC, id ASC');
            $experiencesRaw = $stmt->fetchAll() ?: [];
            $experiences = array_map(function ($e) {
                return [
                    'id' => (int)$e['id'],
                    'period' => $e['period'],
                    'company' => $e['company'],
                    'title' => $e['title'],
                    'tag_color' => $e['tag_color'] ?? 'red',
                    'bullets' => array_values(array_filter(explode("\n", str_replace("\r", "", $e['bullets'])))),
                ];
            }, $experiencesRaw);

            // Education & Certifications
            $stmt = $pdo->query('SELECT * FROM education_certs ORDER BY display_order ASC, id ASC');
            $educationRaw = $stmt->fetchAll() ?: [];
            $education = [];
            $certifications = [];
            foreach ($educationRaw as $ed) {
                if ($ed['type'] === 'education') {
                    $education[] = [
                        'id' => (int)$ed['id'],
                        'period' => $ed['period'],
                        'title' => $ed['title'],
                        'subtitle' => $ed['subtitle'],
                        'description' => $ed['description']
                    ];
                } else {
                    $certifications[] = [
                        'id' => (int)$ed['id'],
                        'title' => $ed['title'],
                        'subtitle' => $ed['subtitle'],
                        'description' => $ed['description']
                    ];
                }
            }

            jsonResponse([
                'success' => true,
                'source' => 'mysql',
                'database_connected' => true,
                'data' => [
                    'profile' => [
                        'full_name' => $profile['full_name'] ?? 'MUHAMMAD IMAN HAKIMI',
                        'role_title' => $profile['role_title'] ?? 'WEB & CLOUD DEVELOPER • SKUDAI, JOHOR',
                        'location' => $profile['location'] ?? 'Skudai, Johor, Malaysia',
                        'status_badge' => $profile['status_badge'] ?? 'STATUS: AVAILABLE',
                        'statement_lines' => !empty($profile['statement_lines'])
                            ? explode("\n", str_replace("\r", "", $profile['statement_lines']))
                            : [
                                'DEVELOPMENT IS ALL ABOUT',
                                'MOVEMENT.',
                                'ONE PROJECT ENDS,',
                                'ANOTHER BEGINS,',
                                'AND THE RHYTHM NEVER STOPS.'
                            ],
                        'executive_summary' => $profile['executive_summary'] ?? '',
                        'email' => $profile['email'] ?? 'hakimiiman342ab@gmail.com',
                        'phone' => $profile['phone'] ?? '0163210744',
                        'linkedin_url' => $profile['linkedin_url'] ?? 'https://www.linkedin.com/in/iman-hakimi-867a1b2a5/'
                    ],
                    'projects' => $projects,
                    'skills' => $skillsByCategory,
                    'experiences' => $experiences,
                    'education' => $education,
                    'certifications' => $certifications,
                ]
            ]);
        } catch (Exception $e) {
            // If tables not created yet, fall through to default fallback response with status
        }
    }

    // Default Fallback Bundle when database is not yet connected/imported
    jsonResponse([
        'success' => true,
        'source' => 'fallback',
        'database_connected' => false,
        'message' => 'Connected via fallback store. Configure MySQL in api/config.php & import schema.sql in phpMyAdmin to activate live database synchronization.',
        'data' => [
            'profile' => [
                'full_name' => 'MUHAMMAD IMAN HAKIMI',
                'role_title' => 'WEB & CLOUD DEVELOPER • SKUDAI, JOHOR',
                'location' => 'Skudai, Johor, Malaysia',
                'status_badge' => 'STATUS: AVAILABLE',
                'statement_lines' => [
                    'DEVELOPMENT IS ALL ABOUT',
                    'MOVEMENT.',
                    'ONE PROJECT ENDS,',
                    'ANOTHER BEGINS,',
                    'AND THE RHYTHM NEVER STOPS.'
                ],
                'executive_summary' => 'Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS & Vue. Proved able to leverage technical platforms for data analytics by using Google Looker Studio to secure top 10 in Data Hackathon 2024. Created AI solutions utilizing LLaMA 3 and iterative dataset generation on AWS SageMaker AI.',
                'email' => 'hakimiiman342ab@gmail.com',
                'phone' => '0163210744',
                'linkedin_url' => 'https://www.linkedin.com/in/iman-hakimi-867a1b2a5/'
            ],
            'projects' => [
                [
                    'id' => 'siswa-rent',
                    'title' => 'SISWA-RENT',
                    'badge' => 'HACKATHON SUBMISSION',
                    'subtitle' => 'Student Housing Discovery Platform',
                    'description' => 'Siswa-Rent solves a practical, high-frequency problem: student housing discovery. It directly addresses the gap between how students naturally search and how current platforms force them to search.',
                    'impact' => [
                        'Reduced coding errors using TypeScript for safer, more reliable architecture.',
                        'Architected database with PostgreSQL / Supabase, saving 2-3 hours weekly through clear documentation.'
                    ],
                    'stack' => ['React', 'TypeScript', 'HTML/CSS', 'PostgreSQL', 'Supabase']
                ],
                [
                    'id' => 'malware-detection',
                    'title' => 'CSV MALWARE DETECTION',
                    'badge' => 'SECURITY & AUTOMATION',
                    'subtitle' => 'Automated Antivirus Dashboard Engine',
                    'description' => 'A security system that detects malware embedded in uploaded CSV files using the ClamAV antivirus engine and displays telemetry in an administrative dashboard.',
                    'impact' => [
                        'Significantly reduced human error while reducing manual labor for office personnel.',
                        'Containerized scanning queues using Docker with ASP.NET Core backend.'
                    ],
                    'stack' => ['ASP.NET Core', 'MySQL', 'Docker', 'ClamAV', 'jQuery', 'Bootstrap']
                ],
                [
                    'id' => 'polycc-llm',
                    'title' => 'POLYCC LLM LEAGUE',
                    'badge' => 'AI & CLOUD',
                    'subtitle' => 'LLaMA 3 Fine-Tuning on AWS SageMaker',
                    'description' => 'Engineered custom AI training and inference workflows using LLaMA 3 under competitive cloud scenarios, generating new iterations of datasets for fine-tuning.',
                    'impact' => [
                        'Deployed scalable LLaMA 3 models inside AWS SageMaker AI cloud environments.',
                        'Automated dataset pipeline iterations and prompt evaluation workflows.'
                    ],
                    'stack' => ['Python', 'LLaMA 3', 'AWS SageMaker', 'PyTorch', 'DataPrep']
                ],
                [
                    'id' => 'data-hackathon',
                    'title' => 'DATAHACKATHON 2024',
                    'badge' => 'TOP 4 FINISH',
                    'subtitle' => 'National Business Intelligence Analytics',
                    'description' => 'Secured Top 4 national finish through interactive dataset preparation, predictive analytics, and executive dashboarding presented directly to industry judges.',
                    'impact' => [
                        'Built visual analytics dashboards using Google Looker Studio and Power BI.',
                        'Delivered live technical findings to a professional evaluation panel.'
                    ],
                    'stack' => ['Google Looker Studio', 'Power BI', 'Google Sheets', 'Data Analytics']
                ]
            ],
            'skills' => [
                'frontend' => [
                    ['id' => 1, 'name' => 'HTML5', 'icon' => 'html5.svg'],
                    ['id' => 2, 'name' => 'CSS3', 'icon' => 'css3.svg'],
                    ['id' => 3, 'name' => 'JavaScript', 'icon' => 'javascript.svg'],
                    ['id' => 4, 'name' => 'TypeScript', 'icon' => 'typescript.svg'],
                    ['id' => 5, 'name' => 'React JS', 'icon' => 'react.svg'],
                    ['id' => 6, 'name' => 'Vue.js', 'icon' => 'vue.svg'],
                    ['id' => 7, 'name' => 'TresJS 3D', 'icon' => 'threejs.svg'],
                    ['id' => 8, 'name' => 'WordPress', 'icon' => 'wordpress.svg']
                ],
                'backend' => [
                    ['id' => 9, 'name' => 'PostgreSQL', 'icon' => 'postgresql.svg'],
                    ['id' => 10, 'name' => 'Supabase', 'icon' => 'supabase.svg'],
                    ['id' => 11, 'name' => 'MySQL', 'icon' => 'mysql.svg'],
                    ['id' => 12, 'name' => 'ASP.NET Core', 'icon' => 'dotnet.svg'],
                    ['id' => 13, 'name' => 'C#', 'icon' => 'csharp.svg'],
                    ['id' => 14, 'name' => 'Python', 'icon' => 'python.svg'],
                    ['id' => 15, 'name' => 'PHP', 'icon' => 'php.svg'],
                    ['id' => 16, 'name' => 'Firebase', 'icon' => 'firebase.svg'],
                    ['id' => 17, 'name' => 'Google Apps Script', 'icon' => 'google.svg']
                ],
                'cloud' => [
                    ['id' => 18, 'name' => 'GCP Cloud Run', 'icon' => 'googlecloud.svg'],
                    ['id' => 19, 'name' => 'AWS SageMaker AI', 'icon' => 'amazonaws.svg'],
                    ['id' => 20, 'name' => 'Docker', 'icon' => 'docker.svg'],
                    ['id' => 21, 'name' => 'Kubernetes', 'icon' => 'kubernetes.svg'],
                    ['id' => 22, 'name' => 'GitHub / GitLab', 'icon' => 'github.svg'],
                    ['id' => 23, 'name' => 'Jenkins', 'icon' => 'jenkins.svg'],
                    ['id' => 24, 'name' => 'Grafana', 'icon' => 'grafana.svg']
                ]
            ],
            'experiences' => [
                [
                    'id' => 1,
                    'period' => '1 OCTOBER 2026 - PRESENT',
                    'company' => 'UNIVERSITI TEKNOLOGI MALAYSIA',
                    'title' => 'Assistant Administrative Officer (MySTEP)',
                    'tag_color' => 'red',
                    'bullets' => [
                        'Structured and cleansed datasets in Google Sheets to ensure data integrity for automated Google Apps Script workflows.',
                        'Designed and built responsive WordPress page layouts for university events, embedding custom HTML and CSS.'
                    ]
                ],
                [
                    'id' => 2,
                    'period' => 'MARCH - JULY 2026',
                    'company' => 'UTM DIGITAL, UNIVERSITI TEKNOLOGI MALAYSIA',
                    'title' => 'Information Technology Intern',
                    'tag_color' => 'black',
                    'bullets' => [
                        'Collaborated with network team to diagnose and resolve hardware faults on wireless access points and point-to-point links.',
                        'Developed Google Apps Script automations that streamlined recurring team workflows, reducing manual processing time by 35%.',
                        'Built Power BI reports for data analytics, turning raw operational data into visual insights for team decision-making.',
                        'Migrated CRUD operations from a legacy ASP.NET Web Forms/MVC application to ASP.NET Core.'
                    ]
                ]
            ],
            'education' => [
                [
                    'id' => 1,
                    'period' => '2023 - 2026',
                    'title' => 'Polytechnic Mersing Johor',
                    'subtitle' => 'Diploma in Information Technology — Networking Track (CGPA 3.07)',
                    'description' => ''
                ]
            ],
            'certifications' => [
                [
                    'id' => 2,
                    'title' => 'CAE Cloud Service Associate (CCSA)',
                    'subtitle' => 'Siri Number: DEJ1SQMK8Q',
                    'description' => 'Trained on cloud platform deployments, cloud service monitoring, IAM User governance, and scalable web hosting.'
                ]
            ]
        ]
    ]);
}

// ============================================================
// 2. POST: Update portfolio collections (Protected by Auth)
// ============================================================
if ($method === 'POST') {
    requireAdminAuth();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['success' => false, 'error' => 'Invalid JSON payload'], 400);
    }

    $section = $_GET['section'] ?? 'all';

    if (!$pdo) {
        // When MySQL is not connected, acknowledge update for local session/storage
        jsonResponse([
            'success' => true,
            'source' => 'local_fallback',
            'message' => 'Data saved to local browser cache. To save permanently in MySQL, configure api/config.php & import schema.sql via phpMyAdmin in cPanel/Plesk.',
            'payload' => $input
        ]);
    }

    try {
        $pdo->beginTransaction();

        // 1. Update Profile Info
        if ($section === 'all' || $section === 'profile') {
            $p = $input['profile'] ?? [];
            if (!empty($p)) {
                $statement = is_array($p['statement_lines'] ?? null)
                    ? implode("\n", $p['statement_lines'])
                    : ($p['statement_lines'] ?? '');

                $stmt = $pdo->prepare('
                    INSERT INTO profile_info (id, full_name, role_title, location, status_badge, statement_lines, executive_summary, email, phone, linkedin_url)
                    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        full_name = VALUES(full_name),
                        role_title = VALUES(role_title),
                        location = VALUES(location),
                        status_badge = VALUES(status_badge),
                        statement_lines = VALUES(statement_lines),
                        executive_summary = VALUES(executive_summary),
                        email = VALUES(email),
                        phone = VALUES(phone),
                        linkedin_url = VALUES(linkedin_url)
                ');
                $stmt->execute([
                    $p['full_name'] ?? '',
                    $p['role_title'] ?? '',
                    $p['location'] ?? '',
                    $p['status_badge'] ?? 'STATUS: AVAILABLE',
                    $statement,
                    $p['executive_summary'] ?? '',
                    $p['email'] ?? '',
                    $p['phone'] ?? '',
                    $p['linkedin_url'] ?? ''
                ]);
            }
        }

        // 2. Update Projects
        if ($section === 'all' || $section === 'projects') {
            $projs = $input['projects'] ?? null;
            if (is_array($projs)) {
                $pdo->exec('TRUNCATE TABLE projects');
                $stmt = $pdo->prepare('
                    INSERT INTO projects (id, title, badge, subtitle, description, impact_bullets, stack_tags, display_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ');
                foreach ($projs as $order => $pj) {
                    $impact = is_array($pj['impact'] ?? null) ? implode("\n", $pj['impact']) : ($pj['impact'] ?? '');
                    $stack = is_array($pj['stack'] ?? null) ? implode(',', $pj['stack']) : ($pj['stack'] ?? '');
                    $stmt->execute([
                        $pj['id'] ?: ('proj-' . ($order + 1)),
                        $pj['title'] ?? '',
                        $pj['badge'] ?? '',
                        $pj['subtitle'] ?? '',
                        $pj['description'] ?? '',
                        $impact,
                        $stack,
                        $order + 1
                    ]);
                }
            }
        }

        // 3. Update Skills
        if ($section === 'all' || $section === 'skills') {
            $skillsData = $input['skills'] ?? null;
            if (is_array($skillsData)) {
                $pdo->exec('TRUNCATE TABLE skills');
                $stmt = $pdo->prepare('
                    INSERT INTO skills (name, category, icon_file, display_order)
                    VALUES (?, ?, ?, ?)
                ');
                $order = 1;
                foreach (['frontend', 'backend', 'cloud'] as $cat) {
                    if (!empty($skillsData[$cat]) && is_array($skillsData[$cat])) {
                        foreach ($skillsData[$cat] as $s) {
                            $name = is_array($s) ? ($s['name'] ?? '') : (string)$s;
                            $icon = is_array($s) ? ($s['icon'] ?? ($name . '.svg')) : ($name . '.svg');
                            $stmt->execute([$name, $cat, $icon, $order++]);
                        }
                    }
                }
            }
        }

        // 4. Update Experiences
        if ($section === 'all' || $section === 'experiences') {
            $exps = $input['experiences'] ?? null;
            if (is_array($exps)) {
                $pdo->exec('TRUNCATE TABLE experiences');
                $stmt = $pdo->prepare('
                    INSERT INTO experiences (period, company, title, tag_color, bullets, display_order)
                    VALUES (?, ?, ?, ?, ?, ?)
                ');
                foreach ($exps as $order => $ex) {
                    $bullets = is_array($ex['bullets'] ?? null) ? implode("\n", $ex['bullets']) : ($ex['bullets'] ?? '');
                    $stmt->execute([
                        $ex['period'] ?? '',
                        $ex['company'] ?? '',
                        $ex['title'] ?? '',
                        $ex['tag_color'] ?? 'red',
                        $bullets,
                        $order + 1
                    ]);
                }
            }
        }

        // 5. Update Education & Certs
        if ($section === 'all' || $section === 'education') {
            $edu = $input['education'] ?? null;
            $certs = $input['certifications'] ?? null;
            if (is_array($edu) || is_array($certs)) {
                $pdo->exec('TRUNCATE TABLE education_certs');
                $stmt = $pdo->prepare('
                    INSERT INTO education_certs (type, period, title, subtitle, description, display_order)
                    VALUES (?, ?, ?, ?, ?, ?)
                ');
                $order = 1;
                if (is_array($edu)) {
                    foreach ($edu as $item) {
                        $stmt->execute(['education', $item['period'] ?? '', $item['title'] ?? '', $item['subtitle'] ?? '', $item['description'] ?? '', $order++]);
                    }
                }
                if (is_array($certs)) {
                    foreach ($certs as $item) {
                        $stmt->execute(['cert', '', $item['title'] ?? '', $item['subtitle'] ?? '', $item['description'] ?? '', $order++]);
                    }
                }
            }
        }

        $pdo->commit();
        jsonResponse([
            'success' => true,
            'source' => 'mysql',
            'message' => 'Successfully synchronized data to MySQL database!'
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ], 500);
    }
}

jsonResponse(['error' => 'Method not allowed'], 405);
