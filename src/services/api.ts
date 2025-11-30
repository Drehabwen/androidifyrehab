// 模块化API服务管理系统

// 导入关键点类型
import { Keypoint } from '../types/keypoints.ts';

// 定义类型
export interface AnalysisRequest {
  video: File;
}

export interface AnalysisResponse {
  score: number;
  feedback: string;
  reason: string;
  angles: Record<string, number>;
  processing_time: string;
  keypoints_detected: boolean;
  annotated_image?: string;
  details: Record<string, unknown>;
  timestamp: string;
  keypoints?: Keypoint[]; // 添加关键点数据字段
}

// API基础配置
const API_CONFIG = {
  baseUrl: 'http://localhost:8000', // 默认API地址
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// 检查是否在浏览器环境中运行
if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
  API_CONFIG.baseUrl = process.env.VITE_API_URL;
}

// 模块API配置接口
export interface ModuleApiConfig {
  moduleId: string;
  baseUrl?: string; // 可选的模块独立API地址
  endpoints: Record<string, string>; // API端点映射
  isExternal?: boolean; // 是否为外部API
}

// 已注册的模块API配置
const moduleApis: Record<string, ModuleApiConfig> = {
  'video-analysis': {
    moduleId: 'video-analysis',
    endpoints: {
      analyze: '/api/analyze',
      uploadVideo: '/api/video/upload',
      captureVideo: '/api/video/capture'
    }
  },
  'results-history': {
    moduleId: 'results-history',
    endpoints: {
      getHistory: '/api/results',
      getResultDetail: '/api/results/:id',
      deleteResult: '/api/results/:id'
    }
  },
  'settings': {
    moduleId: 'settings',
    endpoints: {
      getSettings: '/api/settings',
      updateSettings: '/api/settings'
    }
  }
};

// API客户端类
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: { baseUrl: string; defaultHeaders: Record<string, string> }) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders;
  }

  // 通用GET请求
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl + endpoint);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.defaultHeaders
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 通用POST请求
  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 文件上传POST请求
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// 获取模块API客户端
export function getModuleApi(moduleId: string): ApiClient {
  const moduleConfig = moduleApis[moduleId];
  if (!moduleConfig) {
    throw new Error(`未找到模块API配置: ${moduleId}`);
  }

  const baseUrl = moduleConfig.baseUrl || API_CONFIG.baseUrl;
  return new ApiClient({
    baseUrl,
    defaultHeaders: API_CONFIG.defaultHeaders
  });
}

// 注册新的模块API配置
export function registerModuleApi(config: ModuleApiConfig): void {
  moduleApis[config.moduleId] = config;
}

// 获取所有已注册的模块API配置
export function getAllModuleApis(): Record<string, ModuleApiConfig> {
  return { ...moduleApis };
}

// 为兼容旧代码，保留原始的analyzeVideo函数
export const analyzeVideo = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    console.log('API调用开始', {
      fileType: request.video.type,
      fileName: request.video.name,
      fileSize: request.video.size
    });
    
    // 使用新的模块化API客户端
    const apiClient = getModuleApi('video-analysis');
    const formData = new FormData();
    formData.append('file', request.video);
    
    // 确保endpoint以/开头，避免URL拼接问题
    const endpoint = '/analyze';
    const data = await apiClient.upload<AnalysisResponse>(endpoint, formData);
    console.log('API调用成功，返回数据:', data);
    return data;
  } catch (error) {
    console.error('视频分析API调用失败:', error);
    throw error;
  }
};

// 默认导出
export default {
  getModuleApi,
  registerModuleApi,
  getAllModuleApis,
  analyzeVideo
};