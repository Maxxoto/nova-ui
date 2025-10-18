"use client";

import { useState } from "react";
import { usePersonaStore } from "@/stores/persona-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

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

interface PersonaCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: Persona;
  onSave: (persona: Persona) => void;
}

export function PersonaCustomizationModal({
  open,
  onOpenChange,
  persona,
  onSave,
}: PersonaCustomizationModalProps) {
  const { updatePersona } = usePersonaStore();
  const [editedPersona, setEditedPersona] = useState<Persona>(persona);
  const [newTrait, setNewTrait] = useState({ name: "", description: "" });
  const [selectedTrait, setSelectedTrait] = useState("");
  const [selectedResponseStyle, setSelectedResponseStyle] = useState("");

  const handleSave = () => {
    // Update the Zustand store with the edited persona
    updatePersona(editedPersona);
    // Call the original onSave prop if provided (for backward compatibility)
    if (onSave) {
      onSave(editedPersona);
    }
    onOpenChange(false);
  };

  const addTrait = () => {
    if (selectedTrait.trim()) {
      const presetTraits = {
        "Calm": "Maintains composure and provides thoughtful responses",
        "Curious": "Asks clarifying questions and explores topics deeply",
        "Empathetic": "Shows understanding and emotional intelligence",
        "Analytical": "Breaks down complex problems systematically",
        "Creative": "Generates innovative ideas and solutions",
        "Patient": "Takes time to explain concepts thoroughly",
        "Encouraging": "Provides positive reinforcement and motivation",
        "Direct": "Gets straight to the point without unnecessary details",
        "Humorous": "Uses appropriate humor to lighten conversations",
        "Professional": "Maintains formal and business-appropriate tone",
        "Friendly": "Uses warm and approachable communication style",
        "Technical": "Focuses on technical accuracy and precision",
        "Supportive": "Offers help and guidance when needed",
        "Adaptive": "Adjusts communication style based on context"
      };

      const traitName = selectedTrait;
      const traitDescription = presetTraits[traitName as keyof typeof presetTraits] || "Custom trait";
      
      setEditedPersona(prev => ({
        ...prev,
        coreTraits: [...prev.coreTraits, { name: traitName, description: traitDescription }]
      }));
      setSelectedTrait("");
    }
  };

  const removeTrait = (index: number) => {
    setEditedPersona(prev => ({
      ...prev,
      coreTraits: prev.coreTraits.filter((_, i) => i !== index)
    }));
  };

  const addResponseStyle = () => {
    if (selectedResponseStyle.trim()) {
      setEditedPersona(prev => ({
        ...prev,
        responseStyle: [...prev.responseStyle, selectedResponseStyle.trim()]
      }));
      setSelectedResponseStyle("");
    }
  };

  const removeResponseStyle = (index: number) => {
    setEditedPersona(prev => ({
      ...prev,
      responseStyle: prev.responseStyle.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Persona</DialogTitle>
          <DialogDescription>
            Modify your AI assistant's personality, language preferences, and communication style.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Persona Name</Label>
                <Input
                  id="name"
                  value={editedPersona.name}
                  onChange={(e) => setEditedPersona(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter persona name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedPersona.description}
                  onChange={(e) => setEditedPersona(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your AI assistant's role and purpose"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Language Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryLanguage">Primary Language</Label>
                <Select
                  value={editedPersona.primaryLanguage}
                  onValueChange={(value) => setEditedPersona(prev => ({ ...prev, primaryLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryLanguage">Secondary Language</Label>
                <Select
                  value={editedPersona.secondaryLanguage}
                  onValueChange={(value) => setEditedPersona(prev => ({ ...prev, secondaryLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select secondary language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Communication Style */}
          <div className="space-y-4">
            <h3 className="font-semibold">Communication Style</h3>
            <div className="space-y-2">
              <Label htmlFor="communicationStyle">Communication Style Description</Label>
              <Textarea
                id="communicationStyle"
                value={editedPersona.communicationStyle}
                onChange={(e) => setEditedPersona(prev => ({ ...prev, communicationStyle: e.target.value }))}
                placeholder="Describe how your AI assistant should communicate"
                rows={3}
              />
            </div>
          </div>

          {/* Core Traits */}
          <div className="space-y-4">
            <h3 className="font-semibold">Core Personality Traits</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {editedPersona.coreTraits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {trait.name}
                    <button
                      onClick={() => removeTrait(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {/* Add New Trait */}
              <div className="p-3 border border-dashed rounded-lg">
                <div className="space-y-2">
                  <Select
                    value={selectedTrait}
                    onValueChange={setSelectedTrait}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a personality trait" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Calm">Calm</SelectItem>
                      <SelectItem value="Curious">Curious</SelectItem>
                      <SelectItem value="Empathetic">Empathetic</SelectItem>
                      <SelectItem value="Analytical">Analytical</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Patient">Patient</SelectItem>
                      <SelectItem value="Encouraging">Encouraging</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Humorous">Humorous</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Supportive">Supportive</SelectItem>
                      <SelectItem value="Adaptive">Adaptive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTrait}
                    className="w-full"
                    disabled={!selectedTrait}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trait
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Response Style */}
          <div className="space-y-4">
            <h3 className="font-semibold">Response Style</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {editedPersona.responseStyle.map((style, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {style}
                    <button
                      onClick={() => removeResponseStyle(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedResponseStyle}
                  onValueChange={setSelectedResponseStyle}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select response style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concise">Concise</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Storytelling">Storytelling</SelectItem>
                    <SelectItem value="Questioning">Questioning</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Encouraging">Encouraging</SelectItem>
                    <SelectItem value="Analytical">Analytical</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addResponseStyle}
                  disabled={!selectedResponseStyle}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}