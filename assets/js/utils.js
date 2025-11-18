/**
 * Utils - 工具函数库
 * 项目：AI选品助手
 * 更新时间：2025-11-18
 */

const Utils = {
  /**
   * 数字格式化 - 将大数字转为 K/M/B 格式
   * @param {number} num - 要格式化的数字
   * @param {number} digits - 小数位数，默认 1
   * @returns {string} 格式化后的字符串
   * @example
   * formatNumber(58000000) // "58.0M"
   * formatNumber(1250) // "1.3K"
   */
  formatNumber(num, digits = 1) {
    if (num === null || num === undefined) return '-';

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 1e9) {
      return sign + (absNum / 1e9).toFixed(digits) + 'B';
    }
    if (absNum >= 1e6) {
      return sign + (absNum / 1e6).toFixed(digits) + 'M';
    }
    if (absNum >= 1e3) {
      return sign + (absNum / 1e3).toFixed(digits) + 'K';
    }
    return sign + absNum.toFixed(digits);
  },

  /**
   * 货币格式化 - 添加美元符号和千分位
   * @param {number} num - 金额
   * @param {boolean} withCents - 是否显示美分，默认 false
   * @returns {string} 格式化后的货币字符串
   * @example
   * formatCurrency(58000000) // "$58.0M"
   * formatCurrency(19.99, true) // "$19.99"
   */
  formatCurrency(num, withCents = false) {
    if (num === null || num === undefined) return '-';

    const absNum = Math.abs(num);
    if (absNum >= 1e6) {
      return '$' + this.formatNumber(num);
    }

    return '$' + num.toLocaleString('en-US', {
      minimumFractionDigits: withCents ? 2 : 0,
      maximumFractionDigits: withCents ? 2 : 0
    });
  },

  /**
   * 百分比格式化
   * @param {number} num - 数字 (0.185 或 185)
   * @param {boolean} isDecimal - 是否是小数形式 (0.185)，默认 false
   * @param {number} digits - 小数位数，默认 1
   * @returns {string} 格式化后的百分比字符串
   * @example
   * formatPercent(185) // "185.0%"
   * formatPercent(0.185, true) // "18.5%"
   */
  formatPercent(num, isDecimal = false, digits = 1) {
    if (num === null || num === undefined) return '-';

    const value = isDecimal ? num * 100 : num;
    return value.toFixed(digits) + '%';
  },

  /**
   * 日期格式化
   * @param {Date|string|number} date - 日期对象或时间戳
   * @param {string} format - 格式，默认 'YYYY-MM-DD'
   * @returns {string} 格式化后的日期字符串
   * @example
   * formatDate(new Date()) // "2025-11-18"
   * formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 防抖后的函数
   * @example
   * const debouncedSearch = debounce(search, 500);
   * input.addEventListener('input', debouncedSearch);
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要执行的函数
   * @param {number} delay - 时间间隔（毫秒）
   * @returns {Function} 节流后的函数
   * @example
   * const throttledScroll = throttle(handleScroll, 100);
   * window.addEventListener('scroll', throttledScroll);
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  },

  /**
   * 根据评分返回颜色类名
   * @param {number} score - 评分 (0-100)
   * @returns {string} 颜色类名
   * @example
   * getScoreColor(95) // "score-excellent"
   * getScoreColor(75) // "score-fair"
   */
  getScoreColor(score) {
    if (score === null || score === undefined) return 'score-poor';

    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-fair';
    return 'score-poor';
  },

  /**
   * 根据评分返回等级文本
   * @param {number} score - 评分 (0-100)
   * @returns {string} 等级文本
   * @example
   * getScoreLevel(95) // "顶级机会"
   * getScoreLevel(75) // "中等机会"
   */
  getScoreLevel(score) {
    if (score === null || score === undefined) return '未评分';

    if (score >= 90) return '顶级机会';
    if (score >= 80) return '优质机会';
    if (score >= 70) return '中等机会';
    if (score >= 60) return '一般机会';
    return '谨慎进入';
  },

  /**
   * 数组排序
   * @param {Array} array - 要排序的数组
   * @param {string} key - 排序字段
   * @param {string} order - 排序方式 'asc' 或 'desc'，默认 'asc'
   * @returns {Array} 排序后的数组（新数组）
   * @example
   * sortByKey(combinations, 'mcda_score', 'desc')
   */
  sortByKey(array, key, order = 'asc') {
    if (!Array.isArray(array)) return [];

    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  },

  /**
   * 深拷贝对象
   * @param {any} obj - 要拷贝的对象
   * @returns {any} 拷贝后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 生成唯一 ID
   * @param {string} prefix - ID 前缀
   * @returns {string} 唯一 ID
   * @example
   * generateId('combo') // "combo_1637654321234_abc"
   */
  generateId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  },

  /**
   * 获取 URL 参数
   * @param {string} key - 参数名
   * @returns {string|null} 参数值
   */
  getUrlParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  /**
   * 显示成功提示（使用 Bootstrap Toast）
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长（毫秒），默认 3000
   */
  showSuccessMessage(message, duration = 3000) {
    this.showToast(message, 'success', duration);
  },

  /**
   * 显示错误提示
   * @param {string} message - 错误消息
   * @param {number} duration - 显示时长（毫秒），默认 5000
   */
  showErrorMessage(message, duration = 5000) {
    this.showToast(message, 'danger', duration);
  },

  /**
   * 显示警告提示
   * @param {string} message - 警告消息
   * @param {number} duration - 显示时长（毫秒），默认 4000
   */
  showWarningMessage(message, duration = 4000) {
    this.showToast(message, 'warning', duration);
  },

  /**
   * 显示信息提示
   * @param {string} message - 信息消息
   * @param {number} duration - 显示时长（毫秒），默认 3000
   */
  showInfoMessage(message, duration = 3000) {
    this.showToast(message, 'info', duration);
  },

  /**
   * 通用 Toast 显示函数
   * @param {string} message - 消息内容
   * @param {string} type - 类型 ('success', 'danger', 'warning', 'info')
   * @param {number} duration - 显示时长（毫秒）
   */
  showToast(message, type = 'info', duration = 3000) {
    // 创建 Toast 容器（如果不存在）
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = 9999;
      document.body.appendChild(container);
    }

    // 创建 Toast
    const toastId = this.generateId('toast');
    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);

    // 使用 Bootstrap Toast
    const toast = new bootstrap.Toast(toastEl, {
      autohide: true,
      delay: duration
    });
    toast.show();

    // 移除 Toast 元素
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  },

  /**
   * 显示全屏加载动画
   */
  showLoading() {
    // 如果已存在，不重复创建
    if (document.getElementById('loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner spinner-lg"></div>';
    document.body.appendChild(overlay);
  },

  /**
   * 隐藏全屏加载动画
   */
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  },

  /**
   * 异步加载 JSON 数据
   * @param {string} url - JSON 文件路径
   * @returns {Promise<any>} 数据对象
   */
  async loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to load JSON from ${url}:`, error);
      throw error;
    }
  },

  /**
   * 数组分页
   * @param {Array} array - 原数组
   * @param {number} page - 页码（从 1 开始）
   * @param {number} pageSize - 每页数量
   * @returns {Array} 当前页数据
   */
  paginate(array, page, pageSize) {
    if (!Array.isArray(array)) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return array.slice(start, end);
  },

  /**
   * 计算总页数
   * @param {number} total - 总数量
   * @param {number} pageSize - 每页数量
   * @returns {number} 总页数
   */
  getTotalPages(total, pageSize) {
    return Math.ceil(total / pageSize);
  }
};

// 兼容 CommonJS 和浏览器环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}

// 浏览器环境导出到 window
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}
