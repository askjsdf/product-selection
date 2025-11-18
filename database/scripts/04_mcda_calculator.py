# -*- coding: utf-8 -*-
"""
MCDA评分计算器 - 基于数据库原始数据计算机会分数
"""

import sqlite3
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import *


# DSTE战略权重矩阵
STRATEGY_WEIGHTS = {
    'expand_product': {  # 拓展产品线
        'MA': 0.20, 'CF': 0.25, 'PP': 0.25, 'RF': 0.25, 'RC': 0.05
    },
    'new_market': {  # 开拓新市场
        'MA': 0.35, 'CF': 0.20, 'PP': 0.20, 'RF': 0.15, 'RC': 0.10
    },
    'new_platform': {  # 进入新平台
        'MA': 0.30, 'CF': 0.25, 'PP': 0.20, 'RF': 0.15, 'RC': 0.10
    },
    'upgrade': {  # 品类升级
        'MA': 0.20, 'CF': 0.25, 'PP': 0.35, 'RF': 0.15, 'RC': 0.05
    },
    'explore': {  # 探索机会 - 加大权重差异
        'MA': 0.45, 'CF': 0.20, 'PP': 0.25, 'RF': 0.05, 'RC': 0.05
    }
}


class MCDACalculator:
    """MCDA评分计算器"""

    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None
        self.cursor = None

    def connect(self):
        """连接数据库"""
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def close(self):
        """关闭连接"""
        if self.conn:
            self.conn.close()

    def get_combination_data(self, combination_id):
        """获取组合的所有原始数据"""
        query = '''
            SELECT
                mc.id, mc.category_code, mc.country_code, mc.platform_code,
                msg.total_gmv_usd, msg.gmv_growth_yoy, msg.total_orders, msg.search_volume_monthly,
                dt.seasonal_pattern, dt.repurchase_cycle_days,
                cl.total_sellers, cl.new_sellers_cohort_6m_ago, cl.new_sellers_survived_6m,
                cl.top5_sellers_gmv_share, cl.avg_discount_depth, cl.avg_rating,
                pc.price_median_usd, pc.estimated_cogs_median_usd, pc.avg_return_rate,
                om.avg_listing_conversion_rate, om.avg_ad_acos,
                cr.import_tariff_rate, cr.required_certifications,
                sci.avg_moq, sci.typical_production_days,
                pp.commission_rate
            FROM market_combinations mc
            JOIN market_size_growth msg ON mc.id = msg.combination_id
            JOIN demand_trends dt ON mc.id = dt.combination_id
            JOIN competition_landscape cl ON mc.id = cl.combination_id
            JOIN pricing_cost pc ON mc.id = pc.combination_id
            JOIN operational_metrics om ON mc.id = om.combination_id
            JOIN compliance_requirements cr ON mc.id = cr.combination_id
            JOIN supply_chain_info sci ON mc.id = sci.combination_id
            JOIN platform_policies pp ON mc.id = pp.combination_id
            WHERE mc.id = ?
        '''
        self.cursor.execute(query, (combination_id,))
        return self.cursor.fetchone()

    def calculate_ma_score(self, data):
        """
        计算市场吸引力(Market Attractiveness)分数
        基于：市场规模、增长率、搜索热度
        """
        _, _, _, _, gmv, growth, orders, search_volume, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _ = data

        # 1. 市场规模分 (0-100)：严格评分，避免过多满分
        if gmv >= 150_000_000:
            size_score = 95 + min((gmv - 150_000_000) / 100_000_000 * 5, 5)  # 150M以上 -> 95-100分
        elif gmv >= 80_000_000:
            size_score = 85 + (gmv - 80_000_000) / 70_000_000 * 10  # 80-150M -> 85-95分
        elif gmv >= 40_000_000:
            size_score = 70 + (gmv - 40_000_000) / 40_000_000 * 15  # 40-80M -> 70-85分
        elif gmv >= 15_000_000:
            size_score = 50 + (gmv - 15_000_000) / 25_000_000 * 20  # 15-40M -> 50-70分
        elif gmv >= 5_000_000:
            size_score = 30 + (gmv - 5_000_000) / 10_000_000 * 20  # 5-15M -> 30-50分
        elif gmv >= 1_000_000:
            size_score = 10 + (gmv - 1_000_000) / 4_000_000 * 20  # 1-5M -> 10-30分
        else:
            size_score = max(0, gmv / 1_000_000 * 10)  # <1M -> 0-10分

        # 2. 增长率分 (0-100)：严格评分，提高满分门槛
        if growth >= 220:
            growth_score = 95 + min((growth - 220) / 30 * 5, 5)  # 220%以上 -> 95-100分
        elif growth >= 180:
            growth_score = 85 + (growth - 180) / 40 * 10  # 180-220% -> 85-95分
        elif growth >= 130:
            growth_score = 70 + (growth - 130) / 50 * 15  # 130-180% -> 70-85分
        elif growth >= 80:
            growth_score = 50 + (growth - 80) / 50 * 20  # 80-130% -> 50-70分
        elif growth >= 40:
            growth_score = 30 + (growth - 40) / 40 * 20  # 40-80% -> 30-50分
        elif growth >= 20:
            growth_score = 15 + (growth - 20) / 20 * 15  # 20-40% -> 15-30分
        else:
            growth_score = max(0, growth / 20 * 15)  # <20% -> 0-15分

        # 3. 搜索热度分 (0-100)：搜索量越大分数越高
        if search_volume >= 500_000:
            search_score = 100
        elif search_volume >= 100_000:
            search_score = 70 + (search_volume - 100_000) / 400_000 * 30
        elif search_volume >= 20_000:
            search_score = 40 + (search_volume - 20_000) / 80_000 * 30
        else:
            search_score = search_volume / 20_000 * 40

        # 综合得分
        ma_score = size_score * 0.40 + growth_score * 0.40 + search_score * 0.20
        return round(ma_score, 1)

    def calculate_cf_score(self, data):
        """
        计算竞争可行性(Competitive Feasibility)分数
        基于：卖家数量、新手存活率、市场集中度、价格战程度
        """
        _, _, _, _, gmv, _, _, _, _, _, total_sellers, cohort_6m, survived_6m, top5_share, discount, rating, _, _, _, _, _, _, _, _, _, _ = data

        # 1. 竞争密度分 (0-100)：卖家越少分数越高
        seller_density = total_sellers / (gmv / 1_000_000)  # 每百万GMV的卖家数
        if seller_density <= 20:
            density_score = 100
        elif seller_density <= 50:
            density_score = 80 - (seller_density - 20) / 30 * 30
        elif seller_density <= 100:
            density_score = 50 - (seller_density - 50) / 50 * 30
        else:
            density_score = max(0, 20 - (seller_density - 100) / 100 * 20)

        # 2. 新手存活率分 (0-100)：严格评分，中位数56%应该在50分左右
        if cohort_6m > 0:
            survival_rate = survived_6m / cohort_6m * 100
            if survival_rate >= 75:
                survival_score = 90 + min((survival_rate - 75) / 15 * 10, 10)  # 75-90% -> 90-100分
            elif survival_rate >= 60:
                survival_score = 70 + (survival_rate - 60) / 15 * 20  # 60-75% -> 70-90分
            elif survival_rate >= 45:
                survival_score = 45 + (survival_rate - 45) / 15 * 25  # 45-60% -> 45-70分
            elif survival_rate >= 30:
                survival_score = 25 + (survival_rate - 30) / 15 * 20  # 30-45% -> 25-45分
            else:
                survival_score = max(0, survival_rate / 30 * 25)  # 0-30% -> 0-25分
        else:
            survival_score = 50

        # 3. 市场集中度分 (0-100)：CR5越低分数越高 - 激进评分
        if top5_share <= 15:
            concentration_score = 95 + (15 - top5_share) / 15 * 5  # 0-15% -> 95-100分 (完美分散)
        elif top5_share <= 30:
            concentration_score = 75 + (30 - top5_share) / 15 * 20  # 15-30% -> 75-95分 (很分散)
        elif top5_share <= 50:
            concentration_score = 45 + (50 - top5_share) / 20 * 30  # 30-50% -> 45-75分 (中等)
        elif top5_share <= 70:
            concentration_score = 20 + (70 - top5_share) / 20 * 25  # 50-70% -> 20-45分 (较集中)
        elif top5_share <= 85:
            concentration_score = 5 + (85 - top5_share) / 15 * 15  # 70-85% -> 5-20分 (很集中)
        else:
            concentration_score = max(0, 5 - (top5_share - 85) * 0.5)  # >85% -> 0-5分 (极度集中)

        # 4. 价格战分 (0-100)：折扣深度越小分数越高 - 激进评分
        if discount <= 10:
            price_war_score = 95 + (10 - discount) / 10 * 5  # 0-10% -> 95-100分 (无价格战)
        elif discount <= 20:
            price_war_score = 75 + (20 - discount) / 10 * 20  # 10-20% -> 75-95分 (轻微)
        elif discount <= 35:
            price_war_score = 45 + (35 - discount) / 15 * 30  # 20-35% -> 45-75分 (中等)
        elif discount <= 50:
            price_war_score = 15 + (50 - discount) / 15 * 30  # 35-50% -> 15-45分 (激烈)
        else:
            price_war_score = max(0, 15 - (discount - 50) * 0.5)  # >50% -> 0-15分 (极度激烈)

        # 综合得分
        cf_score = (density_score * 0.30 + survival_score * 0.30 +
                   concentration_score * 0.25 + price_war_score * 0.15)
        return round(cf_score, 1)

    def calculate_pp_score(self, data):
        """
        计算利润潜力(Profit Potential)分数
        基于：毛利率、客单价、广告成本、平台佣金
        """
        _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, price, cogs, return_rate, conversion, acos, _, _, _, _, commission = data

        # 1. 毛利率分 (0-100) - 激进映射，制造极端分数
        gross_margin = (price - cogs) / price * 100 if price > 0 else 0
        if gross_margin >= 70:
            margin_score = 95 + (min(gross_margin, 85) - 70) / 15 * 5  # 70-85% -> 95-100分 (顶级)
        elif gross_margin >= 60:
            margin_score = 80 + (gross_margin - 60) / 10 * 15  # 60-70% -> 80-95分 (优秀)
        elif gross_margin >= 50:
            margin_score = 60 + (gross_margin - 50) / 10 * 20  # 50-60% -> 60-80分 (良好)
        elif gross_margin >= 40:
            margin_score = 35 + (gross_margin - 40) / 10 * 25  # 40-50% -> 35-60分 (中等)
        elif gross_margin >= 30:
            margin_score = 15 + (gross_margin - 30) / 10 * 20  # 30-40% -> 15-35分 (较差)
        else:
            margin_score = max(0, gross_margin / 30 * 15)  # 0-30% -> 0-15分 (极差)

        # 2. 客单价分 (0-100)：价格适中最好
        if 30 <= price <= 100:
            price_score = 100
        elif 15 <= price < 30:
            price_score = 60 + (price - 15) / 15 * 40
        elif 100 < price <= 200:
            price_score = 80 - (price - 100) / 100 * 30
        else:
            price_score = 40

        # 3. 运营成本分 (0-100)：广告成本+佣金越低越好
        total_cost_rate = acos + commission
        if total_cost_rate <= 25:
            cost_score = 100
        elif total_cost_rate <= 40:
            cost_score = 80 - (total_cost_rate - 25) / 15 * 30
        else:
            cost_score = max(0, 50 - (total_cost_rate - 40))

        # 4. 转化率分 (0-100)：严格评分，中位数10.8%应该在50分左右
        if conversion >= 16:
            conv_score = 90 + min((conversion - 16) / 2 * 10, 10)  # 16-18% -> 90-100分
        elif conversion >= 13:
            conv_score = 70 + (conversion - 13) / 3 * 20  # 13-16% -> 70-90分
        elif conversion >= 10:
            conv_score = 45 + (conversion - 10) / 3 * 25  # 10-13% -> 45-70分
        elif conversion >= 7:
            conv_score = 25 + (conversion - 7) / 3 * 20  # 7-10% -> 25-45分
        else:
            conv_score = max(0, conversion / 7 * 25)  # 0-7% -> 0-25分

        # 综合得分
        pp_score = margin_score * 0.40 + price_score * 0.25 + cost_score * 0.20 + conv_score * 0.15
        return round(pp_score, 1)

    def calculate_rf_score(self, data, user_profile):
        """
        计算资源匹配度(Resource Fit)分数 - 个性化
        基于：用户经验、资金实力、供应链能力
        """
        _, category, country, platform, _, _, _, _, _, _, _, _, _, _, _, _, price, _, _, _, _, _, certs_json, moq, prod_days, _ = data

        # 获取用户配置
        budget = user_profile.get('budget_usd', 50000)
        experience_platforms = user_profile.get('experience_platforms', [])
        experience_countries = user_profile.get('experience_countries', [])
        experience_categories = user_profile.get('experience_categories', [])

        # 1. 启动资金分 (0-100)：考虑MOQ和单价
        required_capital = moq * price
        if required_capital <= budget * 0.3:
            capital_score = 100
        elif required_capital <= budget * 0.6:
            capital_score = 70
        elif required_capital <= budget:
            capital_score = 40
        else:
            capital_score = max(0, 40 - (required_capital - budget) / budget * 40)

        # 2. 经验匹配分 (0-100)
        exp_score = 50  # 基础分
        if platform in experience_platforms:
            exp_score += 20
        if country in experience_countries:
            exp_score += 15
        if category in experience_categories:
            exp_score += 15
        exp_score = min(100, exp_score)

        # 3. 认证能力分 (0-100)：认证越少越容易
        certs = json.loads(certs_json) if certs_json else []
        if len(certs) == 0:
            cert_score = 100
        elif len(certs) <= 2:
            cert_score = 80
        elif len(certs) <= 4:
            cert_score = 60
        else:
            cert_score = 40

        # 4. 时间周期分 (0-100)：生产周期越短越好
        if prod_days <= 15:
            time_score = 100
        elif prod_days <= 25:
            time_score = 70
        else:
            time_score = max(40, 70 - (prod_days - 25) * 2)

        # 综合得分
        rf_score = capital_score * 0.30 + exp_score * 0.30 + cert_score * 0.25 + time_score * 0.15
        return round(rf_score, 1)

    def calculate_rc_score(self, data):
        """
        计算风险控制(Risk Control)分数
        基于：退货率、关税税率、政策稳定性、评分水平
        """
        _, _, country, _, _, _, _, _, _, _, _, _, _, _, _, rating, _, _, return_rate, _, _, tariff, _, _, _, _ = data

        # 1. 退货风险分 (0-100)：退货率越低分数越高 - 优化阈值
        if return_rate <= 5:
            return_score = 95 + (5 - return_rate)  # 0-5% -> 95-100分
        elif return_rate <= 10:
            return_score = 75 + (10 - return_rate) / 5 * 20  # 5-10% -> 75-95分
        elif return_rate <= 15:
            return_score = 50 + (15 - return_rate) / 5 * 25  # 10-15% -> 50-75分
        elif return_rate <= 20:
            return_score = 25 + (20 - return_rate) / 5 * 25  # 15-20% -> 25-50分
        else:
            return_score = max(0, 25 - (return_rate - 20) * 1.5)  # >20% 快速降低

        # 2. 关税风险分 (0-100)：关税越低分数越高
        if tariff <= 5:
            tariff_score = 100
        elif tariff <= 15:
            tariff_score = 80 - (tariff - 5) / 10 * 30
        elif tariff <= 30:
            tariff_score = 50 - (tariff - 15) / 15 * 30
        else:
            tariff_score = max(0, 20 - (tariff - 30))

        # 3. 市场稳定性分 (0-100)：基于国家和地区
        stable_markets = ['US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'JP', 'AU', 'SG']
        if country in stable_markets:
            stability_score = 90
        elif country in ['AE', 'SA', 'KR', 'TW']:
            stability_score = 75
        else:
            stability_score = 60

        # 4. 产品评分分 (0-100)：严格评分，中位数4.15应该在50分左右
        if rating >= 4.6:
            rating_score = 90 + min((rating - 4.6) / 0.2 * 10, 10)  # 4.6-4.8 -> 90-100分
        elif rating >= 4.4:
            rating_score = 70 + (rating - 4.4) / 0.2 * 20  # 4.4-4.6 -> 70-90分
        elif rating >= 4.1:
            rating_score = 45 + (rating - 4.1) / 0.3 * 25  # 4.1-4.4 -> 45-70分
        elif rating >= 3.8:
            rating_score = 25 + (rating - 3.8) / 0.3 * 20  # 3.8-4.1 -> 25-45分
        else:
            rating_score = max(0, rating / 3.8 * 25)  # 0-3.8 -> 0-25分

        # 综合得分
        rc_score = return_score * 0.30 + tariff_score * 0.30 + stability_score * 0.25 + rating_score * 0.15
        return round(rc_score, 1)

    def calculate_opportunity_score(self, combination_id, strategy='explore', user_profile=None):
        """
        计算机会总分
        strategy: expand_product | new_market | new_platform | upgrade | explore
        """
        # 获取原始数据
        data = self.get_combination_data(combination_id)
        if not data:
            return None

        # 默认用户画像
        if user_profile is None:
            user_profile = {
                'budget_usd': 50000,
                'experience_platforms': [],
                'experience_countries': [],
                'experience_categories': []
            }

        # 计算5个维度分数
        ma_score = self.calculate_ma_score(data)
        cf_score = self.calculate_cf_score(data)
        pp_score = self.calculate_pp_score(data)
        rf_score = self.calculate_rf_score(data, user_profile)
        rc_score = self.calculate_rc_score(data)

        # 获取战略权重
        weights = STRATEGY_WEIGHTS.get(strategy, STRATEGY_WEIGHTS['explore'])

        # 计算加权总分
        total_score = (
            weights['MA'] * ma_score +
            weights['CF'] * cf_score +
            weights['PP'] * pp_score +
            weights['RF'] * rf_score +
            weights['RC'] * rc_score
        )

        # 一票否决机制：惩罚表现极差的市场
        all_scores = [ma_score, cf_score, pp_score, rf_score, rc_score]
        min_score = min(all_scores)
        low_scores = [s for s in all_scores if s < 40]
        very_low_scores = [s for s in all_scores if s < 25]

        # 应用惩罚系数
        penalty = 1.0
        if very_low_scores:  # 有维度<25分，严重惩罚
            penalty *= (0.65 ** len(very_low_scores))  # 每个极低分维度打0.65折
        if len(low_scores) >= 3:  # 3个或更多维度<40分
            penalty *= 0.75
        elif len(low_scores) >= 2:  # 2个维度<40分
            penalty *= 0.85
        elif len(low_scores) == 1:  # 1个维度<40分
            penalty *= 0.92

        # 最低分惩罚：最差维度会额外拖后腿
        if min_score < 50:
            min_penalty = 0.85 + (min_score / 50) * 0.15  # 最低分越低，惩罚越重
            penalty *= min_penalty

        # 应用惩罚
        total_score = total_score * penalty

        # 奖励机制：如果多个维度都很高，给予加成
        high_scores = [s for s in all_scores if s >= 85]
        if len(high_scores) >= 3:  # 3个或更多维度>=85分
            total_score = min(100, total_score * 1.08)
        elif len(high_scores) >= 2:  # 2个维度>=85分
            total_score = min(100, total_score * 1.04)

        return {
            'combination_id': combination_id,
            'category': data[1],
            'country': data[2],
            'platform': data[3],
            'scores': {
                'MA': ma_score,
                'CF': cf_score,
                'PP': pp_score,
                'RF': rf_score,
                'RC': rc_score
            },
            'total_score': round(total_score, 1),
            'strategy': strategy
        }

    def get_top_opportunities(self, strategy='explore', user_profile=None, limit=20):
        """获取Top机会"""
        # 获取所有有效组合
        self.cursor.execute('SELECT id FROM market_combinations WHERE is_available = 1')
        combination_ids = [row[0] for row in self.cursor.fetchall()]

        # 计算所有组合的得分
        opportunities = []
        for comb_id in combination_ids:
            score_result = self.calculate_opportunity_score(comb_id, strategy, user_profile)
            if score_result:
                opportunities.append(score_result)

        # 排序
        opportunities.sort(key=lambda x: x['total_score'], reverse=True)

        return opportunities[:limit]


def demo():
    """演示示例"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'product_selection.db')

    calc = MCDACalculator(db_path)
    calc.connect()

    # 示例用户画像
    user_profile = {
        'budget_usd': 100000,
        'experience_platforms': ['amazon'],
        'experience_countries': ['US'],
        'experience_categories': ['electronics']
    }

    print("=" * 80)
    print("MCDA机会评分计算器 - 演示")
    print("=" * 80)

    # 测试不同战略
    strategies = ['explore', 'new_market', 'new_platform']

    for strategy in strategies:
        print(f"\n战略: {strategy}")
        print("-" * 80)

        top_opps = calc.get_top_opportunities(strategy, user_profile, limit=5)

        for i, opp in enumerate(top_opps, 1):
            print(f"\n{i}. {opp['category']} / {opp['country']} / {opp['platform']}")
            print(f"   总分: {opp['total_score']}")
            print(f"   MA={opp['scores']['MA']}, CF={opp['scores']['CF']}, "
                  f"PP={opp['scores']['PP']}, RF={opp['scores']['RF']}, RC={opp['scores']['RC']}")

    calc.close()


if __name__ == '__main__':
    demo()
