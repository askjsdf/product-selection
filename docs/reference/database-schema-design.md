# 数据库表结构设计 - MCDA评分系统

## 一、核心设计原则

### 1. 数据分层
```
原始数据层 (Raw Data)
    ↓
指标计算层 (Metrics)
    ↓
维度评分层 (Dimension Scores)
    ↓
综合评分层 (Final Scores)
```

### 2. 表设计策略
- **事实表**：存储组合的原始数据（市场数据、竞争数据等）
- **计算表**：存储预计算的指标和评分（提高查询性能）
- **配置表**：存储权重配置、评分规则等
- **用户表**：存储用户画像和个性化配置

---

## 二、数据库表结构设计

### 表1：组合基础信息表 (combinations)

**作用**：存储所有【品类×国家×平台】组合的基础元数据

```sql
CREATE TABLE combinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- 组合维度
    category_code VARCHAR(50) NOT NULL,        -- 品类代码，如 'pet_supplies'
    country_code VARCHAR(10) NOT NULL,         -- 国家代码，如 'US'
    platform_code VARCHAR(50) NOT NULL,        -- 平台代码，如 'tiktok'

    -- 组合状态
    is_available BOOLEAN DEFAULT TRUE,         -- 该组合是否可用（平台是否覆盖该国家）
    is_restricted BOOLEAN DEFAULT FALSE,       -- 是否受限（如品类在该平台受限）
    restriction_reason TEXT,                   -- 受限原因

    -- 元数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 唯一约束
    UNIQUE KEY uk_combination (category_code, country_code, platform_code),

    -- 索引
    INDEX idx_category (category_code),
    INDEX idx_country (country_code),
    INDEX idx_platform (platform_code)
);
```

---

### 表2：市场数据表 (market_data)

**作用**：存储每个组合的原始市场数据（用于计算"市场吸引力"维度）

```sql
CREATE TABLE market_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,            -- 关联 combinations 表

    -- ===== 维度1：市场吸引力 (Market Attractiveness) 相关字段 =====

    -- 1.1 市场规模相关
    market_size_usd BIGINT,                    -- 市场规模（美元），如 120000000
    market_size_source VARCHAR(50),            -- 数据来源：'platform_api' / 'third_party' / 'estimated'

    -- 1.2 增长率相关
    growth_rate_yoy DECIMAL(10,2),             -- 同比增长率（%），如 180.5
    growth_rate_mom DECIMAL(10,2),             -- 环比增长率（%），如 15.3
    growth_rate_period VARCHAR(20),            -- 增长率统计周期，如 '2024-Q4'

    -- 1.3 需求趋势相关
    search_trend_index INT,                    -- 搜索热度指数（0-100）
    search_trend_slope DECIMAL(10,4),          -- 搜索趋势斜率（正=上升，负=下降）
    social_mention_count INT,                  -- 社交媒体提及量（近30天）
    social_trend_slope DECIMAL(10,4),          -- 社媒趋势斜率

    -- 1.4 市场成熟度
    market_maturity ENUM('emerging', 'growth', 'mature', 'decline'), -- 萌芽/成长/成熟/衰退
    market_maturity_score INT,                 -- 成熟度得分（0-100）

    -- 1.5 季节性
    seasonality_index DECIMAL(5,2),            -- 季节性指数（1.0=无季节性，>1.5=强季节性）
    peak_months VARCHAR(50),                   -- 旺季月份，如 '11,12,1'（JSON数组更佳）

    -- 数据质量
    data_completeness DECIMAL(5,2),            -- 数据完整度（0-100）
    data_age_days INT,                         -- 数据时效性（天数）
    last_updated TIMESTAMP,                    -- 最后更新时间

    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表3：竞争数据表 (competition_data)

**作用**：存储每个组合的竞争格局数据（用于计算"竞争可行性"维度）

```sql
CREATE TABLE competition_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 维度2：竞争可行性 (Competitive Feasibility) 相关字段 =====

    -- 2.1 竞争强度
    total_sellers INT,                         -- 该组合下的总卖家数量
    new_sellers_30d INT,                       -- 近30天新进入卖家数
    active_sellers INT,                        -- 活跃卖家数（近30天有销售）
    competition_intensity_score INT,           -- 竞争强度综合得分（0-100）

    -- 2.2 市场集中度
    top1_market_share DECIMAL(5,2),            -- 第1名市场份额（%）
    top5_market_share DECIMAL(5,2),            -- CR5 前5名市场份额（%）
    top10_market_share DECIMAL(5,2),           -- CR10 前10名市场份额（%）
    hhi_index DECIMAL(10,4),                   -- HHI 赫芬达尔指数（市场集中度）

    -- 2.3 新卖家生存率
    new_seller_survival_3m DECIMAL(5,2),       -- 3个月存活率（%）
    new_seller_survival_6m DECIMAL(5,2),       -- 6个月存活率（%）
    new_seller_avg_sales_30d DECIMAL(12,2),    -- 新卖家平均30天销售额（USD）

    -- 2.4 差异化空间
    avg_product_similarity DECIMAL(5,2),       -- 平均产品同质化指数（0-100，越高越同质）
    unique_selling_points_diversity INT,       -- 独特卖点多样性得分（0-100）
    avg_review_diversity DECIMAL(5,2),         -- 评论差异度（0-100，评论内容多样性）
    differentiation_space_score INT,           -- 差异化空间综合得分（0-100）

    -- 2.5 价格竞争
    price_war_index DECIMAL(5,2),              -- 价格战指数（0-100，越高越激烈）
    avg_discount_rate DECIMAL(5,2),            -- 平均折扣率（%）
    price_volatility DECIMAL(5,2),             -- 价格波动率（标准差/均值）

    -- 2.6 进入壁垒
    entry_barrier_level ENUM('low', 'medium', 'high'),  -- 进入壁垒等级
    barrier_certification_required BOOLEAN,    -- 是否需要认证
    barrier_moq_high BOOLEAN,                  -- MOQ是否较高
    barrier_brand_dominance BOOLEAN,           -- 是否品牌主导

    -- 数据时效
    last_updated TIMESTAMP,

    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表4：盈利数据表 (profitability_data)

**作用**：存储每个组合的盈利相关数据（用于计算"盈利潜力"维度）

```sql
CREATE TABLE profitability_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 维度3：盈利潜力 (Profit Potential) 相关字段 =====

    -- 3.1 价格数据
    avg_selling_price DECIMAL(10,2),           -- 平均售价（USD）
    price_range_min DECIMAL(10,2),             -- 价格区间最低
    price_range_max DECIMAL(10,2),             -- 价格区间最高
    median_price DECIMAL(10,2),                -- 中位数价格

    -- 3.2 成本估算
    avg_product_cost DECIMAL(10,2),            -- 平均产品成本（USD，基于品类通用模型）
    cost_estimation_method VARCHAR(50),        -- 成本估算方法：'supplier_quote' / 'category_avg' / 'ml_model'

    -- 3.3 费用数据
    platform_commission_rate DECIMAL(5,2),     -- 平台佣金率（%）
    avg_shipping_cost DECIMAL(10,2),           -- 平均物流成本（USD）
    avg_ad_cost_per_order DECIMAL(10,2),       -- 平均广告成本/订单（USD）
    avg_return_cost DECIMAL(10,2),             -- 平均退货成本（USD）
    payment_processing_fee_rate DECIMAL(5,2),  -- 支付手续费率（%）

    -- 3.4 利润率
    avg_gross_margin DECIMAL(5,2),             -- 平均毛利率（%）= (售价-成本)/售价
    avg_net_margin DECIMAL(5,2),               -- 平均净利率（%）= (售价-总成本)/售价
    gross_margin_range_min DECIMAL(5,2),       -- 毛利率区间
    gross_margin_range_max DECIMAL(5,2),

    -- 3.5 客单价
    avg_order_value DECIMAL(10,2),             -- 平均客单价（AOV）
    aov_category ENUM('low', 'medium', 'high', 'premium'), -- 客单价分类

    -- 3.6 资金周转
    avg_inventory_turnover_days INT,           -- 平均库存周转天数
    avg_payment_cycle_days INT,                -- 平均回款周期（天）
    capital_efficiency_score INT,              -- 资金效率得分（0-100）

    -- 3.7 销售速度
    avg_daily_sales_volume INT,                -- 平均日销量
    avg_monthly_revenue DECIMAL(12,2),         -- 平均月销售额（USD）

    -- 数据时效
    last_updated TIMESTAMP,

    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表5：合规风险数据表 (compliance_risk_data)

**作用**：存储每个组合的合规和风险数据（用于计算"风险可控性"维度）

```sql
CREATE TABLE compliance_risk_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 维度5：风险可控性 (Risk Control) 相关字段 =====

    -- 5.1 合规认证要求
    certifications_required JSON,              -- 需要的认证列表，如 ["CE", "FCC", "FDA"]
    certification_complexity ENUM('none', 'low', 'medium', 'high'),
    avg_certification_cost DECIMAL(10,2),      -- 平均认证成本（USD）
    avg_certification_time_days INT,           -- 平均认证周期（天）
    compliance_risk_score INT,                 -- 合规风险得分（0-100，越高风险越大）

    -- 5.2 政策风险
    tariff_rate DECIMAL(5,2),                  -- 关税税率（%）
    tariff_volatility ENUM('stable', 'moderate', 'volatile'), -- 关税波动性
    import_restrictions JSON,                  -- 进口限制，如 ["需配额", "需许可证"]
    export_restrictions JSON,                  -- 出口限制
    policy_change_risk ENUM('low', 'medium', 'high'), -- 政策变动风险
    policy_risk_score INT,                     -- 政策风险得分（0-100）

    -- 5.3 平台政策
    platform_category_risk ENUM('safe', 'watch', 'restricted'), -- 平台品类风险等级
    platform_violation_rate DECIMAL(5,2),      -- 该品类平台违规率（%）
    recent_policy_changes JSON,                -- 近期政策变化记录

    -- 5.4 供应链稳定性
    supplier_concentration ENUM('diversified', 'moderate', 'concentrated'), -- 供应商集中度
    raw_material_volatility ENUM('stable', 'moderate', 'volatile'), -- 原材料价格波动
    supply_chain_stability_score INT,          -- 供应链稳定性得分（0-100）
    lead_time_variability DECIMAL(5,2),        -- 交货期波动率（标准差/均值）

    -- 5.5 退货/售后风险
    avg_return_rate DECIMAL(5,2),              -- 平均退货率（%）
    avg_defect_rate DECIMAL(5,2),              -- 平均缺陷率（%）
    avg_negative_review_rate DECIMAL(5,2),     -- 差评率（%）
    return_risk_level ENUM('low', 'medium', 'high'),

    -- 5.6 知识产权风险
    ip_infringement_risk ENUM('low', 'medium', 'high'), -- 侵权风险
    patent_landscape_complexity ENUM('simple', 'moderate', 'complex'), -- 专利复杂度

    -- 5.7 其他风险
    seasonality_risk DECIMAL(5,2),             -- 季节性风险（过度依赖季节=高风险）
    brand_requirement ENUM('none', 'optional', 'required'), -- 品牌要求

    -- 数据时效
    last_updated TIMESTAMP,

    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表6：用户画像表 (user_profiles)

**作用**：存储用户的战略画像，用于个性化评分（影响"资源匹配度"维度和权重配置）

```sql
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,                   -- 关联用户ID

    -- ===== 战略意图 =====
    strategic_goal ENUM('expand_product', 'new_market', 'new_platform', 'upgrade', 'explore'),
    risk_preference ENUM('conservative', 'balanced', 'aggressive'),

    -- ===== 资源状况 =====
    -- 供应链能力
    supply_chain_type ENUM('factory', 'trade', 'dropship', 'hybrid'),
    current_categories JSON,                   -- 当前经营品类，如 ["pet_supplies", "electronics"]
    supply_chain_strength_score INT,           -- 供应链实力得分（0-100）

    -- 资金预算
    budget_range ENUM('low', 'medium', 'high', 'unlimited'),
    budget_min DECIMAL(12,2),                  -- 预算下限（USD）
    budget_max DECIMAL(12,2),                  -- 预算上限（USD）

    -- 团队能力
    team_size INT,                             -- 团队规模
    has_content_capability BOOLEAN,            -- 是否有内容运营能力（TikTok需要）
    has_ad_capability BOOLEAN,                 -- 是否有广告投放能力
    has_branding_capability BOOLEAN,           -- 是否有品牌营销能力
    has_multilingual_capability BOOLEAN,       -- 是否有多语言能力
    languages JSON,                            -- 支持的语言，如 ["en", "zh", "es"]

    -- 平台经验
    platform_experience JSON,                  -- 有经验的平台，如 ["amazon", "ebay"]
    years_in_crossborder INT,                  -- 跨境电商年限

    -- ===== 偏好设置 =====
    preferred_markets JSON,                    -- 偏好市场
    avoided_markets JSON,                      -- 规避市场
    preferred_platforms JSON,                  -- 偏好平台

    -- 元数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id)
);
```

---

### 表7：资源匹配评分表 (resource_fit_scores)

**作用**：存储每个【用户×组合】的资源匹配度评分（个性化数据）

```sql
CREATE TABLE resource_fit_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_profile_id BIGINT NOT NULL,
    combination_id BIGINT NOT NULL,

    -- ===== 维度4：资源匹配度 (Resource Fit) 相关字段 =====

    -- 4.1 供应链匹配
    supply_chain_fit_score INT,                -- 供应链匹配度（0-100）
    supply_chain_fit_reason TEXT,              -- 匹配原因说明
    has_category_experience BOOLEAN,           -- 是否有该品类经验

    -- 4.2 资金匹配
    estimated_startup_cost DECIMAL(12,2),      -- 估算启动资金需求（USD）
    -- 包含：首批备货 + 认证费用 + 初期推广 + 平台保证金
    budget_fit_score INT,                      -- 资金匹配度（0-100）
    budget_utilization_rate DECIMAL(5,2),      -- 预算利用率（%）= 需求/预算

    -- 4.3 团队能力匹配
    team_capability_fit_score INT,             -- 团队能力匹配度（0-100）
    required_capabilities JSON,                -- 该组合需要的能力，如 ["content", "ad"]
    missing_capabilities JSON,                 -- 缺失的能力

    -- 4.4 平台经验匹配
    platform_experience_fit_score INT,         -- 平台经验匹配度（0-100）
    has_platform_experience BOOLEAN,           -- 是否有该平台经验
    similar_platform_experience BOOLEAN,       -- 是否有类似平台经验

    -- 4.5 语言文化匹配
    language_fit_score INT,                    -- 语言匹配度（0-100）
    required_language VARCHAR(10),             -- 该市场需要的主要语言
    has_language_capability BOOLEAN,           -- 是否具备语言能力

    -- 4.6 综合资源匹配度
    total_resource_fit_score INT,              -- 综合资源匹配度（0-100）

    -- 计算时间
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    UNIQUE KEY uk_user_combination (user_profile_id, combination_id),
    INDEX idx_user_profile (user_profile_id),
    INDEX idx_combination (combination_id)
);
```

---

### 表8：维度评分表 (dimension_scores)

**作用**：存储每个组合的5大维度预计算评分（加速查询）

```sql
CREATE TABLE dimension_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 5大维度评分（通用版本，不考虑用户个性化）=====
    market_attractiveness_score INT,           -- 市场吸引力得分（0-100）
    competitive_feasibility_score INT,         -- 竞争可行性得分（0-100）
    profit_potential_score INT,                -- 盈利潜力得分（0-100）
    risk_control_score INT,                    -- 风险可控性得分（0-100）

    -- 注意：资源匹配度因用户而异，存储在 resource_fit_scores 表

    -- ===== 各维度子指标得分（可选，用于详细展示）=====
    -- 市场吸引力子指标
    ma_market_size_score INT,
    ma_growth_rate_score INT,
    ma_demand_trend_score INT,
    ma_market_maturity_score INT,

    -- 竞争可行性子指标
    cf_competition_intensity_score INT,
    cf_market_concentration_score INT,
    cf_seller_survival_score INT,
    cf_differentiation_score INT,

    -- 盈利潜力子指标
    pp_gross_margin_score INT,
    pp_net_margin_score INT,
    pp_aov_score INT,
    pp_turnover_score INT,

    -- 风险可控性子指标
    rc_compliance_risk_score INT,
    rc_policy_risk_score INT,
    rc_supply_chain_score INT,
    rc_return_risk_score INT,

    -- 元数据
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_confidence INT,                       -- 数据信心指数（0-100）

    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    UNIQUE KEY uk_combination (combination_id),
    INDEX idx_scores (market_attractiveness_score, competitive_feasibility_score, profit_potential_score)
);
```

---

### 表9：用户综合评分表 (user_opportunity_scores)

**作用**：存储每个【用户×组合】的最终个性化评分（MCDA计算结果）

```sql
CREATE TABLE user_opportunity_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_profile_id BIGINT NOT NULL,
    combination_id BIGINT NOT NULL,

    -- ===== 最终评分 =====
    total_score DECIMAL(5,2),                  -- MCDA综合评分（0-100）
    score_grade VARCHAR(5),                    -- 评分等级：'A+', 'A', 'B+', 'B', 'C', 'D'
    priority_rank VARCHAR(10),                 -- 优先级：'P0', 'P1', 'P2', 'P3'
    confidence_index INT,                      -- 信心指数（0-100）

    -- ===== 使用的权重（记录计算时的权重配置）=====
    weight_ma DECIMAL(5,4),                    -- 市场吸引力权重
    weight_cf DECIMAL(5,4),                    -- 竞争可行性权重
    weight_pp DECIMAL(5,4),                    -- 盈利潜力权重
    weight_rf DECIMAL(5,4),                    -- 资源匹配度权重
    weight_rc DECIMAL(5,4),                    -- 风险可控性权重

    -- ===== 5大维度得分（含个性化的资源匹配度）=====
    dimension_ma_score INT,
    dimension_cf_score INT,
    dimension_pp_score INT,
    dimension_rf_score INT,                    -- 个性化的资源匹配度
    dimension_rc_score INT,

    -- ===== 推荐理由（AI生成或模板生成）=====
    fit_reason TEXT,                           -- 适配理由
    risk_warning TEXT,                         -- 风险提示
    key_highlights JSON,                       -- 关键亮点，如 ["高增长", "低竞争"]

    -- 元数据
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
    FOREIGN KEY (combination_id) REFERENCES combinations(id),
    UNIQUE KEY uk_user_combination (user_profile_id, combination_id),
    INDEX idx_user_profile (user_profile_id),
    INDEX idx_total_score (total_score DESC),
    INDEX idx_grade (score_grade)
);
```

---

### 表10：权重配置表 (weight_configurations)

**作用**：存储不同战略路径的权重配置（可后台管理）

```sql
CREATE TABLE weight_configurations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    strategic_goal VARCHAR(50) NOT NULL,       -- 'expand_product' / 'new_market' 等
    risk_preference VARCHAR(50) NOT NULL,      -- 'conservative' / 'balanced' / 'aggressive'

    -- 5大维度权重
    weight_ma DECIMAL(5,4) NOT NULL,
    weight_cf DECIMAL(5,4) NOT NULL,
    weight_pp DECIMAL(5,4) NOT NULL,
    weight_rf DECIMAL(5,4) NOT NULL,
    weight_rc DECIMAL(5,4) NOT NULL,

    -- 版本控制
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,

    -- 说明
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_strategy_risk (strategic_goal, risk_preference, version),
    INDEX idx_active (is_active, effective_from, effective_to)
);
```

---

## 三、数据示例

### 示例1：一个完整组合的数据

#### combinations 表
```sql
INSERT INTO combinations VALUES (
    1,
    'pet_supplies',      -- 宠物用品
    'US',                -- 美国
    'tiktok',            -- TikTok Shop
    TRUE,                -- 可用
    FALSE,               -- 不受限
    NULL,
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
);
```

#### market_data 表
```sql
INSERT INTO market_data VALUES (
    1,
    1,                   -- combination_id
    120000000,           -- $120M 市场规模
    'third_party',
    180.50,              -- +180.5% YoY增长
    15.30,               -- +15.3% MoM增长
    '2024-Q4',
    85,                  -- 搜索热度指数 85/100
    0.0234,              -- 趋势斜率（上升）
    45000,               -- 社媒提及量
    0.0189,
    'growth',            -- 成长期
    90,                  -- 成熟度得分
    1.2,                 -- 轻微季节性
    '11,12',             -- 11-12月旺季
    95.0,                -- 数据完整度 95%
    3,                   -- 数据3天前更新
    '2024-01-15 10:00:00'
);
```

#### competition_data 表
```sql
INSERT INTO competition_data VALUES (
    1,
    1,
    1500,                -- 1500个卖家
    120,                 -- 30天新增120个
    850,                 -- 850个活跃
    65,                  -- 竞争强度 65/100（中等）
    12.5,                -- Top1占12.5%
    35.0,                -- CR5占35%
    55.0,                -- CR10占55%
    0.0285,              -- HHI指数
    75.0,                -- 3个月存活率75%
    68.0,                -- 6个月存活率68%
    3500.00,             -- 新卖家月均$3500
    45.0,                -- 产品同质化45%（中等）
    75,                  -- 卖点多样性75/100
    68.0,                -- 评论差异度
    75,                  -- 差异化空间75/100（较好）
    55.0,                -- 价格战指数
    25.0,                -- 平均折扣率25%
    0.18,                -- 价格波动率
    'low',               -- 低进入壁垒
    FALSE,
    FALSE,
    FALSE,
    '2024-01-15 10:00:00'
);
```

#### profitability_data 表
```sql
INSERT INTO profitability_data VALUES (
    1,
    1,
    65.00,               -- 平均售价$65
    45.00,               -- 最低$45
    89.00,               -- 最高$89
    62.00,               -- 中位数$62
    22.00,               -- 产品成本$22
    'category_avg',
    8.5,                 -- 平台佣金8.5%
    12.00,               -- 物流$12
    8.50,                -- 广告$8.5/单
    5.00,                -- 退货成本$5
    2.5,                 -- 支付手续费2.5%
    35.0,                -- 毛利率35%
    18.0,                -- 净利率18%
    30.0,
    42.0,
    65.00,               -- AOV $65
    'medium',
    35,                  -- 库存周转35天
    45,                  -- 回款周期45天
    75,                  -- 资金效率75/100
    25,                  -- 日销25单
    48750.00,            -- 月销$48,750
    '2024-01-15 10:00:00'
);
```

#### compliance_risk_data 表
```sql
INSERT INTO compliance_risk_data VALUES (
    1,
    1,
    '["FCC"]',           -- 需要FCC认证
    'medium',
    4000.00,             -- 认证费$4000
    60,                  -- 认证周期60天
    45,                  -- 合规风险45/100
    0.0,                 -- 无关税
    'stable',
    '[]',
    '[]',
    'low',
    25,                  -- 政策风险25/100
    'safe',
    2.5,                 -- 违规率2.5%
    '[]',
    'moderate',          -- 供应商中等集中
    'stable',
    85,                  -- 供应链稳定性85/100
    0.12,
    8.5,                 -- 退货率8.5%
    2.0,
    5.5,
    'low',
    'low',
    'simple',
    1.2,
    'optional',
    '2024-01-15 10:00:00'
);
```

#### dimension_scores 表
```sql
INSERT INTO dimension_scores VALUES (
    1,
    1,
    92,                  -- 市场吸引力 92/100
    78,                  -- 竞争可行性 78/100
    85,                  -- 盈利潜力 85/100
    82,                  -- 风险可控性 82/100
    -- 子指标略...
    90, 95, 88, 90,      -- MA子指标
    70, 75, 80, 85,      -- CF子指标
    88, 80, 75, 90,      -- PP子指标
    85, 75, 85, 80,      -- RC子指标
    '2024-01-15 10:30:00',
    92                   -- 信心指数92%
);
```

---

## 四、关键查询示例

### 查询1：获取某组合的完整数据（用于详情页）

```sql
SELECT
    c.category_code,
    c.country_code,
    c.platform_code,
    m.market_size_usd,
    m.growth_rate_yoy,
    comp.competition_intensity_score,
    comp.top5_market_share,
    p.avg_selling_price,
    p.avg_net_margin,
    r.compliance_risk_score,
    r.avg_return_rate,
    d.market_attractiveness_score,
    d.competitive_feasibility_score,
    d.profit_potential_score,
    d.risk_control_score
FROM combinations c
LEFT JOIN market_data m ON c.id = m.combination_id
LEFT JOIN competition_data comp ON c.id = comp.combination_id
LEFT JOIN profitability_data p ON c.id = p.combination_id
LEFT JOIN compliance_risk_data r ON c.id = r.combination_id
LEFT JOIN dimension_scores d ON c.id = d.combination_id
WHERE c.category_code = 'pet_supplies'
  AND c.country_code = 'US'
  AND c.platform_code = 'tiktok';
```

### 查询2：获取某用户的个性化评分（热力图数据）

```sql
SELECT
    c.category_code,
    c.country_code,
    c.platform_code,
    u.total_score,
    u.score_grade,
    u.priority_rank,
    u.dimension_ma_score,
    u.dimension_cf_score,
    u.dimension_pp_score,
    u.dimension_rf_score,
    u.dimension_rc_score,
    u.fit_reason,
    u.risk_warning
FROM user_opportunity_scores u
JOIN combinations c ON u.combination_id = c.id
WHERE u.user_profile_id = 123
  AND c.is_available = TRUE
ORDER BY u.total_score DESC
LIMIT 100;
```

### 查询3：品类视图热力图数据

```sql
-- 用户选择品类：pet_supplies，获取 国家×平台 矩阵
SELECT
    c.country_code,
    c.platform_code,
    u.total_score AS heat_value,
    u.score_grade,
    m.growth_rate_yoy AS growth_indicator
FROM user_opportunity_scores u
JOIN combinations c ON u.combination_id = c.id
LEFT JOIN market_data m ON c.id = m.combination_id
WHERE u.user_profile_id = 123
  AND c.category_code = 'pet_supplies'
  AND c.is_available = TRUE
ORDER BY c.country_code, c.platform_code;
```

---

## 五、性能优化建议

### 1. 分表策略
如果数据量巨大（百万级组合×千万级用户）：
```
- market_data 按年份分表：market_data_2024, market_data_2025
- user_opportunity_scores 按用户分片
```

### 2. 缓存策略
```
- dimension_scores 表作为预计算缓存
- user_opportunity_scores 表作为用户个性化缓存
- 热力图数据缓存到Redis（key: user_id:view_type:anchor_value）
```

### 3. 索引优化
```sql
-- 组合索引加速热力图查询
CREATE INDEX idx_user_category ON user_opportunity_scores(user_profile_id, combination_id)
    INCLUDE (total_score, score_grade);

-- 覆盖索引加速列表查询
CREATE INDEX idx_scores_desc ON user_opportunity_scores(user_profile_id, total_score DESC)
    INCLUDE (combination_id, score_grade, priority_rank);
```

---

## 六、总结

### 数据流转流程

```
1. 原始数据采集（每日/每周）
   ↓
2. 写入 market_data, competition_data, profitability_data, compliance_risk_data
   ↓
3. 计算 dimension_scores（通用维度评分，不含用户个性化）
   ↓
4. 用户登录/更新画像
   ↓
5. 计算 resource_fit_scores（用户×组合的资源匹配度）
   ↓
6. 应用 weight_configurations（根据用户战略目标获取权重）
   ↓
7. 计算 user_opportunity_scores（MCDA最终评分）
   ↓
8. 前端查询 user_opportunity_scores 渲染热力图
```

### 核心字段总结

**5大维度对应的核心字段**：

1. **市场吸引力 (MA)**：market_size_usd, growth_rate_yoy, search_trend_index, market_maturity
2. **竞争可行性 (CF)**：competition_intensity_score, top5_market_share, new_seller_survival_6m, differentiation_space_score
3. **盈利潜力 (PP)**：avg_gross_margin, avg_net_margin, avg_order_value, avg_inventory_turnover_days
4. **资源匹配度 (RF)**：supply_chain_fit_score, budget_fit_score, team_capability_fit_score, platform_experience_fit_score
5. **风险可控性 (RC)**：compliance_risk_score, policy_risk_score, supply_chain_stability_score, avg_return_rate

这套表结构支持：
✅ 完整的MCDA算法实现
✅ 用户个性化评分
✅ 高性能热力图查询
✅ 数据追溯和审计
