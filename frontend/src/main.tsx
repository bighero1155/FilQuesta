import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { loadRuntimeConfig } from "./config/runtimeConfig";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found"); 
}

(async () => {
  // Load backend runtime config BEFORE React renders
  await loadRuntimeConfig();

  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
})();
