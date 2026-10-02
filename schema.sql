-- PostgreSQL Database Schema Setup for SAGZFX ACADEMY

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_role AS ENUM ('student', 'alumni', 'moderator', 'admin');

-- 2. USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    
    -- Abuja Campus & Financial Flags
    has_paid_tuition BOOLEAN DEFAULT FALSE,
    tuition_activated_at TIMESTAMP WITH TIME ZONE,
    
    -- Exness Integration Anchors
    exness_affiliate_id VARCHAR(50),
    exness_demo_account_number VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PREMIUM SUBSCRIPTIONS & BUNDLES TABLE
CREATE TABLE premium_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    product_slug VARCHAR(100) NOT NULL, -- e.g., 'vip-smc-indicators', 'masterclass-pass'
    is_recurring_subscription BOOLEAN DEFAULT FALSE,
    subscription_status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CURRICULUM MODULES TABLE
CREATE TABLE course_modules (
    module_id VARCHAR(20) PRIMARY KEY, -- e.g., 'L1-MOD1'
    tier_level VARCHAR(30) NOT NULL,    -- 'Beginner', 'Market Structure', 'Advanced', 'Masterclass'
    title VARCHAR(150) NOT NULL,
    video_url_slug VARCHAR(255),        -- Embedded Unlisted Video Pointer
    is_premium_locked BOOLEAN DEFAULT FALSE, -- Requires add-on purchase even if tuition is paid
    sort_order INT NOT NULL
);

-- 5. STUDENT PROGRESS LOGS
CREATE TABLE student_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    module_id VARCHAR(20) REFERENCES course_modules(module_id),
    is_completed BOOLEAN DEFAULT FALSE,
    watched_percentage INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- 6. COMMUNITY FORUM CHANNELS
CREATE TABLE forum_channels (
    channel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    required_role_level VARCHAR(20) DEFAULT 'student' -- 'student', 'alumni', 'premium'
);

-- 7. SEED DATA FOR COURSE PATHWAYS
INSERT INTO course_modules (module_id, tier_level, title, is_premium_locked, sort_order) VALUES
('L1-MOD1', 'Beginner', 'Introduction to Forex', FALSE, 1),
('L1-MOD2', 'Beginner', 'Currency pairs & market sessions', FALSE, 2),
('L1-MOD3', 'Beginner', 'Pips, lots, spreads & leverage', FALSE, 3),
('L1-MOD4', 'Beginner', 'Buy/Sell & order types', FALSE, 4),
('L1-MOD5', 'Beginner', 'Trading platforms (MT4/MT5)', FALSE, 5),
('L1-MOD6', 'Beginner', 'Candlestick basics', FALSE, 6),
('L1-MOD7', 'Beginner', 'Support & Resistance', FALSE, 7),
('L1-MOD8', 'Beginner', 'Trendlines & market direction', FALSE, 8),
('L1-MOD9', 'Beginner', 'Stop Loss & Take Profit', FALSE, 9),
('L1-MOD10', 'Beginner', 'Basic Risk Management', FALSE, 10),
('L1-MOD11', 'Beginner', 'Trading Psychology', FALSE, 11),
('L1-MOD12', 'Beginner', 'How to read a simple chart', FALSE, 12),

('L2-MOD1', 'Market Structure', 'Higher Highs, Higher Lows, LH & LL', FALSE, 13),
('L2-MOD2', 'Market Structure', 'Break of Structure (BOS)', FALSE, 14),
('L2-MOD3', 'Market Structure', 'Change of Character (CHOCH)', FALSE, 15),
('L2-MOD4', 'Market Structure', 'Supply & Demand', FALSE, 16),
('L2-MOD5', 'Market Structure', 'Liquidity & liquidity sweeps', FALSE, 17),
('L2-MOD6', 'Market Structure', 'Fair Value Gaps (FVG)', FALSE, 18),
('L2-MOD7', 'Market Structure', 'Order Blocks', FALSE, 19),
('L2-MOD8', 'Market Structure', 'Premium & Discount', FALSE, 20),
('L2-MOD9', 'Market Structure', 'Multi-Timeframe Analysis', FALSE, 21),
('L2-MOD10', 'Market Structure', 'Entry Models', FALSE, 22),
('L2-MOD11', 'Market Structure', 'Risk-to-Reward', FALSE, 23),
('L2-MOD12', 'Market Structure', 'Trade Management', FALSE, 24),
('L2-MOD13', 'Market Structure', 'Trading Journal & Backtesting', FALSE, 25),
('L2-MOD14', 'Market Structure', 'Fundamental Analysis', FALSE, 26),

('L3-MOD1', 'Advanced', 'Advanced Market Structure', TRUE, 27),
('L3-MOD2', 'Advanced', 'Institutional Order Flow', TRUE, 28),
('L3-MOD3', 'Advanced', 'Smart Money Concepts (SMC)', TRUE, 29),
('L3-MOD4', 'Advanced', 'Liquidity Engineering', TRUE, 30),
('L3-MOD5', 'Advanced', 'Inducement', TRUE, 31),
('L3-MOD6', 'Advanced', 'Displacement', TRUE, 32),
('L3-MOD7', 'Advanced', 'Mitigation & Re-entries', TRUE, 33),
('L3-MOD8', 'Advanced', 'Advanced Order Blocks', TRUE, 34),
('L3-MOD9', 'Advanced', 'FVG + Liquidity Confluence', TRUE, 35),
('L3-MOD10', 'Advanced', 'Session & Kill-Zone Analysis', TRUE, 36),
('L3-MOD11', 'Advanced', 'Advanced Multi-Timeframe Setups', TRUE, 37),
('L3-MOD12', 'Advanced', 'Correlation Analysis', TRUE, 38),
('L3-MOD13', 'Advanced', 'Advanced Risk Management', TRUE, 39),
('L3-MOD14', 'Advanced', 'Building a Profitable Trading System', TRUE, 40),
('L3-MOD15', 'Advanced', 'Strategy Backtesting & Optimization', TRUE, 41),
('L3-MOD16', 'Advanced', 'Trading Psychology at Professional Level', TRUE, 42),
('L3-MOD17', 'Advanced', 'Prop-Firm Risk Management', TRUE, 43),
('L3-MOD18', 'Advanced', 'Advanced Trade Execution', TRUE, 44),
('L3-MOD19', 'Advanced', 'Creating a Personal Trading Plan', TRUE, 45),
('L3-MOD20', 'Advanced', 'Becoming a Consistent/Professional Trader', TRUE, 46),

('L4-MOD1', 'Masterclass', 'Putting Everything Together (Capstone)', TRUE, 47);
