import React, { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import './Web.css'; // Add a CSS file for better styling

const retellWebClient = new RetellWebClient();

async function fetchAccessToken() {
  const API_URL = 'https://api.retellai.com/v2/create-web-call';
  const API_KEY = 'key_92609f27e1d69a4bb9a69b1e0f86'; 
  const agentId = 'agent_31c4802b14febb2ed0be023dc0'; 

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ agent_id: agentId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to fetch access token:', error);
    throw error;
  }
}

export default function WebCall() {
  const [isCallActive, setIsCallActive] = useState(false);

  const toggleWebCall = async () => {
    if (isCallActive) {
      // Stop the call
      try {
        await retellWebClient.stopCall();
        console.log('Web call stopped!');
        setIsCallActive(false);
      } catch (error) {
        console.error('Failed to stop web call:', error);
      }
    } else {
      // Start the call
      try {
        const accessToken = await fetchAccessToken();
        await retellWebClient.startCall({ accessToken, sampleRate: 24000 });
        console.log('Web call started!');
        setIsCallActive(true);
      } catch (error) {
        console.error('Failed to start web call:', error);
      }
    }
  };

  return (
    <div className="web-call-container">
      <div className="button-container">
        <button className={`toggle-call ${isCallActive ? 'active' : ''}`} onClick={toggleWebCall}>
          <i className={`fas fa-microphone${isCallActive ? '-slash' : ''} icon`}></i>
          <span className="sr-only">{isCallActive ? 'Stop Call' : 'Start Call'}</span>
        </button>
      </div>
    </div>
  );
}
