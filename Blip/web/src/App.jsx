import { useState, useEffect, useCallback } from 'react';
import './App.css';
import BlipForm from './BlipForm';
import BlipList from './BlipList';
import { nui } from './nui';

function App() {
  const [blips, setBlips] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingBlip, setEditingBlip] = useState(null);

  const handleClose = useCallback(() => {
    setVisible(false);
    setEditingBlip(null); // Clear editing state on close
    nui.close();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      if (action === 'setVisible') setVisible(data);
      if (action === 'updateBlips') setBlips(Array.isArray(data) ? data : []);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (visible && !editingBlip) { // Don't refetch if we just opened the editor
      nui.getBlips().then(initialBlips => {
        if (Array.isArray(initialBlips)) setBlips(initialBlips);
      });
    }
  }, [visible, editingBlip]);

  const handleCreateBlip = async (blipData) => {
    await nui.createBlip(blipData);
  };

  const handleUpdateBlip = async (blipData) => {
    await nui.updateBlip(blipData);
    setEditingBlip(null); // Exit editing mode
  };

  const handleDeleteBlip = async (blipId) => {
    await nui.deleteBlip(blipId);
  };

  const handleEditBlip = (blip) => {
    setEditingBlip(blip);
  };

  const handleCancelEdit = () => {
    setEditingBlip(null);
  };

  if (!visible) return null;

  return (
    <div className="app-wrapper">
      <div className="glass-container">
        <div className="header-container">
          <h1>Blip Manager</h1>
          <button onClick={handleClose} className="close-btn">X</button>
        </div>
        <div className="content-container">
          <div className="blip-creator-container">
            <h2>{editingBlip ? 'Edit Blip' : 'Create New Blip'}</h2>
            <BlipForm
              onCreate={handleCreateBlip}
              onUpdate={handleUpdateBlip}
              editingBlip={editingBlip}
              onCancelEdit={handleCancelEdit}
            />
          </div>
          <div className="blip-list-container">
            <h2>Existing Blips</h2>
            <BlipList
              blips={blips}
              onEdit={handleEditBlip}
              onDelete={handleDeleteBlip}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
