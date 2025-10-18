"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatSidebar } from "./chat-sidebar";
import { Maximize2, Minimize2, PanelLeft, PanelRight } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { usePersonaStore } from "@/stores/persona-store";

export function ChatInterface() {
    const {
        sessions,
        activeSessionId,
        isFullscreen,
        isSidebarOpen,
        isLoading,
        setIsFullscreen,
        setIsSidebarOpen,
        sendMessage,
        createNewSession,
        selectSession,
    } = useChatStore();

    const { currentPersona } = usePersonaStore();

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const activeSession = sessions.find(session => session.id === activeSessionId);

    const handleSendMessage = async (content: string) => {
        await sendMessage(content);
    };

    const handleNewChat = () => {
        createNewSession();
    };

    const handleSessionSelect = (sessionId: string) => {
        selectSession(sessionId);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }
        };

        const timer = setTimeout(scrollToBottom, 0);
        return () => clearTimeout(timer);
    }, [activeSession?.messages]);

    return (
        <div className={`flex h-[600px] w-full max-w-7xl mx-auto gap-4 ${isFullscreen ? "fixed inset-0 z-50 h-screen w-screen max-w-none m-0 bg-background p-4" : ""
            }`}>
            {/* Sidebar */}
            {isSidebarOpen && (
                <div className={`w-80 flex-shrink-0 ${isFullscreen ? "h-full" : ""
                    }`}>
                    <ChatSidebar
                        sessions={sessions}
                        activeSessionId={activeSessionId}
                        onSessionSelect={handleSessionSelect}
                        onNewChat={handleNewChat}
                        className={isFullscreen ? "h-full" : ""}
                    />
                </div>
            )}

            {/* Main Chat Area */}
            <Card className={`flex flex-col flex-1 ${isFullscreen ? "h-full" : ""
                }`}>
                {/* Header with controls */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSidebar}
                            className="h-8 w-8 p-0"
                        >
                            {isSidebarOpen ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                        </Button>
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                            <h1 className="font-semibold">Nova AI Assistant</h1>
                            <p className="text-sm text-muted-foreground">
                                {activeSession?.title || "Chat"}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="h-8 w-8 p-0"
                    >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea
                        ref={scrollAreaRef}
                        className="h-full"
                    >
                        <div className="p-4">
                            <div className="space-y-4">
                                {activeSession?.messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message.content}
                                        isUser={message.isUser}
                                        timestamp={message.timestamp}
                                        personaName={currentPersona.name}
                                        avatarFallback={message.isUser ? "You" : currentPersona.name}
                                    />
                                ))}
                                {isLoading && (
                                    <ChatMessage
                                        message="Thinking..."
                                        isUser={false}
                                        timestamp={new Date()}
                                        avatarUrl="/images/avatars/nova-avatar.jpeg"
                                        personaName={currentPersona.name}
                                        avatarFallback={currentPersona.name}
                                    />
                                )}
                                {!activeSession?.messages.length && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>Start a conversation with Nova</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Input Area */}
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder="Ask me anything..."
                />
            </Card>
        </div>
    );
}
