# Step 4: 成本核算与利润验证 - 开发计划

## 一、开发概览

### 1.1 开发目标
实现基于 GECOM 方法论的成本核算与利润验证模块，覆盖 M1-M8 全部成本模块，并提供可行性评估和优化建议。

### 1.2 开发周期
预计总时长: **6-8 小时**

### 1.3 技术栈
- HTML5 (模块化片段)
- CSS3 (深色主题)
- Vanilla JavaScript (ES6+)
- ECharts 5.x (数据可视化)
- Bootstrap 5.x (UI框架)

---

## 二、开发阶段分解

### Phase 1: 基础架构搭建 (1.5小时)

#### 1.1 创建文件结构
```bash
/product-selection
├── modules/
│   └── step4.html              # 新建
├── assets/
│   ├── css/
│   │   └── step4.css           # 新建
│   ├── js/
│   │   └── step4.js            # 新建
│   └── data/
│       └── step4-mock-data.js  # 新建
```

#### 1.2 HTML 基础框架 (modules/step4.html)
```html
<!-- Step 4 主容器 -->
<div id="step4-container" class="step-container">
  <!-- 头部标题 -->
  <div class="step-header">
    <h2>Step 4: 成本核算与利润验证</h2>
    <p class="text-muted">基于 GECOM 全球电商成本优化方法论 (M1-M8)</p>
  </div>

  <!-- Tab 导航 -->
  <ul class="nav nav-tabs mb-4" id="step4Tabs" role="tablist">
    <li class="nav-item">
      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#capex">
        启动成本 (CAPEX)
      </button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#opex">
        运营成本 (OPEX)
      </button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profit">
        利润计算
      </button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#feasibility">
        可行性报告
      </button>
    </li>
  </ul>

  <!-- Tab 内容区域 -->
  <div class="tab-content" id="step4TabContent">
    <!-- Tab 1: CAPEX -->
    <div class="tab-pane fade show active" id="capex">
      <div id="capexContent"></div>
    </div>

    <!-- Tab 2: OPEX -->
    <div class="tab-pane fade" id="opex">
      <div id="opexContent"></div>
    </div>

    <!-- Tab 3: Profit -->
    <div class="tab-pane fade" id="profit">
      <div id="profitContent"></div>
    </div>

    <!-- Tab 4: Feasibility -->
    <div class="tab-pane fade" id="feasibility">
      <div id="feasibilityContent"></div>
    </div>
  </div>
</div>
```

**验收标准:**
- [ ] HTML 文件创建成功
- [ ] Tab 切换功能正常
- [ ] 与 index.html 集成无报错

---

### Phase 2: CAPEX 模块开发 (2小时)

#### 2.1 M1: 市场准入与主体合规

**HTML 结构:**
```html
<div class="gecom-module-card">
  <div class="module-header">
    <h4>M1: 市场准入与主体合规</h4>
    <span class="data-tier">数据等级: Tier 2</span>
  </div>

  <div class="module-body">
    <div class="form-group mb-3">
      <label>目标市场</label>
      <select id="m1-market" class="form-select">
        <option value="US">美国</option>
        <option value="UK">英国</option>
        <option value="DE">德国</option>
        <option value="JP">日本</option>
      </select>
    </div>

    <div class="cost-item-row">
      <div class="cost-item-checkbox">
        <input type="checkbox" id="m1-legal-entity" checked>
        <label>法律主体设立 (LLC/GmbH)</label>
      </div>
      <div class="cost-item-input">
        <input type="number" class="form-control" value="3500" min="0" step="100">
        <span class="input-unit">USD</span>
      </div>
      <div class="cost-item-range text-muted">
        参考范围: $2,000 - $5,000
      </div>
    </div>

    <div class="cost-item-row">
      <div class="cost-item-checkbox">
        <input type="checkbox" id="m1-license" checked>
        <label>商业许可证</label>
      </div>
      <div class="cost-item-input">
        <input type="number" class="form-control" value="1000" min="0" step="100">
        <span class="input-unit">USD</span>
      </div>
      <div class="cost-item-range text-muted">
        参考范围: $500 - $2,000
      </div>
    </div>

    <div class="cost-item-row">
      <div class="cost-item-checkbox">
        <input type="checkbox" id="m1-tax-registration" checked>
        <label>税务登记 (EIN/VAT)</label>
      </div>
      <div class="cost-item-input">
        <input type="number" class="form-control" value="500" min="0" step="100">
        <span class="input-unit">USD</span>
      </div>
      <div class="cost-item-range text-muted">
        参考范围: $0 - $1,000
      </div>
    </div>

    <div class="cost-item-row">
      <div class="cost-item-checkbox">
        <input type="checkbox" id="m1-bank-account" checked>
        <label>银行账户开设</label>
      </div>
      <div class="cost-item-input">
        <input type="number" class="form-control" value="250" min="0" step="50">
        <span class="input-unit">USD</span>
      </div>
      <div class="cost-item-range text-muted">
        参考范围: $0 - $500
      </div>
    </div>
  </div>

  <div class="module-footer">
    <div class="module-subtotal">
      <span>M1 小计:</span>
      <strong id="m1-subtotal">$5,250</strong>
    </div>
  </div>
</div>
```

**JavaScript 逻辑:**
```javascript
// M1 模块计算
function calculateM1() {
  let total = 0;
  document.querySelectorAll('#m1 .cost-item-row').forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const input = row.querySelector('input[type="number"]');
    if (checkbox.checked && input) {
      total += parseFloat(input.value) || 0;
    }
  });
  document.getElementById('m1-subtotal').textContent = `$${total.toLocaleString()}`;
  return total;
}

// 监听所有 M1 输入变化
document.querySelectorAll('#m1 input').forEach(input => {
  input.addEventListener('change', () => {
    calculateM1();
    updateCapexTotal();
  });
});
```

#### 2.2 M2: 渠道建设与技术架构

**类似结构，包含:**
- 销售模式下拉选择 (DTC / FBA / 平台分销 / 混合)
- DTC 官网开发 ($5,000 - $20,000)
- 平台店铺开设 ($0 - $500)
- ERP/WMS 系统 ($2,000 - $10,000)
- 支付网关集成 ($500 - $2,000)
- 域名与服务器 ($200 - $1,000)

**智能逻辑:**
```javascript
// 根据销售模式显示/隐藏相关成本项
document.getElementById('m2-sales-model').addEventListener('change', (e) => {
  const model = e.target.value;

  // DTC 模式显示官网开发
  document.getElementById('m2-website-dev').closest('.cost-item-row').style.display =
    (model === 'DTC' || model === 'hybrid') ? 'flex' : 'none';

  // FBA 模式显示平台开设
  document.getElementById('m2-platform-setup').closest('.cost-item-row').style.display =
    (model === 'FBA' || model === 'platform' || model === 'hybrid') ? 'flex' : 'none';

  calculateM2();
});
```

#### 2.3 M3: 供应链准备与产品合规

**包含:**
- 产品类目选择 (自动从 Step 2 读取)
- FDA/CE/UKCA 认证 ($3,000 - $15,000)
- 产品测试与检验 ($1,000 - $5,000)
- 包装设计与模具 ($2,000 - $8,000)
- 首批库存采购 ($10,000 - $50,000)
- 海外仓建设 ($5,000 - $20,000)

**行业库逻辑:**
```javascript
// 根据产品类目应用行业库默认值
const industryDefaults = {
  'pet': {
    m3_certification: 5000,  // FDA Registration
    m3_testing: 2000,
    m3_packaging: 3000
  },
  'vape': {
    m3_certification: 100000, // PMTA
    m3_testing: 10000,
    m3_packaging: 5000
  },
  'food': {
    m3_certification: 8000,   // FDA + Organic
    m3_testing: 3000,
    m3_packaging: 4000
  }
};

function applyIndustryDefaults(category) {
  const defaults = industryDefaults[category];
  if (defaults) {
    document.getElementById('m3-certification').value = defaults.m3_certification;
    document.getElementById('m3-testing').value = defaults.m3_testing;
    document.getElementById('m3-packaging').value = defaults.m3_packaging;
    calculateM3();
  }
}
```

#### 2.4 CAPEX 汇总卡片

```html
<div class="capex-summary-card mt-4">
  <h4>启动成本总计 (Phase 0-1)</h4>
  <div class="summary-breakdown">
    <div class="summary-item">
      <span>M1: 市场准入与主体合规</span>
      <strong id="capex-m1">$5,250</strong>
    </div>
    <div class="summary-item">
      <span>M2: 渠道建设与技术架构</span>
      <strong id="capex-m2">$15,000</strong>
    </div>
    <div class="summary-item">
      <span>M3: 供应链准备与产品合规</span>
      <strong id="capex-m3">$35,000</strong>
    </div>
  </div>
  <hr>
  <div class="summary-total">
    <span>CAPEX 总计:</span>
    <strong id="total-capex" class="text-primary">$55,250</strong>
  </div>

  <div class="mt-3">
    <button class="btn btn-outline-info" onclick="showCapexChart()">
      <i class="bi bi-pie-chart"></i> 查看成本分布图
    </button>
  </div>
</div>

<!-- ECharts 饼图容器 -->
<div id="capex-chart-container" style="display:none;">
  <div id="capex-pie-chart" style="width:100%; height:400px;"></div>
</div>
```

**验收标准:**
- [ ] M1, M2, M3 三个模块渲染正常
- [ ] 复选框勾选/取消影响小计
- [ ] 输入数值变化自动更新汇总
- [ ] CAPEX 总计计算准确
- [ ] 销售模式切换时相关成本项显示/隐藏

---

### Phase 3: OPEX 模块开发 (2小时)

#### 3.1 M4: 商品成本与税费 (月度)

**HTML 结构:**
```html
<div class="gecom-module-card">
  <div class="module-header">
    <h4>M4: 商品成本与税费</h4>
    <span class="badge bg-info">月度成本</span>
  </div>

  <div class="module-body">
    <div class="form-group mb-3">
      <label>月销售目标 (件数)</label>
      <input type="number" id="m4-units" class="form-control" value="1000" min="0">
      <small class="text-muted">自动从 Step 3 读取，可手动调整</small>
    </div>

    <div class="cost-item-row">
      <label>COGS (单位成本)</label>
      <div class="cost-item-input">
        <span class="input-prefix">$</span>
        <input type="number" id="m4-cogs" class="form-control" value="15.00" step="0.1">
        <span class="input-unit">/ 件</span>
      </div>
    </div>

    <div class="cost-item-row">
      <label>头程物流 (中国→目标市场)</label>
      <div class="cost-item-input">
        <span class="input-prefix">$</span>
        <input type="number" id="m4-shipping" class="form-control" value="3.50" step="0.1">
        <span class="input-unit">/ 件</span>
      </div>
    </div>

    <div class="cost-item-row">
      <label>进口关税 (HS Code: <span id="m4-hs-code">4201</span>)</label>
      <div class="cost-item-input">
        <input type="number" id="m4-tariff" class="form-control" value="4.5" step="0.1">
        <span class="input-unit">%</span>
      </div>
      <button class="btn btn-sm btn-outline-secondary" onclick="lookupHSCode()">
        查询税率
      </button>
    </div>

    <div class="cost-item-row">
      <label>销售税 (VAT/GST/Sales Tax)</label>
      <div class="cost-item-input">
        <input type="number" id="m4-sales-tax" class="form-control" value="7.0" step="0.1">
        <span class="input-unit">%</span>
      </div>
    </div>
  </div>

  <div class="module-footer">
    <div class="module-calc-detail">
      <div>单件总成本: <strong id="m4-unit-cost">$19.70</strong></div>
      <div>月销量: <strong id="m4-monthly-units">1,000 件</strong></div>
    </div>
    <div class="module-subtotal">
      <span>M4 月度小计:</span>
      <strong id="m4-subtotal">$19,700</strong>
    </div>
  </div>
</div>
```

**JavaScript 计算:**
```javascript
function calculateM4() {
  const units = parseFloat(document.getElementById('m4-units').value) || 0;
  const cogs = parseFloat(document.getElementById('m4-cogs').value) || 0;
  const shipping = parseFloat(document.getElementById('m4-shipping').value) || 0;
  const tariffRate = parseFloat(document.getElementById('m4-tariff').value) || 0;
  const salesTaxRate = parseFloat(document.getElementById('m4-sales-tax').value) || 0;

  // 获取目标价格 (从 Step 2)
  const price = parseFloat(localStorage.getItem('step2_target_price')) || 49.99;

  // 计算单件成本
  const tariffAmount = (cogs + shipping) * (tariffRate / 100);
  const salesTaxAmount = price * (salesTaxRate / 100);
  const unitCost = cogs + shipping + tariffAmount + salesTaxAmount;

  // 月度总成本
  const monthlyTotal = unitCost * units;

  // 更新显示
  document.getElementById('m4-unit-cost').textContent = `$${unitCost.toFixed(2)}`;
  document.getElementById('m4-monthly-units').textContent = `${units.toLocaleString()} 件`;
  document.getElementById('m4-subtotal').textContent = `$${monthlyTotal.toLocaleString()}`;

  return monthlyTotal;
}
```

#### 3.2 M5: 履约执行与物流

**包含:**
- 物流模式选择 (Amazon FBA / 自发货 / 3PL)
- 仓储费 ($0.75/件)
- FBA 配送费 ($3.50/件)
- 退货处理费 ($2.00/件)
- 退货率 (5%)

**智能逻辑:**
```javascript
// 根据物流模式切换费率
const fulfillmentRates = {
  'fba': {
    storage: 0.75,
    delivery: 3.50,
    return: 2.00
  },
  'self': {
    storage: 0.50,
    delivery: 5.00,
    return: 3.00
  },
  '3pl': {
    storage: 0.60,
    delivery: 4.50,
    return: 2.50
  }
};

document.getElementById('m5-model').addEventListener('change', (e) => {
  const model = e.target.value;
  const rates = fulfillmentRates[model];

  document.getElementById('m5-storage').value = rates.storage;
  document.getElementById('m5-delivery').value = rates.delivery;
  document.getElementById('m5-return').value = rates.return;

  calculateM5();
});
```

#### 3.3 M6: 营销与获客

**自动从 Step 3 读取:**
```javascript
function loadM6FromStep3() {
  const strategy = JSON.parse(localStorage.getItem('step3_strategy') || '{}');

  document.getElementById('m6-ppc').value = strategy.ppcBudget || 5000;
  document.getElementById('m6-kol').value = strategy.kolBudget || 2000;
  document.getElementById('m6-social').value = strategy.socialBudget || 1500;
  document.getElementById('m6-affiliate').value = strategy.affiliateBudget || 500;

  calculateM6();
}
```

**CAC 计算:**
```javascript
function calculateM6() {
  const ppc = parseFloat(document.getElementById('m6-ppc').value) || 0;
  const kol = parseFloat(document.getElementById('m6-kol').value) || 0;
  const social = parseFloat(document.getElementById('m6-social').value) || 0;
  const affiliate = parseFloat(document.getElementById('m6-affiliate').value) || 0;

  const totalMarketing = ppc + kol + social + affiliate;

  // 获取月销量
  const units = parseFloat(document.getElementById('m4-units').value) || 1000;

  // 计算 CAC (假设转化率)
  const conversionRate = 0.03; // 3%
  const customers = units * conversionRate;
  const cac = totalMarketing / customers;

  document.getElementById('m6-subtotal').textContent = `$${totalMarketing.toLocaleString()}`;
  document.getElementById('m6-cac').textContent = `$${cac.toFixed(2)}`;

  return totalMarketing;
}
```

#### 3.4 M7: 渠道使用与交易

**包含:**
- 销售渠道 (Amazon / eBay / Shopify / 独立站)
- 平台佣金 (15% of sales)
- 支付处理费 (2.9% + $0.30)
- SaaS 工具订阅 ($200)
- 数据分析工具 ($100)

**动态费率:**
```javascript
const channelRates = {
  'amazon': { commission: 15, payment: 0 }, // FBA 包含支付
  'ebay': { commission: 12.35, payment: 2.9 },
  'shopify': { commission: 0, payment: 2.9 },
  'independent': { commission: 0, payment: 2.9 }
};
```

#### 3.5 M8: 综合运营与维护

**包含:**
- 运营团队人数及成本
- 客服外包费用
- 法务与财务服务
- 合规维护 (年度审核)
- 办公与软件费用

#### 3.6 OPEX 汇总卡片

```html
<div class="opex-summary-card mt-4">
  <h4>运营成本总计 (Phase 1-N 月度)</h4>
  <div class="summary-breakdown">
    <div class="summary-item">
      <span>M4: 商品成本与税费</span>
      <strong id="opex-m4">$19,700</strong>
    </div>
    <div class="summary-item">
      <span>M5: 履约执行与物流</span>
      <strong id="opex-m5">$4,350</strong>
    </div>
    <div class="summary-item">
      <span>M6: 营销与获客</span>
      <strong id="opex-m6">$9,000</strong>
    </div>
    <div class="summary-item">
      <span>M7: 渠道使用与交易</span>
      <strong id="opex-m7">$6,800</strong>
    </div>
    <div class="summary-item">
      <span>M8: 综合运营与维护</span>
      <strong id="opex-m8">$11,200</strong>
    </div>
  </div>
  <hr>
  <div class="summary-total">
    <span>月度 OPEX 总计:</span>
    <strong id="total-opex" class="text-warning">$51,050</strong>
  </div>

  <div class="mt-3">
    <button class="btn btn-outline-info" onclick="showOpexChart()">
      <i class="bi bi-bar-chart"></i> 查看成本结构图
    </button>
  </div>
</div>
```

**验收标准:**
- [ ] M4-M8 五个模块渲染正常
- [ ] M4 单件成本计算准确
- [ ] M5 物流模式切换正常
- [ ] M6 自动从 Step 3 读取营销预算
- [ ] M6 CAC 计算准确
- [ ] M7 渠道费率动态切换
- [ ] OPEX 月度总计计算准确

---

### Phase 4: 利润计算模块 (1.5小时)

#### 4.1 收入预测卡片

```html
<div class="revenue-forecast-card">
  <h4>收入预测 (月度)</h4>

  <div class="auto-loaded-data">
    <h6>自动读取 Step 2 Charter:</h6>
    <div class="data-item">
      <span>产品名称:</span>
      <strong id="profit-product-name">智能宠物喂食器</strong>
    </div>
    <div class="data-item">
      <span>目标价格:</span>
      <strong id="profit-target-price">$49.99</strong>
    </div>
  </div>

  <div class="auto-loaded-data mt-3">
    <h6>自动读取 Step 3 预测:</h6>
    <div class="data-item">
      <span>月销售量:</span>
      <strong id="profit-monthly-units">1,000 件</strong>
    </div>
    <div class="data-item">
      <span>退货率:</span>
      <strong id="profit-return-rate">5%</strong>
    </div>
  </div>

  <hr>

  <div class="revenue-calc">
    <div class="calc-row">
      <span>毛销售额:</span>
      <strong id="gross-revenue">$49,990</strong>
    </div>
    <div class="calc-row text-danger">
      <span>退货扣减:</span>
      <strong id="return-deduction">-$2,500</strong>
    </div>
    <div class="calc-row total">
      <span>净收入:</span>
      <strong id="net-revenue" class="text-success">$47,490</strong>
    </div>
  </div>
</div>
```

**JavaScript 计算:**
```javascript
function calculateRevenue() {
  // 从 localStorage 读取
  const charter = JSON.parse(localStorage.getItem('step2_charter') || '{}');
  const strategy = JSON.parse(localStorage.getItem('step3_strategy') || '{}');

  const price = charter.targetPrice || 49.99;
  const units = strategy.estimatedUnits || 1000;
  const returnRate = 0.05; // 5%

  const grossRevenue = price * units;
  const returnDeduction = grossRevenue * returnRate;
  const netRevenue = grossRevenue - returnDeduction;

  // 更新显示
  document.getElementById('profit-product-name').textContent = charter.productName || '未设置';
  document.getElementById('profit-target-price').textContent = `$${price.toFixed(2)}`;
  document.getElementById('profit-monthly-units').textContent = `${units.toLocaleString()} 件`;
  document.getElementById('gross-revenue').textContent = `$${grossRevenue.toLocaleString()}`;
  document.getElementById('return-deduction').textContent = `-$${returnDeduction.toLocaleString()}`;
  document.getElementById('net-revenue').textContent = `$${netRevenue.toLocaleString()}`;

  return netRevenue;
}
```

#### 4.2 成本汇总卡片

```html
<div class="cost-summary-card mt-4">
  <h4>成本汇总</h4>

  <div class="capex-section">
    <h6>启动成本 (CAPEX - 一次性):</h6>
    <div class="summary-total">
      <span>Phase 0-1 总计:</span>
      <strong id="summary-capex">$55,250</strong>
    </div>
  </div>

  <hr>

  <div class="opex-section">
    <h6>运营成本 (OPEX - 月度):</h6>
    <div class="summary-total">
      <span>Phase 1-N 总计:</span>
      <strong id="summary-opex">$51,050</strong>
    </div>
  </div>

  <hr>

  <div class="tco-section">
    <h6>TCO (Total Cost of Ownership):</h6>
    <div class="form-group mb-3">
      <label>预测时长 (月):</label>
      <input type="number" id="tco-months" class="form-control" value="6" min="1" max="24">
    </div>
    <div class="tco-calc">
      <div class="calc-row">
        <span>CAPEX:</span>
        <strong id="tco-capex">$55,250</strong>
      </div>
      <div class="calc-row">
        <span>OPEX × <span id="tco-months-display">6</span> 个月:</span>
        <strong id="tco-opex-total">$306,300</strong>
      </div>
      <div class="calc-row total">
        <span>TCO 总计:</span>
        <strong id="tco-total" class="text-danger">$361,550</strong>
      </div>
    </div>
  </div>
</div>
```

#### 4.3 利润分析卡片

```html
<div class="profit-analysis-card mt-4">
  <h4>利润分析 (月度)</h4>

  <div class="profit-calc">
    <div class="calc-row">
      <span>净收入:</span>
      <strong id="monthly-revenue" class="text-success">$47,490</strong>
    </div>
    <div class="calc-row">
      <span>月度 OPEX:</span>
      <strong id="monthly-opex" class="text-danger">-$51,050</strong>
    </div>
    <hr>
    <div class="calc-row total">
      <span>月度净利润:</span>
      <strong id="monthly-profit" class="profit-negative">-$3,560</strong>
      <span id="profit-indicator" class="badge bg-warning">⚠️</span>
    </div>
    <div class="calc-row">
      <span>净利润率:</span>
      <strong id="profit-margin">-7.5%</strong>
    </div>
  </div>

  <hr>

  <div class="breakeven-analysis">
    <h6>盈亏平衡点分析:</h6>
    <div class="breakeven-item">
      <span>CAPEX 回收周期:</span>
      <strong id="breakeven-months" class="text-warning">15.5 个月 ⚠️</strong>
    </div>
    <div class="breakeven-item">
      <span>盈亏平衡所需月销量:</span>
      <strong id="breakeven-units">1,150 件</strong>
    </div>
  </div>
</div>
```

**JavaScript 计算:**
```javascript
function calculateProfit() {
  const revenue = calculateRevenue();
  const opex = parseFloat(document.getElementById('total-opex').textContent.replace(/[$,]/g, ''));
  const capex = parseFloat(document.getElementById('total-capex').textContent.replace(/[$,]/g, ''));

  // 月度利润
  const monthlyProfit = revenue - opex;
  const profitMargin = (monthlyProfit / revenue) * 100;

  // CAPEX 回收
  let breakEvenMonths = Infinity;
  if (monthlyProfit > 0) {
    breakEvenMonths = capex / monthlyProfit;
  }

  // 盈亏平衡销量
  const price = parseFloat(localStorage.getItem('step2_target_price')) || 49.99;
  const unitCost = opex / (parseFloat(document.getElementById('m4-units').value) || 1000);
  const breakEvenUnits = Math.ceil(opex / (price - unitCost));

  // 更新显示
  document.getElementById('monthly-profit').textContent = `$${monthlyProfit.toLocaleString()}`;
  document.getElementById('profit-margin').textContent = `${profitMargin.toFixed(1)}%`;

  // 利润指示器
  const indicator = document.getElementById('profit-indicator');
  if (monthlyProfit > 0) {
    indicator.className = 'badge bg-success';
    indicator.textContent = '✅';
  } else if (monthlyProfit > -1000) {
    indicator.className = 'badge bg-warning';
    indicator.textContent = '⚠️';
  } else {
    indicator.className = 'badge bg-danger';
    indicator.textContent = '❌';
  }

  // 盈亏平衡
  if (breakEvenMonths === Infinity) {
    document.getElementById('breakeven-months').innerHTML = '无法回本 ❌';
  } else {
    document.getElementById('breakeven-months').innerHTML =
      `${breakEvenMonths.toFixed(1)} 个月 ${breakEvenMonths > 12 ? '⚠️' : '✅'}`;
  }

  document.getElementById('breakeven-units').textContent = `${breakEvenUnits.toLocaleString()} 件`;
}
```

#### 4.4 ECharts 可视化

**成本结构饼图:**
```javascript
function showOpexChart() {
  const chart = echarts.init(document.getElementById('opex-pie-chart'));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#fff' }
    },
    series: [{
      name: '运营成本',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        color: '#fff',
        formatter: '{b}: ${c}'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 19700, name: 'M4 商品成本与税费', itemStyle: { color: '#f44336' } },
        { value: 4350, name: 'M5 履约执行与物流', itemStyle: { color: '#ff9800' } },
        { value: 9000, name: 'M6 营销与获客', itemStyle: { color: '#ffc107' } },
        { value: 6800, name: 'M7 渠道使用与交易', itemStyle: { color: '#4caf50' } },
        { value: 11200, name: 'M8 综合运营与维护', itemStyle: { color: '#2196f3' } }
      ]
    }]
  };

  chart.setOption(option);
}
```

**利润趋势折线图:**
```javascript
function showProfitTrendChart() {
  const chart = echarts.init(document.getElementById('profit-trend-chart'));

  const months = parseInt(document.getElementById('tco-months').value) || 6;
  const monthlyRevenue = parseFloat(document.getElementById('net-revenue').textContent.replace(/[$,]/g, ''));
  const monthlyOpex = parseFloat(document.getElementById('total-opex').textContent.replace(/[$,]/g, ''));
  const capex = parseFloat(document.getElementById('total-capex').textContent.replace(/[$,]/g, ''));

  const xData = [];
  const revenueData = [];
  const costData = [];
  const profitData = [];

  for (let i = 1; i <= months; i++) {
    xData.push(`M${i}`);
    revenueData.push(monthlyRevenue * i);
    costData.push(capex + (monthlyOpex * i));
    profitData.push((monthlyRevenue * i) - (capex + (monthlyOpex * i)));
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff' },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['累计收入', '累计成本', '累计利润'],
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: { lineStyle: { color: '#444' } },
      axisLabel: { color: '#b0b0b0' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#444' } },
      axisLabel: {
        color: '#b0b0b0',
        formatter: '${value}'
      },
      splitLine: { lineStyle: { color: '#333' } }
    },
    series: [
      {
        name: '累计收入',
        type: 'line',
        data: revenueData,
        itemStyle: { color: '#4caf50' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
            { offset: 1, color: 'rgba(76, 175, 80, 0.05)' }
          ])
        }
      },
      {
        name: '累计成本',
        type: 'line',
        data: costData,
        itemStyle: { color: '#f44336' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(244, 67, 54, 0.3)' },
            { offset: 1, color: 'rgba(244, 67, 54, 0.05)' }
          ])
        }
      },
      {
        name: '累计利润',
        type: 'line',
        data: profitData,
        itemStyle: { color: '#ff9800' },
        lineStyle: { width: 3 }
      }
    ]
  };

  chart.setOption(option);
}
```

**验收标准:**
- [ ] 自动从 Step 2/3 读取数据
- [ ] 收入计算准确
- [ ] TCO 时长可调整
- [ ] 月度利润计算准确
- [ ] 净利润率显示正确
- [ ] CAPEX 回收周期计算准确
- [ ] 盈亏平衡销量计算准确
- [ ] 成本饼图渲染正常
- [ ] 利润趋势图渲染正常

---

### Phase 5: 可行性报告模块 (1.5小时)

#### 5.1 综合评分卡

```html
<div class="feasibility-score-card">
  <h4>可行性综合评分</h4>

  <div class="overall-score">
    <div class="score-bar-container">
      <div class="score-bar">
        <div class="score-bar-fill" id="overall-score-fill" style="width: 62%"></div>
      </div>
      <div class="score-value">
        <strong id="overall-score">62</strong> / 100
        <span id="overall-indicator" class="badge bg-warning">⚠️</span>
      </div>
    </div>
  </div>

  <hr>

  <div class="score-breakdown">
    <div class="score-item">
      <div class="score-label">
        <span>财务可行性</span>
        <span class="badge bg-warning">⚠️</span>
      </div>
      <div class="score-progress">
        <div class="progress">
          <div class="progress-bar bg-warning" style="width: 60%"></div>
        </div>
        <strong>60/100</strong>
      </div>
    </div>

    <div class="score-item">
      <div class="score-label">
        <span>市场可行性</span>
        <span class="badge bg-success">✅</span>
      </div>
      <div class="score-progress">
        <div class="progress">
          <div class="progress-bar bg-success" style="width: 75%"></div>
        </div>
        <strong>75/100</strong>
      </div>
    </div>

    <div class="score-item">
      <div class="score-label">
        <span>运营可行性</span>
        <span class="badge bg-warning">⚠️</span>
      </div>
      <div class="score-progress">
        <div class="progress">
          <div class="progress-bar bg-warning" style="width: 55%"></div>
        </div>
        <strong>55/100</strong>
      </div>
    </div>

    <div class="score-item">
      <div class="score-label">
        <span>合规可行性</span>
        <span class="badge bg-success">✅</span>
      </div>
      <div class="score-progress">
        <div class="progress">
          <div class="progress-bar bg-success" style="width: 80%"></div>
        </div>
        <strong>80/100</strong>
      </div>
    </div>
  </div>

  <hr>

  <div class="conclusion">
    <h6>结论:</h6>
    <div class="alert alert-warning">
      <strong>⚠️ 需要优化后再执行</strong>
    </div>
  </div>
</div>
```

**JavaScript 评分逻辑:**
```javascript
function calculateFeasibilityScore() {
  // 1. 财务可行性 (基于利润率和回本周期)
  const profitMargin = parseFloat(document.getElementById('profit-margin').textContent.replace('%', ''));
  const breakEvenMonths = parseFloat(document.getElementById('breakeven-months').textContent);

  let financialScore = 0;
  if (profitMargin > 20) financialScore = 100;
  else if (profitMargin > 15) financialScore = 90;
  else if (profitMargin > 10) financialScore = 80;
  else if (profitMargin > 5) financialScore = 70;
  else if (profitMargin > 0) financialScore = 60;
  else financialScore = 40;

  if (!isNaN(breakEvenMonths)) {
    if (breakEvenMonths < 6) financialScore += 10;
    else if (breakEvenMonths < 12) financialScore += 5;
    else if (breakEvenMonths > 24) financialScore -= 10;
  } else {
    financialScore -= 20; // 无法回本
  }

  financialScore = Math.max(0, Math.min(100, financialScore));

  // 2. 市场可行性 (从 Step 1 综合分数读取)
  const marketScore = parseInt(localStorage.getItem('step1_combined_score')) || 75;

  // 3. 运营可行性 (从 Step 3 综合分析读取)
  const operationalScore = parseInt(localStorage.getItem('step3_operational_score')) || 55;

  // 4. 合规可行性 (基于 M1 和 M3 成本)
  const m1Cost = parseFloat(document.getElementById('capex-m1').textContent.replace(/[$,]/g, ''));
  const m3Cost = parseFloat(document.getElementById('capex-m3').textContent.replace(/[$,]/g, ''));

  let complianceScore = 100;
  if (m1Cost > 10000) complianceScore -= 10;
  if (m3Cost > 50000) complianceScore -= 10;

  // 综合评分
  const overallScore = Math.round(
    (financialScore * 0.4) +
    (marketScore * 0.3) +
    (operationalScore * 0.2) +
    (complianceScore * 0.1)
  );

  return {
    overall: overallScore,
    financial: financialScore,
    market: marketScore,
    operational: operationalScore,
    compliance: complianceScore
  };
}
```

#### 5.2 风险预警

```html
<div class="risk-warning-card mt-4">
  <h4>风险预警 🚨</h4>

  <div class="risk-section">
    <h6>⚠️ 高风险项:</h6>
    <div id="high-risks-container">
      <!-- 动态生成 -->
    </div>
  </div>

  <div class="risk-section mt-3">
    <h6>✅ 低风险项:</h6>
    <div id="low-risks-container">
      <!-- 动态生成 -->
    </div>
  </div>
</div>
```

**风险检测逻辑:**
```javascript
function generateRiskWarnings() {
  const highRisks = [];
  const lowRisks = [];

  // 检查月度利润
  const monthlyProfit = parseFloat(document.getElementById('monthly-profit').textContent.replace(/[$,]/g, ''));
  if (monthlyProfit < 0) {
    highRisks.push({
      title: `月度运营亏损 $${Math.abs(monthlyProfit).toLocaleString()}`,
      description: '净利润率为负，需优化成本结构或提高售价',
      severity: 'high'
    });
  } else {
    lowRisks.push({
      title: '月度运营盈利',
      description: '净利润为正，财务健康'
    });
  }

  // 检查 CAPEX 回收周期
  const breakEvenMonths = parseFloat(document.getElementById('breakeven-months').textContent);
  if (isNaN(breakEvenMonths) || breakEvenMonths > 18) {
    highRisks.push({
      title: `CAPEX 回收周期过长 (${isNaN(breakEvenMonths) ? '无法回本' : breakEvenMonths.toFixed(1) + '个月'})`,
      description: '建议降低启动成本或提高售价',
      severity: 'high'
    });
  } else if (breakEvenMonths < 12) {
    lowRisks.push({
      title: `CAPEX 回收周期合理 (${breakEvenMonths.toFixed(1)}个月)`,
      description: '回本速度健康'
    });
  }

  // 检查 CAC
  const cac = parseFloat(document.getElementById('m6-cac').textContent.replace(/[$,]/g, ''));
  const price = parseFloat(localStorage.getItem('step2_target_price')) || 49.99;
  const cacRatio = (cac / price) * 100;

  if (cacRatio > 20) {
    highRisks.push({
      title: `获客成本偏高 ($${cac.toFixed(2)}/客户)`,
      description: `CAC/Price 比例为 ${cacRatio.toFixed(1)}%，需优化营销策略`,
      severity: 'high'
    });
  } else {
    lowRisks.push({
      title: '获客成本合理',
      description: 'CAC/Price 比例健康'
    });
  }

  // 检查合规成本
  const m1Cost = parseFloat(document.getElementById('capex-m1').textContent.replace(/[$,]/g, ''));
  const m3Cost = parseFloat(document.getElementById('capex-m3').textContent.replace(/[$,]/g, ''));

  if (m1Cost < 10000 && m3Cost < 50000) {
    lowRisks.push({
      title: '合规成本可控',
      description: '市场准入和产品合规成本在合理范围内'
    });
  }

  // 渲染
  renderRisks(highRisks, 'high-risks-container', 'high');
  renderRisks(lowRisks, 'low-risks-container', 'low');
}

function renderRisks(risks, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (risks.length === 0) {
    container.innerHTML = '<p class="text-muted">无</p>';
    return;
  }

  risks.forEach((risk, index) => {
    const card = document.createElement('div');
    card.className = `risk-item risk-${type}`;
    card.innerHTML = `
      <div class="risk-number">${index + 1}</div>
      <div class="risk-content">
        <strong>${risk.title}</strong>
        <p class="text-muted mb-0">${risk.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
```

#### 5.3 优化建议

```html
<div class="optimization-card mt-4">
  <h4>AI 优化建议 💡</h4>

  <div class="optimization-section">
    <h6>🎯 短期优化 (0-3个月):</h6>
    <div id="short-term-optimizations">
      <!-- 动态生成 -->
    </div>
  </div>

  <div class="optimization-section mt-3">
    <h6>🚀 中期优化 (3-6个月):</h6>
    <div id="mid-term-optimizations">
      <!-- 动态生成 -->
    </div>
  </div>

  <div class="optimized-forecast mt-4">
    <h6>📊 优化后预测:</h6>
    <div id="optimized-results">
      <!-- 动态生成 -->
    </div>
  </div>
</div>
```

**优化建议生成:**
```javascript
function generateOptimizations() {
  const shortTerm = [];
  const midTerm = [];

  // M6 营销优化
  const m6Cost = parseFloat(document.getElementById('opex-m6').textContent.replace(/[$,]/g, ''));
  if (m6Cost > 8000) {
    shortTerm.push({
      module: 'M6 营销优化',
      actions: [
        '降低 PPC 预算 30%',
        '增加 Organic SEO 投入'
      ],
      savings: m6Cost * 0.3,
      savingsPeriod: 'month'
    });
  }

  // M4 供应链优化
  const m4UnitCost = parseFloat(document.getElementById('m4-unit-cost').textContent.replace(/[$,]/g, ''));
  shortTerm.push({
    module: 'M4 供应链优化',
    actions: [
      '寻找成本更低的供应商 (-10% COGS)',
      '批量采购降低单价'
    ],
    savings: m4UnitCost * 0.1 * 1000, // 假设月销1000件
    savingsPeriod: 'month'
  });

  // M7 渠道组合
  const m7Cost = parseFloat(document.getElementById('opex-m7').textContent.replace(/[$,]/g, ''));
  if (m7Cost > 6000) {
    shortTerm.push({
      module: 'M7 渠道组合',
      actions: [
        '尝试 Shopify DTC (佣金更低)',
        '多渠道分散风险'
      ],
      savings: m7Cost * 0.15,
      savingsPeriod: 'month'
    });
  }

  // M5 物流模式切换
  const m5Cost = parseFloat(document.getElementById('opex-m5').textContent.replace(/[$,]/g, ''));
  midTerm.push({
    module: 'M5 物流模式切换',
    actions: [
      '从 FBA 切换到 3PL 海外仓',
      '降低仓储和配送费用'
    ],
    savings: m5Cost * 0.25,
    savingsPeriod: 'month'
  });

  // 定价策略调整
  const price = parseFloat(localStorage.getItem('step2_target_price')) || 49.99;
  const units = parseFloat(document.getElementById('m4-units').value) || 1000;
  midTerm.push({
    module: '定价策略调整',
    actions: [
      '提价至 $' + (price * 1.1).toFixed(2) + ' (+10%)',
      '推出高价 Premium SKU'
    ],
    savings: (price * 0.1) * units,
    savingsPeriod: 'month'
  });

  // 渲染
  renderOptimizations(shortTerm, 'short-term-optimizations');
  renderOptimizations(midTerm, 'mid-term-optimizations');

  // 计算优化后结果
  calculateOptimizedResults(shortTerm, midTerm);
}

function renderOptimizations(optimizations, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  optimizations.forEach((opt, index) => {
    const card = document.createElement('div');
    card.className = 'optimization-item';
    card.innerHTML = `
      <div class="optimization-number">${index + 1}</div>
      <div class="optimization-content">
        <h6>${opt.module}</h6>
        <ul>
          ${opt.actions.map(action => `<li>${action}</li>`).join('')}
        </ul>
        <p class="text-success mb-0">
          潜在节省: <strong>$${opt.savings.toLocaleString()}</strong> / ${opt.savingsPeriod === 'month' ? '月' : '次'}
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}

function calculateOptimizedResults(shortTerm, midTerm) {
  const currentProfit = parseFloat(document.getElementById('monthly-profit').textContent.replace(/[$,]/g, ''));
  const currentMargin = parseFloat(document.getElementById('profit-margin').textContent.replace('%', ''));

  const totalSavings = [...shortTerm, ...midTerm].reduce((sum, opt) => sum + opt.savings, 0);
  const optimizedProfit = currentProfit + totalSavings;
  const revenue = parseFloat(document.getElementById('net-revenue').textContent.replace(/[$,]/g, ''));
  const optimizedMargin = (optimizedProfit / revenue) * 100;

  const capex = parseFloat(document.getElementById('total-capex').textContent.replace(/[$,]/g, ''));
  const optimizedBreakEven = optimizedProfit > 0 ? (capex / optimizedProfit).toFixed(1) : 'N/A';

  const container = document.getElementById('optimized-results');
  container.innerHTML = `
    <div class="optimized-metrics">
      <div class="metric-item">
        <span>月度净利润:</span>
        <strong class="text-success">$${optimizedProfit.toLocaleString()} ✅</strong>
        <small class="text-muted">(当前: $${currentProfit.toLocaleString()})</small>
      </div>
      <div class="metric-item">
        <span>净利润率:</span>
        <strong class="text-success">${optimizedMargin.toFixed(1)}% ✅</strong>
        <small class="text-muted">(当前: ${currentMargin.toFixed(1)}%)</small>
      </div>
      <div class="metric-item">
        <span>CAPEX 回收:</span>
        <strong class="text-success">${optimizedBreakEven} 个月 ✅</strong>
        <small class="text-muted">(当前: ${document.getElementById('breakeven-months').textContent})</small>
      </div>
    </div>
  `;
}
```

#### 5.4 决策建议

```html
<div class="decision-card mt-4">
  <h4>最终决策建议</h4>

  <div class="decision-conclusion">
    <div id="decision-badge" class="alert alert-warning">
      <h5>⚠️ 建议: 优化后执行</h5>
    </div>
  </div>

  <div class="decision-details">
    <p id="decision-description">
      当前状态下不建议立即启动，需完成以下优化:
    </p>

    <div class="must-do-section mt-3">
      <h6>☑️ 必须项:</h6>
      <ul id="must-do-list">
        <!-- 动态生成 -->
      </ul>
    </div>

    <div class="recommended-section mt-3">
      <h6>☐ 建议项:</h6>
      <ul id="recommended-list">
        <!-- 动态生成 -->
      </ul>
    </div>

    <div class="expected-results mt-4">
      <h6>优化完成后，预期可实现:</h6>
      <ul id="expected-results-list">
        <!-- 动态生成 -->
      </ul>
    </div>
  </div>

  <div class="action-buttons mt-4">
    <button class="btn btn-primary" onclick="exportReport()">
      <i class="bi bi-file-earmark-pdf"></i> 导出完整报告 PDF
    </button>
    <button class="btn btn-outline-secondary" onclick="resetParameters()">
      <i class="bi bi-arrow-counterclockwise"></i> 返回修改参数
    </button>
  </div>
</div>
```

**决策逻辑:**
```javascript
function generateDecision() {
  const scores = calculateFeasibilityScore();
  const overallScore = scores.overall;

  const mustDo = [];
  const recommended = [];
  const expectedResults = [];

  let decision = '';
  let badgeClass = '';

  // 根据综合评分决策
  if (overallScore >= 80) {
    decision = '✅ 建议: 立即执行';
    badgeClass = 'alert-success';
    document.getElementById('decision-description').textContent =
      '当前产品可行性高，建议立即启动项目。';
  } else if (overallScore >= 60) {
    decision = '⚠️ 建议: 优化后执行';
    badgeClass = 'alert-warning';
    document.getElementById('decision-description').textContent =
      '当前状态下不建议立即启动，需完成以下优化:';

    // 生成必须项和建议项
    const profitMargin = parseFloat(document.getElementById('profit-margin').textContent.replace('%', ''));
    if (profitMargin < 5) {
      mustDo.push('降低 COGS 至少 10%');
      mustDo.push('优化营销预算，降低 CAC');
      mustDo.push('考虑提价或推出高价 SKU');
    }

    recommended.push('探索 3PL 替代 FBA');
    recommended.push('增加 DTC 渠道分散风险');

    expectedResults.push('✅ 月度盈利 $2,000+');
    expectedResults.push('✅ 回本周期 < 12个月');
    expectedResults.push('✅ 净利润率 > 5%');
  } else {
    decision = '❌ 不建议: 风险过高';
    badgeClass = 'alert-danger';
    document.getElementById('decision-description').textContent =
      '当前产品可行性低，不建议启动。主要问题:';

    mustDo.push('重新评估产品选择');
    mustDo.push('降低启动成本至少 30%');
    mustDo.push('寻找更高利润率的产品');
  }

  // 更新显示
  document.getElementById('decision-badge').className = `alert ${badgeClass}`;
  document.getElementById('decision-badge').innerHTML = `<h5>${decision}</h5>`;

  const mustDoList = document.getElementById('must-do-list');
  mustDoList.innerHTML = mustDo.map(item => `<li>${item}</li>`).join('');

  const recommendedList = document.getElementById('recommended-list');
  recommendedList.innerHTML = recommended.map(item => `<li>${item}</li>`).join('');

  const expectedResultsList = document.getElementById('expected-results-list');
  expectedResultsList.innerHTML = expectedResults.map(item => `<li>${item}</li>`).join('');
}
```

**验收标准:**
- [ ] 可行性评分计算准确
- [ ] 财务/市场/运营/合规四维评分显示
- [ ] 高风险项自动检测（至少3条）
- [ ] 低风险项自动检测
- [ ] 优化建议生成（短期+中期）
- [ ] 优化后结果预测准确
- [ ] 决策建议根据评分动态生成
- [ ] 必须项和建议项清晰列出

---

### Phase 6: CSS 样式开发 (1小时)

#### 6.1 深色主题样式 (assets/css/step4.css)

```css
/* ========================================
   Step 4: 成本核算与利润验证 - 深色主题
   ======================================== */

/* 主容器 */
#step4-container {
  background: #121212;
  color: #e0e0e0;
  padding: 20px;
  min-height: 100vh;
}

/* Tab 导航 */
#step4Tabs .nav-link {
  background: #1e1e1e;
  border: 1px solid #333;
  color: #b0b0b0;
  margin-right: 8px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
}

#step4Tabs .nav-link:hover {
  background: #2a2a2a;
  color: #fff;
}

#step4Tabs .nav-link.active {
  background: linear-gradient(135deg, #1e3a5f 0%, #2a2a3e 100%);
  color: #fff;
  border-color: #4fc3f7;
}

/* GECOM 模块卡片 */
.gecom-module-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gecom-module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.15);
}

/* 模块头部 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
}

.module-header h4 {
  color: #4fc3f7;
  margin: 0;
  font-size: 1.25rem;
}

.data-tier {
  background: #2a2a3e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #90caf9;
}

/* 成本项行 */
.cost-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.cost-item-row:hover {
  background: #333;
}

.cost-item-checkbox {
  display: flex;
  align-items: center;
  flex: 1;
}

.cost-item-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
}

.cost-item-checkbox label {
  margin: 0;
  color: #e0e0e0;
  cursor: pointer;
}

.cost-item-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cost-item-input .form-control {
  width: 120px;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  text-align: right;
}

.cost-item-input .form-control:focus {
  border-color: #4fc3f7;
  box-shadow: 0 0 0 0.2rem rgba(79, 195, 247, 0.25);
}

.input-prefix,
.input-unit {
  color: #b0b0b0;
  font-size: 0.9rem;
}

.cost-item-range {
  font-size: 0.85rem;
  color: #757575;
  margin-left: 16px;
}

/* 模块底部 */
.module-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
}

.module-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.module-subtotal strong {
  color: #4fc3f7;
  font-size: 1.3rem;
}

/* CAPEX/OPEX 汇总卡片 */
.capex-summary-card,
.opex-summary-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #2a2a3e 100%);
  border: 1px solid #4fc3f7;
  border-radius: 16px;
  padding: 28px;
  margin-top: 24px;
}

.summary-breakdown .summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #b0b0b0;
}

.summary-breakdown .summary-item:last-child {
  border-bottom: none;
}

.summary-breakdown .summary-item strong {
  color: #fff;
  font-size: 1.1rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 16px;
}

.summary-total strong {
  font-size: 2rem;
  font-weight: bold;
}

/* 利润分析卡片 */
.revenue-forecast-card,
.cost-summary-card,
.profit-analysis-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.auto-loaded-data {
  background: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.auto-loaded-data h6 {
  color: #90caf9;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.data-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #b0b0b0;
}

.data-item strong {
  color: #fff;
}

.revenue-calc .calc-row,
.profit-calc .calc-row,
.tco-calc .calc-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 1.1rem;
}

.calc-row.total {
  border-top: 2px solid #4fc3f7;
  margin-top: 12px;
  padding-top: 16px;
  font-size: 1.3rem;
  font-weight: bold;
}

.profit-negative {
  color: #f44336 !important;
}

.profit-positive {
  color: #4caf50 !important;
}

/* 可行性评分 */
.feasibility-score-card {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e3a5f 100%);
  border: 1px solid #4fc3f7;
  border-radius: 16px;
  padding: 28px;
}

.overall-score {
  text-align: center;
  margin-bottom: 24px;
}

.score-bar-container {
  margin-bottom: 16px;
}

.score-bar {
  width: 100%;
  height: 40px;
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
  transition: width 0.8s ease;
  border-radius: 20px;
}

.score-value {
  font-size: 2.5rem;
  color: #fff;
  font-weight: bold;
}

.score-breakdown .score-item {
  margin-bottom: 16px;
}

.score-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #e0e0e0;
}

.score-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-progress .progress {
  flex: 1;
  height: 24px;
  background: #1a1a1a;
  border-radius: 12px;
}

.score-progress strong {
  color: #fff;
  min-width: 60px;
  text-align: right;
}

/* 风险预警 */
.risk-warning-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.risk-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.risk-item.risk-high {
  background: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
}

.risk-item.risk-low {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4caf50;
}

.risk-number {
  width: 32px;
  height: 32px;
  background: #4fc3f7;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.risk-content strong {
  color: #fff;
  display: block;
  margin-bottom: 4px;
}

/* 优化建议 */
.optimization-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.optimization-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #2a2a2a;
  border-radius: 8px;
  margin-bottom: 12px;
}

.optimization-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4caf50, #2196f3);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.optimization-content h6 {
  color: #4fc3f7;
  margin-bottom: 8px;
}

.optimization-content ul {
  margin-bottom: 8px;
  padding-left: 20px;
}

.optimization-content li {
  color: #b0b0b0;
  margin-bottom: 4px;
}

/* 决策建议 */
.decision-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #2a2a3e 100%);
  border: 1px solid #4fc3f7;
  border-radius: 16px;
  padding: 28px;
}

.decision-conclusion {
  text-align: center;
  margin-bottom: 24px;
}

.decision-conclusion .alert {
  border-radius: 12px;
  padding: 20px;
}

.decision-details {
  color: #e0e0e0;
}

.must-do-section,
.recommended-section,
.expected-results {
  background: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-buttons .btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cost-item-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .cost-item-input .form-control {
    width: 100%;
  }

  .summary-breakdown .summary-item {
    flex-direction: column;
    gap: 8px;
  }

  .score-progress {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

**验收标准:**
- [ ] 深色主题一致性（与 Step 1-3 一致）
- [ ] 所有卡片和模块样式正常
- [ ] 输入框、按钮、进度条样式完整
- [ ] Hover 效果流畅
- [ ] 响应式布局适配（768px 断点）

---

### Phase 7: 数据层和集成 (1小时)

#### 7.1 Mock 数据 (assets/data/step4-mock-data.js)

```javascript
// Step 4 Mock 数据
const step4MockData = {
  // CAPEX 默认值
  capex: {
    m1: {
      market: 'US',
      legalEntity: { enabled: true, cost: 3500, range: [2000, 5000] },
      license: { enabled: true, cost: 1000, range: [500, 2000] },
      taxRegistration: { enabled: true, cost: 500, range: [0, 1000] },
      bankAccount: { enabled: true, cost: 250, range: [0, 500] }
    },
    m2: {
      salesModel: 'FBA',
      website: { enabled: false, cost: 0, range: [5000, 20000] },
      platform: { enabled: true, cost: 500, range: [0, 500] },
      erp: { enabled: true, cost: 5000, range: [2000, 10000] },
      payment: { enabled: true, cost: 1000, range: [500, 2000] },
      hosting: { enabled: true, cost: 500, range: [200, 1000] }
    },
    m3: {
      category: 'pet',
      certification: { enabled: true, cost: 5000, range: [3000, 15000] },
      testing: { enabled: true, cost: 2000, range: [1000, 5000] },
      packaging: { enabled: true, cost: 3000, range: [2000, 8000] },
      inventory: { enabled: true, cost: 20000, range: [10000, 50000] },
      warehouse: { enabled: true, cost: 10000, range: [5000, 20000] }
    }
  },

  // OPEX 默认值 (月度)
  opex: {
    m4: {
      units: 1000,
      cogs: 15.00,
      shipping: 3.50,
      tariffRate: 4.5,
      salesTaxRate: 7.0
    },
    m5: {
      model: 'fba',
      storage: 0.75,
      delivery: 3.50,
      returnFee: 2.00,
      returnRate: 5.0
    },
    m6: {
      ppc: 5000,
      kol: 2000,
      social: 1500,
      affiliate: 500
    },
    m7: {
      channel: 'amazon',
      commissionRate: 15.0,
      paymentRate: 2.9,
      paymentFixed: 0.30,
      saas: 200,
      analytics: 100
    },
    m8: {
      team: 8000,
      customerService: 1500,
      legal: 1000,
      compliance: 200,
      office: 500
    }
  },

  // 行业库
  industryLibrary: {
    pet: {
      name: 'GECOM-Pet 宠物用品',
      m3_certification: 5000,
      m3_testing: 2000,
      m4_tariffRate: 4.5,
      m5_returnRate: 3.0,
      avgCAC: 10
    },
    vape: {
      name: 'GECOM-Vape 电子烟',
      m3_certification: 100000,
      m3_testing: 10000,
      m4_tariffRate: 0,
      m4_exciseTax: 50.0,
      m5_returnRate: 8.0,
      avgCAC: 25
    },
    food: {
      name: 'GECOM-Food 食品饮料',
      m3_certification: 8000,
      m3_testing: 3000,
      m4_tariffRate: 3.0,
      m5_returnRate: 2.0,
      avgCAC: 8
    }
  },

  // 渠道费率
  channelRates: {
    amazon: { commission: 15.0, payment: 0, name: 'Amazon FBA' },
    ebay: { commission: 12.35, payment: 2.9, name: 'eBay' },
    shopify: { commission: 0, payment: 2.9, name: 'Shopify' },
    independent: { commission: 0, payment: 2.9, name: '独立站' }
  },

  // 物流模式费率
  fulfillmentRates: {
    fba: {
      name: 'Amazon FBA',
      storage: 0.75,
      delivery: 3.50,
      return: 2.00
    },
    self: {
      name: '自发货',
      storage: 0.50,
      delivery: 5.00,
      return: 3.00
    },
    '3pl': {
      name: '3PL 海外仓',
      storage: 0.60,
      delivery: 4.50,
      return: 2.50
    }
  }
};
```

#### 7.2 主 JavaScript (assets/js/step4.js)

```javascript
// Step 4 主逻辑
class GECOMCalculator {
  constructor() {
    this.capex = { m1: 0, m2: 0, m3: 0 };
    this.opex = { m4: 0, m5: 0, m6: 0, m7: 0, m8: 0 };
    this.revenue = 0;
    this.units = 0;
  }

  // 计算 CAPEX 总计
  calculateTotalCapex() {
    return this.capex.m1 + this.capex.m2 + this.capex.m3;
  }

  // 计算 OPEX 总计
  calculateTotalOpex() {
    return Object.values(this.opex).reduce((sum, val) => sum + val, 0);
  }

  // 计算 TCO
  calculateTCO(months = 6) {
    return this.calculateTotalCapex() + (this.calculateTotalOpex() * months);
  }

  // 计算月度利润
  calculateMonthlyProfit() {
    return this.revenue - this.calculateTotalOpex();
  }

  // 计算盈亏平衡点
  calculateBreakEven() {
    const monthlyProfit = this.calculateMonthlyProfit();
    if (monthlyProfit <= 0) return Infinity;
    return this.calculateTotalCapex() / monthlyProfit;
  }

  // 计算可行性评分
  calculateFeasibilityScore() {
    // 实现评分逻辑 (见 Phase 5)
    // ...
  }
}

// 全局计算器实例
let gecomCalc = new GECOMCalculator();

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initStep4();
});

function initStep4() {
  // 加载前序步骤数据
  loadPreviousStepsData();

  // 渲染所有模块
  renderCapexTab();
  renderOpexTab();
  renderProfitTab();
  renderFeasibilityTab();

  // 绑定事件监听
  bindEventListeners();

  // 初始计算
  calculateAll();
}

// 从 Step 2/3 加载数据
function loadPreviousStepsData() {
  const charter = JSON.parse(localStorage.getItem('step2_charter') || '{}');
  const strategy = JSON.parse(localStorage.getItem('step3_strategy') || '{}');

  // 更新全局数据
  gecomCalc.units = strategy.estimatedUnits || 1000;
  gecomCalc.revenue = (charter.targetPrice || 49.99) * gecomCalc.units * 0.95; // 扣除5%退货
}

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

// 全部重新计算
function calculateAll() {
  calculateM1();
  calculateM2();
  calculateM3();
  updateCapexTotal();

  calculateM4();
  calculateM5();
  calculateM6();
  calculateM7();
  calculateM8();
  updateOpexTotal();

  calculateRevenue();
  calculateProfit();

  generateFeasibilityReport();

  saveStep4Data();
}
```

#### 7.3 集成到 index.html

在 index.html 中添加 Step 4 Tab:

```html
<!-- Step 4 Tab -->
<li class="nav-item">
  <button class="nav-link" id="step4-tab" data-bs-toggle="tab" data-bs-target="#step4" type="button">
    Step 4: 成本核算
  </button>
</li>

<!-- Step 4 Tab Pane -->
<div class="tab-pane fade" id="step4" role="tabpanel">
  <div id="step4-content"></div>
</div>

<!-- 加载 Step 4 资源 -->
<script src="assets/js/step4.js"></script>
<link rel="stylesheet" href="assets/css/step4.css">
<script>
  // 加载 Step 4 HTML 片段
  fetch('modules/step4.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('step4-content').innerHTML = html;
    });
</script>
```

**验收标准:**
- [ ] Step 4 Tab 显示正常
- [ ] 点击 Step 4 Tab 加载模块
- [ ] 从 Step 2/3 自动读取数据
- [ ] 数据保存到 localStorage
- [ ] 切换 Tab 后数据不丢失

---

## 三、测试计划

### 3.1 功能测试

| 测试项 | 验收标准 | 状态 |
|--------|---------|------|
| M1-M8 输入表单 | 所有输入框正常工作 | ☐ |
| CAPEX 汇总计算 | 总计 = M1 + M2 + M3 | ☐ |
| OPEX 汇总计算 | 总计 = M4 + M5 + M6 + M7 + M8 | ☐ |
| 收入计算 | 净收入 = 价格 × 销量 × (1 - 退货率) | ☐ |
| 利润计算 | 净利润 = 收入 - OPEX | ☐ |
| TCO 计算 | TCO = CAPEX + (OPEX × 月数) | ☐ |
| 盈亏平衡点 | 回本月数 = CAPEX / 月利润 | ☐ |
| 可行性评分 | 0-100 评分显示 | ☐ |
| 风险检测 | 自动生成高/低风险项 | ☐ |
| 优化建议 | 生成短期/中期建议 | ☐ |

### 3.2 集成测试

| 测试项 | 验收标准 | 状态 |
|--------|---------|------|
| 从 Step 2 读取 | 产品名称、价格正确加载 | ☐ |
| 从 Step 3 读取 | 销量、营销预算正确加载 | ☐ |
| 数据持久化 | 刷新页面后数据不丢失 | ☐ |
| Tab 切换 | Step 1-4 之间切换流畅 | ☐ |

### 3.3 UI测试

| 测试项 | 验收标准 | 状态 |
|--------|---------|------|
| 深色主题一致性 | 与 Step 1-3 风格统一 | ☐ |
| 响应式布局 | 1920/1440/1280 适配 | ☐ |
| ECharts 渲染 | 饼图和折线图正常显示 | ☐ |
| 动画效果 | 进度条、Hover 动画流畅 | ☐ |

---

## 四、部署检查清单

### 上线前检查
- [ ] 所有 M1-M8 模块功能完整
- [ ] CAPEX/OPEX 计算准确
- [ ] 利润分析逻辑正确
- [ ] 可行性报告生成正常
- [ ] ECharts 图表渲染正常
- [ ] 深色主题样式完整
- [ ] 从 Step 2/3 读取数据正常
- [ ] 数据持久化到 localStorage
- [ ] 响应式布局测试通过
- [ ] 浏览器兼容性测试通过

### 性能检查
- [ ] 页面加载时间 < 1秒
- [ ] 计算响应时间 < 100ms
- [ ] ECharts 初始化 < 500ms
- [ ] 无内存泄漏

---

## 五、后续优化方向

### V1.1 增强功能
- 行业库完整实现 (GECOM-Pet, GECOM-Vape, GECOM-Food)
- HS Code 税率自动查询 API 集成
- 数据可靠性等级 (Tier 1/2/3) 显示
- 多场景对比 (保守/中性/乐观)

### V1.2 高级功能
- 导出 PDF 报告
- 敏感性分析 (调整参数查看影响)
- 历史数据对比
- AI 优化建议升级 (调用 LLM API)

---

**文档版本**: v1.0
**预计完成时间**: 6-8 小时
**技术栈**: HTML5 + CSS3 + Vanilla JS + ECharts 5.x + Bootstrap 5.x
