import { create } from 'zustand';

// Function to handle SSE streaming that can be used with useMutation
export const sendChatMessage = async (
  content: string,
  onStreamUpdate: (content: string) => void
): Promise<void> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body received');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsedData = JSON.parse(line);
            if (parsedData.content && parsedData.type === 'chunk') {
              onStreamUpdate(parsedData.content);
            }
          } catch (e) {
            // Skip non-JSON lines or parsing errors
            console.warn('Failed to parse line:', line);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      try {
        const parsedData = JSON.parse(buffer);
        if (parsedData.content && parsedData.type === 'chunk') {
          onStreamUpdate(parsedData.content);
        }
      } catch (e) {
        console.warn('Failed to parse remaining buffer:', buffer);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

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
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'connecting';

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSessionId: (sessionId: string) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setConnectionStatus: (
    status: 'connected' | 'disconnected' | 'error' | 'connecting'
  ) => void;

  // Complex actions
  addMessage: (sessionId: string, message: Message) => void;
  createNewSession: () => string;
  selectSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  testConnection: () => Promise<boolean>;
}

const initialSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Welcome Chat',
    lastMessage: "Hello! I'm Nova, your AI assistant.",
    timestamp: new Date(),
    messageCount: 1,
    messages: [
      {
        id: '1',
        content:
          "Hello! I'm Nova, your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ],
  },
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  sessions: initialSessions,
  activeSessionId: '1',
  isFullscreen: false,
  isSidebarOpen: true,
  isLoading: false,
  connectionStatus: 'disconnected',

  // Basic setters
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  // Complex actions
  addMessage: (sessionId, message) => {
    const { sessions } = get();
    const updatedSessions = sessions.map((session) => {
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
      title: 'New Chat',
      lastMessage: 'Start a new conversation',
      timestamp: new Date(),
      messageCount: 0,
      messages: [],
    };

    set((state) => ({
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

    try {
      // Create AI message placeholder
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        content: '',
        isUser: false,
        timestamp: new Date(),
      };

      // Add empty AI message to start streaming
      addMessage(activeSessionId, aiMessage);

      let accumulatedContent = '';

      // Use the sendChatMessage function with streaming callback
      await sendChatMessage(content, (chunk) => {
        accumulatedContent += chunk;

        // Update the AI message with the accumulated content
        const { sessions } = get();
        const updatedSessions = sessions.map((session) => {
          if (session.id === activeSessionId) {
            const updatedMessages = session.messages.map((message) => {
              if (message.id === aiMessageId) {
                return {
                  ...message,
                  content: accumulatedContent,
                };
              }
              return message;
            });
            return {
              ...session,
              messages: updatedMessages,
              lastMessage: accumulatedContent,
              timestamp: new Date(),
            };
          }
          return session;
        });
        set({ sessions: updatedSessions });
      });
    } catch (error) {
      console.error('Error sending message:', error);

      // Update the AI message with error
      const { sessions } = get();
      const updatedSessions = sessions.map((session) => {
        if (session.id === activeSessionId) {
          const updatedMessages = session.messages.map((message) => {
            if (message.id === (Date.now() + 1).toString()) {
              return {
                ...message,
                content:
                  'Sorry, I encountered an error while processing your message. Please try again.',
              };
            }
            return message;
          });
          return {
            ...session,
            messages: updatedMessages,
            lastMessage: 'Error occurred',
            timestamp: new Date(),
          };
        }
        return session;
      });
      set({ sessions: updatedSessions });
    } finally {
      setIsLoading(false);
    }
  },

  testConnection: async () => {
    try {
      const { setConnectionStatus } = get();
      setConnectionStatus('connecting');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'test',
            },
          ],
        }),
      });

      if (response.ok) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('error');
        return false;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      const { setConnectionStatus } = get();
      setConnectionStatus('error');
      return false;
    }
  },
}));
