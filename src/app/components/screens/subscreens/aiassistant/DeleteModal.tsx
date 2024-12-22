import React from "react";
import "../../../../../assets/styles/substyles/ChatWindowStyles.css";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDeleteSuccess }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDeleteSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Message</h3>
        <p>Are you sure you want to delete this message permanently?</p>
        <div className="modal-actions">
          <button onClick={handleDelete} className="confirm-button">
            Yes
          </button>
          <button onClick={onClose} className="cancel-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
