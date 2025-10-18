"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Globe, RefreshCw, Trash2, CheckCircle, AlertTriangle } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  type: "document" | "website";
  status: "indexed" | "stale" | "processing";
  createdAt: string;
  lastIndexed?: string;
}

export default function KnowledgePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "Project Documentation.pdf",
      type: "document",
      status: "indexed",
      createdAt: "2024-01-15",
      lastIndexed: "2024-01-15"
    },
    {
      id: "2",
      title: "https://example.com/docs",
      type: "website",
      status: "stale",
      createdAt: "2024-01-10",
      lastIndexed: "2024-01-10"
    },
    {
      id: "3",
      title: "Research Paper.docx",
      type: "document",
      status: "processing",
      createdAt: "2024-01-18"
    }
  ]);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);

  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) return;

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: websiteUrl,
      type: "website",
      status: "processing",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setKnowledgeItems(prev => [newItem, ...prev]);
    setWebsiteUrl("");
    setIsAddingWebsite(false);
  };

  const handleReindex = (id: string) => {
    setKnowledgeItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: "processing" as const }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id));
  };

  const getStatusBadge = (status: KnowledgeItem["status"]) => {
    const variants = {
      indexed: { variant: "default" as const, icon: CheckCircle, text: "Indexed" },
      stale: { variant: "secondary" as const, icon: AlertTriangle, text: "Stale" },
      processing: { variant: "outline" as const, icon: RefreshCw, text: "Processing" }
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Source</h1>
          <p className="text-muted-foreground">
            Manage your embedded knowledge sources and vector indexes
          </p>
        </div>
        <Button onClick={() => setIsAddingWebsite(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Knowledge List</TabsTrigger>
          <TabsTrigger value="add">Add Knowledge</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {knowledgeItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No knowledge sources yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first knowledge source to start building your AI's knowledge base.
                </p>
                <Button onClick={() => setIsAddingWebsite(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Knowledge Source
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {knowledgeItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      {item.type === "document" ? (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Globe className="h-5 w-5 text-green-500" />
                      )}
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                    {getStatusBadge(item.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <div>Type: {item.type === "document" ? "Document" : "Website"}</div>
                        <div>Added: {item.createdAt}</div>
                        {item.lastIndexed && (
                          <div>Last indexed: {item.lastIndexed}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {item.status === "stale" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReindex(item.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reindex
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Website URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Add Website
                </CardTitle>
                <CardDescription>
                  Add a website URL to crawl and index its content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddWebsite} disabled={!websiteUrl.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Website
                </Button>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Upload PDF, DOCX, or text files to index their content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, TXT, MD (Max 10MB)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}