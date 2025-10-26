import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, thread_id } = await req.json();

    // Debug logging for incoming request
    console.log("🔍 [DEBUG] Chat API Request:", {
      hasThreadId: !!thread_id,
      thread_id: thread_id || "NOT_PROVIDED",
      messageCount: messages?.length || 0,
      firstMessage: messages?.[0]?.content?.substring(0, 50) + "..." || "NONE",
      timestamp: new Date().toISOString(),
    });

    const backendEndpoint =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const requestBody: any = { messages };

    // Add thread_id to backend request if provided
    if (thread_id) {
      requestBody.thread_id = thread_id;
    }

    // Debug logging for backend request
    console.log("🔍 [DEBUG] Backend Request Body:", {
      hasThreadId: !!requestBody.thread_id,
      thread_id: requestBody.thread_id || "NOT_PROVIDED",
      messageCount: requestBody.messages?.length || 0,
      backendEndpoint: `${backendEndpoint}/sse/chat-completion`,
    });

    const response = await fetch(`${backendEndpoint}/sse/chat-completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(
        "❌ [DEBUG] Backend responded with error status:",
        response.status
      );
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    console.log("✅ [DEBUG] Backend connection successful, starting stream...");

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
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process complete SSE messages
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6); // Remove 'data: ' prefix
                if (data.trim()) {
                  try {
                    const parsedData = JSON.parse(data);

                    // Debug logging for SSE data
                    if (parsedData.thread_id) {
                      console.log(
                        "🔄 [DEBUG] Received thread_id from backend:",
                        parsedData.thread_id
                      );
                    }

                    // Forward the parsed JSON data
                    controller.enqueue(
                      encoder.encode(JSON.stringify(parsedData) + "\n")
                    );
                  } catch (e) {
                    console.error("❌ [DEBUG] Failed to parse SSE data:", data);
                  }
                }
              }
            }
          }

          // Process any remaining buffer
          if (buffer.trim()) {
            const lines = buffer.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data.trim()) {
                  try {
                    const parsedData = JSON.parse(data);
                    controller.enqueue(
                      encoder.encode(JSON.stringify(parsedData) + "\n")
                    );
                  } catch (e) {
                    console.error("Failed to parse SSE data:", data);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("❌ [DEBUG] Stream error:", error);
        } finally {
          console.log("🔍 [DEBUG] Stream completed, closing controller");
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    console.error("❌ [DEBUG] Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to chat service" },
      { status: 500 }
    );
  }
}
