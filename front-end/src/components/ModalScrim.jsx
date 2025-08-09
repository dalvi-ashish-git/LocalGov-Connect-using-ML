import './ModalScrim.css';

function ModalScrim({isDrawerOpen, onScrimClick}) {
  return (
    <div className={`modal-scrim ${isDrawerOpen ? 'visible' : ''}`} onClick={onScrimClick}></div>
  );
}

export default ModalScrim;
