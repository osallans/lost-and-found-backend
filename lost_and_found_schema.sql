-- ENUM types for PostgreSQL
CREATE TYPE user_role AS ENUM ('user', 'admin', 'manager');
CREATE TYPE idp_provider AS ENUM ('local', 'google', 'facebook', 'cognito');
CREATE TYPE item_status AS ENUM ('lost', 'found', 'matched', 'claimed', 'returned');
CREATE TYPE actor_role_type AS ENUM ('admin', 'user');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    role user_role,
    idp_type idp_provider DEFAULT 'local',
    idp_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT chk_user_auth CHECK (
        (password IS NOT NULL AND (idp_type IS NULL OR idp_type = 'local') AND idp_id IS NULL)
        OR
        (password IS NULL AND idp_type IS NOT NULL AND idp_id IS NOT NULL)
    )
);

-- ADMINS
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    role user_role,
    idp_type idp_provider DEFAULT 'local',
    idp_id VARCHAR(255),
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT chk_admin_auth CHECK (
        (password IS NOT NULL AND (idp_type IS NULL OR idp_type = 'local') AND idp_id IS NULL)
        OR
        (password IS NULL AND idp_type IS NOT NULL AND idp_id IS NOT NULL)
    )
);

-- COUNTRIES
CREATE TABLE countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100)
);

-- CITIES
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    country_code CHAR(2) NOT NULL,
    CONSTRAINT fk_city_country FOREIGN KEY (country_code) REFERENCES countries(code)
);

-- FACILITIES
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_facility_id UUID,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    description TEXT,
    city_id UUID,
    country_code CHAR(2),
    is_public BOOLEAN DEFAULT TRUE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    timezone VARCHAR(50),
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_facility_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT fk_facility_country FOREIGN KEY (country_code) REFERENCES countries(code),
    CONSTRAINT fk_parent_facility FOREIGN KEY (parent_facility_id) REFERENCES facilities(id),
    UNIQUE (name, city_id)
);

-- FACILITY_USER
CREATE TABLE facility_user (
    facility_id UUID NOT NULL,
    user_id UUID NOT NULL,
    approved_by_admin_id UUID,
    approved_at TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (facility_id, user_id),
    CONSTRAINT fk_facility_user_facility FOREIGN KEY (facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_facility_user_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_facility_user_admin FOREIGN KEY (approved_by_admin_id) REFERENCES admins(id)
);

-- FACILITY_ADMIN
CREATE TABLE facility_admin (
    facility_id UUID NOT NULL,
    admin_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'manager',
    PRIMARY KEY (facility_id, admin_id),
    CONSTRAINT fk_facility_admin_facility FOREIGN KEY (facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_facility_admin_admin FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- ITEMS
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL,
    reported_by UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status item_status NOT NULL,
    category VARCHAR(100),
    reported_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    matched_item_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_item_facility FOREIGN KEY (facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_item_user FOREIGN KEY (reported_by) REFERENCES users(id),
    CONSTRAINT fk_matched_item FOREIGN KEY (matched_item_id) REFERENCES items(id)
);

-- ITEM IMAGES
CREATE TABLE item_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_image_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- ITEM LOGS
CREATE TABLE item_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL,
    actor_role actor_role_type,
    log_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_item FOREIGN KEY (item_id) REFERENCES items(id)
);

-- CLAIMS
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    claimant_id UUID NOT NULL,
    status claim_status NOT NULL,
    reviewed_by_admin_id UUID,
    claim_token UUID,
    attachment_url TEXT,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_claim_item FOREIGN KEY (item_id) REFERENCES items(id),
    CONSTRAINT fk_claim_user FOREIGN KEY (claimant_id) REFERENCES users(id),
    CONSTRAINT fk_claim_admin FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(id),
    UNIQUE (item_id, claimant_id)
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_facilities_city_id ON facilities(city_id);
CREATE INDEX idx_facilities_country_code ON facilities(country_code);
CREATE INDEX idx_items_facility_id ON items(facility_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_items_reported_by ON items(reported_by);
CREATE INDEX idx_item_logs_actor ON item_logs(actor_id);
CREATE INDEX idx_facilities_location ON facilities USING GIST (point(latitude, longitude));
