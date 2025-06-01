--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.2

-- Started on 2025-06-01 22:21:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 246 (class 1259 OID 16710)
-- Name: activity_stats; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.activity_stats (
    stat_id integer NOT NULL,
    user_id integer,
    stat_date date DEFAULT CURRENT_DATE NOT NULL,
    total_workouts integer DEFAULT 0,
    total_exercises integer DEFAULT 0,
    total_sets integer DEFAULT 0,
    total_reps integer DEFAULT 0,
    total_weight numeric(10,2) DEFAULT 0,
    total_duration_minutes integer DEFAULT 0
);


ALTER TABLE public.activity_stats OWNER TO doadmin;

--
-- TOC entry 245 (class 1259 OID 16709)
-- Name: activity_stats_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.activity_stats_stat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_stats_stat_id_seq OWNER TO doadmin;

--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 245
-- Name: activity_stats_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.activity_stats_stat_id_seq OWNED BY public.activity_stats.stat_id;


--
-- TOC entry 250 (class 1259 OID 16764)
-- Name: avatar; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.avatar (
    user_id integer NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    hp numeric(10,2) DEFAULT 10 NOT NULL,
    mp numeric(10,2) DEFAULT 10 NOT NULL,
    attack numeric(10,2) DEFAULT 10 NOT NULL,
    defense integer DEFAULT 10 NOT NULL,
    agility integer DEFAULT 10 NOT NULL,
    boss_level integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.avatar OWNER TO doadmin;

--
-- TOC entry 238 (class 1259 OID 16646)
-- Name: body_measurements; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.body_measurements (
    measurement_id integer NOT NULL,
    user_id integer,
    measurement_date date DEFAULT CURRENT_DATE NOT NULL,
    chest numeric(5,2),
    waist numeric(5,2),
    hips numeric(5,2),
    neck numeric(5,2),
    biceps_left numeric(5,2),
    biceps_right numeric(5,2),
    thigh_left numeric(5,2),
    thigh_right numeric(5,2),
    calf_left numeric(5,2),
    calf_right numeric(5,2),
    body_fat_percentage numeric(5,2),
    notes text
);


ALTER TABLE public.body_measurements OWNER TO doadmin;

--
-- TOC entry 237 (class 1259 OID 16645)
-- Name: body_measurements_measurement_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.body_measurements_measurement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.body_measurements_measurement_id_seq OWNER TO doadmin;

--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 237
-- Name: body_measurements_measurement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.body_measurements_measurement_id_seq OWNED BY public.body_measurements.measurement_id;


--
-- TOC entry 249 (class 1259 OID 16759)
-- Name: emails; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.emails (
    email character varying(50) NOT NULL
);


ALTER TABLE public.emails OWNER TO doadmin;

--
-- TOC entry 222 (class 1259 OID 16490)
-- Name: exercise_categories; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.exercise_categories (
    category_id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    icon character varying(255)
);


ALTER TABLE public.exercise_categories OWNER TO doadmin;

--
-- TOC entry 221 (class 1259 OID 16489)
-- Name: exercise_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.exercise_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercise_categories_category_id_seq OWNER TO doadmin;

--
-- TOC entry 4649 (class 0 OID 0)
-- Dependencies: 221
-- Name: exercise_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.exercise_categories_category_id_seq OWNED BY public.exercise_categories.category_id;


--
-- TOC entry 232 (class 1259 OID 16577)
-- Name: exercise_performances; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.exercise_performances (
    performance_id integer NOT NULL,
    session_id integer,
    exercise_id integer,
    set_number integer NOT NULL,
    reps integer NOT NULL,
    weight numeric(7,2),
    is_warmup boolean DEFAULT false,
    is_dropset boolean DEFAULT false,
    is_failure boolean DEFAULT false,
    rpe integer,
    notes text,
    performed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exercise_performances OWNER TO doadmin;

--
-- TOC entry 231 (class 1259 OID 16576)
-- Name: exercise_performances_performance_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.exercise_performances_performance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercise_performances_performance_id_seq OWNER TO doadmin;

--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 231
-- Name: exercise_performances_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.exercise_performances_performance_id_seq OWNED BY public.exercise_performances.performance_id;


--
-- TOC entry 224 (class 1259 OID 16499)
-- Name: exercises; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.exercises (
    exercise_id integer NOT NULL,
    category_id integer,
    name character varying(100) NOT NULL,
    description text,
    instructions text,
    difficulty_level character varying(20),
    primary_muscle_group character varying(50),
    secondary_muscle_groups text[],
    equipment_needed text[],
    is_compound boolean DEFAULT false,
    video_url character varying(255),
    image_url character varying(255),
    created_by integer,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exercises OWNER TO doadmin;

--
-- TOC entry 223 (class 1259 OID 16498)
-- Name: exercises_exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.exercises_exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercises_exercise_id_seq OWNER TO doadmin;

--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 223
-- Name: exercises_exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.exercises_exercise_id_seq OWNED BY public.exercises.exercise_id;


--
-- TOC entry 236 (class 1259 OID 16627)
-- Name: goals; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.goals (
    goal_id integer NOT NULL,
    user_id integer,
    exercise_id integer,
    goal_type character varying(50) NOT NULL,
    current_value numeric(7,2),
    target_value numeric(7,2) NOT NULL,
    deadline date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    achieved_at timestamp with time zone,
    is_achieved boolean DEFAULT false
);


ALTER TABLE public.goals OWNER TO doadmin;

--
-- TOC entry 235 (class 1259 OID 16626)
-- Name: goals_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.goals_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goals_goal_id_seq OWNER TO doadmin;

--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 235
-- Name: goals_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.goals_goal_id_seq OWNED BY public.goals.goal_id;


--
-- TOC entry 244 (class 1259 OID 16695)
-- Name: nutrition_logs; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.nutrition_logs (
    nutrition_log_id integer NOT NULL,
    user_id integer,
    log_date date DEFAULT CURRENT_DATE NOT NULL,
    meal_type character varying(50),
    calories integer,
    protein_grams integer,
    carbs_grams integer,
    fat_grams integer,
    notes text,
    meal_photo character varying(255)
);


ALTER TABLE public.nutrition_logs OWNER TO doadmin;

--
-- TOC entry 243 (class 1259 OID 16694)
-- Name: nutrition_logs_nutrition_log_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.nutrition_logs_nutrition_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nutrition_logs_nutrition_log_id_seq OWNER TO doadmin;

--
-- TOC entry 4657 (class 0 OID 0)
-- Dependencies: 243
-- Name: nutrition_logs_nutrition_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.nutrition_logs_nutrition_log_id_seq OWNED BY public.nutrition_logs.nutrition_log_id;


--
-- TOC entry 234 (class 1259 OID 16600)
-- Name: personal_records; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.personal_records (
    pr_id integer NOT NULL,
    user_id integer,
    exercise_id integer,
    record_type character varying(20) NOT NULL,
    value numeric(7,2) NOT NULL,
    performance_id integer,
    achieved_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    previous_record numeric(7,2),
    notes text
);


ALTER TABLE public.personal_records OWNER TO doadmin;

--
-- TOC entry 233 (class 1259 OID 16599)
-- Name: personal_records_pr_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.personal_records_pr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_records_pr_id_seq OWNER TO doadmin;

--
-- TOC entry 4659 (class 0 OID 0)
-- Dependencies: 233
-- Name: personal_records_pr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.personal_records_pr_id_seq OWNED BY public.personal_records.pr_id;


--
-- TOC entry 242 (class 1259 OID 16676)
-- Name: template_exercises; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.template_exercises (
    template_exercise_id integer NOT NULL,
    template_id integer,
    exercise_id integer,
    "position" integer NOT NULL,
    sets integer NOT NULL,
    reps character varying(50),
    rest_seconds integer,
    notes text
);


ALTER TABLE public.template_exercises OWNER TO doadmin;

--
-- TOC entry 241 (class 1259 OID 16675)
-- Name: template_exercises_template_exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.template_exercises_template_exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.template_exercises_template_exercise_id_seq OWNER TO doadmin;

--
-- TOC entry 4661 (class 0 OID 0)
-- Dependencies: 241
-- Name: template_exercises_template_exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.template_exercises_template_exercise_id_seq OWNED BY public.template_exercises.template_exercise_id;


--
-- TOC entry 230 (class 1259 OID 16557)
-- Name: training_sessions; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.training_sessions (
    session_id integer NOT NULL,
    user_id integer,
    workout_id integer,
    session_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    duration_minutes integer,
    calories_burned integer,
    mood_rating integer,
    effort_level integer,
    notes text,
    location character varying(100)
);


ALTER TABLE public.training_sessions OWNER TO doadmin;

--
-- TOC entry 229 (class 1259 OID 16556)
-- Name: training_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.training_sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_sessions_session_id_seq OWNER TO doadmin;

--
-- TOC entry 4663 (class 0 OID 0)
-- Dependencies: 229
-- Name: training_sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.training_sessions_session_id_seq OWNED BY public.training_sessions.session_id;


--
-- TOC entry 248 (class 1259 OID 16729)
-- Name: user_connections; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.user_connections (
    connection_id integer NOT NULL,
    user_id integer,
    connected_user_id integer,
    connection_type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_connections OWNER TO doadmin;

--
-- TOC entry 247 (class 1259 OID 16728)
-- Name: user_connections_connection_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.user_connections_connection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_connections_connection_id_seq OWNER TO doadmin;

--
-- TOC entry 4665 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_connections_connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.user_connections_connection_id_seq OWNED BY public.user_connections.connection_id;


--
-- TOC entry 220 (class 1259 OID 16475)
-- Name: user_weight_logs; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.user_weight_logs (
    weight_log_id integer NOT NULL,
    user_id integer,
    weight numeric(5,2) NOT NULL,
    logged_date date DEFAULT CURRENT_DATE NOT NULL,
    notes text
);


ALTER TABLE public.user_weight_logs OWNER TO doadmin;

--
-- TOC entry 219 (class 1259 OID 16474)
-- Name: user_weight_logs_weight_log_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.user_weight_logs_weight_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_weight_logs_weight_log_id_seq OWNER TO doadmin;

--
-- TOC entry 4667 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_weight_logs_weight_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.user_weight_logs_weight_log_id_seq OWNED BY public.user_weight_logs.weight_log_id;


--
-- TOC entry 218 (class 1259 OID 16459)
-- Name: users; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    date_of_birth date,
    gender character varying(20),
    height numeric(5,2),
    profile_picture character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone,
    is_active boolean DEFAULT true,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO doadmin;

--
-- TOC entry 217 (class 1259 OID 16458)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO doadmin;

--
-- TOC entry 4669 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 228 (class 1259 OID 16538)
-- Name: workout_exercises; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.workout_exercises (
    workout_exercise_id integer NOT NULL,
    workout_id integer,
    exercise_id integer,
    "position" integer NOT NULL,
    sets integer NOT NULL,
    reps character varying(50),
    rest_seconds integer,
    notes text
);


ALTER TABLE public.workout_exercises OWNER TO doadmin;

--
-- TOC entry 227 (class 1259 OID 16537)
-- Name: workout_exercises_workout_exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.workout_exercises_workout_exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workout_exercises_workout_exercise_id_seq OWNER TO doadmin;

--
-- TOC entry 4671 (class 0 OID 0)
-- Dependencies: 227
-- Name: workout_exercises_workout_exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.workout_exercises_workout_exercise_id_seq OWNED BY public.workout_exercises.workout_exercise_id;


--
-- TOC entry 240 (class 1259 OID 16661)
-- Name: workout_templates; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.workout_templates (
    template_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    difficulty_level character varying(20),
    target_audience character varying(50),
    goal character varying(50),
    estimated_duration_minutes integer,
    created_by integer,
    is_featured boolean DEFAULT false
);


ALTER TABLE public.workout_templates OWNER TO doadmin;

--
-- TOC entry 239 (class 1259 OID 16660)
-- Name: workout_templates_template_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.workout_templates_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workout_templates_template_id_seq OWNER TO doadmin;

--
-- TOC entry 4673 (class 0 OID 0)
-- Dependencies: 239
-- Name: workout_templates_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.workout_templates_template_id_seq OWNED BY public.workout_templates.template_id;


--
-- TOC entry 226 (class 1259 OID 16521)
-- Name: workouts; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.workouts (
    workout_id integer NOT NULL,
    user_id integer,
    name character varying(100) NOT NULL,
    description text,
    duration_minutes integer,
    difficulty_level character varying(20),
    is_public boolean DEFAULT false,
    times_performed integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_performed timestamp with time zone
);


ALTER TABLE public.workouts OWNER TO doadmin;

--
-- TOC entry 225 (class 1259 OID 16520)
-- Name: workouts_workout_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.workouts_workout_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workouts_workout_id_seq OWNER TO doadmin;

--
-- TOC entry 4675 (class 0 OID 0)
-- Dependencies: 225
-- Name: workouts_workout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.workouts_workout_id_seq OWNED BY public.workouts.workout_id;


--
-- TOC entry 4394 (class 2604 OID 16713)
-- Name: activity_stats stat_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.activity_stats ALTER COLUMN stat_id SET DEFAULT nextval('public.activity_stats_stat_id_seq'::regclass);


--
-- TOC entry 4387 (class 2604 OID 16649)
-- Name: body_measurements measurement_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.body_measurements ALTER COLUMN measurement_id SET DEFAULT nextval('public.body_measurements_measurement_id_seq'::regclass);


--
-- TOC entry 4365 (class 2604 OID 16493)
-- Name: exercise_categories category_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_categories ALTER COLUMN category_id SET DEFAULT nextval('public.exercise_categories_category_id_seq'::regclass);


--
-- TOC entry 4377 (class 2604 OID 16580)
-- Name: exercise_performances performance_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_performances ALTER COLUMN performance_id SET DEFAULT nextval('public.exercise_performances_performance_id_seq'::regclass);


--
-- TOC entry 4366 (class 2604 OID 16502)
-- Name: exercises exercise_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercises ALTER COLUMN exercise_id SET DEFAULT nextval('public.exercises_exercise_id_seq'::regclass);


--
-- TOC entry 4384 (class 2604 OID 16630)
-- Name: goals goal_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.goals ALTER COLUMN goal_id SET DEFAULT nextval('public.goals_goal_id_seq'::regclass);


--
-- TOC entry 4392 (class 2604 OID 16698)
-- Name: nutrition_logs nutrition_log_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.nutrition_logs ALTER COLUMN nutrition_log_id SET DEFAULT nextval('public.nutrition_logs_nutrition_log_id_seq'::regclass);


--
-- TOC entry 4382 (class 2604 OID 16603)
-- Name: personal_records pr_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records ALTER COLUMN pr_id SET DEFAULT nextval('public.personal_records_pr_id_seq'::regclass);


--
-- TOC entry 4391 (class 2604 OID 16679)
-- Name: template_exercises template_exercise_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.template_exercises ALTER COLUMN template_exercise_id SET DEFAULT nextval('public.template_exercises_template_exercise_id_seq'::regclass);


--
-- TOC entry 4375 (class 2604 OID 16560)
-- Name: training_sessions session_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.training_sessions ALTER COLUMN session_id SET DEFAULT nextval('public.training_sessions_session_id_seq'::regclass);


--
-- TOC entry 4402 (class 2604 OID 16732)
-- Name: user_connections connection_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_connections ALTER COLUMN connection_id SET DEFAULT nextval('public.user_connections_connection_id_seq'::regclass);


--
-- TOC entry 4363 (class 2604 OID 16478)
-- Name: user_weight_logs weight_log_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_weight_logs ALTER COLUMN weight_log_id SET DEFAULT nextval('public.user_weight_logs_weight_log_id_seq'::regclass);


--
-- TOC entry 4359 (class 2604 OID 16462)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4374 (class 2604 OID 16541)
-- Name: workout_exercises workout_exercise_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_exercises ALTER COLUMN workout_exercise_id SET DEFAULT nextval('public.workout_exercises_workout_exercise_id_seq'::regclass);


--
-- TOC entry 4389 (class 2604 OID 16664)
-- Name: workout_templates template_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_templates ALTER COLUMN template_id SET DEFAULT nextval('public.workout_templates_template_id_seq'::regclass);


--
-- TOC entry 4370 (class 2604 OID 16524)
-- Name: workouts workout_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workouts ALTER COLUMN workout_id SET DEFAULT nextval('public.workouts_workout_id_seq'::regclass);


--
-- TOC entry 4459 (class 2606 OID 16722)
-- Name: activity_stats activity_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.activity_stats
    ADD CONSTRAINT activity_stats_pkey PRIMARY KEY (stat_id);


--
-- TOC entry 4467 (class 2606 OID 16778)
-- Name: avatar avatar_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT avatar_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4451 (class 2606 OID 16654)
-- Name: body_measurements body_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.body_measurements
    ADD CONSTRAINT body_measurements_pkey PRIMARY KEY (measurement_id);


--
-- TOC entry 4465 (class 2606 OID 16763)
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (email);


--
-- TOC entry 4425 (class 2606 OID 16497)
-- Name: exercise_categories exercise_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_categories
    ADD CONSTRAINT exercise_categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4439 (class 2606 OID 16588)
-- Name: exercise_performances exercise_performances_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_performances
    ADD CONSTRAINT exercise_performances_pkey PRIMARY KEY (performance_id);


--
-- TOC entry 4427 (class 2606 OID 16509)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (exercise_id);


--
-- TOC entry 4448 (class 2606 OID 16634)
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (goal_id);


--
-- TOC entry 4457 (class 2606 OID 16703)
-- Name: nutrition_logs nutrition_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.nutrition_logs
    ADD CONSTRAINT nutrition_logs_pkey PRIMARY KEY (nutrition_log_id);


--
-- TOC entry 4444 (class 2606 OID 16608)
-- Name: personal_records personal_records_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records
    ADD CONSTRAINT personal_records_pkey PRIMARY KEY (pr_id);


--
-- TOC entry 4446 (class 2606 OID 16610)
-- Name: personal_records personal_records_user_id_exercise_id_record_type_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records
    ADD CONSTRAINT personal_records_user_id_exercise_id_record_type_key UNIQUE (user_id, exercise_id, record_type);


--
-- TOC entry 4455 (class 2606 OID 16683)
-- Name: template_exercises template_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.template_exercises
    ADD CONSTRAINT template_exercises_pkey PRIMARY KEY (template_exercise_id);


--
-- TOC entry 4437 (class 2606 OID 16565)
-- Name: training_sessions training_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4461 (class 2606 OID 16736)
-- Name: user_connections user_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_connections
    ADD CONSTRAINT user_connections_pkey PRIMARY KEY (connection_id);


--
-- TOC entry 4463 (class 2606 OID 16738)
-- Name: user_connections user_connections_user_id_connected_user_id_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_connections
    ADD CONSTRAINT user_connections_user_id_connected_user_id_key UNIQUE (user_id, connected_user_id);


--
-- TOC entry 4423 (class 2606 OID 16483)
-- Name: user_weight_logs user_weight_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_weight_logs
    ADD CONSTRAINT user_weight_logs_pkey PRIMARY KEY (weight_log_id);


--
-- TOC entry 4416 (class 2606 OID 16473)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4418 (class 2606 OID 16469)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4420 (class 2606 OID 16471)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4433 (class 2606 OID 16545)
-- Name: workout_exercises workout_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_pkey PRIMARY KEY (workout_exercise_id);


--
-- TOC entry 4453 (class 2606 OID 16669)
-- Name: workout_templates workout_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_templates
    ADD CONSTRAINT workout_templates_pkey PRIMARY KEY (template_id);


--
-- TOC entry 4431 (class 2606 OID 16531)
-- Name: workouts workouts_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_pkey PRIMARY KEY (workout_id);


--
-- TOC entry 4428 (class 1259 OID 16749)
-- Name: idx_exercise_category; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_exercise_category ON public.exercises USING btree (category_id);


--
-- TOC entry 4449 (class 1259 OID 16756)
-- Name: idx_goals_user; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_goals_user ON public.goals USING btree (user_id);


--
-- TOC entry 4440 (class 1259 OID 16754)
-- Name: idx_performance_exercise; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_performance_exercise ON public.exercise_performances USING btree (exercise_id);


--
-- TOC entry 4441 (class 1259 OID 16753)
-- Name: idx_performance_session; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_performance_session ON public.exercise_performances USING btree (session_id);


--
-- TOC entry 4442 (class 1259 OID 16755)
-- Name: idx_personal_records_user; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_personal_records_user ON public.personal_records USING btree (user_id, exercise_id);


--
-- TOC entry 4434 (class 1259 OID 16752)
-- Name: idx_session_date; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_session_date ON public.training_sessions USING btree (session_date);


--
-- TOC entry 4435 (class 1259 OID 16751)
-- Name: idx_session_user; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_session_user ON public.training_sessions USING btree (user_id);


--
-- TOC entry 4421 (class 1259 OID 16757)
-- Name: idx_user_weight_logs; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_user_weight_logs ON public.user_weight_logs USING btree (user_id, logged_date);


--
-- TOC entry 4429 (class 1259 OID 16750)
-- Name: idx_workout_user; Type: INDEX; Schema: public; Owner: doadmin
--

CREATE INDEX idx_workout_user ON public.workouts USING btree (user_id);


--
-- TOC entry 4488 (class 2606 OID 16723)
-- Name: activity_stats activity_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.activity_stats
    ADD CONSTRAINT activity_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4491 (class 2606 OID 16779)
-- Name: avatar avatar_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT avatar_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4483 (class 2606 OID 16655)
-- Name: body_measurements body_measurements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.body_measurements
    ADD CONSTRAINT body_measurements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4476 (class 2606 OID 16594)
-- Name: exercise_performances exercise_performances_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_performances
    ADD CONSTRAINT exercise_performances_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id) ON DELETE CASCADE;


--
-- TOC entry 4477 (class 2606 OID 16589)
-- Name: exercise_performances exercise_performances_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercise_performances
    ADD CONSTRAINT exercise_performances_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.training_sessions(session_id) ON DELETE CASCADE;


--
-- TOC entry 4469 (class 2606 OID 16510)
-- Name: exercises exercises_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.exercise_categories(category_id) ON DELETE SET NULL;


--
-- TOC entry 4470 (class 2606 OID 16515)
-- Name: exercises exercises_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4481 (class 2606 OID 16640)
-- Name: goals goals_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id) ON DELETE CASCADE;


--
-- TOC entry 4482 (class 2606 OID 16635)
-- Name: goals goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4487 (class 2606 OID 16704)
-- Name: nutrition_logs nutrition_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.nutrition_logs
    ADD CONSTRAINT nutrition_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4478 (class 2606 OID 16616)
-- Name: personal_records personal_records_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records
    ADD CONSTRAINT personal_records_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id) ON DELETE CASCADE;


--
-- TOC entry 4479 (class 2606 OID 16621)
-- Name: personal_records personal_records_performance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records
    ADD CONSTRAINT personal_records_performance_id_fkey FOREIGN KEY (performance_id) REFERENCES public.exercise_performances(performance_id) ON DELETE SET NULL;


--
-- TOC entry 4480 (class 2606 OID 16611)
-- Name: personal_records personal_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.personal_records
    ADD CONSTRAINT personal_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4485 (class 2606 OID 16689)
-- Name: template_exercises template_exercises_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.template_exercises
    ADD CONSTRAINT template_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id) ON DELETE CASCADE;


--
-- TOC entry 4486 (class 2606 OID 16684)
-- Name: template_exercises template_exercises_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.template_exercises
    ADD CONSTRAINT template_exercises_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.workout_templates(template_id) ON DELETE CASCADE;


--
-- TOC entry 4474 (class 2606 OID 16566)
-- Name: training_sessions training_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4475 (class 2606 OID 16571)
-- Name: training_sessions training_sessions_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(workout_id) ON DELETE SET NULL;


--
-- TOC entry 4489 (class 2606 OID 16744)
-- Name: user_connections user_connections_connected_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_connections
    ADD CONSTRAINT user_connections_connected_user_id_fkey FOREIGN KEY (connected_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4490 (class 2606 OID 16739)
-- Name: user_connections user_connections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_connections
    ADD CONSTRAINT user_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4468 (class 2606 OID 16484)
-- Name: user_weight_logs user_weight_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_weight_logs
    ADD CONSTRAINT user_weight_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4472 (class 2606 OID 16551)
-- Name: workout_exercises workout_exercises_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id) ON DELETE CASCADE;


--
-- TOC entry 4473 (class 2606 OID 16546)
-- Name: workout_exercises workout_exercises_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(workout_id) ON DELETE CASCADE;


--
-- TOC entry 4484 (class 2606 OID 16670)
-- Name: workout_templates workout_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workout_templates
    ADD CONSTRAINT workout_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4471 (class 2606 OID 16532)
-- Name: workouts workouts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE activity_stats; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.activity_stats TO luis_g;


--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE avatar; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.avatar TO luis_g;


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE body_measurements; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.body_measurements TO luis_g;


--
-- TOC entry 4647 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE emails; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emails TO luis_g;


--
-- TOC entry 4648 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE exercise_categories; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.exercise_categories TO luis_g;


--
-- TOC entry 4650 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE exercise_performances; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.exercise_performances TO luis_g;


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE exercises; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.exercises TO luis_g;


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE goals; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.goals TO luis_g;


--
-- TOC entry 4656 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE nutrition_logs; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nutrition_logs TO luis_g;


--
-- TOC entry 4658 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE personal_records; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.personal_records TO luis_g;


--
-- TOC entry 4660 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE template_exercises; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.template_exercises TO luis_g;


--
-- TOC entry 4662 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE training_sessions; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.training_sessions TO luis_g;


--
-- TOC entry 4664 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE user_connections; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_connections TO luis_g;


--
-- TOC entry 4666 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE user_weight_logs; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_weight_logs TO luis_g;


--
-- TOC entry 4668 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE users; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO luis_g;


--
-- TOC entry 4670 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE workout_exercises; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.workout_exercises TO luis_g;


--
-- TOC entry 4672 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE workout_templates; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.workout_templates TO luis_g;


--
-- TOC entry 4674 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE workouts; Type: ACL; Schema: public; Owner: doadmin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.workouts TO luis_g;


--
-- TOC entry 2127 (class 826 OID 16454)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: doadmin
--

ALTER DEFAULT PRIVILEGES FOR ROLE doadmin IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO luis_g;


-- Completed on 2025-06-01 22:21:12

--
-- PostgreSQL database dump complete
--

