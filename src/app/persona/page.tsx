import { PersonaSettings } from "@/components/persona-settings";

export default function PersonaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Persona Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Customize your AI assistant's personality and behavior
          </p>
        </div>
        
        <PersonaSettings />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Your AI companion adapts to your preferences and communication style
          </p>
        </div>
      </div>
    </div>
  );
}