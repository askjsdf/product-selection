/**
 * Step 3: 竞争运营分析 - 主逻辑文件
 * 功能: 竞品识别 → 流量解构 → 转化解构 → 策略建议
 */

// ========================================
// Global State Management
// ========================================
const Step3App = {
  // Current module
  currentModule: 'competitor-identification',

  // Data
  charter: null,
  competitors: [],
  selectedCompetitors: [],

  // Initialize
  init() {
    console.log('Step 3: 竞争运营分析 - Initializing...');

    // Load charter from Step 2 or use mock data
    this.loadCharter();

    // Load mock data
    this.loadMockData();

    // Setup event listeners
    this.setupEventListeners();

    // Render initial module
    this.renderModule(this.currentModule);

    console.log('Step 3 initialized successfully');
  },

  // Load charter data
  loadCharter() {
    // Try to load from localStorage (from Step 2)
    const savedCharter = localStorage.getItem('step2-charter');
    if (savedCharter) {
      this.charter = JSON.parse(savedCharter);
      console.log('Charter loaded from Step 2:', this.charter);
    } else if (typeof Step3MockData !== 'undefined' && Step3MockData.charter) {
      // Fallback to mock data
      this.charter = Step3MockData.charter;
      console.log('Charter loaded from mock data:', this.charter);
    } else {
      // Default charter
      this.charter = {
        productName: 'PawGenius Smart Ball',
        coreFeatures: ['智能互动 (APP控制)', '自动滚动', '耐咬材质'],
        targetPrice: 24.99,
        targetAudience: '中大型犬主人',
        differentiators: ['AI算法控制滚动轨迹', 'APP远程控制', '内置零食仓']
      };
    }
  },

  // Load mock data
  loadMockData() {
    console.log('loadMockData: typeof Step3MockData =', typeof Step3MockData);
    if (typeof Step3MockData !== 'undefined') {
      console.log('loadMockData: Step3MockData.competitors =', Step3MockData.competitors ? Step3MockData.competitors.length : 'undefined');
      if (Step3MockData.competitors) {
        this.competitors = Step3MockData.competitors;
        // Select first 3 competitors by default
        this.selectedCompetitors = this.competitors.slice(0, 3).map(c => c.id);
        console.log('Mock data loaded:', this.competitors.length, 'competitors');
      } else {
        console.error('Step3MockData.competitors is undefined or null');
      }
    } else {
      console.error('Step3MockData is undefined - mock data file not loaded');
    }
  },

  // Setup event listeners
  setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.step3-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const module = e.currentTarget.dataset.module;
        this.switchModule(module);
      });
    });
  },

  // Switch module
  switchModule(moduleName) {
    // Update current module
    this.currentModule = moduleName;

    // Update active tab
    document.querySelectorAll('.step3-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.module === moduleName) {
        tab.classList.add('active');
      }
    });

    // Render module content
    this.renderModule(moduleName);
  },

  // Render module content
  renderModule(moduleName) {
    const container = document.getElementById('step3-module-container');

    switch(moduleName) {
      case 'competitor-identification':
        container.innerHTML = ModuleRenderer.renderCompetitorIdentification(this.charter, this.competitors);
        this.initCompetitorIdentificationEvents();
        break;
      case 'traffic-analysis':
        container.innerHTML = ModuleRenderer.renderTrafficAnalysis(this.getSelectedCompetitors());
        this.initTrafficAnalysisEvents();
        break;
      case 'conversion-analysis':
        container.innerHTML = ModuleRenderer.renderConversionAnalysis(this.getSelectedCompetitors());
        this.initConversionAnalysisEvents();
        break;
      case 'strategy-recommendations':
        container.innerHTML = ModuleRenderer.renderStrategyRecommendations();
        this.initStrategyRecommendationsEvents();
        break;
    }
  },

  // Get selected competitors
  getSelectedCompetitors() {
    return this.competitors.filter(c => this.selectedCompetitors.includes(c.id));
  },

  // Initialize module-specific events
  initCompetitorIdentificationEvents() {
    // Competitor selection
    document.querySelectorAll('.competitor-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const competitorId = e.currentTarget.dataset.competitorId;
        this.toggleCompetitorSelection(competitorId);
      });
    });

    // Render positioning map chart
    setTimeout(() => {
      ChartRenderer.renderPositioningMap('positioning-map', this.competitors, this.charter);
    }, 100);
  },

  initTrafficAnalysisEvents() {
    // Render BSR trend chart
    setTimeout(() => {
      ChartRenderer.renderBSRTrendChart('bsr-trend-chart', this.getSelectedCompetitors());
    }, 100);
  },

  initConversionAnalysisEvents() {
    // Render review growth chart
    setTimeout(() => {
      ChartRenderer.renderReviewGrowthChart('review-growth-chart', this.getSelectedCompetitors());
    }, 100);

    // Render price history chart
    setTimeout(() => {
      ChartRenderer.renderPriceHistoryChart('price-history-chart', this.getSelectedCompetitors());
    }, 100);
  },

  initStrategyRecommendationsEvents() {
    // PDF download button
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        alert('PDF 下载功能将在后续版本实现');
      });
    }
  },

  // Toggle competitor selection
  toggleCompetitorSelection(competitorId) {
    const card = document.querySelector(`[data-competitor-id="${competitorId}"]`);
    const index = this.selectedCompetitors.indexOf(competitorId);

    if (index > -1) {
      // Deselect
      this.selectedCompetitors.splice(index, 1);
      card.classList.remove('selected');
    } else {
      // Select (max 3)
      if (this.selectedCompetitors.length < 3) {
        this.selectedCompetitors.push(competitorId);
        card.classList.add('selected');
      } else {
        alert('最多只能选择3个竞品进行对比');
      }
    }

    console.log('Selected competitors:', this.selectedCompetitors);
  }
};

// ========================================
// Module Renderer
// ========================================
const ModuleRenderer = {
  // Module 1: Competitor Identification
  renderCompetitorIdentification(charter, competitors) {
    return `
      <div class="row">
        <!-- Left: Charter Input Panel -->
        <div class="col-md-4">
          <div class="card-dark">
            <div class="card-header-dark">Product Charter</div>
            <div class="card-body-dark">
              <div class="mb-3">
                <strong class="text-primary-custom">产品名称:</strong>
                <p class="mb-0">${charter.productName}</p>
              </div>
              <div class="mb-3">
                <strong class="text-primary-custom">目标价格:</strong>
                <p class="mb-0 text-success">$${charter.targetPrice}</p>
              </div>
              <div class="mb-3">
                <strong class="text-primary-custom">核心功能:</strong>
                <ul class="mb-0">
                  ${charter.coreFeatures.map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
              <div class="mb-3">
                <strong class="text-primary-custom">差异化点:</strong>
                <ul class="mb-0">
                  ${charter.differentiators.map(d => `<li>${d}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <div class="card-dark mt-3">
            <div class="card-header-dark">3层筛选漏斗</div>
            <div class="card-body-dark">
              <div class="funnel-layer" style="margin-bottom: 2rem;">
                <div class="funnel-header">
                  <span class="funnel-title">① 类目搜索</span>
                  <span class="funnel-count">100</span>
                </div>
                <p class="funnel-description text-secondary-custom">大类: Pet Supplies > Dog Toys<br>BSR排名: Top 100</p>
              </div>
              <div class="text-center mb-3" style="font-size: 2rem; color: var(--color-blue);">↓</div>
              <div class="funnel-layer" style="margin-bottom: 2rem;">
                <div class="funnel-header">
                  <span class="funnel-title">② 周边搜索</span>
                  <span class="funnel-count">23</span>
                </div>
                <p class="funnel-description text-secondary-custom">价格带: $${charter.targetPrice * 0.5} - $${charter.targetPrice * 1.5}<br>排名范围: 150-250</p>
              </div>
              <div class="text-center mb-3" style="font-size: 2rem; color: var(--color-blue);">↓</div>
              <div class="funnel-layer">
                <div class="funnel-header">
                  <span class="funnel-title">③ 关联搜索</span>
                  <span class="funnel-count">${competitors.length}</span>
                </div>
                <p class="funnel-description text-secondary-custom">购买/浏览关联<br>长尾关键词 Top 10 产品</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Competitors -->
        <div class="col-md-8">
          <div class="card-dark">
            <div class="card-header-dark">核心竞品列表 (点击选择，最多3个)</div>
            <div class="card-body-dark">
              <div class="row">
                ${competitors.map(c => `
                  <div class="col-md-6 mb-3">
                    <div class="competitor-card ${Step3App.selectedCompetitors.includes(c.id) ? 'selected' : ''}" data-competitor-id="${c.id}">
                      <div class="competitor-name">${c.name}</div>
                      <div class="competitor-meta">
                        <div class="meta-item">
                          <span class="meta-label">价格:</span>
                          <span class="meta-value text-success">$${c.price}</span>
                        </div>
                        <div class="meta-item">
                          <span class="meta-label">BSR:</span>
                          <span class="meta-value text-info">#${c.bsr}</span>
                        </div>
                        <div class="meta-item">
                          <span class="meta-label">评分:</span>
                          <span class="meta-value text-warning">${c.rating}⭐</span>
                        </div>
                        <div class="meta-item">
                          <span class="meta-label">Reviews:</span>
                          <span class="meta-value">${c.reviews.toLocaleString()}</span>
                        </div>
                      </div>
                      <div class="mt-2">
                        <small class="text-secondary-custom">匹配原因: ${c.matchReasons ? c.matchReasons.join(', ') : '价格接近'}</small>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="chart-container mt-3">
            <div class="chart-title">竞品定位地图 (功能复杂度 vs 价格)</div>
            <div id="positioning-map" class="chart-wrapper"></div>
          </div>
        </div>
      </div>
    `;
  },

  // Module 2: Traffic Analysis
  renderTrafficAnalysis(competitors) {
    if (competitors.length === 0) {
      return '<div class="alert alert-warning">请先在"竞品识别"模块选择至少1个竞品</div>';
    }

    return `
      <div class="card-dark">
        <div class="card-header-dark">2.1 Listing 对比分析</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>维度</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>标题字符数</strong></td>
                ${competitors.map(c => `<td>${c.listing?.titleLength || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>图片数量</strong></td>
                ${competitors.map(c => `<td>${c.listing?.imageCount || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>视频</strong></td>
                ${competitors.map(c => `<td>${c.listing?.hasVideo ? '✅' : '❌'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>A+ 页面</strong></td>
                ${competitors.map(c => `<td>${c.listing?.hasAPlus ? `✅ (${c.listing.aPlusModules}模块)` : '❌'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>当前 BSR</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-green">#${c.bsr}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="chart-container mt-4">
        <div class="chart-title">BSR 排名趋势 (过去90天)</div>
        <div id="bsr-trend-chart" class="chart-wrapper"></div>
      </div>

      <div class="card-dark mt-4">
        <div class="card-header-dark">2.2 关键词分析</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>指标</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>自然排名词数</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.organicTotal || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Top 10 排名词</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-green">${c.keywords?.organicTop10 || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>广告投放词数</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.sponsoredTotal || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>长尾词覆盖</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.longTailCoverage || 'N/A'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-dark mt-4">
        <div class="card-header-dark">2.3 广告投放分析</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>广告类型</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SP 广告</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.adPositions?.topOfSearch > 0 ? '✅ 高频' : '⚠️ 低频'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>SB 视频广告</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.hasSBVideoAd ? '✅' : '❌'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>品牌防御</strong></td>
                ${competitors.map(c => `<td>${c.keywords?.brandDefense || 'N/A'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Module 3: Conversion Analysis
  renderConversionAnalysis(competitors) {
    if (competitors.length === 0) {
      return '<div class="alert alert-warning">请先在"竞品识别"模块选择至少1个竞品</div>';
    }

    return `
      <div class="card-dark">
        <div class="card-header-dark">3.1 Review 基础数据</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>指标</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Review 总数</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-green">${c.reviewData?.total?.toLocaleString() || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>近30天新增</strong></td>
                ${competitors.map(c => `<td>${c.reviewData?.recent30Days || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>日均增速</strong></td>
                ${competitors.map(c => `<td>${c.reviewData?.dailyAverage || 'N/A'} / 天</td>`).join('')}
              </tr>
              <tr>
                <td><strong>平均评分</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-yellow">${c.reviewData?.avgRating || 'N/A'} ⭐</td>`).join('')}
              </tr>
              <tr>
                <td><strong>VP 占比</strong></td>
                ${competitors.map(c => `<td>${c.reviewData?.vpRatio ? (c.reviewData.vpRatio * 100).toFixed(1) + '%' : 'N/A'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="chart-container mt-4">
        <div class="chart-title">Review 累计增长趋势</div>
        <div id="review-growth-chart" class="chart-wrapper"></div>
      </div>

      <div class="card-dark mt-4">
        <div class="card-header-dark">3.2 定价策略分析</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>价格指标</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>当前价格</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-green">$${c.pricingData?.currentPrice || c.price}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>90天均价</strong></td>
                ${competitors.map(c => `<td>$${c.pricingData?.average90d || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>历史最低</strong></td>
                ${competitors.map(c => `<td>$${c.pricingData?.historicalLow || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>促销频率</strong></td>
                ${competitors.map(c => `<td>${c.pricingData?.promotionFrequency || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Lightning Deal</strong></td>
                ${competitors.map(c => `<td>${c.pricingData?.hasLD ? '✅' : '❌'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="chart-container mt-4">
        <div class="chart-title">价格历史趋势 (过去180天)</div>
        <div id="price-history-chart" class="chart-wrapper"></div>
      </div>

      <div class="card-dark mt-4">
        <div class="card-header-dark">3.3 QA 分析</div>
        <div class="card-body-dark">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>QA 指标</th>
                ${competitors.map(c => `<th>${c.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>QA 总数</strong></td>
                ${competitors.map(c => `<td>${c.qaData?.total || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>回答率</strong></td>
                ${competitors.map(c => `<td>${c.qaData?.answerRate ? (c.qaData.answerRate * 100).toFixed(1) + '%' : 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>卖家回答率</strong></td>
                ${competitors.map(c => `<td class="table-cell-highlight-${c.qaData?.sellerAnswerRate > 0.2 ? 'green' : 'red'}">${c.qaData?.sellerAnswerRate ? (c.qaData.sellerAnswerRate * 100).toFixed(1) + '%' : 'N/A'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Module 4: Strategy Recommendations
  renderStrategyRecommendations() {
    if (typeof Step3MockData === 'undefined' || !Step3MockData.strategyRecommendations) {
      return '<div class="alert alert-warning">策略建议数据加载中...</div>';
    }

    const strategy = Step3MockData.strategyRecommendations;

    return `
      <div class="card-dark">
        <div class="card-header-dark">核心洞察总结</div>
        <div class="card-body-dark">
          ${strategy.insights.map(insight => `
            <div class="insight-card">
              <div class="insight-header">
                <h4>${insight.title}</h4>
              </div>
              <div class="insight-body">
                <div class="data-support">
                  <strong>数据支撑:</strong>
                  <ul>
                    ${insight.dataSupport.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="implications">
                  <strong>启示:</strong>
                  <ul>
                    ${insight.implications.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section-divider"></div>

      <div class="row">
        <div class="col-md-6">
          <div class="card-dark">
            <div class="card-header-dark">流量策略建议</div>
            <div class="card-body-dark">
              <h5 class="text-primary-custom mb-3">Listing 优化</h5>
              <ul class="text-secondary-custom">
                <li><strong>标题:</strong> ${strategy.trafficStrategy.listing.title}</li>
                <li><strong>主图:</strong> ${strategy.trafficStrategy.listing.mainImage}</li>
                <li><strong>视频:</strong> ${strategy.trafficStrategy.listing.video}</li>
                <li><strong>五点:</strong> ${strategy.trafficStrategy.listing.bulletPoints}</li>
              </ul>

              <h5 class="text-primary-custom mb-3 mt-4">关键词策略</h5>
              <ul class="text-secondary-custom">
                <li><strong>避开:</strong> ${strategy.trafficStrategy.keywords.avoid.join(', ')}</li>
                <li><strong>主攻:</strong> ${strategy.trafficStrategy.keywords.target.join(', ')}</li>
                <li><strong>长尾:</strong> ${strategy.trafficStrategy.keywords.longTail.join(', ')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card-dark">
            <div class="card-header-dark">转化策略建议</div>
            <div class="card-body-dark">
              <h5 class="text-primary-custom mb-3">Review 策略</h5>
              <p class="text-secondary-custom"><strong>目标:</strong> ${strategy.conversionStrategy.review.target}</p>
              <ul class="text-secondary-custom">
                ${strategy.conversionStrategy.review.path.map(item => `<li>${item}</li>`).join('')}
              </ul>

              <h5 class="text-primary-custom mb-3 mt-4">定价策略</h5>
              <ul class="text-secondary-custom">
                <li><strong>上市价:</strong> $${strategy.conversionStrategy.pricing.launchPrice}</li>
                <li><strong>首月价:</strong> $${strategy.conversionStrategy.pricing.firstMonthPrice}</li>
                <li><strong>长期价:</strong> $${strategy.conversionStrategy.pricing.longTermPrice}</li>
                <li><strong>促销频率:</strong> ${strategy.conversionStrategy.pricing.promotionFrequency}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <div class="card-dark">
        <div class="card-header-dark">差异化打法建议</div>
        <div class="card-body-dark">
          <div class="row">
            ${strategy.differentiationTactics.map(tactic => `
              <div class="col-md-6 mb-3">
                <div class="card-dark">
                  <h5 class="text-primary-custom mb-3">${tactic.title}</h5>
                  <div class="mb-3">
                    <strong class="text-secondary-custom">竞品现状:</strong>
                    <ul class="text-secondary-custom">
                      ${tactic.competitorStatus.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="mb-3">
                    <strong class="text-success">我们的打法:</strong>
                    <ul class="text-secondary-custom">
                      ${tactic.ourApproach.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <strong class="text-warning">预期效果:</strong>
                    <ul class="text-secondary-custom">
                      ${tactic.expectedResults.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button id="download-pdf-btn" class="btn-primary-dark">
          📥 下载策略总结 PDF
        </button>
      </div>
    `;
  }
};

// ========================================
// Chart Renderer
// ========================================
const ChartRenderer = {
  // Positioning Map (散点图)
  renderPositioningMap(elementId, competitors, charter) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const chart = echarts.init(el);

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const data = params.data;
          return `<strong>${data.name}</strong><br/>
                  功能复杂度: ${data.value[0]}<br/>
                  价格: $${data.value[1]}<br/>
                  BSR: #${data.bsr}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        name: '功能复杂度',
        nameTextStyle: { color: '#b0b0b0' },
        min: 0,
        max: 6,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' },
        splitLine: { lineStyle: { color: '#2a2a2a' } }
      },
      yAxis: {
        name: '价格 ($)',
        nameTextStyle: { color: '#b0b0b0' },
        min: 0,
        max: 50,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' },
        splitLine: { lineStyle: { color: '#2a2a2a' } }
      },
      series: [{
        name: '竞品',
        type: 'scatter',
        symbolSize: (data) => Math.max(20, 300 / data[2]), // Size based on BSR (smaller BSR = larger bubble)
        data: competitors.map(c => ({
          name: c.name,
          value: [
            c.positioning?.functionalityScore || 3,
            c.price,
            c.bsr
          ],
          bsr: c.bsr,
          itemStyle: {
            color: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 2
          }
        })),
        label: {
          show: true,
          formatter: '{b}',
          position: 'top',
          color: '#e0e0e0',
          fontSize: 10
        }
      }, {
        name: '我们',
        type: 'scatter',
        symbolSize: 30,
        data: [{
          name: '我们',
          value: [4, charter.targetPrice, 0],
          itemStyle: {
            color: '#22c55e',
            borderColor: '#16a34a',
            borderWidth: 3
          }
        }],
        label: {
          show: true,
          formatter: '{b}',
          position: 'top',
          color: '#22c55e',
          fontSize: 12,
          fontWeight: 'bold'
        }
      }]
    };

    chart.setOption(option);
  },

  // BSR Trend Chart
  renderBSRTrendChart(elementId, competitors) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const chart = echarts.init(el);

    const dates = ['90天前', '60天前', '30天前', '今天'];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: competitors.map(c => c.name),
        textStyle: { color: '#b0b0b0' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' }
      },
      yAxis: {
        type: 'value',
        name: 'BSR 排名',
        inverse: true, // Lower is better
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' },
        splitLine: { lineStyle: { color: '#2a2a2a' } }
      },
      series: competitors.map(c => ({
        name: c.name,
        type: 'line',
        smooth: true,
        data: [c.bsr + 24, c.bsr + 14, c.bsr + 9, c.bsr] // Mock trend
      }))
    };

    chart.setOption(option);
  },

  // Review Growth Chart
  renderReviewGrowthChart(elementId, competitors) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const chart = echarts.init(el);

    const months = ['6个月前', '5个月前', '4个月前', '3个月前', '2个月前', '1个月前', '现在'];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: competitors.map(c => c.name),
        textStyle: { color: '#b0b0b0' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' }
      },
      yAxis: {
        type: 'value',
        name: 'Review 数量',
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' },
        splitLine: { lineStyle: { color: '#2a2a2a' } }
      },
      series: competitors.map(c => {
        const total = c.reviewData?.total || 1000;
        const growth = c.reviewData?.dailyAverage || 2;
        return {
          name: c.name,
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.3 },
          data: months.map((_, i) => Math.floor(total - (6 - i) * growth * 30))
        };
      })
    };

    chart.setOption(option);
  },

  // Price History Chart
  renderPriceHistoryChart(elementId, competitors) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const chart = echarts.init(el);

    const dates = ['180天前', '150天前', '120天前', '90天前', '60天前', '30天前', '今天'];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: competitors.map(c => c.name),
        textStyle: { color: '#b0b0b0' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080' }
      },
      yAxis: {
        type: 'value',
        name: '价格 ($)',
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#808080', formatter: '${value}' },
        splitLine: { lineStyle: { color: '#2a2a2a' } }
      },
      series: competitors.map(c => ({
        name: c.name,
        type: 'line',
        smooth: true,
        data: [
          c.pricingData?.average90d || c.price,
          c.pricingData?.historicalHigh || c.price * 1.1,
          c.pricingData?.average90d || c.price,
          c.pricingData?.historicalLow || c.price * 0.8,
          c.pricingData?.average90d || c.price,
          c.price,
          c.price
        ]
      }))
    };

    chart.setOption(option);
  }
};

// ========================================
// Initialize (called by main.js when step is loaded)
// ========================================
// 立即初始化（因为这个脚本是在HTML加载后才被main.js动态加载的）
if (typeof Step3App !== 'undefined') {
  Step3App.init();
}
