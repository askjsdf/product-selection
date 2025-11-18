/**
 * MCDA - Multi-Criteria Decision Analysis（多准则决策分析引擎）
 * 项目：AI选品助手
 * 更新时间：2025-11-18
 *
 * 实现华为 MCDA 评分算法 v1.0/v2.0/v3.0
 */

const MCDAEngine = {
  // 默认权重配置
  DEFAULT_WEIGHTS: {
    MA: 25, // 市场吸引力
    CF: 20, // 竞争可行性
    PP: 30, // 利润潜力
    RF: 15, // 资源匹配度
    RC: 10  // 风险控制
  },

  // 战略模式权重配置（参考 02 文档 2.5.3 节）
  STRATEGY_WEIGHTS: {
    '综合最优': { MA: 25, CF: 20, PP: 30, RF: 15, RC: 10 },
    '高增长优先': { MA: 40, CF: 15, PP: 20, RF: 15, RC: 10 },
    '高利润优先': { MA: 15, CF: 15, PP: 45, RF: 15, RC: 10 },
    '蓝海机会': { MA: 20, CF: 40, PP: 20, RF: 10, RC: 10 },
    '快速起量': { MA: 20, CF: 20, PP: 20, RF: 30, RC: 10 }
  },

  // 评分缓存
  _scoreCache: new Map(),

  /* ========================================================================
     MCDA v1.0 - 组合级评分（Step 1）
     ======================================================================== */

  /**
   * 计算 MCDA v1.0 综合评分
   * @param {Object} combinationData - 组合数据
   * @param {Object} weights - 权重配置 { MA, CF, PP, RF, RC }
   * @returns {number} 综合评分 (0-100)
   */
  calculateMCDAv1(combinationData, weights = this.DEFAULT_WEIGHTS) {
    // 检查缓存
    const cacheKey = this._getCacheKey(combinationData.id, weights);
    if (this._scoreCache.has(cacheKey)) {
      return this._scoreCache.get(cacheKey);
    }

    // 计算五维评分
    const scores = {
      MA: this.calculateMA(combinationData.market_data),
      CF: this.calculateCF(combinationData.competition_data),
      PP: this.calculatePP(combinationData.profit_data),
      RF: this.calculateRF(combinationData),
      RC: this.calculateRC(combinationData.risk_data)
    };

    // 归一化权重
    const normalizedWeights = this.normalizeWeights(weights);

    // 应用一票否决机制
    const vetoPenalty = this.applyVetoMechanism(scores);

    // 应用协同加成机制
    const synergyBonus = this.applySynergyBonus(scores);

    // 计算综合评分
    const overallScore = this.calculateOverallScore(
      scores,
      normalizedWeights,
      vetoPenalty,
      synergyBonus
    );

    // 构建返回结果
    const result = {
      overall_score: overallScore,
      scores: scores,
      veto_penalty: vetoPenalty,
      synergy_bonus: synergyBonus
    };

    // 缓存结果
    this._scoreCache.set(cacheKey, result);

    return result;
  },

  /**
   * 计算 MA（市场吸引力）维度评分
   * @param {Object} marketData - 市场数据
   * @returns {number} MA 评分 (0-100)
   */
  calculateMA(marketData) {
    if (!marketData) return 0;

    // GMV 规模评分 (40%)
    const gmvScore = this._normalizeToScore(marketData.gmv, 20e6, 150e6);

    // 增长率评分 (35%)
    const growthScore = this._normalizeToScore(marketData.growth_rate, 80, 250);

    // 搜索热度评分 (15%)
    const searchScore = this._normalizeToScore(marketData.search_volume, 50000, 300000);

    // 市场成熟度评分 (10%) - 基于月销量
    const maturityScore = this._normalizeToScore(marketData.monthly_sales, 500000, 2000000);

    return (
      gmvScore * 0.4 +
      growthScore * 0.35 +
      searchScore * 0.15 +
      maturityScore * 0.1
    );
  },

  /**
   * 计算 CF（竞争可行性）维度评分
   * @param {Object} competitionData - 竞争数据
   * @returns {number} CF 评分 (0-100)
   */
  calculateCF(competitionData) {
    if (!competitionData) return 0;

    // 垄断度评分 (35%) - 反向指标，垄断度越低越好
    // 垄断度 > 5 触发一票否决
    let monopolyScore = 0;
    if (competitionData.monopoly_index > 5) {
      monopolyScore = 0; // 强制为 0
    } else {
      monopolyScore = this._normalizeToScore(
        7 - competitionData.monopoly_index, // 反向
        2, 7
      );
    }

    // CR5 集中度评分 (30%) - 反向指标
    const cr5Score = this._normalizeToScore(
      100 - competitionData.cr5, // 反向
      25, 75
    );

    // 新卖家存活率评分 (20%) - POC 阶段暂用固定值 70
    const survivalScore = 70;

    // 竞争程度评分 (15%)
    const competitionScore = this._normalizeToScore(
      competitionData.competition_degree,
      60, 120
    );

    return (
      monopolyScore * 0.35 +
      cr5Score * 0.3 +
      survivalScore * 0.2 +
      competitionScore * 0.15
    );
  },

  /**
   * 计算 PP（利润潜力）维度评分
   * @param {Object} profitData - 利润数据
   * @returns {number} PP 评分 (0-100)
   */
  calculatePP(profitData) {
    if (!profitData) return 0;

    // 毛利率评分 (50%)
    const marginScore = this._normalizeToScore(profitData.margin, 25, 65);

    // 客单价评分 (30%)
    const priceScore = this._normalizeToScore(profitData.avg_price, 9.99, 89.99);

    // 转化率评分 (20%)
    const conversionScore = this._normalizeToScore(profitData.conversion_rate, 5, 18);

    return (
      marginScore * 0.5 +
      priceScore * 0.3 +
      conversionScore * 0.2
    );
  },

  /**
   * 计算 RF（资源匹配度）维度评分
   * @param {Object} combinationData - 组合数据
   * @returns {number} RF 评分 (0-100)
   */
  calculateRF(combinationData) {
    // POC 阶段简化：基于平台和品类的固定评分
    // 实际产品中应该根据用户的资源禀赋动态计算

    const platformScores = {
      'Amazon': 80,
      'TikTok': 65,
      'Temu': 70,
      'AliExpress': 75
    };

    const platform = combinationData.platform || '';
    const baseScore = platformScores[platform] || 70;

    // 根据合规要求调整 (-5 ~ +5)
    const complianceAdjust = combinationData.risk_data?.compliance_level === '低' ? 5 :
                            combinationData.risk_data?.compliance_level === '高' ? -5 : 0;

    return Math.max(0, Math.min(100, baseScore + complianceAdjust));
  },

  /**
   * 计算 RC（风险控制）维度评分
   * @param {Object} riskData - 风险数据
   * @returns {number} RC 评分 (0-100)
   */
  calculateRC(riskData) {
    if (!riskData) return 0;

    // 合规风险评分 (35%) - 反向指标
    const complianceScores = { '低': 90, '中': 70, '高': 40 };
    const complianceScore = complianceScores[riskData.compliance_level] || 70;

    // 退货率评分 (30%) - 反向指标
    const returnScore = this._normalizeToScore(
      20 - riskData.return_rate, // 反向
      5, 15
    );

    // 评分评分 (20%)
    const ratingScore = this._normalizeToScore(riskData.rating, 3.8, 4.7) ;

    // 平台稳定性评分 (15%) - POC 阶段固定 75
    const platformStabilityScore = 75;

    return (
      complianceScore * 0.35 +
      returnScore * 0.3 +
      ratingScore * 0.2 +
      platformStabilityScore * 0.15
    );
  },

  /**
   * 一票否决机制
   * @param {Object} scores - 五维评分 { MA, CF, PP, RF, RC }
   * @returns {number} 惩罚系数 (0.7 或 1.0)
   */
  applyVetoMechanism(scores) {
    const hasLowScore = Object.values(scores).some(score => score < 25);
    return hasLowScore ? 0.7 : 1.0;
  },

  /**
   * 协同加成机制
   * @param {Object} scores - 五维评分 { MA, CF, PP, RF, RC }
   * @returns {number} 奖励系数 (1.05 或 1.0)
   */
  applySynergyBonus(scores) {
    const highScoreCount = Object.values(scores).filter(score => score > 85).length;
    return highScoreCount >= 3 ? 1.05 : 1.0;
  },

  /**
   * 计算综合评分
   * @param {Object} scores - 五维评分
   * @param {Object} weights - 归一化权重
   * @param {number} vetoPenalty - 惩罚系数
   * @param {number} synergyBonus - 奖励系数
   * @returns {number} 综合评分 (0-100)
   */
  calculateOverallScore(scores, weights, vetoPenalty, synergyBonus) {
    const weightedSum = (
      scores.MA * weights.MA +
      scores.CF * weights.CF +
      scores.PP * weights.PP +
      scores.RF * weights.RF +
      scores.RC * weights.RC
    );

    const finalScore = weightedSum * vetoPenalty * synergyBonus;

    return Math.max(0, Math.min(100, Math.round(finalScore * 10) / 10));
  },

  /**
   * 归一化权重（确保总和为 100）
   * @param {Object} weights - 原始权重
   * @returns {Object} 归一化权重（小数形式，总和为 1.0）
   */
  normalizeWeights(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total === 0) return this.DEFAULT_WEIGHTS;

    return {
      MA: weights.MA / total,
      CF: weights.CF / total,
      PP: weights.PP / total,
      RF: weights.RF / total,
      RC: weights.RC / total
    };
  },

  /* ========================================================================
     工具函数
     ======================================================================== */

  /**
   * 将数值归一化到 0-100 评分
   * @param {number} value - 原始值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 评分 (0-100)
   */
  _normalizeToScore(value, min, max) {
    if (value === null || value === undefined) return 50;
    if (value <= min) return 0;
    if (value >= max) return 100;

    return ((value - min) / (max - min)) * 100;
  },

  /**
   * 生成缓存键
   * @param {string} id - 组合 ID
   * @param {Object} weights - 权重
   * @returns {string} 缓存键
   */
  _getCacheKey(id, weights) {
    const weightsStr = JSON.stringify(weights);
    return `${id}_${weightsStr}`;
  },

  /**
   * 清空缓存
   */
  clearCache() {
    this._scoreCache.clear();
  },

  /* ========================================================================
     MCDA v2.0 - 产品级简化评分（Step 3）- 占位
     ======================================================================== */

  /**
   * 计算 MCDA v2.0 产品级评分
   * @param {Object} productData - 产品数据
   * @returns {number} 综合评分 (0-100)
   */
  calculateMCDAv2(productData) {
    // TODO: Step 3 时实现
    // 公式：Product Score = 0.40 × 市场表现 + 0.30 × 竞争程度 + 0.30 × 利润潜力
    return 75; // 占位返回值
  },

  /* ========================================================================
     MCDA v3.0 - 最终决策评分（Step 6）- 占位
     ======================================================================== */

  /**
   * 计算 MCDA v3.0 最终决策评分
   * @param {Object} solutionData - 解决方案数据
   * @param {Object} weights - 权重
   * @returns {number} 综合评分 (0-100)
   */
  calculateMCDAv3(solutionData, weights = this.DEFAULT_WEIGHTS) {
    // TODO: Step 6 时实现
    // 复用 v1.0 的完整五维评分逻辑
    return 80; // 占位返回值
  }
};

// 兼容 CommonJS 和浏览器环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MCDAEngine;
}

// 浏览器环境导出到 window
if (typeof window !== 'undefined') {
  window.MCDAEngine = MCDAEngine;
}
