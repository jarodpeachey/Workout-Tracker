import React from "react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Whoops! You can't do that",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary", // "primary" or "danger"
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="card max-w-md w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold text-text mb-4">{title}</h3>}
        <p className="text-gray-dark mb-6">{message}</p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${danger || variant === "danger" ? "text-white border-danger" : ""}`}
            style={
              danger || variant === "danger"
                ? { background: "linear-gradient(135deg, #a63d40 0%, #c17779 100%)" }
                : {}
            }
          >
            {confirmText}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
