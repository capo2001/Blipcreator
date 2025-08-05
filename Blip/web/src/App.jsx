import { useState, useEffect } from 'react';
import './App.css';
import BlipForm from './BlipForm';
import BlipList from './BlipList';
import { nui } from './nui';

function App() {
  const [blips, setBlips] = useState([]);
  const [visible, setVisible] = useState(false);

  // Main message listener for events from Lua
  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      switch (action) {
        case 'setVisible':
          setVisible(data);
          break;
        case 'updateBlips':
          setBlips(data);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Key listener for closing the UI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setVisible(false);
        nui.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch blips when the UI becomes visible
  useEffect(() => {
    if (visible) {
      nui.getBlips().then(initialBlips => {
        if (initialBlips) {
          setBlips(initialBlips);
        }
      });
    }
  }, [visible]);

  const handleCreateBlip = async (blipData) => {
    // The server will refresh the blip list for all clients after creation
    await nui.createBlip(blipData);
  };

  const handleDeleteBlip = async (blipId) => {
    // The server will refresh the blip list for all clients after deletion
    await nui.deleteBlip(blipId);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="app-container">
      <div className="blip-creator-container">
        <h1>Blip Creator</h1>
        <BlipForm onCreate={handleCreateBlip} />
      </div>
      <div className="blip-list-container">
        <h2>Existing Blips</h2>
        <BlipList blips={blips} onDelete={handleDeleteBlip} />
      </div>
    </div>
  );
}

export default App;
