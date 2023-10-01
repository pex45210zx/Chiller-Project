import React from 'react';
import './modalPopUp.css';

function ModalPopUp({ isOpen, onClose, message }) {
  return (
    isOpen && (
      <div className="custom-modal-overlay">
        <div className="custom-modal">
          <div className="modal-content">
            <div className="modal-message">{message}</div>
            <button className="modal-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalPopUp;
