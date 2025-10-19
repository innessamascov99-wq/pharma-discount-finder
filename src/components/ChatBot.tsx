import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

interface ChatBotProps {
  name?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatBot = ({ name = 'Jack' }: ChatBotProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm ${name}, your pharmacy assistance guide. I have access to our comprehensive database of medications, pharmaceutical assistance programs, and discount information. I can help you find affordable options for your prescriptions. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const { data: programs, error } = await supabase
        .from('pharma_programs')
        .select('*')
        .or(`medication_name.ilike.%${query}%,manufacturer.ilike.%${query}%,program_name.ilike.%${query}%`)
        .eq('active', true)
        .limit(5);

      if (error) throw error;

      let responseText = '';
      if (programs && programs.length > 0) {
        responseText = `I found ${programs.length} program${programs.length > 1 ? 's' : ''} for "${query}":\n\n`;
        programs.forEach((prog, idx) => {
          responseText += `${idx + 1}. ${prog.medication_name} by ${prog.manufacturer}\n`;
          responseText += `   Program: ${prog.program_name}\n`;
          if (prog.eligibility_criteria) {
            responseText += `   Eligibility: ${prog.eligibility_criteria}\n`;
          }
          if (prog.website_url) {
            responseText += `   Website: ${prog.website_url}\n`;
          }
          responseText += '\n';
        });
      } else {
        responseText = `I couldn't find any programs matching "${query}". Try searching for a specific medication name or manufacturer.`;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble searching right now. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMonochrome = theme === 'monochrome';

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 ${
            isMonochrome
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-pink-800 hover:bg-pink-900 text-white'
          } rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-50`}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          <div className={`${
            isMonochrome
              ? 'bg-gray-600 text-white'
              : 'bg-pink-800 text-white'
          } p-4 rounded-t-lg flex justify-between items-center`}>
            <div>
              <h3 className="font-semibold text-lg">Chat with {name}</h3>
              <p className={`text-sm ${
                isMonochrome ? 'text-gray-200' : 'text-pink-100'
              }`}>Ask about medications & programs</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`${
                isMonochrome
                  ? 'hover:bg-gray-700 text-white'
                  : 'hover:bg-pink-900 text-white'
              } p-1 rounded transition-colors`}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? isMonochrome
                        ? 'bg-gray-600 text-white'
                        : 'bg-pink-800 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === 'user'
                        ? isMonochrome
                          ? 'text-gray-200'
                          : 'text-pink-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-4 border-t ${
            isMonochrome
              ? 'bg-gray-300 border-gray-400'
              : 'border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isMonochrome
                    ? 'bg-white border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-gray-600'
                    : 'border-gray-300 focus:ring-pink-800'
                } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`${
                  isMonochrome
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-pink-800 hover:bg-pink-900 text-white'
                } disabled:bg-gray-400 disabled:text-gray-600 p-2 rounded-lg transition-colors`}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
