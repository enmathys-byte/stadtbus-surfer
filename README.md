# Stadtbus Surfer 3

Eine eigenständige Winterthur-Homepage mit Stadtbus Surfer 3, Vollbildmodus und gemeinsamer Top-20-Bestenliste.

## Spielen

- Pfeiltasten oder WASD: Spur wechseln, springen und rollen.
- Leertaste: springen. P: Pause.
- Auf dem Handy im Spielfeld in die entsprechende Richtung wischen.
- Velos und Tretboard-Fahrer werden durch Rollen besiegt.
- Alle 500 Meter nimmt die Verkehrsdichte zu.
- Nach der Runde einen Spielernamen eingeben und das Ergebnis speichern.

## Winterthurer Kulisse

- HESS-Gelenkbusse mit zwei und Doppelgelenkbusse mit drei getrennten Fahrzeugteilen und gerippten Faltenbälgen, ohne Stromabnehmerstangen.
- Blaue Haltestellentafeln mit silbernem Rahmen, farbigen Linienfeldern und Winterthurer Namen, unter anderem Feldtal, Schiltwiesen, Technikum und Stadthaus.
- Ein stilisiertes Pilzdach am Hauptbahnhof ersetzt den dunklen Block am Strassenende.
- Haltestellen und Wartehäuschen liegen in der Zeichenreihenfolge vor den Hausfassaden und bleiben bis zum Vorbeifahren sichtbar.

Die Kulisse ist spielerisch stilisiert. Vorlagen: [Stadtbus-Fahrzeugpark](https://stadtbus.winterthur.ch/fahrerlebnis/fahrzeugpark), [offizielle Situationspläne](https://stadtbus.winterthur.ch/service/situationsplaene), [Haltestellentafel Feldtal](https://autobusse.startbilder.de/bild/schweiz~kt-zuerich~winterthur/749734/206663---sbw-haltestellenschild---winterthur-feldtal.html) und [Pilzdach am Bahnhofplatz](https://www.nau.ch/ort/winterthur/neue-wartehalle-am-hauptbahnhof-winterthur-eroffnet-67125150). Die Grafiken werden im Canvas gezeichnet; Referenzfotos sind nicht eingebunden.

## GitHub Pages

Die Dateien werden ohne Build-Schritt aus dem Hauptverzeichnis der Branch `main` veröffentlicht. In den Repository-Einstellungen unter **Pages** die Quelle **Deploy from a branch → main → / (root)** auswählen. Alle Dateipfade sind relativ, damit die Seite auch unter einem Repository-Pfad funktioniert.

## Gemeinsame Bestenliste

Die Homepage läuft auf GitHub Pages. Der getrennte Rekordspeicher läuft unter `https://stadtbus-surfer-rekorde.enmathys.chatgpt.site` und verwendet eine dauerhafte Datenbank. Die Adresse steht in `config.js`.

Der Server stellt pro Runde eine kurzlebige Berechtigung aus. Eine Runde lässt sich nur einmal speichern; Wiederholungen nach Verbindungsfehlern erzeugen keine doppelten Einträge. Ergebnisse werden nach Strecke, danach Batzen und danach Zeitpunkt sortiert. Angezeigt werden die besten 20 Runden. Namen sind frei wählbare Spielernamen, keine registrierten Konten.

`GET /api/scores` liest die Top 20. `POST /api/session` beginnt eine Runde, `POST /api/scores` speichert deren Ergebnis. Im Frontend gibt es keine privaten API-Schlüssel. Ein Verbindungsfehler wird angezeigt und niemals als erfolgreiche Speicherung ausgegeben.

## Dateien

- `index.html`, `styles.css`: Homepage und responsive Gestaltung.
- `spiel.html`: Stadtbus Surfer 3 mit Namensformular.
- `app.js`: Spielfenster, Vollbild und gemeinsame Bestenliste.
- `config.js`: Öffentliche Adresse des Rekordspeichers.
- `favicon.svg`, `.nojekyll`: Website-Symbol und GitHub-Pages-Konfiguration.

Das Spiel ist inspiriert von Winterthur und den Stadtbus-Fahrzeugen.
