import express from "express";
import cors from "cors";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

let latestColor = null;
let port;
let parser;

// ---------- SERIAL SETUP ----------
function initSerial() {
  try {
    port = new SerialPort({
      path: "COM3", // ⚠️ change if needed
      baudRate: 9600,
      autoOpen: false,
    });

    port.open((err) => {
      if (err) {
        console.error("❌ Serial open error:", err.message);
        return;
      }
      console.log("✅ Serial port opened");
    });

    parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (data) => {
      latestColor = data.trim();
      console.log("🎨 Arduino:", latestColor);
    });

    port.on("error", (err) => {
      console.error("❌ Serial error:", err.message);
    });

    port.on("close", () => {
      console.warn("⚠️ Serial port closed. Reconnecting...");
      setTimeout(initSerial, 3000);
    });
  } catch (err) {
    console.error("❌ Init error:", err.message);
  }
}

initSerial();

// ---------- API ----------
app.get("/color", (req, res) => {
  if (!latestColor) {
    return res.status(503).json({ error: "No data from Arduino" });
  }
  res.json({ hex: latestColor });
});

// ---------- SERVER ----------
app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on port", process.env.PORT);
});
