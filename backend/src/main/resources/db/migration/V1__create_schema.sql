-- ---------- PROFIL (une seule ligne, garantie par id = 1) ----------
CREATE TABLE profile (
    id                       SMALLINT     PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    full_name                VARCHAR(120) NOT NULL,
    brand                    VARCHAR(60)  NOT NULL,
    photo_url                VARCHAR(255),
    website_url              VARCHAR(255),
    location_fr              VARCHAR(120) NOT NULL,
    location_en              VARCHAR(120) NOT NULL,
    availability_status      VARCHAR(20)  NOT NULL
        CHECK (availability_status IN ('available', 'remote-only', 'unavailable')),
    availability_label_fr    VARCHAR(160) NOT NULL,
    availability_label_en    VARCHAR(160) NOT NULL,
    slogan_fr                VARCHAR(255) NOT NULL,
    slogan_en                VARCHAR(255) NOT NULL,
    description_fr           TEXT         NOT NULL,
    description_en           TEXT         NOT NULL,
    company_name             VARCHAR(120),
    company_role_fr          VARCHAR(120),
    company_role_en          VARCHAR(120),
    company_description_fr   TEXT,
    company_description_en   TEXT,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE social_link (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    network   VARCHAR(20)  NOT NULL UNIQUE
        CHECK (network IN ('linkedin','github','gitlab','youtube','tiktok',
                           'facebook','instagram','snapchat','email')),
    url       VARCHAR(255) NOT NULL,
    position  SMALLINT     NOT NULL UNIQUE
);

CREATE TABLE bio_paragraph (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text_fr   TEXT     NOT NULL,
    text_en   TEXT     NOT NULL,
    position  SMALLINT NOT NULL UNIQUE
);

CREATE TABLE profile_value (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug      VARCHAR(40)  NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    title_fr  VARCHAR(60)  NOT NULL,
    title_en  VARCHAR(60)  NOT NULL,
    text_fr   TEXT         NOT NULL,
    text_en   TEXT         NOT NULL,
    position  SMALLINT     NOT NULL UNIQUE
);

-- Qualités et centres d'intérêt : même structure, une seule table (discriminant "kind")
CREATE TABLE profile_item (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind      VARCHAR(20)  NOT NULL CHECK (kind IN ('quality', 'interest')),
    label_fr  VARCHAR(120) NOT NULL,
    label_en  VARCHAR(120) NOT NULL,
    position  SMALLINT     NOT NULL,
    UNIQUE (kind, position)
);

CREATE TABLE spoken_language (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name_fr   VARCHAR(60) NOT NULL,
    name_en   VARCHAR(60) NOT NULL,
    level_fr  VARCHAR(60) NOT NULL,
    level_en  VARCHAR(60) NOT NULL,
    position  SMALLINT    NOT NULL UNIQUE
);

-- ---------- OUTILS ---------- 
CREATE TABLE tool (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug      VARCHAR(60)  NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name_fr   VARCHAR(80)  NOT NULL,
    name_en   VARCHAR(80)  NOT NULL,
    icon      VARCHAR(60),
    category  VARCHAR(20)  NOT NULL
        CHECK (category IN ('languages','backend','frontend','database',
                            'testing','environment','ai')),
    position  SMALLINT     NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (category, position)
);

-- ---------- PROJETS ----------
CREATE TABLE project (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug              VARCHAR(60)  NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name              VARCHAR(80)  NOT NULL,
    summary_fr        TEXT         NOT NULL,
    summary_en        TEXT         NOT NULL,
    cover_tagline_fr  VARCHAR(120),
    cover_tagline_en  VARCHAR(120),
    context           VARCHAR(20)  NOT NULL CHECK (context IN ('b-her', 'collaboration')),
    status            VARCHAR(20)  NOT NULL CHECK (status IN ('in-progress', 'pilot', 'completed')),
    repository_url    VARCHAR(255),
    logo_url          VARCHAR(255),
    cover_url         VARCHAR(255),
    visible           BOOLEAN      NOT NULL DEFAULT TRUE,
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    position          SMALLINT     NOT NULL UNIQUE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    -- la phrase de couverture existe dans les deux langues, ou dans aucune
    CHECK ((cover_tagline_fr IS NULL) = (cover_tagline_en IS NULL))
);

CREATE TABLE project_highlight (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT   NOT NULL REFERENCES project (id) ON DELETE CASCADE,
    text_fr     TEXT     NOT NULL,
    text_en     TEXT     NOT NULL,
    position    SMALLINT NOT NULL,
    UNIQUE (project_id, position)
);

CREATE TABLE project_role (
    project_id  BIGINT      NOT NULL REFERENCES project (id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('Backend', 'Frontend', 'QA')),
    PRIMARY KEY (project_id, role)
);

-- Source unique des liens projet <-> outil (remplace "technologies" et "usedIn")
CREATE TABLE project_tool (
    project_id  BIGINT   NOT NULL REFERENCES project (id) ON DELETE CASCADE,
    tool_id     BIGINT   NOT NULL REFERENCES tool (id)    ON DELETE CASCADE,
    position    SMALLINT NOT NULL,
    PRIMARY KEY (project_id, tool_id)
);
CREATE INDEX idx_project_tool_tool ON project_tool (tool_id);

-- ---------- PARCOURS ----------
CREATE TABLE career_entry (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug            VARCHAR(60)  NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    type            VARCHAR(20)  NOT NULL CHECK (type IN ('education', 'experience')),
    start_year      SMALLINT     CHECK (start_year BETWEEN 1990 AND 2100),
    end_year        SMALLINT     CHECK (end_year   BETWEEN 1990 AND 2100),
    title_fr        VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160) NOT NULL,
    place           VARCHAR(160) NOT NULL,
    description_fr  TEXT,
    description_en  TEXT,
    visible         BOOLEAN      NOT NULL DEFAULT TRUE,
    position        SMALLINT     NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CHECK (start_year IS NULL OR end_year IS NULL OR start_year <= end_year),
    CHECK ((description_fr IS NULL) = (description_en IS NULL))
);
