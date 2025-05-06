--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4 (Homebrew)

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

--
-- Name: actor_role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.actor_role_type AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.actor_role_type OWNER TO postgres;

--
-- Name: admin_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.admin_role AS ENUM (
    'admin',
    'manager'
);


ALTER TYPE public.admin_role OWNER TO postgres;

--
-- Name: claim_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.claim_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.claim_status OWNER TO postgres;

--
-- Name: facility_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.facility_type_enum AS ENUM (
    'airport',
    'station',
    'mall',
    'other'
);


ALTER TYPE public.facility_type_enum OWNER TO postgres;

--
-- Name: idp_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.idp_provider AS ENUM (
    'local',
    'google',
    'facebook',
    'cognito'
);


ALTER TYPE public.idp_provider OWNER TO postgres;

--
-- Name: item_condition_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.item_condition_enum AS ENUM (
    'New',
    'Used',
    'Damaged'
);


ALTER TYPE public.item_condition_enum OWNER TO postgres;

--
-- Name: item_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.item_status AS ENUM (
    'lost',
    'found',
    'matched',
    'claimed',
    'returned'
);


ALTER TYPE public.item_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin',
    'manager'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    email character varying(255) NOT NULL,
    password text,
    role public.admin_role,
    idp_type public.idp_provider DEFAULT 'local'::public.idp_provider,
    idp_id character varying(255),
    is_super_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_admin_auth CHECK ((((password IS NOT NULL) AND ((idp_type IS NULL) OR (idp_type = 'local'::public.idp_provider)) AND (idp_id IS NULL)) OR ((password IS NULL) AND (idp_type IS NOT NULL) AND (idp_id IS NOT NULL)))),
    CONSTRAINT chk_admin_password_argon2 CHECK (((password IS NULL) OR (password ~ '^\\$argon2id\\$v=19\\$m=\\d+,t=\\d+,p=\\d+\\$[A-Za-z0-9+/=]+\\$[A-Za-z0-9+/=]+$'::text)))
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: app_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    email character varying(255) NOT NULL,
    password text,
    role public.user_role,
    idp_type public.idp_provider DEFAULT 'local'::public.idp_provider,
    idp_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_user_auth CHECK ((((password IS NOT NULL) AND ((idp_type IS NULL) OR (idp_type = 'local'::public.idp_provider)) AND (idp_id IS NULL)) OR ((password IS NULL) AND (idp_type IS NOT NULL) AND (idp_id IS NOT NULL)))),
    CONSTRAINT chk_user_password_argon2 CHECK (((password IS NULL) OR (password ~ '^\\$argon2id\\$v=19\\$m=\\d+,t=\\d+,p=\\d+\\$[A-Za-z0-9+/=]+\\$[A-Za-z0-9+/=]+$'::text)))
);


ALTER TABLE public.app_user OWNER TO postgres;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    action text,
    actor_id uuid,
    actor_role public.actor_role_type,
    old_data jsonb,
    new_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    subcategory_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.city (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    name_ar character varying(100),
    country_code character(2) NOT NULL,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.city OWNER TO postgres;

--
-- Name: claim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claim (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    claimant_id uuid NOT NULL,
    status public.claim_status NOT NULL,
    reviewed_by_admin_id uuid,
    claim_token uuid,
    attachment_url text,
    claimed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone,
    expires_at timestamp without time zone,
    created_by uuid,
    updated_by uuid,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.claim OWNER TO postgres;

--
-- Name: color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    name_ar character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.color OWNER TO postgres;

--
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    code character(2) NOT NULL,
    name character varying(100) NOT NULL,
    name_ar character varying(100),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.country OWNER TO postgres;

--
-- Name: facility; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_facility_id uuid,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    description text,
    city_id uuid,
    country_code character(2),
    is_public boolean DEFAULT true,
    latitude double precision,
    longitude double precision,
    timezone character varying(50),
    type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.facility OWNER TO postgres;

--
-- Name: facility_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility_admin (
    facility_id uuid NOT NULL,
    admin_id uuid NOT NULL,
    role character varying(50) DEFAULT 'manager'::character varying,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.facility_admin OWNER TO postgres;

--
-- Name: facility_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility_user (
    facility_id uuid NOT NULL,
    user_id uuid NOT NULL,
    approved_by_admin_id uuid,
    approved_at timestamp without time zone,
    is_active boolean DEFAULT false,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.facility_user OWNER TO postgres;

--
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    facility_id uuid NOT NULL,
    reported_by uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status public.item_status NOT NULL,
    subcategory_id uuid,
    brand_id uuid,
    model_id uuid,
    color_id uuid,
    size character varying(50),
    condition public.item_condition_enum,
    location_found character varying(255),
    tags text[],
    reported_at timestamp without time zone NOT NULL,
    resolved_at timestamp without time zone,
    matched_item_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.item OWNER TO postgres;

--
-- Name: item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_image (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    image_url text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.item_image OWNER TO postgres;

--
-- Name: item_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    action character varying(50) NOT NULL,
    actor_id uuid NOT NULL,
    actor_role public.actor_role_type,
    log_type character varying(50),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.item_log OWNER TO postgres;

--
-- Name: model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.model (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.model OWNER TO postgres;

--
-- Name: subcategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.subcategory OWNER TO postgres;

--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: brand brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_name_key UNIQUE (name);


--
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (id);


--
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: city city_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (id);


--
-- Name: claim claim_item_id_claimant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claim
    ADD CONSTRAINT claim_item_id_claimant_id_key UNIQUE (item_id, claimant_id);


--
-- Name: claim claim_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claim
    ADD CONSTRAINT claim_pkey PRIMARY KEY (id);


--
-- Name: color color_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_name_key UNIQUE (name);


--
-- Name: color color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_pkey PRIMARY KEY (id);


--
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (code);


--
-- Name: facility_admin facility_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_admin
    ADD CONSTRAINT facility_admin_pkey PRIMARY KEY (facility_id, admin_id);


--
-- Name: facility facility_name_city_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility
    ADD CONSTRAINT facility_name_city_id_key UNIQUE (name, city_id);


--
-- Name: facility facility_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility
    ADD CONSTRAINT facility_pkey PRIMARY KEY (id);


--
-- Name: facility_user facility_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_user
    ADD CONSTRAINT facility_user_pkey PRIMARY KEY (facility_id, user_id);


--
-- Name: item_image item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_image
    ADD CONSTRAINT item_image_pkey PRIMARY KEY (id);


--
-- Name: item_log item_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_log
    ADD CONSTRAINT item_log_pkey PRIMARY KEY (id);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: model model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_name_key UNIQUE (name);


--
-- Name: model model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_pkey PRIMARY KEY (id);


--
-- Name: subcategory subcategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategory
    ADD CONSTRAINT subcategory_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_email ON public.admin USING btree (email);


--
-- Name: idx_claim_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_claim_status ON public.claim USING btree (status);


--
-- Name: idx_claim_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_claim_token ON public.claim USING btree (claim_token);


--
-- Name: idx_facility_city_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facility_city_id ON public.facility USING btree (city_id);


--
-- Name: idx_facility_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facility_country_code ON public.facility USING btree (country_code);


--
-- Name: idx_facility_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facility_location ON public.facility USING gist (point(latitude, longitude));


--
-- Name: idx_item_brand_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_brand_id ON public.item USING btree (brand_id);


--
-- Name: idx_item_color_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_color_id ON public.item USING btree (color_id);


--
-- Name: idx_item_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_condition ON public.item USING btree (condition);


--
-- Name: idx_item_facility_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_facility_id ON public.item USING btree (facility_id);


--
-- Name: idx_item_log_actor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_log_actor ON public.item_log USING btree (actor_id);


--
-- Name: idx_item_model_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_model_id ON public.item USING btree (model_id);


--
-- Name: idx_item_reported_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_reported_by ON public.item USING btree (reported_by);


--
-- Name: idx_item_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_status ON public.item USING btree (status);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.app_user USING btree (email);


--
-- Name: brand fk_brand_subcategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT fk_brand_subcategory FOREIGN KEY (subcategory_id) REFERENCES public.subcategory(id);


--
-- Name: city fk_city_country; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT fk_city_country FOREIGN KEY (country_code) REFERENCES public.country(code);


--
-- Name: claim fk_claim_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claim
    ADD CONSTRAINT fk_claim_admin FOREIGN KEY (reviewed_by_admin_id) REFERENCES public.admin(id);


--
-- Name: claim fk_claim_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claim
    ADD CONSTRAINT fk_claim_item FOREIGN KEY (item_id) REFERENCES public.item(id);


--
-- Name: claim fk_claim_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claim
    ADD CONSTRAINT fk_claim_user FOREIGN KEY (claimant_id) REFERENCES public.app_user(id);


--
-- Name: facility_admin fk_facility_admin_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_admin
    ADD CONSTRAINT fk_facility_admin_admin FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- Name: facility_admin fk_facility_admin_facility; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_admin
    ADD CONSTRAINT fk_facility_admin_facility FOREIGN KEY (facility_id) REFERENCES public.facility(id);


--
-- Name: facility fk_facility_city; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility
    ADD CONSTRAINT fk_facility_city FOREIGN KEY (city_id) REFERENCES public.city(id);


--
-- Name: facility fk_facility_country; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility
    ADD CONSTRAINT fk_facility_country FOREIGN KEY (country_code) REFERENCES public.country(code);


--
-- Name: facility_user fk_facility_user_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_user
    ADD CONSTRAINT fk_facility_user_admin FOREIGN KEY (approved_by_admin_id) REFERENCES public.admin(id);


--
-- Name: facility_user fk_facility_user_facility; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_user
    ADD CONSTRAINT fk_facility_user_facility FOREIGN KEY (facility_id) REFERENCES public.facility(id);


--
-- Name: facility_user fk_facility_user_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_user
    ADD CONSTRAINT fk_facility_user_user FOREIGN KEY (user_id) REFERENCES public.app_user(id);


--
-- Name: item fk_item_brand; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_brand FOREIGN KEY (brand_id) REFERENCES public.brand(id);


--
-- Name: item fk_item_color; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_color FOREIGN KEY (color_id) REFERENCES public.color(id);


--
-- Name: item fk_item_facility; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_facility FOREIGN KEY (facility_id) REFERENCES public.facility(id);


--
-- Name: item_image fk_item_image_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_image
    ADD CONSTRAINT fk_item_image_item FOREIGN KEY (item_id) REFERENCES public.item(id) ON DELETE CASCADE;


--
-- Name: item fk_item_model; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_model FOREIGN KEY (model_id) REFERENCES public.model(id);


--
-- Name: item fk_item_subcategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_subcategory FOREIGN KEY (subcategory_id) REFERENCES public.subcategory(id);


--
-- Name: item fk_item_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_user FOREIGN KEY (reported_by) REFERENCES public.app_user(id);


--
-- Name: item_log fk_log_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_log
    ADD CONSTRAINT fk_log_item FOREIGN KEY (item_id) REFERENCES public.item(id);


--
-- Name: item fk_matched_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_matched_item FOREIGN KEY (matched_item_id) REFERENCES public.item(id) ON DELETE SET NULL;


--
-- Name: model fk_model_brand; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT fk_model_brand FOREIGN KEY (brand_id) REFERENCES public.brand(id);


--
-- Name: facility fk_parent_facility; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility
    ADD CONSTRAINT fk_parent_facility FOREIGN KEY (parent_facility_id) REFERENCES public.facility(id);


--
-- Name: subcategory fk_subcategory_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategory
    ADD CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- PostgreSQL database dump complete
--

