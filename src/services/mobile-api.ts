// 定义类型
export interface AnalysisRequest {
  video: File;
}

export interface AnalysisResponse {
  score: number;
  reason: string;
  angles: Record<string, number>;
  feedback: string;
  errors?: Record<string, unknown>;
  processing_time: string;
}

// 移动端API基础URL配置
const getApiUrl = () => {
  // 在开发阶段可以配置为本地地址
  // 生产阶段可以通过设置页面配置
  const defaultUrl = 'https://rehablen.onrender.com'; // 默认后端地址
  
  // 可以通过 AsyncStorage 或其他方式存储用户配置的URL
  // 这里简化处理，直接返回默认值
  return defaultUrl;
};

// 实现分析视频函数
export const analyzeVideo = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  // 获取后端地址
  const apiUrl = getApiUrl();
  
  // 创建FormData对象用于文件上传
  const formData = new FormData();
  // Web端直接使用File对象
  formData.append('file', request.video);
  
  // 发送POST请求到后端分析端点
  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    body: formData,
    // Web端不需要特殊的headers处理
  });
  
  // 检查响应状态
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // 解析并返回响应数据
  const data: AnalysisResponse = await response.json();
  return data;
};

// 获取分析历史记录
export const getAnalysisHistory = async (): Promise<AnalysisResponse[]> => {
  // 这里可以实现获取历史记录的逻辑
  // 暂时返回空数组
  return [];
};