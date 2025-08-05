import { useState, useEffect, useCallback } from 'react';
import './App.css';
import BlipForm from './BlipForm';
import BlipList from './BlipList';
import { nui } from './nui';

function App() {
  const [blips, setBlips] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    nui.close();
  }, []);

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
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

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
    await nui.createBlip(blipData);
  };

  const handleDeleteBlip = async (blipId) => {
    await nui.deleteBlip(blipId);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="app-wrapper">
      <div className="glass-container">
        <div className="header-container">
          <h1>Blip Manager</h1>
          <button onClick={handleClose} className="close-btn">X</button>
        </div>
        <div className="content-container">
          <div className="blip-creator-container">
            <h2>Create New Blip</h2>
            <BlipForm onCreate={handleCreateBlip} />
          </div>
          <div className="blip-list-container">
            <h2>Existing Blips</h2>
            <BlipList blips={blips} onDelete={handleDeleteBlip} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
