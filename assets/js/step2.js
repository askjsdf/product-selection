/**
 * Step 2 品类洞察 - 五看洞察仪表板
 * 项目：AI选品助手
 * 更新时间：2025-11-19
 */

// ========== 细分品类树数据 ==========
const CATEGORY_TREE_DATA = {
  '宠物用品': {
    name: '宠物用品',
    children: [
      {
        name: '宠物食品',
        code: 'pet-food',
        children: [
          { name: '狗粮', code: 'dog-food' },
          { name: '猫粮', code: 'cat-food' },
          { name: '宠物零食', code: 'pet-snacks' },
          { name: '营养保健品', code: 'pet-supplements' }
        ]
      },
      {
        name: '宠物玩具',
        code: 'pet-toys',
        recommended: true, // 标记为推荐品类
        children: [
          { name: '嗅闻玩具', code: 'sniff-toys', recommended: true },
          { name: '智能玩具', code: 'smart-toys', recommended: true },
          { name: '咀嚼玩具', code: 'chew-toys' },
          { name: '互动玩具', code: 'interactive-toys' },
          { name: '训练玩具', code: 'training-toys' }
        ]
      },
      {
        name: '宠物服饰',
        code: 'pet-clothing',
        children: [
          { name: '宠物衣服', code: 'pet-clothes' },
          { name: '宠物鞋袜', code: 'pet-shoes' },
          { name: '宠物配饰', code: 'pet-accessories' }
        ]
      },
      {
        name: '宠物日用品',
        code: 'pet-daily',
        children: [
          { name: '猫砂盆', code: 'litter-box' },
          { name: '宠物床垫', code: 'pet-beds' },
          { name: '喂食用具', code: 'feeding-supplies' },
          { name: '清洁用品', code: 'cleaning-supplies' }
        ]
      },
      {
        name: '宠物医疗保健',
        code: 'pet-health',
        children: [
          { name: '驱虫用品', code: 'deworming' },
          { name: '护理用品', code: 'grooming' },
          { name: '医疗器械', code: 'medical-devices' }
        ]
      },
      {
        name: '宠物出行',
        code: 'pet-travel',
        children: [
          { name: '宠物背包', code: 'pet-carriers' },
          { name: '牵引绳', code: 'leashes' },
          { name: '宠物推车', code: 'pet-strollers' }
        ]
      }
    ]
  }
};

window.Step2 = {

  // ========== 状态管理 ==========
  state: {
    currentCategory: null,
    currentPlatform: null,
    currentCountry: null,
    currentWukanTab: 'industry',
    wukanData: null,
    charts: {}, // 存储图表实例
    selectedSubCategory: null, // 选中的细分品类
    // 阶段管理状态
    currentStage: 1, // 当前阶段 (1: SPAN / 2: AI决策 / 3: $APPEALS)
    selectedSegment: null, // 选中的SPAN细分市场
    selectedCompetitors: ['kong-classic', 'outward-hound', 'chuckit-ultra'] // 选中的竞品
  },

  // ========== 初始化 ==========
  init() {
    console.log('Step 2 - 五看洞察模块初始化');

    // 1. 加载品类选择器
    this.loadCategorySelector();

    // 2. 加载默认品类数据
    const defaultCategory = this.getDefaultCategory();
    if (defaultCategory) {
      this.loadCategoryData(defaultCategory);
    } else {
      // 没有候选池数据，显示提示
      this.showEmptyPoolHint();
    }

    // 3. 绑定事件
    this.bindEvents();

    // 4. 绑定阶段切换事件
    this.bindStageEvents();
  },

  // ========== 品类选择器 ==========
  loadCategorySelector() {
    const pool = AppStorage.getOpportunityPool();
    const select = document.getElementById('category-combo-select');

    if (!select) {
      console.error('Category select element not found');
      return;
    }

    if (pool.length === 0) {
      select.innerHTML = '<option value="">请先在 Step 1 添加组合到候选池</option>';
      select.disabled = true;
      return;
    }

    select.disabled = false;
    select.innerHTML = pool.map((item, index) => {
      const value = `${item.category}|${item.country}|${item.platform}`;
      const label = `${item.category} × ${item.country} × ${item.platform}`;
      return `<option value="${value}" ${index === 0 ? 'selected' : ''}>${label}</option>`;
    }).join('');
  },

  getDefaultCategory() {
    const pool = AppStorage.getOpportunityPool();
    if (pool.length === 0) return null;

    return {
      category: pool[0].category,
      country: pool[0].country,
      platform: pool[0].platform
    };
  },

  showEmptyPoolHint() {
    const container = document.getElementById('wukan-module');
    if (container) {
      container.innerHTML = `
        <div class="empty-pool-hint">
          <div class="hint-icon"></div>
          <h3>候选池为空</h3>
          <p>请先在 Step 1 的机会发现阶段，将感兴趣的品类组合添加到候选池</p>
          <button class="btn btn-primary" onclick="loadStepModule(1)">
            返回 Step 1
          </button>
        </div>
      `;
    }
  },

  // ========== 加载品类数据 ==========
  loadCategoryData({ category, country, platform }) {
    console.log(`加载品类数据: ${category} × ${country} × ${platform}`);

    // 更新状态
    this.state.currentCategory = category;
    this.state.currentCountry = country;
    this.state.currentPlatform = platform;

    // 从Mock数据获取
    this.state.wukanData = Step2Data.getWuKanData(category);

    // 渲染当前Tab
    this.renderCurrentWukanTab();
  },

  // ========== 渲染五看Tab ==========
  renderCurrentWukanTab() {
    const tab = this.state.currentWukanTab;

    // 隐藏所有面板
    document.querySelectorAll('.wukan-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // 显示当前面板
    const currentPanel = document.getElementById(`${tab}-panel`);
    if (currentPanel) {
      currentPanel.classList.add('active');
    }

    // 渲染对应内容
    switch(tab) {
      case 'industry':
        this.renderIndustryView();
        break;
      case 'market':
        this.renderMarketView();
        break;
      case 'customer':
        this.renderCustomerView();
        break;
      case 'competition':
        this.renderCompetitionView();
        break;
      case 'resource':
        this.renderResourceView();
        break;
    }
  },

  // ========== 1. 看行业 ==========
  renderIndustryView() {
    if (!this.state.wukanData) return;

    const data = this.state.wukanData.industry;

    // 更新指标
    document.getElementById('industry-gmv').textContent = data.gmv;
    document.getElementById('industry-cagr').textContent = data.cagr;
    document.getElementById('industry-cagr-trend').textContent = `+${data.cagr} YoY`;
    document.getElementById('industry-maturity').textContent = data.maturity;
    document.getElementById('industry-maturity-desc').textContent = data.maturityDesc;

    // 销毁旧图表
    if (this.state.charts.industryStructure) {
      this.state.charts.industryStructure.dispose();
    }
    if (this.state.charts.industryGrowth) {
      this.state.charts.industryGrowth.dispose();
    }

    // 饼图: 品类结构
    const structureChartDom = document.getElementById('industry-structure-chart');
    if (structureChartDom) {
      this.state.charts.industryStructure = echarts.init(structureChartDom);
      this.state.charts.industryStructure.setOption(Step2Charts.getPieChartOption({
        title: '',
        data: data.subcategories.map(sub => ({
          name: sub.name,
          value: sub.share
        }))
      }));
    }

    // 折线图: 增长趋势
    const growthChartDom = document.getElementById('industry-growth-chart');
    if (growthChartDom) {
      this.state.charts.industryGrowth = echarts.init(growthChartDom);
      this.state.charts.industryGrowth.setOption(Step2Charts.getLineChartOption({
        title: '',
        xData: data.growthTrend.years,
        yData: data.growthTrend.gmv,
        yAxisName: 'GMV (Billion $)',
        showArea: true
      }));
    }
  },

  // ========== 2. 看市场 ==========
  renderMarketView() {
    if (!this.state.wukanData) return;

    const data = this.state.wukanData.market;

    // 渲染子品类卡片
    const grid = document.getElementById('subcategory-grid');
    if (grid) {
      grid.innerHTML = data.subcategories.map(sub => `
        <div class="subcategory-card ${sub.isHighGrowth ? 'highlight' : ''}">
          <div class="subcategory-header">
            <h4>${sub.name}</h4>
            ${sub.isHighGrowth ? '<span class="badge-high-growth">高增长</span>' : ''}
          </div>
          <div class="subcategory-metrics">
            <div class="metric">
              <span class="metric-label">GMV</span>
              <span class="metric-value">${sub.gmv}</span>
            </div>
            <div class="metric">
              <span class="metric-label">增长率</span>
              <span class="metric-value ${sub.growth > 30 ? 'positive' : ''}">${sub.growth}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">市场份额</span>
              <span class="metric-value">${sub.share}</span>
            </div>
          </div>
          <div class="subcategory-highlights">
            ${sub.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // 销毁旧图表
    if (this.state.charts.marketRadar) {
      this.state.charts.marketRadar.dispose();
    }

    // 雷达图: 子品类对比
    const radarChartDom = document.getElementById('market-radar-chart');
    if (radarChartDom) {
      this.state.charts.marketRadar = echarts.init(radarChartDom);
      this.state.charts.marketRadar.setOption(Step2Charts.getRadarChartOption({
        title: '',
        indicator: [
          { name: '市场规模', max: 100 },
          { name: '增长潜力', max: 100 },
          { name: '利润空间', max: 100 },
          { name: '竞争强度', max: 100 },
          { name: '进入难度', max: 100 }
        ],
        series: data.subcategories.map(sub => ({
          name: sub.name,
          value: sub.radarScores
        }))
      }));
    }
  },

  // ========== 3. 看客户 ==========
  renderCustomerView() {
    if (!this.state.wukanData) return;

    const data = this.state.wukanData.customer;

    // 渲染客户画像
    const personaGrid = document.getElementById('persona-grid');
    if (personaGrid) {
      personaGrid.innerHTML = data.personas.map(persona => `
        <div class="persona-card">
          <div class="persona-avatar">${persona.avatar}</div>
          <h4>${persona.name}</h4>
          <div class="persona-tags">
            ${persona.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="persona-metrics">
            <div class="persona-metric">
              <span class="label">占比</span>
              <span class="value">${persona.share}</span>
            </div>
            <div class="persona-metric">
              <span class="label">ARPU</span>
              <span class="value">${persona.arpu}</span>
            </div>
            <div class="persona-metric">
              <span class="label">复购率</span>
              <span class="value">${persona.retention}</span>
            </div>
          </div>
          <div class="persona-desc">${persona.description}</div>
          <div class="persona-channels">
            <strong>渠道偏好:</strong> ${persona.channels.join(', ')}
          </div>
        </div>
      `).join('');
    }

    // 渲染痛点列表
    const painPointList = document.getElementById('pain-point-list');
    if (painPointList) {
      painPointList.innerHTML = data.painPoints.map((point, index) => `
        <div class="pain-point-item">
          <div class="rank">${point.rank}</div>
          <div class="content">
            <div class="pain-title-row">
              <div class="title">${point.title}</div>
              <span class="impact-badge impact-${point.impact.toLowerCase()}">${point.impact}影响</span>
            </div>
            <div class="stats">
              <span>提及率: ${point.mentionRate}</span>
              <span>平均评分: ${point.avgRating}</span>
            </div>
            <div class="quote">"${point.quote}"</div>
            <div class="opportunity">
              <strong>机会:</strong> ${point.opportunity}
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  // ========== 4. 看竞争 ==========
  renderCompetitionView() {
    if (!this.state.wukanData) return;

    const data = this.state.wukanData.competition;

    // 更新竞争指标
    document.getElementById('competition-cr5').textContent = data.cr5;
    document.getElementById('competition-level').textContent = data.competitiveLevel;
    document.getElementById('competition-top-brand').textContent = data.topBrand;
    document.getElementById('competition-top-share').textContent = `${data.topBrandShare}市场份额`;
    document.getElementById('competition-survival').textContent = data.newBrandSurvivalRate;

    // 销毁旧图表
    if (this.state.charts.competitionRadar) {
      this.state.charts.competitionRadar.dispose();
    }

    // 竞争雷达图
    const radarChartDom = document.getElementById('competition-radar-chart');
    if (radarChartDom) {
      this.state.charts.competitionRadar = echarts.init(radarChartDom);
      this.state.charts.competitionRadar.setOption(Step2Charts.getRadarChartOption({
        title: '',
        indicator: [
          { name: '品牌知名度', max: 100 },
          { name: '产品质量', max: 100 },
          { name: '价格竞争力', max: 100 },
          { name: '客户满意度', max: 100 },
          { name: 'SKU丰富度', max: 100 }
        ],
        series: data.topCompetitors.slice(0, 3).map(comp => ({
          name: comp.brand,
          value: comp.radarScores
        }))
      }));
    }

    // 竞争对手表格
    const tbody = document.getElementById('competitor-table-body');
    if (tbody) {
      tbody.innerHTML = data.topCompetitors.map(comp => `
        <tr>
          <td><strong>${comp.rank}</strong></td>
          <td>
            <div class="brand-cell">
              <strong>${comp.brand}</strong>
              <small class="text-muted">${comp.asin}</small>
            </div>
          </td>
          <td><span class="badge badge-primary">${comp.marketShare}</span></td>
          <td>${comp.avgPrice}</td>
          <td>
            <span class="rating">${comp.rating}</span>
            <small class="text-muted">(${comp.reviewCount})</small>
          </td>
          <td>${comp.skuCount}</td>
        </tr>
      `).join('');
    }

    // 威胁分析
    document.getElementById('white-label-risk').textContent = data.threats.whiteLabelRisk;
    document.getElementById('white-label-risk').className = `threat-level ${data.threats.whiteLabelRisk === '高' ? 'high' : 'medium'}`;
    document.getElementById('white-label-desc').textContent = data.threats.whiteLabelDesc;
    document.getElementById('substitutes-list').innerHTML = data.threats.substitutes.map(s =>
      `<span class="substitute-tag">${s}</span>`
    ).join('');
  },

  // ========== 5. 看自己 ==========
  renderResourceView() {
    if (!this.state.wukanData) return;

    const data = this.state.wukanData.resource;

    // 综合得分
    document.getElementById('resource-overall-score').textContent = data.overallScore;
    document.getElementById('resource-verdict-icon').textContent = data.verdict.includes('') ? '' : '️';
    document.getElementById('resource-verdict').textContent = data.verdict;
    document.getElementById('resource-recommendation').textContent = data.recommendation;

    // 资源维度
    const dimensionsContainer = document.getElementById('resource-dimensions');
    if (dimensionsContainer) {
      dimensionsContainer.innerHTML = data.dimensions.map(dim => `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score ${dim.score >= 80 ? 'high' : dim.score >= 60 ? 'medium' : 'low'}">
              ${dim.score}/100
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${dim.score >= 80 ? 'high' : dim.score >= 60 ? 'medium' : 'low'}"
                 style="width: ${dim.score}%;"></div>
          </div>
          <div class="dimension-detail">${dim.detail}</div>
          ${dim.action ? `<div class="dimension-action">
            <span class="action-icon"></span> ${dim.action}
          </div>` : ''}
        </div>
      `).join('');
    }

    // 资源建议
    const suggestionsList = document.getElementById('suggestions-list');
    if (suggestionsList) {
      suggestionsList.innerHTML = data.suggestions.map(sug => `
        <div class="suggestion-item priority-${sug.priority.toLowerCase()}">
          <div class="suggestion-header">
            <span class="priority-badge">${sug.priority}优先级</span>
            <span class="timeline">${sug.timeline}</span>
          </div>
          <div class="suggestion-action">${sug.action}</div>
          <div class="suggestion-reason">${sug.reason}</div>
        </div>
      `).join('');
    }
  },

  // ========== 事件绑定 ==========
  bindEvents() {
    // 品类选择器变化
    const select = document.getElementById('category-combo-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const value = e.target.value;
        if (!value) return;

        const [category, country, platform] = value.split('|');
        this.loadCategoryData({ category, country, platform });
      });
    }

    // 五看Tab切换
    document.querySelectorAll('.wukan-tabs li').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.wukanTab;

        // 更新Tab状态
        document.querySelectorAll('.wukan-tabs li').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // 更新状态并渲染
        this.state.currentWukanTab = targetTab;
        this.renderCurrentWukanTab();
      });
    });

    // 刷新数据按钮
    const refreshBtn = document.getElementById('refresh-data-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (this.state.currentCategory) {
          this.loadCategoryData({
            category: this.state.currentCategory,
            country: this.state.currentCountry,
            platform: this.state.currentPlatform
          });
          Utils.showSuccessMessage('数据已刷新');
        }
      });
    }

    // 导出按钮
    const exportBtn = document.getElementById('export-wukan-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportWuKanAnalysis();
      });
    }

    // 子模块Tab切换（Phase 2-5 占位）
    document.querySelectorAll('.sub-module-tabs li').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const module = e.currentTarget.dataset.module;

        // 检查是否disabled
        if (e.currentTarget.hasAttribute('disabled')) {
          Utils.showInfoMessage('该模块开发中，敬请期待');
          return;
        }

        // 切换子模块（Phase 2-5实现）
        this.switchSubModule(module);
      });
    });
  },

  // ========== 子模块切换 ==========
  switchSubModule(module) {
    // 更新Tab状态
    document.querySelectorAll('.sub-module-tabs li').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`.sub-module-tabs li[data-module="${module}"]`)?.classList.add('active');

    // 隐藏所有子模块
    document.querySelectorAll('.sub-module-content').forEach(content => {
      content.style.display = 'none';
    });

    // 显示目标模块
    const targetModule = document.getElementById(`${module}-module`);
    if (targetModule) {
      targetModule.style.display = 'block';

      // 根据模块类型渲染内容
      if (module === 'market-stp') {
        this.renderMarketStpModule();
      } else if (module === 'span-appeals') {
        this.renderSpanAppealsModule();
      } else if (module === 'kano') {
        this.renderKanoModule();
      } else if (module === 'charter') {
        this.renderCharterModule();
      }
    }
  },

  // ========== 市场地图 & STP模块渲染 ==========
  renderMarketStpModule() {
    const marketMapData = Step2Data.getMarketMapData(this.state.currentCategory);
    const stpData = Step2Data.getSTPData(this.state.currentCategory);

    // 渲染细分品类树
    this.renderCategoryTree();

    // 渲染市场地图
    this.renderMarketMap(marketMapData);

    // 渲染STP
    this.renderSTP(stpData);
  },

  // ========== 细分品类树渲染 ==========
  renderCategoryTree() {
    const container = document.getElementById('category-tree-container');
    if (!container) return;

    // 获取当前品类（从候选池中获取，这里硬编码为"宠物用品"作为示例）
    const currentCategory = '宠物用品';
    const treeData = CATEGORY_TREE_DATA[currentCategory];

    if (!treeData) {
      container.innerHTML = '<p style="color: var(--text-tertiary); font-size: var(--font-size-xs);">暂无品类数据</p>';
      return;
    }

    // 渲染树形结构
    container.innerHTML = `
      <ul class="tree-list">
        <li class="tree-node-level-1">
          <div class="tree-node-content">
            <span class="node-icon">📦</span>
            <span class="node-label">${treeData.name}</span>
          </div>
          <ul class="tree-children-level-2">
            ${treeData.children.map(l2Node => this.renderLevel2Node(l2Node)).join('')}
          </ul>
        </li>
      </ul>
    `;

    // 绑定展开/收起事件
    container.querySelectorAll('.tree-node-level-2').forEach(node => {
      const content = node.querySelector('.tree-node-content');
      if (content) {
        const toggle = content.querySelector('.expand-toggle');
        if (toggle) {
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            node.classList.toggle('expanded');
          });
        }
      }
    });

    // 绑定二级品类选择事件
    container.querySelectorAll('.tree-node-level-2 > .tree-node-content').forEach((content, idx) => {
      const node = content.parentElement;
      content.addEventListener('click', (e) => {
        if (e.target.classList.contains('expand-toggle')) return;
        e.stopPropagation();
        // 移除其他二级品类的选中状态
        container.querySelectorAll('.tree-node-level-2').forEach(n => n.classList.remove('selected'));
        // 添加选中状态
        node.classList.add('selected');
        // 更新状态
        this.state.selectedSubCategory = node.dataset.code;
        console.log('选中二级品类:', node.dataset.name, node.dataset.code);
      });
    });

    // 绑定三级品类选择事件
    container.querySelectorAll('.tree-node-level-3 > .tree-node-content').forEach(content => {
      const node = content.parentElement;
      content.addEventListener('click', (e) => {
        e.stopPropagation();
        // 移除其他三级品类的选中状态
        container.querySelectorAll('.tree-node-level-3').forEach(n => n.classList.remove('selected'));
        // 添加选中状态
        node.classList.add('selected');
        // 同时选中父级二级品类
        const parentL2 = node.closest('.tree-node-level-2');
        if (parentL2) {
          container.querySelectorAll('.tree-node-level-2').forEach(n => n.classList.remove('selected'));
          parentL2.classList.add('selected');
        }
        // 更新状态
        this.state.selectedSubCategory = node.dataset.code;
        console.log('选中三级品类:', node.dataset.name, node.dataset.code);
      });
    });
  },

  renderLevel2Node(node) {
    const hasChildren = node.children && node.children.length > 0;
    const recommendedClass = node.recommended ? 'recommended' : '';

    return `
      <li class="tree-node-level-2 ${recommendedClass}" data-code="${node.code}" data-name="${node.name}">
        <div class="tree-node-content">
          ${hasChildren ? '<span class="expand-toggle">▸</span>' : '<span class="expand-toggle" style="visibility:hidden;">▸</span>'}
          <span class="node-icon">📁</span>
          <span class="node-label">${node.name}</span>
        </div>
        ${hasChildren ? `
          <ul class="tree-children-level-3">
            ${node.children.map(l3Node => this.renderLevel3Node(l3Node)).join('')}
          </ul>
        ` : ''}
      </li>
    `;
  },

  renderLevel3Node(node) {
    const recommendedClass = node.recommended ? 'recommended' : '';
    return `
      <li class="tree-node-level-3 ${recommendedClass}" data-code="${node.code}" data-name="${node.name}">
        <div class="tree-node-content">
          <span class="node-icon">📄</span>
          <span class="node-label">${node.name}</span>
        </div>
      </li>
    `;
  },

  renderMarketMap(data) {
    // 1. 渲染决策流
    const buyerNeedsList = document.getElementById('buyer-needs-list');
    if (buyerNeedsList) {
      buyerNeedsList.innerHTML = data.decisionFlow.buyerNeeds.map(need => `
        <div class="need-item">
          <span class="need-text">${need.trigger}</span>
          <span class="need-percentage">${need.percentage}</span>
        </div>
      `).join('');
    }

    const buyerCriteriaList = document.getElementById('buyer-criteria-list');
    if (buyerCriteriaList) {
      buyerCriteriaList.innerHTML = data.decisionFlow.buyerCriteria.map(c => `
        <div class="criteria-item">
          <span class="criteria-text">${c.name} ${c.desc}</span>
        </div>
      `).join('');
    }

    const petCriteriaList = document.getElementById('pet-criteria-list');
    if (petCriteriaList) {
      petCriteriaList.innerHTML = data.decisionFlow.petCriteria.map(c => `
        <div class="criteria-item">
          <span class="criteria-text">${c.name} ${c.desc}</span>
        </div>
      `).join('');
    }

    const decisionInsights = document.getElementById('decision-insights');
    if (decisionInsights) {
      decisionInsights.innerHTML = data.decisionFlow.insights.map(insight => `
        <div class="insight-item">${insight}</div>
      `).join('');
    }

    // 2. 渲染渠道对比
    const channelComparison = document.getElementById('channel-comparison');
    if (channelComparison) {
      channelComparison.innerHTML = data.channelInfluence.channels.map(ch => `
        <div class="channel-card">
          <div class="channel-header">
            <h5>${ch.name}</h5>
            <span class="channel-type">${ch.type}</span>
          </div>
          <div class="channel-metrics">
            <div class="channel-metric">
              <span class="metric-label">ROI</span>
              <span class="metric-value highlight">${ch.roi}</span>
            </div>
            <div class="channel-metric">
              <span class="metric-label">转化周期</span>
              <span class="metric-value">${ch.conversionCycle}</span>
            </div>
          </div>
          <div class="channel-pros-cons">
            <div class="pros">
              <strong>优势:</strong>
              ${ch.pros.map(p => `<span class="pro-tag">${p}</span>`).join('')}
            </div>
            <div class="cons">
              <strong>劣势:</strong>
              ${ch.cons.map(c => `<span class="con-tag">${c}</span>`).join('')}
            </div>
          </div>
          <div class="channel-strategy">
            <strong>策略:</strong> ${ch.strategy}
          </div>
        </div>
      `).join('');
    }

    const channelLifecycle = document.getElementById('channel-lifecycle');
    if (channelLifecycle) {
      channelLifecycle.innerHTML = data.channelInfluence.lifecycle.map((phase, index) => `
        <div class="lifecycle-phase phase-${index + 1}">
          <div class="phase-header">
            <span class="phase-number">${index + 1}</span>
            <span class="phase-period">${phase.period}</span>
          </div>
          <div class="phase-primary">主战场: <strong>${phase.primary}</strong></div>
          <div class="phase-strategy">${phase.strategy}</div>
          <div class="phase-target">目标: ${phase.target}</div>
        </div>
      `).join('');
    }

    // 3. 渲染竞争生态
    const competitiveEcosystem = document.getElementById('competitive-ecosystem');
    if (competitiveEcosystem) {
      competitiveEcosystem.innerHTML = data.competitiveEcosystem.layers.map(layer => `
        <div class="ecosystem-layer threat-${layer.threat.toLowerCase()}">
          <div class="layer-header">
            <span class="layer-level">${layer.level}</span>
            <span class="threat-badge">${layer.threat}威胁</span>
          </div>
          <div class="layer-desc">${layer.desc}</div>
          <div class="layer-competitors">
            ${layer.competitors.map(c => `<span class="competitor-tag">${c}</span>`).join('')}
          </div>
          ${layer.priceRange ? `<div class="layer-price">价格带: ${layer.priceRange}</div>` : ''}
          <div class="layer-strategy"><strong>应对:</strong> ${layer.strategy}</div>
        </div>
      `).join('');
    }
  },

  renderSTP(data) {
    // 1. 渲染市场细分表格
    const segmentsTableBody = document.getElementById('segments-table-body');
    if (segmentsTableBody) {
      segmentsTableBody.innerHTML = data.segmentation.segments.map(seg => `
        <tr class="${seg.isSelected ? 'selected-row' : ''}" data-segment-id="${seg.id}">
          <td>
            <div class="segment-name-cell">
              <span class="segment-icon">${seg.icon}</span>
              <span class="segment-name">${seg.name}</span>
              ${seg.isHighGrowth ? '<span class="badge badge-success badge-sm">高增长</span>' : ''}
            </div>
          </td>
          <td>${seg.marketSize}</td>
          <td><span class="cagr-value ${seg.isHighGrowth ? 'high' : ''}">${seg.cagr}</span></td>
          <td><span class="total-score">${seg.totalScore}</span></td>
          <td>
            ${seg.isSelected ? '<span class="status-badge selected"> 已选择</span>' : '<button class="btn btn-sm btn-outline">查看</button>'}
          </td>
        </tr>
      `).join('');

      // 绑定行点击事件
      segmentsTableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          const segmentId = row.dataset.segmentId;
          const segment = data.segmentation.segments.find(s => s.id === segmentId);
          this.showSegmentDetail(segment);
        });
      });
    }

    // 显示已选择细分市场的详情
    const selectedSegment = data.segmentation.segments.find(s => s.isSelected);
    if (selectedSegment) {
      this.showSegmentDetail(selectedSegment);
    }

    // 2. 渲染目标选择
    const selectionReasonsList = document.getElementById('selection-reasons-list');
    if (selectionReasonsList) {
      selectionReasonsList.innerHTML = data.targeting.selectionReason.map((reason, index) => `
        <div class="reason-item">
          <span class="reason-number">${index + 1}</span>
          <span class="reason-text">${reason}</span>
        </div>
      `).join('');
    }

    const targetPersonaDetail = document.getElementById('target-persona-detail');
    if (targetPersonaDetail) {
      const persona = data.targeting.targetPersona;
      targetPersonaDetail.innerHTML = `
        <div class="persona-profile">
          <div class="persona-header">
            <div class="persona-name">${persona.name}, ${persona.age}岁</div>
            <div class="persona-basic-info">
              ${persona.occupation} | ${persona.location} | ${persona.income}
            </div>
          </div>

          <div class="persona-pet-info">
            <span class="label">宠物:</span> ${persona.pet.name} (${persona.pet.breed}, ${persona.pet.personality})
          </div>

          <div class="persona-section">
            <div class="section-label">核心痛点:</div>
            <ul class="persona-list">
              ${persona.painPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>

          <div class="persona-section">
            <div class="section-label">期望:</div>
            <ul class="persona-list">
              ${persona.expectations.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>

          <div class="persona-channels-info">
            <span class="label">渠道偏好:</span> ${persona.channels.join(', ')}
          </div>
        </div>
      `;
    }

    // 3. 渲染市场定位
    document.getElementById('positioning-tagline').textContent = data.positioning.tagline;
    document.getElementById('value-proposition-text').textContent = data.positioning.valueProposition;

    const differentiatorsGrid = document.getElementById('differentiators-grid');
    if (differentiatorsGrid) {
      differentiatorsGrid.innerHTML = data.positioning.differentiators.map(diff => `
        <div class="differentiator-card">
          <div class="diff-header">${diff.dimension}</div>
          <div class="diff-comparison">
            <div class="comparison-item our-side">
              <div class="item-label">我们</div>
              <div class="item-value">${diff.ourBrand}</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="comparison-item competitor-side">
              <div class="item-label">竞品</div>
              <div class="item-value">${diff.competitor}</div>
            </div>
          </div>
          <div class="diff-advantage">${diff.advantage}</div>
        </div>
      `).join('');
    }

    // 4. 渲染品类角色
    const categoryRolesGrid = document.getElementById('category-roles-grid');
    if (categoryRolesGrid) {
      const selectedRole = data.categoryRole.options.find(o => o.isSelected);
      const otherRoles = data.categoryRole.options.filter(o => !o.isSelected);

      // 策略定义映射
      const roleDefinitions = {
        'Destination': {
          name: '目标性品类',
          purpose: '建立品牌形象、吸引流量',
          keypoint: '核心竞争力产品，不惜成本打造差异化'
        },
        'Routine': {
          name: '常规性品类',
          purpose: '稳定现金流、日常销售',
          keypoint: '性价比优先，确保持续供应'
        },
        'Seasonal': {
          name: '季节性品类',
          purpose: '特定时段爆发',
          keypoint: '把握时机，快速上市'
        },
        'Convenience': {
          name: '便利性品类',
          purpose: '补充购买、凑单',
          keypoint: '提升客单价，连带销售'
        }
      };

      categoryRolesGrid.innerHTML = `
        ${selectedRole ? `
          <div class="selected-role-section">
            <div class="selected-role-card">
              <div class="selected-badge">✓ 已选策略</div>
              <div class="role-header">
                <div class="role-title">${selectedRole.role}</div>
                <div class="role-chinese">${roleDefinitions[selectedRole.role]?.name || selectedRole.desc}</div>
              </div>
              <div class="role-purpose">
                <span class="label">战略目标:</span>
                <span class="value">${roleDefinitions[selectedRole.role]?.purpose || ''}</span>
              </div>
              <div class="role-keypoint">
                <span class="label">关键要点:</span>
                <span class="value">${roleDefinitions[selectedRole.role]?.keypoint || ''}</span>
              </div>
              <div class="role-metrics">
                <div class="metric-item">
                  <span class="metric-label">盈亏平衡</span>
                  <span class="metric-value">${selectedRole.breakEven}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">投资强度</span>
                  <span class="metric-value">${selectedRole.investment}</span>
                </div>
              </div>
              <div class="role-suitable">${selectedRole.suitable}</div>
            </div>
          </div>

          <div class="other-roles-section">
            <div class="other-roles-title">其他策略对比</div>
            <div class="other-roles-grid">
              ${otherRoles.map(option => `
                <div class="other-role-item">
                  <div class="other-role-header">
                    <div class="other-role-name">${option.role}</div>
                    <div class="other-role-chinese">${roleDefinitions[option.role]?.name || option.desc}</div>
                  </div>
                  <div class="other-role-purpose">${roleDefinitions[option.role]?.purpose || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      `;
    }

    document.getElementById('role-strategy-text').textContent = data.categoryRole.strategy;
  },

  showSegmentDetail(segment) {
    const detailContainer = document.getElementById('selected-segment-detail');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
      <div class="segment-detail-card">
        <div class="detail-header">
          <span class="segment-icon-large">${segment.icon}</span>
          <div class="detail-title">
            <h5>${segment.name}</h5>
            <div class="detail-job">${segment.coreJob}</div>
          </div>
        </div>

        <div class="detail-metrics-grid">
          <div class="detail-metric">
            <span class="label">市场规模</span>
            <span class="value">${segment.marketSize} (${segment.share})</span>
          </div>
          <div class="detail-metric">
            <span class="label">月搜索量</span>
            <span class="value">${segment.monthlySearches}</span>
          </div>
          <div class="detail-metric">
            <span class="label">增长率</span>
            <span class="value highlight">${segment.cagr}</span>
          </div>
        </div>

        <div class="detail-section">
          <strong>目标宠物:</strong> ${segment.targetPet}
        </div>
        <div class="detail-section">
          <strong>目标主人:</strong> ${segment.targetOwner}
        </div>

        <div class="detail-section">
          <strong>Top关键词:</strong>
          <div class="keyword-list">
            ${segment.topKeywords.map(kw => `
              <span class="keyword-tag">${kw.keyword} <small>(${kw.volume})</small></span>
            `).join('')}
          </div>
        </div>

        <div class="detail-section">
          <strong>痛点:</strong>
          <ul class="pain-list">
            ${segment.painPoints.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>

        <div class="detail-section opportunity-section">
          <strong>机会点:</strong>
          <div class="opportunity-text">${segment.opportunity}</div>
        </div>
      </div>
    `;
  },

  // ========== 导出功能 ==========
  exportWuKanAnalysis() {
    if (!this.state.wukanData) {
      Utils.showWarningMessage('没有可导出的数据');
      return;
    }

    const category = this.state.currentCategory;
    const exportData = {
      category: category,
      platform: this.state.currentPlatform,
      country: this.state.currentCountry,
      timestamp: new Date().toISOString(),
      analysis: this.state.wukanData
    };

    // 下载JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `五看分析_${category}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    Utils.showSuccessMessage('五看分析已导出');
  },

  // ========== SPAN & APPEALS模块渲染 ==========
  renderSpanAppealsModule() {
    const spanData = Step2Data.getSPANData(this.state.currentCategory);
    const appealsData = Step2Data.getAPPEALSData(this.state.currentCategory);

    // 渲染SPAN矩阵
    this.renderSPAN(spanData);

    // 渲染$APPEALS分析
    this.renderAPPEALS(appealsData);
  },

  // ========== SPAN矩阵渲染 ==========
  renderSPAN(data) {
    // 1. 渲染细分市场列表
    this.renderSegmentsList(data.segments);

    // 2. 渲染四象限战略指南 (已删除)
    // this.renderQuadrantGuide(data.quadrantGuide);

    // 3. 渲染SPAN矩阵散点图
    this.renderSPANMatrix(data.segments);

    // 4. 渲染AI决策报告
    this.renderAIDecision(data.decision);

    // 5. 默认选中第一个细分市场
    if (data.segments && data.segments.length > 0) {
      this.selectSegment(data.segments[0]);
    }
  },

  renderSegmentsList(segments) {
    const listContainer = document.getElementById('span-segments-list');
    if (!listContainer) return;

    listContainer.innerHTML = segments.map(seg => `
      <div class="segment-card ${seg.id === 'mental-stimulation' ? 'selected' : ''}"
           data-segment-id="${seg.id}">
        <div class="segment-header">
          <span class="segment-icon-lg">${seg.icon}</span>
          <div class="segment-info">
            <h4 class="segment-name">${seg.name}</h4>
            <span class="segment-quadrant ${seg.quadrant}">${seg.quadrantName}</span>
          </div>
          <span class="segment-recommendation ${seg.recommendation.toLowerCase()}">
            ${seg.recommendation}
          </span>
        </div>
        <div class="segment-scores">
          <div class="score-item">
            <span class="score-label">市场吸引力(Y轴)</span>
            <span class="score-value">${seg.attractiveness.total.toFixed(2)}</span>
          </div>
          <div class="score-item">
            <span class="score-label">竞争地位(X轴)</span>
            <span class="score-value">${seg.competitivePosition.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // 添加点击事件
    document.querySelectorAll('.segment-card').forEach(card => {
      card.addEventListener('click', () => {
        const segId = card.dataset.segmentId;
        const segment = segments.find(s => s.id === segId);
        if (segment) this.selectSegment(segment);
      });
    });
  },

  selectSegment(segment) {
    // 更新选中状态
    document.querySelectorAll('.segment-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`.segment-card[data-segment-id="${segment.id}"]`)?.classList.add('selected');

    // 渲染评估详情
    this.renderSegmentEvaluation(segment);
  },

  renderSegmentEvaluation(segment) {
    const container = document.getElementById('segment-evaluation-detail');
    if (!container) return;

    const attr = segment.attractiveness;
    const comp = segment.competitivePosition;

    container.innerHTML = `
      <div class="evaluation-header">
        <div class="eval-title-row">
          <h3 class="panel-title">${segment.icon} ${segment.name} - 详细评估</h3>
          <div class="eval-scores-summary">
            <div class="summary-score y-axis">
              <span class="summary-label">Y轴得分</span>
              <span class="summary-value">${attr.total.toFixed(1)}</span>
            </div>
            <div class="summary-score x-axis">
              <span class="summary-label">X轴得分</span>
              <span class="summary-value">${comp.total.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="evaluation-grid">
        <!-- Y轴：市场吸引力 -->
        <div class="evaluation-section y-axis-section">
          <div class="eval-section-header">
            <h4 class="eval-section-title">📊 Y轴：市场吸引力</h4>
            <span class="section-score">${attr.total.toFixed(2)}/100</span>
          </div>
          <div class="dimension-scores">
            ${Object.entries(attr).filter(([key]) => key !== 'total').map(([key, dim]) => `
              <div class="dimension-row">
                <div class="dim-header">
                  <span class="dim-name">${this.getDimensionName(key, 'attractiveness')}</span>
                  <div class="dim-meta">
                    <span class="dim-weight">权重 ${(dim.weight * 100).toFixed(0)}%</span>
                    <span class="dim-score">${dim.score}分</span>
                  </div>
                </div>
                <div class="dim-progress-bar">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${this.getScoreClass(dim.score)}" style="width: ${dim.score}%">
                      <span class="progress-label">${dim.score}%</span>
                    </div>
                  </div>
                </div>
                <div class="dim-value">${dim.value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- X轴：竞争地位 -->
        <div class="evaluation-section x-axis-section">
          <div class="eval-section-header">
            <h4 class="eval-section-title">🎯 X轴：竞争地位/可进入性</h4>
            <span class="section-score">${comp.total.toFixed(2)}/100</span>
          </div>
          <div class="dimension-scores">
            ${Object.entries(comp).filter(([key]) => key !== 'total').map(([key, dim]) => `
              <div class="dimension-row">
                <div class="dim-header">
                  <span class="dim-name">${this.getDimensionName(key, 'competitive')}</span>
                  <div class="dim-meta">
                    <span class="dim-weight">权重 ${(dim.weight * 100).toFixed(0)}%</span>
                    <span class="dim-score">${dim.score}分</span>
                  </div>
                </div>
                <div class="dim-progress-bar">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${this.getScoreClass(dim.score)}" style="width: ${dim.score}%">
                      <span class="progress-label">${dim.score}%</span>
                    </div>
                  </div>
                </div>
                <div class="dim-value">${dim.value} - ${dim.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 战略分析 -->
      <div class="evaluation-section strategy-section">
        <div class="eval-section-header">
          <h4 class="eval-section-title">💡 战略分析</h4>
        </div>
        <div class="analysis-grid">
          <div class="analysis-card strengths">
            <div class="analysis-card-header">
              <span class="card-icon">✅</span>
              <h5>优势</h5>
            </div>
            <ul class="analysis-list">
              ${segment.analysis.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="analysis-card risks">
            <div class="analysis-card-header">
              <span class="card-icon">⚠️</span>
              <h5>风险</h5>
            </div>
            <ul class="analysis-list">
              ${segment.analysis.risks.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          <div class="analysis-card strategy full-width">
            <div class="analysis-card-header">
              <span class="card-icon">🎯</span>
              <h5>战略建议</h5>
            </div>
            <p class="strategy-text">${segment.analysis.strategy}</p>
          </div>
        </div>
      </div>
    `;
  },

  getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'medium';
    return 'low';
  },

  getDimensionName(key, type) {
    const names = {
      attractiveness: {
        marketSize: '市场规模',
        growthRate: '市场增长率',
        profitPotential: '利润潜力',
        marketStability: '市场稳定性',
        strategicValue: '战略价值'
      },
      competitive: {
        marketConcentration: '市场集中度',
        listingQualityGap: 'Listing质量差距',
        reviewMoat: '评论护城河',
        brandDominance: '品牌主导度'
      }
    };
    return names[type][key] || key;
  },

  renderQuadrantGuide(guide) {
    const tabsContainer = document.getElementById('quadrant-guide-tabs');
    const contentContainer = document.getElementById('quadrant-guide-content');
    if (!tabsContainer || !contentContainer) return;

    const quadrants = ['star', 'cashCow', 'question', 'dog'];

    tabsContainer.innerHTML = quadrants.map((q, idx) => `
      <div class="quadrant-tab ${idx === 0 ? 'active' : ''}"
           data-quadrant="${q}">
        <span class="tab-icon">${guide[q].icon}</span>
        <span class="tab-name">${guide[q].name}</span>
      </div>
    `).join('');

    // 添加点击事件
    document.querySelectorAll('.quadrant-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.showQuadrantGuide(tab.dataset.quadrant, guide);
      });
    });

    this.showQuadrantGuide('star', guide);
  },

  showQuadrantGuide(quadrantKey, guideData) {
    const guide = guideData || Step2Data.getSPANData(this.state.currentCategory).quadrantGuide;
    const quadrant = guide[quadrantKey];

    // 更新Tab状态
    document.querySelectorAll('.quadrant-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`.quadrant-tab[data-quadrant="${quadrantKey}"]`)?.classList.add('active');

    // 渲染内容
    const container = document.getElementById('quadrant-guide-content');
    if (!container) return;

    container.innerHTML = `
      <div class="quadrant-detail ${quadrantKey}">
        <div class="quadrant-header">
          <span class="quadrant-icon-lg">${quadrant.icon}</span>
          <div>
            <h3>${quadrant.name}</h3>
            <p class="quadrant-threshold">判定标准: ${quadrant.threshold}</p>
          </div>
        </div>
        <div class="quadrant-strategy">
          <h4>战略方向: ${quadrant.strategy}</h4>
          <ul class="action-list">
            ${quadrant.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  },

  renderSPANMatrix(segments) {
    const chartDom = document.getElementById('span-matrix-chart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);
    this.state.charts.spanMatrix = chart;

    const scatterData = segments.map(seg => ({
      value: [
        seg.competitivePosition.total,
        seg.attractiveness.total,
        seg.attractiveness.marketSize.score
      ],
      name: seg.name,
      symbolSize: Math.sqrt(seg.attractiveness.marketSize.score) * 3,
      itemStyle: {
        color: this.getQuadrantColor(seg.quadrant)
      },
      label: {
        show: true,
        formatter: seg.icon + ' ' + seg.name,
        position: 'top',
        fontSize: 12,
        color: '#e4e4e7'
      }
    }));

    const option = {
      backgroundColor: 'transparent',
      grid: {
        left: '15%',
        right: '10%',
        top: '15%',
        bottom: '15%'
      },
      xAxis: {
        name: '竞争地位/可进入性 →',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: '#a1a1aa', fontSize: 14 },
        min: 0,
        max: 100,
        splitLine: { lineStyle: { color: '#3f3f46', type: 'dashed' } },
        axisLine: { lineStyle: { color: '#52525b' } },
        axisLabel: { color: '#a1a1aa' }
      },
      yAxis: {
        name: '↑ 市场吸引力',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: { color: '#a1a1aa', fontSize: 14 },
        min: 0,
        max: 100,
        splitLine: { lineStyle: { color: '#3f3f46', type: 'dashed' } },
        axisLine: { lineStyle: { color: '#52525b' } },
        axisLabel: { color: '#a1a1aa' }
      },
      series: [
        {
          type: 'scatter',
          data: scatterData,
          emphasis: {
            scale: true,
            scaleSize: 10
          }
        },
        {
          type: 'line',
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#71717a', width: 2, type: 'solid' },
            data: [
              [{ coord: [60, 0] }, { coord: [60, 100] }],
              [{ coord: [0, 60] }, { coord: [100, 60] }]
            ]
          }
        }
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(24, 24, 27, 0.95)',
        borderColor: '#3f3f46',
        textStyle: { color: '#e4e4e7' },
        formatter: (params) => {
          const seg = segments.find(s => s.name === params.name);
          if (!seg) return '';
          return `
            <div style="padding: 8px;">
              <strong style="font-size: 16px;">${seg.icon} ${seg.name}</strong><br>
              <span style="color: #a1a1aa;">━━━━━━━━━━</span><br>
              市场吸引力: <strong>${seg.attractiveness.total.toFixed(2)}</strong><br>
              竞争地位: <strong>${seg.competitivePosition.total.toFixed(2)}</strong><br>
              <span style="color: #a1a1aa;">━━━━━━━━━━</span><br>
              象限: <strong style="color: ${this.getQuadrantColor(seg.quadrant)};">${seg.quadrantName}</strong><br>
              决策: <strong style="color: ${seg.recommendation === 'GO' ? '#22c55e' : '#f59e0b'};">${seg.recommendation}</strong>
            </div>
          `;
        }
      }
    };

    chart.setOption(option);
  },

  getQuadrantColor(quadrant) {
    const colors = {
      'star': '#22c55e',
      'cash-cow': '#3b82f6',
      'star-cow-border': '#f59e0b',
      'question': '#f59e0b',
      'dog': '#ef4444'
    };
    return colors[quadrant] || '#a1a1aa';
  },

  renderAIDecision(decision) {
    const container = document.getElementById('ai-decision-content');
    if (!container) return;

    container.innerHTML = `
      <div class="decision-summary">
        <div class="decision-header">
          <div class="final-score-badge">
            <span class="score-label">综合评分</span>
            <span class="score-value-lg">${decision.finalScore}</span>
            <span class="score-max">/100</span>
          </div>
          <div class="final-decision ${decision.finalDecision.toLowerCase()}">
            <span class="decision-icon">${decision.finalDecision === 'GO' ? '' : '️'}</span>
            <span class="decision-text">${decision.finalDecision} - ${decision.finalRecommendation}</span>
          </div>
        </div>

        <div class="score-breakdown">
          <h4>评分明细</h4>
          <div class="breakdown-grid">
            ${Object.entries(decision.scoreBreakdown).map(([key, item]) => `
              <div class="breakdown-item">
                <div class="item-header">
                  <span class="item-label">${this.getBreakdownLabel(key)}</span>
                  <span class="item-weight">${item.weight}</span>
                </div>
                <div class="item-score">${item.score}/100</div>
                <div class="item-desc">${item.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="csf-section">
          <h4>关键成功因素 (CSF)</h4>
          <div class="csf-list">
            ${decision.criticalSuccessFactors.map(csf => `
              <div class="csf-item priority-${csf.priority.toLowerCase()}">
                <span class="csf-badge">${csf.priority}</span>
                <div class="csf-content">
                  <div class="csf-desc">${csf.desc}</div>
                  <div class="csf-reason">${csf.reason}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="forecast-section">
          <h4>财务预测 (12个月)</h4>
          <div class="forecast-timeline">
            <div class="forecast-period">
              <h5>Month 1-3 (冷启动期)</h5>
              <div class="period-metrics">
                <span>月销量: ${decision.financialForecast.month_1_3.sales.join(' → ')} 件</span>
                <span>累计GMV: ${decision.financialForecast.month_1_3.gmv}</span>
                <span>ACoS: ${decision.financialForecast.month_1_3.acos}</span>
                <span class="profit-negative">累计利润: ${decision.financialForecast.month_1_3.profit}</span>
              </div>
            </div>
            <div class="forecast-period">
              <h5>Month 4-6 (增长期)</h5>
              <div class="period-metrics">
                <span>月销量: ${decision.financialForecast.month_4_6.sales.join(' → ')} 件</span>
                <span>累计GMV: ${decision.financialForecast.month_4_6.gmv}</span>
                <span>ACoS: ${decision.financialForecast.month_4_6.acos}</span>
                <span class="profit-positive">累计利润: ${decision.financialForecast.month_4_6.profit}</span>
              </div>
            </div>
            <div class="forecast-period">
              <h5>Month 7-12 (成熟期)</h5>
              <div class="period-metrics">
                <span>月销量: ${decision.financialForecast.month_7_12.salesAvg}</span>
                <span>12个月GMV: ${decision.financialForecast.month_7_12.gmv12M}</span>
                <span>净利润: ${decision.financialForecast.month_7_12.netProfit}</span>
                <span class="roi-badge">ROI: ${decision.financialForecast.month_7_12.roi}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="conditions-section">
          <h4>️ 附加条件</h4>
          <ul class="conditions-list">
            ${decision.conditions.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  },

  getBreakdownLabel(key) {
    const labels = {
      span: 'SPAN矩阵',
      financial: '财务可行性',
      technical: '技术可行性',
      team: '团队匹配度',
      risk: '风险评估'
    };
    return labels[key] || key;
  },

  // ========== $APPEALS分析渲染 ==========
  renderAPPEALS(data) {
    // 1. 渲染竞品选择器
    this.renderCompetitorsSelector(data.competitors);

    // 2. 渲染8维度评分表
    this.renderDimensionsTable(data);

    // 3. 渲染价值曲线雷达图
    this.renderValueCurveRadar(data);

    // 4. 渲染差距分析矩阵
    this.renderGapAnalysis(data.valueInsights);

    // 5. 渲染PRD摘要
    this.renderPRDSummary(data.productSpec, data.summary);
  },

  renderCompetitorsSelector(competitors) {
    const container = document.getElementById('competitors-cards-grid');
    if (!container) return;

    container.innerHTML = competitors.map((comp, idx) => `
      <div class="competitor-card ${idx < 3 ? 'selected' : ''}" data-competitor-id="${comp.id}">
        <div class="competitor-card-header">
          <input type="checkbox" class="competitor-checkbox"
                 ${idx < 3 ? 'checked' : ''}
                 data-competitor-id="${comp.id}">
          <div class="competitor-info">
            <div class="competitor-name">${comp.name}</div>
            <div class="competitor-meta">
              <span class="competitor-price">${comp.price}</span>
              <span class="competitor-rating">
                <span class="rating-stars">★ ${comp.rating}</span>
                <span class="rating-count">(${Utils.formatNumber(comp.reviews)})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // 添加点击事件
    document.querySelectorAll('.competitor-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox') {
          const checkbox = card.querySelector('.competitor-checkbox');
          checkbox.checked = !checkbox.checked;
        }

        const selectedCount = document.querySelectorAll('.competitor-checkbox:checked').length;
        if (selectedCount <= 3) {
          card.classList.toggle('selected');
        } else if (!card.classList.contains('selected')) {
          card.querySelector('.competitor-checkbox').checked = false;
          alert('最多只能选择3个竞品');
        }
      });
    });
  },

  renderDimensionsTable(data) {
    const tbody = document.getElementById('appeals-dimensions-tbody');
    if (!tbody) return;

    // 获取选中的竞品（默认前3个）
    const selectedCompetitors = ['kong', 'outward', 'chuckit'];

    tbody.innerHTML = data.dimensions.map(dim => `
      <tr class="dimension-row">
        <td class="dim-name-cell">
          <strong>${dim.nameZh}</strong>
          <span style="color: var(--text-tertiary); font-size: var(--font-size-xs); margin-left: 8px;">${dim.name}</span>
        </td>
        <td class="dim-weight-cell">${(dim.weight * 100).toFixed(0)}%</td>
        <td class="score-cell">${dim.scores.kong.toFixed(1)}</td>
        <td class="score-cell">${dim.scores.outward.toFixed(1)}</td>
        <td class="score-cell">${dim.scores.chuckit.toFixed(1)}</td>
        <td class="score-cell ours">${dim.scores.ours.toFixed(1)}</td>
        <td class="gap-cell ${this.getGapClass(dim.analysis.gap)}">${dim.analysis.gap}</td>
      </tr>
    `).join('');

    // 添加行点击事件
    document.querySelectorAll('.dimension-row').forEach((row, idx) => {
      row.addEventListener('click', () => {
        this.showDimensionDetail(data.dimensions[idx].key);
      });
    });

    // 更新总分
    const scoreCompetitor1 = document.getElementById('score-competitor1');
    const scoreCompetitor2 = document.getElementById('score-competitor2');
    const scoreCompetitor3 = document.getElementById('score-competitor3');
    const scoreOurs = document.getElementById('score-ours');
    const scoreAdvantage = document.getElementById('score-advantage');

    if (scoreCompetitor1) scoreCompetitor1.textContent = data.finalScores.kong.toFixed(1);
    if (scoreCompetitor2) scoreCompetitor2.textContent = data.finalScores.outward.toFixed(1);
    if (scoreCompetitor3) scoreCompetitor3.textContent = data.finalScores.chuckit.toFixed(1);
    if (scoreOurs) scoreOurs.textContent = data.finalScores.ours.toFixed(1);
    if (scoreAdvantage) scoreAdvantage.textContent = `+${data.advantages.vsKong.toFixed(1)}`;

    // 更新表头竞品名称
    const headers = document.querySelectorAll('.dim-competitor-col');
    const competitorNames = [
      data.competitors[0]?.name.split(' ')[0] || '竞品1',
      data.competitors[1]?.name.split(' ')[0] || '竞品2',
      data.competitors[2]?.name.split(' ')[0] || '竞品3'
    ];
    headers.forEach((header, idx) => {
      if (competitorNames[idx]) {
        header.innerHTML = competitorNames[idx];
      }
    });
  },

  getGapClass(gap) {
    if (gap.includes('建优')) return 'gap-open';
    if (gap.includes('填平')) return 'gap-close';
    return 'gap-parity';
  },

  showDimensionDetail(dimKey) {
    const data = Step2Data.getAPPEALSData(this.state.currentCategory);
    const dim = data.dimensions.find(d => d.key === dimKey);
    if (!dim) return;

    const panel = document.getElementById('dimension-detail-panel');
    const nameEl = document.getElementById('detail-dimension-name');
    const bodyEl = document.getElementById('detail-dimension-body');

    if (!panel || !nameEl || !bodyEl) return;

    nameEl.textContent = `${dim.name} - ${dim.nameZh}`;
    bodyEl.innerHTML = `
      <div class="detail-scores">
        <div class="detail-score-item">
          <span class="label">KONG Classic</span>
          <span class="value">${dim.scores.kong.toFixed(1)}</span>
          <p class="reason">${dim.analysis.kongReason}</p>
        </div>
        <div class="detail-score-item">
          <span class="label">Outward Hound</span>
          <span class="value">${dim.scores.outward.toFixed(1)}</span>
          <p class="reason">${dim.analysis.outwardReason}</p>
        </div>
        <div class="detail-score-item">
          <span class="label">Chuckit Ultra</span>
          <span class="value">${dim.scores.chuckit.toFixed(1)}</span>
          <p class="reason">${dim.analysis.chuckitReason}</p>
        </div>
        <div class="detail-score-item highlight">
          <span class="label">PawGenius (我们)</span>
          <span class="value">${dim.scores.ours.toFixed(1)}</span>
          <p class="reason">${dim.analysis.oursReason}</p>
        </div>
      </div>
      <div class="detail-strategy">
        <h5>战略建议</h5>
        <p>${dim.analysis.strategy}</p>
        ${dim.analysis.costImpact ? `<p class="cost-impact">成本影响: ${dim.analysis.costImpact}</p>` : ''}
      </div>
    `;

    panel.style.display = 'block';

    // 绑定关闭按钮
    document.getElementById('close-detail-btn')?.addEventListener('click', () => {
      panel.style.display = 'none';
    });
  },

  renderValueCurveRadar(data) {
    const chartDom = document.getElementById('appeals-radar-chart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);
    this.state.charts.appealsRadar = chart;

    const indicator = data.dimensions.map(dim => ({
      name: dim.nameZh,
      max: 10
    }));

    const seriesData = [
      {
        name: 'PawGenius',
        value: data.dimensions.map(d => d.scores.ours),
        lineStyle: { color: '#22c55e', width: 3 },
        areaStyle: { color: 'rgba(34, 197, 94, 0.2)' }
      },
      {
        name: 'KONG',
        value: data.dimensions.map(d => d.scores.kong),
        lineStyle: { color: '#3b82f6', width: 2 },
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
      },
      {
        name: 'Outward',
        value: data.dimensions.map(d => d.scores.outward),
        lineStyle: { color: '#f59e0b', width: 2 },
        areaStyle: { color: 'rgba(245, 158, 11, 0.1)' }
      },
      {
        name: 'Chuckit',
        value: data.dimensions.map(d => d.scores.chuckit),
        lineStyle: { color: '#a855f7', width: 2 },
        areaStyle: { color: 'rgba(168, 85, 247, 0.1)' }
      }
    ];

    const option = {
      backgroundColor: 'transparent',
      radar: {
        indicator: indicator,
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#e4e4e7',
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: '#3f3f46' }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(63, 63, 70, 0.1)', 'rgba(63, 63, 70, 0.2)']
          }
        },
        axisLine: {
          lineStyle: { color: '#52525b' }
        }
      },
      series: [{
        type: 'radar',
        data: seriesData,
        emphasis: {
          lineStyle: { width: 4 }
        }
      }],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(24, 24, 27, 0.95)',
        borderColor: '#3f3f46',
        textStyle: { color: '#e4e4e7' }
      }
    };

    chart.setOption(option);
  },

  renderGapAnalysis(insights) {
    // 填平差距
    const fillGapList = document.getElementById('fill-gap-list');
    if (fillGapList) {
      fillGapList.innerHTML = insights.fillGaps.map(item => `
        <div class="gap-item">
          <div class="gap-item-header">
            <span class="gap-dimension">${item.dimension}</span>
            <span class="gap-score-diff negative">${item.ourScore} vs ${item.competitorScore}</span>
          </div>
          <div class="gap-item-body">
            <span class="gap-competitor">对标: ${item.competitor}</span>
            <span class="gap-action">${item.action}</span>
          </div>
        </div>
      `).join('');
    }

    // 建立优势
    const buildAdvList = document.getElementById('build-advantage-list');
    if (buildAdvList) {
      buildAdvList.innerHTML = insights.advantages.map(item => `
        <div class="gap-item">
          <div class="gap-item-header">
            <span class="gap-dimension">${item.dimension}</span>
            <span class="gap-score-diff positive">+${item.gap.toFixed(1)}</span>
          </div>
          <div class="gap-item-body">
            <span class="gap-scores">${item.ourScore} vs 平均 ${item.avgCompetitor}</span>
          </div>
        </div>
      `).join('');
    }

    // 保持持平
    const parityList = document.getElementById('maintain-parity-list');
    if (parityList) {
      parityList.innerHTML = insights.parity.map(item => `
        <div class="gap-item">
          <div class="gap-item-header">
            <span class="gap-dimension">${item.dimension}</span>
            <span class="gap-score-diff neutral">${item.ourScore}</span>
          </div>
          <div class="gap-item-body">
            <span class="gap-action">${item.action}</span>
          </div>
        </div>
      `).join('');
    }
  },

  renderPRDSummary(spec, summary) {
    const container = document.getElementById('prd-summary-content');
    if (!container) return;

    container.innerHTML = `
      <div class="prd-overview">
        <h4>${spec.productName}</h4>
        <div class="prd-meta">
          <span>版本: ${spec.version}</span>
          <span>目标上市: ${spec.targetLaunch}</span>
        </div>
      </div>

      <div class="prd-highlights">
        <div class="highlight-item">
          <span class="highlight-label">材料</span>
          <span class="highlight-value">${spec.material.composition}</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-label">尺寸</span>
          <span class="highlight-value">${spec.sizes.length}种规格</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-label">配色</span>
          <span class="highlight-value">${spec.colors.length}种马卡龙色</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-label">毛利率</span>
          <span class="highlight-value">${spec.costStructure.margin}</span>
        </div>
      </div>

      <div class="prd-advantages">
        <h5>核心优势</h5>
        <ul>
          ${summary.coreAdvantages.map(adv => `<li>${adv}</li>`).join('')}
        </ul>
      </div>

      <div class="prd-gaps">
        <h5>需填平的差距</h5>
        <ul>
          ${summary.gapsToFill.map(gap => `<li>${gap}</li>`).join('')}
        </ul>
      </div>
    `;

    // 绑定查看完整PRD按钮
    const viewBtn = document.getElementById('view-full-prd-btn');
    if (viewBtn) {
      viewBtn.replaceWith(viewBtn.cloneNode(true)); // 移除旧事件监听器
      document.getElementById('view-full-prd-btn')?.addEventListener('click', () => {
        alert('完整PRD文档功能待实现\n\n将展示包含以下内容的完整文档:\n- 材料与性能规格\n- 功能设计\n- 尺寸规格\n- 配色方案\n- 包装设计\n- 质保与服务\n- 成本结构');
      });
    }
  },

  // ========================================
  // Phase 4: KANO需求分级引擎模块
  // ========================================

  renderKanoModule() {
    const kanoData = Step2Data.getKANOData(this.state.currentCategory);

    // 渲染顶部元数据
    this.renderKanoMetadata(kanoData.metadata);

    // 渲染KANO分类统计卡片
    this.renderKanoSummary(kanoData.summary);

    // 渲染特征列表 (按KANO分类)
    this.renderKanoFeatures(kanoData.features);

    // 渲染MVP总结
    this.renderMVPSummary(kanoData.mvpSummary);
  },

  renderKanoMetadata(metadata) {
    document.getElementById('kano-sample-size').textContent = metadata.sampleSize;
    document.getElementById('kano-methodology').textContent = metadata.methodology;
    document.getElementById('kano-confidence').textContent = metadata.confidenceLevel;
  },

  renderKanoSummary(summary) {
    // Must-be 基本型
    document.getElementById('must-be-count').textContent = summary.mustBe.count;
    document.getElementById('must-be-cost').textContent = `$${summary.mustBe.totalCost.toFixed(2)} (${summary.mustBe.percentage}%)`;
    document.getElementById('must-be-desc').textContent = summary.mustBe.description;

    // One-dimensional 期望型
    document.getElementById('one-dimensional-count').textContent = summary.oneDimensional.count;
    document.getElementById('one-dimensional-cost').textContent = `$${summary.oneDimensional.totalCost.toFixed(2)} (${summary.oneDimensional.percentage}%)`;
    document.getElementById('one-dimensional-desc').textContent = summary.oneDimensional.description;

    // Attractive 兴奋型
    document.getElementById('attractive-count').textContent = summary.attractive.count;
    document.getElementById('attractive-cost').textContent = `$${summary.attractive.totalCost.toFixed(2)} (${summary.attractive.percentage}%)`;
    document.getElementById('attractive-desc').textContent = summary.attractive.description;

    // Indifferent 无差异
    document.getElementById('indifferent-count').textContent = `${summary.indifferent.deletedCount}`;
    document.getElementById('indifferent-saved').textContent = `$${summary.indifferent.savedCost.toFixed(2)}`;
    document.getElementById('indifferent-desc').textContent = summary.indifferent.description;
  },

  renderKanoFeatures(features) {
    // 按KANO分类分组
    const featuresByCategory = {
      'must-be': features.filter(f => f.category === 'must-be'),
      'one-dimensional': features.filter(f => f.category === 'one-dimensional'),
      'attractive': features.filter(f => f.category === 'attractive'),
      'indifferent': features.filter(f => f.category === 'indifferent')
    };

    // 渲染每个分类的特征卡片
    Object.keys(featuresByCategory).forEach(category => {
      const categoryFeatures = featuresByCategory[category];
      const container = document.getElementById(`${category}-features`);
      const countElement = document.getElementById(`${category}-feature-count`);

      countElement.textContent = `${categoryFeatures.length} 个特征`;

      container.innerHTML = categoryFeatures.map(feature => this.createFeatureCard(feature)).join('');
    });

    // 绑定点击事件
    this.bindFeatureCardEvents();
  },

  createFeatureCard(feature) {
    const isDeleted = feature.status === 'deleted';
    const highlightClass = feature.highlight ? 'highlight' : '';
    const deletedClass = isDeleted ? 'deleted' : '';

    return `
      <div class="feature-card ${deletedClass} ${highlightClass}" data-feature-id="${feature.id}">
        <div class="feature-header">
          <span class="feature-id">${feature.id}</span>
          <span class="feature-cost ${isDeleted ? 'saved' : ''}">${isDeleted ? '-' : ''}$${feature.cost.toFixed(2)}</span>
        </div>
        <div class="feature-name">${feature.name}</div>
        <div class="feature-stats">
          <div class="stat-item">
            <span class="stat-label">提及率</span>
            <span class="stat-value">${feature.mentionRate}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">满意度影响</span>
            <span class="stat-value ${feature.satisfactionImpact > 30 ? 'high' : ''}">${feature.satisfactionImpact > 0 ? '+' : ''}${feature.satisfactionImpact}%</span>
          </div>
        </div>
        ${feature.priority !== 'N/A' ? `
          <div class="feature-priority">
            <span class="priority-badge ${feature.priority.toLowerCase()}">${feature.priority}</span>
          </div>
        ` : ''}
        ${isDeleted ? `
          <div class="deletion-reason">
            <span class="reason-icon">️</span>
            <span class="reason-text">${feature.deletionReason}</span>
          </div>
        ` : ''}
        ${feature.highlight ? '<div class="highlight-badge"> 差异化亮点</div>' : ''}
      </div>
    `;
  },

  bindFeatureCardEvents() {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const featureId = card.dataset.featureId;
        this.showFeatureDetail(featureId);
      });
    });
  },

  showFeatureDetail(featureId) {
    const kanoData = Step2Data.getKANOData(this.state.currentCategory);
    const feature = kanoData.features.find(f => f.id === featureId);

    if (!feature) return;

    const modal = document.getElementById('feature-detail-modal');
    const modalBody = document.getElementById('feature-detail-body');
    const modalTitle = document.getElementById('feature-detail-title');

    modalTitle.textContent = `${feature.id}: ${feature.name}`;

    modalBody.innerHTML = `
      <div class="feature-detail-content">
        <div class="detail-section">
          <h5>️ 基本信息</h5>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">KANO类型</span>
              <span class="value category-badge ${feature.category}">${feature.categoryName}</span>
            </div>
            <div class="detail-item">
              <span class="label">成本</span>
              <span class="value cost">${feature.status === 'deleted' ? '-' : ''}$${feature.cost.toFixed(2)}</span>
            </div>
            <div class="detail-item">
              <span class="label">优先级</span>
              <span class="value priority-badge ${feature.priority.toLowerCase()}">${feature.priority}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态</span>
              <span class="value status-badge ${feature.status}">${feature.status === 'retained' ? ' 保留' : '️ 已删除'}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h5> 数据分析</h5>
          <div class="analysis-stats">
            <div class="stat-bar">
              <span class="stat-label">Review提及率</span>
              <div class="stat-progress">
                <div class="progress-fill" style="width: ${feature.mentionRate}%;"></div>
              </div>
              <span class="stat-number">${feature.mentionRate}%</span>
            </div>
            <div class="stat-bar">
              <span class="stat-label">满意度影响</span>
              <div class="stat-progress ${feature.satisfactionImpact > 30 ? 'high' : ''}">
                <div class="progress-fill" style="width: ${Math.abs(feature.satisfactionImpact)}%;"></div>
              </div>
              <span class="stat-number">${feature.satisfactionImpact > 0 ? '+' : ''}${feature.satisfactionImpact}%</span>
            </div>
          </div>
          <div class="reason-box">
            <p><strong>分析结论:</strong> ${feature.reason}</p>
          </div>
        </div>

        <div class="detail-section">
          <h5> Better-Worse分析</h5>
          <div class="comparison-grid">
            <div class="comparison-item positive">
              <span class="comparison-icon"></span>
              <span class="comparison-label">有此特征</span>
              <span class="comparison-value">${feature.analysis.withFeature}</span>
            </div>
            <div class="comparison-item negative">
              <span class="comparison-icon"></span>
              <span class="comparison-label">无此特征</span>
              <span class="comparison-value">${feature.analysis.withoutFeature}</span>
            </div>
          </div>
          <div class="conclusion-box">
            <p>${feature.analysis.conclusion}</p>
          </div>
        </div>

        ${feature.deletionReason ? `
          <div class="detail-section deletion">
            <h5>️ 删除原因</h5>
            <div class="deletion-reason-box">
              <p>${feature.deletionReason}</p>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // 显示模态框
    modal.style.display = 'flex';

    // 绑定关闭事件
    const closeBtn = document.getElementById('btn-close-feature-modal');
    const overlay = document.getElementById('feature-modal-overlay');

    closeBtn.onclick = () => { modal.style.display = 'none'; };
    overlay.onclick = () => { modal.style.display = 'none'; };
  },

  renderMVPSummary(mvpSummary) {
    // MVP版本
    document.getElementById('mvp-version').textContent = mvpSummary.version;

    // MVP指标
    document.getElementById('mvp-retained-features').textContent = `${mvpSummary.retainedFeatures} 个`;
    document.getElementById('mvp-deleted-features').textContent = `${mvpSummary.deletedFeatures} 个`;
    document.getElementById('mvp-final-cogs').textContent = `$${mvpSummary.finalCOGS.toFixed(2)}`;
    document.getElementById('mvp-cost-optimization').textContent = `-$${mvpSummary.costOptimization.amount.toFixed(2)} (${mvpSummary.costOptimization.percentage.toFixed(1)}%)`;

    // MVP优化建议
    const recommendationsList = document.getElementById('mvp-recommendations-list');
    recommendationsList.innerHTML = mvpSummary.recommendations.map(rec => `
      <div class="recommendation-item ${rec.type}">
        <span class="rec-icon">${rec.icon}</span>
        <span class="rec-text">${rec.text}</span>
      </div>
    `).join('');

    // 下一步行动
    document.getElementById('mvp-next-step-text').textContent = mvpSummary.nextStep;
  },

  // ========================================
  // Phase 5: 数字化Charter生成器模块
  // ========================================

  renderCharterModule() {
    const charterData = Step2Data.getCharterData(this.state.currentCategory);

    // 渲染头部元数据
    this.renderCharterHeader(charterData.metadata);

    // 渲染数据源状态
    this.renderDataSources(charterData.dataSources);

    // 渲染Charter文档内容
    this.renderCharterDocument(charterData);

    // 渲染底部审批决策
    this.renderApprovalFooter(charterData.executiveSummary.keyDecision, charterData.metadata.approvalScore);

    // 绑定导航事件
    this.bindChapterNavigation();

    // 绑定操作按钮
    this.bindCharterActions();
  },

  renderCharterHeader(metadata) {
    document.getElementById('charter-product-name').textContent = metadata.productName;
    document.getElementById('charter-version').textContent = metadata.charterVersion;
    document.getElementById('charter-date').textContent = metadata.date;
    document.getElementById('charter-status').textContent = metadata.status;
  },

  renderDataSources(dataSources) {
    const container = document.getElementById('data-sources-grid');
    container.innerHTML = Object.keys(dataSources).map(key => {
      const source = dataSources[key];
      return `
        <div class="source-badge ${source.completed ? 'completed' : 'pending'}">
          <span class="source-icon">${source.completed ? '' : '⏳'}</span>
          <span class="source-name">${source.name}</span>
        </div>
      `;
    }).join('');
  },

  renderCharterDocument(data) {
    const container = document.getElementById('charter-document');

    container.innerHTML = `
      <!-- Chapter I: Executive Summary -->
      <section class="charter-chapter" id="chapter-1">
        <h2 class="chapter-heading">
          <span class="chapter-num">I.</span> Executive Summary
        </h2>

        <div class="chapter-section">
          <h3>产品概述</h3>
          <div class="overview-grid">
            <div class="overview-item">
              <span class="item-label">产品名称</span>
              <span class="item-value">${data.executiveSummary.productOverview.productName}</span>
            </div>
            <div class="overview-item">
              <span class="item-label">产品类型</span>
              <span class="item-value">${data.executiveSummary.productOverview.productType}</span>
            </div>
            <div class="overview-item">
              <span class="item-label">目标上市</span>
              <span class="item-value">${data.executiveSummary.productOverview.targetLaunchDate}</span>
            </div>
            <div class="overview-item">
              <span class="item-label">产品版本</span>
              <span class="item-value">${data.executiveSummary.productOverview.productVersion}</span>
            </div>
          </div>
          <div class="one-liner">
            <p>"${data.executiveSummary.productOverview.oneLiner}"</p>
          </div>
          <div class="strategic-positioning">
            <p><strong>战略定位:</strong> ${data.executiveSummary.productOverview.strategicPositioning}</p>
          </div>
        </div>

        <div class="chapter-section">
          <h3>核心数据快照</h3>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>指标</th>
                <th>数值</th>
                <th>数据来源</th>
              </tr>
            </thead>
            <tbody>
              ${data.executiveSummary.coreMetrics.map(m => `
                <tr>
                  <td>${m.metric}</td>
                  <td class="metric-value">${m.value}</td>
                  <td class="metric-source">${m.source}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="chapter-section decision-section">
          <h3>关键决策</h3>
          <div class="decision-box ${data.executiveSummary.keyDecision.decision.toLowerCase()}">
            <div class="decision-header">
              <span class="decision-label">决策结果</span>
              <span class="decision-value">${data.executiveSummary.keyDecision.decision}</span>
            </div>
            <div class="decision-score">
              <span>综合得分: <strong>${data.executiveSummary.keyDecision.score}/100</strong></span>
            </div>
            <p class="decision-reasoning">${data.executiveSummary.keyDecision.reasoning}</p>
          </div>
        </div>
      </section>

      <!-- Chapter II: Market Opportunity -->
      <section class="charter-chapter" id="chapter-2">
        <h2 class="chapter-heading">
          <span class="chapter-num">II.</span> Market Opportunity
        </h2>

        <div class="chapter-section">
          <h3>市场规模</h3>
          <div class="market-size-grid">
            <div class="size-item"><span class="label">总市场</span><span class="value">${data.marketOpportunity.marketSize.totalMarket}</span></div>
            <div class="size-item"><span class="label">目标细分</span><span class="value">${data.marketOpportunity.marketSize.targetSegment}</span></div>
            <div class="size-item"><span class="label">增长率</span><span class="value">${data.marketOpportunity.marketSize.growth}</span></div>
          </div>
          <p class="market-trend">${data.marketOpportunity.marketSize.trend}</p>
        </div>

        <div class="chapter-section">
          <h3>客户需求</h3>
          <ul class="needs-list">
            ${data.marketOpportunity.customerNeeds.map(need => `<li>${need}</li>`).join('')}
          </ul>
        </div>

        <div class="chapter-section">
          <h3>市场空白</h3>
          <ul class="gaps-list">
            ${data.marketOpportunity.marketGaps.map(gap => `<li>${gap}</li>`).join('')}
          </ul>
        </div>
      </section>

      <!-- Chapter III-IX: 简化版本 -->
      ${this.renderRemainingChapters(data)}
    `;
  },

  renderRemainingChapters(data) {
    return `
      <!-- Chapter III -->
      <section class="charter-chapter" id="chapter-3">
        <h2 class="chapter-heading"><span class="chapter-num">III.</span> Strategic Positioning</h2>
        <div class="chapter-section">
          <p><strong>STP定位:</strong> ${data.strategicPositioning.stp.positioning}</p>
          <p><strong>差异化优势:</strong> ${data.strategicPositioning.competitiveAdvantage}</p>
          <ul>${data.strategicPositioning.differentiation.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
      </section>

      <!-- Chapter IV -->
      <section class="charter-chapter" id="chapter-4">
        <h2 class="chapter-heading"><span class="chapter-num">IV.</span> Competitive Landscape</h2>
        <div class="chapter-section">
          <table class="competitors-table">
            <thead><tr><th>竞品</th><th>价格</th><th>得分</th><th>定位</th><th>弱点</th></tr></thead>
            <tbody>
              ${data.competitiveLandscape.competitors.map(c => `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.price}</td>
                  <td>${c.score}</td>
                  <td>${c.position}</td>
                  <td>${c.weakness}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="competitive-strategy"><strong>竞争策略:</strong> ${data.competitiveLandscape.competitiveStrategy}</p>
        </div>
      </section>

      <!-- Chapter V -->
      <section class="charter-chapter" id="chapter-5">
        <h2 class="chapter-heading"><span class="chapter-num">V.</span> Product Definition</h2>
        <div class="chapter-section">
          <h3>MVP特征 (KANO分类)</h3>
          <div class="features-grid">
            <div class="feature-category">
              <h4>Must-be (基本型)</h4>
              <ul>${data.productDefinition.mvpFeatures.mustBe.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>
            <div class="feature-category">
              <h4>One-dimensional (期望型)</h4>
              <ul>${data.productDefinition.mvpFeatures.oneDimensional.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>
            <div class="feature-category">
              <h4>Attractive (兴奋型)</h4>
              <ul>${data.productDefinition.mvpFeatures.attractive.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>
          </div>
          <p class="final-cogs"><strong>最终COGS:</strong> ${data.productDefinition.finalCOGS}</p>
        </div>
      </section>

      <!-- Chapter VI -->
      <section class="charter-chapter" id="chapter-6">
        <h2 class="chapter-heading"><span class="chapter-num">VI.</span> Financial Projections</h2>
        <div class="chapter-section">
          <h3>12个月财务预测</h3>
          <div class="forecast-summary">
            <div class="forecast-metric"><span>总收入</span><strong>${data.financialProjections.forecast12Months.total.revenue}</strong></div>
            <div class="forecast-metric"><span>净利润</span><strong>${data.financialProjections.forecast12Months.total.netProfit}</strong></div>
            <div class="forecast-metric"><span>ROI</span><strong>${data.financialProjections.forecast12Months.total.roi}</strong></div>
          </div>
        </div>
      </section>

      <!-- Chapter VII -->
      <section class="charter-chapter" id="chapter-7">
        <h2 class="chapter-heading"><span class="chapter-num">VII.</span> Risk Analysis</h2>
        <div class="chapter-section">
          <table class="risks-table">
            <thead><tr><th>类别</th><th>风险</th><th>概率</th><th>影响</th><th>缓解措施</th></tr></thead>
            <tbody>
              ${data.riskAnalysis.risks.map(r => `
                <tr>
                  <td>${r.category}</td>
                  <td>${r.risk}</td>
                  <td>${r.probability}</td>
                  <td>${r.impact}</td>
                  <td>${r.mitigation}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Chapter VIII -->
      <section class="charter-chapter" id="chapter-8">
        <h2 class="chapter-heading"><span class="chapter-num">VIII.</span> Go-to-Market Strategy</h2>
        <div class="chapter-section">
          <p><strong>上线平台:</strong> ${data.gtmStrategy.launchPlatform}</p>
          <h3>上线时间表</h3>
          <ul>${data.gtmStrategy.launchTimeline.map(t => `<li><strong>${t.phase}</strong> (${t.duration}): ${t.milestone}</li>`).join('')}</ul>
        </div>
      </section>

      <!-- Chapter IX -->
      <section class="charter-chapter" id="chapter-9">
        <h2 class="chapter-heading"><span class="chapter-num">IX.</span> Approval Decision</h2>
        <div class="chapter-section">
          <div class="approval-conditions">
            <h3>批准条件</h3>
            <ul>${data.approvalDecision.conditions.map(c => `<li>${c}</li>`).join('')}</ul>
          </div>
          <div class="next-steps">
            <h3>下一步行动</h3>
            <ul>${data.approvalDecision.nextSteps.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="signatures">
            <h3>签署</h3>
            <div class="signatures-grid">
              <div class="signature-item"><span>${data.approvalDecision.signatures.productManager}</span></div>
              <div class="signature-item"><span>${data.approvalDecision.signatures.technicalLead}</span></div>
              <div class="signature-item"><span>${data.approvalDecision.signatures.financialController}</span></div>
              <div class="signature-item"><span>${data.approvalDecision.signatures.approver}</span></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderApprovalFooter(decision, score) {
    document.getElementById('approval-score-number').textContent = score;
    document.getElementById('approval-decision-text').textContent = decision.decision;
    document.getElementById('approval-reasoning').textContent = decision.reasoning;

    const decisionBadge = document.getElementById('approval-decision-badge');
    decisionBadge.className = `decision-badge ${decision.decision.toLowerCase()}`;
  },

  bindChapterNavigation() {
    const links = document.querySelectorAll('.chapter-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // 更新导航active状态
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // 滚动到对应章节
        const chapterNum = link.dataset.chapter;
        const chapter = document.getElementById(`chapter-${chapterNum}`);
        if (chapter) {
          chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  bindCharterActions() {
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      alert('PDF导出功能待实现\n\n将使用html2pdf库导出完整Charter文档为PDF格式');
    });

    document.getElementById('btn-print-charter')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-generate-charter')?.addEventListener('click', () => {
      alert('Charter文档已生成!\n\n包含全部9个章节的完整产品开发任务书已准备就绪，可以导出PDF或打印。');
    });
  },

  // ========== 阶段管理函数 ==========

  /**
   * 切换阶段
   * @param {number} stageNumber - 阶段编号 (1: SPAN / 2: $APPEALS)
   */
  switchStage(stageNumber) {
    console.log(`Switching to stage ${stageNumber}`);

    // 更新state
    this.state.currentStage = stageNumber;

    // 隐藏所有stage-content
    document.querySelectorAll('.stage-content').forEach(content => {
      content.style.display = 'none';
    });

    // 显示目标stage
    const targetStage = document.getElementById(`stage-${stageNumber}-content`);
    if (targetStage) {
      targetStage.style.display = 'block';
    }

    // 更新指示器状态
    document.querySelectorAll('.stage-item').forEach((item, index) => {
      item.classList.remove('active', 'current');
      const itemStage = index + 1;
      const statusSpan = item.querySelector('.stage-status');

      if (itemStage < stageNumber) {
        item.classList.add('active'); // 已完成
        if (statusSpan) statusSpan.textContent = '已完成';
      } else if (itemStage === stageNumber) {
        item.classList.add('current'); // 进行中
        if (statusSpan) statusSpan.textContent = '进行中';
      } else {
        if (statusSpan) statusSpan.textContent = '未开始';
      }
    });

    // 根据阶段渲染内容
    if (stageNumber === 2) {
      // 渲染$APPEALS对标（如果有数据）
      const appealsData = Step2Data.getAPPEALSData(this.state.currentCategory);
      if (appealsData) {
        this.renderAPPEALS(appealsData);
      }
    }

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * 绑定阶段切换事件
   */
  bindStageEvents() {
    // 阶段指示器点击
    document.querySelectorAll('.stage-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.switchStage(index + 1);
      });
    });

    // "继续下一步"按钮点击
    document.querySelectorAll('.btn-next-stage').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextStage = parseInt(btn.dataset.nextStage);
        if (nextStage) {
          this.switchStage(nextStage);
        }
      });
    });
  },

  /**
   * 选择SPAN市场段
   * @param {object} segment - 细分市场数据
   */
  selectSegment(segment) {
    console.log('Selected segment:', segment);

    // 保存到state
    this.state.selectedSegment = segment;

    // 渲染SPAN评估详情
    this.renderSegmentEvaluation(segment);

    // 不再自动弹窗提示，让用户自己决定何时进入下一阶段
  },

  // ========== 清理 ==========
  destroy() {
    // 销毁所有图表实例
    Object.values(this.state.charts).forEach(chart => {
      if (chart && chart.dispose) {
        chart.dispose();
      }
    });
    this.state.charts = {};
  }
};

// ========== 窗口大小变化时重绘图表 ==========
window.addEventListener('resize', Utils.throttle(() => {
  if (window.Step2 && window.Step2.state.charts) {
    Object.values(window.Step2.state.charts).forEach(chart => {
      if (chart && chart.resize) {
        chart.resize();
      }
    });
  }
}, 200));

// ========== 页面加载完成后初始化 ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.Step2) {
      Step2.init();
    }
  });
} else {
  if (window.Step2) {
    Step2.init();
  }
}

console.log('Step 2 module loaded successfully');
