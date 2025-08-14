# 金木后台管理系统

基于Vue 3 + MDBootstrap打造的现代化后台管理系统，支持多语言（中文、英语、印尼语）和响应式设计。

## ✨ 特性

- 🌍 **多语言支持** - 内置中文、英语、印尼语
- 📱 **响应式设计** - 完美适配PC端和移动端H5
- 🎨 **现代化UI** - 基于MDBootstrap设计，界面美观
- 🔧 **模块化管理** - 用户、产品、订单等完整功能模块
- 🔐 **权限控制** - 登录验证和路由守卫
- 📊 **数据可视化** - 仪表板统计和图表展示
- ⚡ **高性能** - 基于Vue 3 Composition API
- 🛠️ **易于扩展** - 清晰的代码结构和组件化设计

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📋 项目结构

```
jinmu-admin-dashboard/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   └── scss/          # 样式文件
│   ├── components/        # 公共组件
│   ├── i18n/             # 国际化配置
│   ├── router/           # 路由配置
│   ├── views/            # 页面组件
│   │   ├── Layout/       # 布局组件
│   │   ├── Login/        # 登录页面
│   │   ├── Dashboard/    # 仪表板
│   │   ├── Users/        # 用户管理
│   │   ├── Products/     # 产品管理
│   │   ├── Orders/       # 订单管理
│   │   └── Settings/     # 系统设置
│   ├── App.vue           # 主应用组件
│   └── main.js           # 应用入口
├── index.html            # HTML模板
├── package.json          # 依赖配置
├── vite.config.js        # 构建配置
└── README.md             # 项目说明
```

## 🔑 登录信息

默认登录账号：
- 用户名：`admin`
- 密码：`admin`

## 🌐 多语言支持

系统支持以下语言：
- 中文（zh-CN）
- 英语（en-US）
- 印尼语（id-ID）

可通过顶部导航栏的语言选择器切换语言。

## 📱 响应式设计

系统完全支持响应式设计：
- **桌面端（>=1200px）**：完整侧边栏和主内容区域
- **平板端（768px-1199px）**：折叠侧边栏
- **移动端（<768px）**：隐藏侧边栏，通过汉堡菜单访问

## 🎨 主要功能

### 仪表板
- 数据统计卡片
- 最近订单列表
- 用户活动时间轴
- 实时时间显示

### 用户管理
- 用户列表查看
- 添加/编辑用户
- 用户角色管理
- 搜索和筛选功能

### 产品管理
- 产品卡片展示
- 添加/编辑产品
- 库存管理
- 分类管理

### 订单管理
- 订单列表查看
- 订单状态管理
- 订单详情查看
- 统计分析

### 系统设置
- 常规设置
- 安全设置
- 通知设置
- 备份管理

## 🔧 技术栈

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **UI库**: MDBootstrap 5
- **图标**: Font Awesome
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **国际化**: Vue I18n
- **样式**: SCSS
- **HTTP客户端**: Axios

## 📝 开发说明

### 添加新页面

1. 在 `src/views/` 目录下创建新的组件文件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/i18n/index.js` 中添加多语言文本
4. 在布局组件中添加菜单项

### 自定义样式

项目使用SCSS进行样式管理，主要样式文件位于 `src/assets/scss/main.scss`。

### 国际化

多语言文本统一在 `src/i18n/index.js` 中管理，使用 `$t('key')` 方法调用。

## 🛠️ 自定义配置

### 修改主题色

在 `src/assets/scss/main.scss` 中修改 CSS 变量：

```scss
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### 添加新语言

在 `src/i18n/index.js` 的 `messages` 对象中添加新语言配置。

## 🔒 部署说明

### 静态部署

构建完成后，将 `dist` 目录部署到静态服务器即可。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🔗 相关链接

- [Vue 3 官方文档](https://v3.vuejs.org/)
- [MDBootstrap 文档](https://mdbootstrap.com/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Vue I18n 文档](https://vue-i18n.intlify.dev/)

## 📞 联系我们

如有问题或建议，请提交 Issue 或联系开发团队。

---

⭐ 如果这个项目对您有帮助，请给它一个 star！ 