import Konva from "konva";
import axios from "axios";
import { Text } from "../types/text.js";
import {
  drawTextBackground,
  convertTextToStyle,
  convertFontFamily,
} from "../helper.js";
import { registerFont } from "canvas";
import path from "path";
import fs from "fs";
import { __dirname } from "../pathUtil.js";

// Get the directory name of the current module
const fontsDir = path.join(__dirname, "fonts");

export const processText = async (textData: Text) => {
  const {
    id,
    width,
    height,
    cornerRadiusBottomLeft = 0,
    cornerRadiusTopLeft = 0,
    cornerRadiusBottomRight = 0,
    cornerRadiusTopRight = 0,
    x,
    y,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    rotation,
    text,
    lineHeight,
    letterSpacing,
    textFill,
    fontSize,
    align,
    verticalAlign,
    s3FilePath,
    fill,
    padding,
    autoFitEnabled,
    scaleX,
    scaleY,
    visible,
    textTransform,
    fontFamily,
    fontStyle,
    textDecoration,
    fontId,
  } = textData;

  const fontFamilyConvert = convertFontFamily(fontFamily, fontId);
  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    width: width,
    height: height,
    opacity,
    rotation,
  });

  const textNode = new Konva.Text({
    id: id,
    x: 0,
    y: 0,
    width: width,
    height: height,
    opacity: 1,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    text: convertTextToStyle(text, textTransform),
    lineHeight,
    letterSpacing,
    fontStyle,
    textDecoration,
    fontSize,
    align,
    verticalAlign,
    s3FilePath,
    fill: textFill,
    textTransform,
    ellipsis: !autoFitEnabled,
    scaleX,
    scaleY,
    visible,
    fontFamily,
  });

  await loadCustomFont(s3FilePath, fontFamilyConvert);
  textNode.fontFamily(fontFamilyConvert);
  const cornerRadiusMax = Math.max(
    cornerRadiusTopLeft,
    cornerRadiusTopRight,
    cornerRadiusBottomRight,
    cornerRadiusBottomLeft
  );

  const horizontalPadding = Math.max(padding?.horizontal, 0);
  const verticalPadding = Math.max(padding?.vertical, 0);

  const backgroundNode = new Konva.Shape({
    x: 0,
    y: 0,
    stroke: fill,
    fill: fill,
    opacity: opacity,
    width: width,
    height: height,
    cornerRadius: [
      cornerRadiusTopLeft,
      cornerRadiusTopRight,
      cornerRadiusBottomLeft,
      cornerRadiusBottomRight,
    ],
  });

  backgroundNode.sceneFunc(function (ctx: any, shape: any) {
    drawTextBackground({
      ctx,
      shape,
      textElement: textNode,
      options: {
        horizontalPadding,
        verticalPadding,
        cornerRadius: cornerRadiusMax,
      },
    });
  });

  groupNode.add(backgroundNode);
  groupNode.add(textNode);

  return groupNode;
};
const loadCustomFont = async (s3FilePath: string, fontFamily: string) => {
  const uniqueFileName = `custom-font-${Date.now()}.otf`;
  const fontPath = path.join(fontsDir, uniqueFileName);

  try {
    if (!s3FilePath) {
      throw new Error("There is no file path");
    }
    const response = await axios.get(s3FilePath, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);
    fs.writeFileSync(fontPath, buffer);

    registerFont(fontPath, { family: fontFamily });
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("Error loading font:", error);
    throw error;
  }
};
