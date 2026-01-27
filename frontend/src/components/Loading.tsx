import React from "react";

const Loading: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    screen: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",  
      background: "#1a1a1a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "'Press Start 2P', monospace",
      color: "#00ffcc",
      imageRendering: "pixelated",
      flexDirection: "column",
      textAlign: "center",
    },
    loader: {
      display: "flex",
      gap: "6px",
      marginBottom: "20px",
    },
    pixel: {
      width: "20px",
      height: "20px",
      backgroundColor: "#00ffcc",
      animation: "blink 1s infinite",
      imageRendering: "pixelated",
    },
    text: {
      fontSize: "14px",
      color: "#00ffcc",
      textShadow: "0 0 6px #00ffcc",
    },
  };

  // inject keyframes directly
  const styleTag = `
    @keyframes blink {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div style={styles.screen}>
        <div style={styles.loader}>
          <div style={{ ...styles.pixel, animationDelay: "0s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.2s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.4s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.6s" }} />
        </div>
        <p style={styles.text}>Loading...</p>
      </div>
    </>
  );
};

export default Loading;
