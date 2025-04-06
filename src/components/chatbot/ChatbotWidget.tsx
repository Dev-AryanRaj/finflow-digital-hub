
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m your FinFlow assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(input.trim());
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Simple response simulation
  const generateBotResponse = (userInput: string): string => {
    const lowerCaseInput = userInput.toLowerCase();
    
    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      return `Hello ${user?.name || 'there'}! How can I assist you with your banking needs today?`;
    }
    
    if (lowerCaseInput.includes('balance')) {
      return 'Your current account balance is ₹120,455.76. Would you like to view your recent transactions?';
    }
    
    if (lowerCaseInput.includes('transactions') || lowerCaseInput.includes('history')) {
      return 'Your last 3 transactions were: ₹5,000 to Paytm on April 2, ₹12,300 to HDFC Mortgage on April 1, and ₹3,520 to Amazon on March 29.';
    }
    
    if (lowerCaseInput.includes('transfer') || lowerCaseInput.includes('send money')) {
      return 'To transfer funds, please go to the Transfers section. Would you like me to navigate you there?';
    }
    
    if (lowerCaseInput.includes('deposit') || lowerCaseInput.includes('fd')) {
      return 'A Fixed Deposit is a financial instrument that provides higher interest rates than regular savings accounts. Our current FD interest rates range from 5.5% to 7.25% depending on duration.';
    }
    
    return "I'm here to help with your banking queries. You can ask me about your balance, transactions, transfers, deposits, or other banking services.";
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500' : 'bg-bank-primary hover:bg-bank-secondary'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 h-[500px] z-40 bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col animate-slide-in">
          <div className="p-4 bg-bank-primary text-white rounded-t-2xl">
            <h3 className="font-semibold">FinFlow Assistant</h3>
            <p className="text-xs">Ask me anything about your banking needs</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] p-3 rounded-xl ${
                    message.sender === 'user' 
                      ? 'bg-bank-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-l-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
              />
              <Button 
                type="submit" 
                className="rounded-l-none bg-bank-primary hover:bg-bank-secondary"
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
