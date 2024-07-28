import { Group } from "../types/group.js";
import { Text } from "../types/text.js";

export const processText = async (textData: Text, groupData?: Group) => {
  // console.log(dummyLogo);
  const {
    id,
    width,
    height,
    cornerRadiusBottomLeft= 0,
    cornerRadiusTopLeft= 0,
    cornerRadiusBottomRight= 0,
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
    elementType,
    padding,
  } = textData;
  // Fetch the SVG data
  const backgroundNode = {
    attrs: {
      fill: fill,
      cornerRadius: [cornerRadiusTopLeft, cornerRadiusTopRight, cornerRadiusBottomLeft, cornerRadiusBottomRight],
      padding
    },
    className: "Shape",
  }
  const result = {
    attrs: {
      id,
      width: width,
      height: height,
      backgroundColor: fill,
      x,
      y,
      opacity: opacity,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      shadowOffsetX,
      shadowOffsetY,
      fill: textFill,
      lineHeight,
      letterSpacing,
      text,
      fontSize,
      align,
      s3FilePath,
      verticalAlign,
      elementType
    },
    className: "Text",
  };
  return {
    text: result,
    background: backgroundNode,
  };
};
