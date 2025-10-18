import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

interface ChatStore {
  // State
  sessions: ChatSession[];
  activeSessionId: string | null;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  isLoading: boolean;

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSessionId: (sessionId: string) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  
  // Complex actions
  addMessage: (sessionId: string, message: Message) => void;
  createNewSession: () => string;
  selectSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

const initialSessions: ChatSession[] = [
  {
    id: "1",
    title: "Welcome Chat",
    lastMessage: "Hello! I'm Nova, your AI assistant.",
    timestamp: new Date(),
    messageCount: 1,
    messages: [
      {
        id: "1",
        content: "Hello! I'm Nova, your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ],
  },
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  sessions: initialSessions,
  activeSessionId: "1",
  isFullscreen: false,
  isSidebarOpen: true,
  isLoading: false,

  // Basic setters
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // Complex actions
  addMessage: (sessionId, message) => {
    const { sessions } = get();
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        const updatedMessages = [...session.messages, message];
        return {
          ...session,
          messages: updatedMessages,
          lastMessage: message.content,
          messageCount: updatedMessages.length,
          timestamp: new Date(),
        };
      }
      return session;
    });
    set({ sessions: updatedSessions });
  },

  createNewSession: () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
      messageCount: 0,
      messages: [],
    };
    
    set(state => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newSessionId,
    }));

    return newSessionId;
  },

  selectSession: (sessionId) => {
    set({ activeSessionId: sessionId });
  },

  sendMessage: async (content: string) => {
    const { activeSessionId, addMessage, setIsLoading } = get();
    
    if (!activeSessionId) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    addMessage(activeSessionId, userMessage);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${content}". This is a simulated response. In a real implementation, this would connect to your AI backend.`,
        isUser: false,
        timestamp: new Date(),
      };

      addMessage(activeSessionId, aiMessage);
      setIsLoading(false);
    }, 1000);
  },
}));