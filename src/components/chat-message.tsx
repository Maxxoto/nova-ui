"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import React from "react";
import { ThinkingDropdown } from "./thinking-dropdown";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  avatarUrl?: string;
  avatarFallback?: string;
  personaName?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  isUser,
  timestamp,
  avatarUrl = isUser ? undefined : "/images/avatars/nova-avatar.jpeg",
  personaName,
  avatarFallback = isUser ? "You" : personaName || "Ai",
  isStreaming = false,
}: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [parsedThinking, setParsedThinking] = useState<string | null>(null);

  // Parse thinking tokens from message content
  useEffect(() => {
    if (isUser) {
      setDisplayedMessage(message);
      setParsedThinking(null);
      return;
    }

    // Extract thinking content from <think> tags
    const thinkMatch = message.match(/<think>([\s\S]*?)<\/think>/);
    let cleanMessage = message;
    let extractedThinking = null;

    if (thinkMatch) {
      extractedThinking = thinkMatch[1].trim();
      // Remove thinking tags from the main message
      cleanMessage = message.replace(/<think>[\s\S]*?<\/think>/, "").trim();
    }

    setParsedThinking(extractedThinking);

    if (isStreaming) {
      // For streaming, update immediately when message changes
      setDisplayedMessage(cleanMessage);
      setIsTyping(cleanMessage.length > 0);
    } else {
      // For non-streaming messages, show full content immediately
      setDisplayedMessage(cleanMessage);
      setIsTyping(false);
    }
  }, [message, isUser, isStreaming]);

  // Handle smooth animation for initial streaming when message is empty
  useEffect(() => {
    if (isStreaming && message.length === 0) {
      // Show thinking animation when streaming but no content yet
      setIsTyping(true);
    }
  }, [isStreaming, message.length]);

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs font-medium">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gray-700 text-white shadow-sm"
            : "bg-white dark:bg-transparent  border-gray-200 dark:border-gray-700 shadow-sm"
        )}
      >
        {isUser ? (
          <p className="text-base/10 leading-relaxed whitespace-pre-wrap">
            {displayedMessage}
          </p>
        ) : (
          <div className="text-base leading-relaxed prose max-w-none">
            {!isUser && parsedThinking && (
              <ThinkingDropdown thinkingProcess={parsedThinking} />
            )}
            {displayedMessage ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
                components={{
                  // Handle ordered lists properly
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                      {children}
                    </ol>
                  ),
                  // Handle unordered lists properly
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                      {children}
                    </ul>
                  ),
                  // Handle list items
                  li: ({ children, ...props }) => (
                    <li className="ml-4" {...props}>
                      {children}
                    </li>
                  ),
                  // Handle paragraphs with proper spacing
                  p: ({ children, ...props }) => (
                    <p className="mb-2" {...props}>
                      {children}
                    </p>
                  ),
                  code: (props) => {
                    const { node, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const codeContent = String(children).replace(/\n$/, "");
                    const isInline = !className?.includes("language-");

                    if (!isInline && language) {
                      return (
                        <div className="my-4 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-300">
                            <span className="font-medium">{language}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(codeContent);
                              }}
                              className="hover:text-white transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={language}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0 0 0.5rem 0.5rem",
                              fontSize: "0.875rem",
                              lineHeight: "1.25rem",
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily:
                                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                              },
                            }}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      );
                    } else if (!isInline) {
                      return (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono block my-2"
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    } else {
                      return (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono"
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    }
                  },
                  td: ({ children, ...props }) => (
                    <td {...props}>
                      {Array.isArray(children)
                        ? children.map((child, index) =>
                            typeof child === "string"
                              ? child.split("\n").map((line, lineIndex) => (
                                  <React.Fragment key={lineIndex}>
                                    {line}
                                    {lineIndex <
                                      child.split("\n").length - 1 && <br />}
                                  </React.Fragment>
                                ))
                              : child
                          )
                        : children}
                    </td>
                  ),
                  th: ({ children, ...props }) => (
                    <th {...props}>
                      {Array.isArray(children)
                        ? children.map((child, index) =>
                            typeof child === "string"
                              ? child.split("\n").map((line, lineIndex) => (
                                  <React.Fragment key={lineIndex}>
                                    {line}
                                    {lineIndex <
                                      child.split("\n").length - 1 && <br />}
                                  </React.Fragment>
                                ))
                              : child
                          )
                        : children}
                    </th>
                  ),
                }}
              >
                {displayedMessage}
              </ReactMarkdown>
            ) : isStreaming ? (
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <span className="text-sm">Thinking</span>
                <div className="flex space-x-1">
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            ) : null}
            {isTyping && displayedMessage && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
            )}
          </div>
        )}

        <p
          className={cn(
            "text-xs mt-2",
            isUser ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
}
