# Step 3: 竞争运营分析 - 开发计划

## 文档信息
- **版本**: v1.0
- **创建日期**: 2025-01-19
- **基于**: [step3-competitive-operations-analysis.md](step3-competitive-operations-analysis.md)
- **状态**: 待开发

---

## 1. 开发目标

### 1.1 MVP 范围

基于产品设计文档，MVP版本包含以下模块：

✅ **包含模块**:
- 模块1: 竞品识别引擎
- 模块2: 流量解构分析
- 模块3: 转化解构分析
- 模块5: 初步运营策略建议

⏸️ **暂不包含**:
- 模块4: 竞品综合分析（卖家背景/专利/供应链）
  - 原因: 数据获取难度高，需要第三方API集成

### 1.2 核心功能

1. **竞品识别**: 基于Product Charter，通过3层筛选漏斗识别5-8个核心竞品
2. **流量分析**: 完整的Listing/关键词/广告/站外流量对比分析
3. **转化分析**: Review/定价/QA的深度数据分析
4. **策略生成**: 基于竞品分析数据，自动生成差异化运营策略建议

---

## 2. 技术架构

### 2.1 前端技术栈

```
HTML/CSS/JavaScript (与现有Step 1/2保持一致)
├── ECharts 5.x - 图表可视化
│   ├── 趋势图 (BSR/价格/Review增长)
│   ├── 雷达图 (能力对比)
│   └── 散点图 (竞品定位地图)
├── Bootstrap 5.x - UI框架
│   ├── 表格组件 (对比表)
│   ├── Tab导航
│   └── Modal弹窗
└── 原生JavaScript - 业务逻辑
    ├── 数据处理
    ├── 动态渲染
    └── 用户交互
```

### 2.2 数据结构

```javascript
// 主数据结构
const Step3Data = {
  // 输入: Product Charter (从Step 2传入)
  charter: {
    productName: 'PawGenius Smart Ball',
    coreFeatures: [...],
    targetPrice: 24.99,
    targetAudience: '中大型犬主人',
    differentiators: [...]
  },

  // 模块1: 竞品数据
  competitors: [
    {
      id: 'kong-wobbler',
      name: 'Kong Wobbler',
      asin: 'B003ALMW0M',
      price: 14.99,
      bsr: 156,
      rating: 4.6,
      reviews: 25342,
      listing: {...},
      keywords: {...},
      reviewData: {...},
      pricingData: {...}
    },
    // ... 其他竞品
  ],

  // 模块2: 流量分析数据
  trafficAnalysis: {
    listingComparison: {...},
    keywordAnalysis: {...},
    advertisingAnalysis: {...},
    offAmazonTraffic: {...}
  },

  // 模块3: 转化分析数据
  conversionAnalysis: {
    reviewAnalysis: {...},
    pricingAnalysis: {...},
    qaAnalysis: {...}
  },

  // 模块5: 策略建议
  strategyRecommendations: {
    insights: [...],
    trafficStrategy: {...},
    conversionStrategy: {...},
    differentiationTactics: [...]
  }
};
```

### 2.3 文件结构

```
/Volumes/SD2/product-selection/product-selection/
├── modules/
│   └── step3.html                 # 主页面（新建）
├── assets/
│   ├── css/
│   │   └── step3.css              # 样式文件（新建）
│   ├── js/
│   │   └── step3.js               # 业务逻辑（新建）
│   └── data/
│       └── step3-mock-data.js     # Mock数据（新建）
├── docs/
│   └── design/
│       ├── step3-competitive-operations-analysis.md  # 产品设计
│       └── step3-development-plan.md                 # 本文档
└── index.html                     # 更新导航链接
```

---

## 3. 开发阶段

### Phase 1: 基础框架搭建 (2-3天)

#### 任务列表
- [ ] 创建 `modules/step3.html` 基础页面结构
- [ ] 创建 `assets/css/step3.css` 样式文件
- [ ] 创建 `assets/js/step3.js` 主逻辑文件
- [ ] 创建 `assets/data/step3-mock-data.js` Mock数据
- [ ] 实现顶部Tab导航（5个模块切换）
- [ ] 实现深色主题样式（统一风格）
- [ ] 在 `index.html` 中添加 Step 3 入口

#### 页面基础结构

```html
<!-- modules/step3.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Step 3: 竞争运营分析 - AI选品助手</title>
    <link href="../assets/css/common.css" rel="stylesheet">
    <link href="../assets/css/step3.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <!-- 顶部导航 -->
        <nav class="step-nav">
            <button class="nav-item active" data-module="competitor-identification">
                ① 竞品识别
            </button>
            <button class="nav-item" data-module="traffic-analysis">
                ② 流量解构
            </button>
            <button class="nav-item" data-module="conversion-analysis">
                ③ 转化解构
            </button>
            <button class="nav-item" data-module="strategy-recommendations">
                ④ 策略建议
            </button>
        </nav>

        <!-- 模块容器 -->
        <div id="module-container"></div>
    </div>

    <script src="../assets/js/echarts.min.js"></script>
    <script src="../assets/data/step3-mock-data.js"></script>
    <script src="../assets/js/step3.js"></script>
</body>
</html>
```

---

### Phase 2: 模块1 - 竞品识别引擎 (2天)

#### 功能点
- [ ] Charter输入面板（左侧30%）
  - 展示从Step 2传入的Charter数据
  - 可编辑的产品名称、价格、功能、差异化点
  - "开始匹配竞品"按钮
- [ ] 3层筛选漏斗（右侧上部）
  - 类目搜索: 展示BSR Top 100筛选过程
  - 周边搜索: 展示价格带±50%筛选过程
  - 关联搜索: 展示购买/浏览关联筛选过程
  - 每层显示筛选结果数量和进度
- [ ] 核心竞品列表（右侧中部）
  - 卡片式展示5-8个竞品
  - 显示价格/BSR/评分/Review数/上架时间
  - 显示匹配原因（价格接近/互动玩具/关联推荐等）
- [ ] 竞品定位地图（右侧下部）
  - ECharts散点图
  - 横轴: 功能复杂度，纵轴: 价格
  - 气泡大小: BSR排名（越大排名越高）
  - 标注"我们"的位置

#### 数据Mock策略
使用真实的Kong/Outward/iFetch作为示例竞品，数据结构：

```javascript
const mockCompetitors = [
  {
    id: 'kong-wobbler',
    name: 'Kong Wobbler',
    price: 14.99,
    bsr: 156,
    rating: 4.6,
    reviews: 25342,
    launchDate: '2018-03',
    matchReasons: ['价格接近', '互动玩具', '关联推荐'],
    functionalityScore: 3,  // 1-5分，用于定位地图
    // ... 其他字段
  },
  // ... 其他竞品
];
```

---

### Phase 3: 模块2 - 流量解构分析 (3-4天)

#### 子模块结构
```
模块2: 流量解构分析
├── 2.1 Listing分析
│   ├── 竞品选择器（多选，最多3个）
│   ├── Listing对比表（标题/图片/五点/A+/排名）
│   └── BSR排名趋势图（Keepa风格，ECharts折线图）
├── 2.2 关键词分析
│   ├── 关键词对比表（自然词/广告词/长尾词）
│   └── TOP 20关键词明细表
├── 2.3 广告投放分析
│   └── 广告类型分布表（SP/SB/SD）
└── 2.4 站外流量分析
    └── 站外渠道分析表（Deals/社交/KOL/Google）
```

#### 功能点

**2.1 Listing分析**
- [ ] 竞品选择器（复选框，最多选3个）
- [ ] Listing对比表
  - 5个维度：标题优化/图片视频/五点描述/A+页面/排名变化
  - 每个维度展示详细数据（字符数、数量、占比等）
  - 数据来源说明列
- [ ] BSR排名趋势图
  - ECharts折线图
  - 显示过去90天的排名变化
  - 支持多条曲线对比（最多3条）
  - 标注重要时间点（Prime Day、Black Friday）

**2.2 关键词分析**
- [ ] 关键词对比表
  - 自然排名词数量、Top 10排名词
  - 广告投放词数量、广告位分布
  - 长尾词覆盖情况
- [ ] TOP 20关键词明细表
  - 按搜索量排序
  - 显示每个竞品的排名
  - 支持排序和筛选

**2.3 广告投放分析**
- [ ] 广告类型分布表
  - SP/SB/SD三种类型的投放强度
  - 广告位出现频率
  - 观测说明

**2.4 站外流量分析**
- [ ] 站外渠道分析表
  - Deals网站、社交媒体、KOL合作、Google导流
  - 证据/数据来源链接

#### 技术实现要点

```javascript
// ECharts BSR趋势图配置
const bsrTrendChart = {
  type: 'line',
  xAxis: {
    type: 'category',
    data: ['90天前', '60天前', '30天前', '今天']
  },
  yAxis: {
    type: 'value',
    inverse: true,  // 排名越小越好，Y轴倒序
    name: 'BSR排名'
  },
  series: [
    {
      name: 'Kong Wobbler',
      data: [180, 170, 165, 156],
      type: 'line',
      smooth: true
    },
    // ... 其他竞品
  ]
};
```

---

### Phase 4: 模块3 - 转化解构分析 (3天)

#### 子模块结构
```
模块3: 转化解构分析
├── 3.1 Review分析
│   ├── Review基础数据表（数量/质量/增速）
│   ├── Review内容分析表（好评/差评高频词）
│   └── Review增长趋势图（ECharts折线图）
├── 3.2 定价分析
│   ├── 价格历史对比表（Keepa数据）
│   └── 价格历史趋势图（ECharts折线图）
└── 3.3 QA分析
    ├── QA数据对比表
    └── 高频问题分类表
```

#### 功能点

**3.1 Review分析**
- [ ] Review基础数据表
  - 数量指标：总数、近30天新增、日均增速、VP占比
  - 质量指标：平均评分、星级分布、带图/视频占比
  - 增长趋势：上架时间、月均增长、早期策略推测
- [ ] Review内容分析表
  - 好评高频词（5星+4星）
  - 差评高频词（1星+2星）
  - 词频统计（出现次数）
- [ ] Review累计增长趋势图
  - ECharts折线图（面积图）
  - 显示过去12个月的累计增长
  - 多条曲线对比

**3.2 定价分析**
- [ ] 价格历史对比表
  - 价格水平：当前价/历史最高/最低/90天平均
  - 促销策略：频率、LD/BD/Coupon/S&S使用情况
  - 价格弹性：促销时排名变化
- [ ] 价格历史趋势图
  - ECharts折线图
  - 显示过去180天的价格变化
  - 标注促销时间点（Prime Day、Black Friday）

**3.3 QA分析**
- [ ] QA数据对比表
  - QA总数、已回答数、回答率
  - 卖家回答数、卖家回答率
- [ ] 高频问题分类表
  - 按问题类型分类（尺寸适配、使用方法、耐用性等）
  - 显示问题内容和出现次数
  - 占比统计

---

### Phase 5: 模块5 - 初步运营策略建议 (2-3天)

#### 界面结构
```
模块5: 初步运营策略建议
├── 5.1 基于竞品分析的洞察总结（3-5条核心发现）
├── 5.2 流量策略建议
│   ├── Listing优化建议
│   ├── 关键词策略建议
│   ├── 广告投放建议
│   └── 站外引流建议
├── 5.3 转化策略建议
│   ├── Review策略
│   ├── 定价策略
│   └── QA管理策略
└── 5.4 差异化打法建议（4个打法卡片）
```

#### 功能点

**5.1 洞察总结**
- [ ] 洞察卡片组件（5个）
  - 洞察标题
  - 数据支撑（列表，3-4条）
  - 启示（2-3条行动建议）
  - 使用手风琴效果展开/折叠

**5.2 流量策略建议**
- [ ] 流量策略卡片
  - Listing优化建议（标题/主图/视频/五点/A+）
  - 关键词布局矩阵（小表格）
  - 广告投放建议（SP/SB/SD策略）
  - 站外引流建议（Deals/KOL/社交媒体）

**5.3 转化策略建议**
- [ ] 转化策略卡片
  - Review策略（目标、路径、质量要求）
  - 定价策略（上市价/促销价/长期价/促销节奏）
  - QA管理策略（回答率目标、FAQ列表）

**5.4 差异化打法建议**
- [ ] 差异化打法卡片（4个）
  - 打法1: 视频内容差异化
  - 打法2: 站外流量重投
  - 打法3: 长尾词精准打击
  - 打法4: 客户服务差异化
  - 每个打法显示：竞品现状 → 我们的打法 → 预期效果

**5.5 一页纸策略总结**
- [ ] 可下载的PDF格式总结
  - 核心洞察（5条）
  - 流量策略（简化版）
  - 转化策略（简化版）
  - 差异化打法（4条）
  - 预期效果（销量/排名/ROI）
- [ ] "下载PDF"按钮（使用html2pdf.js）

#### 技术实现要点

```javascript
// 洞察卡片组件
class InsightCard {
  constructor(data) {
    this.title = data.title;
    this.dataSupport = data.dataSupport;
    this.implications = data.implications;
  }

  render() {
    return `
      <div class="insight-card">
        <div class="insight-header">
          <h4>${this.title}</h4>
        </div>
        <div class="insight-body">
          <div class="data-support">
            <strong>数据支撑:</strong>
            <ul>
              ${this.dataSupport.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          <div class="implications">
            <strong>启示:</strong>
            <ul>
              ${this.implications.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}
```

---

### Phase 6: 数据联动与整合 (2天)

#### 功能点
- [ ] 实现Step 2 → Step 3 的数据传递
  - 从Step 2的Charter预览读取Product Charter
  - 自动填充到Step 3的模块1输入面板
- [ ] 实现竞品选择器的联动
  - 在模块1选择的竞品，自动应用到模块2/3
  - 支持重新选择竞品
- [ ] 实现策略建议的动态生成
  - 基于模块2/3的分析数据
  - 自动计算洞察和建议
- [ ] 实现数据缓存
  - 使用localStorage保存分析结果
  - 支持页面刷新后恢复数据

#### 数据流设计

```javascript
// Step 2 → Step 3 数据传递
class DataBridge {
  // 从Step 2获取Charter
  static getCharterFromStep2() {
    const charter = localStorage.getItem('step2-charter');
    return charter ? JSON.parse(charter) : null;
  }

  // 保存Step 3分析结果
  static saveStep3Analysis(data) {
    localStorage.setItem('step3-analysis', JSON.stringify(data));
  }

  // 获取Step 3分析结果
  static getStep3Analysis() {
    const data = localStorage.getItem('step3-analysis');
    return data ? JSON.parse(data) : null;
  }
}
```

---

### Phase 7: UI优化与交互完善 (2天)

#### 功能点
- [ ] 深色主题样式完善
  - 所有表格、卡片、按钮统一深色风格
  - 与Step 1/2保持一致的设计语言
  - 优化间距、字体大小、对比度
- [ ] 交互优化
  - 表格支持排序（点击表头）
  - 表格支持筛选（搜索框）
  - 图表支持缩放、下载
  - 卡片支持展开/折叠
- [ ] 响应式设计
  - 适配不同屏幕尺寸
  - 平板/手机端优化
- [ ] Loading状态
  - 数据加载时显示加载动画
  - 按钮点击后的Loading状态
- [ ] 错误处理
  - 数据加载失败提示
  - 空数据状态提示

---

### Phase 8: 测试与优化 (1-2天)

#### 测试清单
- [ ] 功能测试
  - 所有模块的Tab切换正常
  - 竞品选择器工作正常
  - 所有表格数据正确显示
  - 所有图表正确渲染
  - 策略建议正确生成
  - PDF下载功能正常
- [ ] 数据联动测试
  - Step 2 → Step 3数据传递正确
  - 竞品选择联动正确
  - LocalStorage缓存正常
- [ ] 兼容性测试
  - Chrome/Firefox/Safari/Edge
  - 不同屏幕分辨率
- [ ] 性能测试
  - 页面加载速度
  - 图表渲染性能
  - 大量数据处理性能
- [ ] UI/UX测试
  - 深色主题一致性
  - 间距、对齐、字体
  - 交互流畅性

#### 优化项
- [ ] 代码优化
  - 提取公共函数到utils.js
  - 优化数据处理逻辑
  - 减少重复代码
- [ ] 性能优化
  - 图表懒加载（只渲染可见的图表）
  - 表格虚拟滚动（大数据量时）
  - 防抖/节流处理
- [ ] 用户体验优化
  - 添加使用提示
  - 优化错误提示文案
  - 添加快捷操作

---

## 4. Mock数据设计

### 4.1 数据文件结构

```javascript
// assets/data/step3-mock-data.js

const Step3MockData = {
  // Charter数据（从Step 2传入，这里作为fallback）
  charter: {
    productName: 'PawGenius Smart Ball',
    coreFeatures: [
      '智能互动 (APP控制)',
      '自动滚动',
      '耐咬材质'
    ],
    targetPrice: 24.99,
    targetAudience: '中大型犬主人',
    differentiators: [
      'AI算法控制滚动轨迹',
      'APP远程控制',
      '内置零食仓'
    ],
    mainKeywords: [
      'smart dog toy',
      'interactive dog ball',
      'app controlled pet toy'
    ]
  },

  // 竞品数据（5个完整的竞品）
  competitors: [
    {
      id: 'kong-wobbler',
      name: 'Kong Wobbler',
      brand: 'KONG Company',
      asin: 'B003ALMW0M',
      price: 14.99,
      bsr: 156,
      rating: 4.6,
      reviews: 25342,
      launchDate: '2018-03',
      matchReasons: ['价格接近', '互动玩具', '关联推荐'],

      // Listing数据
      listing: {
        titleLength: 156,
        titleFillRate: 0.78,
        coreKeywords: ['dog toy', 'treat', 'wobbler'],
        brandPosition: 'first',
        sellingPoints: 3,
        imageCount: 7,
        mainImageStyle: '白底产品图',
        sceneImageCount: 3,
        sceneImageRate: 0.43,
        infoGraphCount: 2,
        hasVideo: false,
        bulletStructure: '功能罗列型',
        bulletAvgLength: 280,
        bulletKeywordDensity: 'medium',
        bulletPainPoints: 1,
        hasAPlus: true,
        aPlusModules: 4,
        aPlusContentType: '图文混排',
        aPlusInfoDensity: 'low',
        aPlusHasComparison: false,
        currentBSR: 156,
        avgBSR30d: 168,
        trendBSR90d: 'stable',
        seasonalVariation: 'low'
      },

      // 关键词数据
      keywords: {
        organicTotal: 234,
        organicTop10: 12,
        brandTermRank: 1,
        categoryTermRank: { 'dog toy': 156 },
        subcategoryTermRank: { 'interactive dog toy': 23 },
        longTailCoverage: 'low',
        longTailCount: 15,
        sponsoredTotal: 56,
        adKeywordOverlap: 0.24,
        adPositions: {
          topOfSearch: 0,
          sideOfSearch: 2,
          bottomOfSearch: 5
        },
        hasSBVideoAd: false,
        brandDefense: 'strong',
        categoryBidding: 'low',
        longTailStrategy: 'low'
      },

      // Review数据
      reviewData: {
        total: 25342,
        recent30Days: 78,
        dailyAverage: 2.6,
        vpCount: 8870,
        vpRatio: 0.35,
        avgRating: 4.6,
        ratingDistribution: {
          5: 0.68,
          4: 0.18,
          3: 0.06,
          2: 0.03,
          1: 0.05
        },
        withImageRate: 0.12,
        withVideoCount: 45,
        withVideoRate: 0.002,
        growthRate: 50,
        earlyStrategy: 'Vine计划(推测)',
        topPositiveWords: [
          { word: 'durable', count: 1234 },
          { word: 'fun', count: 1089 },
          { word: 'keeps busy', count: 876 },
          { word: 'easy to clean', count: 654 },
          { word: 'great for treats', count: 543 }
        ],
        topNegativeWords: [
          { word: 'too easy', count: 234 },
          { word: 'crack', count: 187 },
          { word: 'small dogs', count: 156 },
          { word: 'lose interest', count: 123 }
        ]
      },

      // 定价数据
      pricingData: {
        currentPrice: 14.99,
        historicalHigh: 16.99,
        historicalLow: 11.99,
        average90d: 14.49,
        volatility: 0.33,
        promotionFrequency: 'high',
        promotionsPerMonth: 2,
        hasLD: true,
        ldCount90d: 4,
        hasBD: true,
        bdCount90d: 1,
        hasCoupon: true,
        couponDiscount: 0.10,
        hasSubscribeAndSave: true,
        snsDiscount: 0.05,
        primeDayDiscount: 0.20,
        blackFridayDiscount: 0.15,
        priceElasticity: 'low',
        rankChangeOnPromo: 10
      },

      // QA数据
      qaData: {
        total: 234,
        answered: 228,
        answerRate: 0.97,
        sellerAnswered: 12,
        sellerAnswerRate: 0.05,
        topQuestions: [
          { category: '尺寸适配', percentage: 0.35, examples: ['适合多大的狗?', '我的拉布拉多能用吗?'] },
          { category: '使用方法', percentage: 0.28, examples: ['怎么清洁?', '能放什么零食?'] },
          { category: '耐用性', percentage: 0.22, examples: ['会不会被咬坏?', '能用多久?'] },
          { category: '其他', percentage: 0.15, examples: ['有异味吗?', 'BPA-free吗?'] }
        ]
      },

      // 定位数据（用于地图）
      positioning: {
        functionalityScore: 3,  // 1-5分
        priceLevel: 2           // 1-5分
      }
    },

    // 其他4个竞品的完整数据...
    // Outward Hound IQ Treat Ball
    // iFetch Interactive Ball Launcher
    // Wickedbone Smart Bone
    // PetSafe Automatic Ball Launcher
  ],

  // 策略建议数据（基于竞品分析）
  strategyRecommendations: {
    insights: [
      {
        id: 1,
        title: '竞品流量高度依赖广告，自然流量不足',
        dataSupport: [
          'iFetch: SP广告出现频率38% (首页侧边)',
          'Outward: 广告投放关键词89个 (vs 自然排名312个)',
          'Kong: 广告位占比25% (搜索页底部)'
        ],
        implications: [
          '我们应该重投SEO优化，降低广告依赖',
          '长尾词布局机会大 (竞品覆盖度低)'
        ]
      },
      // ... 其他4条洞察
    ],

    trafficStrategy: {
      listing: {
        title: '填满200字符，前50字符放核心卖点',
        titleExample: 'APP Controlled Smart Dog Toy Ball...',
        mainImage: '场景图 (狗在使用) + APP界面截图',
        video: '15秒演示视频 (APP控制+自动滚动)',
        bulletPoints: '痛点导向型 (竞品多为功能罗列型)',
        bulletExample: '没时间陪狗狗? APP远程控制，随时随地互动',
        aPlus: '高质量 (7+模块，含功能对比图)'
      },
      keywords: {
        avoid: ['dog toy (500K搜索，竞争激烈)'],
        target: ['smart dog toy (15K搜索，竞品少)'],
        longTail: ['app controlled dog toy (3K搜索，排名机会大)'],
        brandDefense: '100%投放SB广告'
      },
      advertising: {
        sp: 'SP广告: 中等投入，避开大词竞价。前3个月ACoS目标60%，3个月后降至35%',
        sb: 'SB视频广告: 重点投放 (竞品少有)，展示APP控制差异化功能',
        sd: 'SD广告: 在竞品详情页截流 (Kong/Outward/iFetch页面下方)'
      },
      offAmazon: {
        deals: 'Deals网站: 上架前2周重点推广 (Slickdeals、DealNews、Kinja Deals)，首单折扣20%',
        kol: 'KOL合作: 3-5个宠物博主，粉丝规模50K+，提供产品+佣金15%',
        social: '社交媒体: TikTok (产品演示短视频)、Instagram (用户UGC内容)',
        target: '目标: 站外流量占比20% (竞品平均10%)'
      }
    },

    conversionStrategy: {
      review: {
        target: '6个月500条Review，评分4.5+',
        path: [
          'Month 1-2: Vine计划 (200条，VP占比40%)',
          'Month 3-6: 自然增长 (50条/月)',
          'Early Reviewer Program',
          '包裹插卡引导 (合规话术)'
        ],
        quality: [
          '鼓励带图/视频Review (iFetch占比2.7%，我们目标5%)',
          '快速回复负面Review (24小时内)'
        ]
      },
      pricing: {
        launchPrice: 29.99,
        firstMonthPrice: 24.99,
        longTermPrice: 27.99,
        promotionFrequency: '1次/月 (Prime Day/Black Friday重点)',
        differentiation: 'Subscribe & Save 8折 (竞品Kong/Outward有)',
        strategy: [
          '避免频繁LD (Outward 3次/月，我们仅1次/月)',
          '用Coupon+S&S替代大幅降价',
          '保持利润率33% (不低于30%)'
        ]
      },
      qa: {
        targetResponseRate: 0.3,
        faq: [
          '电池续航多久? (对标iFetch高频问题)',
          'APP兼容性? (iOS/Android)',
          '适合多大的狗? (尺寸适配)',
          '噪音大吗? (室内使用)'
        ],
        differentiation: '在QA中强调APP控制优势'
      }
    },

    differentiationTactics: [
      {
        id: 1,
        title: '视频内容差异化',
        competitorStatus: [
          '只有iFetch有Listing视频',
          '只有iFetch投SB视频广告'
        ],
        ourApproach: [
          'Listing主图后放15秒演示视频 (APP控制+自动滚动)',
          'SB视频广告展示差异化功能 (AI轨迹算法)',
          'A+页面嵌入多个使用场景视频',
          '社交媒体重点做短视频内容 (TikTok/Instagram Reels)'
        ],
        expectedResults: [
          'CTR提升20% (相比无视频Listing)',
          '视频Review占比5% (竞品<1%)'
        ]
      },
      // ... 其他3个打法
    ]
  }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Step3MockData;
}
```

### 4.2 数据Mock原则

1. **真实性**: 使用真实的Kong/Outward/iFetch作为示例，数据基于合理推测
2. **完整性**: 每个竞品的数据结构完整，覆盖所有分析维度
3. **逻辑性**: 数据之间保持逻辑一致性（如价格与定位的关系）
4. **可扩展性**: 易于添加新竞品或修改数据

---

## 5. 样式设计规范

### 5.1 颜色系统（深色主题）

```css
/* assets/css/step3.css */

:root {
  /* 背景色 */
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --bg-tertiary: #2d2d2d;
  --bg-hover: #333333;

  /* 文字色 */
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-tertiary: #808080;
  --text-disabled: #505050;

  /* 强调色 */
  --color-blue: #3b82f6;
  --color-green: #22c55e;
  --color-red: #ef4444;
  --color-yellow: #f59e0b;
  --color-purple: #a855f7;

  /* 边框色 */
  --border-color: #404040;
  --border-color-light: #4a4a4a;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* 字体大小 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;

  /* 圆角 */
  --border-radius-xs: 2px;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
}
```

### 5.2 组件样式

**Tab导航**
```css
.step-nav {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
}

.nav-item {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item.active {
  background: var(--color-blue);
  border-color: var(--color-blue);
  color: white;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

**对比表格**
```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.comparison-table thead th {
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
}

.comparison-table tbody td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.comparison-table tbody tr:hover {
  background: var(--bg-hover);
}
```

**洞察卡片**
```css
.insight-card {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.insight-card:hover {
  border-color: var(--color-blue);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
}

.insight-header h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.data-support,
.implications {
  margin-top: var(--spacing-md);
}

.data-support ul,
.implications ul {
  list-style: none;
  padding: 0;
  margin: var(--spacing-sm) 0 0 0;
}

.data-support li::before {
  content: '•';
  color: var(--color-blue);
  font-weight: bold;
  display: inline-block;
  width: 1em;
}

.implications li::before {
  content: '→';
  color: var(--color-green);
  font-weight: bold;
  display: inline-block;
  width: 1.5em;
}
```

---

## 6. 开发时间表

### 总体时间估算: 16-21天

| 阶段 | 任务 | 工作量 | 时间 |
|------|------|--------|------|
| Phase 1 | 基础框架搭建 | 中 | 2-3天 |
| Phase 2 | 模块1 - 竞品识别 | 中 | 2天 |
| Phase 3 | 模块2 - 流量解构 | 高 | 3-4天 |
| Phase 4 | 模块3 - 转化解构 | 中 | 3天 |
| Phase 5 | 模块5 - 策略建议 | 中 | 2-3天 |
| Phase 6 | 数据联动与整合 | 中 | 2天 |
| Phase 7 | UI优化与交互 | 中 | 2天 |
| Phase 8 | 测试与优化 | 低 | 1-2天 |

### 里程碑

- **Day 3**: Phase 1完成，基础框架可运行
- **Day 5**: Phase 2完成，竞品识别功能可用
- **Day 9**: Phase 3完成，流量分析功能可用
- **Day 12**: Phase 4完成，转化分析功能可用
- **Day 15**: Phase 5完成，策略建议功能可用
- **Day 17**: Phase 6完成，数据联动完成
- **Day 19**: Phase 7完成，UI优化完成
- **Day 21**: Phase 8完成，测试通过，MVP交付

---

## 7. 风险与挑战

### 7.1 技术风险

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| ECharts图表性能问题 | 中 | 使用懒加载，只渲染可见图表；优化数据量 |
| 大数据量表格卡顿 | 中 | 实现虚拟滚动；分页加载；限制显示条数 |
| 跨浏览器兼容性 | 低 | 使用成熟的polyfill；充分测试 |
| LocalStorage容量限制 | 低 | 压缩数据；只存储必要数据；定期清理 |

### 7.2 数据风险

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| Mock数据不够真实 | 中 | 基于真实产品合理推测；咨询行业专家 |
| 数据结构设计不合理 | 高 | 充分设计数据结构；预留扩展空间 |
| 策略建议逻辑不完善 | 中 | 基于多个竞品数据综合分析；设计清晰算法 |

### 7.3 时间风险

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| 开发进度延迟 | 中 | 设置缓冲时间；优先完成核心功能 |
| 需求变更 | 中 | 冻结需求；变更需评估影响 |
| 测试不充分 | 高 | 预留足够测试时间；自动化测试 |

---

## 8. 验收标准

### 8.1 功能验收

- [ ] 5个模块的Tab导航正常切换
- [ ] 竞品识别功能正常：
  - [ ] Charter输入面板正确显示
  - [ ] 3层筛选漏斗可视化清晰
  - [ ] 核心竞品列表正确展示
  - [ ] 竞品定位地图正确渲染
- [ ] 流量解构功能正常：
  - [ ] Listing对比表数据完整
  - [ ] BSR趋势图正确显示
  - [ ] 关键词分析表完整
  - [ ] 广告投放分析完整
  - [ ] 站外流量分析完整
- [ ] 转化解构功能正常：
  - [ ] Review分析完整（数据表+内容分析+趋势图）
  - [ ] 定价分析完整（对比表+趋势图）
  - [ ] QA分析完整（数据表+分类表）
- [ ] 策略建议功能正常：
  - [ ] 5条洞察正确展示
  - [ ] 流量策略完整
  - [ ] 转化策略完整
  - [ ] 4个差异化打法完整
  - [ ] 一页纸总结可下载

### 8.2 性能验收

- [ ] 页面首次加载时间 < 2秒
- [ ] Tab切换响应时间 < 500ms
- [ ] 图表渲染时间 < 1秒
- [ ] 表格滚动流畅（60fps）
- [ ] 无明显卡顿和延迟

### 8.3 UI验收

- [ ] 深色主题一致性
- [ ] 与Step 1/2设计风格统一
- [ ] 间距、对齐、字体符合规范
- [ ] 响应式布局正常（桌面/平板/手机）
- [ ] 无明显UI bug

### 8.4 兼容性验收

- [ ] Chrome最新版正常
- [ ] Firefox最新版正常
- [ ] Safari最新版正常
- [ ] Edge最新版正常
- [ ] 1920×1080分辨率正常
- [ ] 1366×768分辨率正常

---

## 9. 后续优化方向

### 9.1 功能增强

1. **模块4: 竞品综合分析**
   - 集成第三方API获取真实的卖家背景数据
   - 专利数据库查询集成
   - Keepa API集成获取库存数据

2. **AI辅助分析**
   - 使用NLP自动提取Review高频词
   - 自动分类QA问题
   - 智能生成策略建议文案

3. **数据导出**
   - Excel导出所有对比表
   - 图表导出为PNG/SVG
   - 完整分析报告PDF导出

4. **竞品对比优化**
   - 支持选择更多竞品（不限于5个）
   - 自定义对比维度
   - 保存对比配置

### 9.2 数据集成

1. **真实数据源集成**
   - Keepa API: 价格历史、BSR历史、Review增长
   - Helium10 API: 关键词数据、竞品发现
   - ReviewMeta API: Review分析
   - Amazon Advertising API: 广告数据

2. **数据更新机制**
   - 定期更新竞品数据
   - 缓存机制优化
   - 增量更新支持

### 9.3 用户体验

1. **引导教程**
   - 首次使用引导
   - 功能使用提示
   - 视频教程

2. **快捷操作**
   - 键盘快捷键支持
   - 快速筛选/搜索
   - 收藏常用竞品

3. **个性化**
   - 保存用户偏好
   - 自定义显示列
   - 主题切换（深色/浅色）

---

## 10. 总结

本开发计划基于[step3-competitive-operations-analysis.md](step3-competitive-operations-analysis.md)产品设计文档，详细规划了Step 3模块的开发流程、技术实现、Mock数据设计和验收标准。

### 关键要点

1. **分阶段开发**: 8个阶段，每个阶段有明确的任务和交付物
2. **MVP优先**: 先完成核心模块（1/2/3/5），后续迭代模块4
3. **Mock数据**: 使用真实产品作为示例，数据结构完整且逻辑合理
4. **统一风格**: 与Step 1/2保持一致的深色主题和设计语言
5. **可扩展性**: 预留数据集成、AI辅助分析等后续优化空间

### 预期成果

完成本开发计划后，将交付一个功能完整、数据丰富、用户体验良好的**竞争运营分析模块**，帮助用户：
- 快速识别核心竞争对手
- 全面分析竞品的运营打法
- 获得可执行的差异化运营策略

---

**文档版本**: v1.0
**最后更新**: 2025-01-19
**下一步**: 开始Phase 1 - 基础框架搭建
