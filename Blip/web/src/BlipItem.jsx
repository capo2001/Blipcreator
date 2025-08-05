function BlipItem({ blip, onEdit, onDelete }) {
  return (
    <li className="blip-item">
      <div className="blip-info">
        <span className="blip-name">{blip.name}</span>
        <span className="blip-details">
          Sprite: {blip.sprite}, Color: {blip.color}, Size: {blip.size}
        </span>
      </div>
      <div className="blip-actions">
        <button onClick={() => onEdit(blip)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(blip.id)} className="delete-btn">Delete</button>
      </div>
    </li>
  );
}

export default BlipItem;
