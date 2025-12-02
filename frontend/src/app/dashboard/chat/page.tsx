'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Loader2, Sparkles } from 'lucide-react';
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
import { MarkdownMessage } from '@/components/ui/markdown-message';
import type { Message } from '@/lib/types';

const SAMPLE_QUESTIONS = [
  'What are the best places to visit in Dubai?',
  'Is it safe to visit Dubai during Ramadan?',
  'What should I wear in Dubai?',
  'Best time to visit Burj Khalifa?',
  'Halal restaurants near Dubai Marina?',
  'How to get from airport to downtown?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your Dubai Navigator AI assistant. I can help you with anything related to Dubai tourism - from attractions and restaurants to cultural etiquette and safety tips. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend chat API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1A73E8] to-[#3B82F6] flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1F2937]">AI Tourism Chatbot</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="gap-1 bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/30 px-2 py-0.5 text-xs">
                <Sparkles className="h-3 w-3" />
                Gemini 2.0
              </Badge>
              <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-[#6B7280]">Online and ready to help</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col border-[#1A73E8]/20 shadow-lg min-h-0">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 message-animate ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-[#1A73E8] to-[#3B82F6]'
                    : 'bg-white border-2 border-[#1A73E8]/30'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-5 w-5 text-[#1F2937]" />
                ) : (
                  <Bot className="h-5 w-5 text-[#1A73E8]" />
                )}
              </div>

              <div
                className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block rounded-xl transition-all duration-200 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#3B82F6] to-[#1A73E8] text-white px-4 py-3 shadow-md'
                      : 'bg-white border border-[#1A73E8]/20 text-[#1F2937] p-4 shadow-sm hover:shadow-md'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
                  ) : (
                    <MarkdownMessage content={message.content} />
                  )}
                </div>
                <div className={`flex items-center gap-2 mt-2 px-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p className="text-xs text-[#6B7280]/70" suppressHydrationWarning>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {message.role === 'assistant' && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-[#1A73E8]/30 text-[#6B7280]">
                      AI
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 message-animate">
              <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-white border-2 border-[#1A73E8]/30 shadow-sm">
                <Bot className="h-5 w-5 text-[#1A73E8]" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-3 rounded-xl bg-white border border-[#1A73E8]/20 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1A73E8]" />
                    <span className="text-sm text-[#6B7280] font-medium">Thinking...</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#1A73E8] rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-[#1A73E8] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-[#1A73E8] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t border-[#1A73E8]/20">
          <AIInputWithLoading
            placeholder="Ask me anything about Dubai..."
            onSubmit={handleSend}
            loadingDuration={2000}
            minHeight={56}
            maxHeight={200}
          />
        </div>
      </Card>

      {/* Info */}
      {/* <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Powered by Google Gemini 2.0 Flash</p>
              <p className="text-blue-700">
                This chatbot is trained on Dubai tourism knowledge and understands local culture,
                customs, and safety guidelines. Responses are generated in real-time using advanced AI.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
