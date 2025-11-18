# 跨境电商选品平台 - 数据库文档

## 概述

本数据库包含**480个有效市场组合**的完整市场数据，覆盖：
- **20个品类**（一级类目）
- **6个国家**（美国、英国、日本、越南、墨西哥、阿联酋）
- **4个电商平台**（Amazon、TikTok、Temu、AliExpress）

数据库采用**纯市场数据存储**，所有评分计算在应用层完成，支持基于DSTE战略的MCDA多维度决策分析。

## 数据库结构

### 核心表 (9张)

#### 1. market_combinations - 市场组合基础表
存储所有品类×国家×平台的组合（480条有效组合）

**关键字段：**
- `category_code` - 品类代码（20个品类）
- `country_code` - 国家代码（6个国家：US/UK/JP/VN/MX/AE）
- `platform_code` - 平台代码（4个平台：amazon/tiktok/temu/aliexpress）
- `is_available` - 该组合是否可用（所有组合均可用）

#### 2. market_size_growth - 市场规模与增长数据
**原始数据字段：**
- `total_gmv_usd` - 总GMV（美元）
- `gmv_growth_yoy` - GMV同比增长率（%）
- `total_orders` - 总订单数
- `avg_order_value_usd` - 平均客单价
- `gmv_history_12m` - 12个月GMV历史（JSON数组）
- `search_volume_monthly` - 月搜索量
- `search_volume_growth_yoy` - 搜索量增长率

#### 3. demand_trends - 需求趋势数据
**原始数据字段：**
- `trend_keywords` - 趋势关键词（JSON数组）
- `keyword_search_volumes` - 关键词搜索量（JSON对象）
- `seasonal_pattern` - 季节性模式（high_season/low_season/stable）
- `peak_months` - 旺季月份（JSON数组）
- `consumer_demographics` - 消费者人口统计（JSON对象）
- `buying_motivation_tags` - 购买动机标签（JSON数组）
- `repurchase_cycle_days` - 复购周期（天）

#### 4. competition_landscape - 竞争格局数据
**原始数据字段：**
- `total_sellers` - 总卖家数
- `new_sellers_last_6m` - 最近6个月新增卖家
- `new_sellers_cohort_6m_ago` - 6个月前新增的一批卖家数
- `new_sellers_survived_6m` - 上述卖家中存活数
- `top5_sellers_gmv_share` - Top5卖家GMV占比（CR5）
- `top10_sellers_gmv_share` - Top10卖家GMV占比
- `avg_seller_gmv_usd` - 平均每卖家GMV
- `median_seller_gmv_usd` - 中位数卖家GMV
- `avg_discount_depth` - 平均折扣深度（%）
- `promotion_frequency_pct` - 促销频率（%）
- `avg_review_count` - 平均评价数
- `avg_rating` - 平均评分

#### 5. pricing_cost - 定价与成本数据
**原始数据字段：**
- `price_p10_usd` - 价格P10分位数
- `price_p25_usd` - 价格P25分位数
- `price_median_usd` - 价格中位数
- `price_p75_usd` - 价格P75分位数
- `price_p90_usd` - 价格P90分位数
- `estimated_cogs_median_usd` - 估算成本中位数
- `typical_shipping_cost_usd` - 典型物流成本
- `avg_return_rate` - 平均退货率（%）
- `return_shipping_cost_usd` - 退货物流成本

#### 6. operational_metrics - 运营指标数据
**原始数据字段：**
- `avg_listing_conversion_rate` - 平均转化率（%）
- `avg_click_through_rate` - 平均点击率（%）
- `avg_ad_cpc_usd` - 平均广告CPC
- `avg_ad_acos` - 平均广告成本占比（%）
- `typical_fba_fee_usd` - FBA费用（如适用）
- `typical_fbm_shipping_days` - FBM配送天数
- `avg_customer_service_contacts_per_100_orders` - 每百单客服联系数
- `avg_refund_rate` - 平均退款率（%）

#### 7. compliance_requirements - 合规要求数据
**原始数据字段：**
- `required_certifications` - 必需认证列表（JSON数组）
- `certification_costs_usd` - 认证成本（JSON对象）
- `certification_timeline_days` - 认证时间线（JSON对象）
- `import_tariff_rate` - 进口关税税率（%）
- `vat_rate` - 增值税税率（%）
- `product_restrictions` - 产品限制（JSON数组）
- `labeling_requirements` - 标签要求（JSON数组）

#### 8. supply_chain_info - 供应链信息数据
**原始数据字段：**
- `china_supplier_count` - 中国供应商数量
- `avg_moq` - 平均最小起订量
- `typical_production_days` - 典型生产周期（天）
- `typical_shipping_days_sea` - 海运时间（天）
- `typical_shipping_days_air` - 空运时间（天）
- `sea_freight_cost_per_cbm_usd` - 海运费用（每立方米）
- `air_freight_cost_per_kg_usd` - 空运费用（每公斤）
- `supplier_concentration_top3_pct` - Top3供应商集中度（%）

#### 9. platform_policies - 平台政策数据
**原始数据字段：**
- `commission_rate` - 平台佣金率（%）
- `category_restrictions` - 品类限制（JSON数组）
- `min_review_count_for_ads` - 广告最低评价数要求
- `min_rating_for_ads` - 广告最低评分要求
- `return_window_days` - 退货窗口期（天）
- `platform_return_policy` - 平台退货政策
- `prohibited_claims` - 禁止宣称（JSON数组）

## 数据统计

```
总组合数: 480 (20品类 × 6国家 × 4平台)
有效组合数: 480 (所有组合均可用)
数据表数: 9张
总数据行: ~4,320行 (9表 × 480组合)
```

### 按维度分布

**平台分布（均等）：**
- Amazon: 120个组合 (6国 × 20品类)
- TikTok: 120个组合 (6国 × 20品类)
- Temu: 120个组合 (6国 × 20品类)
- AliExpress: 120个组合 (6国 × 20品类)

**国家分布（均等）：**
- 美国(US): 80个组合 (20品类 × 4平台)
- 英国(UK): 80个组合 (20品类 × 4平台)
- 日本(JP): 80个组合 (20品类 × 4平台)
- 越南(VN): 80个组合 (20品类 × 4平台)
- 墨西哥(MX): 80个组合 (20品类 × 4平台)
- 阿联酋(AE): 80个组合 (20品类 × 4平台)

**品类分布（均等）：**
- 每个品类: 24个组合 (6国 × 4平台)

## 快速开始

### 1. 初始化数据库（已完成）

```bash
cd database
python3 scripts/02_generate_data.py
```

### 2. 运行验证查询

```bash
sqlite3 product_selection.db < scripts/03_validation_queries.sql
```

### 3. 使用MCDA计算器

```python
# 直接运行测试
python3 scripts/04_mcda_calculator.py

# 或在代码中使用
import sys
sys.path.insert(0, 'scripts')
from mcda_calculator import MCDACalculator

# 连接数据库
calc = MCDACalculator('product_selection.db')
calc.connect()

# 定义用户画像
user_profile = {
    'budget_usd': 100000,
    'experience_platforms': ['amazon'],
    'experience_countries': ['US'],
    'experience_categories': ['electronics']
}

# 获取Top机会（探索战略）
opportunities = calc.get_top_opportunities(
    strategy='explore',
    user_profile=user_profile,
    limit=10
)

# 打印结果
for opp in opportunities:
    print(f"{opp['category']} / {opp['country']} / {opp['platform']}")
    print(f"总分: {opp['total_score']:.1f}")
    print(f"MA={opp['scores']['MA']:.1f}, CF={opp['scores']['CF']:.1f}, "
          f"PP={opp['scores']['PP']:.1f}, RF={opp['scores']['RF']:.1f}, RC={opp['scores']['RC']:.1f}")
```

## MCDA评分算法

### 5大评分维度

#### MA - Market Attractiveness (市场吸引力)
**数据来源：** market_size_growth
- 市场规模（GMV）
- 增长率（YoY）
- 搜索热度

**计算逻辑：**
```python
ma_score = size_score * 0.40 + growth_score * 0.40 + search_score * 0.20
```

#### CF - Competitive Feasibility (竞争可行性)
**数据来源：** competition_landscape
- 竞争密度（卖家数/GMV）
- 新手存活率
- 市场集中度（CR5）
- 价格战程度（折扣深度）

**计算逻辑：**
```python
cf_score = density_score * 0.30 + survival_score * 0.30 +
           concentration_score * 0.25 + price_war_score * 0.15
```

#### PP - Profit Potential (利润潜力)
**数据来源：** pricing_cost, operational_metrics, platform_policies
- 毛利率
- 客单价
- 运营成本（广告+佣金）
- 转化率

**计算逻辑：**
```python
pp_score = margin_score * 0.40 + price_score * 0.25 +
           cost_score * 0.20 + conv_score * 0.15
```

#### RF - Resource Fit (资源匹配度) - 个性化
**数据来源：** pricing_cost, compliance_requirements, supply_chain_info + 用户画像
- 启动资金要求
- 经验匹配
- 认证能力
- 时间周期

**计算逻辑：**
```python
rf_score = capital_score * 0.30 + exp_score * 0.30 +
           cert_score * 0.25 + time_score * 0.15
```

#### RC - Risk Control (风险控制)
**数据来源：** pricing_cost, compliance_requirements, competition_landscape
- 退货风险
- 关税风险
- 市场稳定性
- 产品评分

**计算逻辑：**
```python
rc_score = return_score * 0.30 + tariff_score * 0.30 +
           stability_score * 0.25 + rating_score * 0.15
```

### DSTE战略权重矩阵

| 战略 | MA | CF | PP | RF | RC |
|------|----|----|----|----|-----|
| **拓展产品线** (expand_product) | 0.20 | 0.25 | 0.25 | 0.25 | 0.05 |
| **开拓新市场** (new_market) | 0.35 | 0.20 | 0.20 | 0.15 | 0.10 |
| **进入新平台** (new_platform) | 0.30 | 0.25 | 0.20 | 0.15 | 0.10 |
| **品类升级** (upgrade) | 0.20 | 0.25 | 0.35 | 0.15 | 0.05 |
| **探索机会** (explore) | 0.40 | 0.15 | 0.25 | 0.10 | 0.10 |

**总分计算：**
```python
total_score = MA * w_MA + CF * w_CF + PP * w_PP + RF * w_RF + RC * w_RC
```

## 常用查询示例

### 查询Top GMV市场

```sql
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    msg.total_gmv_usd,
    msg.gmv_growth_yoy
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
WHERE mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
LIMIT 20;
```

### 查询高增长低竞争市场

```sql
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    msg.gmv_growth_yoy as growth,
    cl.total_sellers,
    msg.total_gmv_usd
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
  AND msg.gmv_growth_yoy > 80
  AND cl.total_sellers < 150
  AND msg.total_gmv_usd > 5000000
ORDER BY msg.gmv_growth_yoy DESC;
```

### 查询高利润潜力市场

```sql
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    pc.price_median_usd,
    ROUND((pc.price_median_usd - pc.estimated_cogs_median_usd) /
          pc.price_median_usd * 100, 1) as margin_pct,
    msg.total_gmv_usd
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN pricing_cost pc ON mc.id = pc.combination_id
WHERE mc.is_available = 1
  AND pc.price_median_usd > 40
  AND (pc.price_median_usd - pc.estimated_cogs_median_usd) / pc.price_median_usd > 0.60
ORDER BY margin_pct DESC
LIMIT 20;
```

## 数据更新

数据采集日期记录在各表的 `data_collection_date` 字段中。建议：
- 市场规模数据：每月更新
- 竞争数据：每2周更新
- 定价数据：每周更新
- 合规政策：有变动时更新

## 技术细节

**数据库类型：** SQLite 3
**字符编码：** UTF-8
**JSON字段：** 使用SQLite的JSON支持，可用 `json_extract()` 查询
**索引：** 已为所有外键和常用查询字段建立索引

## 文件结构

```
database/
├── product_selection.db          # SQLite数据库文件
├── config.py                     # 配置文件（品类/国家/平台定义）
├── README.md                     # 本文档
└── scripts/
    ├── 01_create_schema.sql      # 建表SQL
    ├── 02_generate_data.py       # 数据生成脚本
    ├── 03_validation_queries.sql # 验证查询
    └── 04_mcda_calculator.py     # MCDA评分计算器
```

## 注意事项

1. **数据为模拟数据**：所有数据基于常识和行业知识模拟生成，仅用于系统开发和演示
2. **数据一致性**：生成时已保证相关字段的逻辑一致性（如GMV = 订单数 × 客单价）
3. **平台覆盖**：不是所有平台都覆盖所有国家，`is_available = 0` 的组合没有详细数据
4. **个性化评分**：RF维度需要用户画像参数，不同用户对同一市场的评分不同

## 许可与版权

本数据库为AI选品平台项目的一部分，所有数据为模拟数据。
