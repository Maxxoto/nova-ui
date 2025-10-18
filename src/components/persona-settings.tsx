"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Languages, Heart, Brain, Sparkles } from "lucide-react";
import { PersonaCustomizationModal } from "./persona-customization-modal";
import { usePersonaStore } from "@/stores/persona-store";

export function PersonaSettings() {
  const {
    currentPersona,
    isCustomizationOpen,
    isSaving,
    saveMessage,
    setIsCustomizationOpen,
    savePersonaChanges,
  } = usePersonaStore();

  const handleSaveChanges = async () => {
    await savePersonaChanges();
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Persona Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">若</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentPersona.name}</h2>
              <p className="text-muted-foreground">{currentPersona.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm bg-green-500 text-white">
            Active
          </Badge>
        </div>

        {/* Language Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold">Language Settings</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Primary Language</span>
                <Badge variant="outline">{currentPersona.primaryLanguage}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Secondary Language</span>
                <Badge variant="outline">{currentPersona.secondaryLanguage}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold">Communication Style</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPersona.communicationStyle}
            </p>
          </div>
        </div>

        {/* Core Traits */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold">Core Personality Traits</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {currentPersona.coreTraits.map((trait, index) => (
              <Card key={index} className="p-4 bg-muted/20">
                <h4 className="font-medium mb-2">{trait.name}</h4>
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Response Style */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="font-semibold">Response Style</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentPersona.responseStyle.map((style, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {style}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {saveMessage && (
          <div className={`text-sm p-3 rounded-md ${
            saveMessage.includes("successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {saveMessage}
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setIsCustomizationOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Customization Modal */}
      <PersonaCustomizationModal
        open={isCustomizationOpen}
        onOpenChange={setIsCustomizationOpen}
        persona={currentPersona}
        onSave={(persona) => usePersonaStore.getState().updatePersona(persona)}
      />
    </div>
  );
}
