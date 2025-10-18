import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Nova AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personalized AI companion with elegant, modern interface.
          </p>
        </div>

        <ChatInterface />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Powered by Next.js • Shadcn UI</p>
        </div>
      </div>
    </div>
  );
}
