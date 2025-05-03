-- ENUM types for PostgreSQL
CREATE TYPE user_role AS ENUM ('user', 'admin', 'manager');
CREATE TYPE idp_provider AS ENUM ('local', 'google', 'facebook', 'cognito');
CREATE TYPE item_status AS ENUM ('lost', 'found', 'matched', 'claimed', 'returned');
CREATE TYPE actor_role_type AS ENUM ('admin', 'user');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- User Table
CREATE TABLE user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),  -- Arabic name for user
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

-- Category Table
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,   -- English name (e.g., 'Electronics', 'Clothing')
    name_ar VARCHAR(255),                -- Arabic name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subcategory Table
CREATE TABLE subcategory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,           -- Foreign key to category table
    name VARCHAR(255) NOT NULL,          -- English subcategory name (e.g., 'Smartphones')
    name_ar VARCHAR(255),                -- Arabic subcategory name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Brand Table with Reference to Subcategory
CREATE TABLE brand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,  -- Brand name (e.g., 'Apple', 'Nike')
    name_ar VARCHAR(255),               -- Arabic name for the brand
    subcategory_id UUID,                -- Foreign key to subcategory
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_brand_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);

-- Model Table (linked to Brand)
CREATE TABLE model (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL,             -- Foreign key to brand table
    name VARCHAR(255) UNIQUE NOT NULL,  -- Model name (e.g., 'iPhone 12', 'Galaxy S21')
    name_ar VARCHAR(255),               -- Arabic name for the model
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_model_brand FOREIGN KEY (brand_id) REFERENCES brand(id)
);

-- Color Table
CREATE TABLE color (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,   -- Color name (e.g., 'Black', 'Red')
    name_ar VARCHAR(50),                -- Arabic name for the color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Country Table
CREATE TABLE country (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100)  -- Arabic name for the country
);

-- City Table
CREATE TABLE city (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),  -- Arabic name for the city
    country_code CHAR(2) NOT NULL,
    CONSTRAINT fk_city_country FOREIGN KEY (country_code) REFERENCES country(code)
);

-- Facility Table
CREATE TABLE facility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_facility_id UUID,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),  -- Arabic name for facility
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
    CONSTRAINT fk_facility_city FOREIGN KEY (city_id) REFERENCES city(id),
    CONSTRAINT fk_facility_country FOREIGN KEY (country_code) REFERENCES country(code),
    CONSTRAINT fk_parent_facility FOREIGN KEY (parent_facility_id) REFERENCES facility(id),
    UNIQUE (name, city_id)
);

-- Facility User Table
CREATE TABLE facility_user (
    facility_id UUID NOT NULL,
    user_id UUID NOT NULL,
    approved_by_admin_id UUID,
    approved_at TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (facility_id, user_id),
    CONSTRAINT fk_facility_user_facility FOREIGN KEY (facility_id) REFERENCES facility(id),
    CONSTRAINT fk_facility_user_user FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_facility_user_admin FOREIGN KEY (approved_by_admin_id) REFERENCES admin(id)
);

-- Facility Admin Table
CREATE TABLE facility_admin (
    facility_id UUID NOT NULL,
    admin_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'manager',
    PRIMARY KEY (facility_id, admin_id),
    CONSTRAINT fk_facility_admin_facility FOREIGN KEY (facility_id) REFERENCES facility(id),
    CONSTRAINT fk_facility_admin_admin FOREIGN KEY (admin_id) REFERENCES admin(id)
);

-- Admin Table
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),  -- Arabic name for admin
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

-- Item Table with Lookup References for Brand, Model, and Color
CREATE TABLE item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL,
    reported_by UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status item_status NOT NULL,
    subcategory_id UUID,  -- Foreign key referencing subcategory
    brand_id UUID,        -- Foreign key referencing brand
    model_id UUID,        -- Foreign key referencing model
    color_id UUID,        -- Foreign key referencing color
    size VARCHAR(50),     -- Size (e.g., Small, Medium, Large, for clothing)
    condition VARCHAR(50),-- Condition of the item (e.g., New, Used, Damaged)
    location_found VARCHAR(255),  -- Location where the item was found
    tags TEXT[],          -- Tags for searching or identification
    item_condition VARCHAR(50),   -- General condition of the item
    reported_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    matched_item_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_item_facility FOREIGN KEY (facility_id) REFERENCES facility(id),
    CONSTRAINT fk_item_user FOREIGN KEY (reported_by) REFERENCES user(id),
    CONSTRAINT fk_matched_item FOREIGN KEY (matched_item_id) REFERENCES item(id),
    CONSTRAINT fk_item_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    CONSTRAINT fk_item_brand FOREIGN KEY (brand_id) REFERENCES brand(id),  -- Link to brand
    CONSTRAINT fk_item_model FOREIGN KEY (model_id) REFERENCES model(id),
    CONSTRAINT fk_item_color FOREIGN KEY (color_id) REFERENCES color(id)
);

-- Item Image Table
CREATE TABLE item_image (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_image_item FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
);

-- Item Log Table
CREATE TABLE item_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL,
    actor_role actor_role_type,
    log_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_item FOREIGN KEY (item_id) REFERENCES item(id)
);

-- Claim Table
CREATE TABLE claim (
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
    CONSTRAINT fk_claim_item FOREIGN KEY (item_id) REFERENCES item(id),
    CONSTRAINT fk_claim_user FOREIGN KEY (claimant_id) REFERENCES user(id),
    CONSTRAINT fk_claim_admin FOREIGN KEY (reviewed_by_admin_id) REFERENCES admin(id),
    UNIQUE (item_id, claimant_id)
);

-- Indexes
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_facility_city_id ON facility(city_id);
CREATE INDEX idx_facility_country_code ON facility(country_code);
CREATE INDEX idx_item_facility_id ON item(facility_id);
CREATE INDEX idx_item_status ON item(status);
CREATE INDEX idx_claim_status ON claim(status);
CREATE INDEX idx_item_reported_by ON item(reported_by);
CREATE INDEX idx_item_log_actor ON item_log(actor_id);
CREATE INDEX idx_facility_location ON facility USING GIST (point(latitude, longitude));
