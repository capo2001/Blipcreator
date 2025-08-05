function BlipItem({ blip, onDelete }) {
  return (
    <li className="blip-item">
      <div className="blip-info">
        <span className="blip-name">{blip.name}</span>
        <span className="blip-details">
          Sprite: {blip.sprite}, Color: {blip.color}
        </span>
      </div>
      <button onClick={() => onDelete(blip.id)} className="delete-btn">
        Delete
      </button>
    </li>
  );
}

export default BlipItem;
