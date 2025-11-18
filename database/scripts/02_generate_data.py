# -*- coding: utf-8 -*-
"""
数据生成脚本 - 生成所有模拟市场数据
"""

import sqlite3
import json
import random
from datetime import datetime, timedelta
from decimal import Decimal
import sys
import os

# 添加父目录到路径以导入config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import *


class DataGenerator:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None
        self.cursor = None
        self.combination_ids = []

    def connect(self):
        """连接数据库"""
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()
        print(f"✓ 已连接到数据库: {self.db_path}")

    def close(self):
        """关闭数据库连接"""
        if self.conn:
            self.conn.close()
            print("✓ 数据库连接已关闭")

    def create_schema(self):
        """创建数据库表结构"""
        schema_file = os.path.join(os.path.dirname(__file__), '01_create_schema.sql')
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()

        # 执行所有建表语句
        self.cursor.executescript(schema_sql)
        self.conn.commit()
        print("✓ 数据库表结构创建完成")

    def generate_market_combinations(self):
        """
        生成市场组合数据
        20品类 × 25国家 × 15平台 = 7,500理论组合
        实际约3,000个有效组合（基于平台覆盖）
        """
        print("\n开始生成 market_combinations 数据...")
        combinations = []

        for category in CATEGORIES:
            for country in COUNTRIES:
                for platform in PLATFORMS:
                    # 检查平台是否覆盖该国家
                    is_available = country in PLATFORM_COVERAGE.get(platform, [])

                    combinations.append((
                        category,
                        country,
                        platform,
                        is_available
                    ))

        # 批量插入
        self.cursor.executemany('''
            INSERT INTO market_combinations
            (category_code, country_code, platform_code, is_available)
            VALUES (?, ?, ?, ?)
        ''', combinations)
        self.conn.commit()

        # 获取所有有效组合的ID
        self.cursor.execute('''
            SELECT id, category_code, country_code, platform_code
            FROM market_combinations
            WHERE is_available = 1
        ''')
        self.combination_ids = self.cursor.fetchall()

        total = len(combinations)
        available = len(self.combination_ids)
        print(f"✓ 生成 {total} 个组合 ({available} 个有效, {total - available} 个不可用)")

    def generate_market_size_growth(self):
        """生成市场规模与增长数据"""
        print("\n开始生成 market_size_growth 数据...")
        data = []

        for comb_id, category, country, platform in self.combination_ids:
            # 计算GMV基数
            base_gmv = CATEGORY_BASE_GMV_US.get(category, 100_000_000)
            country_mult = COUNTRY_MULTIPLIER.get(country, 0.05)
            platform_share = PLATFORM_SHARE.get(platform, 0.10)

            # 特殊调整：东南亚平台在东南亚的份额更高
            if platform in ['shopee', 'lazada', 'tokopedia'] and country in ['SG', 'MY', 'TH', 'VN', 'PH', 'ID', 'TW']:
                platform_share *= 1.5
            # 中东平台在中东的份额更高
            elif platform in ['noon', 'namshi'] and country in ['AE', 'SA', 'EG']:
                platform_share *= 1.3
            # 拉美平台在拉美的份额更高
            elif platform in ['mercadolibre'] and country in ['BR', 'MX', 'CL']:
                platform_share *= 1.2

            total_gmv = base_gmv * country_mult * platform_share * random.uniform(0.7, 1.3)

            # GMV增长率：TikTok等新平台增长更快
            if platform in ['tiktok', 'temu']:
                gmv_growth = random.uniform(150, 250)
            elif platform in ['amazon', 'ebay']:
                gmv_growth = random.uniform(15, 35)
            else:
                gmv_growth = random.uniform(40, 80)

            # 计算订单数和客单价
            avg_order_value = random.uniform(15, 120)
            total_orders = int(total_gmv / avg_order_value)
            orders_growth = gmv_growth * random.uniform(0.9, 1.1)

            # 生成12个月GMV历史数据
            monthly_gmv = []
            base_monthly = total_gmv / 12
            for month in range(12):
                # 添加季节性波动
                seasonal_factor = 1.0
                if month in [10, 11]:  # 11、12月（黑五、圣诞）
                    seasonal_factor = 1.5
                elif month in [5, 6]:  # 6、7月（夏季）
                    seasonal_factor = 1.2

                monthly_gmv.append(round(base_monthly * seasonal_factor * random.uniform(0.9, 1.1), 2))

            # 搜索量
            search_volume = int(total_orders * random.uniform(15, 40))  # 转化率2-6%
            search_growth = gmv_growth * random.uniform(0.8, 1.2)

            data.append((
                comb_id,
                round(total_gmv, 2),
                round(gmv_growth, 2),
                total_orders,
                round(orders_growth, 2),
                round(avg_order_value, 2),
                json.dumps(monthly_gmv),
                search_volume,
                round(search_growth, 2),
                'simulated_data',
                (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            ))

        # 批量插入
        self.cursor.executemany('''
            INSERT INTO market_size_growth
            (combination_id, total_gmv_usd, gmv_growth_yoy, total_orders,
             orders_growth_yoy, avg_order_value_usd, gmv_history_12m,
             search_volume_monthly, search_volume_growth_yoy, data_source, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 market_size_growth 记录")

    def generate_demand_trends(self):
        """生成需求趋势数据"""
        print("\n开始生成 demand_trends 数据...")
        data = []

        # 品类相关关键词库
        category_keywords = {
            'electronics': ['wireless', 'bluetooth', 'USB-C', 'fast charging', '4K', 'smart', 'portable'],
            'pet_supplies': ['automatic', 'interactive', 'orthopedic', 'eco-friendly', 'washable', 'durable'],
            'home_living': ['minimalist', 'space-saving', 'multi-functional', 'modern', 'storage'],
            'sports_outdoor': ['waterproof', 'lightweight', 'breathable', 'UV protection', 'portable'],
            'beauty_personal': ['organic', 'cruelty-free', 'anti-aging', 'moisturizing', 'natural'],
            # ... 其他品类会使用默认关键词
        }

        seasonal_patterns = ['high_season', 'low_season', 'stable']

        for comb_id, category, country, platform in self.combination_ids:
            # 选择关键词
            keywords_base = category_keywords.get(category, ['quality', 'affordable', 'popular', 'best-seller'])
            keywords = random.sample(keywords_base, min(4, len(keywords_base)))

            # 生成关键词搜索量
            keyword_volumes = {}
            for kw in keywords:
                keyword_volumes[kw] = random.randint(5000, 150000)

            # 季节性模式
            seasonal = random.choice(seasonal_patterns)
            peak_months = []
            if seasonal == 'high_season':
                peak_months = [10, 11, 12]  # Q4购物季
            elif category in ['sports_outdoor']:
                peak_months = [5, 6, 7, 8]  # 夏季
            elif category in ['mother_baby']:
                peak_months = [5, 11]  # 母亲节、黑五

            # 消费者人口统计
            demographics = {
                'age_18_24': random.randint(10, 25),
                'age_25_34': random.randint(25, 40),
                'age_35_44': random.randint(20, 35),
                'age_45_54': random.randint(10, 20),
                'age_55_plus': random.randint(5, 15)
            }
            # 确保总和为100
            total = sum(demographics.values())
            demographics = {k: round(v / total * 100, 1) for k, v in demographics.items()}

            # 购买动机
            motivations = random.sample(['gift', 'daily_use', 'upgrade', 'replacement', 'trial'],
                                       random.randint(2, 4))

            # 复购周期（天）
            repurchase_cycles = {
                'beauty_personal': random.randint(30, 90),
                'pet_supplies': random.randint(20, 60),
                'mother_baby': random.randint(15, 45),
                'office_stationery': random.randint(60, 180),
            }
            repurchase_cycle = repurchase_cycles.get(category, random.randint(90, 365))

            data.append((
                comb_id,
                json.dumps(keywords),
                json.dumps(keyword_volumes),
                seasonal,
                json.dumps(peak_months) if peak_months else None,
                json.dumps(demographics),
                json.dumps(motivations),
                repurchase_cycle,
                (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO demand_trends
            (combination_id, trend_keywords, keyword_search_volumes, seasonal_pattern,
             peak_months, consumer_demographics, buying_motivation_tags, repurchase_cycle_days,
             data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 demand_trends 记录")

    def generate_competition_landscape(self):
        """生成竞争格局数据"""
        print("\n开始生成 competition_landscape 数据...")
        data = []

        for comb_id, category, country, platform in self.combination_ids:
            # 根据市场规模估算卖家数量
            # 假设平均每个卖家GMV在10万-50万美元
            self.cursor.execute('''
                SELECT total_gmv_usd FROM market_size_growth WHERE combination_id = ?
            ''', (comb_id,))
            gmv_result = self.cursor.fetchone()
            total_gmv = gmv_result[0] if gmv_result else 1000000

            avg_seller_gmv = random.uniform(100000, 500000)
            total_sellers = max(int(total_gmv / avg_seller_gmv), 50)

            # 新增卖家
            new_sellers_last_6m = int(total_sellers * random.uniform(0.10, 0.25))
            new_sellers_cohort_6m_ago = int(total_sellers * random.uniform(0.08, 0.20))

            # 存活率：激进差异化 - 制造更多极端情况
            if platform in ['amazon']:
                survival_rate = random.uniform(0.30, 0.60)  # Amazon竞争更激烈
            elif platform in ['tiktok', 'temu']:
                survival_rate = random.uniform(0.60, 0.90)  # 新平台机会更多
            else:
                survival_rate = random.uniform(0.40, 0.70)

            new_sellers_survived = int(new_sellers_cohort_6m_ago * survival_rate)

            # 市场集中度 - 激进差异化，制造极端值
            if total_sellers < 200:
                top5_share = random.uniform(60, 90)  # 小市场极度集中
                top10_share = random.uniform(75, 95)
            else:
                top5_share = random.uniform(10, 55)  # 大市场可能很分散
                top10_share = random.uniform(20, 70)

            # 卖家GMV分布
            median_seller_gmv = avg_seller_gmv * random.uniform(0.4, 0.7)

            # 价格竞争指标 - 激进差异化
            # 让折扣深度有明显的平台和市场差异
            if platform in ['amazon'] and total_sellers > 300:
                avg_discount = random.uniform(35, 55)  # 成熟平台价格战激烈
            elif platform in ['tiktok', 'temu']:
                avg_discount = random.uniform(5, 30)  # 新平台价格战较少
            else:
                avg_discount = random.uniform(15, 45)

            promotion_freq = random.uniform(40, 80)

            # 评价指标 - 扩大评分差异
            avg_review_count = int(random.uniform(50, 500) * (total_gmv / 1000000))
            avg_rating = random.uniform(3.5, 4.8)  # 从4.0-4.7扩大到3.5-4.8

            data.append((
                comb_id,
                total_sellers,
                new_sellers_last_6m,
                new_sellers_cohort_6m_ago,
                new_sellers_survived,
                round(top5_share, 2),
                round(top10_share, 2),
                round(avg_seller_gmv, 2),
                round(median_seller_gmv, 2),
                round(avg_discount, 2),
                round(promotion_freq, 2),
                avg_review_count,
                round(avg_rating, 2),
                (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO competition_landscape
            (combination_id, total_sellers, new_sellers_last_6m, new_sellers_cohort_6m_ago,
             new_sellers_survived_6m, top5_sellers_gmv_share, top10_sellers_gmv_share,
             avg_seller_gmv_usd, median_seller_gmv_usd, avg_discount_depth, promotion_frequency_pct,
             avg_review_count, avg_rating, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 competition_landscape 记录")

    def generate_pricing_cost(self):
        """生成定价与成本数据"""
        print("\n开始生成 pricing_cost 数据...")
        data = []

        # 品类价格区间
        category_price_ranges = {
            'electronics': (20, 200),
            'pet_supplies': (10, 80),
            'home_living': (15, 120),
            'sports_outdoor': (15, 150),
            'beauty_personal': (8, 60),
            'mother_baby': (12, 100),
            'fashion_accessories': (10, 80),
            'toys_hobbies': (8, 50),
            'smart_home': (25, 180),
            'automotive': (15, 150),
            'garden_tools': (20, 120),
            'office_stationery': (5, 40),
            'health_wellness': (15, 80),
            'kitchenware': (12, 90),
            'lighting': (15, 100),
            'luggage_travel': (30, 200),
            'arts_crafts': (8, 60),
            'musical_instruments': (30, 300),
            'party_supplies': (5, 40),
            'safety_security': (20, 150)
        }

        for comb_id, category, country, platform in self.combination_ids:
            # 价格区间
            price_range = category_price_ranges.get(category, (10, 100))
            price_median = random.uniform(price_range[0], price_range[1])

            price_p10 = price_median * random.uniform(0.4, 0.6)
            price_p25 = price_median * random.uniform(0.7, 0.85)
            price_p75 = price_median * random.uniform(1.15, 1.35)
            price_p90 = price_median * random.uniform(1.5, 2.0)

            # COGS（成本）：激进差异化 - 制造极端毛利率
            # 扩大成本率范围到20%-75%，让毛利率从25%-80%
            if category in ['electronics', 'smart_home']:
                cogs_rate = random.uniform(0.55, 0.75)  # 电子产品毛利很低 (25-45%)
            elif category in ['fashion_accessories', 'beauty_personal']:
                cogs_rate = random.uniform(0.20, 0.40)  # 时尚美妆毛利很高 (60-80%)
            elif category in ['toys_hobbies', 'party_supplies']:
                cogs_rate = random.uniform(0.25, 0.45)  # 玩具派对毛利高 (55-75%)
            elif category in ['home_living', 'kitchenware']:
                cogs_rate = random.uniform(0.40, 0.60)  # 家居用品中等 (40-60%)
            elif category in ['automotive', 'safety_security']:
                cogs_rate = random.uniform(0.50, 0.70)  # 汽车安防毛利低 (30-50%)
            else:
                cogs_rate = random.uniform(0.35, 0.65)  # 其他品类 (35-65%)

            cogs_median = price_median * cogs_rate

            # 物流成本
            if country in ['US', 'CA', 'UK', 'DE', 'FR']:
                shipping_cost = random.uniform(3, 8)
            elif country in ['AU', 'BR']:
                shipping_cost = random.uniform(8, 15)
            else:
                shipping_cost = random.uniform(4, 10)

            # 退货率：扩大范围以增加区分度
            if category in ['fashion_accessories', 'beauty_personal']:
                return_rate = random.uniform(10, 25)  # 时尚美妆退货率高
            elif category in ['electronics', 'smart_home']:
                return_rate = random.uniform(6, 18)  # 电子产品中等
            elif category in ['toys_hobbies', 'party_supplies']:
                return_rate = random.uniform(3, 12)  # 玩具派对用品较低
            else:
                return_rate = random.uniform(4, 15)  # 其他品类

            return_shipping_cost = shipping_cost * random.uniform(1.0, 1.3)

            data.append((
                comb_id,
                round(price_p10, 2),
                round(price_p25, 2),
                round(price_median, 2),
                round(price_p75, 2),
                round(price_p90, 2),
                round(cogs_median, 2),
                round(shipping_cost, 2),
                round(return_rate, 2),
                round(return_shipping_cost, 2),
                (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO pricing_cost
            (combination_id, price_p10_usd, price_p25_usd, price_median_usd, price_p75_usd,
             price_p90_usd, estimated_cogs_median_usd, typical_shipping_cost_usd,
             avg_return_rate, return_shipping_cost_usd, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 pricing_cost 记录")

    def generate_operational_metrics(self):
        """生成运营指标数据"""
        print("\n开始生成 operational_metrics 数据...")
        data = []

        for comb_id, category, country, platform in self.combination_ids:
            # 转化率：不同平台差异较大
            if platform in ['amazon']:
                conversion_rate = random.uniform(10, 18)
            elif platform in ['tiktok']:
                conversion_rate = random.uniform(5, 12)
            else:
                conversion_rate = random.uniform(6, 14)

            # CTR点击率
            ctr = random.uniform(0.5, 3.5)

            # 广告指标
            cpc = random.uniform(0.20, 2.50)
            acos = random.uniform(20, 45)  # 广告成本占销售额比例

            # FBA费用（仅Amazon等平台）
            fba_fee = None
            if platform in ['amazon']:
                fba_fee = random.uniform(3, 12)

            # FBM配送时间
            if country in ['US', 'UK', 'DE']:
                fbm_days = random.randint(3, 7)
            elif country in ['BR', 'CL', 'EG']:
                fbm_days = random.randint(10, 20)
            else:
                fbm_days = random.randint(5, 12)

            # 客服联系率
            cs_contacts = random.randint(2, 15)

            # 退款率
            refund_rate = random.uniform(1, 8)

            data.append((
                comb_id,
                round(conversion_rate, 2),
                round(ctr, 2),
                round(cpc, 2),
                round(acos, 2),
                round(fba_fee, 2) if fba_fee else None,
                fbm_days,
                cs_contacts,
                round(refund_rate, 2),
                (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO operational_metrics
            (combination_id, avg_listing_conversion_rate, avg_click_through_rate, avg_ad_cpc_usd,
             avg_ad_acos, typical_fba_fee_usd, typical_fbm_shipping_days,
             avg_customer_service_contacts_per_100_orders, avg_refund_rate, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 operational_metrics 记录")

    def generate_compliance_requirements(self):
        """生成合规要求数据"""
        print("\n开始生成 compliance_requirements 数据...")
        data = []

        # 扩展认证矩阵
        cert_matrix_extended = CERTIFICATION_MATRIX.copy()

        # 自动生成更多认证组合
        for country in COUNTRIES:
            for category in CATEGORIES:
                if (country, category) not in cert_matrix_extended:
                    certs = []

                    # 欧盟国家
                    if country in ['UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL']:
                        if category in ['electronics', 'smart_home', 'lighting']:
                            certs = ['CE', 'RoHS']
                            if country == 'UK':
                                certs.append('UKCA')
                        elif category in ['toys_hobbies']:
                            certs = ['CE', 'EN71']
                        elif category in ['beauty_personal', 'health_wellness']:
                            certs = ['CPNP']

                    # 美国
                    elif country == 'US':
                        if category in ['electronics', 'smart_home']:
                            certs = ['FCC']
                        elif category in ['toys_hobbies']:
                            certs = ['CPSC', 'ASTM F963']
                        elif category in ['beauty_personal', 'health_wellness']:
                            certs = ['FDA']

                    # 日本
                    elif country == 'JP':
                        if category in ['electronics', 'smart_home']:
                            certs = ['PSE', 'TELEC']

                    # 巴西
                    elif country == 'BR':
                        if category in ['electronics', 'smart_home']:
                            certs = ['ANATEL', 'INMETRO']

                    # 中东
                    elif country in ['AE', 'SA']:
                        if category in ['electronics', 'smart_home']:
                            certs = ['ESMA']

                    cert_matrix_extended[(country, category)] = certs

        # 扩展关税矩阵
        tariff_matrix_extended = TARIFF_MATRIX.copy()

        for comb_id, category, country, platform in self.combination_ids:
            # 获取认证要求
            certifications = cert_matrix_extended.get((country, category), [])

            # 计算认证成本和时间
            cert_costs = {}
            cert_timeline = {}
            for cert in certifications:
                cost_range = CERTIFICATION_COST.get(cert, (2000, 5000))
                cert_costs[cert] = random.randint(cost_range[0], cost_range[1])
                cert_timeline[cert] = random.randint(30, 90)

            # 关税税率
            tariff_key = (country, category)
            if tariff_key in tariff_matrix_extended:
                tariff_rate = tariff_matrix_extended[tariff_key]
            else:
                # 默认关税
                if country in ['US', 'CA', 'JP']:
                    tariff_rate = random.uniform(0, 5)
                elif country in ['UK', 'DE', 'FR', 'IT', 'ES', 'NL']:
                    tariff_rate = random.uniform(2, 8)
                elif country in ['BR', 'CL']:
                    tariff_rate = random.uniform(30, 60)
                elif country in ['AE', 'SA', 'EG']:
                    tariff_rate = random.uniform(5, 15)
                else:
                    tariff_rate = random.uniform(5, 20)

            # VAT税率
            vat_rates = {
                'UK': 20.0, 'DE': 19.0, 'FR': 20.0, 'IT': 22.0, 'ES': 21.0, 'NL': 21.0, 'PL': 23.0,
                'AE': 5.0, 'SA': 15.0, 'EG': 14.0,
                'BR': 17.0, 'CL': 19.0,
                'AU': 10.0
            }
            vat_rate = vat_rates.get(country, 0)

            # 产品限制
            restrictions = []
            if category in ['electronics', 'smart_home'] and 'battery' in category:
                restrictions.append('battery_capacity_limit')
            if category in ['beauty_personal', 'health_wellness']:
                restrictions.append('ingredient_restrictions')
            if category in ['toys_hobbies']:
                restrictions.append('age_restrictions')

            # 标签要求
            labeling = []
            if country in ['UK', 'DE', 'FR', 'IT', 'ES']:
                labeling.append('local_language_required')
            if category in ['beauty_personal', 'health_wellness']:
                labeling.append('ingredient_list')
            if category in ['toys_hobbies']:
                labeling.append('warning_labels')

            data.append((
                comb_id,
                json.dumps(certifications),
                json.dumps(cert_costs),
                json.dumps(cert_timeline),
                round(tariff_rate, 2),
                round(vat_rate, 2),
                json.dumps(restrictions) if restrictions else None,
                json.dumps(labeling) if labeling else None,
                (datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO compliance_requirements
            (combination_id, required_certifications, certification_costs_usd,
             certification_timeline_days, import_tariff_rate, vat_rate,
             product_restrictions, labeling_requirements, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 compliance_requirements 记录")

    def generate_supply_chain_info(self):
        """生成供应链信息数据"""
        print("\n开始生成 supply_chain_info 数据...")
        data = []

        for comb_id, category, country, platform in self.combination_ids:
            # 中国供应商数量
            if category in ['electronics', 'smart_home', 'fashion_accessories']:
                supplier_count = random.randint(500, 2000)
            elif category in ['musical_instruments', 'safety_security']:
                supplier_count = random.randint(100, 400)
            else:
                supplier_count = random.randint(200, 800)

            # MOQ最小起订量
            if category in ['electronics', 'smart_home']:
                moq = random.randint(100, 500)
            elif category in ['fashion_accessories', 'toys_hobbies']:
                moq = random.randint(200, 1000)
            else:
                moq = random.randint(50, 300)

            # 生产周期
            production_days = random.randint(7, 30)

            # 海运时间
            if country in ['US', 'CA', 'MX']:
                sea_days = random.randint(18, 28)
            elif country in ['UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL']:
                sea_days = random.randint(28, 38)
            elif country in ['AU']:
                sea_days = random.randint(15, 22)
            elif country in ['BR', 'CL']:
                sea_days = random.randint(35, 50)
            else:
                sea_days = random.randint(10, 20)

            # 空运时间
            air_days = random.randint(3, 7)

            # 运费
            sea_freight_per_cbm = random.uniform(50, 200)
            air_freight_per_kg = random.uniform(4, 12)

            # 供应商集中度
            concentration = random.uniform(15, 45)

            data.append((
                comb_id,
                supplier_count,
                moq,
                production_days,
                sea_days,
                air_days,
                round(sea_freight_per_cbm, 2),
                round(air_freight_per_kg, 2),
                round(concentration, 2),
                (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO supply_chain_info
            (combination_id, china_supplier_count, avg_moq, typical_production_days,
             typical_shipping_days_sea, typical_shipping_days_air, sea_freight_cost_per_cbm_usd,
             air_freight_cost_per_kg_usd, supplier_concentration_top3_pct, data_collection_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 supply_chain_info 记录")

    def generate_platform_policies(self):
        """生成平台政策数据"""
        print("\n开始生成 platform_policies 数据...")
        data = []

        # 平台佣金率
        platform_commission = {
            'amazon': random.uniform(8, 15),
            'tiktok': random.uniform(2, 8),
            'temu': random.uniform(0, 5),
            'shein': random.uniform(0, 5),
            'ebay': random.uniform(10, 13),
            'aliexpress': random.uniform(5, 8),
            'wish': random.uniform(15, 20),
            'shopee': random.uniform(3, 7),
            'lazada': random.uniform(1, 4),
            'tokopedia': random.uniform(2, 5),
            'noon': random.uniform(5, 12),
            'namshi': random.uniform(15, 25),
            'mercadolibre': random.uniform(13, 18),
            'rakuten': random.uniform(4, 10),
            'coupang': random.uniform(5, 12)
        }

        for comb_id, category, country, platform in self.combination_ids:
            # 佣金率（可能有品类差异）
            base_commission = platform_commission.get(platform, 10)
            if category in ['fashion_accessories', 'beauty_personal']:
                commission = base_commission * random.uniform(1.1, 1.3)
            else:
                commission = base_commission * random.uniform(0.9, 1.1)

            # 品类限制
            restrictions = []
            if category in ['health_wellness', 'beauty_personal']:
                if random.random() > 0.5:
                    restrictions.append('require_brand_authorization')
            if category in ['electronics', 'smart_home']:
                if platform in ['amazon'] and random.random() > 0.7:
                    restrictions.append('gated_category')

            # 广告门槛
            if platform in ['amazon']:
                min_reviews = random.randint(0, 15)
                min_rating = 3.5
            else:
                min_reviews = random.randint(0, 5)
                min_rating = 3.0

            # 退货窗口
            if country in ['UK', 'DE', 'FR', 'IT', 'ES']:
                return_days = 30  # 欧盟法律要求
            elif platform in ['amazon']:
                return_days = 30
            else:
                return_days = random.choice([7, 14, 15, 30])

            # 平台退货政策
            return_policy = 'buyer_pays_return_shipping'
            if platform in ['amazon', 'temu']:
                return_policy = 'free_return_on_defects'

            # 禁止宣称
            prohibited = []
            if category in ['health_wellness', 'beauty_personal']:
                prohibited = ['medical_claims', 'cure_claims', 'weight_loss_guarantee']
            elif category in ['electronics']:
                prohibited = ['waterproof_without_certification']

            data.append((
                comb_id,
                round(commission, 2),
                json.dumps(restrictions) if restrictions else None,
                min_reviews,
                round(min_rating, 2),
                return_days,
                return_policy,
                json.dumps(prohibited) if prohibited else None,
                (datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d')
            ))

        self.cursor.executemany('''
            INSERT INTO platform_policies
            (combination_id, commission_rate, category_restrictions, min_review_count_for_ads,
             min_rating_for_ads, return_window_days, platform_return_policy,
             prohibited_claims, policy_update_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data)
        self.conn.commit()
        print(f"✓ 生成 {len(data)} 条 platform_policies 记录")

    def validate_data(self):
        """验证数据完整性"""
        print("\n开始验证数据...")

        # 检查各表记录数
        tables = [
            'market_combinations',
            'market_size_growth',
            'demand_trends',
            'competition_landscape',
            'pricing_cost',
            'operational_metrics',
            'compliance_requirements',
            'supply_chain_info',
            'platform_policies'
        ]

        print("\n表记录统计：")
        for table in tables:
            self.cursor.execute(f'SELECT COUNT(*) FROM {table}')
            count = self.cursor.fetchone()[0]
            print(f"  {table}: {count:,} 条")

        # 检查外键完整性
        self.cursor.execute('''
            SELECT COUNT(*) FROM market_combinations WHERE is_available = 1
        ''')
        available_count = self.cursor.fetchone()[0]

        print(f"\n✓ 有效组合数: {available_count:,}")

        # 抽样检查数据
        print("\n随机抽样检查（5条组合）：")
        self.cursor.execute('''
            SELECT mc.id, mc.category_code, mc.country_code, mc.platform_code,
                   msg.total_gmv_usd, msg.gmv_growth_yoy,
                   cl.total_sellers, pc.price_median_usd
            FROM market_combinations mc
            JOIN market_size_growth msg ON mc.id = msg.combination_id
            JOIN competition_landscape cl ON mc.id = cl.combination_id
            JOIN pricing_cost pc ON mc.id = pc.combination_id
            WHERE mc.is_available = 1
            ORDER BY RANDOM()
            LIMIT 5
        ''')

        samples = self.cursor.fetchall()
        for sample in samples:
            comb_id, cat, country, platform, gmv, growth, sellers, price = sample
            print(f"  [{comb_id}] {cat} / {country} / {platform}")
            print(f"      GMV: ${gmv:,.0f} (增长 {growth}%), 卖家数: {sellers}, 中位价: ${price}")

        print("\n✓ 数据验证完成")


def main():
    """主函数"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'product_selection.db')

    print("=" * 60)
    print("跨境电商选品平台 - 数据库初始化")
    print("=" * 60)

    generator = DataGenerator(db_path)

    try:
        # 连接数据库
        generator.connect()

        # 创建表结构
        generator.create_schema()

        # 生成数据
        generator.generate_market_combinations()
        generator.generate_market_size_growth()
        generator.generate_demand_trends()
        generator.generate_competition_landscape()
        generator.generate_pricing_cost()
        generator.generate_operational_metrics()
        generator.generate_compliance_requirements()
        generator.generate_supply_chain_info()
        generator.generate_platform_policies()

        # 验证数据
        generator.validate_data()

        print("\n" + "=" * 60)
        print("✓ 数据库初始化完成！")
        print(f"✓ 数据库文件: {db_path}")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ 错误: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        generator.close()


if __name__ == '__main__':
    main()
