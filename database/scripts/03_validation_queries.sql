-- 数据验证与查询脚本

-- 1. 基础统计
SELECT '=== 基础统计 ===' as info;

SELECT
    '总组合数' as metric,
    COUNT(*) as value
FROM market_combinations;

SELECT
    '有效组合数' as metric,
    COUNT(*) as value
FROM market_combinations
WHERE is_available = 1;

-- 2. 按平台统计有效组合数
SELECT '=== 按平台统计 ===' as info;

SELECT
    platform_code,
    COUNT(*) as combinations,
    COUNT(DISTINCT country_code) as countries,
    COUNT(DISTINCT category_code) as categories
FROM market_combinations
WHERE is_available = 1
GROUP BY platform_code
ORDER BY combinations DESC;

-- 3. 按国家统计有效组合数
SELECT '=== 按国家统计 ===' as info;

SELECT
    country_code,
    COUNT(*) as combinations,
    COUNT(DISTINCT platform_code) as platforms,
    COUNT(DISTINCT category_code) as categories
FROM market_combinations
WHERE is_available = 1
GROUP BY country_code
ORDER BY combinations DESC;

-- 4. 按品类统计有效组合数
SELECT '=== 按品类统计 ===' as info;

SELECT
    category_code,
    COUNT(*) as combinations,
    COUNT(DISTINCT country_code) as countries,
    COUNT(DISTINCT platform_code) as platforms
FROM market_combinations
WHERE is_available = 1
GROUP BY category_code
ORDER BY combinations DESC;

-- 5. GMV Top 20 市场组合
SELECT '=== GMV Top 20 ===' as info;

SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct,
    cl.total_sellers,
    ROUND(pc.price_median_usd, 2) as median_price
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
JOIN pricing_cost pc ON mc.id = pc.combination_id
WHERE mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
LIMIT 20;

-- 6. 高增长市场（增长率>100%）
SELECT '=== 高增长市场（YoY>100%）===' as info;

SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    cl.total_sellers
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
  AND msg.gmv_growth_yoy > 100
ORDER BY msg.gmv_growth_yoy DESC
LIMIT 20;

-- 7. 低竞争市场（卖家数<100）
SELECT '=== 低竞争市场（卖家<100）===' as info;

SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    cl.total_sellers,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    ROUND(cl.new_sellers_survived_6m * 100.0 / cl.new_sellers_cohort_6m_ago, 1) as survival_rate_pct
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
  AND cl.total_sellers < 100
  AND msg.total_gmv_usd > 1000000
ORDER BY msg.total_gmv_usd DESC
LIMIT 20;

-- 8. 高利润潜力市场（价格中位数>50，成本率<35%）
SELECT '=== 高利润潜力市场 ===' as info;

SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    ROUND(pc.price_median_usd, 2) as median_price,
    ROUND(pc.estimated_cogs_median_usd, 2) as cogs,
    ROUND((pc.price_median_usd - pc.estimated_cogs_median_usd) / pc.price_median_usd * 100, 1) as margin_pct,
    ROUND(msg.total_gmv_usd) as gmv_usd
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN pricing_cost pc ON mc.id = pc.combination_id
WHERE mc.is_available = 1
  AND pc.price_median_usd > 50
  AND pc.estimated_cogs_median_usd / pc.price_median_usd < 0.35
ORDER BY margin_pct DESC
LIMIT 20;

-- 9. 数据完整性检查
SELECT '=== 数据完整性检查 ===' as info;

SELECT
    'market_size_growth' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN total_gmv_usd IS NULL THEN 1 END) as null_gmv,
    COUNT(CASE WHEN gmv_growth_yoy IS NULL THEN 1 END) as null_growth
FROM market_size_growth;

SELECT
    'competition_landscape' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN total_sellers IS NULL THEN 1 END) as null_sellers,
    COUNT(CASE WHEN avg_rating IS NULL THEN 1 END) as null_rating
FROM competition_landscape;

SELECT
    'pricing_cost' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN price_median_usd IS NULL THEN 1 END) as null_price,
    COUNT(CASE WHEN estimated_cogs_median_usd IS NULL THEN 1 END) as null_cogs
FROM pricing_cost;

-- 10. 认证成本统计
SELECT '=== 认证要求统计 ===' as info;

SELECT
    mc.country_code,
    COUNT(*) as combinations,
    AVG(json_array_length(cr.required_certifications)) as avg_cert_count,
    COUNT(CASE WHEN cr.import_tariff_rate > 20 THEN 1 END) as high_tariff_count
FROM market_combinations mc
JOIN compliance_requirements cr ON mc.id = cr.combination_id
WHERE mc.is_available = 1
GROUP BY mc.country_code
ORDER BY avg_cert_count DESC;
