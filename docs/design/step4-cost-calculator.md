# Step 4: 成本核算与利润验证 - 产品设计文档

## 一、设计理念

基于 **GECOM 全球电商成本优化方法论**，Step 4 提供一个全面的成本核算与利润验证模块。本模块展示 M1-M8 全流程成本考量因素，帮助决策者在产品选择的最后阶段验证商业可行性。

### 设计原则
- **全面性**：覆盖 GECOM M1-M8 所有成本模块
- **可视化**：通过简洁的表单和图表展示复杂的成本结构
- **集成性**：自动读取 Step 2 (Charter) 和 Step 3 (运营策略) 的数据
- **可操作性**：提供清晰的可行性判断和优化建议

---

## 二、模块架构

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  Step 4: 成本核算与利润验证                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Tab 1: 启动成本 CAPEX]  [Tab 2: 运营成本 OPEX]          │
│  [Tab 3: 利润计算]        [Tab 4: 可行性报告]             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 四个核心 Tab

#### Tab 1: 启动成本 (Phase 0-1 CAPEX)
- M1: 市场准入与主体合规
- M2: 渠道建设与技术架构
- M3: 供应链准备与产品合规

#### Tab 2: 运营成本 (Phase 1-N OPEX)
- M4: 商品成本与税费
- M5: 履约执行与物流
- M6: 营销与获客
- M7: 渠道使用与交易
- M8: 综合运营与维护

#### Tab 3: 利润计算
- TCO 总成本汇总
- 收入预测
- 利润分析
- 盈亏平衡点

#### Tab 4: 可行性报告
- 综合评分
- 风险预警
- 优化建议
- 决策建议

---

## 三、详细设计

### 3.1 Tab 1: 启动成本 (CAPEX)

#### M1: 市场准入与主体合规

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M1: 市场准入与主体合规                     │
├─────────────────────────────────────────┤
│ 目标市场: [美国 ▼]                        │
│                                         │
│ □ 法律主体设立        $2,000 - $5,000   │
│ □ 商业许可证          $500 - $2,000     │
│ □ 税务登记 (EIN/VAT)  $0 - $1,000       │
│ □ 银行账户开设        $0 - $500         │
│                                         │
│ 小计: $2,500 - $8,500                   │
└─────────────────────────────────────────┘
```

**输入字段：**
- 目标市场（下拉选择：美国/英国/德国/日本等）
- 各项成本的实际金额输入（带默认值和区间提示）

**数据来源提示：**
- 显示数据可靠性等级（Tier 1/2/3）
- 提供参考链接（如政府官网、服务商报价）

---

#### M2: 渠道建设与技术架构

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M2: 渠道建设与技术架构                     │
├─────────────────────────────────────────┤
│ 销售模式: [Amazon FBA ▼]                 │
│                                         │
│ □ DTC 官网开发        $5,000 - $20,000  │
│ □ 平台店铺开设        $0 - $500         │
│ □ ERP/WMS 系统        $2,000 - $10,000  │
│ □ 支付网关集成        $500 - $2,000     │
│ □ 域名与服务器        $200 - $1,000     │
│                                         │
│ 小计: $7,700 - $33,500                  │
└─────────────────────────────────────────┘
```

**输入字段：**
- 销售模式（DTC独立站 / Amazon FBA / 平台分销 / 混合模式）
- 各项成本实际金额

**智能提示：**
- 根据 Step 3 的渠道策略自动推荐模式
- 不同模式下隐藏/显示相关成本项

---

#### M3: 供应链准备与产品合规

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M3: 供应链准备与产品合规                   │
├─────────────────────────────────────────┤
│ 产品类目: [宠物食品 ▼]                    │
│                                         │
│ □ FDA/CE/UKCA 认证    $3,000 - $15,000  │
│ □ 产品测试与检验      $1,000 - $5,000    │
│ □ 包装设计与模具      $2,000 - $8,000    │
│ □ 首批库存采购        $10,000 - $50,000  │
│ □ 海外仓建设          $5,000 - $20,000   │
│                                         │
│ 小计: $21,000 - $98,000                 │
└─────────────────────────────────────────┘
```

**输入字段：**
- 产品类目（自动从 Step 2 Charter 读取）
- 各项成本实际金额

**行业库支持：**
- GECOM-Pet: 宠物产品（FDA registration）
- GECOM-Vape: 电子烟（PACT Act, PMTA）
- GECOM-Food: 食品饮料（FDA, Organic认证）
- 通用类目

---

#### CAPEX 汇总卡片

```
┌─────────────────────────────────────────┐
│ 启动成本总计 (Phase 0-1)                  │
├─────────────────────────────────────────┤
│ M1: 市场准入与主体合规     $5,000        │
│ M2: 渠道建设与技术架构     $15,000       │
│ M3: 供应链准备与产品合规   $35,000       │
│ ─────────────────────────────────────   │
│ 总计 CAPEX:               $55,000       │
│                                         │
│ 📊 [查看成本分布饼图]                     │
└─────────────────────────────────────────┘
```

---

### 3.2 Tab 2: 运营成本 (OPEX)

#### M4: 商品成本与税费

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M4: 商品成本与税费 (单位: 每月)            │
├─────────────────────────────────────────┤
│ 销售目标: [1000 件/月]                    │
│                                         │
│ • COGS (单位成本)        $15.00         │
│ • 头程物流 (中国→美国)   $3.50          │
│ • 进口关税 (HS Code)     $1.20          │
│ • 销售税 (VAT/GST)       7% of price    │
│                                         │
│ 月度小计: $19,700                        │
└─────────────────────────────────────────┘
```

**输入字段：**
- 月销售目标（件数）
- 单位 COGS
- 头程物流成本
- 关税税率（根据 HS Code 自动查询）
- 销售税率

**智能计算：**
- 根据 Step 3 的流量预估自动推算月销量
- HS Code 税率查询（Tier 1 数据源：USITC, EU TARIC）

---

#### M5: 履约执行与物流

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M5: 履约执行与物流 (单位: 每月)            │
├─────────────────────────────────────────┤
│ 物流模式: [Amazon FBA ▼]                 │
│                                         │
│ • 仓储费 (Warehouse)     $0.75/unit     │
│ • FBA 配送费             $3.50/unit     │
│ • 退货处理费             $2.00/unit     │
│ • 退货率                 5%             │
│                                         │
│ 月度小计: $4,350                         │
└─────────────────────────────────────────┘
```

**输入字段：**
- 物流模式（FBA / 自发货 / 3PL）
- 仓储费（每件）
- 配送费（每件）
- 退货率

**行业参考数据：**
- Amazon FBA 标准费率表
- 3PL 报价（Tier 2 数据）

---

#### M6: 营销与获客

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M6: 营销与获客 (单位: 每月)                │
├─────────────────────────────────────────┤
│ 自动读取 Step 3 流量策略:                 │
│ • PPC 广告预算          $5,000          │
│ • 网红营销 (KOL)        $2,000          │
│ • 社交媒体广告          $1,500          │
│ • 联盟营销 (Affiliate)  $500            │
│                                         │
│ 月度小计: $9,000                         │
│ CAC (获客成本): $9.00/客户               │
└─────────────────────────────────────────┘
```

**输入字段：**
- 各渠道广告预算（自动从 Step 3 读取，可手动调整）
- 预期转化率

**智能分析：**
- 计算 CAC (Customer Acquisition Cost)
- 与行业 benchmark 对比

---

#### M7: 渠道使用与交易

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M7: 渠道使用与交易 (单位: 每月)            │
├─────────────────────────────────────────┤
│ 销售渠道: Amazon                         │
│                                         │
│ • 平台佣金               15% of sales   │
│ • 支付处理费             2.9% + $0.30   │
│ • SaaS 工具订阅          $200           │
│ • 数据分析工具           $100           │
│                                         │
│ 月度小计: $6,800                         │
└─────────────────────────────────────────┘
```

**输入字段：**
- 销售渠道（Amazon / eBay / Shopify / 独立站）
- 平台佣金率
- 支付费率
- SaaS 工具成本

---

#### M8: 综合运营与维护

**展示内容：**
```
┌─────────────────────────────────────────┐
│ M8: 综合运营与维护 (单位: 每月)            │
├─────────────────────────────────────────┤
│ • 运营团队 (2人)         $8,000         │
│ • 客服外包               $1,500         │
│ • 法务与财务服务         $1,000         │
│ • 合规维护 (年度审核)    $200           │
│ • 办公与软件费用         $500           │
│                                         │
│ 月度小计: $11,200                        │
└─────────────────────────────────────────┘
```

**输入字段：**
- 团队人数及成本
- 外包服务费用
- 合规维护费用

---

#### OPEX 汇总卡片

```
┌─────────────────────────────────────────┐
│ 运营成本总计 (Phase 1-N 月度)             │
├─────────────────────────────────────────┤
│ M4: 商品成本与税费        $19,700       │
│ M5: 履约执行与物流        $4,350        │
│ M6: 营销与获客            $9,000        │
│ M7: 渠道使用与交易        $6,800        │
│ M8: 综合运营与维护        $11,200       │
│ ─────────────────────────────────────   │
│ 月度 OPEX:               $51,050        │
│                                         │
│ 📊 [查看成本结构柱状图]                   │
└─────────────────────────────────────────┘
```

---

### 3.3 Tab 3: 利润计算

#### 收入预测

```
┌─────────────────────────────────────────┐
│ 收入预测 (月度)                          │
├─────────────────────────────────────────┤
│ 自动读取 Step 2 Charter:                 │
│ • 产品名称: 智能宠物喂食器                │
│ • 目标价格: $49.99                       │
│                                         │
│ 自动读取 Step 3 预测:                    │
│ • 月销售量: 1,000 件                     │
│ • 退货率: 5%                             │
│                                         │
│ 计算:                                    │
│ • 毛销售额: $49,990                      │
│ • 退货扣减: -$2,500                      │
│ • 净收入: $47,490                        │
└─────────────────────────────────────────┘
```

---

#### 成本汇总

```
┌─────────────────────────────────────────┐
│ 成本汇总                                 │
├─────────────────────────────────────────┤
│ 启动成本 (CAPEX - 一次性):               │
│ • Phase 0-1 总计: $55,000               │
│                                         │
│ 运营成本 (OPEX - 月度):                  │
│ • Phase 1-N 总计: $51,050               │
│                                         │
│ TCO (6个月):                             │
│ • CAPEX: $55,000                        │
│ • OPEX × 6: $306,300                    │
│ • 总计: $361,300                         │
└─────────────────────────────────────────┘
```

---

#### 利润分析

```
┌─────────────────────────────────────────┐
│ 利润分析 (月度)                          │
├─────────────────────────────────────────┤
│ 净收入:              $47,490            │
│ 月度 OPEX:           -$51,050           │
│ ─────────────────────────────────────   │
│ 月度净利润:          -$3,560 ⚠️         │
│ 净利润率:            -7.5%              │
│                                         │
│ 盈亏平衡点分析:                          │
│ • CAPEX 回收: 15.5 个月 ⚠️               │
│ • 月销量需达到: 1,150 件 才能盈亏平衡    │
└─────────────────────────────────────────┘
```

**可视化图表：**

1. **成本结构饼图**（ECharts）
   - CAPEX vs OPEX
   - OPEX 细分（M4-M8）

2. **利润趋势折线图**（6个月预测）
   - 累计收入
   - 累计成本
   - 累计利润

3. **盈亏平衡分析图**
   - Break-even point 标注

---

### 3.4 Tab 4: 可行性报告

#### 综合评分卡

```
┌─────────────────────────────────────────┐
│ 可行性综合评分                           │
├─────────────────────────────────────────┤
│                                         │
│  [========>--------]  62/100 ⚠️         │
│                                         │
│  财务可行性:  60/100  ⚠️                 │
│  市场可行性:  75/100  ✅                 │
│  运营可行性:  55/100  ⚠️                 │
│  合规可行性:  80/100  ✅                 │
│                                         │
│  结论: 需要优化后再执行                   │
└─────────────────────────────────────────┘
```

**评分逻辑：**
- 财务可行性：基于净利润率、回本周期
- 市场可行性：基于 Step 1 综合分数、Step 3 竞争分析
- 运营可行性：基于流量获取难度、转化率
- 合规可行性：基于 M1、M3 的合规成本和复杂度

---

#### 风险预警

```
┌─────────────────────────────────────────┐
│ 风险预警 🚨                              │
├─────────────────────────────────────────┤
│ ⚠️ 高风险项:                             │
│                                         │
│ 1. 月度运营亏损 $3,560                   │
│    → 净利润率为负，需优化成本结构         │
│                                         │
│ 2. CAPEX 回收周期过长 (15.5个月)          │
│    → 建议降低启动成本或提高售价           │
│                                         │
│ 3. 获客成本偏高 ($9.00/客户)             │
│    → CAC/LTV 比例不健康，需优化营销策略   │
│                                         │
│ ✅ 低风险项:                             │
│ • 合规成本可控                           │
│ • 供应链稳定                             │
└─────────────────────────────────────────┘
```

---

#### 优化建议

```
┌─────────────────────────────────────────┐
│ AI 优化建议 💡                           │
├─────────────────────────────────────────┤
│ 基于 GECOM 方法论的优化路径:              │
│                                         │
│ 🎯 短期优化 (0-3个月):                   │
│                                         │
│ 1. M6 营销优化                           │
│    • 降低 PPC 预算 30% → 节省 $1,500/月  │
│    • 增加 Organic SEO 投入               │
│                                         │
│ 2. M4 供应链优化                         │
│    • 寻找成本更低的供应商 (-10% COGS)    │
│    • 潜在节省: $1,500/月                 │
│                                         │
│ 3. M7 渠道组合                           │
│    • 尝试 Shopify DTC (佣金更低)         │
│    • 潜在节省: $800/月                   │
│                                         │
│ 🚀 中期优化 (3-6个月):                   │
│                                         │
│ 4. M5 物流模式切换                       │
│    • 从 FBA 切换到 3PL 海外仓            │
│    • 潜在节省: $1,200/月                 │
│                                         │
│ 5. 定价策略调整                          │
│    • 提价至 $54.99 (+10%)               │
│    • 增加月收入: $5,000                  │
│                                         │
│ 📊 优化后预测:                           │
│ • 月度净利润: $2,440 ✅                  │
│ • 净利润率: 4.6% ✅                      │
│ • CAPEX 回收: 10.2 个月 ✅               │
└─────────────────────────────────────────┘
```

---

#### 决策建议

```
┌─────────────────────────────────────────┐
│ 最终决策建议                             │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ 建议: 优化后执行                     │
│                                         │
│  当前状态下不建议立即启动，需完成以下优化:│
│                                         │
│  ☑️ 必须项:                              │
│  • 降低 COGS 至少 10%                    │
│  • 优化营销预算，降低 CAC                │
│  • 考虑提价或推出高价 SKU                │
│                                         │
│  ☐ 建议项:                               │
│  • 探索 3PL 替代 FBA                     │
│  • 增加 DTC 渠道分散风险                 │
│                                         │
│  优化完成后，预期可实现:                  │
│  ✅ 月度盈利 $2,000+                     │
│  ✅ 回本周期 < 12个月                    │
│  ✅ 净利润率 > 5%                        │
│                                         │
│  [导出完整报告 PDF] [返回修改参数]        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 四、数据流设计

### 4.1 输入数据源

#### 从 Step 2 (Charter) 读取：
```javascript
const charterData = {
  productName: "智能宠物喂食器",
  targetPrice: 49.99,
  category: "宠物用品",
  coreFeatures: ["定时喂食", "APP控制", "语音提醒"],
  differentiation: "AI宠物行为识别"
};
```

#### 从 Step 3 (运营策略) 读取：
```javascript
const strategyData = {
  channel: "Amazon FBA",
  ppcBudget: 5000,
  estimatedMonthlyUnits: 1000,
  conversionRate: 3.5,
  competitorPrice: 44.99
};
```

---

### 4.2 输出数据

Step 4 输出的数据可供后续决策使用：

```javascript
const step4Output = {
  // 成本数据
  capex: 55000,
  monthlyOpex: 51050,
  tco6Months: 361300,

  // 收入与利润
  monthlyRevenue: 47490,
  monthlyProfit: -3560,
  profitMargin: -7.5,

  // 可行性评分
  feasibilityScore: 62,
  financialScore: 60,
  marketScore: 75,
  operationalScore: 55,
  complianceScore: 80,

  // 决策建议
  recommendation: "optimize_before_launch",
  risks: [
    "月度运营亏损",
    "CAPEX回收周期过长",
    "获客成本偏高"
  ],
  optimizations: [
    "降低COGS 10%",
    "减少PPC预算30%",
    "考虑提价至$54.99"
  ]
};
```

---

## 五、UI/UX 设计规范

### 5.1 布局结构

```html
<!-- Step 4 HTML 片段结构 -->
<div id="step4-container">
  <!-- Tab 导航 -->
  <ul class="nav nav-tabs mb-4" id="step4Tabs">
    <li class="nav-item">
      <a class="nav-link active" data-bs-toggle="tab" href="#capex">
        启动成本 (CAPEX)
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#opex">
        运营成本 (OPEX)
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#profit">
        利润计算
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#feasibility">
        可行性报告
      </a>
    </li>
  </ul>

  <!-- Tab 内容 -->
  <div class="tab-content">
    <div class="tab-pane fade show active" id="capex">
      <!-- M1, M2, M3 模块 -->
    </div>
    <div class="tab-pane fade" id="opex">
      <!-- M4, M5, M6, M7, M8 模块 -->
    </div>
    <div class="tab-pane fade" id="profit">
      <!-- 收入、成本、利润分析 -->
    </div>
    <div class="tab-pane fade" id="feasibility">
      <!-- 评分、风险、建议、决策 -->
    </div>
  </div>
</div>
```

---

### 5.2 深色主题样式

继承 Step 1-3 的深色主题规范：

```css
/* Step 4 特定样式 */
.cost-module-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.cost-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.cost-input-group label {
  flex: 1;
  color: #b0b0b0;
}

.cost-input-group input {
  width: 150px;
  background: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
}

.cost-summary-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #2a2a3e 100%);
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
}

.cost-summary-total {
  font-size: 32px;
  font-weight: bold;
  color: #4fc3f7;
}

/* 可行性评分进度条 */
.feasibility-bar {
  height: 30px;
  background: #2a2a2a;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.feasibility-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
  transition: width 0.6s ease;
}

/* 风险预警卡片 */
.risk-card-high {
  border-left: 4px solid #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.risk-card-low {
  border-left: 4px solid #4caf50;
  background: rgba(76, 175, 80, 0.1);
}
```

---

### 5.3 ECharts 图表配置

#### 成本结构饼图
```javascript
const costPieChart = {
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#333',
    textStyle: { color: '#fff' }
  },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    label: {
      color: '#fff'
    },
    data: [
      { value: 19700, name: 'M4 商品成本与税费' },
      { value: 4350, name: 'M5 履约执行与物流' },
      { value: 9000, name: 'M6 营销与获客' },
      { value: 6800, name: 'M7 渠道使用与交易' },
      { value: 11200, name: 'M8 综合运营与维护' }
    ]
  }]
};
```

#### 利润趋势折线图
```javascript
const profitTrendChart = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  legend: {
    data: ['累计收入', '累计成本', '累计利润'],
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: 'category',
    data: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
    axisLine: { lineStyle: { color: '#444' } },
    axisLabel: { color: '#b0b0b0' }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#444' } },
    axisLabel: { color: '#b0b0b0' },
    splitLine: { lineStyle: { color: '#333' } }
  },
  series: [
    {
      name: '累计收入',
      type: 'line',
      data: [47490, 94980, 142470, 189960, 237450, 284940],
      itemStyle: { color: '#4caf50' }
    },
    {
      name: '累计成本',
      type: 'line',
      data: [106050, 157100, 208150, 259200, 310250, 361300],
      itemStyle: { color: '#f44336' }
    },
    {
      name: '累计利润',
      type: 'line',
      data: [-58560, -62120, -65680, -69240, -72800, -76360],
      itemStyle: { color: '#ff9800' }
    }
  ]
};
```

---

## 六、技术实现要点

### 6.1 前端计算逻辑

```javascript
// GECOM 计算引擎 (简化版)
class GECOMCalculator {
  constructor() {
    this.capex = { m1: 0, m2: 0, m3: 0 };
    this.opex = { m4: 0, m5: 0, m6: 0, m7: 0, m8: 0 };
    this.revenue = 0;
    this.units = 0;
  }

  // 计算总成本
  calculateTotalCost(months = 6) {
    const totalCapex = this.capex.m1 + this.capex.m2 + this.capex.m3;
    const monthlyOpex = Object.values(this.opex).reduce((a, b) => a + b, 0);
    return totalCapex + (monthlyOpex * months);
  }

  // 计算月度利润
  calculateMonthlyProfit() {
    const monthlyOpex = Object.values(this.opex).reduce((a, b) => a + b, 0);
    return this.revenue - monthlyOpex;
  }

  // 计算盈亏平衡点
  calculateBreakEven() {
    const totalCapex = Object.values(this.capex).reduce((a, b) => a + b, 0);
    const monthlyProfit = this.calculateMonthlyProfit();

    if (monthlyProfit <= 0) {
      return Infinity; // 永远无法回本
    }

    return totalCapex / monthlyProfit;
  }

  // 可行性评分
  calculateFeasibility() {
    const profitMargin = (this.calculateMonthlyProfit() / this.revenue) * 100;
    const breakEven = this.calculateBreakEven();

    let financialScore = 0;
    if (profitMargin > 20) financialScore = 100;
    else if (profitMargin > 10) financialScore = 80;
    else if (profitMargin > 5) financialScore = 60;
    else if (profitMargin > 0) financialScore = 40;
    else financialScore = 20;

    if (breakEven < 12) financialScore += 10;
    else if (breakEven < 18) financialScore += 5;

    return Math.min(financialScore, 100);
  }
}
```

---

### 6.2 数据持久化

使用 localStorage 保存用户输入的成本数据：

```javascript
// 保存数据
function saveStep4Data() {
  const data = {
    capex: gecomCalc.capex,
    opex: gecomCalc.opex,
    revenue: gecomCalc.revenue,
    units: gecomCalc.units,
    timestamp: Date.now()
  };
  localStorage.setItem('step4_data', JSON.stringify(data));
}

// 加载数据
function loadStep4Data() {
  const saved = localStorage.getItem('step4_data');
  if (saved) {
    const data = JSON.parse(saved);
    gecomCalc.capex = data.capex;
    gecomCalc.opex = data.opex;
    gecomCalc.revenue = data.revenue;
    gecomCalc.units = data.units;
  }
}
```

---

### 6.3 集成 Step 2 & Step 3 数据

```javascript
// 从 localStorage 读取前序步骤数据
function loadPreviousStepsData() {
  // Step 2 Charter
  const charter = JSON.parse(localStorage.getItem('step2_charter') || '{}');
  document.getElementById('productName').value = charter.productName || '';
  document.getElementById('targetPrice').value = charter.targetPrice || 49.99;

  // Step 3 Strategy
  const strategy = JSON.parse(localStorage.getItem('step3_strategy') || '{}');
  document.getElementById('ppcBudget').value = strategy.ppcBudget || 5000;
  document.getElementById('monthlyUnits').value = strategy.estimatedUnits || 1000;

  // 自动计算收入
  const price = parseFloat(charter.targetPrice || 49.99);
  const units = parseInt(strategy.estimatedUnits || 1000);
  gecomCalc.revenue = price * units;
  gecomCalc.units = units;
}
```

---

## 七、MVP 实施优先级

### P0 (核心功能 - 必须实现)
- ✅ 4个 Tab 的基础布局
- ✅ M1-M8 所有模块的输入表单
- ✅ CAPEX 和 OPEX 自动汇总计算
- ✅ 利润计算逻辑（收入 - 成本）
- ✅ 可行性评分（财务评分 60-100）
- ✅ 成本结构饼图（ECharts）

### P1 (重要功能 - 优先实现)
- ✅ 从 Step 2/3 自动读取数据
- ✅ 利润趋势折线图（6个月预测）
- ✅ 盈亏平衡点计算
- ✅ 风险预警列表（3-5条）
- ✅ 优化建议生成（基于规则）

### P2 (增强功能 - 后续迭代)
- ⏸️ 行业库支持（GECOM-Pet, GECOM-Vape）
- ⏸️ HS Code 关税自动查询（API集成）
- ⏸️ 数据可靠性等级显示（Tier 1/2/3）
- ⏸️ 导出 PDF 报告
- ⏸️ 多场景对比（保守/中性/乐观）

---

## 八、文件结构

```
/product-selection
│
├── modules/
│   └── step4.html              # Step 4 HTML 片段
│
├── assets/
│   ├── css/
│   │   └── step4.css           # Step 4 样式
│   │
│   ├── js/
│   │   └── step4.js            # Step 4 逻辑
│   │
│   └── data/
│       └── step4-mock-data.js  # 默认值与示例数据
│
└── index.html                  # 主页面 (集成 Step 4 Tab)
```

---

## 九、下一步行动

1. **创建 step4-development-plan.md** - 详细开发计划文档
2. **实现 modules/step4.html** - HTML 结构
3. **实现 assets/css/step4.css** - 深色主题样式
4. **实现 assets/js/step4.js** - GECOM 计算逻辑
5. **实现 assets/data/step4-mock-data.js** - 默认数据
6. **集成到 index.html** - 添加 Step 4 Tab

---

## 十、成功验收标准

### 功能验收
- [ ] 用户可以在 M1-M8 所有模块中输入成本数据
- [ ] 系统自动计算 CAPEX、OPEX、TCO
- [ ] 系统自动从 Step 2/3 读取产品名称、价格、销量
- [ ] 利润计算准确（收入 - OPEX）
- [ ] 可行性评分显示（0-100）
- [ ] 显示至少 3 条风险预警
- [ ] 显示至少 3 条优化建议

### 视觉验收
- [ ] 深色主题一致性（与 Step 1-3 保持统一）
- [ ] 成本结构饼图正常渲染
- [ ] 利润趋势折线图正常渲染
- [ ] 响应式布局适配（1920px / 1440px / 1280px）

### 性能验收
- [ ] 页面加载时间 < 1秒
- [ ] 输入变化后计算响应 < 100ms
- [ ] 图表渲染流畅（60fps）

---

## 附录：GECOM 参考数据

### A. 美国市场标准费率（2025）

#### M4: 税费参考
- 进口关税（宠物用品 HS 4201）: 4.5%
- 销售税（加州）: 7.25%
- 销售税（德州）: 6.25%

#### M5: 物流费率
- Amazon FBA 小件（<1lb）: $3.22
- Amazon FBA 标准（1-2lb）: $3.86
- 3PL 仓储费: $0.50-1.00/unit/月

#### M6: 营销 Benchmark
- Amazon PPC 平均 CPC: $0.80-1.50
- Facebook Ads CPM: $10-15
- 宠物用品平均 CAC: $8-12

#### M7: 平台费率
- Amazon 佣金（宠物用品）: 15%
- eBay 佣金: 12.35% + $0.30
- Shopify 支付: 2.9% + $0.30

---

### B. 行业库示例

#### GECOM-Pet (宠物用品)
- FDA Registration: $5,000
- Pet Safe Certification: $2,000
- Typical Return Rate: 3-5%
- Average COGS: $10-20

#### GECOM-Vape (电子烟)
- PMTA (FDA): $100,000+
- PACT Act Compliance: $5,000
- Excise Tax (联邦): 50% of price
- DTC Conversion Rate: 1-2%

---

**文档版本**: v1.0
**最后更新**: 2025-11
**作者**: AI 选品助手团队
**基于**: GECOM V2.2 全球电商成本优化方法论
