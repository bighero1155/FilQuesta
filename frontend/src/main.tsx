// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { AuthProvider } from "./context/AuthContext.tsx";


// const rootElement = document.getElementById("root");

// if (!rootElement) {
//   throw new Error("Root element not found"); 
// }

// (async () => {
//   // Load backend runtime config BEFORE React renders(async () => {
//   // try {
//   //   await loadRuntimeConfig();
//   // } catch (err) {
//   //   console.error("Runtime config failed, using defaults", err);
//   // }


//   createRoot(rootElement).render(
//     <StrictMode>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </StrictMode>
//   );
// })();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.tsx";

// React Router
import { BrowserRouter } from "react-router-dom";

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Render the app
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);