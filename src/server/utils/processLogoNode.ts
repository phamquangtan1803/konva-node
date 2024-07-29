import { loadImage } from "canvas";
import { Logo } from "../types/logo.js";
import { parse, stringify } from "svgson";
import Konva from "konva";
import { applyFillColor, calculateLogoSize } from "../helper.js";

export const processLogoNode = async (logoData: Logo): Promise<Konva.Image> => {
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
    width,
    height,
  } = logoData;
  const {
    paddingX,
    paddingY,
    width: logoWidth,
    height: logoHeight,
  } = calculateLogoSize(logoData);
  console.log({ logoWidth, logoHeight });
  // Fetch the SVG data
  const response = await fetch(logoData.src);
  const svgText = await response.text();

  // Parse the SVG
  const svgObject = await parse(svgText);

  // Modify the fill color

  console.log(svgObject);
  applyFillColor(svgObject, logoData.fill);
  // svgObject.attributes.width = logoWidth.toString();
  // svgObject.attributes.height = logoHeight.toString();
  // Convert back to SVG string
  const modifiedSvgText = stringify(svgObject);
  console.log(modifiedSvgText);
  // Create a data URL from the modified SVG string
  const modifiedSvgDataUrl = `data:image/svg+xml;base64,${Buffer.from(
    modifiedSvgText
  ).toString("base64")}`;
  const logoNode = new Konva.Image({
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
  });
  // Load the modified SVG image
  const image = await loadImage(modifiedSvgDataUrl).then();
  logoNode.image(image);
  // Create and return a Konva.Image node
  return logoNode;
};
