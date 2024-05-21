import React, { useState } from 'react';
import "../styling/AiChat.css"
function AiChat() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [freeText, setFreeText]=useState('');
  const sendPromptToBackendAi = async (prompt) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/ask-ai?prompt=${encodeURIComponent(prompt)}`
      );
      const responseData = await response.json();
      setAiResponse(responseData);
      setShowAiResponse(true);
    } catch (error) {
      console.error('Error sending prompt to backend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setChatPrompt(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission behavior
      await sendPromptToBackendAi(
        `Give me only 3 topics that an audience of ${chatPrompt} would be interested in.`
      );
      setChatPrompt('');
    }
  };
  const handleFreeTextChange=(event)=>{
    event.preventDefault();
    setFreeText(event.target.value);
  }
  const handleEnterDown=async(e)=>{
    if(e.key==='Enter'){
      e.preventDefault();
      await sendPromptToBackendAi(
        `${freeText}`
      );
      setFreeText('');
    }
  }

  return (
    <div>
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Ai Inspiration
      </button>
      {showDropdown && (
        <div>
          <button
            onClick={() =>
              sendPromptToBackendAi(
                'Give me only one new idea to write a blog post about'
              )
            }
            disabled={loading}
          >
            New Blog Writing Idea
          </button>
          <span><br></br></span>
          <button
            onClick={() =>
              sendPromptToBackendAi(
                'Give me only 3 new tips for writing better blogs.'
              )
            }
            disabled={loading}
          >
            Tips For Writing
          </button>
          <span><br></br></span>
          <div>
            <p>What topics are my audience most interested in? My topic is: </p>
            <form>
              <input
                type="text"
                onChange={handleChange}
                value={chatPrompt}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </form>
            <span><br></br></span>
            <p>Any Questions:</p>
            <form>
              <input 
              type="text"
              onChange={handleFreeTextChange}
              value={freeText}
              onKeyDown={handleEnterDown}
              disabled={loading}/>
            </form>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {showAiResponse && aiResponse && Array.isArray(aiResponse) && (
        <div>
          <p>AI Response:</p>
          {aiResponse.map((response, index) => (
            <p key={index}>{response.message.content}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AiChat;
