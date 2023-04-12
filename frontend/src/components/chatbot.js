
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';


function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [botResponses, setBotResponses] = useState([]);
  const [message, setMessage] = useState('');
  const chatbotBodyRef = useRef(null);

  const scrollToBottom = () => {
    chatbotBodyRef.current.scrollTop = chatbotBodyRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [botResponses]);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:5000/chatbot', {
      userInput: userInput
    }).then((response) => {
      console.log(response);
      const botMessage = { type: 'bot', text: response.data };
      setBotResponses(botResponses.concat([{ type: 'user', text: userInput }, botMessage]));
      setUserInput('');
      // Convert bot message to speech
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(botMessage.text);
      synth.speak(utterance);
    });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        axios.post('http://127.0.0.1:5000/loc', {
          lat: latitude,
          lon: longitude,
        }).then((res)=>{
          console.log(res);
          const botMessage = { type: 'bot', text: res.data };
          setBotResponses(botResponses.concat([botMessage]));
          // Convert bot message to speech
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(botMessage.text);
          synth.speak(utterance);
        });
      }, error => {
        console.error(error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  

  return (
    <div className='top'>
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1>Medi-Mind</h1>
        </div>
        <div id="myText">"Welcome to your personal health guru! Ask me anything about medical conditions, treatments, and symptoms – I'm here to provide reliable and accurate information for all your health-related questions!"</div>
        

        <div className="chatbot-body" ref={chatbotBodyRef}>
          {botResponses.map((message, index) => {
            if (message.type === 'user') {
              return (
                <div className="chatbot-message user-message" key={index}>
                  <p>{message.text}</p>
                </div>
              );
            } else {
              return (
                <div className="chatbot-message bot-message" key={index}>
                  <p>{message.text}</p>
                </div>
              );
            }
          })}
        </div>
        <div className="chatbot-input">
          <form onSubmit={handleSubmit}>
            <div className="inner">
            <input type="text" onChange={handleChange} value={userInput} placeholder="Type your message..." required/>
            <button type="submit" className='b1'>Send</button>
            </div>
            <button type="button" className='b2' onClick={getLocation}>Help</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ChatBot;
