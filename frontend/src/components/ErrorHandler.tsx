import React from "react";

interface ErrorHandlerProps {
  message: string | null;
  type: "error" | "success";
  clearMessage: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  message,
  type,
  clearMessage,
}) => {
  if (!message) return null;

  const alertClass =
    type === "error" ? "alert alert-danger" : "alert alert-success";

  return (
    <div className={`${alertClass} alert-dismissible fade show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={clearMessage}
        aria-label="Close"
      ></button>
    </div>
  );
};

export default ErrorHandler;
