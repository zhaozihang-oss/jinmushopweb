# DateRangeFilter 日期范围筛选组件

一个功能完整、响应式的日期范围筛选公共组件，支持桌面端和移动端自适应。

## 特性

- ✅ **响应式设计**: 自动适配桌面端和移动端
- ✅ **双向数据绑定**: 支持 `v-model` 语法糖
- ✅ **多种触发模式**: 手动筛选 / 自动筛选
- ✅ **高度可定制**: 支持自定义标签、按钮文本、主题色
- ✅ **完整事件系统**: 提供丰富的事件回调
- ✅ **Material Design风格**: 现代化的UI设计

## 基础用法

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <DateRangeFilter 
      v-model:start-date="startDate"
      v-model:end-date="endDate"
      @filter="handleFilter"
      @reset="handleReset"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import DateRangeFilter from '@/components/DateRangeFilter.vue'

export default {
  components: {
    DateRangeFilter
  },
  setup() {
    const startDate = ref('')
    const endDate = ref('')
    
    const handleFilter = (filterData) => {
      console.log('筛选数据:', filterData)
      // filterData = { startDate: '2023-01-01', endDate: '2023-12-31' }
    }
    
    const handleReset = (resetData) => {
      console.log('重置数据:', resetData)
      // resetData = { startDate: '', endDate: '' }
    }
    
    return {
      startDate,
      endDate,
      handleFilter,
      handleReset
    }
  }
}
</script>
```

## 高级用法

```vue
<template>
  <div>
    <!-- 自定义配置 -->
    <DateRangeFilter 
      v-model:start-date="startDate"
      v-model:end-date="endDate"
      start-label="开始日期"
      end-label="结束日期"
      filter-text="筛选"
      reset-text="清空"
      primary-color="#007bff"
      :auto-filter="true"
      @filter="handleFilter"
      @reset="handleReset"
      @change="handleChange"
    />
  </div>
</template>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `startDate` | String | `''` | 开始日期值 (支持 v-model) |
| `endDate` | String | `''` | 结束日期值 (支持 v-model) |
| `startLabel` | String | `'Start date'` | 开始日期标签文本 |
| `endLabel` | String | `'End date'` | 结束日期标签文本 |
| `startPlaceholder` | String | `'Start date'` | 开始日期占位符 |
| `endPlaceholder` | String | `'End date'` | 结束日期占位符 |
| `filterText` | String | `'Filter'` | 筛选按钮文本 |
| `resetText` | String | `'Reset'` | 重置按钮文本 |
| `autoFilter` | Boolean | `false` | 是否自动触发筛选 |
| `primaryColor` | String | `'#28a745'` | 主题色 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:startDate` | `(value: string)` | 开始日期更新事件 |
| `update:endDate` | `(value: string)` | 结束日期更新事件 |
| `filter` | `({ startDate, endDate })` | 点击筛选按钮触发 |
| `reset` | `({ startDate: '', endDate: '' })` | 点击重置按钮触发 |
| `change` | `({ startDate, endDate })` | 日期值改变时触发 |

## 使用场景示例

### 1. 数据列表筛选

```vue
<template>
  <div>
    <!-- 日期筛选器 -->
    <DateRangeFilter 
      v-model:start-date="filterParams.startDate"
      v-model:end-date="filterParams.endDate"
      @filter="loadData"
      @reset="resetAndLoad"
    />
    
    <!-- 数据表格 -->
    <table>
      <tr v-for="item in dataList" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.date }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  setup() {
    const filterParams = reactive({
      startDate: '',
      endDate: ''
    })
    
    const loadData = async () => {
      // 根据日期范围加载数据
      const response = await api.getData(filterParams)
      dataList.value = response.data
    }
    
    const resetAndLoad = () => {
      // 重置后重新加载数据
      loadData()
    }
    
    return {
      filterParams,
      loadData,
      resetAndLoad
    }
  }
}
</script>
```

### 2. 自动筛选模式

```vue
<template>
  <DateRangeFilter 
    v-model:start-date="startDate"
    v-model:end-date="endDate"
    :auto-filter="true"
    @filter="handleAutoFilter"
  />
</template>

<script>
export default {
  setup() {
    // 当日期改变时自动触发筛选
    const handleAutoFilter = (filterData) => {
      console.log('自动筛选:', filterData)
      // 执行筛选逻辑
    }
    
    return {
      handleAutoFilter
    }
  }
}
</script>
```

### 3. 自定义主题

```vue
<template>
  <div>
    <!-- 蓝色主题 -->
    <DateRangeFilter 
      primary-color="#007bff"
      start-label="起始时间"
      end-label="结束时间"
      filter-text="查询"
      reset-text="重置"
    />
    
    <!-- 红色主题 -->
    <DateRangeFilter 
      primary-color="#dc3545"
      start-label="From"
      end-label="To"
    />
  </div>
</template>
```

## 样式自定义

组件支持通过CSS变量自定义样式：

```css
.date-range-filter {
  --primary-color: #007bff;
  --primary-color-rgb: 0, 123, 255;
}
```

## 注意事项

1. **日期格式**: 组件使用HTML5原生日期输入，返回格式为 `YYYY-MM-DD`
2. **浏览器兼容性**: 支持所有现代浏览器，IE需要polyfill
3. **移动端优化**: 在移动设备上会自动切换到移动端样式
4. **响应式**: 组件会自动监听窗口大小变化并调整布局

## 更新日志

- **v1.0.0**: 初始版本，支持基础日期筛选功能
- 支持双向数据绑定
- 支持响应式设计
- 支持自定义主题色
- 支持多种事件回调 