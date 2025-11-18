/**
 * Main - 主框架逻辑
 * 项目：AI选品助手
 * 更新时间：2025-11-18
 */

// 全局状态管理
window.AppState = {
  currentStep: 1,                    // 当前步骤
  opportunityPool: [],               // 机会候选池 (Step 1 → Step 2)
  productPool: [],                   // 产品候选池 (Step 3 → Step 4)
  selectedProducts: [],              // 精选产品 (Step 4 → Step 5)
  finalDecisions: [],                // 最终决策 (Step 6)
  userPreferences: {                 // 用户偏好 (MCDA权重等)
    weights: { MA: 25, CF: 20, PP: 30, RF: 15, RC: 10 },
    strategyMode: '综合最优'
  },
  loadedSteps: new Set()             // 已加载的步骤（避免重复加载）
};

/**
 * 加载 Step 模块
 * @param {number} stepNumber - 步骤编号 (1-6)
 * @returns {Promise<void>}
 */
async function loadStepModule(stepNumber) {
  try {
    // 验证 stepNumber 范围
    if (stepNumber < 1 || stepNumber > 6) {
      throw new Error(`Invalid step number: ${stepNumber}`);
    }

    // 显示加载动画
    Utils.showLoading();

    // 更新当前步骤
    window.AppState.currentStep = stepNumber;

    // 加载 HTML 内容
    const htmlResponse = await fetch(`modules/step${stepNumber}.html`);
    if (!htmlResponse.ok) {
      throw new Error(`Failed to load step${stepNumber}.html: ${htmlResponse.status}`);
    }
    const htmlContent = await htmlResponse.text();

    // 插入内容到容器
    const container = document.getElementById('step-container');
    container.innerHTML = htmlContent;

    // 动态加载 CSS（如果未加载过）
    if (!window.AppState.loadedSteps.has(`css-${stepNumber}`)) {
      await loadCSS(`assets/css/step${stepNumber}.css`);
      window.AppState.loadedSteps.add(`css-${stepNumber}`);
    }

    // 动态加载 JS（移除旧脚本再加载新脚本）
    await loadScript(`assets/js/step${stepNumber}.js`);

    // 更新 Tab 激活状态
    updateTabActiveState(stepNumber);

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('step-changed', {
      detail: { stepNumber, timestamp: Date.now() }
    }));

    // 隐藏加载动画
    Utils.hideLoading();

    console.log(`Step ${stepNumber} loaded successfully`);
  } catch (error) {
    console.error(`Failed to load step ${stepNumber}:`, error);
    Utils.hideLoading();
    Utils.showErrorMessage(`加载失败：${error.message}`);
  }
}

/**
 * 动态加载 CSS 文件
 * @param {string} href - CSS 文件路径
 * @returns {Promise<void>}
 */
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
}

/**
 * 动态加载 JS 文件
 * @param {string} src - JS 文件路径
 * @returns {Promise<void>}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // 移除旧的 script（避免重复加载）
    const oldScript = document.querySelector(`script[src="${src}"]`);
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * 更新 Tab 激活状态
 * @param {number} activeStep - 激活的步骤编号
 */
function updateTabActiveState(activeStep) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab, index) => {
    if (index + 1 === activeStep) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });
}

/**
 * 更新候选池 UI
 */
function updateOpportunityPoolUI() {
  const pool = AppStorage.getOpportunityPool();
  const container = document.getElementById('opportunity-pool-list');
  const countCurrent = document.querySelector('.count-current');
  const emptyState = document.getElementById('pool-empty-state');

  // 更新计数
  if (countCurrent) {
    countCurrent.textContent = pool.length;
  }

  // 显示/隐藏空状态
  if (emptyState) {
    emptyState.style.display = pool.length === 0 ? 'block' : 'none';
  }

  // 渲染候选池列表
  if (container) {
    if (pool.length === 0) {
      container.innerHTML = '';
    } else {
      container.innerHTML = pool.map(item => createPoolItemHTML(item)).join('');

      // 绑定事件
      bindPoolItemEvents(container);
    }
  }

  // 更新浮动按钮徽章
  const badge = document.querySelector('.sidebar-toggle__badge');
  if (badge) {
    badge.textContent = pool.length;
    badge.style.display = pool.length > 0 ? 'flex' : 'none';
  }
}

/**
 * 创建候选池项 HTML
 * @param {Object} item - 候选池项数据
 * @returns {string} HTML 字符串
 */
function createPoolItemHTML(item) {
  const scoreColor = Utils.getScoreColor(item.mcda_score);
  const tags = item.tags || [];

  return `
    <div class="pool-item" data-item-id="${item.id}">
      <div class="pool-item__header">
        <h4 class="pool-item__name">${item.category} × ${item.country} × ${item.platform}</h4>
        <div class="pool-item__score ${scoreColor}">${item.mcda_score.toFixed(1)}</div>
      </div>
      <div class="pool-item__tags">
        ${tags.map(tag => {
          const tagClass = tag.includes('高增长') ? 'tag-high-growth' :
                          tag.includes('高利润') ? 'tag-high-profit' :
                          tag.includes('蓝海') ? 'tag-blue-ocean' :
                          tag.includes('快速') ? 'tag-fast-launch' : '';
          return `<span class="tag ${tagClass}">${tag}</span>`;
        }).join('')}
      </div>
      ${item.note ? `<div class="pool-item__note">${item.note}</div>` : ''}
      <div class="pool-item__actions">
        <button class="btn btn-sm btn-outline pool-item-detail-btn" data-item-id="${item.id}">
          详情
        </button>
        <button class="btn btn-sm btn-danger pool-item-remove-btn" data-item-id="${item.id}">
          移除
        </button>
      </div>
    </div>
  `;
}

/**
 * 绑定候选池项事件
 * @param {HTMLElement} container - 容器元素
 */
function bindPoolItemEvents(container) {
  // 详情按钮
  container.querySelectorAll('.pool-item-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.itemId;
      // 触发自定义事件，由 Step 1 模块处理
      window.dispatchEvent(new CustomEvent('show-combination-detail', {
        detail: { combinationId: itemId }
      }));
    });
  });

  // 移除按钮
  container.querySelectorAll('.pool-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.itemId;
      const result = AppStorage.removeFromOpportunityPool(itemId);

      if (result.success) {
        Utils.showSuccessMessage(result.message);
        updateOpportunityPoolUI();
      } else {
        Utils.showErrorMessage(result.message);
      }
    });
  });
}

/**
 * 候选池"对比全部"功能
 */
function handleCompareAll() {
  const pool = AppStorage.getOpportunityPool();

  if (pool.length < 2) {
    Utils.showWarningMessage('至少需要 2 个组合才能对比');
    return;
  }

  if (pool.length > 5) {
    Utils.showWarningMessage('最多对比 5 个组合，将对比前 5 个');
  }

  // 触发对比事件
  window.dispatchEvent(new CustomEvent('compare-opportunities', {
    detail: { combinations: pool.slice(0, 5) }
  }));
}

/**
 * 候选池"导出报告"功能
 */
async function handleExportReport() {
  const pool = AppStorage.getOpportunityPool();

  if (pool.length === 0) {
    Utils.showWarningMessage('候选池为空，无法导出报告');
    return;
  }

  try {
    Utils.showLoading();

    // 触发导出事件
    window.dispatchEvent(new CustomEvent('export-opportunity-pool-pdf', {
      detail: { pool }
    }));

    // 注意：实际导出由 Step 1 模块的 PDF 导出函数处理
    // 这里只是触发事件

  } catch (error) {
    console.error('Failed to export report:', error);
    Utils.showErrorMessage('导出失败，请重试');
    Utils.hideLoading();
  }
}

/**
 * 候选池"进入下一步"功能
 */
function handleNextStep() {
  const pool = AppStorage.getOpportunityPool();

  if (pool.length === 0) {
    Utils.showWarningMessage('请至少添加 1 个组合到候选池');
    return;
  }

  const currentStep = window.AppState.currentStep;
  if (currentStep >= 6) {
    Utils.showInfoMessage('已经是最后一步了');
    return;
  }

  loadStepModule(currentStep + 1);
}

/**
 * 初始化 Tab 点击事件
 */
function initTabEvents() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      loadStepModule(index + 1);
    });
  });
}

/**
 * 初始化候选池事件
 */
function initPoolEvents() {
  // 对比全部
  const compareBtn = document.getElementById('compare-all-btn');
  if (compareBtn) {
    compareBtn.addEventListener('click', handleCompareAll);
  }

  // 导出报告
  const exportBtn = document.getElementById('export-report-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExportReport);
  }

  // 进入下一步
  const nextBtn = document.getElementById('next-step-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', handleNextStep);
  }
}

/**
 * 初始化侧边栏切换（响应式）
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggleBtn && sidebar && overlay) {
    // 打开侧边栏
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    });

    // 关闭侧边栏
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      }
    });
  }
}

/**
 * 监听候选池变化事件
 */
function initPoolChangeListeners() {
  window.addEventListener('opportunity-added', () => {
    updateOpportunityPoolUI();
  });

  window.addEventListener('opportunity-removed', () => {
    updateOpportunityPoolUI();
  });

  window.addEventListener('opportunity-pool-cleared', () => {
    updateOpportunityPoolUI();
  });
}

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('AI选品助手 - 主框架初始化');

    // 从 localStorage 恢复候选池
    const pool = AppStorage.getOpportunityPool();
    window.AppState.opportunityPool = pool;

    // 从 localStorage 恢复用户偏好
    const preferences = AppStorage.getUserPreferences();
    window.AppState.userPreferences = preferences;

    // 初始化事件监听
    initTabEvents();
    initPoolEvents();
    initSidebarToggle();
    initPoolChangeListeners();

    // 更新候选池 UI
    updateOpportunityPoolUI();

    // 默认加载 Step 1
    await loadStepModule(1);

    console.log('主框架初始化完成');
  } catch (error) {
    console.error('主框架初始化失败:', error);
    Utils.showErrorMessage('系统初始化失败，请刷新页面重试');
  }
});

/**
 * 页面卸载前清理
 */
window.addEventListener('beforeunload', () => {
  // 保存状态到 localStorage（已由 storage.js 自动处理）
  console.log('页面卸载，状态已保存');
});
