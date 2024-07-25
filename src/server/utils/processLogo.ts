import { loadImage } from "canvas";
import { Group } from "../types/group.js";
import { Logo } from "../types/logo.js";
import dummyLogo from "../data/logo.json";
import { parse, stringify } from "svgson";

export const processLogo = async (logoData: Logo, groupData?: Group) => {
  const {
    id,
    imageWidth,
    imageHeight,
    x,
    y,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    rotation,
    elementType,
  } = logoData;
  // Fetch the SVG data
  const response = await fetch(logoData.src);
  const svgText = await response.text();

  // Parse the SVG
  const svgObject = await parse(svgText);
  // Modify the fill color
  const applyFillColor = (node: any, fillColor: string) => {
    if (node.attributes) {
      node.attributes.fill = fillColor;
    }
    if (node.children) {
      node.children.forEach((child: any) => applyFillColor(child, fillColor));
    }
  };

  applyFillColor(svgObject, logoData.fill);

  // Convert back to SVG string
  const modifiedSvgText = stringify(svgObject);
  // Create a data URL from the modified SVG string
  const modifiedSvgDataUrl = `data:image/svg+xml;base64,${Buffer.from(
    modifiedSvgText
  ).toString("base64")}`;

  // Load the modified SVG image
  // const svgData = await loadImage(modifiedSvgDataUrl);

  // Your additional logic here (e.g., calculating position, returning node logo)
  const result = {
    attrs: {
      id,
      elementType,
      width: imageWidth,
      height: imageHeight,
      x,
      y,
      opacity: opacity,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      shadowOffsetX,
      shadowOffsetY,
      src: modifiedSvgDataUrl,
    },
    className: "Image",
  };
  console.log(result);
  return [result];
};
