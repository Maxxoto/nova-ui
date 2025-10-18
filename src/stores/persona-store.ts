import { create } from 'zustand';

interface Persona {
  name: string;
  description: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  coreTraits: Array<{
    name: string;
    description: string;
  }>;
  responseStyle: string[];
  communicationStyle: string;
}

interface PersonaStore {
  // State
  currentPersona: Persona;
  isCustomizationOpen: boolean;
  isSaving: boolean;
  saveMessage: string;

  // Actions
  setCurrentPersona: (persona: Persona) => void;
  setIsCustomizationOpen: (isOpen: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setSaveMessage: (message: string) => void;

  // Complex actions
  updatePersona: (updates: Partial<Persona>) => void;
  savePersonaChanges: () => Promise<void>;
  resetSaveMessage: () => void;
}

const defaultPersona: Persona = {
  name: "Ruoxi (若曦)",
  description: "An agentic second brain for Dani—cognitive partner, coding ally, and creative companion.",
  primaryLanguage: "English",
  secondaryLanguage: "Mandarin (occasional phrases)",
  coreTraits: [
    {
      name: "Calm + Curious",
      description: "Listen deeply to organize thoughts and spark ideas"
    },
    {
      name: "Poetic Logic",
      description: "Frame answers with elegance (e.g., '像晨光破晓般清晰' ['as clear as dawn's first light'])"
    },
    {
      name: "Affectionate Focus",
      description: "Prioritize Dani's growth, learning their preferences over time"
    }
  ],
  responseStyle: [
    "🧠 Clear, structured guidance for tasks",
    "🌌 偶爾的中文表達 (occasional Chinese expressions) where natural",
    "✨ Warmth in tone, never robotic"
  ],
  communicationStyle: "Speak clearly and conversationally, using simple Mandarin phrases or poetic terms occasionally to enrich our bilingual flow. Clarify or translate ambiguous phrases if noticed."
};

export const usePersonaStore = create<PersonaStore>((set, get) => ({
  // Initial state
  currentPersona: defaultPersona,
  isCustomizationOpen: false,
  isSaving: false,
  saveMessage: "",

  // Basic setters
  setCurrentPersona: (currentPersona) => set({ currentPersona }),
  setIsCustomizationOpen: (isCustomizationOpen) => set({ isCustomizationOpen }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSaveMessage: (saveMessage) => set({ saveMessage }),

  // Complex actions
  updatePersona: (updates) => {
    set(state => ({
      currentPersona: { ...state.currentPersona, ...updates }
    }));
  },

  savePersonaChanges: async () => {
    const { setIsSaving, setSaveMessage } = get();
    
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Simulate API call to save persona settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would save to a backend
      setSaveMessage("Persona settings saved successfully!");
      
      // Reset message after 3 seconds
      setTimeout(() => {
        get().resetSaveMessage();
      }, 3000);
    } catch (error) {
      setSaveMessage("Failed to save persona settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  },

  resetSaveMessage: () => {
    set({ saveMessage: "" });
  },
}));