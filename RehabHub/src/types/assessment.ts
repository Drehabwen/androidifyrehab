// 评估系统核心类型定义

// 通用评分类型
export interface Score {
  value: number;
  maxValue: number;
  description?: string;
  feedback?: string;
}

// 评估指标类型
export interface Metric {
  id: string;
  name: string;
  score: Score;
  category: string;
  details?: Record<string, any>;
}

// 评估类型基础接口
export interface Assessment {
  id: string;
  type: string; // 例如: 'FMS', 'YBT', 'SFMA'
  movementType: string;
  movementName: string;
  timestamp: string;
  metrics: Metric[];
  overallScore: Score;
  recommendations?: string[];
  notes?: string;
}

// FMS特定评估类型
export interface FmsAssessment extends Assessment {
  type: 'FMS';
  mobilityScore: Score;
  stabilityScore: Score;
  asymmetryDetected: boolean;
  compensationPatterns?: string[];
}

// 评估结果处理器接口
export interface AssessmentProcessor {
  process(data: any): Promise<Assessment>;
  getRecommendedExercises(assessment: Assessment): string[];
  generateReport(assessment: Assessment): string;
}

// 评估模块配置接口
export interface AssessmentModuleConfig {
  id: string;
  name: string;
  supportedMovementTypes: string[];
  processor: AssessmentProcessor;
  icon: React.ReactNode;
  description: string;
}

// 评估系统注册表
export class AssessmentSystemRegistry {
  private static modules: Map<string, AssessmentModuleConfig> = new Map();

  static registerModule(module: AssessmentModuleConfig) {
    this.modules.set(module.id, module);
  }

  static getModule(id: string): AssessmentModuleConfig | undefined {
    return this.modules.get(id);
  }

  static getModulesForMovement(movementType: string): AssessmentModuleConfig[] {
    return Array.from(this.modules.values()).filter(
      module => module.supportedMovementTypes.includes(movementType)
    );
  }

  static getAllModules(): AssessmentModuleConfig[] {
    return Array.from(this.modules.values());
  }
}

// 评估结果存储接口
export interface AssessmentStorage {
  save(assessment: Assessment): Promise<void>;
  getById(id: string): Promise<Assessment | null>;
  getByMovementType(movementType: string): Promise<Assessment[]>;
  getAll(): Promise<Assessment[]>;
  delete(id: string): Promise<void>;
}

// 示例本地存储实现
export class LocalAssessmentStorage implements AssessmentStorage {
  private readonly storageKey = 'deeprehab_assessments';

  async save(assessment: Assessment): Promise<void> {
    const assessments = await this.getAll();
    const index = assessments.findIndex(a => a.id === assessment.id);
    
    if (index >= 0) {
      assessments[index] = assessment;
    } else {
      assessments.unshift(assessment);
    }
    
    // 限制存储数量，保留最近100条
    const limitedAssessments = assessments.slice(0, 100);
    localStorage.setItem(this.storageKey, JSON.stringify(limitedAssessments));
  }

  async getById(id: string): Promise<Assessment | null> {
    const assessments = await this.getAll();
    return assessments.find(a => a.id === id) || null;
  }

  async getByMovementType(movementType: string): Promise<Assessment[]> {
    const assessments = await this.getAll();
    return assessments.filter(a => a.movementType === movementType);
  }

  async getAll(): Promise<Assessment[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load assessments from localStorage:', error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    const assessments = await this.getAll();
    const filtered = assessments.filter(a => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}