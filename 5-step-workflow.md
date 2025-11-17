# 5步标准化内容生产流程 📖

> **版本：** v2.1（工具驱动版+数据持久化+3个强制checkpoint）
> **创建时间：** 2025-10-13
> **最后更新：** 2025-10-15（Phase 3: 数据持久化集成）
> **适用阶段：** Day 5-30（流程迭代期 + 规模化生产期）

---

## 📋 流程概览（v2.0）

```
Step 1: 选题策划（60-80min）⭐ 双引擎选题策略 + 数据持久化
   ├─ 1.0 初始化数据管理（1min，自动）
   ├─ 1.1a Google Trends + Twitter + Reddit实时热点监控（10-15min，手工）→ 💾 存入CSV
   ├─ 1.1b WebSearch搜索20个关键词（15-20min，工具驱动）→ 💾 存入CSV
   ├─ 1.2 WebFetch获取76个信息源（20-30min，工具驱动）→ 💾 存入CSV
   ├─ 1.4-1.5 CSV查询+热度趋势检测+优先级计算（12-17min）
   └─ 1.6 输出选题清单 → ⭐ Checkpoint 1: 用户确认选题 → 💾 更新CSV状态
      ↓
Step 2: 资料收集（1-2小时）
   ├─ 2.1 确定目标（2min）
   ├─ 2.2 WebFetch深度获取来源内容（60-90min）
   └─ 2.5 输出资料汇总文档
      ↓
Step 3: AI深度加工（2-3小时）
   ├─ 3.1 选择Prompt模板（2min）
   ├─ 3.2 整合资料（10min）
   └─ 3.3 Claude生成初稿（120-150min）
      ↓
Step 4: 质量审核（20-30min）
   ├─ 4.1 Claude自动化检查（3-5min）
   ├─ 4.2 本地测试发布（5-10min）
   ├─ 4.3 用户人工复核 → ⭐ Checkpoint 2: 用户打分+确认"可发布"
   └─ 4.4 计算最终评分（2min）
      ↓
Step 5: 发布与分发（5-10min）
   ├─ 5.1 最后检查（2min）
   ├─ 5.2 上传Appwrite生产环境（3min）
   └─ 5.3 生产环境验证 → ⭐ Checkpoint 3: 用户确认"发布成功"

总耗时：5.5-7.5小时/篇（Day 5-15手工流程）→ 2-3小时/篇（Day 16-30自动化后）
核心改进：工具驱动流程 + 数据持久化 + 3个强制确认点 + 真实数据计算
```

---

## Step 1: 选题策划（60-80分钟）⭐ 双引擎选题策略 + 数据持久化

### 1.0 初始化数据管理（Claude执行，1分钟）

**核心价值：** 确保CSV数据文件存在，为后续数据持久化操作做准备。

**执行方式（Claude自动执行）：**
```typescript
import { initDataManager } from '../scripts/data-manager';

// 初始化数据管理系统（仅首次执行耗时~1分钟，后续秒级）
await initDataManager();
// 自动检查并创建：
// - data/topic-candidates.csv
// - data/source-contents.csv
// - data/daily-logs.csv
```

**输出：** 数据管理系统就绪 ✅

---

### 1.1a 实时热点监控（Day 5-15）⭐ Google Trends + Twitter + Reddit

**核心价值：** 捕捉"突发热点"和"舆论焦点"，补充系统化搜索的滞后性。

**为什么需要实时热点监控？**
- **WebSearch/WebFetch滞后1-2天**（搜索引擎索引需要时间）
- **Google Trends捕捉热度突然上升300%+的话题**（如某政策突然发布、某事件突然爆发）
- **Twitter Trending捕捉当下正在讨论的话题**（实时性最强，0-2小时延迟）
- **Reddit热门捕捉专业社区深度讨论**（补充主流媒体盲区）

**执行方式（手工操作，10-15分钟）：**

**1. Google Trends（5分钟）**
```
访问：https://trends.google.com/trends/

搜索以下关键词（过去7天热度）：
- "cross-border ecommerce"
- "Southeast Asia"
- "China tariff"
- "global expansion"
- "supply chain"

筛选标准：
- 热度上升≥300%（"突破性上升"标签）
- 相关查询出现"2025"、"new policy"、"breaking"等关键词
- 记录3-5个突发热点话题
```

**2. Twitter Trending（5分钟）**
```
访问：https://twitter.com/explore/tabs/trending

监控以下标签：
- #GlobalExpansion
- #CrossBorder
- #Tariff
- #SupplyChain
- #EmergingMarkets

筛选标准：
- Trending in "Business" or "Technology"分类
- Tweet数量≥10K+
- 出现企业名（如Temu、Shopee、Amazon）或政府机构名（如USTR、WTO）
- 记录3-5个舆论焦点话题
```

**3. Reddit热门（5分钟）**
```
访问以下版块，按"Hot"排序：
- r/entrepreneur（创业者讨论）
- r/digitalnomad（数字游民/远程工作）
- r/Ecommerce（电商专业讨论）
- r/supplychain（供应链专业讨论）

筛选标准：
- Upvotes≥500+
- Comments≥50+（说明有深度讨论）
- 标题包含"2025"、"China"、"policy"等关键词
- 记录2-3个长尾热点话题
```

**输出：** 8-13个实时热点候选选题（记录标题、来源、热度指标）

**示例输出：**
```markdown
## 实时热点监控结果（2025-10-15）

### Google Trends热度上升（3个）
1. "US China tariff 2025" - 热度上升500%（过去7天）
2. "Vietnam supply chain" - 热度上升350%
3. "Temu shipping cost" - 热度上升400%

### Twitter Trending（4个）
4. #TariffsOnChina - 15K tweets（过去24小时）
5. #SupplyChainResilience - 12K tweets
6. #TemuVsAmazon - 8K tweets
7. #SEAsiaExpansion - 6K tweets

### Reddit热门（3个）
8. r/entrepreneur: "How to navigate US-China tariff as e-commerce seller" - 850 upvotes, 120 comments
9. r/supplychain: "Vietnam vs Thailand manufacturing cost comparison 2025" - 650 upvotes, 80 comments
10. r/Ecommerce: "Temu's business model under pressure" - 500 upvotes, 60 comments
```

---

#### 💾 数据操作（Claude执行，2-3分钟）

**将实时热点候选选题存入CSV数据库：**
```typescript
import { appendCandidate, isDuplicateCandidate } from '../scripts/data-manager';

// 遍历8-13个实时热点候选选题
for (const topic of realTimeTopics) {
  const candidate = {
    title: topic.title,
    source: topic.source,  // 'Google Trends', 'Twitter', 'Reddit'
    sourceUrl: topic.url,
    discoveredAt: new Date(),
    industry: extractIndustry(topic.title),  // 自动提取行业
    region: extractRegion(topic.title),      // 自动提取区域
    pestelCategory: extractPestel(topic.title),
    dimensionCategory: extractDimension(topic.title),
    sourceTier: 'Tier2',  // Twitter/Reddit为Tier2
    impactLevel: estimateImpact(topic.title),
    priorityScore: 0,  // 暂时为0，在Step 1.5计算
    trendingHistory: [{
      date: new Date(),
      heat: topic.heatIndex,  // Google Trends热度、Tweet数量、Upvotes
      source: topic.source
    }],
    status: 'pending'
  };

  // 去重检查（基于title+industry+region）
  const isDup = await isDuplicateCandidate(candidate);
  if (!isDup) {
    await appendCandidate(candidate);
  } else {
    // 如果重复，会自动更新trending_history（热度追踪）
    console.log(`[去重] ${candidate.title} 已存在，已更新热度历史`);
  }
}
```

**关键特性：**
- ✅ **去重逻辑：** 基于 `title + industry + region` 模糊匹配
- ✅ **热度追踪：** 如话题重复出现，会追加 `trendingHistory` 记录热度变化
- ✅ **永久保留：** 数据不会删除，仅归档（`status='archived'`）

**输出：** 8-13条数据已存入 `data/topic-candidates.csv`

---

### 1.1b 系统化关键词搜索（Day 5-15）⭐ 使用WebSearch工具

**核心价值：** 系统化覆盖PESTEL六维度 + 四维体系 + 7行业 + 6区域，避免遗漏重要热点。

**21个搜索关键词矩阵：**

**【行业×热点】7个：**
- `electric vehicle market expansion 2025`（新能源）
- `cross-border ecommerce tariff policy 2025`（电商）
- `SaaS global expansion Asia 2025`（SaaS）
- `manufacturing relocation Southeast Asia 2025`（制造业）
- `drone export regulation global markets 2025`（无人机/低空经济）
- `supply chain resilience 2025`（供应链）
- `fintech regulation emerging markets 2025`（金融科技）

**【区域×政策】6个：**
- `Southeast Asia trade policy 2025`
- `Latin America investment regulation 2025`
- `Middle East business environment 2025`
- `Europe China trade relations 2025`
- `US China tariff update 2025`
- `Africa market entry policy 2025`

**【PESTEL维度】6个：**
- `international trade policy changes 2025`（Political）
- `emerging market economic outlook 2025`（Economic）
- `consumer behavior trends Asia 2025`（Social）
- `AI regulation global markets 2025`（Technological）
- `ESG compliance international business 2025`（Environmental）
- `cross-border data privacy law 2025`（Legal）

**【四维体系补充】2个：**
- `geopolitical risk global business 2025`（地缘风险）
- `local operations challenges Asia 2025`（运营落地）

**执行方式（Claude执行，15-20分钟）：**
```
使用WebSearch工具并行搜索20个关键词
→ 每个关键词提取2-3个最新热点（2025年Q3/Q4优先）
→ 汇总得到40-60个候选选题
```

---

#### 💾 数据操作（Claude执行，2-3分钟）

**将系统化搜索结果存入CSV数据库：**
```typescript
import { appendCandidate, isDuplicateCandidate } from '../scripts/data-manager';

// 遍历40-60个WebSearch候选选题
for (const topic of webSearchTopics) {
  const candidate = {
    title: topic.title,
    source: 'WebSearch',
    sourceUrl: topic.url,
    discoveredAt: new Date(),
    industry: topic.industry,  // 从搜索关键词推断
    region: topic.region,
    pestelCategory: topic.pestelCategory,
    dimensionCategory: topic.dimensionCategory,
    sourceTier: inferTier(topic.sourceDomain),  // 根据域名推断Tier
    impactLevel: 'P1',  // 初步设为P1
    priorityScore: 0,  // 在Step 1.5计算
    trendingHistory: [{
      date: new Date(),
      heat: topic.relevanceScore || 0,
      source: 'WebSearch'
    }],
    status: 'pending'
  };

  // 去重检查
  const isDup = await isDuplicateCandidate(candidate);
  if (!isDup) {
    await appendCandidate(candidate);
  }
}
```

**输出：** 40-60条数据已存入 `data/topic-candidates.csv`

---

### 1.2 获取76个信息源内容（Day 5-15）⭐ 使用WebFetch工具

**从content-sources-list-v3.md中选择10-15个S级/A级来源：**

**优先级S级来源（政府/国际组织，5个）：**
- US Department of Commerce: https://www.commerce.gov/news
- USTR官网: https://ustr.gov/about-us/policy-offices/press-office
- World Bank: https://www.worldbank.org/en/news
- Singapore EDB: https://www.edb.gov.sg/en/news-and-resources.html
- WTO: https://www.wto.org/english/news_e/news_e.htm

**优先级A级来源（顶级媒体/智库，8-10个）：**
- Bloomberg: Southeast Asia News
- Reuters: Trade Policy & Global Markets
- McKinsey: Global Commerce Insights
- TechCrunch: Asia Tech News
- Financial Times: Emerging Markets
- BCG: Cross-Border Reports
- Tech in Asia: Market Analysis
- Harvard Business Review: International Business

**执行方式（Claude执行，20-30分钟）：**
```
使用WebFetch工具获取每个信息源的最新内容
→ 提取标题、发布日期、摘要、URL
→ 筛选2025年Q3/Q4最新内容
→ 汇总到候选选题池（与1.1合并）
```

---

#### 💾 数据操作（Claude执行，3-5分钟）

**将WebFetch信息源内容存入两个CSV：**

**1. 候选选题存入 `topic-candidates.csv`：**
```typescript
import { appendCandidate, isDuplicateCandidate } from '../scripts/data-manager';

// 从10-15个信息源提取的候选选题
for (const topic of webFetchTopics) {
  const candidate = {
    title: topic.title,
    source: topic.sourceName,  // 'Bloomberg', 'McKinsey', etc.
    sourceUrl: topic.url,
    discoveredAt: new Date(),
    industry: extractIndustry(topic.title, topic.summary),
    region: extractRegion(topic.title, topic.summary),
    pestelCategory: extractPestel(topic.title, topic.summary),
    dimensionCategory: extractDimension(topic.title, topic.summary),
    sourceTier: topic.sourceTier,  // 'Tier1', 'Tier2', 'Tier3'
    impactLevel: estimateImpact(topic.title, topic.summary),
    priorityScore: 0,  // 在Step 1.5计算
    trendingHistory: [{
      date: new Date(),
      heat: 0,
      source: topic.sourceName
    }],
    status: 'pending'
  };

  const isDup = await isDuplicateCandidate(candidate);
  if (!isDup) {
    await appendCandidate(candidate);
  }
}
```

**2. 完整内容存入 `source-contents.csv`：**
```typescript
import { appendContent, isDuplicateContent } from '../scripts/data-manager';

// 保存完整原文（用于Step 2资料收集复用）
for (const article of webFetchArticles) {
  const content = {
    title: article.title,
    url: article.url,
    sourceName: article.sourceName,
    sourceTier: article.sourceTier,
    publishedAt: new Date(article.publishedDate),
    fetchedAt: new Date(),
    summary: article.summary,
    keyPoints: extractKeyPoints(article.fullContent),
    dataPoints: extractDataPoints(article.fullContent),
    topics: extractTopics(article.title, article.summary),
    pestelCategories: extractPestel(article.title, article.summary),
    usedInArticles: [],
    usageCount: 0,
    qualityScore: rateQuality(article),
    isVerified: article.sourceTier === 'Tier1',
    fullContent: article.fullContent,
    contentHash: generateHash(article.url)
  };

  const isDup = await isDuplicateContent(content);
  if (!isDup) {
    await appendContent(content);
  }
}
```

**关键特性：**
- ✅ **双重存储：** 选题存入 `topic-candidates.csv`，完整内容存入 `source-contents.csv`
- ✅ **内容复用：** Step 2资料收集时可直接查询 `source-contents.csv`，无需重复WebFetch
- ✅ **URL去重：** `source-contents.csv` 基于URL去重，避免重复抓取

**输出：**
- 10-30条候选选题已存入 `data/topic-candidates.csv`
- 10-30条完整内容已存入 `data/source-contents.csv`

---

### 1.3 自动化选题（Day 16-30，对接专项1）
- 调用RSS爬虫API：`GET /api/crawler/daily-articles?date=2025-10-XX`
- 获取30-50个候选新闻
- 自动按PESTEL分类
- **💾 数据操作：** 同样存入 `topic-candidates.csv` 和 `source-contents.csv`

---

### 1.4 从CSV查询候选选题 + 热度趋势检测（Claude执行，7-12分钟）⭐ 数据驱动升级

**核心变化：** 不再基于"临时内存数据"排序，而是从 **CSV数据库查询 + 热度趋势分析**

**执行方式（Claude自动执行）：**

**1. 查询所有pending状态候选选题（2-3分钟）：**
```typescript
import { queryPendingCandidates, queryTrendingCandidates } from '../scripts/data-manager';

// 查询所有pending状态的候选选题（按discoveredAt倒序，最新50条）
const pendingCandidates = await queryPendingCandidates(50);
// 返回：50个候选选题（包含完整字段）

// 查询连续上榜的热点话题
const trendingCandidates = await queryTrendingCandidates();
// 返回：热度上升20%+的话题（标记为🔥）
```

**2. 热度趋势检测（2-3分钟）：**
```typescript
// 检测连续上榜话题（trending_history有2+条记录）
trendingCandidates.forEach(candidate => {
  const history = candidate.trendingHistory;
  if (history.length >= 2) {
    const firstHeat = history[0].heat;
    const latestHeat = history[history.length - 1].heat;

    // 热度上升20%+ → 标记为🔥
    if (latestHeat > firstHeat * 1.2) {
      candidate.trendingDays = history.length;
      candidate.heatGrowth = ((latestHeat - firstHeat) / firstHeat * 100).toFixed(0) + '%';
      console.log(`🔥 ${candidate.title} - 连续${candidate.trendingDays}天 - 热度上升${candidate.heatGrowth}`);
    }
  }
});
```

**3. 合并候选选题池（1分钟）：**
```typescript
// 合并pending候选 + trending候选（trending优先）
const allCandidates = [
  ...trendingCandidates.map(c => ({ ...c, isTrending: true })),
  ...pendingCandidates.filter(c =>
    !trendingCandidates.find(tc => tc.id === c.id)
  )
];

console.log(`总候选选题：${allCandidates.length}个`);
console.log(`其中trending热点：${trendingCandidates.length}个 🔥`);
```

**4. 输出候选选题列表（2-3分钟）：**
```markdown
## 候选选题池（2025-10-15）

**总计：** 58个候选选题
- 🔥 Trending热点：5个（热度持续上升）
- 📰 新增候选：53个（今日发现）

### 🔥 Trending热点（优先考虑）
1. "US China tariff 2025" - 连续3天 - 热度上升420% 🔥
2. "Vietnam supply chain" - 连续2天 - 热度上升180% 🔥
3. "Temu shipping cost" - 连续2天 - 热度上升150% 🔥

### 📰 新增候选（今日）
4. "Southeast Asia e-commerce market Q3 2025" - Bloomberg
5. "McKinsey cross-border commerce report 2025" - McKinsey
...
```

**输出：**
- 50-100个候选选题（来自CSV数据库）
- 其中trending热点优先显示（🔥标记）
- 包含完整字段：title, source, industry, region, pestelCategory, dimensionCategory, sourceTier, impactLevel

### 1.5 多维度优先级计算（Claude执行，5-10分钟）⭐ 真实数据计算

对每个候选选题使用`priority-calculator.ts`计算优先级：
```bash
ts-node priority-calculator.ts "选题标题" 行业 区域 来源等级 影响力
```

**计算公式：**
```
总分 = 行业(30%) + 区域(25%) + 来源(20%) + 影响力(25%)

示例：《美国对中国电商加征25%关税》（基于USTR官网真实新闻）
- 行业：电商（9分）× 30% = 2.7
- 区域：美国（7分）× 25% = 1.75
- 来源：USTR（S级，10分）× 20% = 2.0
- 影响力：P0（10分）× 25% = 2.5
- **总分：8.95分 → P0（立即启动）**
```

### 1.6 输出选题清单表格 ⭐ 强制用户确认checkpoint

**Claude输出表格（前10个候选选题，按总分排序）：**

| 排名 | 选题标题 | 行业 | 区域 | 来源等级 | 影响力 | 总分 | 优先级 | 建议行动 |
|------|---------|------|------|---------|--------|------|--------|---------|
| 1 | [真实标题] | 电商 | 美国 | Tier1 | P0 | 8.95 | P0 | 立即启动 |
| 2 | [真实标题] | 供应链 | 东南亚 | Tier1 | P1 | 7.80 | P1 | 本周启动 |
| 3 | [真实标题] | 新能源 | 欧洲 | Tier1 | P1 | 7.50 | P1 | 本周启动 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**❗️强制用户确认：**
```
请从以上候选选题中选择1-2个P0/P1选题进行内容生产。
确认后，我将进入Step 2资料收集阶段。
```

**用户确认格式：**
- "选择排名1和排名3，内容类型分别为：Insight、Market"
- "仅选择排名1，内容类型：Insight"

**输出：** 选题清单表格（等待用户确认）

---

#### 💾 数据操作（用户确认后，Claude执行，1-2分钟）

**更新CSV状态为 `selected`：**
```typescript
import { markCandidateSelected } from '../scripts/data-manager';

// 基于用户确认的选题（如"选择排名1和排名3"）
const selectedTopics = [
  allCandidates[0],  // 排名1
  allCandidates[2]   // 排名3
];

for (const topic of selectedTopics) {
  await markCandidateSelected(topic.id, {
    selectedAt: new Date(),
    contentType: topic.contentType  // 'insight', 'market', etc.
  });
}
```

**关键特性：**
- ✅ **状态更新：** `status: 'pending' → 'selected'`
- ✅ **时间记录：** 记录 `selectedAt`（用于复盘分析）
- ✅ **内容类型：** 记录用户指定的内容类型（Insight/Market/Policy/Report）

**输出：** CSV状态已更新，进入Step 2 ✅

---

## Step 2: 资料收集（1-2小时）

**前置条件：** Step 1.6 用户已确认选题（如"选择排名1，内容类型：Insight"）✅

### 2.1 确定目标（基于用户确认的选题，2分钟）

**Claude确认以下信息：**
- 用户选择的选题标题
- 内容类型（Insight / Market / Policy / Report）
- 目标来源数量（根据内容类型）
- 目标阅读时间

| 内容类型 | 来源数量 | 阅读时间 | 字数范围 |
|---------|---------|---------|---------|
| Insight | 12-15个 | 8-12min | 4K-6K |
| Market | 15-20个 | 10-15min | 5K-8K |
| Policy | 15-20个 | 10-15min | 5K-8K |
| Report | 50+个 | 20-30min | 8K-12K |

### 2.2 使用WebFetch深度获取来源内容（60-90分钟）⭐ 工具驱动

**根据选题相关性，从content-sources-list-v3.md中选择Tier1/2/3来源：**

**Tier 1来源（必须5个，S级/A级）：**
- 使用WebFetch工具获取Bloomberg、Reuters、Financial Times相关文章全文
- 使用WebFetch工具获取McKinsey、BCG、Deloitte报告PDF/网页
- 使用WebFetch工具获取World Bank、IMF、OECD数据页面
- 使用WebFetch工具获取目标市场政府官网政策原文（如Singapore EDB、USTR）

**示例（假设选题是"美国对华电商加征25%关税"）：**
```
WebFetch USTR官网：https://ustr.gov/about-us/policy-offices/press-office
→ 提取关税政策原文、生效日期、受影响商品清单

WebFetch Bloomberg：搜索"US China e-commerce tariff 2025"
→ 提取市场反应、企业应对策略、专家评论

WebFetch McKinsey：搜索"cross-border e-commerce policy impact"
→ 提取成本影响测算、供应链调整建议
```

**Tier 2来源（优先10个，A级/B级）：**
- 使用WebFetch工具获取TechCrunch、VentureBeat、The Verge相关报道
- 使用WebFetch工具获取Tech in Asia、KrASIA（亚太专业媒体）分析文章
- 使用WebFetch工具获取Harvard Business Review、MIT Tech Review案例研究

**Tier 3来源（辅助2-5个，B级/C级）：**
- 使用WebFetch工具获取Medium专家长文（署名专家）
- 使用WebFetch工具获取LinkedIn行业KOL分析文章
- 使用WebSearch搜索Reddit深度讨论

**执行方式：**
```
对每个来源：
1. 使用WebFetch工具获取全文内容
2. 人工阅读全文（10-15分钟/篇）
3. 提取关键数据点：
   - 核心观点/数据
   - 发布日期（标注2025/2024/2023）
   - 来源链接（用于最后的引用标注）
4. 标注来源等级（Tier1/2/3）
```

### 2.3 权威来源清单（按优先级）

**Tier 1（必须引用，S级/A级）：**
- Bloomberg, Reuters, Financial Times, Wall Street Journal
- McKinsey, BCG, Deloitte, Bain, PwC
- World Bank, IMF, OECD, WTO
- 目标市场政府官网（如Singapore EDB, USTR, 商务部）

**Tier 2（优先引用，A级/B级）：**
- TechCrunch, VentureBeat, The Verge, The Information
- Tech in Asia, KrASIA, TechNode（亚太专业媒体）
- Harvard Business Review, MIT Technology Review, Stanford Reports

**Tier 3（辅助引用，B级/C级）：**
- Medium长文（专家署名，如前McKinsey合伙人、前政府官员）
- LinkedIn分析文章（行业KOL，如出海企业CEO、投资人）
- Reddit深度讨论（r/entrepreneur, r/digitalnomad专业讨论）

### 2.4 补充搜索方法（如来源不足）

**当WebFetch获取的来源<目标数量时：**
- 使用WebSearch搜索学术报告（Google Scholar）
- 使用WebSearch搜索综合信息（Perplexity.ai风格）
- 手工访问行业网站（通过WebFetch获取）
- **优先2025年Q1/Q2/Q3数据，2024年作为基线对比**

### 2.4 标注来源
```markdown
## 参考来源

本文基于以下20个权威来源深度分析：

**Tier 1来源（5个）：**
1. Bloomberg: "Southeast Asia E-commerce Q3 2025" (2025-09-15) [链接]
2. McKinsey: "Future of Cross-Border Commerce" (2025-08-20) [链接]
...

**Tier 2来源（10个）：**
6. TechCrunch: "Shopee Expands to Latin America" (2025-10-05) [链接]
...

**Tier 3来源（5个）：**
16. Medium: Expert Analysis on Vietnam Supply Chain (2025-09-30) [链接]
...
```

**输出：** 资料汇总文档（每个选题）

---

## Step 3: AI深度加工（2-3小时）

### 3.1 选择Prompt模板
根据内容类型选择对应的Prompt模板：
- Insight类 → `prompts/insight-template.md`
- Market类 → `prompts/market-report-template.md`
- Policy类 → `prompts/policy-update-template.md`
- Report类 → `prompts/deep-report-template.md`

### 3.2 Claude AI深度生成（Day 5-15手工流程）

**生成方式：** 由Claude AI使用对应的Prompt模板生成文章

**具体流程：**
1. **阅读Prompt模板**：完整阅读选定的Prompt模板，理解：
   - 角色设定（如"资深内容编辑"）
   - 质量标准（字数/来源数/阅读时间/2025数据占比）
   - 结构框架（如Insight类：核心洞察→影响评估→应对策略→实战建议）
   - 写作要点（如"一句话核心观点"、"案例必须具名"）

2. **整合资料**：将Step 2收集的来源整合成清晰的输入：
   ```markdown
   **参考来源（已收集15个）：**

   【Tier 1来源 - 5个】
   1. Bloomberg: "Southeast Asia E-commerce Q3 2025" (2025-09-15) [要点摘要]
   2. McKinsey: "Future of Cross-Border Commerce" (2025-08-20) [要点摘要]
   ...

   【Tier 2来源 - 8个】
   6. TechCrunch: "Shopee Expands to Latin America" (2025-10-05) [要点摘要]
   ...

   【Tier 3来源 - 2个】
   14. Medium: "Expert Analysis on Vietnam Supply Chain" (2025-09-30) [要点摘要]
   ...
   ```

3. **Claude生成初稿**：基于Prompt模板要求，Claude直接生成完整的Markdown文章，确保：
   - ✅ 严格遵守Prompt模板的所有要求（字数/结构/来源标注/数据时效性）
   - ✅ 使用2025年最新数据（占比≥80%）
   - ✅ 生成独家洞察（跨来源综合分析，非简单转述）
   - ✅ 提供可执行建议（具体量化，标注P0/P1/P2优先级）
   - ✅ 采用紧凑段落式来源标注（开篇声明+列表）

4. **人工Review（3-5分钟）**：快速检查生成内容是否符合模板要求
   - 检查字数和阅读时长
   - 检查结构层级（##和###）
   - 检查来源标注格式
   - 检查是否有独家洞察

### 3.3 交叉验证与补充
- 检查数据一致性（多个来源数据是否吻合）
- 识别矛盾信息（标注不同来源的差异）
- 补充缺失数据（如有需要，搜索额外来源）

### 3.4 生成独家洞察（Claude自动完成）
- 提炼跨来源的共同趋势
- 发现被忽视的细节
- 提供实战建议（针对中国企业出海）

**输出：** 初稿文章（Markdown格式）

---

**💡 Day 16-30自动化升级：** 待专项1完成后，可切换为DeepSeek V3 API自动生成，Claude仅负责人工复核。

---

## Step 4: 质量审核（20-30分钟）⭐ 新增本地测试+用户复核

### 4.1 Claude自动化质量检查（Claude执行，3-5分钟）

**运行quality-check.ts脚本检查6个量化维度：**
```bash
ts-node quality-check.ts article.md Insight
```

**检查项：**
```typescript
interface QualityCheck {
  sourcesCount: number;      // 目标：≥内容类型要求（Insight≥12, Market≥15, Report≥50）
  readingTime: number;       // 目标：≥内容类型要求（Insight≥9min, Market≥10min）
  dataFreshness: number;     // 目标：2025数据覆盖率≥80%（权重最高15%）
  structureQuality: number;  // 目标：有## 二级标题和### 三级标题
  tablesCount: number;       // 目标：≥3个Markdown表格
  citationFormat: number;    // 目标：紧凑段落式标注（开篇声明+列表）
}
```

**输出量化得分（0-60分）并初步评级：**
- **<36分** → 🔴 直接拒绝，重新生成（质量太差）
- **36-42分** → 🟡 高风险，需用户仔细复核（可能不达标）
- **42-51分** → 🟢 正常，需用户常规复核（预计B级）
- **≥51分** → 🟢 优秀，需用户快速复核（预计A级）

**如果<36分 → 直接返回Step 3重新生成，不进入Step 4.2**

### 4.2 本地测试发布（Claude执行，5-10分钟）

**启动本地开发服务器：**
```bash
cd /Users/batfic887/Documents/project/discovery-agent
npm run dev
```

**创建测试文章记录（不上传Appwrite生产环境）：**
1. **Unsplash自动配图：**
   - 提取关键词（标题 + 摘要前100字）
   - 调用Unsplash API搜索相关图片
   - 选择相关性最高的图片URL

2. **三重分类标注：**
   - dimension: 'market' | 'policy' | 'geopolitics' | 'report'
   - contentType: 'insight' | 'market-report' | 'policy-update' | 'deep-report'
   - pestelCategories: ['economic', 'social', ...] // PESTEL六维度

3. **生成本地预览链接：**
   - 创建临时文章ID：`test-[timestamp]`
   - 访问链接：`http://localhost:3000/articles/test-[timestamp]`

**Claude输出预览链接给用户：**
```
✅ 本地测试发布完成！

预览链接：http://localhost:3000/articles/test-1729234567890
量化得分：48/60分（🟢 正常，预计B级）

请访问上述链接进行人工复核（Step 4.3）。
```

### 4.3 用户人工复核 ⭐ 强制用户确认checkpoint（用户执行，10-15分钟）

**用户访问本地预览链接，检查以下内容：**

**1. 定性维度评分（0-10分，用户打分）：**
- **insightDepth（洞察深度）：** 是否有3+条独家洞察？跨来源综合分析而非简单转述？
- **actionability（可执行性）：** 是否有3-5条量化建议？是否标注P0/P1/P2优先级和时间/成本？
- **readability（可读性）：** 语言是否流畅易懂？是否有晦涩专业术语未解释？
- **relevance（相关性）：** 是否完全针对出海企业决策？是否有实战价值？

**2. 视觉效果检查（是/否）：**
- [ ] 图片加载是否正常？
- [ ] Markdown格式是否正确（标题层级、表格、列表）？
- [ ] 来源链接是否可点击？
- [ ] 移动端显示是否正常（可选）？

**用户反馈格式（示例）：**
```
定性维度打分：
- insightDepth: 8（有3条独家洞察，跨来源分析充分）
- actionability: 7（有4条建议，但量化不够具体）
- readability: 9（流畅易懂）
- relevance: 9（完全针对出海企业）

视觉效果：
- [x] 图片加载正常
- [x] Markdown格式正确
- [x] 来源链接可点击

确认：通过，可发布
```

**或者反馈问题：**
```
问题：
1. actionability不足（6分）：建议过于模糊，缺少量化时间和成本
2. 图片不相关：配图是"城市夜景"，但文章讲供应链

请修改：
- 补充3条量化建议（如"本周评估SKU→本月签越南供应商→Q1建仓"）
- 更换配图关键词为"supply chain warehouse"

修改后重新提交Step 4.3
```

**❗️只有用户确认"通过，可发布"后才能进入Step 4.4**

### 4.4 计算最终评分（Claude执行，2分钟）

**基于4.1量化得分 + 4.3用户打分，计算最终总分：**
```
总分 = 量化得分（60%）+ 定性得分（40%）

示例：
- 量化得分：48/60分（Step 4.1）
- 定性得分：(8+7+9+9)/10 × 40 = 33/40分（Step 4.3用户打分）
- 总分：48 + 33 = 81/100分

最终评级：
- ≥85分 → A级（标杆内容，重点推广）
- 70-84分 → B级（合格内容，正常发布）
- <70分 → C级（不达标，不发布）

示例结果：81分 → B级 ✅
```

**Claude输出最终评分报告：**
```
========== 最终质量评分 ==========

量化维度（60%）：48/60分
  - sourcesCount: 8/10
  - readingTime: 9/10
  - dataFreshness: 10/10 ⭐
  - structureQuality: 8/10
  - tablesCount: 8/10
  - citationFormat: 5/10

定性维度（40%）：33/40分（用户打分）
  - insightDepth: 8/10 (12%)
  - actionability: 7/10 (10%)
  - readability: 9/10 (10%)
  - relevance: 9/10 (8%)

总分：81/100分
评级：B级 ✅（合格内容，正常发布）

建议：
- ✅ 可发布到生产环境
- 💡 如需提升至A级，需优化actionability（补充2-3条量化建议）

是否发布到生产环境？（用户确认后进入Step 5）
```

**输出：**
- 终稿文章（Markdown文件）
- 最终评分报告（A/B/C级）
- 用户确认"可发布到生产环境" ✅

---

## Step 5: 发布与分发（5-10分钟）⭐ 测试通过后发布生产

**前置条件：** Step 4.4 用户确认"可发布到生产环境" ✅

### 5.1 最后检查（Claude执行，2分钟）

**再次确认文章元数据完整性：**
```typescript
interface ArticleMetadata {
  // 核心内容
  title: string;           // 标题（已确认）
  summary: string;         // 摘要（已确认）
  content: string;         // 正文Markdown（已通过Step 4审核）

  // 分类标签
  category: string;        // 分类（基于选题）
  dimension: string;       // 四维分类（政策/行业/地缘/运营）
  contentType: string;     // 内容类型（Insight/Market/Policy/Report）
  pestelCategories: string[]; // PESTEL六维度
  tags: string[];          // 标签（提取关键词）

  // 来源信息
  sources: Array<{        // 来源列表（Step 2收集的）
    name: string;
    url: string;
    tier: 'Tier1' | 'Tier2' | 'Tier3';
  }>;
  sourcesCount: number;    // 来源数量（≥12）

  // 阅读信息
  readingTime: number;     // 阅读时长（分钟，≥9min）

  // 图片
  imageUrl: string;        // Unsplash图片URL（Step 4.2已配图）

  // 发布时间
  publishedAt: Date;       // 当前时间
}
```

**Claude确认清单：**
- [ ] title和summary无错别字
- [ ] content包含完整来源标注
- [ ] pestelCategories数组非空
- [ ] sources数组≥12个（Insight类）
- [ ] imageUrl已配图
- [ ] 所有必填字段均已填写

**如有缺失 → 补充后再继续**

### 5.2 上传到Appwrite生产环境（Claude执行，3分钟）

**调用Appwrite API上传文章：**
```typescript
const article = {
  title: "美国对华电商加征25%关税：Temu单件成本增$3，Q4利润承压",
  summary: "USTR宣布对中国电商平台商品加征25%关税...",
  content: "...[完整Markdown正文]...",
  category: "policy",
  dimension: "policy",
  contentType: "insight",
  pestelCategories: ["political", "economic"],
  tags: ["关税", "电商", "美国", "Temu"],
  sources: [
    { name: "USTR", url: "https://ustr.gov/...", tier: "Tier1" },
    { name: "Bloomberg", url: "https://bloomberg.com/...", tier: "Tier1" },
    // ...共15个来源
  ],
  sourcesCount: 15,
  readingTime: 10,
  imageUrl: "https://images.unsplash.com/photo-...",
  publishedAt: new Date("2025-10-15T10:30:00Z")
};

await databases.createDocument(
  DB_ID,
  'articles',
  article.$id,  // 生成新的文章ID
  article
);
```

**Claude输出上传结果：**
```
✅ 文章已成功上传到Appwrite生产环境！

文章ID：67091abc123456789
生产环境URL：https://discovery.sites.apps.aotsea.com/articles/67091abc123456789

请进入Step 5.3进行生产环境验证。
```

### 5.3 生产环境验证 ⭐ 最后用户确认checkpoint（用户执行，3-5分钟）

**用户访问生产环境链接，快速验证：**
```
https://discovery.sites.apps.aotsea.com/articles/67091abc123456789
```

**验证检查清单（用户执行）：**
- [ ] 文章是否正常显示？（标题、摘要、正文）
- [ ] 图片是否加载？
- [ ] Markdown格式是否正确？（标题层级、表格、列表、链接）
- [ ] 来源链接是否可点击？
- [ ] 移动端显示是否正常？（可选）
- [ ] PESTEL标签是否正确显示？

**用户确认格式：**
```
✅ 生产环境验证通过

检查结果：
- [x] 文章正常显示
- [x] 图片加载正常
- [x] Markdown格式正确
- [x] 来源链接可点击
- [x] 移动端显示正常

确认：发布成功 ✅
```

**或者发现问题：**
```
❌ 生产环境验证失败

问题：
1. 图片404：Unsplash URL失效
2. 表格显示错乱：Markdown语法问题

请修改：
- 重新获取Unsplash图片
- 修复表格Markdown语法

修改后重新上传（返回Step 5.2）
```

### 5.4 发布完成总结（Claude执行，1分钟）

**Claude输出发布总结报告：**
```
========== 第1篇文章发布完成 ==========

文章标题：美国对华电商加征25%关税：Temu单件成本增$3，Q4利润承压
内容类型：Insight
最终评级：B级（81分）

关键指标：
- 来源数量：15个（Tier1: 5, Tier2: 8, Tier3: 2）
- 阅读时长：10分钟
- 2025数据占比：85%（超标准）
- 质量评分：81/100（B级）

生产环境URL：
https://discovery.sites.apps.aotsea.com/articles/67091abc123456789

总耗时：5.5小时
- Step 1: 50分钟（选题策划 + 用户确认）
- Step 2: 90分钟（资料收集）
- Step 3: 150分钟（AI深度生成）
- Step 4: 25分钟（质量审核 + 本地测试 + 用户复核）
- Step 5: 8分钟（发布生产 + 用户验证）

======================================

下一篇文章可继续执行5步SOP流程。
```

**输出：**
- 文章已发布到生产环境 ✅
- 生产环境URL
- 用户确认"发布成功" ✅
- 发布总结报告

---

## 📊 质量门控标准

| 检查项 | 标准 | 不达标处理 |
|--------|------|-----------|
| **sourcesCount** | ≥内容类型要求 | 补充来源 |
| **readingTime** | ≥内容类型要求 | 扩展内容 |
| **dataFreshness** | ≥80%使用2025数据 | 搜索最新数据 |
| **structureQuality** | 有##和###标题 | 重新组织 |
| **tablesCount** | ≥3个 | 添加数据表格 |
| **insightDepth** | ≥7分（10分制） | 重新分析 |
| **actionability** | ≥7分 | 补充实战建议 |

---

**最后更新：** 2025-10-13
