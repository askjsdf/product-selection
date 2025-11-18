/**
 * Storage - 候选池存储管理
 * 项目：AI选品助手
 * 更新时间：2025-11-18
 */

const AppStorage = {
  // LocalStorage 键名
  KEYS: {
    OPPORTUNITY_POOL: 'ai_selection_opportunity_pool',
    PRODUCT_POOL: 'ai_selection_product_pool',
    SELECTED_PRODUCTS: 'ai_selection_selected_products',
    USER_PREFERENCES: 'ai_selection_user_preferences'
  },

  // 候选池最大容量
  MAX_POOL_SIZE: 5,

  /* ========================================================================
     机会候选池操作（Step 1 → Step 2）
     ======================================================================== */

  /**
   * 添加到机会候选池
   * @param {Object} combination - 组合数据
   * @returns {Object} { success: boolean, message: string, pool: Array }
   */
  addToOpportunityPool(combination) {
    try {
      const pool = this.getOpportunityPool();

      // 检查是否已存在
      const exists = pool.some(item => item.id === combination.id);
      if (exists) {
        return {
          success: false,
          message: '该组合已在候选池中',
          pool
        };
      }

      // 检查是否超过最大容量
      if (pool.length >= this.MAX_POOL_SIZE) {
        return {
          success: false,
          message: `候选池已满（最多 ${this.MAX_POOL_SIZE} 个）`,
          pool
        };
      }

      // 添加时间戳
      const item = {
        ...combination,
        addedAt: Date.now()
      };

      pool.push(item);
      this.saveToLocalStorage(this.KEYS.OPPORTUNITY_POOL, pool);

      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('opportunity-added', {
        detail: { combination: item, pool }
      }));

      return {
        success: true,
        message: '已添加到机会候选池',
        pool
      };
    } catch (error) {
      console.error('Failed to add to opportunity pool:', error);
      return {
        success: false,
        message: '添加失败，请重试',
        pool: []
      };
    }
  },

  /**
   * 从机会候选池移除
   * @param {string} combinationId - 组合 ID
   * @returns {Object} { success: boolean, message: string, pool: Array }
   */
  removeFromOpportunityPool(combinationId) {
    try {
      const pool = this.getOpportunityPool();
      const newPool = pool.filter(item => item.id !== combinationId);

      if (newPool.length === pool.length) {
        return {
          success: false,
          message: '未找到该组合',
          pool
        };
      }

      this.saveToLocalStorage(this.KEYS.OPPORTUNITY_POOL, newPool);

      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('opportunity-removed', {
        detail: { combinationId, pool: newPool }
      }));

      return {
        success: true,
        message: '已从候选池移除',
        pool: newPool
      };
    } catch (error) {
      console.error('Failed to remove from opportunity pool:', error);
      return {
        success: false,
        message: '移除失败，请重试',
        pool: []
      };
    }
  },

  /**
   * 获取机会候选池
   * @returns {Array} 候选池数组
   */
  getOpportunityPool() {
    return this.loadFromLocalStorage(this.KEYS.OPPORTUNITY_POOL) || [];
  },

  /**
   * 清空机会候选池
   * @returns {boolean} 是否成功
   */
  clearOpportunityPool() {
    try {
      this.saveToLocalStorage(this.KEYS.OPPORTUNITY_POOL, []);

      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('opportunity-pool-cleared'));

      return true;
    } catch (error) {
      console.error('Failed to clear opportunity pool:', error);
      return false;
    }
  },

  /* ========================================================================
     产品候选池操作（Step 3 → Step 4）
     ======================================================================== */

  /**
   * 添加到产品候选池
   * @param {Object} product - 产品数据
   * @returns {Object} { success: boolean, message: string, pool: Array }
   */
  addToProductPool(product) {
    try {
      const pool = this.getProductPool();

      const exists = pool.some(item => item.id === product.id);
      if (exists) {
        return {
          success: false,
          message: '该产品已在候选池中',
          pool
        };
      }

      if (pool.length >= 10) { // 产品候选池最多 10 个
        return {
          success: false,
          message: '产品候选池已满（最多 10 个）',
          pool
        };
      }

      const item = {
        ...product,
        addedAt: Date.now()
      };

      pool.push(item);
      this.saveToLocalStorage(this.KEYS.PRODUCT_POOL, pool);

      window.dispatchEvent(new CustomEvent('product-added', {
        detail: { product: item, pool }
      }));

      return {
        success: true,
        message: '已添加到产品候选池',
        pool
      };
    } catch (error) {
      console.error('Failed to add to product pool:', error);
      return {
        success: false,
        message: '添加失败，请重试',
        pool: []
      };
    }
  },

  /**
   * 从产品候选池移除
   * @param {string} productId - 产品 ID
   * @returns {Object} { success: boolean, message: string, pool: Array }
   */
  removeFromProductPool(productId) {
    try {
      const pool = this.getProductPool();
      const newPool = pool.filter(item => item.id !== productId);

      if (newPool.length === pool.length) {
        return {
          success: false,
          message: '未找到该产品',
          pool
        };
      }

      this.saveToLocalStorage(this.KEYS.PRODUCT_POOL, newPool);

      window.dispatchEvent(new CustomEvent('product-removed', {
        detail: { productId, pool: newPool }
      }));

      return {
        success: true,
        message: '已从候选池移除',
        pool: newPool
      };
    } catch (error) {
      console.error('Failed to remove from product pool:', error);
      return {
        success: false,
        message: '移除失败，请重试',
        pool: []
      };
    }
  },

  /**
   * 获取产品候选池
   * @returns {Array} 候选池数组
   */
  getProductPool() {
    return this.loadFromLocalStorage(this.KEYS.PRODUCT_POOL) || [];
  },

  /**
   * 清空产品候选池
   * @returns {boolean} 是否成功
   */
  clearProductPool() {
    try {
      this.saveToLocalStorage(this.KEYS.PRODUCT_POOL, []);
      window.dispatchEvent(new CustomEvent('product-pool-cleared'));
      return true;
    } catch (error) {
      console.error('Failed to clear product pool:', error);
      return false;
    }
  },

  /* ========================================================================
     精选产品操作（Step 4 → Step 5）
     ======================================================================== */

  /**
   * 添加到精选产品清单
   * @param {Object} product - 产品数据
   * @returns {Object} { success: boolean, message: string, products: Array }
   */
  addToSelectedProducts(product) {
    try {
      const products = this.getSelectedProducts();

      const exists = products.some(item => item.id === product.id);
      if (exists) {
        return {
          success: false,
          message: '该产品已在精选清单中',
          products
        };
      }

      if (products.length >= 3) { // 精选产品最多 3 个
        return {
          success: false,
          message: '精选清单已满（最多 3 个）',
          products
        };
      }

      const item = {
        ...product,
        selectedAt: Date.now()
      };

      products.push(item);
      this.saveToLocalStorage(this.KEYS.SELECTED_PRODUCTS, products);

      return {
        success: true,
        message: '已添加到精选清单',
        products
      };
    } catch (error) {
      console.error('Failed to add to selected products:', error);
      return {
        success: false,
        message: '添加失败，请重试',
        products: []
      };
    }
  },

  /**
   * 获取精选产品清单
   * @returns {Array} 精选产品数组
   */
  getSelectedProducts() {
    return this.loadFromLocalStorage(this.KEYS.SELECTED_PRODUCTS) || [];
  },

  /**
   * 清空精选产品清单
   * @returns {boolean} 是否成功
   */
  clearSelectedProducts() {
    try {
      this.saveToLocalStorage(this.KEYS.SELECTED_PRODUCTS, []);
      return true;
    } catch (error) {
      console.error('Failed to clear selected products:', error);
      return false;
    }
  },

  /* ========================================================================
     用户偏好设置
     ======================================================================== */

  /**
   * 保存用户偏好
   * @param {Object} preferences - 偏好对象
   * @returns {boolean} 是否成功
   */
  saveUserPreferences(preferences) {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences };
      this.saveToLocalStorage(this.KEYS.USER_PREFERENCES, updated);
      return true;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      return false;
    }
  },

  /**
   * 获取用户偏好
   * @returns {Object} 偏好对象
   */
  getUserPreferences() {
    return this.loadFromLocalStorage(this.KEYS.USER_PREFERENCES) || {
      weights: { MA: 25, CF: 20, PP: 30, RF: 15, RC: 10 },
      strategyMode: '综合最优'
    };
  },

  /* ========================================================================
     LocalStorage 底层操作
     ======================================================================== */

  /**
   * 保存到 LocalStorage
   * @param {string} key - 键名
   * @param {any} data - 数据
   * @returns {boolean} 是否成功
   */
  saveToLocalStorage(key, data) {
    try {
      const jsonStr = JSON.stringify(data);
      localStorage.setItem(key, jsonStr);
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * 从 LocalStorage 加载
   * @param {string} key - 键名
   * @returns {any|null} 数据对象或 null
   */
  loadFromLocalStorage(key) {
    try {
      const jsonStr = localStorage.getItem(key);
      if (!jsonStr) return null;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error(`Failed to load from localStorage (${key}):`, error);
      return null;
    }
  },

  /**
   * 清空所有存储
   * @returns {boolean} 是否成功
   */
  clearAll() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear all storage:', error);
      return false;
    }
  }
};

// 兼容 CommonJS 和浏览器环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppStorage;
}

// 浏览器环境导出到 window
if (typeof window !== 'undefined') {
  window.AppStorage = AppStorage;
}
