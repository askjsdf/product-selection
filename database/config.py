# -*- coding: utf-8 -*-
"""
数据库配置和基础数据定义
"""

# 20个一级品类
CATEGORIES = [
    'electronics', 'pet_supplies', 'home_living', 'sports_outdoor', 'beauty_personal',
    'mother_baby', 'fashion_accessories', 'toys_hobbies', 'smart_home', 'automotive',
    'garden_tools', 'office_stationery', 'health_wellness', 'kitchenware', 'lighting',
    'luggage_travel', 'arts_crafts', 'musical_instruments', 'party_supplies', 'safety_security'
]

# 6个国家
COUNTRIES = [
    'US',  # 北美 - 美国
    'UK',  # 欧洲 - 英国
    'JP',  # 东亚 - 日本
    'VN',  # 东南亚 - 越南
    'MX',  # 拉美 - 墨西哥
    'AE'   # 中东 - 阿联酋
]

# 4个平台
PLATFORMS = [
    'amazon',      # 全球最大电商平台
    'tiktok',      # 新兴社交电商
    'temu',        # 快速增长的跨境平台
    'aliexpress'   # 阿里巴巴国际站
]

# 平台覆盖矩阵（所有平台支持所有6个国家）
PLATFORM_COVERAGE = {
    'amazon': ['US', 'UK', 'JP', 'VN', 'MX', 'AE'],
    'tiktok': ['US', 'UK', 'JP', 'VN', 'MX', 'AE'],
    'temu': ['US', 'UK', 'JP', 'VN', 'MX', 'AE'],
    'aliexpress': ['US', 'UK', 'JP', 'VN', 'MX', 'AE']
}

# 品类在美国市场的基础GMV（美元）
CATEGORY_BASE_GMV_US = {
    'electronics': 800_000_000,
    'pet_supplies': 150_000_000,
    'home_living': 600_000_000,
    'sports_outdoor': 250_000_000,
    'beauty_personal': 400_000_000,
    'mother_baby': 300_000_000,
    'fashion_accessories': 500_000_000,
    'toys_hobbies': 200_000_000,
    'smart_home': 350_000_000,
    'automotive': 450_000_000,
    'garden_tools': 180_000_000,
    'office_stationery': 120_000_000,
    'health_wellness': 320_000_000,
    'kitchenware': 220_000_000,
    'lighting': 160_000_000,
    'luggage_travel': 190_000_000,
    'arts_crafts': 140_000_000,
    'musical_instruments': 90_000_000,
    'party_supplies': 110_000_000,
    'safety_security': 280_000_000
}

# 国家市场倍数（相对美国）
COUNTRY_MULTIPLIER = {
    'US': 1.0,   # 美国 - 基准市场
    'UK': 0.25,  # 英国 - 成熟市场
    'JP': 0.40,  # 日本 - 高价值市场
    'VN': 0.05,  # 越南 - 新兴市场
    'MX': 0.08,  # 墨西哥 - 增长市场
    'AE': 0.06   # 阿联酋 - 高端市场
}

# 平台市场份额
PLATFORM_SHARE = {
    'amazon': 0.35,      # 全球领先平台
    'tiktok': 0.12,      # 新兴社交电商
    'temu': 0.08,        # 快速增长平台
    'aliexpress': 0.15   # 跨境电商老牌
}

# 认证要求矩阵（部分示例，完整矩阵会在生成时动态添加）
CERTIFICATION_MATRIX = {
    ('US', 'electronics'): ['FCC', 'UL'],
    ('US', 'pet_supplies'): ['FDA'],
    ('US', 'toys_hobbies'): ['CPSC', 'ASTM F963'],
    ('UK', 'electronics'): ['CE', 'UKCA', 'RoHS'],
    ('DE', 'electronics'): ['CE', 'RoHS', 'WEEE'],
    ('FR', 'electronics'): ['CE', 'RoHS'],
    ('JP', 'electronics'): ['PSE', 'TELEC'],
    ('AU', 'electronics'): ['RCM', 'C-Tick'],
    ('BR', 'electronics'): ['ANATEL', 'INMETRO'],
    ('AE', 'electronics'): ['ESMA'],
}

# 认证成本范围（美元）
CERTIFICATION_COST = {
    'FCC': (4000, 6000),
    'UL': (5000, 8000),
    'FDA': (3000, 5000),
    'CPSC': (2000, 4000),
    'ASTM F963': (1500, 3000),
    'CE': (2000, 4000),
    'UKCA': (2000, 3500),
    'RoHS': (1000, 2000),
    'WEEE': (1500, 2500),
    'PSE': (3000, 5000),
    'TELEC': (2500, 4000),
    'RCM': (2000, 3500),
    'C-Tick': (1500, 2500),
    'ANATEL': (4000, 7000),
    'INMETRO': (3000, 6000),
    'ESMA': (2500, 4500),
}

# 关税税率矩阵（百分比）
TARIFF_MATRIX = {
    ('US', 'electronics'): 0,
    ('US', 'fashion_accessories'): 16.5,
    ('CA', 'electronics'): 0,
    ('UK', 'electronics'): 2.5,
    ('DE', 'electronics'): 3.7,
    ('JP', 'electronics'): 0,
    ('BR', 'electronics'): 60.0,  # 巴西关税很高
    ('AE', 'electronics'): 5.0,
    ('AU', 'electronics'): 5.0,
}

# 数据库配置
DB_CONFIG = {
    'database': 'product_selection.db',
    'type': 'sqlite'
}
