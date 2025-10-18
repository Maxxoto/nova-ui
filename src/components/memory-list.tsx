"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryItem } from "./memory-item";
import { Search, Filter, X } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  content: string;
  type: "text" | "image" | "conversation";
  tags: string[];
  createdAt: Date;
}

// Mock data - in a real app, this would come from an API
const mockMemories: Memory[] = [
  {
    id: "1",
    title: "Favorite programming languages",
    content:
      "User mentioned they prefer TypeScript over JavaScript for large projects",
    type: "conversation",
    tags: ["programming", "preferences", "work"],
    createdAt: new Date("2024-10-15"),
  },
  {
    id: "2",
    title: "Travel preferences",
    content:
      "User enjoys beach destinations and prefers warm climates for vacations",
    type: "text",
    tags: ["travel", "preferences", "personal"],
    createdAt: new Date("2024-10-10"),
  },
  {
    id: "3",
    title: "Learning goals",
    content:
      "User wants to learn machine learning and AI development in the next 6 months",
    type: "conversation",
    tags: ["learning", "goals", "career"],
    createdAt: new Date("2024-10-05"),
  },
  {
    id: "4",
    title: "Food preferences",
    content:
      "User is vegetarian and enjoys trying new cuisines, especially Asian food",
    type: "text",
    tags: ["food", "preferences", "personal"],
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "5",
    title: "Project ideas",
    content:
      "User mentioned interest in building a personal finance tracking app",
    type: "conversation",
    tags: ["projects", "ideas", "finance"],
    createdAt: new Date("2024-09-28"),
  },
];

export function MemoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique tags from memories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockMemories.forEach((memory) => {
      memory.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter memories based on search query and selected tags
  const filteredMemories = useMemo(() => {
    return mockMemories.filter((memory) => {
      const matchesSearch =
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => memory.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const handleViewMemory = (id: string) => {
    console.log("View memory:", id);
    // In a real app, this would open a modal or navigate to a detail page
  };

  const handleDeleteMemory = (id: string) => {
    console.log("Delete memory:", id);
    // In a real app, this would call an API to delete the memory
  };

  const handleEditTags = (id: string) => {
    console.log("Edit tags for memory:", id);
    // In a real app, this would open a tag editor
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by Tags</h4>
              {(searchQuery || selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMemories.length}{" "}
          {filteredMemories.length === 1 ? "memory" : "memories"} found
        </p>
        {(searchQuery || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-1 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Memory List */}
      <div className="space-y-4">
        {filteredMemories.map((memory) => (
          <MemoryItem
            key={memory.id}
            {...memory}
            onView={handleViewMemory}
            onDelete={handleDeleteMemory}
            onEditTags={handleEditTags}
          />
        ))}

        {filteredMemories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No memories found</div>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedTags.length > 0
                ? "Try adjusting your search or filters"
                : "Start chatting with Nova to build your memory log"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
