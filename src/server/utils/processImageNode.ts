import Konva from "konva";
import { Group } from "../types/group.js";
import { loadImage } from "canvas";

export const processImageNode = async (imageData: any, groupData?: Group) => {
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
  } = imageData;

  const overlayNode = new Konva.Rect({
    id: `overlay-${id}`,
    width,
    height,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    opacity: opacity * alpha,
    rotation,
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
    opacity,
    rotation,
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

  const image = await loadImage(src);

  imageNode.setAttr("cropHeight", image.height * cropHeight || 0);
  imageNode.setAttr("cropWidth", image.width * cropWidth || 0);
  imageNode.setAttr("cropY", image.height * cropY || 0);
  imageNode.setAttr("cropX", image.width * cropX || 0);

  imageNode.image(image);

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
  });

  groupNode.add(imageNode);
  groupNode.add(overlayNode);

  return groupNode;
};
