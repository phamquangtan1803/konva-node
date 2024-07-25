import { Group } from "../types/group.js";
import { parse, stringify } from "svgson";
import { Image } from "../types/image.js";
import { calcCropImageAttrs } from "./calcAttribute.js";

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
  } = imageData;
  // const params = calcCropImageAttrs(imageData, {
  //   cropX,
  //   cropY,
  //   cropWidth,
  //   cropHeight,
  //   rotation,
  // });
  // console.log("params", params);
  // Your additional logic here (e.g., calculating position, returning node logo)
  const result = {
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
      // cropHeight: cropHeight,
      // cropWidth: cropWidth,
      // cropX: cropX,
      // cropY: cropY,
    },

    className: "Image",
  };
  return result;
};
