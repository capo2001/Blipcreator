import { useState, useEffect } from 'react';

function BlipForm({ onCreate, onUpdate, editingBlip, onCancelEdit }) {
  const [name, setName] = useState('');
  const [sprite, setSprite] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('1.0'); // Default size

  const isEditing = !!editingBlip;

  useEffect(() => {
    if (isEditing) {
      setName(editingBlip.name);
      setSprite(editingBlip.sprite.toString());
      setColor(editingBlip.color.toString());
      setSize(editingBlip.size.toString());
    }
  }, [editingBlip, isEditing]);

  const clearForm = () => {
    setName('');
    setSprite('');
    setColor('');
    setSize('1.0');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sprite || !color || !size) return;

    const blipData = {
      name,
      sprite: parseInt(sprite, 10),
      color: parseInt(color, 10),
      size: parseFloat(size),
    };

    if (isEditing) {
      onUpdate({ ...blipData, id: editingBlip.id });
    } else {
      onCreate(blipData);
    }

    clearForm();
  };

  return (
    <form onSubmit={handleSubmit} className="blip-form">
      <div className="form-group">
        <label htmlFor="name">Blip Name</label>
        <input
          id="name" type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Heist Location" required
        />
      </div>
      <div className="form-group">
        <label htmlFor="sprite">Sprite ID</label>
        <input
          id="sprite" type="number" value={sprite}
          onChange={(e) => setSprite(e.target.value)}
          placeholder="e.g., 523" required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color ID</label>
        <input
          id="color" type="number" value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="e.g., 5" required
        />
      </div>
      <div className="form-group">
        <label htmlFor="size">Size</label>
        <input
          id="size" type="number" value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="e.g., 1.2" step="0.01" min="0.01" required
        />
      </div>
      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          {isEditing ? 'Update Blip' : 'Create Blip'}
        </button>
        {isEditing && (
          <button type="button" className="cancel-btn" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BlipForm;
