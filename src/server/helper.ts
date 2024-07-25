import axios from "axios";
import { loadImage, registerFont } from "canvas";
import Konva from "konva";
import path, { isAbsolute } from "path";
const fontsDir = path.join(__dirname, "fonts");
import { __dirname } from "./pathUtil.mjs";
import fs from "fs"; // Import fs to read the font file
import { calcCropImageAttrs } from "./utils/calcAttribute.js";

async function loadCustomFont(s3FilePath, fontFamily) {
  const uniqueFileName = `custom-font-${Date.now()}.otf`;
  const fontPath = path.join(fontsDir, uniqueFileName);

  if (!s3FilePath) {
    throw new Error("There is no file path");
  }

  try {
    const response = await axios.get(s3FilePath, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);
    fs.writeFileSync(fontPath, buffer);

    registerFont(fontPath, { family: fontFamily });
  } catch (error) {
    console.error("Error loading font:", error);
    throw error;
  }
}
async function loadSVGStringNode(node, svgString) {
  const svgImage = await loadImage(
    `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`
  );
  node.image(svgImage);
}

export async function loadImageNode(node, url) {
  const image = await loadImage(url);

  const cropX = node.getAttr("cropX") || 0;
  const x = node.getAttr("x") || 0;
  const y = node.getAttr("y") || 0;

  const cropY = node.getAttr("cropY") || 0;
  const cropWidth = node.getAttr("cropWidth") || image.width;
  const cropHeight = node.getAttr("cropHeight") || image.height;
  const rotation = node.getAttr("rotation") || 0;

  const cropOptions = {
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    rotation,
  };
  const imageOptions = { width: image.width, height: image.height, x, y };

  const params = calcCropImageAttrs(imageOptions, cropOptions);
  console.log(params);
  // node.setAttr("x", params.x || 0);
  // node.setAttr("y", params.y || 0);
  // node.setAttr("width", params.width || 0);
  // node.setAttr("height", params.height || 0);

  // // node.setAttr("cropWidth", params.cropWidth || 0);
  // // node.setAttr("cropHeight", params.cropHeight || 0);
  // // node.setAttr("cropX", params.cropX || 0);
  // // node.setAttr("cropY", params.cropY || 0);
  // node.setAttr("rotation", params.rotation || 0);

  node.image(image);
}

async function loadTextNode(node) {
  const s3FilePath = node.attrs.s3FilePath;
  const fontFamily = `CustomFont-${node.attrs.id}`; // Unique font family based on the node id

  await loadCustomFont(s3FilePath, fontFamily);
  node.fontFamily(fontFamily);
}

export async function handleLoadData(stage) {
  const nodes = stage.find("Image, Text");
  const loadPromises: Promise<any> = [];

  nodes.forEach((node) => {
    if (node.className === "Image") {
      if (node.attrs.svgString) {
        loadPromises.push(loadSVGStringNode(node, node.attrs.svgString));
      } else if (node.attrs.src) {
        loadPromises.push(loadImageNode(node, node.attrs.src));
      }
    } else if (node.className === "Text" && node.attrs.s3FilePath) {
      loadPromises.push(loadTextNode(node));
    }
  });

  await Promise.all(loadPromises);
}
export async function fetchJsonData(apiUrl: string) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    throw error;
  }
}
