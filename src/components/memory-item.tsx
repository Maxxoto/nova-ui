"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  Image,
  Trash2,
  Tag,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryItemProps {
  id: string;
  title: string;
  content: string;
  type: "text" | "image" | "conversation";
  tags: string[];
  createdAt: Date;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTags: (id: string) => void;
}

export function MemoryItem({
  id,
  title,
  content,
  type,
  tags,
  createdAt,
  onView,
  onDelete,
  onEditTags,
}: MemoryItemProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "conversation":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{getTypeIcon()}</div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>

            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {content}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Saved {formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(id)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditTags(id)}>
              <Tag className="h-4 w-4 mr-2" />
              Edit Tags
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
