import Konva from "konva";
import { Text } from "../types/text.js";
import { drawTextBackground } from "../helper.js";
import { registerFont } from "canvas";
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
  } = textData;

  const isEnableBackground = fill && fill !== "" && fill !== "transparent";

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
    text,
    lineHeight,
    letterSpacing,
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
    // ...(isEnableBackground && {
    //   shadowColor,
    //   shadowBlur,
    //   shadowOffsetX,
    //   shadowOffsetY,
    //   shadowOpacity,
    // }),
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
