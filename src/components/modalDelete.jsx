import React from 'react';
import './ModalDelete.css';
import { FaExclamationTriangle } from 'react-icons/fa';

function ModalDelete({ isOpenD, onClose, onConfirm }) {
  if (!isOpenD) return null;

  return (
    <div className="modal-container">
      <div className="modal-delete">
        <div className="modal-contentc">
          <div className="icons-alert"><FaExclamationTriangle className='exclamtri'/></div>
          <p>Are you sure you want to delete this chiller?</p>
          <button onClick={onConfirm}>Confirm delete</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDelete;
