import BlipItem from './BlipItem';

function BlipList({ blips, onDelete }) {
  if (!blips || blips.length === 0) {
    return <p className="no-blips-message">No blips have been created yet.</p>;
  }

  return (
    <ul className="blip-list">
      {blips.map((blip) => (
        <BlipItem key={blip.id} blip={blip} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default BlipList;
