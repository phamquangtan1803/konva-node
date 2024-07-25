import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the image from the server
    const fetchImage = async () => {
      try {
        const response = await fetch("http://localhost:3000/canvas-image");
        if (response.ok) {
          const blob = await response.blob();
          setImageUrl(URL.createObjectURL(blob));
        } else {
          console.error("Failed to fetch image");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* Display the image */}
      {imageUrl && <img src={imageUrl} alt="Canvas" />}
    </div>
  );
}

export default App;
