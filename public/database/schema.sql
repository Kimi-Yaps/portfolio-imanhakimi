-- ==========================================================
-- PORTFOLIO DATABASE SCHEMA & SEED DATA
-- Muhammad Iman Hakimi - Web & Cloud Developer
-- Compatible with MySQL 5.7+ / MariaDB 10.3+ (cPanel & Plesk)
-- Import this file in phpMyAdmin -> Import tab
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. Table structure for admin_users
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial default admin:
-- Username: admin
-- Password: admin (change in admin dashboard upon first login)
-- Hash generated using password_hash('admin', PASSWORD_BCRYPT)
INSERT INTO `admin_users` (`id`, `username`, `password_hash`) VALUES
(1, 'admin', '$2y$10$U6U.9k4jN49nO79n5v3mXeXJ9o4oWj47lK0yA3v5g3Lp2xJ5p2l5q')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- ----------------------------------------------------------
-- 2. Table structure for profile_info
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profile_info` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `role_title` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `status_badge` VARCHAR(100) NOT NULL DEFAULT 'STATUS: AVAILABLE',
  `statement_lines` TEXT NOT NULL,
  `executive_summary` TEXT NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `linkedin_url` VARCHAR(255) NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `profile_info` (`id`, `full_name`, `role_title`, `location`, `status_badge`, `statement_lines`, `executive_summary`, `email`, `phone`, `linkedin_url`) VALUES
(1,
 'MUHAMMAD IMAN HAKIMI',
 'WEB & CLOUD DEVELOPER • SKUDAI, JOHOR',
 'Skudai, Johor, Malaysia',
 'STATUS: AVAILABLE',
 'DEVELOPMENT IS ALL ABOUT\nMOVEMENT.\nONE PROJECT ENDS,\nANOTHER BEGINS,\nAND THE RHYTHM NEVER STOPS.',
 'Applied design mock-ups into clean, pixel-perfect code using HTML, CSS, JavaScript frameworks like React JS & Vue. Proved able to leverage technical platforms for data analytics by using Google Looker Studio to secure top 10 in Data Hackathon 2024. Created AI solutions utilizing LLaMA 3 and iterative dataset generation on AWS SageMaker AI.',
 'hakimiiman342ab@gmail.com',
 '0163210744',
 'https://www.linkedin.com/in/iman-hakimi-867a1b2a5/'
)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- ----------------------------------------------------------
-- 3. Table structure for projects
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(60) NOT NULL PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `impact_bullets` TEXT NOT NULL,
  `stack_tags` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `projects` (`id`, `title`, `badge`, `subtitle`, `description`, `impact_bullets`, `stack_tags`, `display_order`) VALUES
('siswa-rent',
 'SISWA-RENT',
 'HACKATHON SUBMISSION',
 'Student Housing Discovery Platform',
 'Siswa-Rent solves a practical, high-frequency problem: student housing discovery. It directly addresses the gap between how students naturally search and how current platforms force them to search.',
 'Reduced coding errors using TypeScript for safer, more reliable architecture.\nArchitected database with PostgreSQL / Supabase, saving 2-3 hours weekly through clear documentation.',
 'React,TypeScript,HTML/CSS,PostgreSQL,Supabase',
 1),
('malware-detection',
 'CSV MALWARE DETECTION',
 'SECURITY & AUTOMATION',
 'Automated Antivirus Dashboard Engine',
 'A security system that detects malware embedded in uploaded CSV files using the ClamAV antivirus engine and displays telemetry in an administrative dashboard.',
 'Significantly reduced human error while reducing manual labor for office personnel.\nContainerized scanning queues using Docker with ASP.NET Core backend.',
 'ASP.NET Core,MySQL,Docker,ClamAV,jQuery,Bootstrap',
 2),
('polycc-llm',
 'POLYCC LLM LEAGUE',
 'AI & CLOUD',
 'LLaMA 3 Fine-Tuning on AWS SageMaker',
 'Engineered custom AI training and inference workflows using LLaMA 3 under competitive cloud scenarios, generating new iterations of datasets for fine-tuning.',
 'Deployed scalable LLaMA 3 models inside AWS SageMaker AI cloud environments.\nAutomated dataset pipeline iterations and prompt evaluation workflows.',
 'Python,LLaMA 3,AWS SageMaker,PyTorch,DataPrep',
 3),
('data-hackathon',
 'DATAHACKATHON 2024',
 'TOP 4 FINISH',
 'National Business Intelligence Analytics',
 'Secured Top 4 national finish through interactive dataset preparation, predictive analytics, and executive dashboarding presented directly to industry judges.',
 'Built visual analytics dashboards using Google Looker Studio and Power BI.\nDelivered live technical findings to a professional evaluation panel.',
 'Google Looker Studio,Power BI,Google Sheets,Data Analytics',
 4)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ----------------------------------------------------------
-- 4. Table structure for skills
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('frontend', 'backend', 'cloud') NOT NULL,
  `icon_file` VARCHAR(100) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `skills` (`name`, `category`, `icon_file`, `display_order`) VALUES
('HTML5', 'frontend', 'html5.svg', 1),
('CSS3', 'frontend', 'css3.svg', 2),
('JavaScript', 'frontend', 'javascript.svg', 3),
('TypeScript', 'frontend', 'typescript.svg', 4),
('React JS', 'frontend', 'react.svg', 5),
('Vue.js', 'frontend', 'vue.svg', 6),
('TresJS 3D', 'frontend', 'threejs.svg', 7),
('WordPress', 'frontend', 'wordpress.svg', 8),
('PostgreSQL', 'backend', 'postgresql.svg', 9),
('Supabase', 'backend', 'supabase.svg', 10),
('MySQL', 'backend', 'mysql.svg', 11),
('ASP.NET Core', 'backend', 'dotnet.svg', 12),
('C#', 'backend', 'csharp.svg', 13),
('Python', 'backend', 'python.svg', 14),
('PHP', 'backend', 'php.svg', 15),
('Firebase', 'backend', 'firebase.svg', 16),
('Google Apps Script', 'backend', 'google.svg', 17),
('GCP Cloud Run', 'cloud', 'googlecloud.svg', 18),
('AWS SageMaker AI', 'cloud', 'amazonaws.svg', 19),
('Docker', 'cloud', 'docker.svg', 20),
('Kubernetes', 'cloud', 'kubernetes.svg', 21),
('GitHub / GitLab', 'cloud', 'github.svg', 22),
('Jenkins', 'cloud', 'jenkins.svg', 23),
('Grafana', 'cloud', 'grafana.svg', 24);

-- ----------------------------------------------------------
-- 5. Table structure for experiences
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(100) NOT NULL,
  `company` VARCHAR(150) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `tag_color` VARCHAR(20) NOT NULL DEFAULT 'red',
  `bullets` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `experiences` (`period`, `company`, `title`, `tag_color`, `bullets`, `display_order`) VALUES
('1 OCTOBER 2026 - PRESENT',
 'UNIVERSITI TEKNOLOGI MALAYSIA',
 'Assistant Administrative Officer (MySTEP)',
 'red',
 'Structured and cleansed datasets in Google Sheets to ensure data integrity for automated Google Apps Script workflows.\nDesigned and built responsive WordPress page layouts for university events, embedding custom HTML and CSS.',
 1),
('MARCH - JULY 2026',
 'UTM DIGITAL, UNIVERSITI TEKNOLOGI MALAYSIA',
 'Information Technology Intern',
 'black',
 'Collaborated with network team to diagnose and resolve hardware faults on wireless access points and point-to-point links.\nDeveloped Google Apps Script automations that streamlined recurring team workflows, reducing manual processing time by 35%.\nBuilt Power BI reports for data analytics, turning raw operational data into visual insights for team decision-making.\nMigrated CRUD operations from a legacy ASP.NET Web Forms/MVC application to ASP.NET Core.',
 2);

-- ----------------------------------------------------------
-- 6. Table structure for education_certs
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `education_certs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('education', 'cert') NOT NULL,
  `period` VARCHAR(100) NOT NULL DEFAULT '',
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `education_certs` (`type`, `period`, `title`, `subtitle`, `description`, `display_order`) VALUES
('education', '2023 - 2026', 'Polytechnic Mersing Johor', 'Diploma in Information Technology — Networking Track (CGPA 3.07)', '', 1),
('cert', '', 'CAE Cloud Service Associate (CCSA)', 'Siri Number: DEJ1SQMK8Q', 'Trained on cloud platform deployments, cloud service monitoring, IAM User governance, and scalable web hosting.', 2);

SET FOREIGN_KEY_CHECKS = 1;
