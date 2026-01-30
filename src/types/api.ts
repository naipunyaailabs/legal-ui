export interface LegalResearchRequest {
  query: string;
  format_type?: string;
  jurisdiction?: string;
  practice_area?: string;
  citation_style?: string;
}

export interface LegalResearchResponse {
  analysis: string;
  citations: Array<any>;
  tokens_used: number;
  processing_time: number;
  format: string;
  research_id: string;
}

export interface DocumentAnalysisRequest {
  query: string;
  analysis_type?: string;
  max_docs?: number;
}

export interface DocumentAnalysisResponse {
  analysis: string;
  sources: Array<any>;
  tokens_used: number;
  processing_time: number;
  analysis_id: string;
}

export interface LegalDraftingRequest {
  doc_type: string;
  prompt: string;
  style?: string;
  length?: string;
  clauses?: string[];
  special_provisions?: string;
  jurisdiction?: string;
}

export interface LegalDraftingResponse {
  document: string;
  tokens_used: number;
  processing_time: number;
  word_count: number;
  draft_id: string;
}

export interface DocumentUploadResponse {
  message: string;
  file_id: string;
  file_name: string;
}

export interface DocumentInfo {
  file_id: string;
  file_name: string;
  upload_time: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  query: string;
  use_rag?: boolean;
  layman_mode?: boolean;
  session_id?: string;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{ file_name: string; page: string }>;
  is_flagged: boolean;
  flag_reason: string | null;
  tokens_used: number;
  input_tokens: number;
  output_tokens: number;
  processing_time: number;
  response_type: string;
}

export interface SessionStats {
  total_queries: number;
  flagged_queries: number;
  total_tokens_used: number;
  input_tokens_used: number;
  output_tokens_used: number;
  session_duration_seconds: number;
  average_tokens_per_query: number;
  flagged_percentage: number;
  tokens_remaining: number;
  input_output_ratio: number;
}

