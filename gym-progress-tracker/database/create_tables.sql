-- Tabelle für Benutzerkonten
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    height NUMERIC(5,2),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Tabelle für Benutzergewicht-Tracking
CREATE TABLE user_weight_logs (
    weight_log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    weight NUMERIC(5,2) NOT NULL,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT
);

-- Tabelle für Übungskategorien (z.B. Brust, Rücken, Beine)
CREATE TABLE exercise_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(255)
);

-- Tabelle für Übungen
CREATE TABLE exercises (
    exercise_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES exercise_categories(category_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    instructions TEXT,
    difficulty_level VARCHAR(20), -- leicht, mittel, schwer
    primary_muscle_group VARCHAR(50),
    secondary_muscle_groups TEXT[],
    equipment_needed TEXT[],
    is_compound BOOLEAN DEFAULT FALSE,
    video_url VARCHAR(255),
    image_url VARCHAR(255),
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL, -- wenn es ein benutzerdefiniertes Workout ist
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für Workouts/Trainingspläne
CREATE TABLE workouts (
    workout_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    is_public BOOLEAN DEFAULT FALSE,
    times_performed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_performed TIMESTAMP WITH TIME ZONE
);

-- Verbindungstabelle für Übungen in Workouts (mit Reihenfolge)
CREATE TABLE workout_exercises (
    workout_exercise_id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- Reihenfolge der Übungen im Workout
    sets INTEGER NOT NULL,
    reps VARCHAR(50), -- kann variabel sein, z.B. "8-12" oder "bis zum Versagen"
    rest_seconds INTEGER,
    notes TEXT
);

-- Tabelle für durchgeführte Trainingssessions
CREATE TABLE training_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES workouts(workout_id) ON DELETE SET NULL,
    session_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    mood_rating INTEGER, -- 1-5 Sterne
    effort_level INTEGER, -- 1-10 Skala
    notes TEXT,
    location VARCHAR(100)
);

-- Tabelle für die Leistung je Übung in einer Session
CREATE TABLE exercise_performances (
    performance_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES training_sessions(session_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight NUMERIC(7,2), -- Gewicht in kg
    is_warmup BOOLEAN DEFAULT FALSE,
    is_dropset BOOLEAN DEFAULT FALSE,
    is_failure BOOLEAN DEFAULT FALSE,
    rpe INTEGER, -- Rate of Perceived Exertion (1-10)
    notes TEXT,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für persönliche Bestleistungen
CREATE TABLE personal_records (
    pr_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    record_type VARCHAR(20) NOT NULL, -- 1RM, 3RM, 5RM, max_reps, etc.
    value NUMERIC(7,2) NOT NULL, -- entweder Gewicht oder Wiederholungen
    performance_id INTEGER REFERENCES exercise_performances(performance_id) ON DELETE SET NULL,
    achieved_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    previous_record NUMERIC(7,2),
    notes TEXT,
    UNIQUE (user_id, exercise_id, record_type)
);

-- Tabelle für Fitnessziele
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- weight, reps, frequency, bodyweight, etc.
    current_value NUMERIC(7,2),
    target_value NUMERIC(7,2) NOT NULL,
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    achieved_at TIMESTAMP WITH TIME ZONE,
    is_achieved BOOLEAN DEFAULT FALSE
);

-- Tabelle für Körpermaße
CREATE TABLE body_measurements (
    measurement_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    chest NUMERIC(5,2),
    waist NUMERIC(5,2),
    hips NUMERIC(5,2),
    neck NUMERIC(5,2),
    biceps_left NUMERIC(5,2),
    biceps_right NUMERIC(5,2),
    thigh_left NUMERIC(5,2),
    thigh_right NUMERIC(5,2),
    calf_left NUMERIC(5,2),
    calf_right NUMERIC(5,2),
    body_fat_percentage NUMERIC(5,2),
    notes TEXT
);

-- Tabelle für Übungsvorlagen/Empfehlungen
CREATE TABLE workout_templates (
    template_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    target_audience VARCHAR(50), -- Anfänger, Fortgeschrittene, etc.
    goal VARCHAR(50), -- Kraftaufbau, Ausdauer, Abnehmen, etc.
    estimated_duration_minutes INTEGER,
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Verbindungstabelle für Übungen in Workout-Vorlagen
CREATE TABLE template_exercises (
    template_exercise_id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES workout_templates(template_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    reps VARCHAR(50),
    rest_seconds INTEGER,
    notes TEXT
);

-- Tabelle für Ernährungstagebuch (optional, falls benötigt)
CREATE TABLE nutrition_logs (
    nutrition_log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(50), -- Frühstück, Mittagessen, etc.
    calories INTEGER,
    protein_grams INTEGER,
    carbs_grams INTEGER,
    fat_grams INTEGER,
    notes TEXT,
    meal_photo VARCHAR(255)
);

-- Tabelle für Aktivitätsstatistiken
CREATE TABLE activity_stats (
    stat_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_workouts INTEGER DEFAULT 0,
    total_exercises INTEGER DEFAULT 0,
    total_sets INTEGER DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    total_weight NUMERIC(10,2) DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0
);

-- Tabelle für Freundschaften/Follower
CREATE TABLE user_connections (
    connection_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    connected_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    connection_type VARCHAR(20) NOT NULL, -- 'friend', 'follower'
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, connected_user_id)
);

-- Erstellen einiger Indizes für häufig abgefragte Spalten
CREATE INDEX idx_exercise_category ON exercises(category_id);
CREATE INDEX idx_workout_user ON workouts(user_id);
CREATE INDEX idx_session_user ON training_sessions(user_id);
CREATE INDEX idx_session_date ON training_sessions(session_date);
CREATE INDEX idx_performance_session ON exercise_performances(session_id);
CREATE INDEX idx_performance_exercise ON exercise_performances(exercise_id);
CREATE INDEX idx_personal_records_user ON personal_records(user_id, exercise_id);
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_user_weight_logs ON user_weight_logs(user_id, logged_date);