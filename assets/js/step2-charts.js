/**
 * Step 2 品类洞察 - ECharts图表配置
 * 项目：AI选品助手
 * 更新时间：2025-11-19
 */

window.Step2Charts = {

  // ========== 深色主题配置 ==========
  darkTheme: {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e4e4e7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    tooltip: {
      backgroundColor: 'rgba(24, 24, 27, 0.95)',
      borderColor: '#3f3f46',
      borderWidth: 1,
      textStyle: { color: '#e4e4e7' },
      padding: 12,
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);'
    },
    legend: {
      textStyle: { color: '#e4e4e7' }
    }
  },

  // ========== 颜色方案 ==========
  colors: {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#a855f7',
    cyan: '#06b6d4',
    pink: '#ec4899',
    gradient: [
      '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444',
      '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'
    ]
  },

  /**
   * 饼图配置
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {Array} params.data - 数据数组 [{name, value}]
   * @param {string} params.radius - 半径 (默认'60%')
   */
  getPieChartOption({ title = '', data = [], radius = '60%' }) {
    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        ...this.darkTheme.tooltip,
        trigger: 'item',
        formatter: '{b}: {c}% <br/>GMV: {d}'
      },
      legend: {
        orient: 'vertical',
        right: 20,
        top: 'center',
        textStyle: { color: '#e4e4e7' },
        itemGap: 12
      },
      color: this.colors.gradient,
      series: [{
        type: 'pie',
        radius: radius,
        center: ['40%', '55%'],
        data: data,
        label: {
          color: '#e4e4e7',
          fontSize: 12
        },
        labelLine: {
          lineStyle: { color: '#3f3f46' }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.6)'
          }
        }
      }]
    };
  },

  /**
   * 折线图配置
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {Array} params.xData - X轴数据
   * @param {Array} params.yData - Y轴数据
   * @param {string} params.yAxisName - Y轴名称
   * @param {boolean} params.showArea - 是否显示面积图
   */
  getLineChartOption({
    title = '',
    xData = [],
    yData = [],
    yAxisName = 'GMV (Billion $)',
    showArea = true
  }) {
    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        ...this.darkTheme.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: { color: '#3f3f46' }
        }
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: {
          lineStyle: { color: '#3f3f46' }
        },
        axisLabel: {
          color: '#a1a1aa',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameTextStyle: {
          color: '#a1a1aa',
          fontSize: 12
        },
        axisLine: {
          lineStyle: { color: '#3f3f46' }
        },
        axisLabel: {
          color: '#a1a1aa',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#27272a',
            type: 'dashed'
          }
        }
      },
      series: [{
        data: yData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: this.colors.primary,
          borderWidth: 2,
          borderColor: '#fff'
        },
        lineStyle: {
          width: 3
        },
        areaStyle: showArea ? {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        } : null
      }]
    };
  },

  /**
   * 雷达图配置
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {Array} params.indicator - 雷达指标 [{name, max}]
   * @param {Array} params.series - 数据系列 [{name, value: []}]
   */
  getRadarChartOption({
    title = '',
    indicator = [],
    series = []
  }) {
    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        ...this.darkTheme.tooltip,
        trigger: 'item'
      },
      legend: {
        bottom: 15,
        left: 'center',
        textStyle: { color: '#e4e4e7' },
        itemGap: 20
      },
      color: this.colors.gradient,
      radar: {
        indicator: indicator,
        center: ['50%', '55%'],
        radius: '65%',
        splitArea: {
          areaStyle: {
            color: [
              'rgba(59, 130, 246, 0.05)',
              'rgba(59, 130, 246, 0.1)',
              'rgba(59, 130, 246, 0.05)'
            ]
          }
        },
        axisLine: {
          lineStyle: { color: '#3f3f46' }
        },
        splitLine: {
          lineStyle: { color: '#3f3f46' }
        },
        axisName: {
          color: '#e4e4e7',
          fontSize: 13,
          fontWeight: 500
        }
      },
      series: [{
        type: 'radar',
        data: series.map((item, index) => ({
          name: item.name,
          value: item.value,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            lineStyle: {
              width: 3
            },
            areaStyle: {
              opacity: 0.5
            }
          }
        }))
      }]
    };
  },

  /**
   * 柱状图配置
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {Array} params.xData - X轴数据
   * @param {Array} params.series - 数据系列 [{name, data}]
   * @param {boolean} params.horizontal - 是否横向显示
   */
  getBarChartOption({
    title = '',
    xData = [],
    series = [],
    horizontal = false
  }) {
    const axisConfig = {
      axisLine: { lineStyle: { color: '#3f3f46' } },
      axisLabel: { color: '#a1a1aa', fontSize: 12 },
      splitLine: { lineStyle: { color: '#27272a', type: 'dashed' } }
    };

    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        ...this.darkTheme.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: 45,
        textStyle: { color: '#e4e4e7' }
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '10%',
        top: series.length > 1 ? '20%' : '15%'
      },
      color: this.colors.gradient,
      xAxis: horizontal ? {
        type: 'value',
        ...axisConfig
      } : {
        type: 'category',
        data: xData,
        ...axisConfig
      },
      yAxis: horizontal ? {
        type: 'category',
        data: xData,
        ...axisConfig
      } : {
        type: 'value',
        ...axisConfig
      },
      series: series.map(item => ({
        name: item.name,
        type: 'bar',
        data: item.data,
        barMaxWidth: 40,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }))
    };
  },

  /**
   * 散点图配置 (用于SPAN矩阵)
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {Array} params.data - 数据点 [{name, value: [x, y]}]
   * @param {string} params.xAxisName - X轴名称
   * @param {string} params.yAxisName - Y轴名称
   */
  getScatterChartOption({
    title = '',
    data = [],
    xAxisName = 'X轴',
    yAxisName = 'Y轴'
  }) {
    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        ...this.darkTheme.tooltip,
        trigger: 'item',
        formatter: params => {
          const [x, y] = params.value;
          return `${params.name}<br/>
                  ${xAxisName}: ${x}<br/>
                  ${yAxisName}: ${y}`;
        }
      },
      grid: {
        left: '12%',
        right: '8%',
        bottom: '15%',
        top: '15%'
      },
      xAxis: {
        type: 'value',
        name: xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#e4e4e7',
          fontSize: 13,
          fontWeight: 500
        },
        min: 0,
        max: 100,
        interval: 20,
        axisLine: { lineStyle: { color: '#3f3f46' } },
        axisLabel: { color: '#a1a1aa', fontSize: 12 },
        splitLine: {
          lineStyle: { color: '#27272a', type: 'dashed' }
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          color: '#e4e4e7',
          fontSize: 13,
          fontWeight: 500
        },
        min: 0,
        max: 100,
        interval: 20,
        axisLine: { lineStyle: { color: '#3f3f46' } },
        axisLabel: { color: '#a1a1aa', fontSize: 12 },
        splitLine: {
          lineStyle: { color: '#27272a', type: 'dashed' }
        }
      },
      series: [{
        type: 'scatter',
        symbolSize: 20,
        data: data,
        itemStyle: {
          color: this.colors.primary,
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 10,
          shadowColor: 'rgba(59, 130, 246, 0.5)'
        },
        emphasis: {
          itemStyle: {
            symbolSize: 25,
            shadowBlur: 15
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#e4e4e7',
          fontSize: 12,
          formatter: params => params.name
        }
      }]
    };
  },

  /**
   * 仪表盘配置
   * @param {Object} params - 配置参数
   * @param {string} params.title - 图表标题
   * @param {number} params.value - 当前值
   * @param {number} params.max - 最大值
   * @param {string} params.unit - 单位
   */
  getGaugeChartOption({
    title = '',
    value = 0,
    max = 100,
    unit = '分'
  }) {
    return {
      ...this.darkTheme,
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e4e4e7',
          fontSize: 16,
          fontWeight: 600
        }
      },
      series: [{
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '75%',
        min: 0,
        max: max,
        splitNumber: 5,
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: this.colors.danger },
                { offset: 0.5, color: this.colors.warning },
                { offset: 1, color: this.colors.success }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#27272a']]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 2,
            color: '#3f3f46'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#a1a1aa',
          fontSize: 11
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            borderWidth: 8,
            borderColor: this.colors.primary
          }
        },
        pointer: {
          length: '60%',
          width: 6,
          itemStyle: {
            color: this.colors.primary
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: 700,
          color: '#e4e4e7',
          offsetCenter: [0, '75%'],
          formatter: `{value}${unit}`
        },
        data: [{ value: value }]
      }]
    };
  }
};
