-- =====================================================================
-- V2 : champs d'affichage des outils, révélés par l'analyse des données
-- (on ne modifie jamais V1 : on fait évoluer le schéma par un nouveau script)
-- =====================================================================
ALTER TABLE tool
    ADD COLUMN monogram       VARCHAR(4),
    ADD COLUMN usage_note_fr  VARCHAR(120),
    ADD COLUMN usage_note_en  VARCHAR(120),
    ADD COLUMN visible        BOOLEAN NOT NULL DEFAULT TRUE,
    -- chaque outil a une icône officielle OU des initiales
    ADD CONSTRAINT tool_icon_or_monogram CHECK (icon IS NOT NULL OR monogram IS NOT NULL),
    -- la note d'usage existe dans les deux langues, ou dans aucune
    ADD CONSTRAINT tool_usage_note_both_languages
        CHECK ((usage_note_fr IS NULL) = (usage_note_en IS NULL));
