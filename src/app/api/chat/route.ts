import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const response = await fetch("http://localhost:8000/sse/chat-completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        // Create a ReadableStream to pipe the backend SSE response
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    let buffer = '';
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;

                        // Process complete SSE messages
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || ''; // Keep incomplete line in buffer

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6); // Remove 'data: ' prefix
                                if (data.trim()) {
                                    try {
                                        const parsedData = JSON.parse(data);
                                        // Forward the parsed JSON data
                                        controller.enqueue(encoder.encode(JSON.stringify(parsedData) + '\n'));
                                    } catch (e) {
                                        console.error('Failed to parse SSE data:', data);
                                    }
                                }
                            }
                        }
                    }

                    // Process any remaining buffer
                    if (buffer.trim()) {
                        const lines = buffer.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data.trim()) {
                                    try {
                                        const parsedData = JSON.parse(data);
                                        controller.enqueue(encoder.encode(JSON.stringify(parsedData) + '\n'));
                                    } catch (e) {
                                        console.error('Failed to parse SSE data:', data);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Stream error:", error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Cache-Control",
            },
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to connect to chat service" },
            { status: 500 }
        );
    }
}