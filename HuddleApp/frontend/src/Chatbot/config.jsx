import { createChatBotMessage } from 'react-chatbot-kit';
import Bot from './Bot';

const botName = 'HuddleBot';

const config = {
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}. What are some concerns that I may be able to assist you with today?`),
    createChatBotMessage(`If you are unsure, you can begin by saying Getting Started!`),
  ],
  botName: botName,
  customComponents: { botAvatar: (props) => <Bot {...props} /> },
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
};

export default config;