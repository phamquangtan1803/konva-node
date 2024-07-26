import axios from "axios";
import { loadImage, registerFont } from "canvas";
import Konva from "konva";
import path, { isAbsolute } from "path";
const fontsDir = path.join(__dirname, "fonts");
import { __dirname } from "./pathUtil.mjs";
import { Logo } from "./types/logo.js";
import fs from "fs"; // Import fs to read the font file
import { calcCropImageAttrs } from "./utils/calcAttribute.js";

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
async function loadSVGStringNode(node, svgString) {
  const svgImage = await loadImage(
    `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`
  );
  node.image(svgImage);
}

export async function loadImageNode(node, url) {
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

export const calculateLogoSize = (logoData: Logo) => {
  const {
    padding: {
      paddingRight,
      paddingLeft,
      paddingBottom,
      paddingTop,
    }
  } = logoData;
  let logoPadding;
  
    const ratio: number = Math.round((logoData.imageWidth / logoData.imageHeight) * 100);
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
}