import express from "express";
import { createCanvas } from "canvas";
import { fetchJsonData } from "./helper.js";
import { createStage } from "./utils/processTemplate.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { __dirname } from "./pathUtil.js";
import { registerFont } from "canvas";

const URL_ENDPOINTS = "https://stg-api.obello.com";
const fontsDir = path.join(__dirname, "fonts");

// const TEMPLATE_SIZE_ID = "f63b0ecda7104e00a167530dd1eff5c5";

const app = express();

app.get("/canvas-image", async (req, res) => {
  const templateSizeId = req.query.template_size_id;

  const api_url =
    URL_ENDPOINTS +
    `/template-service/animations/list?template_size_id=${templateSizeId}`;

  const templateObelloData = await fetchJsonData(api_url);

  const width = templateObelloData.data[0].width;
  const height = templateObelloData.data[0].height;
  try {
    if (fs.existsSync(fontsDir)) {
      await fs.promises.rm(fontsDir, { recursive: true });
    }

    await fs.promises.mkdir(fontsDir, { recursive: true });

    const fontPromises = templateObelloData.data[0].children
      .filter((element) => element.type === "text")
      .map(async (element) => {
        const uniqueFileName = `custom-font-${element.id}.otf`;
        const fontPath = path.join(fontsDir, uniqueFileName);

        // Download and overwrite the font file
        const response = await axios.get(element.s3FilePath, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data);
        fs.writeFileSync(fontPath, buffer);

        registerFont(fontPath, { family: element.fontFamily });
      });

    // Wait for all fonts to be downloaded and saved
    await Promise.all(fontPromises);
  } catch (e) {
    console.log(e);
  }

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const stage = await createStage(templateObelloData.data[0]);

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
