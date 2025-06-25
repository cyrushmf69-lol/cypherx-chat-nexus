
import React, { useEffect, useCallback } from "react";

interface CypherXMessageProps {
  sender: 'You' | 'CypherX';
  text: string;
  input?: string;
  setInput?: (input: string) => void;
  setMessages?: (messages: any) => void;
  setLoading?: (loading: boolean) => void;
  username?: string;
  systemPrompts?: Record<string, string>;
  model?: string;
  askCypherX?: (message: string, model: string, systemPrompt: string) => Promise<string>;
  mode?: string;
}

export default function CypherXMessage({
  sender,
  text,
  input,
  setInput,
  setMessages,
  setLoading,
  username,
  systemPrompts,
  model,
  askCypherX,
  mode,
}: CypherXMessageProps) {
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !setMessages || !setInput || !setLoading || !askCypherX || !systemPrompts) return;

      setMessages((prevMessages: any[]) => [...prevMessages, { sender: "You", text: message }]);
      setInput("");
      setLoading(true);

      const systemPrompt = `${username ? `The user's name is ${username}.` : ""} ${
        systemPrompts[mode || 'savage'] || systemPrompts.savage
      }`;

      try {
        const replyText = await askCypherX(message, model || 'default', systemPrompt);
        const botMessage = { sender: "CypherX", text: replyText };

        setMessages((prev: any[]) => [...prev, botMessage]);
        speakText(replyText);
      } catch (error) {
        console.error("Error with askCypherX:", error);
        setMessages((prev: any[]) => [
          ...prev,
          { sender: "CypherX", text: "Oops! Something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [askCypherX, model, mode, setInput, setLoading, setMessages, systemPrompts, username]
  );

  useEffect(() => {
    if (input && sendMessage) {
      sendMessage(input);
    }
  }, [input, sendMessage]);

  return (
    <div className={`flex ${sender === "You" ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-300 mb-4`}>
      <div className={`
        max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 shadow-sm flex items-start gap-3
        ${sender === "You" 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-12' 
          : 'bg-white border border-gray-200 text-gray-900 mr-12'
        }
      `}>
        <div className="avatar flex-shrink-0">
          <span role="img" aria-label={sender === "You" ? "user" : "ai"} className="text-xl">
            {sender === "You" ? "🧑" : "🧠"}
          </span>
        </div>
        <div className="bubble flex-1">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    </div>
  );
}
