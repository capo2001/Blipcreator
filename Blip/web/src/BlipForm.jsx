import { useState } from 'react';

function BlipForm({ onCreate }) {
  const [name, setName] = useState('');
  const [sprite, setSprite] = useState('');
  const [color, setColor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sprite || !color) {
      // Basic validation
      return;
    }
    onCreate({ name, sprite: parseInt(sprite, 10), color: parseInt(color, 10) });
    // Clear form
    setName('');
    setSprite('');
    setColor('');
  };

  return (
    <form onSubmit={handleSubmit} className="blip-form">
      <div className="form-group">
        <label htmlFor="name">Blip Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Heist Location"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="sprite">Sprite ID</label>
        <input
          id="sprite"
          type="number"
          value={sprite}
          onChange={(e) => setSprite(e.target.value)}
          placeholder="e.g., 523"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color ID</label>
        <input
          id="color"
          type="number"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="e.g., 5"
          required
        />
      </div>
      <button type="submit">Create Blip</button>
    </form>
  );
}

export default BlipForm;
