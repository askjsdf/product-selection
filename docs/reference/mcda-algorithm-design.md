# MCDA动态评分算法设计文档

## 一、算法概述

基于华为DSTE战略框架与MCDA多准则决策理论，设计动态机会评分算法，根据用户的战略意图自动调整评分权重，实现个性化的机会推荐。

## 二、DSTE战略路径定义

### 战略路径1：扩充产品线（同市场新品类）
**战略特征**：
- 已在某市场/平台站稳脚跟
- 希望通过增加品类提升客单价和复购率
- 风险偏好：保守-平衡

**DSTE映射**：
- S (Strategic Intent): 品类扩张，客户深耕
- M (Market): 已验证市场，降低市场风险
- I (Innovation): 关联品类创新
- B (Business Design): 交叉销售模型

**决策重点**：
1. 与现有品类的协同性（供应链/客户群重叠）
2. 市场已被验证（降低市场风险）
3. 竞争壁垒适中（不能太激烈）
4. 利润率稳定

---

### 战略路径2：拓展新市场（已有品类新区域）
**战略特征**：
- 已有成熟品类和供应链
- 希望复制成功模式到新地理区域
- 风险偏好：平衡

**DSTE映射**：
- S (Strategic Intent): 地理扩张
- M (Market): 新市场分析，区域适配
- I (Innovation): 本地化创新
- B (Business Design): 多市场组合管理

**决策重点**：
1. 新市场的增长潜力（市场吸引力）
2. 品类在新市场的需求验证
3. 供应链可复用性（物流/认证成本）
4. 竞争格局友好度

---

### 战略路径3：进入新平台（新渠道机会）
**战略特征**：
- 看好新兴平台红利（如TikTok Shop）
- 愿意学习新平台玩法
- 风险偏好：平衡-激进

**DSTE映射**：
- S (Strategic Intent): 渠道创新
- M (Market): 平台生态分析
- I (Innovation): 内容/流量模式创新
- B (Business Design): 全渠道组合

**决策重点**：
1. 平台增长速度和流量红利
2. 品类在该平台的适配度（如内容驱动型）
3. 竞争尚未饱和（早期进入优势）
4. 学习成本可接受

---

### 战略路径4：品类升级（从低价到品牌）
**战略特征**：
- 已有走量经验，希望提升品牌溢价
- 从白牌/跟卖转向差异化/品牌化
- 风险偏好：保守-平衡

**DSTE映射**：
- S (Strategic Intent): 价值升级
- M (Market): 高端细分市场
- I (Innovation): 产品/品牌差异化
- B (Business Design): 品牌溢价模型

**决策重点**：
1. 品牌化空间（非纯价格竞争市场）
2. 利润率提升潜力
3. 客户愿意为差异化付费
4. 中等竞争强度（有标杆可参考）

---

### 战略路径5：探索全新机会（完全创新）
**战略特征**：
- 不限定品类/市场/平台
- 寻找最大机会，愿意承担风险
- 风险偏好：激进

**DSTE映射**：
- S (Strategic Intent): 机会主义
- M (Market): 全局扫描
- I (Innovation): 全方位创新
- B (Business Design): 快速试错

**决策重点**：
1. 绝对机会大小（市场规模×增长率）
2. 先发优势（蓝海市场）
3. 高回报潜力
4. 可快速试错

---

## 三、MCDA评分维度体系

### 维度1：市场吸引力 (Market Attractiveness)
**权重代码**: `W_MA`

**子指标**：
1. **市场规模** (market_size)
   - 数据源：GMV估算
   - 归一化：0-100分
   - 计算：log(GMV) 映射到分值

2. **增长率** (growth_rate)
   - 数据源：YoY% 或 MoM%
   - 归一化：
     - <20% → 40分
     - 20-50% → 60分
     - 50-100% → 80分
     - >100% → 100分

3. **需求趋势** (demand_trend)
   - 数据源：搜索热度指数、社媒提及量
   - 归一化：趋势斜率 → 0-100分

4. **市场成熟度** (market_maturity)
   - 萌芽期：90分（高风险高回报）
   - 成长期：100分（最佳进入期）
   - 成熟期：60分（稳定但空间有限）
   - 衰退期：20分（不推荐）

**维度得分公式**：
```
MA_Score =
  0.35 × market_size_score +
  0.40 × growth_rate_score +
  0.15 × demand_trend_score +
  0.10 × market_maturity_score
```

---

### 维度2：竞争可行性 (Competitive Feasibility)
**权重代码**: `W_CF`

**子指标**：
1. **竞争强度** (competition_intensity) [反向指标]
   - 计算：基于卖家数量、价格战指数
   - 归一化：竞争越激烈，分数越低
     - 低竞争 → 100分
     - 中竞争 → 60分
     - 高竞争 → 30分

2. **市场集中度** (market_concentration) [反向指标]
   - 数据源：CR5 (前5名份额占比)
   - CR5 < 30% → 90分（分散，机会大）
   - CR5 30-60% → 60分（适中）
   - CR5 > 60% → 30分（垄断，难进入）

3. **新卖家生存率** (new_seller_survival)
   - 数据源：6个月存活率
   - >70% → 100分
   - 50-70% → 70分
   - <50% → 40分

4. **差异化空间** (differentiation_space)
   - 数据源：产品同质化指数、评论差异度
   - 高差异化空间 → 100分
   - 中等 → 60分
   - 低（高度同质化）→ 30分

**维度得分公式**：
```
CF_Score =
  0.35 × (100 - competition_intensity_score) +
  0.25 × (100 - market_concentration_score) +
  0.20 × new_seller_survival_score +
  0.20 × differentiation_space_score
```

---

### 维度3：盈利潜力 (Profit Potential)
**权重代码**: `W_PP`

**子指标**：
1. **毛利率** (gross_margin)
   - >40% → 100分
   - 30-40% → 80分
   - 20-30% → 60分
   - <20% → 40分

2. **净利润率** (net_margin)
   - 扣除平台费率、物流、广告后
   - >20% → 100分
   - 10-20% → 70分
   - 5-10% → 50分
   - <5% → 30分

3. **客单价** (avg_order_value)
   - >$100 → 100分（高客单）
   - $50-100 → 80分
   - $20-50 → 60分
   - <$20 → 40分（低客单，量大才有意义）

4. **资金周转率** (inventory_turnover)
   - 高周转（<30天）→ 100分
   - 中周转（30-60天）→ 70分
   - 低周转（>60天）→ 40分

**维度得分公式**：
```
PP_Score =
  0.30 × gross_margin_score +
  0.40 × net_margin_score +
  0.15 × avg_order_value_score +
  0.15 × inventory_turnover_score
```

---

### 维度4：资源匹配度 (Resource Fit)
**权重代码**: `W_RF`

**子指标**：
1. **供应链匹配** (supply_chain_fit)
   - 基于用户画像（工厂/贸易/代发）
   - 完全匹配 → 100分
   - 部分匹配 → 60分
   - 不匹配 → 30分

2. **资金匹配** (budget_fit)
   - 基于用户预算 vs 启动资金需求
   - MOQ + 首批备货 + 认证 + 推广
   - 资金充裕（需求<50%预算）→ 100分
   - 资金适配（需求50-80%预算）→ 70分
   - 资金紧张（需求>80%预算）→ 40分

3. **团队能力匹配** (team_capability_fit)
   - 内容运营能力（TikTok需要）
   - 广告投放能力（Amazon需要）
   - 品牌营销能力（高端市场需要）
   - 匹配度 → 0-100分

4. **已有平台经验** (platform_experience)
   - 已在该平台运营 → 100分
   - 在相似平台有经验 → 70分
   - 完全新平台 → 40分

**维度得分公式**：
```
RF_Score =
  0.35 × supply_chain_fit_score +
  0.25 × budget_fit_score +
  0.20 × team_capability_fit_score +
  0.20 × platform_experience_score
```

---

### 维度5：风险可控性 (Risk Control)
**权重代码**: `W_RC`

**子指标**：
1. **合规风险** (compliance_risk) [反向指标]
   - 认证要求复杂度（CE/FDA/FCC等）
   - 低风险（无特殊要求）→ 100分
   - 中风险（常规认证）→ 70分
   - 高风险（多项认证+高成本）→ 40分

2. **政策风险** (policy_risk) [反向指标]
   - 关税变动、进出口限制、平台政策
   - 低风险 → 100分
   - 中风险 → 60分
   - 高风险 → 30分

3. **供应链稳定性** (supply_chain_stability)
   - 供应商集中度、原材料波动
   - 高稳定 → 100分
   - 中稳定 → 70分
   - 低稳定 → 40分

4. **退货/售后风险** (return_risk) [反向指标]
   - 基于品类退货率数据
   - 低退货率（<5%）→ 100分
   - 中退货率（5-15%）→ 70分
   - 高退货率（>15%）→ 40分

**维度得分公式**：
```
RC_Score =
  0.35 × (100 - compliance_risk_score) +
  0.25 × (100 - policy_risk_score) +
  0.20 × supply_chain_stability_score +
  0.20 × (100 - return_risk_score)
```

---

## 四、战略路径权重矩阵

### 权重配置表

| 维度 | 路径1<br>扩充产品线 | 路径2<br>拓展新市场 | 路径3<br>进入新平台 | 路径4<br>品类升级 | 路径5<br>探索机会 |
|------|---------|---------|---------|---------|---------|
| **市场吸引力** (MA) | 0.20 | 0.35 | 0.30 | 0.20 | 0.40 |
| **竞争可行性** (CF) | 0.25 | 0.20 | 0.25 | 0.25 | 0.15 |
| **盈利潜力** (PP) | 0.25 | 0.20 | 0.20 | 0.35 | 0.25 |
| **资源匹配度** (RF) | 0.25 | 0.15 | 0.15 | 0.15 | 0.10 |
| **风险可控性** (RC) | 0.05 | 0.10 | 0.10 | 0.05 | 0.10 |
| **总和** | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |

### 权重设计逻辑说明

**路径1（扩充产品线）**：
- 资源匹配度最高（0.25）→ 强调利用现有优势
- 竞争可行性高（0.25）→ 不能太卷，要找差异化空间
- 盈利潜力高（0.25）→ 交叉销售提升利润
- 市场吸引力中等（0.20）→ 市场已验证，不是首要考虑
- 风险可控性低（0.05）→ 同市场风险已知

**路径2（拓展新市场）**：
- 市场吸引力最高（0.35）→ 新市场要有足够潜力才值得进入
- 风险可控性较高（0.10）→ 新市场不熟悉，要控制风险
- 竞争可行性中等（0.20）→ 不能太激烈
- 盈利潜力中等（0.20）→ 品类已验证，利润可预期
- 资源匹配度较低（0.15）→ 品类已有，供应链可复用

**路径3（进入新平台）**：
- 市场吸引力高（0.30）→ 新平台要有流量红利
- 竞争可行性高（0.25）→ 抢早期红利，竞争不能饱和
- 盈利/资源/风险均衡（各0.15-0.20）→ 全面评估

**路径4（品类升级）**：
- 盈利潜力最高（0.35）→ 核心目标是提升利润率
- 竞争可行性高（0.25）→ 要有差异化空间
- 市场吸引力中等（0.20）→ 细分市场可能不大但利润高
- 资源匹配度较低（0.15）→ 强调产品创新而非资源
- 风险可控性低（0.05）→ 升级路径相对熟悉

**路径5（探索机会）**：
- 市场吸引力最高（0.40）→ 追求最大机会
- 盈利潜力高（0.25）→ 高回报
- 竞争可行性较低（0.15）→ 愿意面对竞争
- 资源/风险最低（0.10）→ 机会优先，快速试错

---

## 五、风险偏好调节因子

在基础权重之上，根据用户的风险偏好进行二次调整：

```python
def adjust_weights_by_risk_preference(base_weights, risk_preference):
    """
    根据风险偏好调整权重

    Args:
        base_weights: 基于战略路径的基础权重字典
        risk_preference: 'conservative' | 'balanced' | 'aggressive'

    Returns:
        调整后的权重字典
    """

    if risk_preference == 'conservative':
        # 保守型：提升风险可控性和资源匹配度权重
        adjustment = {
            'MA': -0.05,  # 降低市场吸引力权重
            'CF': +0.02,  # 略提升竞争可行性
            'PP': -0.03,  # 略降低盈利潜力（高利润往往高风险）
            'RF': +0.03,  # 提升资源匹配度
            'RC': +0.03   # 提升风险可控性
        }

    elif risk_preference == 'aggressive':
        # 激进型：提升市场吸引力和盈利潜力权重
        adjustment = {
            'MA': +0.08,  # 大幅提升市场吸引力
            'CF': -0.03,  # 降低竞争可行性（敢于竞争）
            'PP': +0.05,  # 提升盈利潜力
            'RF': -0.05,  # 降低资源匹配度（敢于尝试新领域）
            'RC': -0.05   # 降低风险可控性（容忍风险）
        }

    else:  # balanced
        # 平衡型：不调整，使用基础权重
        adjustment = {
            'MA': 0,
            'CF': 0,
            'PP': 0,
            'RF': 0,
            'RC': 0
        }

    # 应用调整
    adjusted_weights = {
        k: base_weights[k] + adjustment[k]
        for k in base_weights
    }

    # 归一化确保总和为1
    total = sum(adjusted_weights.values())
    return {k: v/total for k, v in adjusted_weights.items()}
```

---

## 六、完整评分算法实现

```python
def calculate_opportunity_score(
    combination,           # {category, country, platform}
    user_profile,          # {strategic_goal, risk_preference, ...}
    market_data           # 市场数据
):
    """
    计算【品类×国家×平台】组合的机会评分

    Returns:
        {
            'total_score': 0-100,
            'dimension_scores': {MA, CF, PP, RF, RC},
            'weights_used': {MA, CF, PP, RF, RC},
            'grade': 'A+' | 'A' | 'B+' | 'B' | 'C',
            'confidence': 0-100
        }
    """

    # Step 1: 获取基础权重（基于战略目标）
    base_weights = get_base_weights(user_profile['strategic_goal'])

    # Step 2: 根据风险偏好调整权重
    final_weights = adjust_weights_by_risk_preference(
        base_weights,
        user_profile['risk_preference']
    )

    # Step 3: 计算5大维度得分
    dimension_scores = {}

    # 维度1：市场吸引力
    dimension_scores['MA'] = calculate_market_attractiveness(
        combination, market_data
    )

    # 维度2：竞争可行性
    dimension_scores['CF'] = calculate_competitive_feasibility(
        combination, market_data
    )

    # 维度3：盈利潜力
    dimension_scores['PP'] = calculate_profit_potential(
        combination, market_data
    )

    # 维度4：资源匹配度（个性化）
    dimension_scores['RF'] = calculate_resource_fit(
        combination, user_profile, market_data
    )

    # 维度5：风险可控性
    dimension_scores['RC'] = calculate_risk_control(
        combination, market_data
    )

    # Step 4: 加权求和
    total_score = sum(
        final_weights[dim] * dimension_scores[dim]
        for dim in ['MA', 'CF', 'PP', 'RF', 'RC']
    )

    # Step 5: 计算评分等级
    grade = get_grade(total_score)

    # Step 6: 计算信心指数（基于数据完整度）
    confidence = calculate_confidence(market_data)

    return {
        'total_score': round(total_score, 1),
        'dimension_scores': {
            k: round(v, 1) for k, v in dimension_scores.items()
        },
        'weights_used': final_weights,
        'grade': grade,
        'confidence': confidence
    }


def get_base_weights(strategic_goal):
    """获取基于战略目标的基础权重"""
    weights_matrix = {
        'expand_product': {
            'MA': 0.20, 'CF': 0.25, 'PP': 0.25, 'RF': 0.25, 'RC': 0.05
        },
        'new_market': {
            'MA': 0.35, 'CF': 0.20, 'PP': 0.20, 'RF': 0.15, 'RC': 0.10
        },
        'new_platform': {
            'MA': 0.30, 'CF': 0.25, 'PP': 0.20, 'RF': 0.15, 'RC': 0.10
        },
        'upgrade': {
            'MA': 0.20, 'CF': 0.25, 'PP': 0.35, 'RF': 0.15, 'RC': 0.05
        },
        'explore': {
            'MA': 0.40, 'CF': 0.15, 'PP': 0.25, 'RF': 0.10, 'RC': 0.10
        }
    }
    return weights_matrix.get(strategic_goal, weights_matrix['explore'])


def get_grade(score):
    """将分数映射到等级"""
    if score >= 90:
        return 'A+'
    elif score >= 80:
        return 'A'
    elif score >= 70:
        return 'B+'
    elif score >= 60:
        return 'B'
    elif score >= 50:
        return 'C'
    else:
        return 'D'


def calculate_confidence(market_data):
    """
    计算信心指数（数据完整度和可靠性）

    考虑因素：
    - 数据源覆盖度（平台API vs 第三方估算）
    - 数据时效性（实时 vs 历史）
    - 样本量充足性
    """
    confidence = 100

    # 数据缺失惩罚
    if not market_data.get('growth_rate'):
        confidence -= 10
    if not market_data.get('competition_intensity'):
        confidence -= 10
    if not market_data.get('profit_margin'):
        confidence -= 15

    # 数据时效性
    data_age_days = market_data.get('data_age_days', 0)
    if data_age_days > 30:
        confidence -= min(20, data_age_days - 30)

    # 样本量
    sample_size = market_data.get('sample_size', 0)
    if sample_size < 50:
        confidence -= 15

    return max(0, confidence)
```

---

## 七、算法使用示例

```python
# 示例：用户画像
user_profile = {
    'strategic_goal': 'new_market',      # 拓展新市场
    'risk_preference': 'balanced',       # 平衡型风险偏好
    'current_category': '宠物用品',
    'supply_chain_type': 'factory',      # 自有工厂
    'budget_range': 'medium',            # 5-20万美元
    'team_capabilities': ['supply_chain', 'product_design'],
    'platform_experience': ['amazon']
}

# 示例：组合
combination = {
    'category': '宠物用品',
    'country': '美国',
    'platform': 'TikTok Shop'
}

# 示例：市场数据（来自数据中台）
market_data = {
    'market_size': 120_000_000,        # $120M
    'growth_rate': 180,                # +180%
    'competition_intensity': 65,       # 65/100
    'market_concentration_cr5': 35,    # 35%
    'avg_gross_margin': 35,            # 35%
    'avg_net_margin': 18,              # 18%
    # ... 更多数据
}

# 计算评分
result = calculate_opportunity_score(
    combination,
    user_profile,
    market_data
)

print(result)
# {
#     'total_score': 87.3,
#     'dimension_scores': {
#         'MA': 92,
#         'CF': 78,
#         'PP': 85,
#         'RF': 88,
#         'RC': 82
#     },
#     'weights_used': {
#         'MA': 0.35,
#         'CF': 0.20,
#         'PP': 0.20,
#         'RF': 0.15,
#         'RC': 0.10
#     },
#     'grade': 'A',
#     'confidence': 92
# }
```

---

## 八、算法优化方向

### 1. 机器学习优化权重
随着平台积累卖家成功/失败案例数据：
```
训练数据 = {
    (用户画像, 组合, 市场数据) → 实际成功率
}

优化目标：找到最优权重矩阵，使预测成功率最接近实际
```

### 2. 动态权重学习
基于用户行为调整：
- 用户频繁查看高增长品类 → 提升MA权重
- 用户只加入低竞争组合 → 提升CF权重

### 3. A/B测试
对不同权重配置进行效果验证，优化推荐准确率。

---

## 九、与UI的集成建议

在热力矩阵页面提供：

1. **权重可视化**
   ```
   当前评分基于您的战略：拓展新市场

   市场吸引力   ████████████████ 35%
   竞争可行性   ████████ 20%
   盈利潜力     ████████ 20%
   资源匹配度   ██████ 15%
   风险可控性   ████ 10%

   [自定义权重]
   ```

2. **实时调整**
   - 用户拖动滑块调整权重
   - 热力图实时重新计算并更新

3. **方法论解释**
   - 鼠标hover显示："基于DSTE战略框架，您的'拓展新市场'目标更关注..."

---

## 十、总结

本算法的核心优势：

1. **战略导向**：不是简单的数据排序，而是基于用户战略意图的智能推荐
2. **个性化**：不同卖家看到的评分不同
3. **可解释**：每个评分都能回溯到具体维度和权重
4. **灵活**：支持用户自定义调整
5. **可进化**：可通过机器学习持续优化

这套算法是平台"战略中枢"定位的核心支撑。
