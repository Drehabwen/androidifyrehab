# RehabHub

DeepRehab视频分析项目 - 基于React + TypeScript + Capacitor的移动端康复评估应用

## 项目简介

RehabHub是一个专业的康复评估移动应用，基于功能性动作筛查(FMS)标准，通过视频分析技术对用户的运动功能进行评估。

## 功能特性

- **7大核心动作评估**：深蹲、跨栏步、直线弓步、肩部灵活性、主动直腿抬高、躯干稳定性俯卧撑、旋转稳定性
- **实时视频分析**：基于TensorFlow.js的姿势检测技术
- **跨平台支持**：使用Capacitor构建iOS和Android应用
- **现代化技术栈**：React 18 + TypeScript + Vite + Tailwind CSS

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **移动端框架**：Capacitor
- **姿势检测**：TensorFlow.js PoseNet
- **状态管理**：React Hooks

## 项目结构

```
src/
├── movements/          # 7大动作分析模块
├── shared/             # 共享组件和服务
├── services/           # API和数据处理服务
├── types/              # TypeScript类型定义
└── utils/              # 工具函数
```

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 同步到移动端：
```bash
npx cap sync android
npx cap sync ios
```

## 构建APK

项目支持Android APK构建：

```bash
cd android
./gradlew assembleDebug
```

## 许可证

本项目仅供学习和研究使用。