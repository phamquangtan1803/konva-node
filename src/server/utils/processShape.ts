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
    elementType,
    rotation,
    svgElement,
    stroke,
    strokeWidth,
    fill,
    overlayFill,
    alpha,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    src,
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
  const modifiedSvgText = stringify(svgObject);
  const modifiedSvgObject = await parse(modifiedSvgText);

  let pathDAttribute = "";

  const findPathDAttribute = (node: any) => {
    if (node.name === "path" && node.attributes && node.attributes.d) {
      pathDAttribute = node.attributes.d;
    }
    if (node.children) {
      node.children.forEach((child: any) => findPathDAttribute(child));
    }
  };

  findPathDAttribute(modifiedSvgObject);
  const scaleX = width / svgElement.width;
  const scaleY = height / svgElement.height;
  const shapeStrokeWidth = (strokeWidth * 10) / Math.max(scaleX, scaleY);

  const overlayNode = {
    attrs: {
      id,
      width: width,
      height: height,
      scaleX,
      scaleY,
      x,
      y,
      opacity: alpha * opacity,
      rotation,

      fill: overlayFill,
      stroke,
      strokeWidth: shapeStrokeWidth,
      data: pathDAttribute,
    },
    className: "Path",
  };

  const result = [
    {
      attrs: {
        id,
        width: width,
        height: height,
        scaleX,
        scaleY,
        elementType,
        x,
        y,
        opacity: opacity,
        rotation,
        shadowColor,
        shadowBlur: shadowBlur / Math.max(scaleX, scaleY),
        shadowOpacity: shadowOpacity * opacity,
        shadowOffsetX: shadowOffsetX / scaleX,
        shadowOffsetY: shadowOffsetY / scaleY,
        fill: fill,
        stroke,
        strokeWidth: (strokeWidth * 10) / Math.max(scaleX, scaleY),
        fillPatternRepeat: "no-repeat",
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        src,
        data: pathDAttribute,
      },
      className: "Path",
    },
    overlayNode,
  ];
  console.log(result);
  return result;
};
