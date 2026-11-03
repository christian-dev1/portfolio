-- =====================================================================
-- V3 : données du portfolio (reprises de frontend/public/data/*.json)
-- Les liaisons projet <-> outil (project_tool) remplacent "technologies"
-- et "usedIn" : une seule source de vérité.
-- =====================================================================

-- ---------- PROFIL ----------
INSERT INTO profile (id, full_name, brand, photo_url, website_url,
    location_fr, location_en, availability_status, availability_label_fr, availability_label_en,
    slogan_fr, slogan_en, description_fr, description_en,
    company_name, company_role_fr, company_role_en, company_description_fr, company_description_en)
VALUES (1, 'Noutchom Noumbiap Christian Luther', 'LUCHRIST', '/images/photo-luchrist.jpg', NULL, 'Yaoundé, Cameroun', 'Yaoundé, Cameroon', 'remote-only', 'Disponible pour des missions à distance', 'Available for remote work', 'Je donne vie à ce qui n''existe pas encore, et je bonifie ce qui existe déjà.', 'I bring to life what doesn''t exist yet, and improve what already does.', 'Je conçois, développe et teste des applications, du backend Spring Boot jusqu''aux tests de bout en bout.', 'I design, build and test applications, from the Spring Boot backend to end-to-end tests.', 'B-HER EMPIRE', 'Fondateur et PDG', 'Founder & CEO', 'B-HER EMPIRE — startup numérique que j''ai fondée (en cours de création). Conception, développement et test d''applications, de logiciels et de plateformes, avec un accompagnement en communication et marketing digital.', 'B-HER EMPIRE — a digital startup I founded (currently being set up). Design, development and testing of applications, software and platforms, with support in communication and digital marketing.');

INSERT INTO social_link (network, url, position) VALUES
    ('linkedin', 'https://www.linkedin.com/in/christian-noutchom-494840345/', 1),
    ('github', 'https://github.com/christian-dev1', 2),
    ('gitlab', 'https://gitlab.com/christian-dev1', 3),
    ('youtube', 'https://www.youtube.com/@luchrist-r2d', 4),
    ('tiktok', 'https://vm.tiktok.com/ZG9U4PqLLTLmy-naTeA/', 5),
    ('facebook', 'https://www.facebook.com/profile.php?id=61585366945559', 6),
    ('instagram', 'https://www.instagram.com/noutchom', 7),
    ('snapchat', 'https://www.snapchat.com/add/luchrist07', 8),
    ('email', 'nouchrist773@gmail.com', 9);

INSERT INTO bio_paragraph (text_fr, text_en, position) VALUES
    ('Développeur backend et QA camerounais, je conçois, développe et teste des applications avec Java, Spring Boot et Angular. Polyvalent et passionné par les nouvelles technologies, je travaille aussi avec WordPress.', 'I''m a Cameroonian backend developer and QA engineer. I design, build and test applications with Java, Spring Boot and Angular. Versatile and passionate about new technologies, I also work with WordPress.', 1),
    ('D''un naturel calme et détendu, je suis aussi très jovial avec ceux que je connais. J''aime oser : face à une difficulté, je cherche la solution plutôt que de dire « je ne peux pas ». Et je rêve grand, c''est pour ça que j''ai fondé B-HER EMPIRE.', 'Calm and easygoing by nature, I''m also very cheerful with the people I know. I like to dare: when something gets hard, I look for the solution instead of saying "I can''t". And I dream big, which is why I founded B-HER EMPIRE.', 2);

INSERT INTO profile_value (slug, title_fr, title_en, text_fr, text_en, position) VALUES
    ('dare', 'Oser', 'Dare', 'Face à une difficulté, je cherche la solution plutôt que de dire « je ne peux pas ».', 'When something gets hard, I look for the solution instead of saying "I can''t".', 1),
    ('dream-big', 'Rêver grand', 'Dream big', 'Je vise loin : c''est cette ambition qui m''a poussé à fonder B-HER EMPIRE.', 'I aim high: that ambition is what led me to found B-HER EMPIRE.', 2),
    ('versatility', 'Polyvalence', 'Versatility', 'Du backend aux tests, en passant par le frontend et WordPress, je m''adapte aux besoins du projet.', 'From backend to testing, through frontend and WordPress, I adapt to what the project needs.', 3),
    ('commitment', 'Engagement', 'Commitment', 'Je m''investis dans chaque projet et je le mène jusqu''au bout.', 'I put myself into every project and see it through to the end.', 4);

INSERT INTO profile_item (kind, label_fr, label_en, position) VALUES
    ('quality', 'Travail en équipe', 'Teamwork', 1),
    ('quality', 'Écoute et communication', 'Listening and communication', 2),
    ('quality', 'Gestion de la pression et des délais', 'Working under pressure and deadlines', 3),
    ('quality', 'Engagement jusqu''au bout', 'Follow-through', 4),
    ('interest', 'Football', 'Football', 1),
    ('interest', 'Sport et forme physique', 'Sport and fitness', 2),
    ('interest', 'Musique et chant', 'Music and singing', 3),
    ('interest', 'Théâtre et comédie', 'Theatre and comedy', 4),
    ('interest', 'Nouvelles technologies', 'New technologies', 5);

INSERT INTO spoken_language (name_fr, name_en, level_fr, level_en, position) VALUES
    ('Français', 'French', 'Courant', 'Fluent', 1),
    ('Anglais', 'English', 'Notions', 'Basic', 2);

-- ---------- OUTILS ----------
INSERT INTO tool (slug, name_fr, name_en, icon, monogram, category, usage_note_fr, usage_note_en, position) VALUES
    ('java', 'Java', 'Java', 'openjdk', NULL, 'languages', NULL, NULL, 1),
    ('typescript', 'TypeScript', 'TypeScript', 'typescript', NULL, 'languages', 'Portfolio', 'Portfolio', 2),
    ('spring-boot', 'Spring Boot', 'Spring Boot', 'springboot', NULL, 'backend', NULL, NULL, 1),
    ('swagger', 'Swagger', 'Swagger', 'swagger', NULL, 'backend', NULL, NULL, 2),
    ('angular', 'Angular', 'Angular', 'angular', NULL, 'frontend', 'Portfolio', 'Portfolio', 1),
    ('wordpress', 'WordPress', 'WordPress', 'wordpress', NULL, 'frontend', 'Projets personnels', 'Personal projects', 2),
    ('postgresql', 'PostgreSQL', 'PostgreSQL', 'postgresql', NULL, 'database', NULL, NULL, 1),
    ('junit', 'JUnit', 'JUnit', 'junit5', NULL, 'testing', NULL, NULL, 1),
    ('vitest', 'Vitest', 'Vitest', 'vitest', NULL, 'testing', 'Portfolio', 'Portfolio', 2),
    ('manual-testing', 'Tests manuels & cahiers de test', 'Manual testing & test plans', NULL, 'TM', 'testing', NULL, NULL, 3),
    ('squash-tm', 'Squash TM', 'Squash TM', NULL, 'SQ', 'testing', NULL, NULL, 4),
    ('postman', 'Postman', 'Postman', 'postman', NULL, 'testing', NULL, NULL, 5),
    ('playwright', 'Playwright', 'Playwright', NULL, 'PW', 'testing', 'Projets d''apprentissage', 'Learning projects', 6),
    ('cypress', 'Cypress', 'Cypress', 'cypress', NULL, 'testing', 'Projets d''apprentissage', 'Learning projects', 7),
    ('docker', 'Docker', 'Docker', 'docker', NULL, 'environment', NULL, NULL, 1),
    ('git', 'Git, GitHub, GitLab', 'Git, GitHub, GitLab', 'git', NULL, 'environment', 'Usage quotidien', 'Daily use', 2),
    ('linux', 'Linux', 'Linux', 'linux', NULL, 'environment', 'Usage quotidien', 'Daily use', 3),
    ('ides', 'VS Code, IntelliJ IDEA', 'VS Code, IntelliJ IDEA', 'intellijidea', NULL, 'environment', 'Usage quotidien', 'Daily use', 4),
    ('claude', 'Claude', 'Claude', NULL, 'CL', 'ai', NULL, NULL, 1),
    ('chatgpt', 'ChatGPT', 'ChatGPT', NULL, 'GP', 'ai', NULL, NULL, 2),
    ('prompt-engineering', 'Prompt engineering', 'Prompt engineering', NULL, 'PE', 'ai', NULL, NULL, 3),
    ('n8n', 'n8n', 'n8n', NULL, 'N8', 'ai', NULL, NULL, 4);

-- ---------- PROJETS ----------
INSERT INTO project (slug, name, summary_fr, summary_en, cover_tagline_fr, cover_tagline_en, context, status, repository_url, logo_url, cover_url, visible, featured, position) VALUES
    ('wimo', 'WIMO', 'Application de transfert d''argent.', 'Money transfer application.', 'XAF ⇄ EUR', 'XAF ⇄ EUR', 'b-her', 'in-progress', 'https://gitlab.com/christian-dev1/WIMO', NULL, NULL, TRUE, TRUE, 1),
    ('vesty-shop', 'Vesty Shop', 'Plateforme de vente de vêtements en ligne, avec possibilité de passer des commandes sur mesure.', 'Online clothing store, with the option to place made-to-measure orders.', 'Prêt-à-porter · Sur mesure', 'Ready-to-wear · Made to measure', 'b-her', 'in-progress', NULL, '/images/projects/vesty-shop-logo.png', NULL, TRUE, TRUE, 2),
    ('sekouh', 'Sekouh', 'Application de gestion scolaire : inscription des élèves, création des classes, édition des bulletins et suivi des frais de scolarité.', 'School management application: student enrolment, class management, report cards and school fee tracking.', 'Gestion scolaire', 'School management', 'collaboration', 'in-progress', NULL, '/images/projects/sekouh-logo.png', '/images/projects/sekouh-cover.jpg', TRUE, FALSE, 3),
    ('superapp', 'SuperApp', 'Application de mise en relation entre clients et prestataires de services (plomberie, dépannage d''urgence, etc.).', 'Platform connecting clients with service providers (plumbing, emergency repairs and more).', 'Clients ↔ prestataires', 'Clients ↔ providers', 'collaboration', 'pilot', NULL, '/images/projects/superapp-logo.png', '/images/projects/superapp-cover.jpg', TRUE, FALSE, 4);

INSERT INTO project_highlight (project_id, text_fr, text_en, position)
SELECT p.id, v.text_fr, v.text_en, v.position
FROM (VALUES
    ('wimo', 'Conception et développement de A à Z : backend, frontend et tests', 'Designed and built end to end: backend, frontend and tests', 1),
    ('wimo', 'API de devises qui convertit automatiquement selon le pays', 'Currency API with automatic conversion by country', 2),
    ('wimo', 'Gestion de la parité fixe franc CFA ↔ euro', 'Fixed CFA franc ↔ euro peg handling', 3),
    ('vesty-shop', 'Projet réalisé entièrement seul : conception, backend, frontend, tests', 'Built entirely on my own: design, backend, frontend, tests', 1),
    ('vesty-shop', 'Catalogue en ligne et commandes sur mesure', 'Online catalogue and made-to-measure orders', 2),
    ('sekouh', 'Tests fonctionnels : création des classes et des cours', 'Functional testing: classes and courses', 1),
    ('sekouh', 'Attribution des matières aux enseignants et saisie des notes', 'Assigning subjects to teachers and entering grades', 2),
    ('superapp', 'Tests de bout en bout de l''application', 'End-to-end testing of the application', 1),
    ('superapp', 'Comptes utilisateur, administrateur et prestataire', 'User, admin and provider accounts', 2)
) AS v(slug, text_fr, text_en, position)
JOIN project p ON p.slug = v.slug;

INSERT INTO project_role (project_id, role)
SELECT p.id, v.role
FROM (VALUES
    ('wimo', 'Backend'),
    ('wimo', 'Frontend'),
    ('wimo', 'QA'),
    ('vesty-shop', 'Backend'),
    ('vesty-shop', 'Frontend'),
    ('vesty-shop', 'QA'),
    ('sekouh', 'QA'),
    ('superapp', 'QA'),
    ('superapp', 'Backend')
) AS v(slug, role)
JOIN project p ON p.slug = v.slug;

-- Union des "technologies" (projets) et des "usedIn" (outils) : voir l'analyse de qualité
INSERT INTO project_tool (project_id, tool_id, position)
SELECT p.id, t.id, v.position
FROM (VALUES
    ('wimo', 'java', 1),
    ('wimo', 'typescript', 2),
    ('wimo', 'spring-boot', 3),
    ('wimo', 'swagger', 4),
    ('wimo', 'angular', 5),
    ('wimo', 'postgresql', 6),
    ('wimo', 'junit', 7),
    ('wimo', 'docker', 8),
    ('vesty-shop', 'java', 1),
    ('vesty-shop', 'typescript', 2),
    ('vesty-shop', 'spring-boot', 3),
    ('vesty-shop', 'swagger', 4),
    ('vesty-shop', 'angular', 5),
    ('vesty-shop', 'postgresql', 6),
    ('vesty-shop', 'junit', 7),
    ('vesty-shop', 'docker', 8),
    ('sekouh', 'swagger', 1),
    ('sekouh', 'manual-testing', 2),
    ('sekouh', 'squash-tm', 3),
    ('sekouh', 'postman', 4),
    ('sekouh', 'docker', 5),
    ('superapp', 'java', 1),
    ('superapp', 'spring-boot', 2),
    ('superapp', 'swagger', 3),
    ('superapp', 'postgresql', 4),
    ('superapp', 'junit', 5),
    ('superapp', 'manual-testing', 6),
    ('superapp', 'squash-tm', 7),
    ('superapp', 'postman', 8),
    ('superapp', 'docker', 9)
) AS v(project_slug, tool_slug, position)
JOIN project p ON p.slug = v.project_slug
JOIN tool    t ON t.slug = v.tool_slug;

-- ---------- PARCOURS ----------
INSERT INTO career_entry (slug, type, start_year, end_year, title_fr, title_en, place, description_fr, description_en, visible, position) VALUES
    ('kfokam48', 'education', 2024, 2026, 'Formation en développement logiciel', 'Software development training', 'KFOKAM48', 'Admission sur concours. Développement backend, frontend et assurance qualité.', 'Admitted through a competitive exam. Backend, frontend and quality assurance.', TRUE, 1),
    ('bac', 'education', NULL, 2023, 'Baccalauréat série D', 'Baccalaureate, series D (science)', 'Institut Baudelaire Bilingue (IBB), Yaoundé', NULL, NULL, TRUE, 2),
    ('ice-cream-shop', 'experience', 2022, 2023, 'Gérant', 'Manager', 'Glacier, Yaoundé', 'Gestion des ventes, de la caisse et de la clientèle.', 'Managed sales, cash and customers.', TRUE, 3),
    ('bepc', 'education', NULL, 2018, 'BEPC', 'BEPC', 'Lycée de Bapa', NULL, NULL, FALSE, 4);
