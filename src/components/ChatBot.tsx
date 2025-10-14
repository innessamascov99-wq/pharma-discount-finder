import { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';

interface ChatBotProps {
  name?: string;
}

export const ChatBot = ({ name = 'Jack' }: ChatBotProps) => {
  const chatInitialized = useRef(false);

  useEffect(() => {
    if (chatInitialized.current) return;

    const initializeChat = async () => {
      try {
        const { createChat } = await import('@n8n/chat');

        createChat({
          webhookUrl: 'https://creative-glider-excited.ngrok-free.app/webhook/32ecd779-a450-4f0a-82cc-d57e3ad66fed/chat',
          initialMessages: [
            `Hi! I'm ${name}. Can I have your name to properly address and assist you?`
          ],
          i18n: {
            en: {
              title: `Chat with ${name}`,
              subtitle: 'Ask me anything about pharmacy discounts',
              footer: '',
              getStarted: 'Start chatting',
              inputPlaceholder: 'Type your message...',
            },
          },
        });

        chatInitialized.current = true;
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, [name]);

  return null;
};
