# Discovery POC开发方案 v3.0

> **版本：** v3.0
> **创建日期：** 2025-10-07
> **核心策略：** 内容价值验证优先 > 技术自动化
> **基于：** v2.0本地优先策略 + 内容策略v3.0

---

## 📋 文档概览

### v3.0 vs v2.0 核心差异

| 维度 | v2.0（05-poc-plan.md） | v3.0（本文档） | 升级原因 |
|------|----------------------|---------------|---------|
| **内容策略** | 10个通用RSS源 | 76个出海专属源（分阶段） | 内容价值主张升级 |
| **内容生产** | 本地Mock数据 | 手工精选内容（AI辅助） | 先验证质量，再自动化 |
| **可信架构** | 无RAG | RAG基础架构 | 引用可追溯 |
| **分类体系** | 单一分类 | 三重分类（四维+v2.0+PESTEL） | 系统化 |
| **实施阶段** | 6个Sprint（25天） | 6个Sprint + v3.0内容迭代（30天） | 增加内容验证 |

### POC v3.0的核心目标

```
POC v3.0 = POC v2.0（产品体验） + 内容价值验证

核心验证点：
1. ✅ 内容质量：四维体系+PESTEL覆盖是否有效
2. ✅ 用户价值：出海企业决策者是否认可
3. ✅ RAG可信：引用映射是否提升信任度
4. ✅ 三重分类：用户筛选是否更精准
5. ⏸️ 技术自动化：留到生产环境验证
```

**关键策略：手工内容生产 → 验证价值主张 → 再考虑自动化**

---

## 一、内容策略v3.0 POC实施方案

### 1.1 总体策略

#### 核心理念

```
Phase 1（POC验证） → 手工精选内容
  ├─ 目标：验证内容价值主张
  ├─ 数量：10-15篇高质量文章
  ├─ 方式：AI辅助生成 + 人工审核优化
  └─ 覆盖：四维体系全覆盖

Phase 2（POC扩展） → 扩大内容覆盖
  ├─ 目标：验证PESTEL六维度覆盖
  ├─ 数量：30篇文章
  ├─ 方式：AI辅助生成 + 批量优化
  └─ 覆盖：PESTEL全维度

Phase 3（生产环境） → 自动化规模化
  ├─ 目标：10-20篇/天自动生产
  ├─ 数量：月均350-400篇
  ├─ 方式：自动RSS抓取 + AI生成 + 人工审核
  └─ 覆盖：76个全球内容源
```

**POC阶段重点：Phase 1 + Phase 2（手工内容生产）**

---

### 1.2 Phase 1：核心内容验证（10-15篇）

#### 目标

- **验证假设**：四维内容体系是否满足出海企业需求
- **时间**：3-5个工作日
- **产出**：10-15篇高质量文章（每篇800-1500字）
- **覆盖**：四维体系 + v2.0分类 + PESTEL

#### 内容规划

| 四维体系 | 数量 | PESTEL维度 | v2.0分类 | 典型主题示例 |
|---------|------|-----------|---------|-------------|
| **政策合规** | 3-4篇 | Political + Legal | policy_change | 欧盟AI法案解读、美国对华芯片管制、东南亚外资政策 |
| **行业情报** | 4-5篇 | Technological + Social | market_update, industry_insight | 东南亚电商Q3报告、新能源汽车出海趋势、TikTok Shop政策 |
| **地缘风险** | 2-3篇 | Political + Economic | industry_insight | 中美贸易关系、新兴市场汇率风险、地缘政治影响 |
| **运营落地** | 2-3篇 | Economic + Legal | market_update | 跨境支付合规、物流成本优化、本地化营销案例 |

#### 手工生产流程

```
Step 1: 选题策划（0.5天）
  ├─ 从content-sources-list-v3.md中选择10-15个优质来源
  ├─ 根据四维体系分配主题
  ├─ 确保覆盖出海热点（新能源、电商、SaaS、游戏等）
  └─ 输出：《选题清单表格》

Step 2: 内容研究与资料收集（1-2天）
  ├─ 手工阅读来源文章（每篇15-30分钟）
  ├─ 提取关键信息和数据
  ├─ 收集8-15个来源（对标Perplexity标准）
  └─ 输出：《资料汇总文档》（每个主题）

Step 3: AI辅助生成（1天）
  ├─ 使用prompt-templates-v3.md中的Prompt
  ├─ DeepSeek V3生成初稿
  ├─ 自动标注引用[1][2][3]
  └─ 输出：《初稿文章》（10-15篇）

Step 4: 人工审核与优化（1-2天）
  ├─ 验证引用准确性
  ├─ 优化语言和结构
  ├─ 补充专业洞察
  ├─ 配图优化（Unsplash）
  └─ 输出：《终稿文章》（10-15篇）

Step 5: 三重分类标注（0.5天）
  ├─ dimension（四维体系）
  ├─ contentTypes（v2.0分类）
  ├─ pestelCategories（PESTEL框架）
  └─ 输出：《分类元数据》

Step 6: 发布与数据清理（0.5天）
  ├─ 清理历史100+无效文章
  ├─ 保留30篇高质量文章（刷新）
  ├─ 发布10-15篇新文章
  └─ 验证Feed展示效果
```

#### 质量标准

| 维度 | 标准 | 验证方式 |
|------|------|---------|
| **引用数量** | 8-15个来源/篇 | 自动统计 |
| **引用准确性** | 100%可追溯 | 人工逐条验证 |
| **字数** | 800-1500字 | 自动统计 |
| **可读性** | 无机器翻译腔 | 人工审核 |
| **出海相关性** | 直接决策价值 | 专家评审 |
| **数据支撑** | 至少3个数据点 | 人工检查 |

#### 成功标准

- ✅ 10-15篇文章全部发布
- ✅ 四维体系全覆盖
- ✅ 用户反馈≥4分（5分制）
- ✅ 引用点击率≥10%
- ✅ 文章完成率≥50%

---

### 1.3 Phase 2：PESTEL全维度扩展（30篇）

#### 目标

- **验证假设**：PESTEL六维度是否提供系统化覆盖
- **时间**：5-7个工作日
- **产出**：30篇文章（总计40-45篇内容库）
- **覆盖**：PESTEL六维度 + 多个目标市场

#### 内容规划

| PESTEL维度 | 数量 | 典型主题 | 目标市场 |
|-----------|------|---------|---------|
| **Political（政治）** | 5篇 | 政府政策、对华立场、贸易协定、政治稳定性 | 美国、欧盟、东南亚 |
| **Economic（经济）** | 5篇 | 经济增长、汇率、市场规模、融资环境 | 东南亚、拉美、中东 |
| **Social（社会）** | 4篇 | 消费趋势、文化差异、人口结构、教育水平 | 东南亚、非洲、拉美 |
| **Technological（技术）** | 8篇 | 技术创新、数字化、行业标准、基础设施 | 全球 |
| **Environmental（环境）** | 3篇 | 环保法规、碳排放、ESG合规、绿色供应链 | 欧盟、美国 |
| **Legal（法律）** | 5篇 | 知识产权、劳工法、数据隐私、合规要求 | 欧盟、美国、东南亚 |

#### 手工生产流程（优化版）

```
Step 1: 批量选题（0.5天）
  ├─ 基于Phase 1反馈调整方向
  ├─ 确保PESTEL六维度平衡
  └─ 输出：《30篇选题清单》

Step 2: 分批资料收集（2-3天）
  ├─ 每批10篇
  ├─ 提高收集效率（模板化）
  └─ 输出：《资料汇总》（3批）

Step 3: 批量AI生成（1-2天）
  ├─ 使用优化后的Prompt
  ├─ DeepSeek V3批量生成
  └─ 输出：《30篇初稿》

Step 4: 快速审核（1-2天）
  ├─ 5分钟/篇快速审核
  ├─ 重点检查引用和出海相关性
  └─ 输出：《30篇终稿》

Step 5: 批量发布（0.5天）
  ├─ 三重分类标注
  ├─ 分批发布（避免信息过载）
  └─ 验证效果
```

#### 成功标准

- ✅ 30篇文章全部发布（总计40-45篇）
- ✅ PESTEL六维度全覆盖
- ✅ 平均质量评分≥7分（10分制）
- ✅ 用户满意度≥4分（5分制）
- ✅ 多个目标市场覆盖（美国、欧盟、东南亚、拉美）

---

### 1.4 Phase 3：自动化规模化（生产环境）

**POC阶段暂不实施，仅列出规划：**

#### 目标

- 10-20篇/天自动生产
- 月均350-400篇
- 76个全球内容源全接入

#### 技术架构

- 自动RSS抓取（每小时）
- AI自动筛选与改写
- 人工审核（10%深度审核）
- 自动发布与分发

**详细实施方案见：** content-strategy-v3.0.md

---

## 二、RAG基础架构实施

### 2.1 POC阶段RAG简化方案

#### 核心功能

```
POC阶段（手工内容）需要的RAG功能：

1. ✅ 引用标注
   - 手工文章中标注[1][2][3]
   - 关联到sources数组

2. ✅ 引用展示
   - 前端Popover组件
   - 点击[1]显示来源卡片
   - 包含：来源名、标题、摘要、链接

3. ⏸️ 向量化与检索
   - POC阶段暂不实施
   - 留到生产环境

4. ⏸️ 自动引用映射
   - POC阶段手工标注
   - 留到生产环境自动化
```

#### 数据结构（Article JSON）

```json
{
  "id": "article_001",
  "title": "欧盟AI法案生效，中国AI企业三大合规要点",
  "summary": "欧盟《人工智能法案》于2025年10月1日正式生效[1][2]...",
  "content": [
    {
      "sectionTitle": "核心要点",
      "paragraphs": [
        {
          "text": "根据欧盟委员会10月1日公告[1]，《AI法案》正式生效...",
          "citations": [1]
        }
      ]
    }
  ],

  // v3.0三重分类
  "dimension": "政策合规",
  "contentTypes": ["policy_change", "industry_insight"],
  "pestelCategories": ["Legal", "Technological"],

  // 来源列表（RAG核心）
  "sources": [
    {
      "id": 1,
      "name": "European Commission",
      "title": "AI Act enters into force",
      "url": "https://ec.europa.eu/...",
      "publishedAt": "2025-10-01",
      "excerpt": "引用的具体片段（100字以内）",
      "quality": "S"
    }
  ],

  // 元数据
  "targetRegions": ["欧盟"],
  "targetIndustries": ["人工智能应用"],
  "keywords": ["AI法案", "欧盟", "合规"],
  "wordCount": 1250,
  "readingTime": 5,
  "qualityScore": 8.5,
  "publishedAt": "2025-10-07",
  "author": "Discovery AI + 人工审核"
}
```

### 2.2 前端引用组件实现

```tsx
// components/article-with-citations.tsx
export function ArticleWithCitations({ article }: { article: Article }) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* 来源标注栏 */}
      <div className="sources-bar mb-6 p-4 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">
          基于 {article.sources.length} 个来源
        </span>
        <div className="flex gap-2 mt-2">
          {article.sources.slice(0, 5).map(s => (
            <Badge key={s.id} variant="secondary">{s.name}</Badge>
          ))}
          {article.sources.length > 5 && (
            <Badge variant="outline">+{article.sources.length - 5}</Badge>
          )}
        </div>
      </div>

      {/* 正文内容 */}
      {article.content.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.sectionTitle}</h2>
          {section.paragraphs.map((para, j) => (
            <p key={j} className="mb-4 leading-relaxed">
              {parseCitationsToComponents(para.text, article.sources)}
            </p>
          ))}
        </section>
      ))}

      {/* 完整来源列表 */}
      <section className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          参考来源 ({article.sources.length})
        </h3>
        <div className="space-y-3">
          {article.sources.map(source => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </article>
  );
}

// 将 [1][2] 转为可点击的引用标记
function parseCitationsToComponents(text: string, sources: Source[]) {
  const parts = [];
  let lastIndex = 0;

  // 正则匹配 [数字]
  const regex = /\[(\d+)\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加前面的文本
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // 添加引用组件
    const sourceId = parseInt(match[1]);
    const source = sources.find(s => s.id === sourceId);

    if (source) {
      parts.push(
        <CitationPopover key={`cite-${match.index}`} source={source}>
          <sup className="citation text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            [{sourceId}]
          </sup>
        </CitationPopover>
      );
    } else {
      parts.push(`[${sourceId}]`); // 如果找不到来源，保持原样
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// 引用弹出卡片
function CitationPopover({ source, children }: { source: Source, children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={source.quality === 'S' ? 'default' : 'secondary'}>
              {source.quality}级
            </Badge>
            <span className="text-sm font-semibold text-gray-900">
              {source.name}
            </span>
          </div>

          <div className="text-sm font-medium text-gray-700">
            {source.title}
          </div>

          <div className="text-xs text-gray-600 line-clamp-3">
            {source.excerpt}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-gray-500">{source.publishedAt}</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              查看原文 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 三、三重分类体系实现

### 3.1 数据结构

每篇文章包含三套标签：

```typescript
interface Article {
  // v3.0四维体系（主分类，单选）
  dimension: '政策合规' | '行业情报' | '地缘风险' | '运营落地';

  // v2.0分类（内容类型，可多选）
  contentTypes: Array<'market_update' | 'policy_change' | 'industry_insight' | 'data_report'>;

  // PESTEL框架（分析维度，可多选）
  pestelCategories: Array<'Political' | 'Economic' | 'Social' | 'Technological' | 'Environmental' | 'Legal'>;

  // 目标市场和行业
  targetRegions: string[];      // ["美国", "欧盟"]
  targetIndustries: string[];   // ["人工智能应用", "企业SaaS"]
}
```

### 3.2 前端筛选逻辑

```tsx
// app/feed/feed-client.tsx
const categoryLabels: Record<string, string> = {
  // v3.0四维体系（主筛选）
  all: "全部",
  policy: "政策合规",
  industry: "行业情报",
  geopolitical: "地缘风险",
  operation: "运营落地",
};

// v2.0分类（辅助筛选）
const contentTypeLabels: Record<string, string> = {
  market_update: "市场动态",
  policy_change: "政策法规",
  industry_insight: "行业洞察",
  data_report: "数据报告",
};

export function FeedClient({ initialArticles }: FeedClientProps) {
  const [selectedDimension, setSelectedDimension] = useState<string>("all");
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  // 筛选逻辑
  const filteredArticles = useMemo(() => {
    let filtered = initialArticles;

    // 按四维体系筛选
    if (selectedDimension !== "all") {
      const dimensionMap: Record<string, string> = {
        policy: "政策合规",
        industry: "行业情报",
        geopolitical: "地缘风险",
        operation: "运营落地",
      };
      filtered = filtered.filter(a => a.dimension === dimensionMap[selectedDimension]);
    }

    // 按v2.0分类辅助筛选
    if (selectedContentTypes.length > 0) {
      filtered = filtered.filter(a =>
        a.contentTypes.some(ct => selectedContentTypes.includes(ct))
      );
    }

    return filtered;
  }, [initialArticles, selectedDimension, selectedContentTypes]);

  return (
    <div>
      {/* 主筛选：四维体系 */}
      <div className="flex gap-2 mb-4">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Badge
            key={key}
            variant={selectedDimension === key ? "default" : "outline"}
            onClick={() => setSelectedDimension(key)}
            className="cursor-pointer"
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* 辅助筛选：v2.0分类（可选） */}
      {selectedDimension !== "all" && (
        <div className="flex gap-2 mb-4">
          {Object.entries(contentTypeLabels).map(([key, label]) => (
            <Checkbox
              key={key}
              checked={selectedContentTypes.includes(key)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedContentTypes([...selectedContentTypes, key]);
                } else {
                  setSelectedContentTypes(selectedContentTypes.filter(ct => ct !== key));
                }
              }}
            >
              {label}
            </Checkbox>
          ))}
        </div>
      )}

      {/* 文章列表 */}
      <div className="space-y-6">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
```

---

## 四、数据清理与迁移

### 4.1 清理策略

```
当前数据状态：
├─ 100+篇历史无效文章（需删除）
├─ 30篇高质量文章（需刷新）
└─ 0篇v3.0文章（待创建）

目标状态（Phase 1后）：
├─ 0篇无效文章
├─ 30篇刷新后文章（更新三重分类）
└─ 10-15篇v3.0新文章
合计：40-45篇
```

### 4.2 刷新30篇高质量文章

**需要补充的字段：**

```typescript
// 原有文章（v2.0）
{
  id: "old_article_001",
  title: "...",
  content: "...",
  category: "market" // v2.0单一分类
}

// 刷新后文章（v3.0兼容）
{
  id: "old_article_001",
  title: "...",
  content: "...",

  // 新增三重分类
  dimension: "行业情报",               // 根据内容判断
  contentTypes: ["market_update"],      // 从category映射
  pestelCategories: ["Technological"],  // 根据内容判断

  // 新增目标市场和行业（可选）
  targetRegions: ["东南亚"],
  targetIndustries: ["跨境电商"],

  // 新增来源（如果原文有引用）
  sources: [
    {
      id: 1,
      name: "TechCrunch",
      title: "...",
      url: "...",
      publishedAt: "2025-10-01",
      excerpt: "...",
      quality: "B"
    }
  ],

  // 标记为刷新
  refreshedAt: "2025-10-07",
  version: "v3.0"
}
```

**刷新工作流：**

1. 导出30篇高质量文章（JSON）
2. 使用AI辅助分类（DeepSeek V3）
3. 人工审核分类准确性
4. 补充sources（如果原文有明确来源）
5. 重新导入Appwrite

---

## 五、开发迭代计划调整

### 5.1 新增迭代：Sprint 3.5（内容策略v3.0 POC）

**插入位置：** Sprint 3和Sprint 4之间

**时长：** 5个工作日

**目标：** 验证内容价值主张

#### 迭代3.5.1：数据清理与刷新（1天）

**任务清单：**
- [ ] 清理100+无效历史文章
- [ ] 导出30篇高质量文章
- [ ] AI辅助三重分类标注
- [ ] 人工审核分类准确性
- [ ] 重新导入Appwrite

**验收标准：**
- [ ] 无效文章全部删除
- [ ] 30篇文章完成三重分类
- [ ] 数据库清理完成

#### 迭代3.5.2：Phase 1手工内容生产（2天）

**任务清单：**
- [ ] 选题策划（10-15个主题）
- [ ] 资料收集（8-15个来源/篇）
- [ ] AI生成初稿（DeepSeek V3）
- [ ] 人工审核与优化
- [ ] 三重分类标注
- [ ] 发布10-15篇新文章

**验收标准：**
- [ ] 10-15篇文章发布
- [ ] 四维体系全覆盖
- [ ] 平均质量评分≥8分
- [ ] 引用标注准确率100%

#### 迭代3.5.3：RAG基础架构实现（1天）

**任务清单：**
- [ ] 文章数据结构适配（sources字段）
- [ ] 前端引用Popover组件
- [ ] 引用解析逻辑（[1][2]→可点击）
- [ ] 完整来源列表展示
- [ ] 来源标注栏（顶部Badge）

**验收标准：**
- [ ] 引用[1][2]可点击
- [ ] Popover正确显示来源卡片
- [ ] 底部来源列表完整

#### 迭代3.5.4：三重分类筛选实现（1天）

**任务清单：**
- [ ] 四维体系主筛选（Badge）
- [ ] v2.0分类辅助筛选（Checkbox）
- [ ] PESTEL标签展示（可选）
- [ ] 筛选逻辑实现
- [ ] URL参数同步

**验收标准：**
- [ ] 四维体系筛选正常
- [ ] v2.0分类筛选正常
- [ ] 筛选结果准确

---

### 5.2 原有Sprint调整

#### Sprint 1-3：保持不变
- Sprint 1: 基础设施 + 设计系统
- Sprint 2: Feed展示 + 详情页
- Sprint 3: 晨报体验 + 内容自动化（本地脚本）

#### Sprint 3.5：新增（内容策略v3.0 POC）⭐
- 如上所述

#### Sprint 4 → Sprint 5：AI问答 + MCDA工具
- 时间：5个工作日
- 任务：保持不变

#### Sprint 5 → Sprint 6：Appwrite集成 + 性能优化
- 时间：4.5个工作日
- 任务：保持不变
- **新增**：v3.0内容数据迁移到Appwrite

#### Sprint 6 → Sprint 7：完善与部署
- 时间：3.5个工作日
- 任务：保持不变

**总时长：** 25天 → 30天（+5天）

---

## 六、成本估算

### 6.1 POC阶段成本（Phase 1 + Phase 2）

#### AI服务成本

| 任务 | 数量 | 单价（DeepSeek V3） | 小计 |
|------|------|-------------------|------|
| Phase 1生成（10-15篇） | 15篇 | ¥0.004/篇 | ¥0.06 |
| Phase 2生成（30篇） | 30篇 | ¥0.004/篇 | ¥0.12 |
| 三重分类标注（45篇） | 45篇 | ¥0.001/篇 | ¥0.045 |
| 质量评分（45篇） | 45篇 | ¥0.002/篇 | ¥0.09 |
| **合计** | - | - | **¥0.315** |

#### 人力成本（估算）

| 任务 | 时间 | 说明 |
|------|------|------|
| 选题策划 | 1天 | 研究市场需求 |
| 资料收集 | 3-4天 | 手工阅读和整理 |
| 人工审核 | 3-4天 | 逐篇审核优化 |
| 数据清理 | 1天 | 删除无效数据 |
| **合计** | **8-10天** | **约1-1.5人周** |

**总成本：** AI成本可忽略不计（<¥1），主要是人力成本（8-10天）

---

## 七、成功标准

### 7.1 Phase 1验收标准（必须全部通过）

| 维度 | 标准 | 验证方式 |
|------|------|---------|
| **内容数量** | 10-15篇发布 | 系统统计 |
| **内容质量** | 平均质量评分≥8分 | AI+人工评分 |
| **四维覆盖** | 四维体系全覆盖 | 人工验收 |
| **引用准确性** | 100%可追溯 | 逐条验证 |
| **用户反馈** | ≥4分（5分制） | 用户调研 |
| **技术实现** | RAG引用正常展示 | 功能测试 |
| **三重分类** | 标注完整准确 | 数据验证 |

### 7.2 Phase 2验收标准

| 维度 | 标准 | 验证方式 |
|------|------|---------|
| **内容数量** | 30篇发布（总计40-45篇） | 系统统计 |
| **PESTEL覆盖** | 六维度全覆盖 | 人工验收 |
| **内容质量** | 平均质量评分≥7分 | AI+人工评分 |
| **市场覆盖** | 至少3个目标市场 | 数据统计 |
| **用户满意度** | ≥4分（5分制） | 用户调研 |

### 7.3 整体POC验收标准

**核心验证点：**

- ✅ **内容价值主张验证**：出海企业决策者认可内容有价值
- ✅ **四维体系验证**：四维分类满足用户筛选需求
- ✅ **PESTEL框架验证**：六维度提供系统化覆盖
- ✅ **RAG可信验证**：引用映射提升用户信任度
- ✅ **三重分类验证**：用户筛选更精准

**数据指标：**

| 指标 | 目标值 | 实际值 | 是否通过 |
|------|--------|--------|---------|
| 内容库规模 | 40-45篇 | - | [ ] |
| 平均质量评分 | ≥7.5分 | - | [ ] |
| 用户满意度 | ≥4分 | - | [ ] |
| 引用点击率 | ≥10% | - | [ ] |
| 文章完成率 | ≥50% | - | [ ] |
| 四维覆盖率 | 100% | - | [ ] |
| PESTEL覆盖率 | 100% | - | [ ] |

---

## 八、风险与应对

### 8.1 主要风险

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| **内容质量不达标** | 中 | 高 | 严格人工审核，必要时重写 |
| **引用收集困难** | 中 | 中 | 降低来源数量要求（6-8个） |
| **三重分类标注成本高** | 低 | 中 | AI辅助标注，减少人工工作量 |
| **用户不认可价值** | 低 | 高 | 及时调整选题方向和内容风格 |
| **时间延期** | 中 | 中 | 预留2-3天buffer |

### 8.2 质量保证措施

1. **多轮审核**：
   - AI生成 → 人工初审 → 专家复审 → 最终发布

2. **用户反馈闭环**：
   - 每篇文章底部"内容反馈"按钮
   - 收集具体改进建议
   - 快速迭代优化

3. **同行评审**：
   - 邀请3-5个出海企业决策者
   - 提前试读并提供反馈
   - 调整内容方向

---

## 九、Phase 3规划（生产环境）

**POC验证通过后，进入Phase 3：**

### 9.1 自动化RSS抓取

- 76个全球内容源全接入
- 每小时自动抓取（100-150篇原始）
- AI自动筛选（PESTEL评分≥6）

### 9.2 AI自动生成

- 每日生成20-30篇
- 人工审核10%（深度审核）
- 最终发布10-20篇/天

### 9.3 RAG完整架构

- 向量数据库（Pinecone）
- 自动引用映射
- 语义检索与召回

**详细方案见：** content-strategy-v3.0.md

---

## 十、文档关联

### 10.1 核心文档

| 文档 | 关系 | 用途 |
|------|------|------|
| **content-strategy-v3.0.md** | 战略文档 | 完整内容策略 |
| **content-sources-list-v3.md** | 附录A | 76个内容源清单 |
| **prompt-templates-v3.md** | 附录B | RAG Prompt模板库 |
| **05-poc-plan.md** | v2.0基础版 | 本地优先策略 |
| **06-iteration-plan.md** | 详细计划 | 18个迭代（待更新） |
| **本文档（07-poc-plan-v3.md）** | v3.0升级版 | 内容价值验证 |

### 10.2 使用建议

**如果你想...**

- 📖 **理解v3.0战略** → 阅读 content-strategy-v3.0.md
- 📋 **查找内容源** → 查看 content-sources-list-v3.md
- 🤖 **使用Prompt** → 参考 prompt-templates-v3.md
- 🏗️ **实施POC v3.0** → 阅读本文档
- ⚡ **执行具体迭代** → 查看06-iteration-plan.md（待更新）

---

## 附录

### A. Phase 1选题示例

| 序号 | 四维体系 | 主题 | PESTEL | v2.0分类 | 目标市场 | 行业 |
|------|---------|------|--------|---------|---------|------|
| 1 | 政策合规 | 欧盟AI法案解读 | Legal+Tech | policy_change | 欧盟 | AI应用 |
| 2 | 政策合规 | 美国对华芯片管制升级 | Political+Legal | policy_change | 美国 | 半导体 |
| 3 | 政策合规 | 东南亚外资准入新政 | Political+Economic | policy_change | 东南亚 | 全行业 |
| 4 | 行业情报 | 东南亚电商Q3报告 | Economic+Social | data_report | 东南亚 | 电商 |
| 5 | 行业情报 | 新能源汽车出海趋势 | Tech+Environmental | industry_insight | 全球 | 新能源 |
| 6 | 行业情报 | TikTok Shop全球扩张 | Social+Tech | market_update | 全球 | 社交电商 |
| 7 | 行业情报 | 企业SaaS出海策略 | Tech | industry_insight | 美国+欧洲 | SaaS |
| 8 | 地缘风险 | 中美贸易关系新动向 | Political+Economic | industry_insight | 中美 | 全行业 |
| 9 | 地缘风险 | 新兴市场汇率波动 | Economic | market_update | 拉美+东南亚 | 全行业 |
| 10 | 运营落地 | 跨境支付合规指南 | Legal+Economic | policy_change | 全球 | 支付 |
| 11 | 运营落地 | 东南亚物流成本优化 | Economic | market_update | 东南亚 | 物流 |
| 12 | 运营落地 | 本地化营销案例 | Social | industry_insight | 东南亚 | 营销 |

---

**文档维护**

- **创建日期：** 2025-10-07
- **负责人：** Discovery 产品团队
- **审核周期：** 每周一次（POC阶段）
- **版本：** v3.0

---

*📄 文档结束。POC v3.0的核心是验证内容价值主张，技术自动化留到生产环境。*
