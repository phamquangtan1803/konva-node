import express from "express";
import { createCanvas, loadImage, registerFont } from "canvas";
import Konva from "konva";
import { fetchJsonData } from "./helper.js";
import data from "./data/data.json";
import data2 from "./data/data2.json";
import { createStage } from "./utils/processTemplate.js";
const URL_ENDPOINTS = "https://stg-api.obello.com";
const TEMPLATE_SIZE_ID = "79be50db5b794300992dc27fbafabcbf";

const app = express();

app.get("/canvas-image", async (req, res) => {
  const api_url =
    URL_ENDPOINTS +
    `/template-service/animations/list?template_size_id=${TEMPLATE_SIZE_ID}`;

  const templateObelloData = await fetchJsonData(api_url);
  const templateData = data2;

  const width = templateObelloData.data[0].width;
  const height = templateObelloData.data[0].height;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const stage = await createStage(templateObelloData.data[0]);

  // Load data and redraw the layer

  // Create a Konva Node from the JSON and add it to the stage
  const konvaCanvas = stage.toCanvas();

  // Draw the Konva stage onto the canvas context
  context.drawImage(konvaCanvas, 0, 0);

  // Send the generated image as a response
  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
