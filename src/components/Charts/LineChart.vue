<template>
  <div class="line-chart-container">
    <div ref="chartRef" class="chart-element"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    xAxisData: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: [String, Array],
      default: '#667eea'
    },
    smooth: {
      type: Boolean,
      default: true
    },
    showArea: {
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number],
      default: '100%'
    }
  },
  setup(props) {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const resizeObserver = ref(null)

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) return
      
      chartInstance.value = echarts.init(chartRef.value)
      
      const option = {
        title: {
          text: props.title,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            color: '#666'
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'transparent',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: '#666'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#666'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [
          {
            name: '数值',
            type: 'line',
            data: props.data,
            smooth: props.smooth,
            lineStyle: {
              width: 3,
              color: Array.isArray(props.color) ? 
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: props.color[0] },
                  { offset: 1, color: props.color[1] }
                ]) : props.color
            },
            itemStyle: {
              color: Array.isArray(props.color) ? props.color[0] : props.color,
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: props.showArea ? {
              color: Array.isArray(props.color) ? 
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: props.color[0] + '40' },
                  { offset: 1, color: props.color[1] + '10' }
                ]) : 
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: props.color + '40' },
                  { offset: 1, color: props.color + '10' }
                ])
            } : null,
            emphasis: {
              itemStyle: {
                color: Array.isArray(props.color) ? props.color[0] : props.color,
                borderWidth: 4,
                borderColor: '#fff',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: false,
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut'
          }
        ]
      }
      
      chartInstance.value.setOption(option)
    }

    // 更新图表
    const updateChart = () => {
      if (!chartInstance.value) return
      
      const option = {
        xAxis: {
          data: props.xAxisData
        },
        series: [
          {
            data: props.data
          }
        ]
      }
      
      chartInstance.value.setOption(option)
    }

    // 处理窗口大小变化
    const handleResize = () => {
      if (chartInstance.value) {
        chartInstance.value.resize()
      }
    }

    // 监听数据变化
    watch(() => [props.data, props.xAxisData], () => {
      nextTick(() => {
        updateChart()
      })
    }, { deep: true })

    // 监听颜色变化
    watch(() => [props.color, props.smooth, props.showArea], () => {
      if (chartInstance.value) {
        chartInstance.value.dispose()
        initChart()
      }
    })

    onMounted(() => {
      nextTick(() => {
        initChart()
        
        // 监听窗口大小变化
        window.addEventListener('resize', handleResize)
        
        // 使用ResizeObserver监听容器大小变化
        if (window.ResizeObserver) {
          resizeObserver.value = new ResizeObserver(handleResize)
          resizeObserver.value.observe(chartRef.value)
        }
      })
    })

    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }
      
      window.removeEventListener('resize', handleResize)
      
      if (resizeObserver.value) {
        resizeObserver.value.disconnect()
      }
    })

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.chart-element {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

@media (max-width: 768px) {
  .line-chart-container {
    min-height: 250px;
  }
  
  .chart-element {
    min-height: 250px;
  }
}

@media (max-width: 576px) {
  .line-chart-container {
    min-height: 200px;
  }
  
  .chart-element {
    min-height: 200px;
  }
}
</style> 