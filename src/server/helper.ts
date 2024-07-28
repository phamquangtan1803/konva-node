import axios from "axios";
import { loadImage, registerFont } from "canvas";
import Konva from "konva";
import path, { isAbsolute } from "path";
const fontsDir = path.join(__dirname, "fonts");
import { __dirname } from "./pathUtil.mjs";
import { Logo } from "./types/logo.js";
import fs from "fs"; // Import fs to read the font file

async function loadCustomFont(s3FilePath: string, fontFamily: string) {
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
  node.setAttr("fill", undefined);
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

export const calculateLogoSize = (logoData: Logo) => {
  const {
    padding: { paddingRight, paddingLeft, paddingBottom, paddingTop },
  } = logoData;
  let logoPadding;

  const ratio: number = Math.round(
    (logoData.imageWidth / logoData.imageHeight) * 100
  );
  if (ratio < 62.5) {
    logoPadding = logoData.imageWidth;
  } else if (62.5 <= ratio && ratio <= 100) {
    logoPadding = logoData.imageWidth / 2;
  } else if (100 < ratio && ratio <= 160) {
    logoPadding = logoData.imageHeight / 2;
  } else {
    logoPadding = logoData.imageHeight;
  }
  logoPadding = logoPadding * logoData.paddingRatio;

  const imageBoxPaddingHorizontal: number =
    (paddingRight ? logoPadding : 0) + (paddingLeft ? logoPadding : 0);
  const imageBoxPaddingVertical: number =
    (paddingTop ? logoPadding : 0) + (paddingBottom ? logoPadding : 0);

  const imageBoxWidth: number = logoData.imageWidth + imageBoxPaddingHorizontal;
  const imageBoxHeight: number = logoData.imageHeight + imageBoxPaddingVertical;

  const scaleY = logoData.height / imageBoxHeight;
  const scaleX = logoData.width / imageBoxWidth;
  const scaleImageBox = scaleX > scaleY ? scaleY : scaleX;
  const containerPadding: number = logoPadding * scaleImageBox;

  const containerPaddingTop = paddingTop ? containerPadding : 0;
  const containerPaddingRight = paddingRight ? containerPadding : 0;
  const containerPaddingBottom = paddingBottom ? containerPadding : 0;
  const containerPaddingLeft = paddingLeft ? containerPadding : 0;

  const scaleWidth = scaleImageBox * imageBoxWidth;
  const scaleHeight = scaleImageBox * imageBoxHeight;
  const imageWidth = scaleWidth - containerPaddingRight - containerPaddingLeft;
  const imageHeight =
    scaleHeight - containerPaddingTop - containerPaddingBottom;

  const imagePaddingLeft: number = paddingLeft
    ? paddingRight
      ? (logoData.width - imageWidth) / 2
      : logoData.width - imageWidth
    : 0;
  const imagePaddingTop: number = paddingTop
    ? paddingBottom
      ? (logoData.height - imageHeight) / 2
      : logoData.height - imageHeight
    : 0;

  return {
    width: Math.round(imageWidth),
    height: Math.round(imageHeight),
    paddingX: Math.round(imagePaddingLeft),
    paddingY: Math.round(imagePaddingTop),
  };
};
export const applyFillColor = (node, fillColor) => {
  if (node.attributes) {
    node.attributes.fill = fillColor;
  }
  if (node.children) {
    node.children.forEach((child) => applyFillColor(child, fillColor));
  }
};
