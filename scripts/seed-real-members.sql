-- ============================================================
-- GLC Business Forum Platform — Echte Mitglieder Seed
-- Erstellt aus E-Mail Verteiler + Protokoll 30.10.2025
-- ============================================================
-- Im Supabase SQL Editor ausführen.
-- Löscht alle Dummy-/Testdaten, dann fügt echte Mitglieder,
-- Unternehmen und Verknüpfungen ein.
-- ON CONFLICT DO UPDATE — kann beliebig oft ausgeführt werden.
-- ============================================================

-- ============================================================
-- 0. BESTEHENDE DATEN AUFRÄUMEN
-- ============================================================
-- Reihenfolge wegen Foreign Keys: replies → posts → company_members → members/companies

DELETE FROM forum_replies;
DELETE FROM forum_posts;
DELETE FROM company_members;
DELETE FROM events;

-- Dummy-Mitglieder aus data/members.json löschen
DELETE FROM members WHERE email IN (
  'markus.freiberg@freiberg-ventures.de',
  'sophia@luminary-studios.com',
  'jonas.becker@clarafinance.io',
  'leah.osei@northstarcapital.eu',
  'david@kirchner-ai.de',
  'annalena.vogel@avogel-growth.com',
  'tobias@schreiber-advisory.de',
  'clara.weidmann@stackmesh.io',
  'michael.adeyemi@faithandventures.com',
  'nadine@hofmann-brand.de',
  'philipp.steiner@renewtech.eu',
  'rebecca.nguyen@pillar-advisory.com'
);

-- Dummy-Unternehmen aus seed.ts löschen
DELETE FROM companies WHERE slug IN (
  'clara-finance',
  'renewtech'
);

-- Für kompletten Reset diese Zeilen einkommentieren:
-- DELETE FROM members;
-- DELETE FROM companies;

-- ============================================================
-- 1. MITGLIEDER EINFÜGEN
-- ============================================================

INSERT INTO members (id, name, email, bio, tagline, job_title, skills, interests, tags, looking_for, can_help_with, is_admin, is_visible)
VALUES

-- === LEITUNGSTEAM ===

(gen_random_uuid(), 'Matthias Herrmann', 'matthias.herrmann@team-motorsport.de',
 'Matthias leitet Team Motorsport, eine Motorsport Event Agentur und Coaching-Firma in Grasbrunn. Er ist Mitglied des BF-Leitungsteams und hat beim Treffen am 30.10.2025 den Rückblick und Ausblick des Business Forums präsentiert. Er hat die Erwartungen der Teilnehmer mit der strategischen Ausrichtung des Forums abgeglichen. Tisch 1 beim Teamarbeit-Meeting. Adresse: Haarerweg 18, 85630 Grasbrunn. Tel: 0151-70066662.',
 'Motorsport Event Agentur - Coach',
 'Gründer & Coach, Team Motorsport',
 ARRAY['Event Management', 'Motorsport', 'Coaching', 'Networking', 'Führung'],
 ARRAY['Vernetzung', 'Glaube und Unternehmertum', 'Gemeindearbeit', 'Motorsport'],
 ARRAY['founder', 'operator'],
 'Vernetzung in der Gemeinde und Ausstrahlung nach außen',
 'Event Management, Coaching, Motorsport-Branche.',
 true, true),

(gen_random_uuid(), 'Frank Genann', 'frankgenann@gmail.com',
 'Frank ist Geschäftsführer (GF) von Terreal und arbeitet im Bereich Immobilien. Seine Kompetenzen liegen in Planung und Bau Ingenieurwesen. Beim BF-Treffen hat er die Zusammenfassung der Teamarbeit präsentiert. Tisch 3. Tel: 0175-1425242.',
 'Immobilien & Bau Ingenieurwesen',
 'Geschäftsführer, Terreal',
 ARRAY['Immobilien', 'Bauwesen', 'Planung', 'Ingenieurwesen', 'Projektmanagement'],
 ARRAY['Immobilien', 'Glaube und Unternehmertum', 'Gemeindearbeit', 'Bauwesen'],
 ARRAY['operator', 'advisor'],
 'Offener und vertrauensvoller Austausch',
 'Immobilienentwicklung, Bauplanung, Ingenieurwesen und Projektmanagement.',
 true, true),

(gen_random_uuid(), 'Jörg Zeiler', 'joerg.zeiler@glc.de',
 'Jörg ist Pastor am GLC München und hat einen Hintergrund im Bankwesen. Beim BF-Treffen hat er das Gebet gesprochen. Seine Kompetenz ist Ermutigung — Menschen im Glauben und im Business aufbauen. Tisch 3.',
 'Pastor und Bänker — Ermutigung ist die Mission.',
 'Pastor, GLC München',
 ARRAY['Seelsorge', 'Bankwesen', 'Ermutigung', 'Führung', 'Gebet'],
 ARRAY['Glaube und Führung', 'Gemeindearbeit', 'Seelsorge'],
 ARRAY['advisor'],
 NULL,
 'Geistliche Ermutigung, seelsorgerliche Beratung und finanzielle Perspektive aus dem Bankwesen.',
 true, true),

(gen_random_uuid(), 'Emma Lehner', 'emma.lehner@bodystreet.de',
 'Emma ist Gründerin von Bodystreet, der größten EMS-Fitness-Franchise in Europa. Ihre Kompetenzen umfassen Kommunikation und Unternehmensführung. Beim BF-Treffen hat sie für die Christen im Beruf gebetet. Tisch 3. Adresse: An der Steinernen Brücke 1, 85757 Karlsfeld. Tel: 0173-5774824.',
 'Fitness & Franchise — Kommunikation und Unternehmensführung',
 'Gründerin, Bodystreet',
 ARRAY['Franchise', 'Fitness', 'Kommunikation', 'Unternehmensführung', 'EMS-Training'],
 ARRAY['Fitness', 'Franchise', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['founder', 'operator'],
 NULL,
 'Franchise-Geschäftsmodelle, Kommunikationsstrategie und Skalierung von Consumer Brands.',
 true, true),

(gen_random_uuid(), 'Michael Schwaiger', 'mm.schwaiger@outlook.com',
 'Michael arbeitet im Bereich Immobilien und hat das strukturierte Formular für die Teamarbeit beim BF-Treffen entwickelt, um Kompetenzen und Dienstbereitschaft für die Gemeinde abzufragen. Er sucht gegenseitigen Halt im Business Forum.',
 'Immobilien — Strukturierung und Vernetzung',
 'Immobilienfachmann',
 ARRAY['Immobilien', 'Projektmanagement', 'Moderation', 'Organisationsentwicklung'],
 ARRAY['Immobilien', 'Gemeindearbeit', 'Glaube und Unternehmertum'],
 ARRAY['operator'],
 'Gegenseitiger Halt im BF erfahren',
 'Immobilien-Expertise und Strukturierung von kollaborativen Business-Initiativen.',
 false, true),

-- === MITGLIEDER 1-32 ===

(gen_random_uuid(), 'Kelvin Akpochimoraa', 'eneakelvinmusic@gmail.com',
 'Kelvin ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Wolfgang Altmann', 'info@altmannwolfgang.de',
 'Wolfgang ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Armund Daniel', 'info@steinreinigung-daniel.de',
 'Armund betreibt ein Dienstleistungsunternehmen für Gebäudereinigung, spezialisiert auf Steinreinigung. Tel: 0163-7782746.',
 'Dienstleistung Gebäude (Reinigung)',
 'Inhaber, Steinreinigung Daniel',
 ARRAY['Gebäudereinigung', 'Steinreinigung', 'Facility Management', 'Dienstleistung'],
 ARRAY['Vernetzung', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['founder'],
 'Verbindungen knüpfen — innerhalb der Gemeinde Geschäfte entwickeln',
 'Gebäudereinigung, Steinreinigung und Gebäudedienstleistungen.',
 false, true),

(gen_random_uuid(), 'Segla Dogbe', 'segladogbe@yahoo.fr',
 'Segla ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Sydney Dogbe', 's.dogbe@gmx.net',
 'Sydney ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Riccardo Genann', 'riccardogenann@hotmail.de',
 'Riccardo arbeitet im Vertrieb Immobilien. Er ist überzeugt, dass Netzwerk essentiell für Business ist und schätzt das gemeinsame Gebet im BF. Adresse: Liemesstr. 111, 81243 München. Tel: 0178-8345787.',
 'Vertrieb Immobilien',
 'Vertrieb Immobilien',
 ARRAY['Immobilien', 'Vertrieb', 'Networking'],
 ARRAY['Immobilien', 'Vernetzung', 'Glaube und Unternehmertum', 'Gebet'],
 ARRAY['operator'],
 'Netzwerk = essentiell für Business — im BF zusammen beten',
 'Immobilienvertrieb und Immobilienakquise im Raum München.',
 false, true),

(gen_random_uuid(), 'Christopher Grützemann', 'gruetze1111@hotmail.de',
 'Christopher arbeitet bei Ergo-Pro als Versicherungskaufmann. Seine Kompetenzen: Finanzbildung einfach erklären — Vorträge zu Aktien, Bitcoin etc., Existenzsicherung. Beim BF-Treffen (Tisch 1) hat er mit Tabea Schnoor gematched: Vortrag über Aktien und Umgang mit Geld kann bei Salo GmbH für junge Menschen eingesetzt werden. Er bietet der Gemeinde Orientierungshilfe bei Finanzierungen und Rentenfragen (Vorsorge).',
 'Versicherungskaufmann — Finanzbildung einfach erklären',
 'Versicherungskaufmann, Ergo-Pro',
 ARRAY['Versicherung', 'Finanzbildung', 'Investments', 'Altersvorsorge', 'Vorträge'],
 ARRAY['Finanzen', 'Investments', 'Glaube und Unternehmertum', 'Finanzbildung'],
 ARRAY['advisor'],
 NULL,
 'Finanzbildung (Vorträge zu Aktien, Bitcoin etc.), Versicherungsberatung, Altersvorsorge und Existenzsicherung. Orientierungshilfe bei Finanzierungen und Rentenfragen für die Gemeinde.',
 false, true),

(gen_random_uuid(), 'Saskia Günther', 'guenthersaskia@gmx.net',
 'Saskia arbeitet im Bauingenieurwesen und möchte ein christliches Unternehmen aufbauen. Adresse: Stieglitzgasse 8, 85551 Heimstetten. Tel: 0152-58480395.',
 'Bauingenieurwesen',
 'Bauingenieurin',
 ARRAY['Bauingenieurwesen', 'Bauwesen', 'Projektmanagement'],
 ARRAY['Glaube und Unternehmertum', 'Unternehmensgründung', 'Bauwesen'],
 ARRAY['technical'],
 'Will christliches Unternehmen aufbauen',
 'Bauingenieurwesen und Bauwesen-Expertise.',
 false, true),

(gen_random_uuid(), 'Manuela Heldt-Krause', 'fa.krause@outlook.de',
 'Manuela arbeitet in der Gastronomie und ist Mitglied des GLC Business Forums.',
 'Gastronomie',
 'Gastronomie',
 ARRAY['Gastronomie', 'Gastgewerbe', 'Lebensmittel'],
 ARRAY['Gastronomie', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['operator'],
 NULL,
 'Gastronomie und Gastgewerbe-Erfahrung.',
 false, true),

(gen_random_uuid(), 'Nina Hensel', 'ninahensel@hotmail.com',
 'Nina ist spezialisiert auf Online Marketing & Grafik Design und arbeitet als KI Artist für Musik. Sie möchte ein eigenes Unternehmen gründen und sucht nach Erfahrungen von anderen Unternehmern. Tel: 0160-95345479.',
 'Online Marketing & Grafik Design — KI Artist für Musik',
 'Online Marketing & Grafik Design / KI Artist',
 ARRAY['Online Marketing', 'Grafik Design', 'KI', 'Musik', 'Digitale Kunst'],
 ARRAY['Unternehmertum', 'KI', 'Kreatives Unternehmertum', 'Gemeindearbeit'],
 ARRAY['creative', 'technical'],
 'Will eigenes Unternehmen gründen — sucht nach Erfahrungen',
 'Online Marketing, Grafik Design und KI-generierte Musikkunst.',
 false, true),

(gen_random_uuid(), 'Rainer Hezel', 'rhezel@t-online.de',
 'Rainer ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Fidi Höllenreiner', 'zigp@gmx.de',
 'Fidi betreibt ein Unternehmen für Entsorgung Alt-Metall (Schrott). Adresse: Säulenstr. 16, 82008 Unterhaching. Tel: 0152-54137741.',
 'Entsorgung Alt-Metall (Schrott)',
 'Inhaber, Altmetall-Entsorgung',
 ARRAY['Recycling', 'Metallentsorgung', 'Abfallwirtschaft', 'Logistik'],
 ARRAY['Recycling', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['founder'],
 NULL,
 'Altmetall-Entsorgung, Recycling und Abfallwirtschaft.',
 false, true),

(gen_random_uuid(), 'Amos Hornstein', 'amos.hornstein@whu.edu',
 'Amos ist Co-Founder des Start-ups raaaw — Getränke Start Up (Wasser mit Geschmack), Bio Zitrone. Beim BF-Treffen (Tisch 2) hat er über Elisabeth angefragt, das Meeting mit seinem Getränk zu unterstützen. Rein zufällig war er am Tisch mit Matthias Lehner (Founder Bodystreet — EMS-Training), der starkes Interesse zeigte, das Getränk bei Bodystreet zu vermarkten = konkretes Networking-Beispiel! Adresse: Grainerberg 13, 81371 München. Tel: 0151-42396352.',
 'Getränke Start Up (Wasser mit Geschmack)',
 'Co-Founder, raaaw',
 ARRAY['Getränke', 'Start-up', 'Fundraising', 'Produktentwicklung', 'FMCG'],
 ARRAY['Start-up', 'Vernetzung', 'Glaube und Unternehmertum', 'FMCG', 'Gesundheit'],
 ARRAY['founder'],
 'Austausch über Themen im Business — gemeinsam Geschäfte machen',
 'Start-up-Gründungserfahrung, Getränkebranche und WHU-Alumni-Netzwerk.',
 false, true),

(gen_random_uuid(), 'Matthias Lehner', 'matthias.lehner@bodystreet.de',
 'Matthias ist Gründer von Bodystreet, Europas größter EMS-Fitness-Franchise (EMS-Training). Beim BF-Treffen (Tisch 2) zeigte er starkes Interesse, das Getränk raaaw von Amos Hornstein bei Bodystreet zu vermarkten. Kompetenzen: Netzwerken, Franchise-Entwicklung, Wachstumsstrategie. Adresse: An der Steinernen Brücke 1, 85757 Karlsfeld.',
 'Fitness — Europas größte EMS-Fitness-Franchise',
 'Gründer & CEO, Bodystreet',
 ARRAY['Franchise', 'Fitness', 'EMS-Training', 'Unternehmertum', 'Wachstumsstrategie'],
 ARRAY['Fitness', 'Franchise', 'Vernetzung', 'Glaube und Unternehmertum'],
 ARRAY['founder', 'operator'],
 NULL,
 'Franchise-Geschäftsmodelle, Skalierung von Consumer Brands und EMS-Fitness-Branche.',
 false, true),

(gen_random_uuid(), 'Adrian Montoya', 'adrian@avlana.co',
 'Adrian ist Gründer der Avlana AG, ein Software Start Up für Videoproduktion Footage. Tisch 2 beim BF-Treffen, unter Gründern und Unternehmern mit Kompetenzen in Netzwerken, Fundraising, Unternehmensaufbau und Wachstumsstrategie. Adresse: Am Schäferanger 9 App 205, 85764 Oberschleißheim. Tel: 0173-1928390.',
 'Avlana AG Software Start Up (Videoproduktion Footage)',
 'Gründer, Avlana AG',
 ARRAY['Softwareentwicklung', 'Videoproduktion', 'Start-up', 'Produktentwicklung'],
 ARRAY['Start-up', 'Software', 'Vernetzung', 'Glaube und Unternehmertum'],
 ARRAY['founder', 'technical'],
 'Austausch',
 'Softwareentwicklung, Videoproduktion-Technologie und Start-up-Erfahrung.',
 true, true),

(gen_random_uuid(), 'Lukas Niederleitner', 'oriant95@gmail.com',
 'Lukas ist Mitglied des GLC Business Forums. Tel: 0151-25344214.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Adam Niedermeier', 'adam.niedermeier@t-online.de',
 'Adam arbeitet bei Avnet Logistics GmbH als Bauteileprogrammierer im Bereich Dienstleistung Halbleiter und ist stellvertretender Betriebsrat. Kompetenzen (aus Tisch 2): Arbeitssicherheit und Brandschutz, Mitarbeiterentwicklung, Arbeitsrecht. Tel: 0171-2623559.',
 'Dienstleistung Halbleiter — stellvertr. Betriebsrat',
 'Bauteileprogrammierer & stellvertr. Betriebsrat, Avnet Logistics GmbH',
 ARRAY['Halbleiter', 'Elektronik', 'Mitarbeiterentwicklung', 'Arbeitsrecht', 'Betriebsrat'],
 ARRAY['Technologie', 'Mitarbeiterentwicklung', 'Glaube und Unternehmertum', 'Arbeitsrecht'],
 ARRAY['technical', 'operator'],
 'Immer besser mit Gott im Business unterwegs sein',
 'Halbleiter-Branche, Mitarbeiterentwicklung, Arbeitsrecht und Betriebsrat-Angelegenheiten.',
 false, true),

(gen_random_uuid(), 'Ulrike Patalla', 'ulrikepatalla@web.de',
 'Ulrike arbeitet in der Psychotherapie und ist Mitglied des GLC Business Forums.',
 'Psychotherapie',
 'Psychotherapeutin',
 ARRAY['Psychotherapie', 'Psychische Gesundheit', 'Beratung'],
 ARRAY['Psychische Gesundheit', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['advisor'],
 NULL,
 'Psychotherapie und psychische Gesundheit.',
 false, true),

(gen_random_uuid(), 'Karl Rauffer', 'karl.rauffer@innenausbau-rauffer.de',
 'Karl betreibt Innenausbau Rauffer, ein Unternehmen spezialisiert auf Innenausbau.',
 'Innenausbau',
 'Inhaber, Innenausbau Rauffer',
 ARRAY['Innenausbau', 'Schreinerei', 'Ausbau', 'Renovierung'],
 ARRAY['Bauwesen', 'Glaube und Unternehmertum', 'Handwerk'],
 ARRAY['founder'],
 NULL,
 'Innenausbau, Renovierung und Ausbauprojekte.',
 false, true),

(gen_random_uuid(), 'Stephan Rose', 'stephan.rose@online.de',
 'Stephan ist Elektriker (angestellt) und Mitglied des GLC Business Forums.',
 'Elektriker Angestellt',
 'Elektriker',
 ARRAY['Elektrotechnik', 'Installation', 'Wartung'],
 ARRAY['Elektrohandwerk', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['technical'],
 NULL,
 'Elektroinstallation und Wartung.',
 false, true),

(gen_random_uuid(), 'Marco Säfke', 'marco.saefke@gmail.com',
 'Marco hat eine leitende Position bei Edeka. Adresse: Josef-Martin-Bauer Straße 19, 84405 Dorfen. Tel: 0151-22372573.',
 'Edeka Leitende Position',
 'Leitende Position, Edeka',
 ARRAY['Einzelhandel', 'Management', 'Lieferkette', 'Führung'],
 ARRAY['Einzelhandel', 'Führung', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['operator'],
 NULL,
 'Einzelhandel, Lieferkettenmanagement und Führungserfahrung.',
 false, true),

(gen_random_uuid(), 'Emanuel Schefer', 'emanuel.schefer@icloud.com',
 'Emanuel ist Fachkraft für Arbeitssicherheit und Brandschutz sowie Experte für PV Anlagen (Photovoltaik). Tisch 2 beim BF-Treffen unter den Angestellten Fachkräften.',
 'Fachkraft Arbeitssicherheit — Experte PV Anlagen',
 'Fachkraft Arbeitssicherheit & PV-Experte',
 ARRAY['Arbeitssicherheit', 'Brandschutz', 'Photovoltaik', 'Erneuerbare Energien', 'Compliance'],
 ARRAY['Arbeitssicherheit', 'Erneuerbare Energien', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['technical', 'advisor'],
 NULL,
 'Arbeitssicherheitsprüfungen, Brandschutzplanung und Photovoltaik-Expertise.',
 false, true),

(gen_random_uuid(), 'Betina Siebold', 'betina.siebold@gmx.de',
 'Betina arbeitet als Finanzbuchhalterin und ist Mitglied des GLC Business Forums.',
 'Finanzbuchhalter',
 'Finanzbuchhalterin',
 ARRAY['Buchhaltung', 'Finanzbuchhaltung', 'Finanzberichterstattung', 'Steuern'],
 ARRAY['Finanzen', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['operator'],
 NULL,
 'Finanzbuchhaltung, Buchführung und Finanzberichterstattung.',
 false, true),

(gen_random_uuid(), 'Damaris Steudle', 'info@steudle-im.de',
 'Damaris betreibt Steudle Immobilien Management. Adresse: Olschewskibogen 18, 80935 München. Tel: 0176-20546073.',
 'Immobilien Management',
 'Inhaberin, Steudle Immobilien Management',
 ARRAY['Immobilienverwaltung', 'Immobilien', 'Facility Management', 'Mieterverwaltung'],
 ARRAY['Immobilien', 'Selbständigkeit', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['founder', 'operator'],
 'Selbständige kennenlernen und mit Gott gehen',
 'Immobilienverwaltung und Facility Management in München.',
 false, true),

(gen_random_uuid(), 'Anja Theiss', 'a.theiss@tiedtke-theiss.com',
 'Anja ist GF einer Agentur für Immobilienkonzepte, Perlentor, Face the Light. Immobilien (Leitsysteme für gewerbliche Gebäude) Foyers aufbereiten. Kompetenzen (Tisch 1): Kommunikation, Netzwerkerin, Seelsorge, Schulungen. Networking-Matches: Anja + Tabea: Perlentor ist interessant für Tabea, da bei Salo GmbH Hilfe suchende Frauen vermittelt werden können = match! Tabea + Anja: die Kompetenz von Tabea (Erkennen von Stärken) darauf möchte Anja gerne zurückgreifen = match! Dienst für die Gemeinde: Aufklärung über Okkultismus, New Age für die Gemeinde. Tel: 0151-27508041.',
 'Immobilien (Leitsysteme für gewerbl. Gebäude) Foyers aufbereiten',
 'GF, Immobilienkonzepte / Perlentor / Face the Light',
 ARRAY['Immobilien', 'Kommunikation', 'Networking', 'Seelsorge', 'Schulungen', 'Leitsysteme'],
 ARRAY['Immobilien', 'Vernetzung', 'Glaube und Unternehmertum', 'Gemeindearbeit', 'Frauenförderung'],
 ARRAY['founder', 'operator'],
 'Konnekten innerhalb der Gemeinde und außerhalb',
 'Immobilienkonzepte, Leitsysteme für gewerbliche Gebäude, Foyer-Aufbereitung, Kommunikation, Schulungen, Seelsorge und Aufklärung über Okkultismus/New Age.',
 false, true),

(gen_random_uuid(), 'Gerry Theiss', 'gerry.theiss@tiedtke-theiss.com',
 'Gerry arbeitet im Bereich Immobilien und ist Mitglied des GLC Business Forums. (Hinweis: Keine E-Mail im Original — Platzhalter basierend auf Familien-Firmendomain.)',
 'Immobilien',
 'Immobilienfachmann',
 ARRAY['Immobilien'],
 ARRAY['Immobilien', 'Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY['operator'],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Albertinho Mambo', 'a.mambo1955@gmail.com',
 'Albertinho ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Frank Shizoo', 'frank@shizoo.asia',
 'Frank ist Mitglied des GLC Business Forums.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Jackie L.', 'jla_india@hotmail.com',
 'Jackie ist Mitglied des GLC Business Forums. Kontakt über Emma Lehner.',
 NULL,
 NULL,
 ARRAY[]::text[],
 ARRAY['Glaube und Unternehmertum', 'Gemeindearbeit'],
 ARRAY[]::text[],
 NULL,
 NULL,
 false, true),

(gen_random_uuid(), 'Christine Sönning', 'info@christine-soennig.de',
 'Christine bietet Seelsorge und Coaching für Unternehmen und Einzelpersonen an. Kompetenzen (Tisch 1): spezielle Seelsorge für Frauen, Gabe von Gott, ins Herz der Menschen zu schauen. Networking-Match: Christine + Tabea: Coaching im Traumata-Bereich ist bei Salo GmbH nachgefragt = match! Dienst für die Gemeinde: Seelsorge für Frauen in unserer Gemeinde. Adresse: Daisenbergstr. 5, 83607 Holzkirchen. Tel: 0170-7949418.',
 'Coaching für Unternehmen und Einzelpersonen',
 'Coach & Seelsorgerin',
 ARRAY['Coaching', 'Seelsorge', 'Traumaberatung', 'Frauenförderung', 'Geistliche Begleitung'],
 ARRAY['Coaching', 'Seelsorge', 'Glaube und Unternehmertum', 'Frauenförderung'],
 ARRAY['advisor'],
 NULL,
 'Business-Coaching, Seelsorge für Frauen, Traumaberatung und geistliche Begleitung für Berufstätige. Seelsorge für Frauen in der Gemeinde.',
 false, true),

(gen_random_uuid(), 'Tabea Schnoor', 'tabea.schnoor@gmail.com',
 'Tabea arbeitet bei der Salo GmbH als Expertin für berufliche Rehabilitation, Niederlassungsleitung. Kompetenzen (Tisch 1): Integration von Menschen mit Einschränkungen und schweren Lebenslagen ins Arbeitsleben zurückzubringen, Netzwerkerin, Stärken und Fähigkeiten in Anderen zu erkennen. Networking-Matches: Anja + Tabea: Perlentor ist interessant für Tabea (Salo GmbH, Hilfe suchende Frauen) = match! Christine + Tabea: Coaching im Traumata-Bereich = match! Christopher + Tabea: Finanzbildung für junge Menschen = match! Tabea + Anja: Erkennen von Stärken = match! Dienst für die Gemeinde: Hilfe für Eltern bei Kindeserziehung, Hilfe bei Depression und Long Covid.',
 'Salo GmbH — berufliche Rehabilitation, Stärken erkennen',
 'Niederlassungsleitung, Salo GmbH',
 ARRAY['Rehabilitation', 'Personalwesen', 'Stärkenerkennung', 'Networking', 'Soziale Dienste', 'Coaching'],
 ARRAY['Rehabilitation', 'Soziale Wirkung', 'Glaube und Unternehmertum', 'Gemeindearbeit', 'Vernetzung'],
 ARRAY['operator', 'advisor'],
 NULL,
 'Berufliche Rehabilitation, Stärken- und Fähigkeitserkennung, Integration von Menschen mit Einschränkungen ins Arbeitsleben. Hilfe für Eltern bei Kindeserziehung, Depression und Long Covid.',
 false, true),

(gen_random_uuid(), 'Steve Clark', 'steveclark@gmx.de',
 'Steve arbeitet im Akustikbau weltweit. Kompetenzen (Tisch 3): Visionen. Er wurde als potenzieller interner Sprecher für ein BF-Event 2026 vorgeschlagen, um sein Zeugnis zu teilen. Zeugnisse aus Philippinen: Gefängnis, Krebsgeschwür, Tote zum Leben erweckt etc.',
 'Akustikbau weltweit — Zeugnisse aus Philippinen',
 'Akustikbau',
 ARRAY['Akustikbau', 'Internationales Geschäft', 'Visionäre Führung'],
 ARRAY['Glaube und Unternehmertum', 'Mission', 'Zeugnisse', 'Bauwesen'],
 ARRAY['operator'],
 NULL,
 'Akustikbau-Expertise weltweit und Glaubenszeugnisse.',
 false, true),

(gen_random_uuid(), 'Matthias Schwaiger', 'matthias.schwaiger@straight-re.de',
 'Matthias ist Geschäftsführer (GF) der Straight Real Estate GmbH. Tisch 2 beim BF-Treffen unter Gründern und Geschäftsführern. Kompetenzen: Online Business und Digitalkompetenz zu Immobilien und Projektsteuerung. (Hinweis: E-Mail abgeleitet von Firmendomain — bitte verifizieren.)',
 'GF Straight Real Estate GmbH — Immobilien & Projektsteuerung',
 'Geschäftsführer, Straight Real Estate GmbH',
 ARRAY['Immobilien', 'Projektsteuerung', 'Digitales Business', 'Projektentwicklung'],
 ARRAY['Immobilien', 'Digitale Transformation', 'Glaube und Unternehmertum', 'Vernetzung'],
 ARRAY['founder', 'operator'],
 NULL,
 'Immobilienentwicklung, Online Business, Digitalkompetenz für Immobilien und Projektsteuerung.',
 false, true),

(gen_random_uuid(), 'Jürgen Nehemia', 'juergen@nehemia-cc.de',
 'Jürgen betreibt Nehemia Creation Care — Unternehmer Beratung, Strategien und Analyse. Tisch 3 beim BF-Treffen. Zusammenfassung Tisch 3: Divine Connection, Management by Holy Spirit, Es gibt keine 2 Welten — sondern nur die Göttliche. (Hinweis: E-Mail ist Platzhalter — bitte verifizieren.)',
 'Nehemia Creation Care — Unternehmer Beratung, Strategien und Analyse',
 'Gründer, Nehemia Creation Care',
 ARRAY['Unternehmensberatung', 'Strategie', 'Analyse', 'Unternehmertum'],
 ARRAY['Geschäftsstrategie', 'Glaube und Führung', 'Beratung', 'Gemeindearbeit'],
 ARRAY['advisor', 'founder'],
 NULL,
 'Geschäftsstrategie, Unternehmerberatung und strategische Analyse.',
 false, true)

ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  tagline = EXCLUDED.tagline,
  job_title = EXCLUDED.job_title,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  tags = EXCLUDED.tags,
  looking_for = EXCLUDED.looking_for,
  can_help_with = EXCLUDED.can_help_with,
  is_admin = EXCLUDED.is_admin,
  is_visible = EXCLUDED.is_visible,
  updated_at = now();


-- ============================================================
-- 2. UNTERNEHMEN EINFÜGEN
-- ============================================================

INSERT INTO companies (id, name, slug, description, industry, stage, website_url)
VALUES
  (gen_random_uuid(), 'Team Motorsport', 'team-motorsport',
   'Motorsport Event Agentur und Coaching, ansässig in Grasbrunn bei München.',
   'Events & Coaching', 'SME', 'https://team-motorsport.de'),

  (gen_random_uuid(), 'Terreal', 'terreal',
   'Immobilienentwicklung und Bau Ingenieurwesen.',
   'Immobilien & Bauwesen', 'Enterprise', NULL),

  (gen_random_uuid(), 'Bodystreet', 'bodystreet',
   'Europas größte EMS-Fitness-Franchise (Electro Muscle Stimulation) mit über 300 Studios.',
   'Fitness & Franchise', 'Enterprise', 'https://bodystreet.de'),

  (gen_random_uuid(), 'Steinreinigung Daniel', 'steinreinigung-daniel',
   'Dienstleistung Gebäude — professionelle Stein- und Gebäudereinigung.',
   'Gebäudedienstleistung', 'Freelancer', 'https://steinreinigung-daniel.de'),

  (gen_random_uuid(), 'raaaw', 'raaaw',
   'Getränke Start Up — Bio Zitrone, Wasser mit Geschmack.',
   'Getränke / FMCG', 'Startup', NULL),

  (gen_random_uuid(), 'Avlana AG', 'avlana-ag',
   'Software Start Up spezialisiert auf Videoproduktion Footage.',
   'Software / Tech', 'Startup', 'https://avlana.co'),

  (gen_random_uuid(), 'Avnet Logistics GmbH', 'avnet-logistics',
   'Dienstleistung Halbleiter — Bauteileprogrammierung und Logistik.',
   'Halbleiter / Logistik', 'Enterprise', NULL),

  (gen_random_uuid(), 'Innenausbau Rauffer', 'innenausbau-rauffer',
   'Innenausbau und Renovierung.',
   'Bauwesen / Innenausbau', 'SME', NULL),

  (gen_random_uuid(), 'Steudle Immobilien Management', 'steudle-im',
   'Immobilien Management in München.',
   'Immobilien / Verwaltung', 'SME', 'https://steudle-im.de'),

  (gen_random_uuid(), 'Tiedtke Theiss (Immobilienkonzepte / Perlentor / Face the Light)', 'tiedtke-theiss',
   'Agentur für Immobilienkonzepte, Perlentor (Frauenförderung) und Face the Light. Leitsysteme für gewerbliche Gebäude, Foyers aufbereiten.',
   'Immobilien / Agentur', 'SME', NULL),

  (gen_random_uuid(), 'Ergo-Pro', 'ergo-pro',
   'Versicherung und Finanzdienstleistungen.',
   'Versicherung / Finanzen', 'Enterprise', NULL),

  (gen_random_uuid(), 'Salo GmbH', 'salo-gmbh',
   'Experte für berufliche Rehabilitation — Integration von Menschen mit Einschränkungen und schweren Lebenslagen ins Arbeitsleben.',
   'Soziale Dienste / Rehabilitation', 'SME', NULL),

  (gen_random_uuid(), 'Straight Real Estate GmbH', 'straight-real-estate',
   'Immobilienentwicklung und Projektsteuerung.',
   'Immobilien', 'SME', NULL),

  (gen_random_uuid(), 'Nehemia Creation Care', 'nehemia-creation-care',
   'Unternehmer Beratung — Strategien und Analyse.',
   'Beratung', 'Freelancer', NULL),

  (gen_random_uuid(), 'Christine Sönning Coaching', 'christine-soenning-coaching',
   'Coaching für Unternehmen und Einzelpersonen, Spezialisierung auf Seelsorge und Traumaberatung.',
   'Coaching / Beratung', 'Freelancer', 'https://christine-soennig.de'),

  (gen_random_uuid(), 'Edeka (Marco Säfke)', 'edeka',
   'Einer der größten Supermarktketten Deutschlands. Marco Säfke in leitender Position.',
   'Einzelhandel / FMCG', 'Enterprise', 'https://edeka.de')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  industry = EXCLUDED.industry,
  stage = EXCLUDED.stage,
  website_url = COALESCE(EXCLUDED.website_url, companies.website_url),
  updated_at = now();


-- ============================================================
-- 3. MITGLIEDER MIT UNTERNEHMEN VERKNÜPFEN (company_members)
-- ============================================================

INSERT INTO company_members (id, company_id, member_id, role, is_primary)
SELECT gen_random_uuid(), c.id, m.id, r.role::text, true
FROM (VALUES
  ('team-motorsport',        'matthias.herrmann@team-motorsport.de', 'Founder'),
  ('terreal',                'frankgenann@gmail.com',                'Founder'),
  ('bodystreet',             'emma.lehner@bodystreet.de',            'Co-Founder'),
  ('bodystreet',             'matthias.lehner@bodystreet.de',        'Founder'),
  ('steinreinigung-daniel',  'info@steinreinigung-daniel.de',       'Founder'),
  ('raaaw',                  'amos.hornstein@whu.edu',               'Co-Founder'),
  ('avlana-ag',              'adrian@avlana.co',                     'Founder'),
  ('avnet-logistics',        'adam.niedermeier@t-online.de',         'Employee'),
  ('innenausbau-rauffer',    'karl.rauffer@innenausbau-rauffer.de',  'Founder'),
  ('steudle-im',             'info@steudle-im.de',                   'Founder'),
  ('tiedtke-theiss',         'a.theiss@tiedtke-theiss.com',         'Founder'),
  ('ergo-pro',               'gruetze1111@hotmail.de',               'Employee'),
  ('salo-gmbh',              'tabea.schnoor@gmail.com',              'Employee'),
  ('straight-real-estate',   'matthias.schwaiger@straight-re.de',    'Founder'),
  ('nehemia-creation-care',  'juergen@nehemia-cc.de',                'Founder'),
  ('christine-soenning-coaching', 'info@christine-soennig.de',       'Founder'),
  ('edeka',                  'marco.saefke@gmail.com',               'Employee')
) AS r(company_slug, member_email, role)
JOIN companies c ON c.slug = r.company_slug
JOIN members m ON m.email = r.member_email
ON CONFLICT DO NOTHING;


-- ============================================================
-- 4. ÜBERPRÜFUNG
-- ============================================================

-- SELECT count(*) AS gesamt_mitglieder FROM members;
-- SELECT count(*) AS gesamt_unternehmen FROM companies;
-- SELECT count(*) AS gesamt_verknüpfungen FROM company_members;
-- SELECT m.name, m.email, c.name AS unternehmen, cm.role
--   FROM company_members cm
--   JOIN members m ON m.id = cm.member_id
--   JOIN companies c ON c.id = cm.company_id
--   ORDER BY m.name;
