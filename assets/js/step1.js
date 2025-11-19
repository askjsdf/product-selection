/* ========================================
   Step 1: 机会发现 - 完整 JavaScript 逻辑
   ======================================== */

// ========== 全局状态 ==========
const Step1State = {
  // 数据
  combinationsData: [],

  // 当前策略
  currentStrategy: '综合最优',
  currentWeights: { MA: 25, CF: 20, PP: 30, RF: 15, RC: 10 },

  // 当前视图
  currentTab: 'heatmap',
  currentPerspective: 'platform', // 'platform' | 'category' | 'country'
  currentPlatform: 'Amazon',
  currentCategory: '母婴用品',
  currentCountry: 'US',
  currentDimension: 'mcda_score',

  // 分页
  currentPage: 1,
  pageSize: 20,
  totalItems: 0,

  // 排序
  sortBy: 'mcda_score',
  sortOrder: 'desc',

  // 选中的组合
  selectedCombinations: new Set(),

  // ECharts 实例
  heatmapChart: null,
  radarChart: null
};

// ========== 初始化 ==========
async function initStep1() {
  console.log('[Step1] 初始化开始...');

  try {
    // 1. 加载数据
    await loadStep1Data();

    // 2. 渲染默认 Tab（全景热力图）
    renderHeatmap();

    // 3. 绑定事件
    bindStep1Events();

    // 4. 从 localStorage 恢复用户偏好
    restoreUserPreferences();

    // 5. 预设候选池（如果为空）
    initializeDefaultCandidates();

    console.log('[Step1] 初始化完成');
  } catch (error) {
    console.error('[Step1] 初始化失败:', error);
    Utils.showErrorMessage('数据加载失败，请刷新页面重试');
  }
}

// ========== 数据加载 ==========
async function loadStep1Data() {
  console.log('[Step1] 加载数据...');

  try {
    // 加载组合数据
    const combinationsResponse = await Utils.loadJSON('assets/data/combinations.json');
    Step1State.combinationsData = combinationsResponse.combinations || [];
    Step1State.totalItems = Step1State.combinationsData.length;

    console.log(`[Step1] 数据加载完成: ${Step1State.totalItems} 个组合`);

    // 更新计数
    document.getElementById('heatmap-count').textContent = Step1State.totalItems;
  } catch (error) {
    console.error('[Step1] 数据加载失败:', error);
    throw error;
  }
}

// ========== 事件绑定 ==========
function bindStep1Events() {
  // Tab 切换
  document.querySelectorAll('.step1-tab').forEach(tab => {
    tab.addEventListener('click', handleTabSwitch);
  });

  // 策略选择器
  const strategySelect = document.getElementById('strategy-select');
  if (strategySelect) {
    strategySelect.addEventListener('change', handleStrategyChange);
  }

  // 刷新数据按钮
  const refreshBtn = document.getElementById('refresh-data-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefreshData);
  }

  // 自定义权重按钮
  const customizeWeightsBtn = document.getElementById('customize-weights-btn');
  if (customizeWeightsBtn) {
    customizeWeightsBtn.addEventListener('click', showCustomWeightsModal);
  }

  // 全选按钮
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', handleSelectAll);
  }

  // 加入候选池按钮
  const addSelectedBtn = document.getElementById('add-selected-to-pool-btn');
  if (addSelectedBtn) {
    addSelectedBtn.addEventListener('click', handleAddSelectedToPool);
  }

  // 导出 Top 20 按钮
  const exportTop20Btn = document.getElementById('export-top20-btn');
  if (exportTop20Btn) {
    exportTop20Btn.addEventListener('click', handleExportTop20);
  }

  // 热力图视角切换
  document.querySelectorAll('[data-perspective]').forEach(btn => {
    btn.addEventListener('click', handlePerspectiveChange);
  });

  // 热力图平台筛选
  const platformSelect = document.getElementById('platform-select');
  if (platformSelect) {
    platformSelect.addEventListener('change', handlePlatformChange);
  }

  // 热力图品类筛选
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    categorySelect.addEventListener('change', handleCategoryChange);
  }

  // 热力图国家筛选
  const countrySelect = document.getElementById('country-select');
  if (countrySelect) {
    countrySelect.addEventListener('change', handleCountryChange);
  }

  // 热力图维度选择
  const dimensionSelect = document.getElementById('dimension-select');
  if (dimensionSelect) {
    dimensionSelect.addEventListener('change', handleDimensionChange);
  }

  // 下载热力图按钮
  const downloadHeatmapBtn = document.getElementById('download-heatmap-btn');
  if (downloadHeatmapBtn) {
    downloadHeatmapBtn.addEventListener('click', handleDownloadHeatmap);
  }

  // 自定义权重弹窗保存按钮
  const saveWeightsBtn = document.getElementById('save-weights-btn');
  if (saveWeightsBtn) {
    saveWeightsBtn.addEventListener('click', handleSaveCustomWeights);
  }

  // 权重滑块事件
  ['weight-ma', 'weight-cf', 'weight-pp', 'weight-rf', 'weight-rc'].forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.addEventListener('input', handleWeightSliderChange);
    }
  });

  // 详情弹窗相关按钮
  const exportDetailPdfBtn = document.getElementById('export-detail-pdf-btn');
  if (exportDetailPdfBtn) {
    exportDetailPdfBtn.addEventListener('click', handleExportDetailPDF);
  }

  const addToPoolFromModalBtn = document.getElementById('add-to-pool-from-modal-btn');
  if (addToPoolFromModalBtn) {
    addToPoolFromModalBtn.addEventListener('click', handleAddToPoolFromModal);
  }
}

// ========== Tab 切换 ==========
function handleTabSwitch(event) {
  const tabElement = event.currentTarget;
  const targetTab = tabElement.dataset.tab;

  // 更新 Tab 激活状态
  document.querySelectorAll('.step1-tab').forEach(tab => tab.classList.remove('active'));
  tabElement.classList.add('active');

  // 更新 Panel 显示
  document.querySelectorAll('.step1-panel').forEach(panel => panel.classList.remove('active'));
  const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // 更新状态
  Step1State.currentTab = targetTab;

  // 根据 Tab 渲染内容
  switch (targetTab) {
    case 'top20':
      renderTop20List();
      break;
    case 'heatmap':
      renderHeatmap();
      break;
  }
}

// ========== Top 20 推荐列表渲染 ==========
function renderTop20List() {
  // 1. 重新计算所有组合的分数（根据当前策略权重）
  const scoredCombinations = Step1State.combinationsData.map(combo => {
    const recalculatedScore = MCDAEngine.calculateMCDAv1(combo, Step1State.currentWeights);
    return {
      ...combo,
      mcda_score: recalculatedScore.overall_score,
      scores_breakdown: recalculatedScore.scores
    };
  });

  // 2. 排序
  const sortedCombinations = Utils.sortByKey(scoredCombinations, Step1State.sortBy, Step1State.sortOrder);

  // 3. 分页
  const startIndex = (Step1State.currentPage - 1) * Step1State.pageSize;
  const endIndex = startIndex + Step1State.pageSize;
  const pageData = sortedCombinations.slice(startIndex, endIndex);

  // 4. 渲染权重显示
  renderStrategyWeights();

  // 5. 渲染表格
  const tbody = document.getElementById('top20-tbody');
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; color: var(--text-secondary);">暂无数据</td></tr>';
    return;
  }

  tbody.innerHTML = pageData.map((combo, index) => {
    const globalRank = startIndex + index + 1;
    const rankClass = globalRank <= 3 ? `rank-${globalRank}` : 'rank-other';
    const isSelected = Step1State.selectedCombinations.has(combo.id);

    return `
      <tr data-combo-id="${combo.id}">
        <td><input type="checkbox" class="row-checkbox" data-combo-id="${combo.id}" ${isSelected ? 'checked' : ''}></td>
        <td><span class="rank-badge ${rankClass}">${globalRank}</span></td>
        <td>
          <div class="combination-name">
            <span class="combination-name__main">${combo.category}</span>
            <span class="combination-name__sub">${combo.country} · ${combo.platform}</span>
          </div>
        </td>
        <td class="score-cell ${Utils.getScoreColor(combo.mcda_score)}">${combo.mcda_score.toFixed(1)}</td>
        <td class="${Utils.getScoreColor(combo.scores_breakdown.MA)}">${combo.scores_breakdown.MA.toFixed(1)}</td>
        <td class="${Utils.getScoreColor(combo.scores_breakdown.CF)}">${combo.scores_breakdown.CF.toFixed(1)}</td>
        <td class="${Utils.getScoreColor(combo.scores_breakdown.PP)}">${combo.scores_breakdown.PP.toFixed(1)}</td>
        <td class="${Utils.getScoreColor(combo.scores_breakdown.RF)}">${combo.scores_breakdown.RF.toFixed(1)}</td>
        <td class="${Utils.getScoreColor(combo.scores_breakdown.RC)}">${combo.scores_breakdown.RC.toFixed(1)}</td>
        <td><span class="opportunity-type-badge ${getOpportunityTypeBadgeClass(combo.opportunity_type)}">${combo.opportunity_type}</span></td>
        <td>${Utils.formatCurrency(combo.market_data.gmv, false)}</td>
        <td>${Utils.formatPercent(combo.market_data.growth_rate / 100, true)}</td>
        <td>${Utils.formatPercent(combo.profit_data.margin / 100, true)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-detail-btn" data-combo-id="${combo.id}">
            详情
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // 6. 绑定行事件
  tbody.querySelectorAll('.row-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleRowCheckboxChange);
  });

  tbody.querySelectorAll('.view-detail-btn').forEach(btn => {
    btn.addEventListener('click', handleViewDetail);
  });

  // 7. 渲染分页器
  renderPagination(sortedCombinations.length);

  // 8. 绑定表头排序事件
  bindTableSortEvents();
}

// ========== 渲染策略权重 ==========
function renderStrategyWeights() {
  const container = document.getElementById('strategy-weights-display');
  const strategyName = document.getElementById('current-strategy-name');

  if (strategyName) {
    strategyName.textContent = Step1State.currentStrategy;
  }

  if (!container) return;

  const weights = Step1State.currentWeights;

  container.innerHTML = `
    <div class="weight-item">
      <span class="weight-label">市场吸引力(MA)</span>
      <span class="weight-value">${weights.MA}%</span>
      <div class="weight-bar"><div class="weight-bar__fill" style="width: ${weights.MA}%"></div></div>
    </div>
    <div class="weight-item">
      <span class="weight-label">竞争可行性(CF)</span>
      <span class="weight-value">${weights.CF}%</span>
      <div class="weight-bar"><div class="weight-bar__fill" style="width: ${weights.CF}%"></div></div>
    </div>
    <div class="weight-item">
      <span class="weight-label">利润潜力(PP)</span>
      <span class="weight-value">${weights.PP}%</span>
      <div class="weight-bar"><div class="weight-bar__fill" style="width: ${weights.PP}%"></div></div>
    </div>
    <div class="weight-item">
      <span class="weight-label">资源匹配(RF)</span>
      <span class="weight-value">${weights.RF}%</span>
      <div class="weight-bar"><div class="weight-bar__fill" style="width: ${weights.RF}%"></div></div>
    </div>
    <div class="weight-item">
      <span class="weight-label">风险可控(RC)</span>
      <span class="weight-value">${weights.RC}%</span>
      <div class="weight-bar"><div class="weight-bar__fill" style="width: ${weights.RC}%"></div></div>
    </div>
  `;
}

// ========== 渲染分页器 ==========
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / Step1State.pageSize);
  const currentPage = Step1State.currentPage;

  // 更新统计信息
  const pageStart = (currentPage - 1) * Step1State.pageSize + 1;
  const pageEnd = Math.min(currentPage * Step1State.pageSize, totalItems);

  document.getElementById('page-start').textContent = pageStart;
  document.getElementById('page-end').textContent = pageEnd;
  document.getElementById('total-count').textContent = totalItems;

  // 更新上一页/下一页按钮状态
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  if (prevBtn) {
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        Step1State.currentPage--;
        renderTop20List();
      }
    };
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        Step1State.currentPage++;
        renderTop20List();
      }
    };
  }

  // 渲染页码
  const pageNumbersContainer = document.getElementById('page-numbers');
  if (!pageNumbersContainer) return;

  const pageNumbers = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  pageNumbersContainer.innerHTML = pageNumbers.map(num => {
    if (num === '...') {
      return '<span class="page-number disabled">...</span>';
    }
    const activeClass = num === currentPage ? 'active' : '';
    return `<span class="page-number ${activeClass}" data-page="${num}">${num}</span>`;
  }).join('');

  // 绑定页码点击事件
  pageNumbersContainer.querySelectorAll('.page-number:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = parseInt(e.target.dataset.page);
      if (page && page !== Step1State.currentPage) {
        Step1State.currentPage = page;
        renderTop20List();
      }
    });
  });
}

// ========== 绑定表头排序事件 ==========
function bindTableSortEvents() {
  document.querySelectorAll('.top20-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortKey = th.dataset.sort;

      if (Step1State.sortBy === sortKey) {
        // 切换排序方向
        Step1State.sortOrder = Step1State.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        // 新的排序字段，默认降序
        Step1State.sortBy = sortKey;
        Step1State.sortOrder = 'desc';
      }

      // 重置到第一页
      Step1State.currentPage = 1;

      // 重新渲染
      renderTop20List();
    });
  });
}

// ========== 热力图渲染 ==========
function renderHeatmap() {
  const container = document.getElementById('heatmap-chart');
  if (!container) return;

  // 销毁旧实例
  if (Step1State.heatmapChart) {
    Step1State.heatmapChart.dispose();
  }

  // 创建新实例
  Step1State.heatmapChart = echarts.init(container);

  // 准备数据（根据当前视角和筛选值）
  let filterValue;
  switch (Step1State.currentPerspective) {
    case 'platform':
      filterValue = Step1State.currentPlatform;
      break;
    case 'category':
      filterValue = Step1State.currentCategory;
      break;
    case 'country':
      filterValue = Step1State.currentCountry;
      break;
  }

  const heatmapData = prepareHeatmapData(
    Step1State.combinationsData,
    Step1State.currentPerspective,
    filterValue,
    Step1State.currentDimension
  );

  // 配置选项
  const option = {
    tooltip: {
      position: 'top',
      formatter: function(params) {
        // params.data 可能是数组 [x, y, value] 或对象 {value: [...], name: ...}
        if (!params.data) return '';

        const value = Array.isArray(params.data) ? params.data[2] :
                      (params.data.value ? params.data.value[2] : null);
        const name = params.name || params.data.name || '';

        if (value === null || value === undefined) return '';

        return `
          <div style="padding: 8px;">
            <strong>${name}</strong><br/>
            <span style="color: ${getScoreColorHex(value)};">
              ${Step1State.currentDimension === 'mcda_score' ? '综合分' : Step1State.currentDimension}: ${value.toFixed(1)}
            </span><br/>
            <small style="color: #999;">点击查看详情</small>
          </div>
        `;
      }
    },
    grid: {
      left: 120,
      top: 60,
      right: 80,
      bottom: 60
    },
    xAxis: {
      type: 'category',
      data: heatmapData.xAxisData,
      splitArea: {
        show: true
      },
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'category',
      data: heatmapData.yAxisData,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'vertical',
      right: 10,
      top: 'center',
      inRange: {
        color: ['#50a3ba', '#eac736', '#d94e5d']
      },
      text: ['高分', '低分'],
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    series: [{
      name: Step1State.currentDimension,
      type: 'heatmap',
      data: heatmapData.seriesData,
      label: {
        show: true,
        formatter: function(params) {
          if (!params.data) return '-';
          const value = Array.isArray(params.data) ? params.data[2] :
                        (params.data.value ? params.data.value[2] : null);
          return value !== null && value !== undefined ? value.toFixed(0) : '-';
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  Step1State.heatmapChart.setOption(option);

  // 绑定点击事件
  Step1State.heatmapChart.on('click', function(params) {
    if (params.data && params.data.combinationId) {
      showCombinationDetail(params.data.combinationId);
    }
  });

  // 响应式
  window.addEventListener('resize', () => {
    if (Step1State.heatmapChart) {
      Step1State.heatmapChart.resize();
    }
  });
}

// ========== 准备热力图数据 ==========
function prepareHeatmapData(combinations, perspective, filterValue, dimension) {
  let filteredCombos, xAxisData, yAxisData, xKey, yKey;

  switch (perspective) {
    case 'platform':
      // 平台视角：筛选平台 → Y轴品类 × X轴国家
      filteredCombos = combinations.filter(c => c.platform === filterValue);
      const categories_p = [...new Set(filteredCombos.map(c => c.category))].sort();
      const countries_p = [...new Set(filteredCombos.map(c => c.country))].sort();
      yAxisData = categories_p;
      xAxisData = countries_p;
      xKey = 'country';
      yKey = 'category';
      break;

    case 'category':
      // 品类视角：筛选品类 → Y轴国家 × X轴平台
      filteredCombos = combinations.filter(c => c.category === filterValue);
      const countries_c = [...new Set(filteredCombos.map(c => c.country))].sort();
      const platforms_c = [...new Set(filteredCombos.map(c => c.platform))].sort();
      yAxisData = countries_c;
      xAxisData = platforms_c;
      xKey = 'platform';
      yKey = 'country';
      break;

    case 'country':
      // 国家视角：筛选国家 → Y轴品类 × X轴平台
      filteredCombos = combinations.filter(c => c.country === filterValue);
      const categories_co = [...new Set(filteredCombos.map(c => c.category))].sort();
      const platforms_co = [...new Set(filteredCombos.map(c => c.platform))].sort();
      yAxisData = categories_co;
      xAxisData = platforms_co;
      xKey = 'platform';
      yKey = 'category';
      break;

    default:
      return { xAxisData: [], yAxisData: [], seriesData: [] };
  }

  // 创建映射表：快速查找组合
  const comboMap = {};
  filteredCombos.forEach(combo => {
    const key = `${combo[yKey]}|${combo[xKey]}`;
    comboMap[key] = combo;
  });

  // 生成热力图数据
  const seriesData = [];
  yAxisData.forEach((yValue, yIndex) => {
    xAxisData.forEach((xValue, xIndex) => {
      const key = `${yValue}|${xValue}`;
      const combo = comboMap[key];

      if (combo) {
        const score = dimension === 'mcda_score' ? combo.mcda_score : combo.scores_breakdown[dimension];
        seriesData.push({
          value: [xIndex, yIndex, score],
          name: `${combo.category} · ${combo.country} · ${combo.platform}`,
          combinationId: combo.id
        });
      } else {
        // 没有数据的单元格
        seriesData.push([xIndex, yIndex, null]);
      }
    });
  });

  return {
    xAxisData,
    yAxisData,
    seriesData
  };
}

// ========== 显示组合详情弹窗 ==========
function showCombinationDetail(combinationId) {
  const combo = Step1State.combinationsData.find(c => c.id === combinationId);
  if (!combo) {
    Utils.showErrorMessage('未找到该组合数据');
    return;
  }

  // 设置标题和分数
  document.getElementById('modal-combination-name').textContent =
    `${combo.category} · ${combo.country} · ${combo.platform}`;

  const scoreBadge = document.getElementById('modal-combination-score');
  scoreBadge.textContent = `综合分: ${combo.mcda_score.toFixed(1)}`;
  scoreBadge.className = `badge ms-2 ${Utils.getScoreColor(combo.mcda_score)}`;

  // 填充基本信息
  document.getElementById('detail-category').textContent = combo.category;
  document.getElementById('detail-country').textContent = combo.country;
  document.getElementById('detail-platform').textContent = combo.platform;
  document.getElementById('detail-opportunity-type').innerHTML =
    `<span class="opportunity-type-badge ${getOpportunityTypeBadgeClass(combo.opportunity_type)}">${combo.opportunity_type}</span>`;
  document.getElementById('detail-tags').innerHTML = renderTags(combo.tags);

  // 填充五维分数
  document.getElementById('detail-ma-score').textContent = combo.scores_breakdown.MA.toFixed(1);
  document.getElementById('detail-ma-score').className = `dimension-score ${Utils.getScoreColor(combo.scores_breakdown.MA)}`;

  document.getElementById('detail-cf-score').textContent = combo.scores_breakdown.CF.toFixed(1);
  document.getElementById('detail-cf-score').className = `dimension-score ${Utils.getScoreColor(combo.scores_breakdown.CF)}`;

  document.getElementById('detail-pp-score').textContent = combo.scores_breakdown.PP.toFixed(1);
  document.getElementById('detail-pp-score').className = `dimension-score ${Utils.getScoreColor(combo.scores_breakdown.PP)}`;

  document.getElementById('detail-rf-score').textContent = combo.scores_breakdown.RF.toFixed(1);
  document.getElementById('detail-rf-score').className = `dimension-score ${Utils.getScoreColor(combo.scores_breakdown.RF)}`;

  document.getElementById('detail-rc-score').textContent = combo.scores_breakdown.RC.toFixed(1);
  document.getElementById('detail-rc-score').className = `dimension-score ${Utils.getScoreColor(combo.scores_breakdown.RC)}`;

  // 填充详细数据
  document.getElementById('detail-gmv').textContent = Utils.formatCurrency(combo.market_data.gmv, false);
  document.getElementById('detail-growth-rate').textContent = Utils.formatPercent(combo.market_data.growth_rate / 100, true);
  document.getElementById('detail-search-volume').textContent = Utils.formatNumber(combo.market_data.search_volume);
  document.getElementById('detail-monthly-sales').textContent = Utils.formatCurrency(combo.market_data.monthly_sales, false);

  document.getElementById('detail-cr5').textContent = Utils.formatPercent(combo.competition_data.cr5 / 100, true);
  document.getElementById('detail-top1-share').textContent = Utils.formatPercent(combo.competition_data.top1_share / 100, true);
  document.getElementById('detail-monopoly-index').textContent = combo.competition_data.monopoly_index.toFixed(1);
  document.getElementById('detail-competition-degree').textContent = combo.competition_data.competition_degree.toFixed(1);
  document.getElementById('detail-supply-demand-ratio').textContent = combo.competition_data.supply_demand_ratio.toFixed(2);

  document.getElementById('detail-margin').textContent = Utils.formatPercent(combo.profit_data.margin / 100, true);
  document.getElementById('detail-avg-price').textContent = Utils.formatCurrency(combo.profit_data.avg_price, true);
  document.getElementById('detail-conversion-rate').textContent = Utils.formatPercent(combo.profit_data.conversion_rate / 100, true);

  document.getElementById('detail-compliance-level').textContent = combo.risk_data.compliance_level;
  document.getElementById('detail-return-rate').textContent = Utils.formatPercent(combo.risk_data.return_rate / 100, true);
  document.getElementById('detail-rating').textContent = combo.risk_data.rating.toFixed(1) + ' ⭐';

  // 生成 AI 建议
  renderAISuggestion(combo);

  // 显示弹窗
  const modalElement = document.getElementById('combinationDetailModal');
  const modal = new bootstrap.Modal(modalElement);

  // 在弹窗完全显示后再渲染雷达图（确保容器有正确的尺寸）
  modalElement.addEventListener('shown.bs.modal', function onModalShown() {
    renderRadarChart(combo.scores_breakdown);
    // 移除事件监听器，避免重复绑定
    modalElement.removeEventListener('shown.bs.modal', onModalShown);
  });

  modal.show();

  // 保存当前查看的组合ID（用于加入候选池）
  Step1State.currentViewingComboId = combinationId;
}

// ========== 渲染雷达图 ==========
function renderRadarChart(scores) {
  const container = document.getElementById('detail-radar-chart');
  if (!container) return;

  // 销毁旧实例
  if (Step1State.radarChart) {
    Step1State.radarChart.dispose();
  }

  // 创建新实例
  Step1State.radarChart = echarts.init(container);

  const option = {
    radar: {
      indicator: [
        { name: '市场吸引力(MA)', max: 100 },
        { name: '竞争可行性(CF)', max: 100 },
        { name: '利润潜力(PP)', max: 100 },
        { name: '资源匹配(RF)', max: 100 },
        { name: '风险可控(RC)', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '75%',
      splitNumber: 5,
      shape: 'polygon',
      axisName: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(26, 115, 232, 0.05)', 'rgba(26, 115, 232, 0.1)', 'rgba(26, 115, 232, 0.05)', 'rgba(26, 115, 232, 0.1)', 'rgba(26, 115, 232, 0.05)']
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [scores.MA, scores.CF, scores.PP, scores.RF, scores.RC],
        name: '五维评分',
        areaStyle: {
          color: 'rgba(26, 115, 232, 0.4)'
        },
        lineStyle: {
          color: '#1a73e8',
          width: 3
        },
        itemStyle: {
          color: '#1a73e8',
          borderWidth: 2,
          borderColor: '#fff'
        },
        symbol: 'circle',
        symbolSize: 8
      }],
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a73e8',
        formatter: function(params) {
          return params.value.toFixed(1);
        }
      }
    }],
    backgroundColor: 'transparent'
  };

  Step1State.radarChart.setOption(option);

  // 响应式
  window.addEventListener('resize', () => {
    if (Step1State.radarChart) {
      Step1State.radarChart.resize();
    }
  });
}

// ========== 生成 AI 建议 ==========
function renderAISuggestion(combo) {
  const container = document.getElementById('detail-ai-suggestion');
  if (!container) return;

  const suggestions = [];

  // 基于综合分
  if (combo.mcda_score >= 85) {
    suggestions.push('🎯 <strong>顶级机会</strong>：该组合综合评分优秀，建议优先关注');
  } else if (combo.mcda_score >= 70) {
    suggestions.push('✅ <strong>优质机会</strong>：该组合具备较好的发展潜力');
  } else {
    suggestions.push('⚠️ <strong>一般机会</strong>：该组合存在一定风险，需谨慎评估');
  }

  // 基于市场吸引力
  if (combo.scores_breakdown.MA >= 85) {
    suggestions.push(`📈 市场规模大且增长快速 (${Utils.formatCurrency(combo.market_data.gmv, false)} GMV，${Utils.formatPercent(combo.market_data.growth_rate / 100, true)} 增长率)`);
  }

  // 基于竞争可行性
  if (combo.scores_breakdown.CF >= 85) {
    suggestions.push(`🌊 竞争环境良好，CR5仅 ${Utils.formatPercent(combo.competition_data.cr5 / 100, true)}，适合新卖家进入`);
  } else if (combo.scores_breakdown.CF < 60) {
    suggestions.push(`⚔️ 竞争激烈 (CR5 ${Utils.formatPercent(combo.competition_data.cr5 / 100, true)})，需要强大的差异化能力`);
  }

  // 基于利润潜力
  if (combo.scores_breakdown.PP >= 85) {
    suggestions.push(`💰 高利润潜力：毛利率 ${Utils.formatPercent(combo.profit_data.margin / 100, true)}，转化率 ${Utils.formatPercent(combo.profit_data.conversion_rate / 100, true)}`);
  }

  // 基于资源匹配
  if (combo.scores_breakdown.RF < 70) {
    suggestions.push('🔧 资源匹配度较低，需评估自身供应链和运营能力');
  }

  // 基于风险可控
  if (combo.scores_breakdown.RC < 70) {
    suggestions.push(`⚠️ 风险关注：退货率 ${Utils.formatPercent(combo.risk_data.return_rate / 100, true)}，合规等级 ${combo.risk_data.compliance_level}`);
  }

  // 基于标签
  if (combo.tags.includes('💰高利润')) {
    suggestions.push('💎 高利润产品，适合追求利润率的卖家');
  }
  if (combo.tags.includes('⚡快速起量')) {
    suggestions.push('🚀 快速起量型产品，适合快速测试市场反馈');
  }
  if (combo.tags.includes('🌊蓝海')) {
    suggestions.push('🏝️ 蓝海市场，竞争压力小，有较大发展空间');
  }

  container.innerHTML = `
    <h6>基于 MCDA v1.0 的智能分析：</h6>
    <ul>
      ${suggestions.map(s => `<li>${s}</li>`).join('')}
    </ul>
  `;
}

// ========== 辅助函数：渲染标签 ==========
function renderTags(tags) {
  if (!tags || tags.length === 0) return '';

  return tags.map(tag => {
    let tagClass = 'tag';

    if (tag.includes('高利润')) {
      tagClass = 'tag tag-high-profit';
    } else if (tag.includes('高增长')) {
      tagClass = 'tag tag-high-growth';
    } else if (tag.includes('蓝海')) {
      tagClass = 'tag tag-blue-ocean';
    } else if (tag.includes('快速起量')) {
      tagClass = 'tag tag-fast-growth';
    }

    return `<span class="${tagClass}">${tag}</span>`;
  }).join('');
}

// ========== 辅助函数：获取机会类型徽章样式 ==========
function getOpportunityTypeBadgeClass(type) {
  const typeMap = {
    '蓝海机会': 'blue-ocean',
    '高增长机会': 'high-growth',
    '高利润机会': 'high-profit',
    '平衡机会': 'balanced'
  };

  return typeMap[type] || 'balanced';
}

// ========== 辅助函数：获取分数对应的颜色（十六进制） ==========
function getScoreColorHex(score) {
  if (score >= 85) return '#d94e5d';
  if (score >= 70) return '#eac736';
  return '#50a3ba';
}

// ========== 事件处理：策略变更 ==========
function handleStrategyChange(event) {
  const newStrategy = event.target.value;
  Step1State.currentStrategy = newStrategy;

  // 更新权重
  const strategyWeights = window.MCDAEngine.STRATEGY_WEIGHTS[newStrategy];
  if (strategyWeights) {
    Step1State.currentWeights = { ...strategyWeights };
  }

  // 重新渲染 Top 20
  if (Step1State.currentTab === 'top20') {
    renderTop20List();
  }

  // 保存用户偏好
  saveUserPreferences();

  Utils.showSuccessMessage(`已切换至「${newStrategy}」策略`);
}

// ========== 事件处理：刷新数据 ==========
async function handleRefreshData() {
  showLoading();

  try {
    await loadStep1Data();

    // 重新渲染当前 Tab
    switch (Step1State.currentTab) {
      case 'top20':
        renderTop20List();
        break;
      case 'heatmap':
        renderHeatmap();
        break;
    }

    Utils.showSuccessMessage('数据刷新成功');
  } catch (error) {
    Utils.showErrorMessage('数据刷新失败');
  } finally {
    hideLoading();
  }
}

// ========== 事件处理：显示自定义权重弹窗 ==========
function showCustomWeightsModal() {
  // 设置当前权重值
  document.getElementById('weight-ma').value = Step1State.currentWeights.MA;
  document.getElementById('weight-cf').value = Step1State.currentWeights.CF;
  document.getElementById('weight-pp').value = Step1State.currentWeights.PP;
  document.getElementById('weight-rf').value = Step1State.currentWeights.RF;
  document.getElementById('weight-rc').value = Step1State.currentWeights.RC;

  // 更新显示值
  document.querySelectorAll('.weight-config-item').forEach((item, index) => {
    const keys = ['MA', 'CF', 'PP', 'RF', 'RC'];
    const valueSpan = item.querySelector('.weight-config-value');
    if (valueSpan) {
      valueSpan.textContent = Step1State.currentWeights[keys[index]] + '%';
    }
  });

  // 显示弹窗
  const modal = new bootstrap.Modal(document.getElementById('customWeightsModal'));
  modal.show();
}

// ========== 事件处理：权重滑块变化 ==========
function handleWeightSliderChange(event) {
  const slider = event.target;
  const value = parseInt(slider.value);

  // 更新显示值
  const valueSpan = slider.parentElement.querySelector('.weight-config-value');
  if (valueSpan) {
    valueSpan.textContent = value + '%';
  }

  // 计算总和
  const ma = parseInt(document.getElementById('weight-ma').value);
  const cf = parseInt(document.getElementById('weight-cf').value);
  const pp = parseInt(document.getElementById('weight-pp').value);
  const rf = parseInt(document.getElementById('weight-rf').value);
  const rc = parseInt(document.getElementById('weight-rc').value);

  const total = ma + cf + pp + rf + rc;

  // 更新总计显示
  document.getElementById('weight-total').textContent = total + '%';

  // 显示/隐藏警告
  const warning = document.getElementById('weight-warning');
  const saveBtn = document.getElementById('save-weights-btn');

  if (total === 100) {
    warning.style.display = 'none';
    saveBtn.disabled = false;
  } else {
    warning.style.display = 'block';
    saveBtn.disabled = true;
  }
}

// ========== 事件处理：保存自定义权重 ==========
function handleSaveCustomWeights() {
  const ma = parseInt(document.getElementById('weight-ma').value);
  const cf = parseInt(document.getElementById('weight-cf').value);
  const pp = parseInt(document.getElementById('weight-pp').value);
  const rf = parseInt(document.getElementById('weight-rf').value);
  const rc = parseInt(document.getElementById('weight-rc').value);

  Step1State.currentWeights = { MA: ma, CF: cf, PP: pp, RF: rf, RC: rc };
  Step1State.currentStrategy = '自定义';

  // 关闭弹窗
  const modal = bootstrap.Modal.getInstance(document.getElementById('customWeightsModal'));
  modal.hide();

  // 重新渲染
  if (Step1State.currentTab === 'top20') {
    renderTop20List();
  }

  // 保存用户偏好
  saveUserPreferences();

  Utils.showSuccessMessage('自定义权重已保存');
}

// ========== 事件处理：全选 ==========
function handleSelectAll(event) {
  const isChecked = event.target.checked;

  document.querySelectorAll('.row-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;

    const comboId = checkbox.dataset.comboId;
    if (isChecked) {
      Step1State.selectedCombinations.add(comboId);
    } else {
      Step1State.selectedCombinations.delete(comboId);
    }
  });

  updateSelectedCount();
}

// ========== 事件处理：行复选框变化 ==========
function handleRowCheckboxChange(event) {
  const checkbox = event.target;
  const comboId = checkbox.dataset.comboId;

  if (checkbox.checked) {
    Step1State.selectedCombinations.add(comboId);
  } else {
    Step1State.selectedCombinations.delete(comboId);
  }

  updateSelectedCount();
}

// ========== 更新选中计数 ==========
function updateSelectedCount() {
  const count = Step1State.selectedCombinations.size;
  document.getElementById('selected-count').textContent = count;

  const addBtn = document.getElementById('add-selected-to-pool-btn');
  if (addBtn) {
    addBtn.disabled = count === 0;
  }
}

// ========== 事件处理：加入候选池 ==========
function handleAddSelectedToPool() {
  const selectedIds = Array.from(Step1State.selectedCombinations);

  if (selectedIds.length === 0) {
    Utils.showErrorMessage('请至少选择一个组合');
    return;
  }

  // 检查候选池限制（最多5个）
  const currentPool = getOpportunityPool();
  const remaining = 5 - currentPool.length;

  if (selectedIds.length > remaining) {
    Utils.showErrorMessage(`候选池最多容纳 5 个组合，当前还可添加 ${remaining} 个`);
    return;
  }

  let successCount = 0;

  selectedIds.forEach(id => {
    const combo = Step1State.combinationsData.find(c => c.id === id);
    if (combo) {
      try {
        addToOpportunityPool(combo);
        successCount++;
      } catch (error) {
        console.error('添加失败:', error);
      }
    }
  });

  if (successCount > 0) {
    Utils.showSuccessMessage(`成功加入 ${successCount} 个组合到候选池`);

    // 清空选中状态
    Step1State.selectedCombinations.clear();
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('select-all-checkbox').checked = false;
    updateSelectedCount();
  }
}

// ========== 事件处理：从弹窗加入候选池 ==========
function handleAddToPoolFromModal() {
  if (!Step1State.currentViewingComboId) {
    Utils.showErrorMessage('无法获取组合信息');
    return;
  }

  const combo = Step1State.combinationsData.find(c => c.id === Step1State.currentViewingComboId);
  if (!combo) {
    Utils.showErrorMessage('组合数据不存在');
    return;
  }

  try {
    addToOpportunityPool(combo);
    Utils.showSuccessMessage('已加入候选池');

    // 关闭弹窗
    const modal = bootstrap.Modal.getInstance(document.getElementById('combinationDetailModal'));
    modal.hide();
  } catch (error) {
    Utils.showErrorMessage(error.message);
  }
}

// ========== 事件处理：查看详情 ==========
function handleViewDetail(event) {
  const btn = event.currentTarget;
  const comboId = btn.dataset.comboId;
  showCombinationDetail(comboId);
}

// ========== 事件处理：导出 Top 20 ==========
function handleExportTop20() {
  Utils.showErrorMessage('Excel 导出功能开发中...');
}

// ========== 事件处理：导出详情 PDF ==========
function handleExportDetailPDF() {
  Utils.showErrorMessage('PDF 导出功能开发中...');
}

// ========== 事件处理：视角切换 ==========
function handlePerspectiveChange(event) {
  const btn = event.currentTarget;
  const perspective = btn.dataset.perspective;

  // 更新按钮状态
  document.querySelectorAll('[data-perspective]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // 更新状态
  Step1State.currentPerspective = perspective;

  // 切换筛选器显示
  document.getElementById('platform-filter').style.display = perspective === 'platform' ? 'flex' : 'none';
  document.getElementById('category-filter').style.display = perspective === 'category' ? 'flex' : 'none';
  document.getElementById('country-filter').style.display = perspective === 'country' ? 'flex' : 'none';

  // 重新渲染热力图
  renderHeatmap();
}

// ========== 事件处理：平台筛选变更 ==========
function handlePlatformChange(event) {
  Step1State.currentPlatform = event.target.value;
  renderHeatmap();
}

// ========== 事件处理：品类筛选变更 ==========
function handleCategoryChange(event) {
  Step1State.currentCategory = event.target.value;
  renderHeatmap();
}

// ========== 事件处理：国家筛选变更 ==========
function handleCountryChange(event) {
  Step1State.currentCountry = event.target.value;
  renderHeatmap();
}

// ========== 事件处理：维度变更 ==========
function handleDimensionChange(event) {
  Step1State.currentDimension = event.target.value;
  renderHeatmap();
}

// ========== 事件处理：下载热力图 ==========
function handleDownloadHeatmap() {
  if (!Step1State.heatmapChart) {
    Utils.showErrorMessage('热力图未加载');
    return;
  }

  const url = Step1State.heatmapChart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });

  const link = document.createElement('a');
  link.download = `热力图_${Step1State.currentViewMode}_${Step1State.currentDimension}_${Date.now()}.png`;
  link.href = url;
  link.click();

  Utils.showSuccessMessage('热力图已下载');
}

// ========== 保存用户偏好 ==========
function saveUserPreferences() {
  const preferences = {
    strategy: Step1State.currentStrategy,
    weights: Step1State.currentWeights,
    viewMode: Step1State.currentViewMode,
    dimension: Step1State.currentDimension
  };

  AppStorage.saveUserPreferences(preferences);
}

// ========== 恢复用户偏好 ==========
function restoreUserPreferences() {
  const preferences = AppStorage.getUserPreferences();

  if (preferences) {
    if (preferences.strategy) {
      Step1State.currentStrategy = preferences.strategy;
      const select = document.getElementById('strategy-select');
      if (select) {
        select.value = preferences.strategy;
      }
    }

    if (preferences.weights) {
      Step1State.currentWeights = preferences.weights;
    }

    if (preferences.viewMode) {
      Step1State.currentViewMode = preferences.viewMode;
    }

    if (preferences.dimension) {
      Step1State.currentDimension = preferences.dimension;
      const select = document.getElementById('dimension-select');
      if (select) {
        select.value = preferences.dimension;
      }
    }
  }
}

// ========== 初始化默认候选池 ==========
function initializeDefaultCandidates() {
  // 检查候选池是否为空
  const existingPool = AppStorage.getOpportunityPool();

  if (!existingPool || existingPool.length === 0) {
    // 预设两个默认组合
    const defaultCandidates = [
      'combo_021',  // 宠物用品×US×Amazon (蓝海机会, 51.7分)
      'combo_176'   // 厨房用品×AE×AliExpress (平衡机会, 73.7分)
    ];

    // 添加到候选池
    defaultCandidates.forEach(comboId => {
      const combo = Step1State.combinationsData.find(c => c.id === comboId);
      if (combo) {
        AppStorage.addToOpportunityPool(combo);
      }
    });

    console.log('[Step1] 已预设默认候选池:', defaultCandidates);
  }
}

// ========== 导出到全局 ==========
window.Step1Module = {
  init: initStep1,
  state: Step1State
};

// ========== 自动初始化 ==========
console.log('[Step1] 模块已加载');

// 当脚本加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStep1);
} else {
  // DOM 已就绪，立即初始化
  setTimeout(initStep1, 100);
}
