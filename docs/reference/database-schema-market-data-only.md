# 数据库表结构设计 - 纯市场数据层（无算法评分）

## 设计原则

### ✅ 应该存储的数据
- **客观事实数据**：市场规模、价格、销量、卖家数量等
- **可量化指标**：增长率、退货率、认证费用等
- **可验证数据**：有明确数据来源的信息

### ❌ 不应该存储的数据
- **主观评分**：如"竞争强度得分65/100"、"差异化空间75/100"
- **计算结果**：如"市场吸引力92分"、"机会总分87分"
- **推荐性内容**：如"适合理由"、"推荐等级"

**这些都应该在应用层实时计算！**

---

## 数据库表结构

### 表1：组合主表 (market_combinations)

**作用**：定义所有【品类×国家×平台】组合及其可用性

```sql
CREATE TABLE market_combinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- 组合三维度
    category_code VARCHAR(50) NOT NULL,        -- 品类代码
    country_code VARCHAR(10) NOT NULL,         -- 国家代码
    platform_code VARCHAR(50) NOT NULL,        -- 平台代码

    -- 组合状态（客观事实）
    is_available BOOLEAN DEFAULT TRUE,         -- 平台是否在该国家运营
    is_category_allowed BOOLEAN DEFAULT TRUE,  -- 该品类在该平台是否允许

    -- 限制说明（事实记录）
    restriction_type ENUM('none', 'platform_not_available', 'category_restricted', 'other'),
    restriction_note TEXT,                     -- 如"该平台未在该国家开通"

    -- 元数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_combination (category_code, country_code, platform_code),
    INDEX idx_category (category_code),
    INDEX idx_country (country_code),
    INDEX idx_platform (platform_code)
);
```

---

### 表2：市场规模与增长数据 (market_size_growth)

**作用**：存储市场容量和增长趋势的客观数据

```sql
CREATE TABLE market_size_growth (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 市场规模（客观数据）=====
    total_gmv_usd DECIMAL(15,2),               -- 该组合的GMV（美元），如 120000000.00
    total_orders INT,                          -- 总订单量（近30天）
    total_sellers INT,                         -- 总卖家数
    active_listings INT,                       -- 活跃商品数

    -- ===== 增长数据（客观统计）=====
    gmv_growth_yoy DECIMAL(8,2),               -- GMV同比增长率（%），如 180.50
    gmv_growth_mom DECIMAL(8,2),               -- GMV环比增长率（%），如 15.30
    gmv_growth_qoq DECIMAL(8,2),               -- GMV季度环比增长率（%）

    orders_growth_yoy DECIMAL(8,2),            -- 订单量同比增长率（%）
    orders_growth_mom DECIMAL(8,2),            -- 订单量环比增长率（%）

    sellers_growth_yoy DECIMAL(8,2),           -- 卖家数同比增长率（%）
    sellers_growth_mom DECIMAL(8,2),           -- 卖家数环比增长率（%）

    -- ===== 历史趋势数据（时间序列）=====
    gmv_history_6m JSON,                       -- 近6个月GMV，如 [100M, 105M, 110M, ...]
    gmv_history_12m JSON,                      -- 近12个月GMV

    -- ===== 数据元信息 =====
    data_source VARCHAR(100),                  -- 数据来源，如 'platform_api', 'jungle_scout', 'helium10'
    data_collection_date DATE,                 -- 数据采集日期
    data_period VARCHAR(50),                   -- 数据周期，如 '2024-Q4', '2024-12'
    data_confidence ENUM('high', 'medium', 'low'), -- 数据可信度（基于来源和样本量）
    sample_size INT,                           -- 样本量

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id),
    INDEX idx_collection_date (data_collection_date)
);
```

---

### 表3：需求趋势数据 (demand_trends)

**作用**：存储搜索热度、社媒提及等需求侧数据

```sql
CREATE TABLE demand_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 搜索热度（Google Trends / 平台搜索）=====
    google_trends_index INT,                   -- Google Trends指数（0-100）
    platform_search_volume INT,                -- 平台内搜索量（近30天）
    search_volume_growth_mom DECIMAL(8,2),     -- 搜索量环比增长率（%）

    search_history_12m JSON,                   -- 近12个月搜索指数，如 [65, 70, 75, ...]
    search_peak_month INT,                     -- 搜索峰值月份（1-12）

    -- ===== 社交媒体数据 =====
    tiktok_hashtag_views BIGINT,               -- TikTok相关话题播放量
    instagram_posts_count INT,                 -- Instagram相关帖子数（近30天）
    youtube_videos_count INT,                  -- YouTube相关视频数（近30天）
    social_mention_growth_mom DECIMAL(8,2),    -- 社媒提及增长率（%）

    -- ===== 季节性数据 =====
    seasonality_factor DECIMAL(5,2),           -- 季节性系数（1.0=无季节性，>2.0=强季节性）
    peak_season_months JSON,                   -- 旺季月份，如 [11, 12, 1]
    low_season_months JSON,                    -- 淡季月份

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表4：竞争格局数据 (competition_landscape)

**作用**：存储竞争相关的客观统计数据

```sql
CREATE TABLE competition_landscape (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 卖家数量统计 =====
    total_sellers INT,                         -- 总卖家数
    active_sellers_30d INT,                    -- 近30天活跃卖家数（有销售）
    new_sellers_30d INT,                       -- 近30天新进入卖家数
    exited_sellers_30d INT,                    -- 近30天退出卖家数

    -- ===== 新卖家存活统计（客观数据）=====
    new_sellers_cohort_3m_ago INT,             -- 3个月前进入的新卖家总数
    new_sellers_survived_3m INT,               -- 3个月后仍存活的数量
    -- 计算：存活率 = survived / cohort （应用层计算）

    new_sellers_cohort_6m_ago INT,             -- 6个月前进入的新卖家总数
    new_sellers_survived_6m INT,               -- 6个月后仍存活的数量

    -- ===== 市场集中度（客观统计）=====
    top1_seller_gmv DECIMAL(15,2),             -- 第1名卖家GMV
    top1_seller_gmv_share DECIMAL(5,2),        -- 第1名份额（%）

    top5_sellers_total_gmv DECIMAL(15,2),      -- 前5名总GMV
    top5_sellers_gmv_share DECIMAL(5,2),       -- CR5 前5名份额（%）

    top10_sellers_total_gmv DECIMAL(15,2),     -- 前10名总GMV
    top10_sellers_gmv_share DECIMAL(5,2),      -- CR10 前10名份额（%）

    -- HHI指数原始数据
    hhi_index DECIMAL(10,4),                   -- 赫芬达尔-赫希曼指数（市场集中度）
    -- HHI = Σ(每个卖家市场份额的平方)
    -- 0-1500: 低集中度
    -- 1500-2500: 中等集中度
    -- >2500: 高集中度

    -- ===== 价格竞争数据 =====
    avg_discount_depth DECIMAL(5,2),           -- 平均折扣幅度（%）
    promotion_frequency DECIMAL(5,2),          -- 促销频率（近30天有促销的商品占比%）
    price_range_spread DECIMAL(5,2),           -- 价格离散度（标准差/均值）

    -- ===== 产品同质化数据（客观指标）=====
    avg_products_per_seller DECIMAL(8,2),      -- 平均每个卖家的SKU数
    unique_product_designs INT,                -- 独特设计数量（基于图像识别）
    avg_title_similarity DECIMAL(5,2),         -- 平均标题相似度（%，NLP计算）
    avg_image_similarity DECIMAL(5,2),         -- 平均图片相似度（%，图像识别）

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表5：价格与成本数据 (pricing_cost)

**作用**：存储价格分布和成本估算数据

```sql
CREATE TABLE pricing_cost (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 价格分布（客观统计）=====
    price_min DECIMAL(10,2),                   -- 最低价（USD）
    price_p25 DECIMAL(10,2),                   -- 25分位价格
    price_median DECIMAL(10,2),                -- 中位数价格
    price_p75 DECIMAL(10,2),                   -- 75分位价格
    price_max DECIMAL(10,2),                   -- 最高价
    price_avg DECIMAL(10,2),                   -- 平均价格
    price_std_dev DECIMAL(10,2),               -- 价格标准差

    -- 价格分布直方图（用于绘制价格带分布图）
    price_distribution JSON,                   -- 如 {"0-20": 15%, "20-50": 45%, "50-100": 30%, "100+": 10%}

    -- ===== 成本估算（基于供应链数据）=====
    estimated_product_cost_min DECIMAL(10,2),  -- 估算产品成本下限（USD）
    estimated_product_cost_max DECIMAL(10,2),  -- 估算产品成本上限
    estimated_product_cost_avg DECIMAL(10,2),  -- 估算平均产品成本
    cost_estimation_basis VARCHAR(100),        -- 估算依据，如 '1688批发价×1.3'

    typical_moq INT,                           -- 典型最小起订量
    moq_range_min INT,                         -- MOQ范围下限
    moq_range_max INT,                         -- MOQ范围上限

    -- ===== 平台费用（客观事实）=====
    platform_commission_rate DECIMAL(5,2),     -- 平台佣金率（%）
    platform_transaction_fee DECIMAL(10,2),    -- 平台交易手续费（固定费用，USD）
    platform_listing_fee DECIMAL(10,2),        -- 平台上架费（如有）

    -- ===== 物流成本（客观统计）=====
    avg_shipping_cost_domestic DECIMAL(10,2),  -- 境内物流平均成本（USD）
    avg_shipping_cost_intl DECIMAL(10,2),      -- 国际物流平均成本
    avg_shipping_weight_kg DECIMAL(8,2),       -- 平均商品重量（kg）
    avg_package_volume_m3 DECIMAL(8,4),        -- 平均包裹体积（m³）

    -- ===== 广告成本（市场统计）=====
    avg_cpc DECIMAL(8,2),                      -- 平均点击成本（USD）
    avg_cpm DECIMAL(8,2),                      -- 平均千次展示成本（USD）
    avg_acos DECIMAL(5,2),                     -- 平均广告成本率（%，ACoS）
    -- ACoS = 广告支出 / 广告带来的销售额

    -- ===== 利润率统计（基于抓取的卖家数据反推）=====
    observed_gross_margin_avg DECIMAL(5,2),    -- 观察到的平均毛利率（%）
    observed_gross_margin_range_min DECIMAL(5,2),
    observed_gross_margin_range_max DECIMAL(5,2),

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),
    sample_size INT,

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表6：运营指标数据 (operational_metrics)

**作用**：存储销售速度、库存周转等运营相关数据

```sql
CREATE TABLE operational_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 销售速度 =====
    avg_daily_orders INT,                      -- 平均日订单量
    avg_monthly_orders INT,                    -- 平均月订单量
    avg_monthly_gmv DECIMAL(15,2),             -- 平均月GMV（USD）

    top_seller_monthly_orders INT,             -- 头部卖家月订单量
    median_seller_monthly_orders INT,          -- 中位卖家月订单量

    -- ===== 客单价 =====
    avg_order_value DECIMAL(10,2),             -- 平均客单价（AOV，USD）
    avg_items_per_order DECIMAL(5,2),          -- 平均每单商品数

    -- ===== 库存周转（基于观察推算）=====
    estimated_avg_inventory_days INT,          -- 估算平均库存周转天数
    -- 基于：销量 vs 库存水位的统计规律

    -- ===== 评论与评分数据 =====
    avg_reviews_per_product INT,               -- 平均每个商品的评论数
    avg_rating DECIMAL(3,2),                   -- 平均评分（1-5星）
    rating_distribution JSON,                  -- 评分分布，如 {"5": 60%, "4": 25%, ...}

    avg_review_velocity INT,                   -- 平均评论速度（条/月）
    -- 用于判断市场活跃度

    -- ===== 退货与售后数据 =====
    avg_return_rate DECIMAL(5,2),              -- 平均退货率（%）
    avg_defect_rate DECIMAL(5,2),              -- 平均缺陷率（%）
    avg_negative_review_rate DECIMAL(5,2),     -- 差评率（1-2星占比%）

    common_return_reasons JSON,                -- 常见退货原因，如 ["尺寸不合", "质量问题"]

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表7：合规与认证数据 (compliance_requirements)

**作用**：存储认证要求、关税等合规相关客观数据

```sql
CREATE TABLE compliance_requirements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 认证要求（客观事实）=====
    required_certifications JSON,              -- 必需认证，如 ["CE", "FCC", "RoHS"]
    optional_certifications JSON,              -- 可选认证，如 ["UL", "Energy Star"]

    -- 认证成本（市场调研数据）
    certification_costs JSON,                  -- 各认证费用，如 {"CE": 3000, "FCC": 5000}
    total_certification_cost_min DECIMAL(10,2), -- 最低认证总成本
    total_certification_cost_max DECIMAL(10,2), -- 最高认证总成本

    -- 认证周期（客观数据）
    certification_timeline_days JSON,          -- 各认证周期，如 {"CE": 45, "FCC": 60}
    total_certification_days_min INT,          -- 最短认证周期
    total_certification_days_max INT,          -- 最长认证周期

    -- ===== 关税与税费（客观事实）=====
    import_tariff_rate DECIMAL(5,2),           -- 进口关税税率（%）
    vat_rate DECIMAL(5,2),                     -- 增值税率（%）
    other_taxes JSON,                          -- 其他税费，如 {"消费税": 5%, "环保税": 2%}

    tariff_hs_code VARCHAR(20),                -- 海关编码（HS Code）
    tariff_history_12m JSON,                   -- 近12个月关税历史（监测变化）

    -- ===== 进出口限制（客观政策）=====
    import_quota BOOLEAN,                      -- 是否有进口配额限制
    import_license_required BOOLEAN,           -- 是否需要进口许可证
    export_restrictions JSON,                  -- 出口限制说明

    banned_platforms JSON,                     -- 该品类在哪些平台被禁止，如 ["tiktok"]
    restricted_platforms JSON,                 -- 受限平台（需额外资质）

    -- ===== 知识产权风险（客观数据）=====
    patent_count_in_market INT,                -- 该市场相关专利数量
    trademark_count_in_market INT,             -- 相关商标数量
    recent_ip_cases_count INT,                 -- 近12个月侵权案例数量

    -- ===== 产品标准要求（客观规定）=====
    safety_standards JSON,                     -- 安全标准，如 ["EN71", "ASTM F963"]
    labeling_requirements JSON,                -- 标签要求，如 ["成分标注", "警告标签"]
    packaging_requirements TEXT,               -- 包装要求描述

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),                  -- 如 'customs_database', 'certification_body'

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表8：供应链数据 (supply_chain_info)

**作用**：存储供应商、生产周期等供应链客观数据

```sql
CREATE TABLE supply_chain_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 供应商分布（统计数据）=====
    main_source_regions JSON,                  -- 主要产地，如 ["广东深圳", "浙江义乌"]
    supplier_count_1688 INT,                   -- 1688平台供应商数量
    supplier_count_alibaba INT,                -- Alibaba.com供应商数量

    -- ===== 采购成本（市场调研）=====
    wholesale_price_1688_min DECIMAL(10,2),    -- 1688批发价下限（CNY）
    wholesale_price_1688_max DECIMAL(10,2),    -- 1688批发价上限
    wholesale_price_alibaba_min DECIMAL(10,2), -- Alibaba FOB价下限（USD）
    wholesale_price_alibaba_max DECIMAL(10,2), -- Alibaba FOB价上限

    -- ===== 生产与交货周期（客观统计）=====
    typical_moq INT,                           -- 典型MOQ
    typical_production_days INT,               -- 典型生产周期（天）
    production_days_range_min INT,             -- 生产周期范围
    production_days_range_max INT,

    typical_lead_time_days INT,                -- 典型总交货期（天）
    lead_time_variability DECIMAL(5,2),        -- 交货期波动率（标准差/均值）

    -- ===== 原材料风险（客观监测）=====
    key_raw_materials JSON,                    -- 关键原材料，如 ["塑料粒子", "锂电池"]
    raw_material_price_volatility JSON,        -- 原材料价格波动，如 {"塑料": "stable", "锂电池": "volatile"}

    -- ===== 供应链事件（历史记录）=====
    supply_disruption_events JSON,             -- 供应链中断事件，如 [{"date": "2023-Q3", "reason": "疫情"}]

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

### 表9：平台政策数据 (platform_policies)

**作用**：存储各平台针对该组合的政策要求（客观事实）

```sql
CREATE TABLE platform_policies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combination_id BIGINT NOT NULL,

    -- ===== 平台准入要求（客观政策）=====
    brand_registry_required BOOLEAN,           -- 是否必须品牌备案
    trademark_required BOOLEAN,                -- 是否必须有商标
    invoice_required BOOLEAN,                  -- 是否需要进货发票

    category_approval_needed BOOLEAN,          -- 该品类是否需要审批
    approval_requirements TEXT,                -- 审批要求说明

    -- ===== 保证金与费用（客观数据）=====
    deposit_amount DECIMAL(10,2),              -- 平台保证金（USD）
    monthly_subscription_fee DECIMAL(10,2),    -- 月费（如有）

    -- ===== 违规监测（历史统计）=====
    recent_policy_changes JSON,                -- 近12个月政策变化记录
    -- 如 [{"date": "2024-01", "change": "新增认证要求"}]

    violation_cases_count_12m INT,             -- 近12个月该品类违规案例数
    common_violation_reasons JSON,             -- 常见违规原因

    -- ===== 内容要求（客观规定）=====
    image_requirements TEXT,                   -- 图片要求，如 "白底图"
    video_requirements TEXT,                   -- 视频要求
    description_restrictions TEXT,             -- 描述限制，如 "禁止医疗宣称"

    -- 数据元信息
    data_collection_date DATE,
    data_source VARCHAR(100),                  -- 如 'platform_seller_center'
    policy_version VARCHAR(50),                -- 政策版本号

    FOREIGN KEY (combination_id) REFERENCES market_combinations(id),
    INDEX idx_combination (combination_id)
);
```

---

## 数据规模估算

```
组合数：20品类 × 25国家 × 15平台 = 7,500个理论组合
实际有效组合（考虑平台覆盖限制）：约 3,000个

表记录数：
- market_combinations: 7,500行（包含无效组合，标记为不可用）
- market_size_growth: 3,000行（仅有效组合）
- demand_trends: 3,000行
- competition_landscape: 3,000行
- pricing_cost: 3,000行
- operational_metrics: 3,000行
- compliance_requirements: 3,000行
- supply_chain_info: 3,000行
- platform_policies: 3,000行

总计：约 3万行基础数据
```

---

## 数据更新频率

| 表名 | 更新频率 | 理由 |
|------|----------|------|
| market_combinations | 每月 | 平台开站/品类政策变化较慢 |
| market_size_growth | 每周 | GMV、订单量变化需追踪 |
| demand_trends | 每天 | 搜索热度、社媒数据变化快 |
| competition_landscape | 每周 | 卖家数量、集中度变化 |
| pricing_cost | 每周 | 价格波动需监控 |
| operational_metrics | 每周 | 销售速度、评论数据 |
| compliance_requirements | 每月 | 政策、关税变化较慢 |
| supply_chain_info | 每月 | 供应链数据相对稳定 |
| platform_policies | 每周 | 平台政策可能快速变化 |

---

## 关键查询示例

### 查询1：获取某组合的完整市场数据

```sql
SELECT
    c.category_code,
    c.country_code,
    c.platform_code,

    -- 市场规模
    m.total_gmv_usd,
    m.gmv_growth_yoy,
    m.gmv_growth_mom,

    -- 需求趋势
    d.google_trends_index,
    d.platform_search_volume,
    d.seasonality_factor,

    -- 竞争
    comp.total_sellers,
    comp.active_sellers_30d,
    comp.top5_sellers_gmv_share,
    comp.new_sellers_survived_6m,
    comp.new_sellers_cohort_6m_ago,

    -- 价格
    p.price_median,
    p.price_avg,
    p.estimated_product_cost_avg,
    p.platform_commission_rate,
    p.avg_shipping_cost_intl,

    -- 运营
    o.avg_monthly_orders,
    o.avg_order_value,
    o.avg_return_rate,

    -- 合规
    r.required_certifications,
    r.total_certification_cost_min,
    r.import_tariff_rate

FROM market_combinations c
LEFT JOIN market_size_growth m ON c.id = m.combination_id
LEFT JOIN demand_trends d ON c.id = d.combination_id
LEFT JOIN competition_landscape comp ON c.id = comp.combination_id
LEFT JOIN pricing_cost p ON c.id = p.combination_id
LEFT JOIN operational_metrics o ON c.id = o.combination_id
LEFT JOIN compliance_requirements r ON c.id = r.combination_id

WHERE c.category_code = 'pet_supplies'
  AND c.country_code = 'US'
  AND c.platform_code = 'tiktok'
  AND c.is_available = TRUE;
```

### 查询2：品类视图 - 获取某品类在所有【国家×平台】的数据

```sql
SELECT
    c.country_code,
    c.platform_code,
    m.total_gmv_usd,
    m.gmv_growth_yoy,
    comp.top5_sellers_gmv_share,
    p.price_median,
    o.avg_return_rate

FROM market_combinations c
LEFT JOIN market_size_growth m ON c.id = m.combination_id
LEFT JOIN competition_landscape comp ON c.id = comp.combination_id
LEFT JOIN pricing_cost p ON c.id = p.combination_id
LEFT JOIN operational_metrics o ON c.id = o.combination_id

WHERE c.category_code = 'pet_supplies'
  AND c.is_available = TRUE

ORDER BY c.country_code, c.platform_code;
```

---

## 应用层计算示例

基于这些**纯市场数据**，在应用层计算评分：

```python
# 应用层计算示例

def calculate_market_attractiveness_score(market_data):
    """
    基于纯市场数据计算"市场吸引力"评分
    不存储评分，每次动态计算
    """

    # 从数据库读取原始数据
    gmv = market_data['total_gmv_usd']
    growth_yoy = market_data['gmv_growth_yoy']
    search_index = market_data['google_trends_index']
    seasonality = market_data['seasonality_factor']

    # 计算市场规模得分（基于GMV）
    if gmv >= 100_000_000:
        market_size_score = 100
    elif gmv >= 50_000_000:
        market_size_score = 80
    elif gmv >= 10_000_000:
        market_size_score = 60
    else:
        market_size_score = 40

    # 计算增长率得分
    if growth_yoy >= 100:
        growth_score = 100
    elif growth_yoy >= 50:
        growth_score = 80
    elif growth_yoy >= 20:
        growth_score = 60
    else:
        growth_score = 40

    # 计算需求趋势得分（直接使用Google Trends指数）
    demand_score = search_index

    # 计算季节性得分（低季节性=高分）
    if seasonality < 1.2:
        seasonality_score = 100
    elif seasonality < 1.5:
        seasonality_score = 80
    else:
        seasonality_score = 60

    # 加权求和
    ma_score = (
        0.35 * market_size_score +
        0.40 * growth_score +
        0.15 * demand_score +
        0.10 * seasonality_score
    )

    return round(ma_score, 1)


def calculate_new_seller_survival_rate(competition_data):
    """
    基于原始数据计算新卖家6个月存活率
    """
    cohort = competition_data['new_sellers_cohort_6m_ago']
    survived = competition_data['new_sellers_survived_6m']

    if cohort == 0:
        return None

    survival_rate = (survived / cohort) * 100
    return round(survival_rate, 2)


def calculate_competitive_feasibility_score(competition_data):
    """
    基于纯竞争数据计算"竞争可行性"评分
    """

    # 计算存活率
    survival_rate = calculate_new_seller_survival_rate(competition_data)

    # 读取CR5
    cr5 = competition_data['top5_sellers_gmv_share']

    # 读取价格竞争数据
    avg_discount = competition_data['avg_discount_depth']

    # 读取同质化数据
    title_similarity = competition_data['avg_title_similarity']

    # 转换为得分（应用层逻辑）
    survival_score = survival_rate if survival_rate else 50

    concentration_score = 100 - cr5  # CR5越低，得分越高

    price_war_score = 100 - avg_discount  # 折扣越低，得分越高

    differentiation_score = 100 - title_similarity  # 同质化越低，得分越高

    # 加权求和
    cf_score = (
        0.30 * survival_score +
        0.25 * concentration_score +
        0.20 * price_war_score +
        0.25 * differentiation_score
    )

    return round(cf_score, 1)
```

---

## 总结

### ✅ 这套设计的优势

1. **数据纯净性**：所有表只存储客观事实，不含主观评分
2. **可验证性**：每个数据都有来源（data_source字段）
3. **可追溯性**：有时间戳和数据采集日期
4. **灵活性**：算法可以随时调整，不影响数据库
5. **可扩展性**：新增维度只需加表/字段，不影响算法

### 🔄 数据流转

```
外部数据源（API/爬虫/第三方）
    ↓
写入 9张市场数据表（纯事实数据）
    ↓
应用层读取原始数据
    ↓
应用层计算评分（基于用户画像 + 权重配置）
    ↓
返回给前端展示（可选：缓存到Redis）
```

### 💡 关键原则

**数据库只存储"What"（事实），不存储"How"（评价）**

- ✅ 存储：GMV是$120M，增长率是180%
- ❌ 不存储：市场吸引力得分92分

**评分逻辑完全在应用层**，这样：
- 可以A/B测试不同算法
- 可以为不同用户应用不同权重
- 可以随时调整评分规则而不改数据库

你觉得这样的设计如何？
