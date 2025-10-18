import { MemoryList } from "@/components/memory-list";

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Memory Log
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal mind log - see what Nova remembers about you
          </p>
        </div>
        
        <MemoryList />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            All your memories are stored securely and can be managed here
          </p>
        </div>
      </div>
    </div>
  );
}