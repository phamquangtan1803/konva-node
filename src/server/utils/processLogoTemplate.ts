import { loadImage } from "canvas";
import { Group } from "../types/group.js";
import { Logo } from "../types/logo.js";
import { parse, stringify } from "svgson";
import Konva from "konva";

export const processLogo = async (
  logoData: Logo,
  groupData?: Group
): Promise<Konva.Image> => {
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
  const image = await loadImage(modifiedSvgDataUrl);

  // Create and return a Konva.Image node
  return new Konva.Image({
    id,
    image: image,
    width: imageWidth,
    height: imageHeight,
    x,
    y,
    opacity,
    rotation,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
  });
};
