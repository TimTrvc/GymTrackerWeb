# Architekturplan: Gym Progress Tracker

## 1. Systemübersicht

Der Gym Progress Tracker ist eine moderne Webanwendung zur Verfolgung des persönlichen Trainingsfortschritts im Fitnessstudio. Die Anwendung folgt einer klassischen dreischichtigen Architektur mit einer klaren Trennung von Frontend, Backend und Datenbank.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Web-Frontend   │◄────┤  REST-API        │◄────┤  Datenbank      │
│  (React/Vue.js) │     │  (Node.js/Express)│     │  (PostgreSQL)   │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 2. Technologie-Stack

| Bereich | Technologien |
|---------|--------------|
| Frontend | HTML5, CSS3, JavaScript, React.js |
| Backend | Node.js, Express.js |
| Datenbank | PostgreSQL |
| Authentifizierung | JWT (JSON Web Tokens) |
| Containerisierung | Docker |
| Deployment | Render Web Services |
| Versionskontrolle | Git, GitHub |
| Testing | Jest, Supertest |
| API-Dokumentation | Swagger/OpenAPI |

## 3. Systemkomponenten

### 3.1 Frontend-Architektur

Die Frontend-Architektur basiert auf einer modernen Single-Page-Application (SPA), die mit React.js implementiert wird.

#### Komponenten:

- **Komponenten-Hierarchie**
   - App (Root)
      - Layout (Header, Footer, Navigation)
      - Pages (Dashboard, Workouts, Exercises, Profile, etc.)
      - SharedComponents (Buttons, Forms, Modals, etc.)

- **State-Management**
   - Redux/Context API für globalen Zustand
   - React Hooks für lokalen Zustand

- **Routing**
   - React Router für clientseitiges Routing

- **API-Integration**
   - Axios für HTTP-Anfragen
   - Service-Layer für API-Abstraktion

- **Styling**
   - CSS-Modules/Styled Components für komponentenbasiertes Styling
   - Responsive Design für verschiedene Gerätetypen

### 3.2 Backend-Architektur

Das Backend ist eine RESTful API, implementiert mit Node.js und Express.js, und folgt einem strukturierten Schichtenmodell.

#### Komponenten:

- **API-Layer**
   - Routes: Definition der API-Endpunkte
   - Controllers: Anfrageverarbeitung und Antwortgenerierung
   - Input-Validation: Validierung eingehender Daten

- **Service-Layer**
   - Business Logic: Implementierung der Geschäftsregeln
   - Datenverarbeitung und -transformation
   - Fehlerbehebung und -behandlung

- **Data-Access-Layer**
   - Repository-Pattern für Datenbankzugriff
   - ORM/Query-Builder (z.B. Knex.js oder Sequelize)
   - Datenbankmigrationen und Seeds

- **Middleware**
   - Authentication: JWT-basierte Benutzerauthentifizierung
   - Error Handling: Zentralisierte Fehlerbehandlung
   - Logging: Protokollierung von Anfragen und Fehlern
   - CORS: Cross-Origin Resource Sharing Konfiguration

### 3.3 Datenbankarchitektur

Die Datenbank ist in PostgreSQL implementiert und folgt einem relationalen Schema mit klar definierten Beziehungen.

#### Hauptentitäten:

- **Users**
   - Benutzerauthentifizierungsdaten
   - Persönliche Informationen
   - Einstellungen

- **Workouts**
   - Trainingssitzungen der Benutzer
   - Datum, Dauer, Notizen

- **Exercises**
   - Übungsdefinitionen
   - Kategorien, Muskelgruppen, Beschreibungen

- **Sets**
   - Trainingssets für jede Übung
   - Gewicht, Wiederholungen, Satz-Nummer

- **Progress**
   - Fortschrittsdaten
   - Historische Metriken
   - Zieldaten

#### Beziehungen:

```
User 1:N Workouts
Workout 1:N ExerciseInstances
Exercise 1:N ExerciseInstances
ExerciseInstance 1:N Sets
User 1:N ProgressRecords
```

## 4. Authentifizierung und Autorisierung

Die Anwendung verwendet ein Token-basiertes Authentifizierungssystem:

- **JWT (JSON Web Tokens)**
   - Access Token für kurzfristigen Zugriff (15-60 Minuten)
   - Refresh Token für Token-Erneuerung
   - Sichere HTTP-only Cookies für Token-Speicherung

- **Autorisierungsebenen**
   - Rollenbasierte Zugriffskontrollen (User, Admin)
   - Ressourcenbasierte Zugriffskontrollen (eigene Daten)

## 5. API-Design

Die REST-API folgt Best Practices und bietet eine klare Ressourcenhierarchie:

```
/api
  /auth
    POST /login        - Benutzeranmeldung
    POST /register     - Benutzerregistrierung
    POST /refresh      - Token erneuern
    POST /logout       - Abmelden
  
  /users
    GET  /me           - Eigenes Profil abrufen
    PUT  /me           - Profil aktualisieren
    
  /workouts
    GET  /             - Alle Workouts auflisten
    POST /             - Neues Workout erstellen
    GET  /:id          - Workout-Details anzeigen
    PUT  /:id          - Workout aktualisieren
    DELETE /:id        - Workout löschen
    
  /exercises
    GET  /             - Übungen auflisten
    POST /             - Übung hinzufügen (Admin)
    GET  /:id          - Übungsdetails anzeigen
    PUT  /:id          - Übung aktualisieren (Admin)
    
  /progress
    GET  /             - Fortschrittsdaten abrufen
    POST /             - Fortschrittsdaten hinzufügen
```

## 6. Sicherheitskonzept

Das Sicherheitskonzept umfasst mehrere Ebenen:

- **Datensicherheit**
   - Passwort-Hashing mit bcrypt
   - Verschlüsselte Datenübertragung (HTTPS/SSL)
   - Prepared Statements gegen SQL-Injection

- **API-Sicherheit**
   - Input-Validierung
   - Rate Limiting
   - CORS-Konfiguration

- **Anwendungssicherheit**
   - XSS-Prävention
   - CSRF-Schutz
   - Content Security Policy

## 7. Deployment-Architektur

Die Anwendung wird mit Docker containerisiert und auf Render Web Services gehostet:

```
┌─────────────────────────────────────────────────────┐
│                  Render Web Service                 │
│                                                     │
│  ┌─────────────────┐      ┌────────────────────┐    │
│  │   Frontend      │      │      Backend       │    │
│  │  Docker Image   │      │    Docker Image    │    │
│  └─────────────────┘      └────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│              Render PostgreSQL DB                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Frontend-Deployment**
   - Statisches Hosting des React-Builds
   - CDN-Integration für schnelle Auslieferung

- **Backend-Deployment**
   - Docker-Container für die Node.js-Anwendung
   - Umgebungsvariablen für Konfiguration

- **Datenbank-Deployment**
   - Managed PostgreSQL-Datenbank bei Render
   - Automatische Backups

## 8. Skalierbarkeit und Performance

Die Architektur ist so konzipiert, dass sie horizontal und vertikal skaliert werden kann:

- **Horizontale Skalierung**
   - Stateless Backend für mehrere Instanzen
   - Load Balancing zwischen Instanzen

- **Vertikale Skalierung**
   - Anpassbare Ressourcenzuweisung in Render

- **Performance-Optimierungen**
   - Datenbankindizierung für häufige Abfragen
   - API-Response-Caching
   - Lazy Loading von Frontend-Komponenten
   - Komprimierung von Antworten

## 9. Datenbankschema

```
┌───────────────┐       ┌────────────────┐        ┌────────────────┐
│ users         │       │ workouts       │        │ exercises      │
├───────────────┤       ├────────────────┤        ├────────────────┤
│ id            │       │ id             │        │ id             │
│ email         │       │ user_id        │◄───────┤ name           │
│ password_hash │       │ date           │        │ description    │
│ name          │       │ notes          │        │ category       │
│ created_at    │       │ duration       │        │ muscle_group   │
│ updated_at    │       │ created_at     │        │ created_at     │
└───┬───────────┘       │ updated_at     │        │ updated_at     │
    │                   └──────┬─────────┘        └────────┬───────┘
    │                          │                           │
    │                          ▼                           │
    │               ┌────────────────────┐                 │
    │               │ exercise_instances │                 │
    └──────────────►├────────────────────┤◄────────────────┘
                    │ id                 │
                    │ workout_id         │
                    │ exercise_id        │
                    │ order              │
                    │ created_at         │
                    │ updated_at         │
                    └────────┬───────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ sets           │
                    ├────────────────┤
                    │ id             │
                    │ exercise_inst_id│
                    │ weight         │
                    │ reps           │
                    │ set_number     │
                    │ created_at     │
                    │ updated_at     │
                    └────────────────┘
```

## 10. Technische Schulden und Zukunftsausblick

### 10.1 Bekannte technische Schulden

- Initialer Fokus auf Funktionalität mit potenziellen Optimierungen für Leistung
- Einfaches Authentifizierungssystem ohne erweiterte Funktionen (Passwort-Reset, etc.)
- Begrenztes Testabdeckung in der ersten Phase

### 10.2 Zukünftige Erweiterungsmöglichkeiten

- Mobile App mit React Native
- Offline-Unterstützung mit Service Workers
- Erweiterte Statistik- und Visualisierungsfunktionen
- Soziale Funktionen und Sharing-Optionen
- Integration mit Fitness-Trackern und Smartwatches

## 11. Entwicklungsumgebung

Die Entwicklungsumgebung wird mit Docker Compose konfiguriert, um eine konsistente Umgebung für alle Entwickler zu gewährleisten:

- **lokaler Entwicklungsserver**
- **lokale Datenbank**
- **Hot Reloading** für Frontend und Backend
- **Gemeinsame Konfiguration** via docker-compose.yml

## 12. Überwachung und Logging

- **Anwendungslogging**
   - Winston für strukturierte Logs
   - Verschiedene Log-Level (debug, info, warn, error)

- **Fehlerüberwachung**
   - Zentrale Fehlerbehandlung
   - Potenziell: Integration mit Fehlerüberwachungsdiensten

- **Performance-Monitoring**
   - Antwortzeiten
   - Ressourcenverbrauch
   - Datenbankabfragen

Diese Architektur bietet eine solide Grundlage für die Entwicklung der Gym Progress Tracker-Anwendung und berücksichtigt wichtige Faktoren wie Skalierbarkeit, Wartbarkeit und Sicherheit. Die klare Trennung der Schichten ermöglicht eine unabhängige Entwicklung und Testung der Komponenten sowie eine einfache Erweiterung der Funktionalität in zukünftigen Versionen.