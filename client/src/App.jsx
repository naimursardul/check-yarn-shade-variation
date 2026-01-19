import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [hex, setHex] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_SERVER_URL}/color`
        );
        if (!res.data.success) {
          console.log(res.data.message);
          return;
        }
        setHex(res?.data.hex);
      } catch (error) {
        console.error("Error fetching color:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Arduino Color</h2>
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: hex,
          border: "1px solid black",
        }}
      />
      <p>{hex}</p>
    </div>
  );
}

export default App;
