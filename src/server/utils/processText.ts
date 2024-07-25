import { Group } from "../types/group.js";
import { Text } from "../types/text.js";

export const processText = async (textData: Text, groupData?: Group) => {
  // console.log(dummyLogo);
  const {
    id,
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
    text,
    lineHeight,
    letterSpacing,
    textFill,
    fontSize,
    align,
    verticalAlign,
    s3FilePath,
  } = textData;
  // Fetch the SVG data
  const result = {
    attrs: {
      id,
      width: width,
      height: height,
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
    },
    className: "Text",
  };
  console.log(result);
  return result;
};
