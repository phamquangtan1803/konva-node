import axios from "axios";
import { loadImage, registerFont } from "canvas";
import Konva from "konva";
import path, { isAbsolute } from "path";
const fontsDir = path.join(__dirname, "fonts");
import { __dirname } from "./pathUtil.mjs";
import fs from "fs"; // Import fs to read the font file

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
  const cropY = node.getAttr("cropY") || 0;
  const cropWidth = node.getAttr("cropWidth") || image.width;
  const cropHeight = node.getAttr("cropHeight") || image.height;

  node.setAttr("cropHeight", image.height * cropHeight || 0);
  node.setAttr("cropWidth", image.width * cropWidth || 0);
  node.setAttr("cropY", image.height * cropY || 0);
  node.setAttr("cropX", image.width * cropX || 0);

  node.image(image);
}
export async function loadFillPatternImageNode(node, url) {
  const image = await loadImage(url);

  const cropX = node.getAttr("cropX") || 0;
  const cropY = node.getAttr("cropY") || 0;
  const cropWidth = node.getAttr("cropWidth") || image.width;
  const cropHeight = node.getAttr("cropHeight") || image.height;
  const width = node.getAttr("width") || image.width;
  const height = node.getAttr("height") || image.height;
  const scaleX = node.getAttr("scaleX") || image.height;
  const scaleY = node.getAttr("scaleY") || image.height;

  // node.setAttr("cropHeight", image.height * cropHeight || 0);
  // node.setAttr("cropWidth", image.width * cropWidth || 0);
  // node.setAttr("cropY", image.height * cropY || 0);
  // node.setAttr("cropX", image.width * cropX || 0);

  const scaleImageX = width / image?.width / cropWidth;
  const scaleImageY = height / image?.height / cropHeight;
  const offsetImageX = image?.width * cropX;
  const offsetImageY = image?.height * cropY;

  node.fillPatternScaleX(scaleImageX / scaleX);
  node.fillPatternScaleY(scaleImageY / scaleY);
  node.fillPatternOffsetX(offsetImageX);
  node.fillPatternOffsetY(offsetImageY);
  node.fillPatternImage(image);
  // node.setAttr("cropHeight", undefined);
  // node.setAttr("cropWidth", undefined);
  // node.setAttr("cropY", undefined);
  // node.setAttr("cropX", undefined);
  node.setAttr("fill", undefined);
}
export async function loadLogoNode(node, url) {
  const image = await loadImage(url);

  node.image(image);
}
async function loadTextNode(node) {
  const s3FilePath = node.attrs.s3FilePath;
  const fontFamily = `CustomFont-${node.attrs.id}`; // Unique font family based on the node id

  await loadCustomFont(s3FilePath, fontFamily);
  node.fontFamily(fontFamily);
}

export async function handleLoadData(stage) {
  const nodes = stage.find("Image, Text, Path");
  const loadPromises: Promise<any> = [];
  nodes.forEach((node) => {
    if (!node.attrs.elementType) return;

    if (node.className === "Image") {
      if (node.attrs.elementType === "logo")
        loadPromises.push(loadLogoNode(node, node.attrs.src));
      else {
        loadPromises.push(loadImageNode(node, node.attrs.src));
      }
    }

    if (node.className === "Text" && node.attrs.s3FilePath) {
      loadPromises.push(loadTextNode(node));
    }

    if (node.className === "Path") {
      if (node.attrs.src != "")
        loadPromises.push(loadFillPatternImageNode(node, node.attrs.src));
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
