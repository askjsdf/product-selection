/**
 * Step 5: 决策汇总与报告导出
 * 汇总前4个步骤的所有数据，生成完整的选品决策报告
 */

console.log('Step 5: 决策汇总模块已加载');

// ========================================
// 页面加载时初始化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('step5-container')) {
    initStep5();
  }
});

function initStep5() {
  console.log('初始化 Step 5...');

  // 从 localStorage 加载所有步骤的数据
  loadAllStepsData();

  // 绑定导出按钮事件
  bindExportEvents();

  console.log('Step 5 初始化完成');
}

// ========================================
// 数据加载与聚合
// ========================================

/**
 * 加载所有步骤的数据并填充页面
 */
function loadAllStepsData() {
  // Step 1: 机会发现数据
  const step1Data = loadStep1Data();
  populateStep1Summary(step1Data);

  // Step 2: 产品定位数据
  const step2Data = loadStep2Data();
  populateStep2Summary(step2Data);

  // Step 3: 运营策略数据
  const step3Data = loadStep3Data();
  populateStep3Summary(step3Data);

  // Step 4: 成本核算数据
  const step4Data = loadStep4Data();
  populateStep4Summary(step4Data);

  // 决策概览（综合所有步骤）
  populateDecisionOverview(step1Data, step2Data, step3Data, step4Data);

  // 最终评估
  populateFinalEvaluation(step1Data, step4Data);
}

/**
 * 加载 Step 1 数据
 */
function loadStep1Data() {
  const savedData = localStorage.getItem('step1_selectedCombination');

  if (savedData) {
    return JSON.parse(savedData);
  }

  // 默认数据（用于演示）
  return {
    category: '宠物用品',
    country: '美国',
    platform: 'Amazon',
    score: 62.3,
    marketAttractiveness: 71.2,
    competitiveFeasibility: 58.9,
    profitPotential: 65.4,
    riskFactor: 54.1,
    resourceCompatibility: 61.8,
    insights: [
      '市场需求旺盛，年增长率15%+',
      'Amazon平台流量大，品牌溢价空间足',
      '头部竞品集中度较高，需差异化切入'
    ]
  };
}

/**
 * 加载 Step 2 数据
 */
function loadStep2Data() {
  const savedData = localStorage.getItem('step2_charter');

  if (savedData) {
    return JSON.parse(savedData);
  }

  // 默认数据（用于演示）
  return {
    product: '智能猫砂盆',
    targetMarket: '中高端养猫人群（年收入$50K+）',
    sellingPrice: 189,
    monthlyTarget: 500,
    features: [
      '自动清洁与除臭功能',
      'APP远程监控与健康分析',
      '静音设计，适合公寓使用'
    ],
    differentiation: [
      '健康监测：通过传感器分析猫咪排泄习惯',
      '智能提醒：自动提醒更换猫砂和清洁',
      '静音技术：噪音<30dB，不打扰猫咪和主人'
    ]
  };
}

/**
 * 加载 Step 3 数据
 */
function loadStep3Data() {
  const savedData = localStorage.getItem('step3_strategy');

  if (savedData) {
    return JSON.parse(savedData);
  }

  // 默认数据（用于演示）
  return {
    competitors: [
      'Litter-Robot 4',
      'PetSafe ScoopFree',
      'Whisker Litter-Robot 3'
    ],
    listingStrategy: [
      '标题包含核心关键词：Self-Cleaning Cat Litter Box, Automatic, Smart',
      '高质量产品图（7-9张），展示APP界面和使用场景',
      '视频演示自动清洁过程和静音效果',
      '突出健康监测和智能提醒卖点'
    ],
    pricingStrategy: [
      '定价$189，对标Litter-Robot 4（$649）的平替市场',
      '首月促销：限时优惠$159 + 免费配件包',
      '会员订阅：$9.99/月，包含耗材和延保服务'
    ],
    promotionStrategy: [
      'Amazon PPC：投放品牌词和长尾词，ACoS控制在25%以内',
      'Deal活动：每月1次Lightning Deal，清库存促转化',
      '红人营销：合作3-5个宠物类KOL（粉丝10万+）',
      '社交媒体：TikTok和Instagram发布使用场景短视频'
    ]
  };
}

/**
 * 加载 Step 4 数据
 */
function loadStep4Data() {
  const savedData = localStorage.getItem('step4_costData');

  if (savedData) {
    return JSON.parse(savedData);
  }

  // 默认数据（用于演示）
  return {
    capex: {
      m1: 5250,
      m2: 28500,
      m3: 18500,
      total: 52250
    },
    opex: {
      m4: 19700,
      m5: 4350,
      m6: 9000,
      m7: 6800,
      m8: 11200,
      total: 51050
    },
    revenue: {
      sellingPrice: 189,
      monthlyUnits: 500,
      monthlyRevenue: 94500,
      platformFee: 15, // %
      netRevenue: 80325
    },
    profit: {
      monthlyProfit: 29275,
      profitMargin: 31.0, // %
      paybackPeriod: 1.8, // months
      roi: 67.2 // %
    }
  };
}

/**
 * 填充决策概览
 */
function populateDecisionOverview(step1, step2, step3, step4) {
  // 组合信息
  document.getElementById('overview-combination').textContent =
    `${step1.category} × ${step1.country} × ${step1.platform}`;

  // 产品信息
  document.getElementById('overview-product').textContent = step2.product;

  // 定价信息
  document.getElementById('overview-price').textContent = `$${step2.sellingPrice}`;

  // 月销量目标
  document.getElementById('overview-sales').textContent = `${step2.monthlyTarget} 单/月`;

  // 月利润
  document.getElementById('overview-profit').textContent =
    `$${step4.profit.monthlyProfit.toLocaleString()}`;

  // 回本周期
  document.getElementById('overview-payback').textContent =
    `${step4.profit.paybackPeriod} 个月`;

  // 综合评分
  document.getElementById('overall-score-number').textContent =
    Math.round(step1.score);

  // 决策徽章
  const decisionBadge = document.getElementById('overview-decision-badge');
  if (step1.score >= 60) {
    decisionBadge.className = 'decision-badge badge bg-success';
    decisionBadge.textContent = '✓ 建议推进';
  } else if (step1.score >= 50) {
    decisionBadge.className = 'decision-badge badge bg-warning';
    decisionBadge.textContent = '⚠ 谨慎推进';
  } else {
    decisionBadge.className = 'decision-badge badge bg-danger';
    decisionBadge.textContent = '✗ 不建议';
  }
}

/**
 * 填充 Step 1 总结
 */
function populateStep1Summary(data) {
  // 基本信息
  document.getElementById('s1-category').textContent = data.category;
  document.getElementById('s1-country').textContent = data.country;
  document.getElementById('s1-platform').textContent = data.platform;
  document.getElementById('s1-score').textContent = data.score.toFixed(1);

  // 五维分数
  const dimensions = [
    { id: 's1-ma-score', value: data.marketAttractiveness, max: 100 },
    { id: 's1-cf-score', value: data.competitiveFeasibility, max: 100 },
    { id: 's1-pp-score', value: data.profitPotential, max: 100 },
    { id: 's1-rf-score', value: data.riskFactor, max: 100 },
    { id: 's1-rc-score', value: data.resourceCompatibility, max: 100 }
  ];

  dimensions.forEach(dim => {
    const scoreEl = document.getElementById(dim.id);
    const barEl = scoreEl.nextElementSibling.querySelector('.mini-progress-bar');

    scoreEl.textContent = dim.value.toFixed(1);
    barEl.style.width = `${(dim.value / dim.max) * 100}%`;
  });

  // 关键洞察
  const insightList = document.getElementById('s1-insights');
  insightList.innerHTML = data.insights.map(insight =>
    `<li class="insight-item">• ${insight}</li>`
  ).join('');
}

/**
 * 填充 Step 2 总结
 */
function populateStep2Summary(data) {
  // 产品信息
  document.getElementById('s2-product').textContent = data.product;
  document.getElementById('s2-target-market').textContent = data.targetMarket;
  document.getElementById('s2-price').textContent = `$${data.sellingPrice}`;
  document.getElementById('s2-target-sales').textContent = `${data.monthlyTarget} 单/月`;

  // 核心功能
  const featureList = document.getElementById('s2-features');
  featureList.innerHTML = data.features.map(feature =>
    `<li class="feature-item">• ${feature}</li>`
  ).join('');

  // 差异化优势
  const diffList = document.getElementById('s2-differentiation');
  diffList.innerHTML = data.differentiation.map(diff => {
    const [title, desc] = diff.split('：');
    return `<li class="diff-item"><strong>${title}</strong>：${desc}</li>`;
  }).join('');
}

/**
 * 填充 Step 3 总结
 */
function populateStep3Summary(data) {
  // 竞品列表
  document.getElementById('s3-competitors').textContent = data.competitors.join('、');

  // Listing策略
  const listingList = document.getElementById('s3-listing-strategy');
  listingList.innerHTML = data.listingStrategy.map(item =>
    `<li class="strategy-item">• ${item}</li>`
  ).join('');

  // 定价策略
  const pricingList = document.getElementById('s3-pricing-strategy');
  pricingList.innerHTML = data.pricingStrategy.map(item =>
    `<li class="strategy-item">• ${item}</li>`
  ).join('');

  // 推广策略
  const promotionList = document.getElementById('s3-promotion-strategy');
  promotionList.innerHTML = data.promotionStrategy.map(item =>
    `<li class="strategy-item">• ${item}</li>`
  ).join('');
}

/**
 * 填充 Step 4 总结
 */
function populateStep4Summary(data) {
  // 成本信息
  document.getElementById('s4-capex').textContent = `$${data.capex.total.toLocaleString()}`;
  document.getElementById('s4-opex').textContent = `$${data.opex.total.toLocaleString()}`;

  // 收入信息
  document.getElementById('s4-revenue').textContent =
    `$${data.revenue.monthlyRevenue.toLocaleString()}`;

  // 利润信息
  document.getElementById('s4-profit').textContent =
    `$${data.profit.monthlyProfit.toLocaleString()}`;
  document.getElementById('s4-margin').textContent =
    `${data.profit.profitMargin}%`;
  document.getElementById('s4-payback').textContent =
    `${data.profit.paybackPeriod} 个月`;
  document.getElementById('s4-roi').textContent =
    `${data.profit.roi}%`;
}

/**
 * 填充最终评估
 */
function populateFinalEvaluation(step1Data, step4Data) {
  // 计算可行性综合得分
  const marketScore = step1Data.score;
  const financialScore = calculateFinancialScore(step4Data);
  const feasibilityScore = (marketScore * 0.6 + financialScore * 0.4).toFixed(1);

  // 更新进度条
  const progressBar = document.getElementById('feasibility-score-bar');
  const scoreLabel = document.getElementById('feasibility-score-label');

  progressBar.style.width = `${feasibilityScore}%`;
  scoreLabel.innerHTML = `可行性得分: <span>${feasibilityScore}</span> / 100`;

  // 更新维度得分
  const dimensions = [
    { id: 'dim-market', value: marketScore },
    { id: 'dim-financial', value: financialScore },
    { id: 'dim-competitive', value: step1Data.competitiveFeasibility },
    { id: 'dim-risk', value: step1Data.riskFactor },
    { id: 'dim-resource', value: step1Data.resourceCompatibility }
  ];

  dimensions.forEach(dim => {
    const scoreEl = document.getElementById(`${dim.id}-score`);
    const barEl = document.getElementById(`${dim.id}-bar`);

    if (scoreEl && barEl) {
      scoreEl.textContent = dim.value.toFixed(1);
      barEl.style.width = `${dim.value}%`;
    }
  });

  // 更新决策建议
  updateDecisionRecommendation(feasibilityScore, step4Data);
}

/**
 * 计算财务得分
 */
function calculateFinancialScore(step4Data) {
  const profitMargin = step4Data.profit.profitMargin;
  const paybackPeriod = step4Data.profit.paybackPeriod;
  const roi = step4Data.profit.roi;

  // 利润率评分（30%权重）
  let marginScore = 0;
  if (profitMargin >= 30) marginScore = 100;
  else if (profitMargin >= 20) marginScore = 80;
  else if (profitMargin >= 15) marginScore = 60;
  else marginScore = 40;

  // 回本周期评分（40%权重）
  let paybackScore = 0;
  if (paybackPeriod <= 2) paybackScore = 100;
  else if (paybackPeriod <= 3) paybackScore = 80;
  else if (paybackPeriod <= 4) paybackScore = 60;
  else paybackScore = 40;

  // ROI评分（30%权重）
  let roiScore = 0;
  if (roi >= 60) roiScore = 100;
  else if (roi >= 40) roiScore = 80;
  else if (roi >= 20) roiScore = 60;
  else roiScore = 40;

  return marginScore * 0.3 + paybackScore * 0.4 + roiScore * 0.3;
}

/**
 * 更新决策建议
 */
function updateDecisionRecommendation(score, step4Data) {
  const alertBox = document.querySelector('.decision-alert');
  const heading = alertBox.querySelector('.alert-heading');
  const text = alertBox.querySelector('p');

  if (score >= 70) {
    alertBox.className = 'alert decision-alert alert-success';
    heading.innerHTML = '✓ 强烈建议推进';
    text.textContent = '该产品组合在市场吸引力和财务可行性方面表现优秀，建议立即启动项目。预计' +
      `${step4Data.profit.paybackPeriod}个月回本，月利润可达$${step4Data.profit.monthlyProfit.toLocaleString()}。`;
  } else if (score >= 60) {
    alertBox.className = 'alert decision-alert alert-info';
    heading.innerHTML = '→ 建议推进';
    text.textContent = '该产品组合具有较好的市场机会和盈利潜力，建议推进但需关注成本控制和竞争风险。';
  } else if (score >= 50) {
    alertBox.className = 'alert decision-alert alert-warning';
    heading.innerHTML = '⚠ 谨慎推进';
    text.textContent = '该产品组合存在一定风险，建议进一步优化产品定位、降低成本或调整运营策略后再推进。';
  } else {
    alertBox.className = 'alert decision-alert alert-danger';
    heading.innerHTML = '✗ 不建议推进';
    text.textContent = '该产品组合在当前条件下可行性较低，建议重新评估市场机会或更换其他产品组合。';
  }
}

// ========================================
// 导出功能
// ========================================

/**
 * 绑定导出按钮事件
 */
function bindExportEvents() {
  const pdfBtn = document.getElementById('export-pdf-btn');
  const excelBtn = document.getElementById('export-excel-btn');

  if (pdfBtn) {
    pdfBtn.addEventListener('click', exportToPDF);
  }

  if (excelBtn) {
    excelBtn.addEventListener('click', exportToExcel);
  }
}

/**
 * 导出为 PDF
 */
function exportToPDF() {
  console.log('开始导出 PDF...');

  // 检查 html2pdf 库是否加载
  if (typeof html2pdf === 'undefined') {
    alert('PDF导出库未加载，请确保已引入 html2pdf.js');
    return;
  }

  // 获取要导出的容器
  const element = document.getElementById('step5-container');

  // 配置选项
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `选品报告_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#121212'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.summary-card'
    }
  };

  // 生成 PDF
  html2pdf().set(opt).from(element).save().then(() => {
    console.log('PDF 导出成功');
  }).catch(err => {
    console.error('PDF 导出失败:', err);
    alert('PDF导出失败，请查看控制台');
  });
}

/**
 * 导出为 Excel（数据格式）
 */
function exportToExcel() {
  console.log('开始导出 Excel 数据...');

  // 收集所有数据
  const step1Data = loadStep1Data();
  const step2Data = loadStep2Data();
  const step3Data = loadStep3Data();
  const step4Data = loadStep4Data();

  // 构建数据表格
  const data = {
    '决策概览': [
      ['项目', '值'],
      ['品类', step1Data.category],
      ['国家', step1Data.country],
      ['平台', step1Data.platform],
      ['产品', step2Data.product],
      ['定价', `$${step2Data.sellingPrice}`],
      ['月销量目标', `${step2Data.monthlyTarget} 单`],
      ['月利润', `$${step4Data.profit.monthlyProfit}`],
      ['回本周期', `${step4Data.profit.paybackPeriod} 个月`],
      ['综合评分', step1Data.score.toFixed(1)]
    ],
    '市场机会': [
      ['维度', '得分'],
      ['市场吸引力', step1Data.marketAttractiveness.toFixed(1)],
      ['竞争可行性', step1Data.competitiveFeasibility.toFixed(1)],
      ['利润潜力', step1Data.profitPotential.toFixed(1)],
      ['风险因素', step1Data.riskFactor.toFixed(1)],
      ['资源匹配', step1Data.resourceCompatibility.toFixed(1)]
    ],
    '成本核算': [
      ['项目', '金额'],
      ['CAPEX总计', `$${step4Data.capex.total}`],
      ['- M1 市场准入', `$${step4Data.capex.m1}`],
      ['- M2 渠道建设', `$${step4Data.capex.m2}`],
      ['- M3 供应链搭建', `$${step4Data.capex.m3}`],
      ['OPEX总计', `$${step4Data.opex.total}`],
      ['- M4 商品成本', `$${step4Data.opex.m4}`],
      ['- M5 履约物流', `$${step4Data.opex.m5}`],
      ['- M6 营销获客', `$${step4Data.opex.m6}`],
      ['- M7 渠道使用', `$${step4Data.opex.m7}`],
      ['- M8 运营维护', `$${step4Data.opex.m8}`]
    ],
    '财务指标': [
      ['项目', '值'],
      ['月收入', `$${step4Data.revenue.monthlyRevenue}`],
      ['月利润', `$${step4Data.profit.monthlyProfit}`],
      ['利润率', `${step4Data.profit.profitMargin}%`],
      ['回本周期', `${step4Data.profit.paybackPeriod} 个月`],
      ['ROI', `${step4Data.profit.roi}%`]
    ]
  };

  // 转换为 CSV 格式（简化版）
  let csv = '';
  for (const [sheetName, rows] of Object.entries(data)) {
    csv += `\n\n=== ${sheetName} ===\n`;
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });
  }

  // 创建下载链接
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `选品数据_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('Excel 数据导出成功');
}

console.log('Step 5 JavaScript 加载完成');
