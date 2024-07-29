import Konva from "konva";
import { loadImage } from "canvas";
import { applyStrokeColor } from "../helper.js";
import { parse, stringify } from "svgson";
import { Image } from "../types/image.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { __dirname } from "../pathUtil.js";
export const processImageNode = async (imageData: Image) => {
  const {
    id,
    imageWidth,
    imageHeight,
    width,
    height,
    x,
    y,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    rotation,
    strokeWidth,
    stroke,
    src,
    cropHeight,
    cropWidth,
    cropX,
    cropY,
    cornerRadiusBottomLeft,
    cornerRadiusTopRight,
    cornerRadiusTopLeft,
    cornerRadiusBottomRight,
    overlayFill,
    elementType,
    alpha,
    svgColor,
  } = imageData;

  const overlayNode = new Konva.Rect({
    id: `overlay-${id}`,
    width,
    height,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    opacity: alpha,
    fill: overlayFill,
    cornerRadius: [
      cornerRadiusTopLeft,
      cornerRadiusTopRight,
      cornerRadiusBottomRight,
      cornerRadiusBottomLeft,
    ],
  });

  const imageNode = new Konva.Image({
    id,
    width,
    height,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    strokeWidth,
    stroke,
    crop: {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    },
    cornerRadius: [
      cornerRadiusTopLeft,
      cornerRadiusTopRight,
      cornerRadiusBottomRight,
      cornerRadiusBottomLeft,
    ],
  });
  let getImageSrc;
  if (src.endsWith(".svg")) {
    const response = await fetch(src);
    const svgText = await response.text();

    // Parse the SVG
    const svgObject = await parse(svgText);
    // Modify the fill color

    applyStrokeColor(svgObject, svgColor || "#000");

    svgObject.attributes.width = width.toString();
    svgObject.attributes.height = height.toString();

    // Convert back to SVG string
    const modifiedSvgText = stringify(svgObject);

    // Create a data URL from the modified SVG string
    getImageSrc = `data:image/svg+xml;base64,${Buffer.from(
      modifiedSvgText
    ).toString("base64")}`;
    imageNode.node;
  } else if (
    src.endsWith(".mp4") ||
    src.endsWith(".webm") ||
    src.endsWith(".ogg")
  ) {
    const videoPosterDir = path.join(__dirname, "videoPoster");
    if (!fs.existsSync(videoPosterDir)) {
      fs.mkdirSync(videoPosterDir, { recursive: true });
    }
    // Create a temporary file path for the extracted frame
    const tempFilePath = path.join(videoPosterDir, `frame-${id}.png`);
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i "${src}" -vf "scale=${width}:${height}" -vframes 1 "${tempFilePath}"`,
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve(null);
        }
      );
    });

    getImageSrc = tempFilePath;
  } else {
    getImageSrc = src;
  }
  try {
    const image = await loadImage(getImageSrc);

    imageNode.setAttr("cropHeight", image.height * cropHeight || 0);
    imageNode.setAttr("cropWidth", image.width * cropWidth || 0);
    imageNode.setAttr("cropY", image.height * cropY || 0);
    imageNode.setAttr("cropX", image.width * cropX || 0);

    imageNode.image(image);
  } catch (error: any) {
    console.error(`Failed to load image: ${error.message}`);
  }

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    opacity,
    rotation,
  });

  groupNode.add(imageNode);
  groupNode.add(overlayNode);

  return groupNode;
};
