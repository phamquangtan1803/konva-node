import express from "express";
import { createCanvas } from "canvas";
import { fetchJsonData } from "./helper.js";
import { createStage } from "./utils/processTemplate.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { __dirname } from "./pathUtil.js";
import { registerFont } from "canvas";
import { loadAllFonts, convertFontFamily } from "./helper.js";
const URL_ENDPOINTS = "https://stg-api.obello.com";
const fontsFolder = path.join(__dirname, "fonts");

// const TEMPLATE_SIZE_ID = "f63b0ecda7104e00a167530dd1eff5c5";

const app = express();

app.get("/canvas-image", async (req, res) => {
  const templateSizeId = req.query.template_size_id;
  const timestamp = Date.now();
  const fontsDir = path.join(__dirname, "fonts", `fonts_${timestamp}`);

  const api_url =
    URL_ENDPOINTS +
    `/template-service/animations/list?template_size_id=${templateSizeId}`;

  const templateObelloData = await fetchJsonData(api_url);

  const width = templateObelloData.data[0].width;
  const height = templateObelloData.data[0].height;
  // if (fs.existsSync(fontsFolder)) {
  //   console.log("remove path");
  //   await fs.promises.rm(fontsFolder, { recursive: true });
  // }
  await fs.promises.mkdir(fontsDir, { recursive: true });
  try {
    const fontPromises = templateObelloData.data[0].children
      .filter((element) => element.type === "text")
      .map(async (element) => {
        const fontName =
          convertFontFamily(element.fontFamily, element.fontId) + ".otf";
        console.log(fontName);
        const fontPath = path.join(fontsDir, fontName);

        // Download and overwrite the font file
        const response = await axios.get(element.s3FilePath, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data);
        await fs.promises.writeFile(fontPath, buffer);
        registerFont(fontPath, {
          family: convertFontFamily(element.fontFamily, element.fontId),
          weight: "light",
        });
      });

    // Wait for all fonts to be downloaded and saved
    await Promise.all(fontPromises);
  } catch (e) {
    console.log(e);
  }

  // await loadAllFonts(templateObelloData.data[0].children);

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const stage = await createStage(templateObelloData.data[0]);

  const konvaCanvas = stage.toCanvas();

  // Draw the Konva stage onto the canvas context
  context.drawImage(konvaCanvas, 0, 0);

  // Send the generated image as a response
  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer());
  // await fs.promises.rm(fontsDir, { recursive: true });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
