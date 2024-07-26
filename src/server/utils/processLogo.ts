import { loadImage } from "canvas";
import fetch from 'node-fetch'
import { Group } from "../types/group.js";
import { Logo } from "../types/logo.js";
import dummyLogo from "../data/logo.json";
import {calculateLogoSize} from '../helper.js'
import { parse, stringify } from "svgson";

export const processLogo = async (logoData: Logo, groupData?: Group) => {
  const {
    id,
    imageWidth,
    imageHeight,
    visible,
    x,
    y,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    scaleX,
    scaleY,
    rotation,
    paddingRatio,
  } = logoData;
  // Fetch the SVG data

  const {paddingX, paddingY, width: logoWidth, height: logoHeight} = calculateLogoSize(logoData);
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
      width: logoWidth,
      height: logoHeight,
      x,
      y,
      opacity: opacity,
      paddingRatio,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      shadowOffsetX,
      shadowOffsetY,
      cropWidth: imageWidth,
      cropHeight: imageHeight,
      visible,
      scaleX,
      scaleY,
      offsetX: -paddingX,
      offsetY: -paddingY,
      src: modifiedSvgDataUrl,
    },
    className: "Image",
  };
  return result;
};
