import { useEffect, useRef, useState } from 'react';
import getAIResponse from './getAIResponse'; 

const App = () => {
  const [message, setMessage] = useState('');
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);  // For auto-scrolling

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [incomingMessages]);

  // Handle sending messages and displaying AI responses
  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setIncomingMessages((prev) => [
      ...prev,
      { text: message, sender: 'user' }
    ]);
    setMessage('');
    setLoading(true);  

    try {
      // Get AI response
      const aiResponse = await getAIResponse(message);
      console.log('🤖 AI Response:', aiResponse);

      // Add AI message to chat
      setIncomingMessages((prev) => [
        ...prev,
        { text: aiResponse, sender: 'ai' }
      ]);

    } catch (error) {
      console.error('❌ Error:', error);
      setIncomingMessages((prev) => [
        ...prev,
        { text: '⚠️ Failed to fetch AI response.', sender: 'ai' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center md:p-5">
      <h1 className="text-xl md:text-3xl font-bold italic flex items-center justify-center h-[50px] text-center bg-white">
        🗨️ Let's Talk with Abhishek's AI Chatbot
      </h1>

      {/* Chat Container */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 
                      sm:p-6 md:p-8 lg:p-3 
                      flex flex-col h-[80vh]">

        {/* Scrollable Chat Window */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-2 border border-gray-300 rounded-lg"
        >
          {incomingMessages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 my-2 w-fit max-w-[70%] rounded-lg shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white ml-auto text-end'  // User message on the right
                  : 'bg-gray-300 text-black mr-auto'          // AI message on the left
              }`}
              style={{ wordWrap: 'break-word' }}
            >
              {msg.text}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center my-2 ">
              <div className="animate-pulse text-gray-500">🤖 Typing...</div>
            </div>
          )}
        </div>

        {/* Input and Send Button */}
        <div className="flex mt-4 gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow p-2 border rounded-md focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className={`bg-blue-500 text-white p-2 rounded-md 
                      hover:bg-blue-600 transition w-24 ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
