import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("MindPulse: Starting application...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("MindPulse: Root element not found!");
  document.body.innerHTML = "<h1>Error: Root element not found</h1>";
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("MindPulse: Application rendered successfully");
  } catch (error) {
    console.error("MindPulse: Error rendering app:", error);
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; color: #666;">
        <div style="text-align: center;">
          <h1>MindPulse</h1>
          <p>Something went wrong while loading the app.</p>
          <p style="font-size: 12px; margin-top: 20px;">Please check the console for more details.</p>
        </div>
      </div>
    `;
  }
}
