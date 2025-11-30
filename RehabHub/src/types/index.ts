export interface CameraViewProps {
  onCapture: (image: string) => void;
}

export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export interface AnalysisResultProps {
  score: number;
  reason: string;
  angles: Record<string, number>;
  feedback: string;
  errors?: Record<string, unknown>;
  processing_time: string;
  annotated_image?: string;
}