import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ExitProtection = () => {
  const [showModal, setShowModal] = useState(false);

  const triggerModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    preventBack();

    const onPopState = (e: PopStateEvent) => {
      e.preventDefault();
      triggerModal();
      preventBack();
    };

    window.addEventListener("popstate", onPopState);

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        key === "f5" ||
        (e.ctrlKey && key === "r") ||
        (e.ctrlKey && e.shiftKey && key === "r")
      ) {
        e.preventDefault();
        triggerModal();
      }
    };

    window.addEventListener("keydown", onKey);

    const onContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      triggerModal();
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "40px",
          borderRadius: "18px",
          width: "95%",
          maxWidth: "480px",            // ⬅ Bigger card
          textAlign: "center",
          color: "#fff",
          border: "4px solid #00eaff",
          boxShadow:
            "0 0 30px #00eaff, 0 0 50px #00eaff inset, 0 0 100px rgba(0,234,255,0.4)",
          fontFamily: "'Press Start 2P', sans-serif",
          letterSpacing: "1.5px",
          animation: "popIn 0.25s ease-out",
        }}
      >
        <p style={{ marginBottom: "28px", fontSize: "1rem", lineHeight: "1.8" }}>
          ⚠️ WARNING  
          <br />
          <span style={{ fontSize: "1.2rem", color: "#00eaff" }}>
            Please return and finish your quiz!
          </span>
        </p>

        <button
          onClick={() => setShowModal(false)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            background: "#00eaff",
            color: "#000",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 0 15px #00eaff, 0 0 25px #00eaff",
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          OK
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ExitProtection;
