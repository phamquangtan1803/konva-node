import Konva from "konva";
import { loadImage } from "canvas";
import { Button } from "../types/button.js";

export const processButtonNode = async (buttonData: Button) => {
  const {
    scaleX,
    scaleY,
    id,
    x,
    y,
    width,
    height,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    elementType,
    rotation,
    svgElement,
    stroke,
    strokeWidth,
    fill,
    overlayFill,
    alpha,
    textFill,
    text,
    fontFamily,
    fontSize,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    src,
    cornerRadiusTopLeft,
    cornerRadiusTopRight,
    cornerRadiusBottomRight,
    cornerRadiusBottomLeft,
  } = buttonData;

  // Get path data

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    rotation,
    opacity,
  });
  const buttonRectNode = new Konva.Image({
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
    fill,
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
  if (src) {
    const image = await loadImage(src);
    const scaleImageX = width / image?.width / cropWidth;
    const scaleImageY = height / image?.height / cropHeight;
    const offsetImageX = image?.width * cropX;
    const offsetImageY = image?.height * cropY;
    buttonRectNode.fillPatternScaleX(scaleImageX / scaleY);
    buttonRectNode.fillPatternScaleY(scaleImageY / scaleY);
    buttonRectNode.fillPatternOffsetX(offsetImageX);
    buttonRectNode.fillPatternOffsetY(offsetImageY);
    buttonRectNode.fillPatternImage(image);
    buttonRectNode.setAttr("fill", undefined);
  }

  groupNode.add(buttonRectNode);

  if (overlayFill) {
    const overlayNode = new Konva.Rect({
      id: `overlay-${id}`,
      width,
      height,
      x: 0, // Set relative to the group
      y: 0, // Set relative to the group
      opacity: alpha,

      fill: overlayFill,
      strokeWidth,
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
    groupNode.add(overlayNode);
  }
  const buttonTextNode = new Konva.Text({
    id: `text-${id}`,
    width,
    height,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    text,
    fontFamily,
    fontSize,
    fill: textFill,
    strokeWidth,
    align: "center",
    verticalAlign: "middle",
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
  groupNode.add(buttonTextNode);

  return groupNode;
};
