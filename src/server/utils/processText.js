import Konva from "konva";
import axios from "axios";
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

export const processText = async (textData) => {
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
  const uniqueFileName = `custom-font-${id}.otf`;
  const fontPath = path.join(fontsDir, uniqueFileName);

  // registerFont(fontPath, { family: fontFamily });

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

  backgroundNode.sceneFunc(function (ctx, shape) {
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
