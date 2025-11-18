-- 数据库建表脚本
-- 纯市场数据存储，不包含计算字段

-- 1. 市场组合基础表
CREATE TABLE IF NOT EXISTS market_combinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_code VARCHAR(50) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    platform_code VARCHAR(50) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_code, country_code, platform_code)
);

CREATE INDEX idx_mc_category ON market_combinations(category_code);
CREATE INDEX idx_mc_country ON market_combinations(country_code);
CREATE INDEX idx_mc_platform ON market_combinations(platform_code);
CREATE INDEX idx_mc_available ON market_combinations(is_available);

-- 2. 市场规模与增长数据
CREATE TABLE IF NOT EXISTS market_size_growth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    total_gmv_usd DECIMAL(15,2) NOT NULL,
    gmv_growth_yoy DECIMAL(8,2) NOT NULL,
    total_orders INTEGER NOT NULL,
    orders_growth_yoy DECIMAL(8,2) NOT NULL,
    avg_order_value_usd DECIMAL(10,2) NOT NULL,
    gmv_history_12m TEXT,  -- JSON: [month1_gmv, month2_gmv, ...]
    search_volume_monthly INTEGER,
    search_volume_growth_yoy DECIMAL(8,2),
    data_source VARCHAR(100),
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_msg_combination ON market_size_growth(combination_id);

-- 3. 需求趋势数据
CREATE TABLE IF NOT EXISTS demand_trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    trend_keywords TEXT NOT NULL,  -- JSON: ["keyword1", "keyword2", ...]
    keyword_search_volumes TEXT NOT NULL,  -- JSON: {"keyword1": 50000, "keyword2": 30000}
    seasonal_pattern VARCHAR(50),  -- 'high_season' | 'low_season' | 'stable'
    peak_months TEXT,  -- JSON: [1, 11, 12] (月份)
    consumer_demographics TEXT,  -- JSON: {"age_18_24": 25, "age_25_34": 35, ...}
    buying_motivation_tags TEXT,  -- JSON: ["gift", "daily_use", "upgrade"]
    repurchase_cycle_days INTEGER,
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_dt_combination ON demand_trends(combination_id);

-- 4. 竞争格局数据
CREATE TABLE IF NOT EXISTS competition_landscape (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    total_sellers INTEGER NOT NULL,
    new_sellers_last_6m INTEGER NOT NULL,
    new_sellers_cohort_6m_ago INTEGER NOT NULL,
    new_sellers_survived_6m INTEGER NOT NULL,
    top5_sellers_gmv_share DECIMAL(5,2) NOT NULL,
    top10_sellers_gmv_share DECIMAL(5,2) NOT NULL,
    avg_seller_gmv_usd DECIMAL(12,2) NOT NULL,
    median_seller_gmv_usd DECIMAL(12,2) NOT NULL,
    avg_discount_depth DECIMAL(5,2) NOT NULL,
    promotion_frequency_pct DECIMAL(5,2) NOT NULL,
    avg_review_count INTEGER NOT NULL,
    avg_rating DECIMAL(3,2) NOT NULL,
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_cl_combination ON competition_landscape(combination_id);

-- 5. 定价与成本数据
CREATE TABLE IF NOT EXISTS pricing_cost (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    price_p10_usd DECIMAL(10,2) NOT NULL,
    price_p25_usd DECIMAL(10,2) NOT NULL,
    price_median_usd DECIMAL(10,2) NOT NULL,
    price_p75_usd DECIMAL(10,2) NOT NULL,
    price_p90_usd DECIMAL(10,2) NOT NULL,
    estimated_cogs_median_usd DECIMAL(10,2) NOT NULL,
    typical_shipping_cost_usd DECIMAL(8,2) NOT NULL,
    avg_return_rate DECIMAL(5,2) NOT NULL,
    return_shipping_cost_usd DECIMAL(8,2) NOT NULL,
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_pc_combination ON pricing_cost(combination_id);

-- 6. 运营指标数据
CREATE TABLE IF NOT EXISTS operational_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    avg_listing_conversion_rate DECIMAL(5,2) NOT NULL,
    avg_click_through_rate DECIMAL(5,2) NOT NULL,
    avg_ad_cpc_usd DECIMAL(6,2) NOT NULL,
    avg_ad_acos DECIMAL(5,2) NOT NULL,
    typical_fba_fee_usd DECIMAL(8,2),
    typical_fbm_shipping_days INTEGER,
    avg_customer_service_contacts_per_100_orders INTEGER,
    avg_refund_rate DECIMAL(5,2) NOT NULL,
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_om_combination ON operational_metrics(combination_id);

-- 7. 合规要求数据
CREATE TABLE IF NOT EXISTS compliance_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    required_certifications TEXT NOT NULL,  -- JSON: ["FCC", "CE", "RoHS"]
    certification_costs_usd TEXT NOT NULL,  -- JSON: {"FCC": 5000, "CE": 3000}
    certification_timeline_days TEXT NOT NULL,  -- JSON: {"FCC": 45, "CE": 30}
    import_tariff_rate DECIMAL(5,2) NOT NULL,
    vat_rate DECIMAL(5,2) NOT NULL,
    product_restrictions TEXT,  -- JSON: ["battery_capacity_limit", "chemical_content"]
    labeling_requirements TEXT,  -- JSON: ["ingredient_list", "warning_labels"]
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_cr_combination ON compliance_requirements(combination_id);

-- 8. 供应链信息数据
CREATE TABLE IF NOT EXISTS supply_chain_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    china_supplier_count INTEGER NOT NULL,
    avg_moq INTEGER NOT NULL,
    typical_production_days INTEGER NOT NULL,
    typical_shipping_days_sea INTEGER NOT NULL,
    typical_shipping_days_air INTEGER NOT NULL,
    sea_freight_cost_per_cbm_usd DECIMAL(10,2) NOT NULL,
    air_freight_cost_per_kg_usd DECIMAL(8,2) NOT NULL,
    supplier_concentration_top3_pct DECIMAL(5,2) NOT NULL,
    data_collection_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_sci_combination ON supply_chain_info(combination_id);

-- 9. 平台政策数据
CREATE TABLE IF NOT EXISTS platform_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination_id INTEGER NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    category_restrictions TEXT,  -- JSON: ["require_brand_authorization", "gated_category"]
    min_review_count_for_ads INTEGER,
    min_rating_for_ads DECIMAL(3,2),
    return_window_days INTEGER NOT NULL,
    platform_return_policy TEXT,
    prohibited_claims TEXT,  -- JSON: ["medical_claims", "weight_loss_guarantee"]
    policy_update_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES market_combinations(id)
);

CREATE INDEX idx_pp_combination ON platform_policies(combination_id);
