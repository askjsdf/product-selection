/**
 * Step 4: 成本核算与利润验证
 * 基于 GECOM 全球电商成本优化方法论 (M1-M8)
 *
 * 注意：本版本仅包含前端展示，不实现复杂计算逻辑
 */

console.log('Step 4: GECOM 成本核算模块已加载');

// ========================================
// 页面加载时初始化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('step4-container')) {
    initStep4();
  }
});

function initStep4() {
  console.log('初始化 Step 4...');

  // 初始化 ECharts 图表
  initCostPieChart();
  initProfitTrendChart();

  console.log('Step 4 初始化完成');
}

// ========================================
// ECharts 图表初始化
// ========================================

/**
 * 成本结构饼图
 */
function initCostPieChart() {
  const chartDom = document.getElementById('cost-pie-chart');
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff' },
      formatter: '{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#b0b0b0' },
      top: 'middle'
    },
    series: [{
      name: '运营成本',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        color: '#fff',
        formatter: '{b}\n${c}',
        fontSize: 11
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        lineStyle: { color: '#666' }
      },
      data: [
        {
          value: 19700,
          name: 'M4 商品成本与税费',
          itemStyle: { color: '#f44336' }
        },
        {
          value: 4350,
          name: 'M5 履约执行与物流',
          itemStyle: { color: '#ff9800' }
        },
        {
          value: 9000,
          name: 'M6 营销与获客',
          itemStyle: { color: '#ffc107' }
        },
        {
          value: 6800,
          name: 'M7 渠道使用与交易',
          itemStyle: { color: '#4caf50' }
        },
        {
          value: 11200,
          name: 'M8 综合运营与维护',
          itemStyle: { color: '#2196f3' }
        }
      ]
    }]
  };

  myChart.setOption(option);

  // 响应式
  window.addEventListener('resize', function() {
    myChart.resize();
  });
}

/**
 * 利润趋势折线图
 */
function initProfitTrendChart() {
  const chartDom = document.getElementById('profit-trend-chart');
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  // 模拟数据
  const months = 6;
  const monthlyRevenue = 47490;
  const monthlyOpex = 51050;
  const capex = 52250;

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
      },
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>';
        params.forEach(item => {
          result += item.marker + ' ' + item.seriesName + ': $' +
                   item.value.toLocaleString() + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: ['累计收入', '累计成本', '累计利润'],
      textStyle: { color: '#b0b0b0' },
      top: 0
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
        },
        smooth: true
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
        },
        smooth: true
      },
      {
        name: '累计利润',
        type: 'line',
        data: profitData,
        itemStyle: { color: '#ff9800' },
        lineStyle: { width: 3 },
        smooth: true
      }
    ]
  };

  myChart.setOption(option);

  // 响应式
  window.addEventListener('resize', function() {
    myChart.resize();
  });
}

// ========================================
// Tab 切换时重新渲染图表
// ========================================
document.addEventListener('shown.bs.tab', function(event) {
  if (event.target.getAttribute('data-bs-target') === '#profit-panel') {
    // 延迟渲染，确保容器已显示
    setTimeout(() => {
      initCostPieChart();
      initProfitTrendChart();
    }, 100);
  }
});

console.log('Step 4 JavaScript 加载完成');
