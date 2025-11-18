# 快速开始指南

## 5分钟上手数据库

### 1. 查看数据库统计

```bash
cd database
sqlite3 product_selection.db
```

```sql
-- 查看总组合数
SELECT COUNT(*) FROM market_combinations;

-- 查看有效组合数
SELECT COUNT(*) FROM market_combinations WHERE is_available = 1;

-- 查看各表记录数
SELECT 'market_size_growth' as table_name, COUNT(*) as records FROM market_size_growth
UNION ALL
SELECT 'competition_landscape', COUNT(*) FROM competition_landscape
UNION ALL
SELECT 'pricing_cost', COUNT(*) FROM pricing_cost;
```

### 2. 运行MCDA评分（Python）

```bash
cd database
python3 scripts/04_mcda_calculator.py
```

**输出示例：**
```
战略: explore
--------------------------------------------------------------------------------

1. home_living / US / temu
   总分: 91.8
   MA=100.0, CF=67.3, PP=98.3, RF=89.5, RC=82.1

2. kitchenware / US / temu
   总分: 90.8
   MA=94.0, CF=69.5, PP=98.5, RF=85.0, RC=96.1
...
```

### 3. 自定义查询示例

#### 查询高增长市场（增长率>100%）

```bash
sqlite3 product_selection.db << 'EOF'
.mode column
.headers on
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct,
    '$' || ROUND(msg.total_gmv_usd/1000000, 1) || 'M' as gmv
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
WHERE mc.is_available = 1
  AND msg.gmv_growth_yoy > 100
ORDER BY msg.gmv_growth_yoy DESC
LIMIT 20;
EOF
```

#### 查询低竞争高GMV市场

```bash
sqlite3 product_selection.db << 'EOF'
.mode column
.headers on
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    cl.total_sellers,
    '$' || ROUND(msg.total_gmv_usd/1000000, 1) || 'M' as gmv
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
  AND cl.total_sellers < 100
  AND msg.total_gmv_usd > 5000000
ORDER BY msg.total_gmv_usd DESC
LIMIT 20;
EOF
```

### 4. Python API使用

#### 基础查询

```python
import sqlite3
import json

# 连接数据库
conn = sqlite3.connect('product_selection.db')
cursor = conn.cursor()

# 查询某个组合的详细数据
cursor.execute('''
    SELECT
        mc.category_code,
        mc.country_code,
        mc.platform_code,
        msg.total_gmv_usd,
        msg.gmv_growth_yoy,
        cl.total_sellers,
        pc.price_median_usd
    FROM market_combinations mc
    JOIN market_size_growth msg ON mc.id = msg.combination_id
    JOIN competition_landscape cl ON mc.id = cl.combination_id
    JOIN pricing_cost pc ON mc.id = pc.combination_id
    WHERE mc.category_code = ?
      AND mc.country_code = ?
      AND mc.platform_code = ?
''', ('electronics', 'US', 'amazon'))

result = cursor.fetchone()
print(f"GMV: ${result[3]:,.0f}")
print(f"Growth: {result[4]:.1f}%")
print(f"Sellers: {result[5]}")
print(f"Median Price: ${result[6]:.2f}")

conn.close()
```

#### 使用MCDA计算器

```python
from scripts.mcda_calculator import MCDACalculator

# 初始化
calc = MCDACalculator('product_selection.db')
calc.connect()

# 定义用户画像
user_profile = {
    'budget_usd': 50000,              # 启动资金5万美元
    'experience_platforms': ['amazon'], # 有Amazon经验
    'experience_countries': ['US'],     # 熟悉美国市场
    'experience_categories': []         # 品类经验为空
}

# 获取Top 20机会（探索战略）
opportunities = calc.get_top_opportunities(
    strategy='explore',      # 战略: explore/new_market/new_platform/upgrade/expand_product
    user_profile=user_profile,
    limit=20
)

# 打印结果
for i, opp in enumerate(opportunities, 1):
    print(f"{i}. {opp['category']} / {opp['country']} / {opp['platform']}")
    print(f"   总分: {opp['total_score']}")
    print(f"   MA={opp['scores']['MA']}, CF={opp['scores']['CF']}, "
          f"PP={opp['scores']['PP']}, RF={opp['scores']['RF']}, RC={opp['scores']['RC']}\n")

# 单个组合评分
score = calc.calculate_opportunity_score(
    combination_id=1,
    strategy='explore',
    user_profile=user_profile
)
print(json.dumps(score, indent=2, ensure_ascii=False))

calc.close()
```

### 5. 常用查询模板

#### 按品类查询Top市场

```sql
SELECT
    mc.country_code,
    mc.platform_code,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
WHERE mc.category_code = 'electronics'  -- 替换为你的品类
  AND mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
LIMIT 10;
```

#### 按国家查询Top品类

```sql
SELECT
    mc.category_code,
    mc.platform_code,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
WHERE mc.country_code = 'US'  -- 替换为你的国家
  AND mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
LIMIT 10;
```

#### 按平台查询Top市场

```sql
SELECT
    mc.category_code,
    mc.country_code,
    ROUND(msg.total_gmv_usd) as gmv_usd,
    ROUND(msg.gmv_growth_yoy, 1) as growth_pct
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
WHERE mc.platform_code = 'amazon'  -- 替换为你的平台
  AND mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
LIMIT 10;
```

#### 高利润市场（毛利率>60%）

```sql
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    ROUND(pc.price_median_usd, 2) as price,
    ROUND((pc.price_median_usd - pc.estimated_cogs_median_usd) /
          pc.price_median_usd * 100, 1) as margin_pct,
    ROUND(msg.total_gmv_usd) as gmv_usd
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN pricing_cost pc ON mc.id = pc.combination_id
WHERE mc.is_available = 1
  AND (pc.price_median_usd - pc.estimated_cogs_median_usd) / pc.price_median_usd > 0.60
ORDER BY margin_pct DESC
LIMIT 20;
```

#### 新手友好市场（高存活率+低竞争）

```sql
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    cl.total_sellers,
    ROUND(cl.new_sellers_survived_6m * 100.0 / cl.new_sellers_cohort_6m_ago, 1) as survival_rate_pct,
    ROUND(msg.total_gmv_usd) as gmv_usd
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
  AND cl.total_sellers < 200
  AND cl.new_sellers_survived_6m * 1.0 / cl.new_sellers_cohort_6m_ago > 0.60
  AND msg.total_gmv_usd > 2000000
ORDER BY survival_rate_pct DESC, msg.total_gmv_usd DESC
LIMIT 20;
```

### 6. 数据导出

#### 导出CSV

```bash
sqlite3 -header -csv product_selection.db "
SELECT
    mc.category_code,
    mc.country_code,
    mc.platform_code,
    msg.total_gmv_usd,
    msg.gmv_growth_yoy,
    cl.total_sellers
FROM market_combinations mc
JOIN market_size_growth msg ON mc.id = msg.combination_id
JOIN competition_landscape cl ON mc.id = cl.combination_id
WHERE mc.is_available = 1
ORDER BY msg.total_gmv_usd DESC
" > top_markets.csv
```

#### 导出JSON（Python）

```python
import sqlite3
import json

conn = sqlite3.connect('product_selection.db')
conn.row_factory = sqlite3.Row

cursor = conn.cursor()
cursor.execute('''
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
    LIMIT 100
''')

results = [dict(row) for row in cursor.fetchall()]

with open('top_markets.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

conn.close()
print("✓ 已导出到 top_markets.json")
```

### 7. 数据更新

如需重新生成数据：

```bash
cd database

# 删除旧数据库
rm product_selection.db

# 重新生成
python3 scripts/02_generate_data.py
```

### 8. 数据验证

运行完整验证：

```bash
cd database
sqlite3 product_selection.db < scripts/03_validation_queries.sql
```

---

## 故障排除

### 问题1：找不到数据库文件

**解决方案：**
```bash
# 确认当前目录
pwd

# 应该在 database/ 目录下
cd /path/to/product-selection/database

# 检查文件是否存在
ls -lh product_selection.db
```

### 问题2：Python导入错误

**解决方案：**
```bash
# 确保在正确的目录
cd database

# 使用绝对导入
python3 -c "import sys; sys.path.append('.'); from scripts.mcda_calculator import MCDACalculator; print('OK')"
```

### 问题3：SQLite版本过低

**解决方案：**
```bash
# 检查版本
sqlite3 --version

# 如果版本 < 3.9.0，需要升级
# macOS: brew upgrade sqlite
# Ubuntu: sudo apt-get install sqlite3
```

---

## 更多帮助

- 完整文档: [README.md](README.md)
- 完成报告: [DATABASE_COMPLETION_REPORT.md](DATABASE_COMPLETION_REPORT.md)
- 数据库设计: [docs/reference/database-schema-market-data-only.md](../docs/reference/database-schema-market-data-only.md)
- MCDA算法: [docs/reference/mcda-algorithm-design.md](../docs/reference/mcda-algorithm-design.md)
