import { Group } from "../types/group.js";
import { parse, stringify } from "svgson";
import { Image } from "../types/image.js";

export const processImage = async (imageData: Image, groupData?: Group) => {
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

  const overlayNode = {
    attrs: {
      id: `overlay-${id}`,
      width,
      height,
      x,
      y,
      opacity: opacity * alpha,
      rotation,
      fill: overlayFill,

      cornerRadius: [
        cornerRadiusTopLeft,
        cornerRadiusTopRight,
        cornerRadiusBottomRight,
        cornerRadiusBottomLeft,
      ],
    },
    className: "Rect",
  };

  const result = [
    {
      attrs: {
        id,
        width,
        height,
        x,
        y,
        opacity: opacity,
        rotation,
        shadowColor,
        shadowBlur,
        shadowOpacity,
        shadowOffsetX,
        shadowOffsetY,
        strokeWidth,
        stroke,
        src,
        cropHeight,
        cropWidth,
        cropX,
        cropY,
        elementType,
        cornerRadius: [
          cornerRadiusTopLeft,
          cornerRadiusTopRight,
          cornerRadiusBottomRight,
          cornerRadiusBottomLeft,
        ],
      },

      className: "Image",
    },
    overlayNode,
  ];
  return result;
};
