import { loadImage } from "canvas";
import { Group } from "../types/group.js";
import { parse, stringify } from "svgson";
import { Shape } from "../types/shape.js";

export const processShape = async (shapeData: Shape, groupData?: Group) => {
  const {
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
    rotation,
    svgElement,
  } = shapeData;
  // Fetch the SVG data
  const response = await fetch(svgElement.svgUrl);
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

  applyFillColor(svgObject, shapeData.fill);

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
      width: svgElement.width,
      height: svgElement.height,
      scaleX: width / svgElement.width,
      scaleY: height / svgElement.height,
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
  return result;
};
