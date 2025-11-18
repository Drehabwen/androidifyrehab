/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主要色彩 - 康复医疗主题配色
        primary: {
          DEFAULT: '#8faa8f', // 主绿色 - 用于品牌标识、主要按钮和重要元素
          light: '#a8c4a8',   // 浅绿色 - 用于渐变和次要元素
          soft: '#c8d6c8',    // 柔和绿色 - 用于背景和卡片
          white: '#fefefe',   // 温暖白色 - 卡片和容器背景
          gray: '#f5f7f5',    // 温暖灰色 - 页面背景渐变
        },
        // 文字色彩层级
        text: {
          primary: '#2d3a2d', // 主要文字 - 深绿色调，确保良好的可读性
          secondary: '#5a6b5a', // 次要文字 - 中等饱和度的绿色
          tertiary: '#7a8a7a',  // 浅色文字 - 用于辅助信息
        },
        // 状态色
        status: {
          success: '#8faa8f', // 绿色 - 优秀
          warning: '#e0c15b', // 黄色 - 良好/需要关注
          danger: '#d48a8a',  // 红色 - 需要改善
        },
        // 辅助色彩
        border: '#d4ddd4',    // 浅绿色边框
        // 保留原有emerald系列以兼容现有代码
        emerald: {
          50: '#f8fffa',
          100: '#f1fef7',
          200: '#d9f9e5',
          300: '#baf4d5',
          400: '#81e6b9',
          500: '#8faa8f', // 使用新的主色调
          600: '#7a9a7a',
          700: '#5a6b5a', // 使用新的次要文字色
          800: '#4a5a4a',
          900: '#2d3a2d', // 使用新的主要文字色
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(143, 170, 143, 0.1)', // 带有绿色调柔和阴影
        'hover': '0 4px 20px rgba(143, 170, 143, 0.15)', // 带有绿色调柔和阴影
        'card': '0 4px 15px rgba(143, 170, 143, 0.08)', // 卡片阴影
      },
      transitionDelay: {
          '0': '0ms',
          '15': '15ms',
          '30': '30ms',
          '45': '45ms',
          '60': '60ms',
          '75': '75ms',
          '90': '90ms',
          '100': '100ms',
          '150': '150ms',
          '200': '200ms',
          '250': '250ms',
          '300': '300ms',
        }
    },
  },
  plugins: [],
}