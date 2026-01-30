import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, File as FileIcon, CheckCircle2, Loader2, Download, BookOpen, MessageCircle, Calendar, Shield, BarChart3, FileSearch, Sliders, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell } from 'recharts';
import { exportReport } from '@/services/legalApi';
import { processDocuments, extractText, summarizeDocuments, analyzeClauses, assessRisks, extractChronology, classifyDocument } from '@/services/documentAnalysisApi';
import { chatWithDocument } from '@/services/documentAnalysisApi';
import { Slider } from "@/components/ui/slider";
import DashboardLayout from "@/components/DashboardLayout";

// Types for our API responses
interface DocumentAnalysisResult {
  analysis: string;
  sources: Array<{
    file_name: string;
    page?: string;
  }>;
  tokens_used: number;
  processing_time: number;
  analysis_id: string;
  events?: Array<{
    type: string;
    description: string;
    date: string;
    confidence: number;
  }>;
  clauses?: Array<{
    type: string;
    text: string;
    risk_level: string;
    page: number;
    heading?: string;
    // For risk analysis API response
    clause_type?: string;
    risk_description?: string;
    severity: string;
    recommendation?: string;
    suggested_action?: string;
  }>;
  risks?: Array<{
    type: string;
    description: string;
    severity: string;
    recommendation: string;
    // For risk analysis API response
    clause_type?: string;
    risk_description?: string;
    suggested_action?: string;
  }>;
  classification?: {
    document_type: string;
    importance: number;
    subject: string;
  };
  summary?: string;
  response?: string;
  timeline?: {
    events: Array<{
      description: string;
      event_type: string;
      confidence_score: number;
      temporal_expressions: Array<{
        text: string;
      }>;
    }>;
  };
  chat_history?: Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;
  // Extract Text specific
  raw_text?: string;
  raw_text_length?: number;
  heading?: string;
  body?: string;
  tagged_sections?: Array<{
    heading: string;
    body: string;
    documents: string[];
  }>;
  // Clause Analysis specific
  clause_analysis?: Array<{
    heading: string;
    clauses: Array<{
      clause: string;
      summary: string;
      risk_level?: string;
      page?: number;
    }>;
  }>;
}

const Interact = () => {
  const [files, setFiles] = useState<Array<{ name: string; status: string; file?: File; file_id?: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [analysisType, setAnalysisType] = useState("summarize");
  const [showRightPanel, setShowRightPanel] = useState(false);

  // State for analysis options
  const [summaryInstructions, setSummaryInstructions] = useState("Summarize this legal document in simple terms");
  const [summaryType, setSummaryType] = useState("bullet_points");
  const [maxLength, setMaxLength] = useState(300);
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [documentType, setDocumentType] = useState("general");
  const [assessmentFocus, setAssessmentFocus] = useState("comprehensive");
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [riskCategories, setRiskCategories] = useState("financial,legal");
  const [customInstructions, setCustomInstructions] = useState("");
  const [userMessage, setUserMessage] = useState("What is this document about?");
  const [documentTypeHint, setDocumentTypeHint] = useState("");
  const [classificationFocus, setClassificationFocus] = useState("");
  const [documentDate, setDocumentDate] = useState("");

  // Add chat options state
  const [chatMode, setChatMode] = useState<"Document Only" | "Layman Explanation" | "Hybrid (Smart)" | "General Chat">("General Chat");
  const [temperature, setTemperature] = useState<number>(0.3);
  const [maxTokens, setMaxTokens] = useState<number>(2000);

  // Add chat history state to the component
  const [chatHistory, setChatHistory] = useState<Array<{ role: string, content: string, timestamp: string }>>([]);

  // Add input message state for chat
  const [inputMessage, setInputMessage] = useState('');

  const { toast } = useToast();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    const newFiles = uploadedFiles.map(file => ({
      name: file.name,
      status: "ready",
      file: file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Reset input value to allow uploading the same file again or new files
    e.target.value = '';

    toast({
      title: "Files selected",
      description: `${uploadedFiles.length} file(s) ready for analysis.`,
    });
  };
  const handleExportReport = async (format: 'txt' | 'pdf' | 'docx' = 'txt') => {
    if (!analysisResult) {
      toast({
        title: "No analysis result",
        description: "Please analyze a document first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For TXT format, use the existing method
      if (format === 'txt') {
        // Create a formatted report text based on what's actually displayed
        let reportContent = `Legal AId Document Analysis Report\n`;
        reportContent += `================================\n\n`;
        reportContent += `Analysis Type: ${getAnalysisTitle(analysisType)}\n`;
        reportContent += `Analysis ID: ${analysisResult.analysis_id}\n`;
        reportContent += `Processing Time: ${analysisResult.processing_time.toFixed(2)} seconds\n`;
        reportContent += `Tokens Used: ${analysisResult.tokens_used.toLocaleString()}\n\n`;

        // Add main analysis content
        if (analysisResult.analysis && analysisType !== "chronology") {
          reportContent += `Analysis Results:\n`;
          reportContent += `----------------\n`;
          reportContent += `${analysisResult.analysis}\n\n`;
        }

        // Add summary if available and not chronology
        if (analysisResult.summary && analysisType !== "chronology") {
          reportContent += `Summary:\n`;
          reportContent += `-------\n`;
          reportContent += `${analysisResult.summary}\n\n`;
        }

        // Special handling for chronology analysis
        if (analysisType === "chronology") {
          // Add event type distribution data if available
          if (analysisResult.timeline?.events && analysisResult.timeline.events.length > 0) {
            const distribution = getEventTypeDistribution(analysisResult.timeline.events);
            if (distribution.length > 0) {
              reportContent += `Event Type Distribution:\n`;
              reportContent += `=======================\n`;
              distribution.forEach(item => {
                reportContent += `${item.type}: ${item.percentage.toFixed(1)}% (${item.count} events)\n`;
              });
              reportContent += `\n`;
            }

            // Add chronological events table in tabular format
            reportContent += `Chronological Events:\n`;
            reportContent += `====================\n`;
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n`;
            reportContent += `| S.No | Date       | Type             | Description                            | Confidence | Section          |\n`;
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n`;

            analysisResult.timeline.events.forEach((event, index) => {
              const date = event.temporal_expressions && event.temporal_expressions.length > 0
                ? event.temporal_expressions[0].text
                : "Unknown";
              const eventType = event.event_type || "N/A";
              const description = event.description || "N/A";
              const confidence = `${(event.confidence_score * 100).toFixed(1)}%`;
              const section = event.temporal_expressions && event.temporal_expressions.length > 0
                ? event.temporal_expressions.map(expr => expr.text).join(", ")
                : "N/A";

              // Truncate long fields for better table formatting
              const truncatedDate = date.length > 10 ? date.substring(0, 10) + "..." : date;
              const truncatedType = eventType.length > 16 ? eventType.substring(0, 16) + "..." : eventType;
              const truncatedDesc = description.length > 38 ? description.substring(0, 38) + "..." : description;
              const truncatedSection = section.length > 16 ? section.substring(0, 16) + "..." : section;

              reportContent += `| ${String(index + 1).padStart(4)} | ${truncatedDate.padEnd(10)} | ${truncatedType.padEnd(16)} | ${truncatedDesc.padEnd(38)} | ${confidence.padEnd(10)} | ${truncatedSection.padEnd(16)} |\n`;
            });
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n\n`;
          }

          // Handle alternative events format
          if (analysisResult.events && analysisResult.events.length > 0) {
            reportContent += `Chronological Events:\n`;
            reportContent += `====================\n`;
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n`;
            reportContent += `| S.No | Date       | Type             | Description                            | Confidence | Section          |\n`;
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n`;

            analysisResult.events.forEach((event, index) => {
              const date = event.date || "Unknown";
              const eventType = event.type || "N/A";
              const description = event.description || "N/A";
              const confidence = `${(event.confidence * 100).toFixed(1)}%`;
              const section = event.date || "N/A";

              // Truncate long fields for better table formatting
              const truncatedDate = date.length > 10 ? date.substring(0, 10) + "..." : date;
              const truncatedType = eventType.length > 16 ? eventType.substring(0, 16) + "..." : eventType;
              const truncatedDesc = description.length > 38 ? description.substring(0, 38) + "..." : description;
              const truncatedSection = section.length > 16 ? section.substring(0, 16) + "..." : section;

              reportContent += `| ${String(index + 1).padStart(4)} | ${truncatedDate.padEnd(10)} | ${truncatedType.padEnd(16)} | ${truncatedDesc.padEnd(38)} | ${confidence.padEnd(10)} | ${truncatedSection.padEnd(16)} |\n`;
            });
            reportContent += `+------+------------+------------------+----------------------------------------+------------+------------------+\n\n`;
          }
        }

        // Add classification if available
        if (analysisResult.classification) {
          reportContent += `\nDocument Classification:\n`;
          reportContent += `=======================\n`;
          reportContent += `Type: ${analysisResult.classification.document_type}\n`;
          reportContent += `Subject: ${analysisResult.classification.subject}\n`;
          reportContent += `Confidence: ${(analysisResult.classification.importance * 100).toFixed(0)}%\n`;
        }

        // Add sources
        if (analysisResult.sources && analysisResult.sources.length > 0) {
          reportContent += `\nSources:\n`;
          reportContent += `=======\n`;
          analysisResult.sources.forEach((source, index) => {
            reportContent += `${index + 1}. ${source.file_name}\n`;
            if (source.page) {
              reportContent += `   Page: ${source.page}\n`;
            }
          });
        }

        // Add chat history if available
        if (analysisResult.chat_history && analysisResult.chat_history.length > 0) {
          reportContent += `\nChat History:\n`;
          reportContent += `============\n`;
          analysisResult.chat_history.forEach((msg, index) => {
            reportContent += `${msg.role}: ${msg.content}\n`;
          });
        }

        // Create and download the file
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `legal-analysis-report-${analysisResult.analysis_id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Report exported",
          description: `Your analysis report has been downloaded as legal-analysis-report-${analysisResult.analysis_id}.txt.`,
        });
        return;
      }

      // For PDF and DOCX formats, use the backend API
      // Prepare content data for the backend
      const contentData: any = {
        analysis_type: analysisType,
        analysis_id: analysisResult.analysis_id,
        processing_time: analysisResult.processing_time,
        tokens_used: analysisResult.tokens_used,
        analysis: analysisResult.analysis,
        summary: analysisResult.summary,
        classification: analysisResult.classification,
        sources: analysisResult.sources,
        chat_history: chatHistory // Include chat history
      };

      // Special handling for chronology analysis
      if (analysisType === "chronology") {
        // Add event type distribution data if available
        if (analysisResult.timeline?.events && analysisResult.timeline.events.length > 0) {
          contentData.event_distribution = getEventTypeDistribution(analysisResult.timeline.events);

          // Add chronological events table data
          contentData.chronology_table = analysisResult.timeline.events.map((event, index) => {
            const date = event.temporal_expressions && event.temporal_expressions.length > 0
              ? event.temporal_expressions[0].text
              : "Unknown";
            const eventType = event.event_type || "N/A";
            const description = event.description || "N/A";
            const confidence = `${(event.confidence_score * 100).toFixed(1)}%`;
            const section = event.temporal_expressions && event.temporal_expressions.length > 0
              ? event.temporal_expressions.map(expr => expr.text).join(", ")
              : "N/A";

            return {
              sno: index + 1,
              date: date,
              type: eventType,
              description: description,
              confidence: confidence,
              section: section
            };
          });
        }

        // Handle alternative events format
        if (analysisResult.events && analysisResult.events.length > 0) {
          contentData.chronology_table = analysisResult.events.map((event, index) => {
            const date = event.date || "Unknown";
            const eventType = event.type || "N/A";
            const description = event.description || "N/A";
            const confidence = `${(event.confidence * 100).toFixed(1)}%`;
            const section = event.date || "N/A";

            return {
              sno: index + 1,
              date: date,
              type: eventType,
              description: description,
              confidence: confidence,
              section: section
            };
          });
        }
      }

      // Call the backend API to generate the report
      const blob = await exportReport(contentData, format);

      // Create and download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `legal-analysis-report-${analysisResult.analysis_id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report exported",
        description: `Your analysis report has been downloaded as legal-analysis-report-${analysisResult.analysis_id}.${format}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update the handleAnalyze function to include chat options
  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Add validation for chronology analysis
    if (analysisType === "chronology" && !documentDate) {
      toast({
        title: "Date Required",
        description: "Please enter the document date for chronology analysis.",
        variant: "destructive",
      });
      return;
    }

    // Validate date format for chronology analysis
    if (analysisType === "chronology" && documentDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(documentDate)) {
        toast({
          title: "Invalid Date Format",
          description: "Please enter the date in YYYY-MM-DD format (e.g., 2024-01-01).",
          variant: "destructive",
        });
        return;
      }
    }

    setIsAnalyzing(true);
    let result: DocumentAnalysisResult | null = null;
    let response: Response;
    let url = "";

    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((fileObj) => {
      if (fileObj.file) {
        formData.append('file', fileObj.file);
      }
    });

    // Build URL with query parameters based on analysis type
    // Updated to use correct API endpoints with query parameters for Option 1
    let fullUrl = '';
    switch (analysisType) {
      case "summarize":
        // Use the correct endpoint for summarization with query parameters
        const summarizeParams = new URLSearchParams({
          summary_instructions: summaryInstructions,
          summary_type: summaryType,
          max_length: maxLength.toString(),
          include_key_points: includeKeyPoints.toString(),
          compare_documents: "false"
        });
        fullUrl = `/api/summarize-documents/?${summarizeParams.toString()}`;
        break;

      case "clauses":
        fullUrl = `/api/analyze-clauses/`;
        break;

      case "risk":
        const riskParams = new URLSearchParams({
          document_type: documentType,
          assessment_focus: assessmentFocus,
          include_recommendations: includeRecommendations.toString(),
          risk_categories: riskCategories
        });
        fullUrl = `/api/assess-risks/?${riskParams.toString()}`;
        break;

      case "chronology":
        const chronologyParams = new URLSearchParams({
          document_date: documentDate
        });
        fullUrl = `/api/extract-chronology/?${chronologyParams.toString()}`;
        break;

      case "classify":
        const classifyParams = new URLSearchParams({
          document_type_hint: documentTypeHint,
          classification_focus: classificationFocus
        });
        fullUrl = `/api/classify-document/?${classifyParams.toString()}`;
        break;

      case "chat":
        const chatParams = new URLSearchParams({
          user_message: userMessage
        });
        fullUrl = `/api/chat-with-document/?${chatParams.toString()}`;
        break;

      default: // extract-text as default
        fullUrl = `/api/extract-text/`;
    }    try {
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let data;
      if (analysisType !== "chat") {
        // Direct file to analysis - Option 1
        const response = await fetch(fullUrl, {
          method: 'POST',
          body: formData
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error: any = new Error('API Error');
          error.status = response.status;
          error.statusText = response.statusText;
          try {
            error.data = await response.json();
          } catch (e) {
            error.data = null;
          }
          throw error;
        }

        data = await response.json();
      } else {
        // For chat operations, use the chatWithDocument service function
        const message = formData.get('message') as string || userMessage;
        const mode = formData.get('mode') as 'document' | 'layman' || chatMode;
        // Build FormData for document chat
        const chatFormData = new FormData();
        files.forEach((fileObj) => {
          if (fileObj.file) {
            chatFormData.append('file', fileObj.file);
          }
        });
        chatFormData.append('user_message', message);
        data = await chatWithDocument(chatFormData);
        clearTimeout(timeoutId);
      }

      // Debug logging
      console.log("API Response Data:", data);
      console.log("Analysis Type:", analysisType);
      console.log("Summary field in response:", data.summary || (data.summaries && data.summaries[0] ? data.summaries[0].summary : null));

      // Handle the real API response structure for summarize endpoint
      let summaryValue = "";

      // Check if this is the summarize endpoint response with summaries array
      if (analysisType === "summarize" && data.summaries && Array.isArray(data.summaries) && data.summaries.length > 0) {
        const firstSummary = data.summaries[0];
        // Access the summary field directly as per backend structure
        summaryValue = firstSummary.summary || "";
      } else {
        // Fallback to direct summary access
        // Fallback to direct summary access
        summaryValue = data.summary || "";
      }

      // Format the response based on the API structure and analysis type
      result = {
        analysis: data.assistant_message || data.response || data.analysis || summaryValue || data.raw_text ||
          (analysisType === "chronology" && data.timeline?.events ? "" : "Analysis completed successfully."),
        sources: files.map(f => ({ file_name: f.name })),
        tokens_used: data.tokens_used || data.processing_metadata?.tokens_used || 0,
        processing_time: data.processing_time || data.processing_metadata?.processing_time || data.total_processing_time || 0,
        analysis_id: data.analysis_id || data.processing_metadata?.document_id || `analysis-${Date.now()}`,
        summary: summaryValue,
        response: data.assistant_message || data.response || data.analysis || summaryValue || data.raw_text || "",
        // Include all specific fields for each analysis type
        raw_text: data.raw_text,
        raw_text_length: data.raw_text_length,
        clause_analysis: data.clause_analysis,
        risks: data.risks,
        timeline: data.timeline,
        classification: data.classification,
        events: data.events,
        clauses: data.clause_analysis?.clauses,
        chat_history: data.chat_history,
        // Extract text specific fields
        heading: data.heading,
        body: data.body,
        tagged_sections: data.tagged_sections
      };

      // Debug logging
      console.log("Processed Result:", result);

      setAnalysisResult(result);
      setShowRightPanel(true);

      toast({
        title: "Analysis complete!",
        description: "Document insights are ready.",
      });
    }
    catch (error: any) {
      if (error.name === 'AbortError') {
        toast({
          title: "Analysis timeout",
          description: "The analysis took too long to complete. Please try again with a smaller document.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis failed",
          description: `Failed to analyze documents: ${error.message}`,
          variant: "destructive",
        });
      }
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update the handleContinueChat function to include chat options
  const handleContinueChat = async (newMessage: string) => {
    if (!analysisResult || files.length === 0) {
      toast({
        title: "No document analyzed",
        description: "Please analyze a document first before chatting.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Use the chatWithDocument service function instead of direct fetch
      // Build FormData for document chat
      const chatFormData = new FormData();
      files.forEach((fileObj) => {
        if (fileObj.file) {
          chatFormData.append('file', fileObj.file);
        }
      });
      chatFormData.append('user_message', newMessage);
      const chatData = await chatWithDocument(chatFormData);

      // Add to chat history with proper typing
      const newUserMessage = {
        role: 'user' as const,
        content: newMessage,
        timestamp: new Date().toISOString()
      };

      const newAssistantMessage = {
        role: 'assistant' as const,
        content: chatData.assistant_message || "I've analyzed your document and can help answer questions about it.",
        timestamp: new Date().toISOString()
      };

      const newChatHistory = [...chatHistory, newUserMessage, newAssistantMessage];

      setChatHistory(newChatHistory);

      // Update the analysis result with the new chat history and latest response
      if (analysisResult) {
        const updatedResult = {
          ...analysisResult,
          chat_history: newChatHistory,
          // Update the analysis field with the latest response for proper display
          analysis: chatData.assistant_message || "I've analyzed your document and can help answer questions about it.",
          response: chatData.assistant_message || "I've analyzed your document and can help answer questions about it."
        };
        setAnalysisResult(updatedResult);
      }

      toast({
        title: "Response received!",
        description: "The assistant has replied to your question.",
      });
    } catch (error: any) {
      toast({
        title: "Chat failed",
        description: `Failed to get response: ${error.message}`,
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to get icon for analysis type
  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case "summarize": return <FileText className="h-4 w-4" />;
      case "extract-text": return <FileText className="h-4 w-4" />;
      case "clauses": return <FileSearch className="h-4 w-4" />;
      case "risk": return <Shield className="h-4 w-4" />;
      case "chronology": return <Calendar className="h-4 w-4" />;
      case "classify": return <BarChart3 className="h-4 w-4" />;
      case "chat": return <MessageCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Helper function to get title for analysis type
  const getAnalysisTitle = (type: string) => {
    switch (type) {
      case "summarize": return "Document Summary";
      case "extract-text": return "Extracted Text";
      case "clauses": return "Clause Analysis";
      case "risk": return "Risk Assessment";
      case "chronology": return "Chronology Builder";
      case "classify": return "Document Classification";
      case "chat": return "Document Chat";
      default: return "Document Analysis";
    }
  };

  // Helper function to calculate event type distribution for the bar chart
  const getEventTypeDistribution = (events: DocumentAnalysisResult['timeline']['events']) => {
    if (!events || events.length === 0) return [];

    // Count occurrences of each event type
    const typeCounts: Record<string, number> = {};
    events.forEach(event => {
      const type = event.event_type || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Calculate percentages
    const totalEvents = events.length;
    const distribution = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / totalEvents) * 100
    }));

    // Sort by percentage descending
    return distribution.sort((a, b) => b.percentage - a.percentage);
  };

  // Helper function to get bar colors for the chart
  const getBarColor = (index: number) => {
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
      '#f97316', // orange-500
      '#84cc16', // lime-500
      '#6366f1'  // indigo-500
    ];
    return colors[index % colors.length];
  };

  // Handler to remove a specific file
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    toast({
      title: "File removed",
      description: "The file has been removed from the upload list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Document Analysis
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload and analyze legal documents with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* CONDITIONAL LAYOUT: 2-column before analysis, vertical after analysis */}
        {!analysisResult ? (
          // BEFORE ANALYSIS: Optimized 2-Column Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Upload and Configuration */}
            <div className="lg:col-span-8 space-y-5">
              {/* Upload Card */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Upload Documents</CardTitle>
                      <CardDescription className="text-sm">PDF files up to 20MB each</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-10 text-center transition-all cursor-pointer border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 bg-gray-50/80">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <div className="mx-auto h-12 w-12 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-base font-semibold text-gray-800 mb-1">
                        Drop files here or click to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF documents
                      </p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {files.length} file{files.length > 1 ? 's' : ''} ready
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-sm hover:shadow-sm transition-all"
                          >
                            {file.file && file.name.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                              <div className="h-6 w-6 rounded overflow-hidden flex-shrink-0 border border-blue-200 bg-white shadow-sm">
                                <img src={URL.createObjectURL(file.file)} alt="preview" className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <FileIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            )}
                            <span className="font-medium text-blue-900 max-w-[200px] truncate">
                              {file.name}
                            </span>
                            {file.status === "uploading" && (
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            )}
                            {file.status === "ready" && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="ml-1 hover:bg-blue-200 rounded-md p-1 transition-colors"
                              aria-label="Remove file"
                            >
                              <X className="h-3.5 w-3.5 text-blue-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Type and Options Combined */}
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Analysis Settings</CardTitle>
                      <CardDescription className="text-sm">Choose analysis type and configure options</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Analysis Type Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Analysis Type</Label>
                    <Select value={analysisType} onValueChange={(value) => {
                      setAnalysisType(value);
                      setAnalysisResult(null);
                      setChatHistory([]);
                      setShowRightPanel(false);
                    }}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select analysis type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summarize">Summarize Document</SelectItem>
                        <SelectItem value="extract-text">Extract Text</SelectItem>
                        <SelectItem value="clauses">Extract Key Clauses</SelectItem>
                        <SelectItem value="risk">Risk Analysis</SelectItem>
                        <SelectItem value="chronology">Chronology Builder</SelectItem>
                        <SelectItem value="classify">Document Classification</SelectItem>
                        <SelectItem value="chat">Document Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 -mx-6"></div>

                  {/* Options Section */}
                  <div className="space-y-4">

                    {/* Extract Text - No Options */}
                    {analysisType === "extract-text" && (
                      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                        Text extraction will process your document and extract all readable text content.
                      </div>
                    )}

                    {/* Summarize Options */}
                    {analysisType === "summarize" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="summary-instructions" className="font-medium">Summary Instructions</Label>
                          <Textarea
                            id="summary-instructions"
                            value={summaryInstructions}
                            onChange={(e) => setSummaryInstructions(e.target.value)}
                            placeholder="Enter instructions for summarizing the document"
                            className="min-h-24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="summary-type" className="font-medium">Summary Type</Label>
                          <Select value={summaryType} onValueChange={setSummaryType}>
                            <SelectTrigger id="summary-type" className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="comprehensive">Comprehensive</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                              <SelectItem value="bullet_points">Bullet Points</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-length" className="font-medium">Max Length (words)</Label>
                          <Input
                            id="max-length"
                            type="number"
                            value={maxLength}
                            onChange={(e) => setMaxLength(Number(e.target.value))}
                            min="100"
                            max="2000"
                            className="h-10"
                          />
                        </div>
                        <div className="flex items-center space-x-3 pt-2">
                          <Checkbox
                            id="include-key-points"
                            checked={includeKeyPoints}
                            onCheckedChange={(checked) => setIncludeKeyPoints(checked as boolean)}
                          />
                          <Label htmlFor="include-key-points" className="font-medium cursor-pointer">
                            Include Key Points
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment Options */}
                    {analysisType === "risk" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="document-type" className="font-medium">Document Type</Label>
                          <Select value={documentType} onValueChange={setDocumentType}>
                            <SelectTrigger id="document-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="nda">NDA</SelectItem>
                              <SelectItem value="employment_agreement">Employment Agreement</SelectItem>
                              <SelectItem value="lease">Lease</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assessment-focus">Assessment Focus</Label>
                          <Select value={assessmentFocus} onValueChange={setAssessmentFocus}>
                            <SelectTrigger id="assessment-focus">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="comprehensive">Comprehensive</SelectItem>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="risk-categories">Risk Categories (comma-separated)</Label>
                          <Input
                            id="risk-categories"
                            value={riskCategories}
                            onChange={(e) => setRiskCategories(e.target.value)}
                            placeholder="financial,legal,compliance,operational"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-instructions">Custom Instructions</Label>
                          <Textarea
                            id="custom-instructions"
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="Enter any custom instructions for risk assessment"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-recommendations"
                            checked={includeRecommendations}
                            onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
                          />
                          <Label htmlFor="include-recommendations">Include Recommendations</Label>
                        </div>
                      </div>
                    )}

                    {/* Chronology Options */}
                    {analysisType === "chronology" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="document-date">Document Date (YYYY-MM-DD)</Label>
                          <Input
                            id="document-date"
                            type="text"
                            value={documentDate}
                            onChange={(e) => setDocumentDate(e.target.value)}
                            placeholder="2024-01-01"
                          />
                        </div>
                      </div>
                    )}

                    {/* Classification Options */}
                    {analysisType === "classify" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="document-type-hint">Document Type Hint</Label>
                          <Input
                            id="document-type-hint"
                            value={documentTypeHint}
                            onChange={(e) => setDocumentTypeHint(e.target.value)}
                            placeholder="Optional hint about document type"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="classification-focus">Classification Focus</Label>
                          <Input
                            id="classification-focus"
                            value={classificationFocus}
                            onChange={(e) => setClassificationFocus(e.target.value)}
                            placeholder="Optional focus area for classification"
                          />
                        </div>
                      </div>
                    )}

                    {/* Chat Options */}
                    {analysisType === "chat" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="user-message">Your Question</Label>
                          <Textarea
                            id="user-message"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Ask a question about the document"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="chat-mode">Chat Mode</Label>
                          <Select value={chatMode} onValueChange={(value) => setChatMode(value as "Document Only" | "Layman Explanation" | "Hybrid (Smart)" | "General Chat")}>
                            <SelectTrigger id="chat-mode">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Document Only">Document Only</SelectItem>
                              <SelectItem value="Layman Explanation">Layman Explanation</SelectItem>
                              <SelectItem value="Hybrid (Smart)">Hybrid (Smart)</SelectItem>
                              <SelectItem value="General Chat">General Chat</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {chatMode === "Document Only"
                              ? "Get detailed, professional answers based on the document content"
                              : chatMode === "Layman Explanation"
                                ? "Get simple explanations in everyday language"
                                : chatMode === "Hybrid (Smart)"
                                  ? "Intelligent combination of document content and general knowledge"
                                  : "General legal chat using broad knowledge base"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="temperature">Response Creativity ({temperature})</Label>
                          <Slider
                            id="temperature"
                            min={0}
                            max={1}
                            step={0.1}
                            value={[temperature]}
                            onValueChange={(value) => setTemperature(value[0])}
                          />
                          <p className="text-xs text-muted-foreground">
                            Lower values (0.0-0.3) = more focused and deterministic responses.
                            Higher values (0.7-1.0) = more creative and varied responses.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="max-tokens">Response Length ({maxTokens} tokens)</Label>
                          <Slider
                            id="max-tokens"
                            min={500}
                            max={4000}
                            step={100}
                            value={[maxTokens]}
                            onValueChange={(value) => setMaxTokens(value[0])}
                          />
                          <p className="text-xs text-muted-foreground">
                            Adjust the maximum length of the AI response. Higher values allow for longer, more detailed answers.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || files.length === 0}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview/Info Panel */}
            <div className="lg:col-span-4">
              <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm sticky top-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Analysis Preview</CardTitle>
                      <CardDescription className="text-sm">Upload a document to begin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Quick Info</p>
                      <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>AI-powered analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Multiple analysis types</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Export in various formats</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // AFTER ANALYSIS: Clean Vertical Layout
          <div className="space-y-6">
            {/* RESULTS CARD - Full Width */}
            <Card className="border-2 border-gray-200 bg-white shadow-lg">
              <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Analysis Complete</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {getAnalysisTitle(analysisType)} • {files[0]?.name}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Main Results Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {getAnalysisTitle(analysisType)}
                    </h3>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto bg-gray-50 rounded-lg p-6 border-2 border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* Extract Text Results */}
                    {analysisType === "extract-text" && analysisResult.tagged_sections && analysisResult.tagged_sections.length > 0 ? (
                      <div className="space-y-4">
                        {analysisResult.tagged_sections.map((section, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">{section.heading || `Section ${idx + 1}`}</h4>
                            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">{section.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : analysisType === "extract-text" && analysisResult.raw_text ? (
                      <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">{analysisResult.raw_text}</p>
                    ) : analysisType === "clauses" && analysisResult.clause_analysis && analysisResult.clause_analysis.length > 0 ? (
                      /* Clause Analysis Results */
                      <div className="space-y-4">
                        {analysisResult.clause_analysis.map((section, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">{section.heading}</h4>
                            <div className="space-y-2">
                              {section.clauses.map((clause, cIdx) => (
                                <div key={cIdx} className="pl-3 border-l-2 border-teal-500 py-2">
                                  <p className="text-sm text-gray-700 mb-1">{clause.clause}</p>
                                  <p className="text-xs text-gray-600 italic">{clause.summary}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : analysisType === "clauses" && analysisResult.clauses && analysisResult.clauses.length > 0 ? (
                      /* Alternative Clause Format */
                      <div className="space-y-3">
                        {analysisResult.clauses.map((clause, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-gray-900">{clause.type || clause.clause_type}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${clause.risk_level === 'high' || clause.severity === 'high' ? 'bg-red-100 text-red-800' :
                                clause.risk_level === 'medium' || clause.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                {clause.risk_level || clause.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{clause.text || clause.risk_description}</p>
                            {clause.recommendation && (
                              <p className="text-xs text-teal-700 mt-2">💡 {clause.recommendation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : analysisType === "risk" && analysisResult.risks && analysisResult.risks.length > 0 ? (
                      /* Risk Analysis Results - Dynamic Rendering */
                      <div className="space-y-4">
                        {analysisResult.risks.map((risk, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            {Object.entries(risk).map(([key, value]) => {
                              // Skip null or undefined values
                              if (value === null || value === undefined) return null;

                              // Special handling for severity to show colored badge
                              if (key === 'severity') {
                                return (
                                  <div key={key} className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-gray-700 capitalize">{key}:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'High' || value === 'high' ? 'bg-red-100 text-red-800' :
                                      value === 'Medium' || value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        value === 'Low' || value === 'low' ? 'bg-green-100 text-green-800' :
                                          'bg-blue-100 text-blue-800'
                                      }`}>
                                      {String(value)}
                                    </span>
                                  </div>
                                );
                              }

                              // Special handling for type/clause_type to show as title
                              if (key === 'type' || key === 'clause_type') {
                                return (
                                  <h3 key={key} className="font-semibold text-gray-900 mb-2">
                                    {String(value)}
                                  </h3>
                                );
                              }

                              // Format the key for display
                              const formattedKey = key
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase());

                              // For complex objects, stringify them
                              const displayValue = typeof value === 'object'
                                ? JSON.stringify(value, null, 2)
                                : String(value);

                              return (
                                <div key={key} className="mb-2">
                                  <span className="font-medium text-gray-700 capitalize">{formattedKey}:</span>
                                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                    {displayValue}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ) : analysisType === "chronology" && analysisResult.timeline?.events && analysisResult.timeline.events.length > 0 ? (
                      /* Chronology Builder Results */
                      <div className="space-y-4">
                        {analysisResult.timeline.events.map((event, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">{event.event_type}</h3>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {(event.confidence_score * 100).toFixed(1)}% Confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                            {event.temporal_expressions && event.temporal_expressions.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {event.temporal_expressions.map((expr, exprIdx) => (
                                  <span key={exprIdx} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                    {expr.text}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Default: Summary/Analysis text */
                      <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                        {analysisResult.summary || analysisResult.analysis || "Analysis completed successfully."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Risk Analysis Configuration Options - Only show when analysisType is "risk" */}
                {analysisType === "risk" && (
                  <Card className="bg-white border border-gray-200 mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Sliders className="h-4 w-4 text-gray-600" />
                        Risk Analysis Configuration
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Customize your risk analysis parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="document-type-slide">Document Type</Label>
                          <Select value={documentType} onValueChange={setDocumentType}>
                            <SelectTrigger id="document-type-slide">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="nda">NDA</SelectItem>
                              <SelectItem value="employment_agreement">Employment Agreement</SelectItem>
                              <SelectItem value="lease">Lease</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assessment-focus-slide">Assessment Focus</Label>
                          <Select value={assessmentFocus} onValueChange={setAssessmentFocus}>
                            <SelectTrigger id="assessment-focus-slide">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="comprehensive">Comprehensive</SelectItem>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="risk-categories-slide">Risk Categories (comma-separated)</Label>
                          <Input
                            id="risk-categories-slide"
                            value={riskCategories}
                            onChange={(e) => setRiskCategories(e.target.value)}
                            placeholder="financial,legal,compliance,operational"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-instructions-slide">Custom Instructions</Label>
                          <Textarea
                            id="custom-instructions-slide"
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="Enter any custom instructions for risk assessment"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-recommendations-slide"
                            checked={includeRecommendations}
                            onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
                          />
                          <Label htmlFor="include-recommendations-slide">Include Recommendations</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Chronology Builder Configuration Options - Only show when analysisType is "chronology" */}
                {analysisType === "chronology" && (
                  <Card className="bg-white border border-gray-200 mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        Chronology Builder Configuration
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Set the document date for chronology analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="document-date-slide">Document Date (YYYY-MM-DD)</Label>
                          <Input
                            id="document-date-slide"
                            type="text"
                            value={documentDate}
                            onChange={(e) => setDocumentDate(e.target.value)}
                            placeholder="2024-01-01"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Sources Section */}
                  {analysisResult.sources && analysisResult.sources.length > 0 && (
                    <Card className="bg-white border-2 border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <FileIcon className="h-5 w-5 text-blue-600" />
                          Sources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResult.sources.map((source, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <FileIcon className="h-3 w-3 text-teal-600" />
                              <span>{source.file_name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Processing Metadata Section */}
                  <Card className="bg-white border-2 border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        Processing Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Processing Time:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {analysisResult.processing_time?.toFixed(2)}s
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tokens Used:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {analysisResult.tokens_used?.toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Analysis ID:</span>
                          <span className="font-mono text-xs text-gray-700 ml-2 break-all">
                            {analysisResult.analysis_id}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Export & Actions */}
                  <div className="col-span-full mt-2">
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport('txt')}
                          className="h-10 px-4 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          TXT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport('pdf')}
                          className="h-10 px-4 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport('docx')}
                          className="h-10 px-4 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          DOCX
                        </Button>
                      </div>
                      <Card className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-blue-700 hover:text-blue-900 hover:bg-blue-100/50 font-medium"
                          size="sm"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Ask follow-up questions
                        </Button>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RECONFIGURE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Upload Another Document */}
              <Card className="border-2 border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-800">Upload New Document</CardTitle>
                      <CardDescription className="text-xs">Analyze another file</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer border-gray-300 hover:border-blue-500 hover:bg-blue-50/50">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-after"
                    />
                    <label htmlFor="file-upload-after" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        Upload more files
                      </p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-600">
                        Uploaded Files
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs"
                          >
                            <FileIcon className="h-3 w-3 text-teal-600" />
                            <span className="font-medium text-teal-900 max-w-[150px] truncate">
                              {file.name}
                            </span>
                            {file.status === "uploading" && (
                              <Loader2 className="h-3 w-3 animate-spin text-teal-600" />
                            )}
                            {file.status === "ready" && (
                              <CheckCircle2 className="h-3 w-3 text-teal-600" />
                            )}
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="ml-1 hover:bg-teal-100 rounded-full p-0.5 transition-colors"
                              aria-label="Remove file"
                            >
                              <X className="h-3 w-3 text-teal-700 hover:text-teal-900" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Select Analysis Mode */}
              <Card className="border-2 border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-800">Analysis Mode</CardTitle>
                      <CardDescription className="text-xs">Change analysis type</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Select value={analysisType} onValueChange={(value) => {
                      setAnalysisType(value);
                      // Don't clear analysis result in AFTER ANALYSIS section
                      // This keeps the current results visible while changing mode
                      setChatHistory([]);
                      setShowRightPanel(false);
                    }}>
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select analysis type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summarize">Summarize Document</SelectItem>
                        <SelectItem value="extract-text">Extract Text</SelectItem>
                        <SelectItem value="clauses">Extract Key Clauses</SelectItem>
                        <SelectItem value="risk">Risk Analysis</SelectItem>
                        <SelectItem value="chronology">Chronology Builder</SelectItem>
                        <SelectItem value="classify">Document Classification</SelectItem>
                        <SelectItem value="chat">Document Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button - Full Width */}
              <div className="col-span-full">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || files.length === 0}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Re-analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Re-analyze Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interact;