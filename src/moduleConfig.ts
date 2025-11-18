// 模块配置文件 - 集中管理所有功能模块的配置

export interface ModuleConfig {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: string; // 图标的名称或标识符
  entryPoint: string; // 模块的入口点路径
  standalone: boolean; // 是否可以独立运行
  externalUrl?: string; // 外部URL，如果有则表示跳转到外部系统
  isActive: boolean; // 模块是否启用
}

// 所有模块的配置信息
export const modulesConfig: ModuleConfig[] = [
  {
    id: 'video-analysis',
    path: 'video-analysis',
    title: '视频分析',
    description: '上传或拍摄视频进行康复动作分析',
    icon: 'Video',
    entryPoint: '../VideoAnalysis',
    standalone: true,
    isActive: true
  },
  {
    id: 'results-history',
    path: 'results-history',
    title: '分析历史',
    description: '查看所有历史分析结果',
    icon: 'History',
    entryPoint: '../ResultsHistory',
    standalone: true,
    isActive: true
  },
  {
    id: 'settings',
    path: 'settings',
    title: '系统设置',
    description: '配置系统参数和个人偏好',
    icon: 'Settings',
    entryPoint: '../Settings',
    standalone: true,
    isActive: true
  }
];

// 为了兼容旧代码，导出一个别名
export const modules = modulesConfig;

// 根据模块ID获取模块配置
export const getModuleById = (id: string): ModuleConfig | undefined => {
  return modulesConfig.find(module => module.id === id);
};

// 根据路径获取模块配置
export const getModuleByPath = (path: string): ModuleConfig | undefined => {
  return modulesConfig.find(module => module.path === path);
};

// 获取所有独立模块
export const getStandaloneModules = (): ModuleConfig[] => {
  return modulesConfig.filter(module => module.standalone);
};

// 获取所有启用的模块
export const getActiveModules = (): ModuleConfig[] => {
  return modulesConfig.filter(module => module.isActive);
};

// 获取内部模块（非外部链接）
export const getInternalModules = (): ModuleConfig[] => {
  return modulesConfig.filter(module => !module.externalUrl);
};

// 获取外部链接模块
export const getExternalModules = (): ModuleConfig[] => {
  return modulesConfig.filter(module => !!module.externalUrl);
};

// 生成模块的hash路由URL
export const getModuleUrl = (modulePath: string): string => {
  return `#/${modulePath}`;
};

// 获取模块的实际访问URL（内部或外部）
export const getModuleAccessUrl = (module: ModuleConfig): string => {
  if (module.externalUrl) {
    return module.externalUrl;
  }
  return getModuleUrl(module.path);
};