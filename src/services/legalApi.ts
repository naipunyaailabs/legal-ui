// Legal AId API Service
import { legalChatbotApiClient } from './legalChatbotApi';
import { documentAnalysisApiClient } from './documentAnalysisApi';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  sources: Array<{
    file_name: string;
    page?: number;
  }>;
  tokens_used: number;
  response_type: 'rag' | 'general_knowledge' | 'layman' | 'hybrid';
  conversation_id: string;
}

export interface DocumentDraft {
  document_type: string;
  requirements: string;
  jurisdictions?: string[];
  style?: string;
  length?: string;
  clauses?: string[];
  special_provisions?: string;
}

export interface DraftResponse {
  document: string;
  document_type: string;
  processing_time?: number;
  tokens_used?: number;
}

export interface UploadResponse {
  message: string;
  session_id: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  mode: string;
}

export interface ConversationHistory {
  id: string;
  history: ChatMessage[];
  mode: string;
  title: string;
}

export interface ChatHistoryItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  preview: string;
  date: any;
  chat_session_id: string;
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
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

export interface DocumentChatRequest {
  file?: File;
  user_message: string;
  session_id?: string;
  document_type?: string;
}

export interface DocumentChatResponse {
  response: string;
  sources: Array<{
    file_name: string;
    page?: number;
  }>;
  tokens_used: number;
  response_type: 'rag' | 'general_knowledge' | 'layman' | 'hybrid';
  conversation_id: string;
}

// Document Analysis Service (Port 8001)
const DOCUMENT_SERVICE_BASE_URL = import.meta.env.VITE_DOCUMENT_SERVICE_BASE_URL || 'http://localhost:8001';

// Chat with document - using multipart/form-data for file uploads
export const chatWithDocument = async (
  requestData: DocumentChatRequest | FormData
): Promise<DocumentChatResponse> => {
  try {
    let body: FormData;

    // Handle both strict typed object and direct FormData (as passed by some components)
    if (requestData instanceof FormData) {
      body = requestData;
    } else {
      // Create FormData for multipart request
      body = new FormData();

      // Add file if provided
      if (requestData.file) {
        body.append('file', requestData.file);
      }

      // Add user message
      body.append('user_message', requestData.user_message);

      // Add optional session_id if provided
      if (requestData.session_id) {
        body.append('session_id', requestData.session_id);
      }

      // Add optional document_type if provided
      if (requestData.document_type) {
        body.append('document_type', requestData.document_type);
      }
    }

    // Get auth token
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Extract user_message to use as query parameter
    let userMessage = "";
    if (requestData instanceof FormData) {
      userMessage = requestData.get('user_message') as string || "";
    } else {
      userMessage = requestData.user_message || "";
    }

    // Extract session_id to use as query parameter
    let sessionId = "";
    if (requestData instanceof FormData) {
      sessionId = requestData.get('session_id') as string || "";
    } else {
      sessionId = requestData.session_id || "";
    }

    // Function to build URL with query params
    const buildUrl = (baseUrl: string, endpoint: string) => {
      const urlObj = new URL(`${baseUrl}${endpoint}`);
      if (userMessage) urlObj.searchParams.append('user_message', userMessage);
      if (sessionId) urlObj.searchParams.append('session_id', sessionId);
      return urlObj.toString();
    };

    // Try the endpoints in order of likelihood
    // Priority 1: /chat-with-document/ (Known working on port 8001)
    let url = buildUrl(DOCUMENT_SERVICE_BASE_URL, '/chat-with-document/');
    console.log('Calling document chat endpoint (Primary):', url);

    let response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok && response.status === 404) {
      // Priority 2: /api/chat-with-document/ (Fallback 1)
      console.log('Standard endpoint not found, trying fallback 1...');
      url = buildUrl(DOCUMENT_SERVICE_BASE_URL, '/api/chat-with-document/');
      response = await fetch(url, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok && response.status === 404) {
        // Priority 3: /api/document/chat (Fallback 2)
        console.log('Fallback 1 not found, trying fallback 2...');
        url = buildUrl(DOCUMENT_SERVICE_BASE_URL, '/api/document/chat');
        response = await fetch(url, {
          method: 'POST',
          headers,
          body
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Document chat failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to chat with document:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    });
    throw error;
  }
};

// Create a new session
export const createSession = async (): Promise<string> => {
  try {
    console.log('Creating new session...');
    // Call the session creation endpoint - using the correct endpoint from documentation
    const response = await legalChatbotApiClient.post<null, { chat_session_id: string }>('/chat/new', null);
    console.log('Session creation response:', response);
    if (!response || !response.chat_session_id) {
      throw new Error('Invalid session creation response');
    }
    return response.chat_session_id;
  } catch (error) {
    console.error('Failed to create session:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    });
    throw error;
  }
};



// Get all conversations
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    // Load conversations using authenticated API endpoint
    const sessions = await getChatHistory();
    console.log('Loaded sessions from backend:', sessions);

    // Convert backend session format to Conversation format
    const conversations = sessions
      .filter(session => {
        if (!session.id) {
          console.error('Session missing ID:', session);
          return false;
        }
        return true;
      })
      .map(session => {
        const conversation: Conversation = {
          id: session.id,
          title: session.preview || "New Conversation",
          lastMessage: session.preview || "",
          timestamp: session.date ? new Date(session.date).getTime() : Date.now(),
          mode: 'general'
        };
        console.log('Converted conversation:', conversation);
        return conversation;
      });

    // Sort conversations by timestamp (newest first)
    return conversations.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
};
// Get a specific conversation
export const getConversation = async (conversationId: string): Promise<ConversationHistory> => {
  try {
    console.log('Loading conversation from backend:', conversationId);
    const historyItems = await getChatSession(conversationId);
    console.log('Loaded history items:', historyItems);

    // Validate that historyItems is an array
    if (!Array.isArray(historyItems)) {
      console.warn(`Expected array for chat session ${conversationId}, but got:`, typeof historyItems, historyItems);
      // Return empty conversation if we don't get an array
      return {
        id: conversationId,
        history: [],
        mode: 'general',
        title: 'Chat Session'
      };
    }

    // Convert ChatHistoryItem to ChatMessage format
    const history = historyItems.map(item => ({
      role: item.role as 'user' | 'assistant',
      content: item.content,
      timestamp: new Date(item.timestamp)
    }));

    return {
      id: conversationId,
      history: history,
      mode: 'general',
      title: 'Chat Session'
    };
  } catch (error) {
    console.error(`Failed to fetch conversation ${conversationId}:`, error);
    return {
      id: conversationId,
      history: [],
      mode: 'general',
      title: 'Chat Session'
    };
  }
};

// Create a new conversation
export const createConversation = async (mode: string = 'general'): Promise<Conversation> => {
  try {
    const newSession = await startNewChatSession();
    console.log('Creating conversation from session:', newSession);

    // Guard against missing ID
    const sessionId = newSession.id || newSession?.chat_session_id;
    if (!sessionId) {
      throw new Error('Session returned without ID');
    }

    // Store the new session ID in localStorage so it's used for subsequent requests
    localStorage.setItem('backend_session_id', sessionId);
    console.log('Stored session ID in localStorage:', sessionId);

    const conversation: Conversation = {
      id: sessionId,
      title: newSession.title || "New Conversation",
      lastMessage: '',
      timestamp: newSession.created_at ? new Date(newSession.created_at).getTime() : Date.now(),
      mode: mode
    };
    console.log('Created conversation:', conversation);
    return conversation;
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw error;
  }
};
// Delete a conversation
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    return await deleteChatSession(conversationId);
  } catch (error) {
    console.error(`Failed to delete conversation ${conversationId}:`, error);
    return false;
  }
};

// Draft a legal document - using the correct endpoint from documentation
export const draftDocument = async (data: DocumentDraft): Promise<DraftResponse> => {
  try {
    // First, ensure we have a valid session
    let sessionId = localStorage.getItem('backend_session_id');
    console.log('Current session ID from localStorage:', sessionId);

    // Always create a new session to ensure we have a valid one
    console.log('Creating new session to ensure validity...');
    sessionId = await createSession();
    console.log('New session created:', sessionId);
    localStorage.setItem('backend_session_id', sessionId);

    // Prepare the request data to match backend expectations
    const requestData: any = {
      doc_type: data.document_type,  // Changed from document_type to doc_type to match backend
      requirements: data.requirements,
      session_id: sessionId
    };

    // Only add optional fields if they exist and are not empty
    if (data.jurisdictions && data.jurisdictions.length > 0) {
      requestData.jurisdictions = data.jurisdictions;
    }
    if (data.style) {
      requestData.style = data.style;
    }
    if (data.length) {
      requestData.length = data.length;
    }
    if (data.clauses && data.clauses.length > 0) {
      requestData.clauses = data.clauses;
    }
    if (data.special_provisions) {
      requestData.special_provisions = data.special_provisions;
    }

    console.log('Sending draft request with data:', requestData);

    const response = await legalChatbotApiClient.post<DocumentDraft, DraftResponse>('/drafting/generate', requestData);
    return response;
  } catch (error) {
    console.error('Failed to draft document:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    });
    throw error;
  }
};

// Upload documents for RAG - using the correct endpoint from documentation
export const uploadDocuments = async (files: Array<{ name: string; content: string }>): Promise<UploadResponse> => {
  try {
    // Always create a new session to ensure we have a valid one
    console.log('Creating new session for upload...');
    const sessionId = await createSession();
    console.log('New session created:', sessionId);
    localStorage.setItem('backend_session_id', sessionId);

    const response = await legalChatbotApiClient.post<any, UploadResponse>('/documents/upload', {
      files: files,
      session_id: sessionId
    });

    return response;
  } catch (error) {
    console.error('Failed to upload documents:', error);
    throw error;
  }
};

// Health check - using the correct endpoint from documentation
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await legalChatbotApiClient.get<{ status: string; message: string }>('/status');
    return response;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export interface DocumentType {
  id: string;
  name: string;
  description: string;
}

export interface DraftingStyle {
  id: string;
  name: string;
  description: string;
}

export interface LegalClause {
  id: string;
  name: string;
  description: string;
}

// Get available document types - using the correct endpoint from documentation
export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  try {
    const response = await legalChatbotApiClient.get<{ document_types: DocumentType[] }>('/drafting/document-types');
    return response.document_types || [];
  } catch (error) {
    console.error('Failed to fetch document types:', error);
    return [];
  }
};

// Get available drafting styles - using the correct endpoint from documentation
export const getDraftingStyles = async (): Promise<DraftingStyle[]> => {
  try {
    const response = await legalChatbotApiClient.get<{ drafting_styles: DraftingStyle[] }>('/drafting/styles');
    return response.drafting_styles || [];
  } catch (error) {
    console.error('Failed to fetch drafting styles:', error);
    return [];
  }
};

// Get available legal clauses - using the correct endpoint from documentation
export const getAvailableClauses = async (): Promise<LegalClause[]> => {
  try {
    const response = await legalChatbotApiClient.get<{ clauses: LegalClause[] }>('/drafting/clauses');
    return response.clauses || [];
  } catch (error) {
    console.error('Failed to fetch legal clauses:', error);
    return [];
  }
};

// Export report in specified format - using the correct endpoint from documentation
export const exportReport = async (
  content: any,
  format: 'pdf' | 'docx' | 'txt' = 'pdf'
): Promise<Blob> => {
  try {
    const response = await legalChatbotApiClient.postRaw('/drafting/export', {
      format: format,
      content: content
    });
    return response;
  } catch (error) {
    console.error('Failed to export report:', error);
    throw error;
  }
};

// Process documents with FormData - using the correct endpoint from documentation
export const processDocuments = async (data: any): Promise<any> => {
  try {
    const response = await legalChatbotApiClient.post<any, any>('/documents/process', data);
    return response;
  } catch (error) {
    console.error('Failed to process documents:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Get chat history for current user - using the correct endpoint from documentation
export const getChatHistory = async (): Promise<ChatSession[]> => {
  try {
    // Use the authenticated API endpoint that properly isolates by user
    const response = await legalChatbotApiClient.get<{ sessions: ChatSession[] }>('/chat/history');
    return response.sessions || [];
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    return [];
  }
};

// Get specific chat session messages - using the correct endpoint from documentation
export const getChatSession = async (sessionId: string): Promise<ChatHistoryItem[]> => {
  try {
    // Use the authenticated API endpoint that properly isolates by user
    const response = await legalChatbotApiClient.get<any>(`/chat/${sessionId}`);
    console.log('Raw response from /chat/{sessionId}:', response);
    console.log('Response keys:', response ? Object.keys(response) : 'null');

    // Backend might return messages directly or wrapped in response.messages
    const messages = response?.messages || response?.history || (Array.isArray(response) ? response : []);
    console.log('Extracted messages:', messages);
    return messages;
  } catch (error) {
    console.error(`Failed to fetch chat session ${sessionId}:`, error);
    return [];
  }
};

// Delete a chat session - using the correct endpoint from documentation
export const deleteChatSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Use the authenticated API endpoint that properly isolates by user
    await legalChatbotApiClient.delete(`/chat/${sessionId}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete chat session ${sessionId}:`, error);
    return false;
  }
};

// Start a new chat session - using the correct endpoint from documentation
export const startNewChatSession = async (): Promise<ChatSession> => {
  try {
    // Use the authenticated API endpoint that properly isolates by user
    const response = await legalChatbotApiClient.post<null, ChatSession>('/chat/new', null);
    console.log('Raw response from /chat/new:', response);
    console.log('Response keys:', Object.keys(response));
    console.log('Response.id:', response.id);
    console.log('Response.chat_session_id:', response?.chat_session_id);

    // Guard against missing ID
    if (!response) {
      throw new Error('Empty response from /chat/new endpoint');
    }

    // Backend might return 'chat_session_id' instead of 'id'
    const sessionId = response.id || response?.chat_session_id;
    if (!sessionId) {
      console.error('No session ID found in response:', response);
      throw new Error('Backend /chat/new endpoint did not return session ID');
    }

    return response;
  } catch (error) {
    console.error('Failed to start new chat session:', error);
    throw error;
  }
};

// Download a drafted document - using the correct endpoint from documentation
export const downloadDocument = async (
  format: 'txt' | 'pdf' | 'docx',
  content: any
): Promise<Blob> => {
  try {
    const response = await legalChatbotApiClient.postRaw(`/drafting/download/${format}`, content);
    return response;
  } catch (error) {
    console.error(`Failed to download document in ${format} format:`, error);
    throw error;
  }
};

// Get embeddings status - using the correct endpoint from documentation
export const getEmbeddingsStatus = async (): Promise<any> => {
  try {
    const response = await legalChatbotApiClient.get<any>('/status');
    return response;
  } catch (error) {
    console.error('Failed to fetch embeddings status:', error);
    throw error;
  }
};

// Get session statistics - using the correct endpoint from documentation
export const getSessionStats = async (): Promise<SessionStats> => {
  try {
    const response = await legalChatbotApiClient.get<SessionStats>('/session/stats');
    return response;
  } catch (error) {
    console.error('Failed to fetch session stats:', error);
    throw error;
  }
};

// Reset user session - using the correct endpoint from documentation
export const resetSession = async (): Promise<boolean> => {
  try {
    await legalChatbotApiClient.post<null, any>('/session/reset', null);
    // Clear local storage session ID as well
    localStorage.removeItem('backend_session_id');
    return true;
  } catch (error) {
    console.error('Failed to reset session:', error);
    return false;
  }
};