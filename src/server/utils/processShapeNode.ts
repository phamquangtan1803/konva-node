import Konva from "konva";
import { loadImage } from "canvas";
import { Group } from "../types/group.js";
import { parse, stringify } from "svgson";
import { Shape } from "../types/shape.js";
import { applyFillColor } from "../helper.js";

export const processShapeNode = async (shapeData: Shape, groupData?: Group) => {
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

  const scaleX = width / svgElement.width;
  const scaleY = height / svgElement.height;
  const shapeStrokeWidth = (strokeWidth * 10) / Math.max(scaleX, scaleY);

  // Fetch the SVG data
  const response = await fetch(svgElement.svgUrl);
  const svgText = await response.text();

  // Parse the SVG
  const svgObject = await parse(svgText);

  // Modify the fill color
  applyFillColor(svgObject, shapeData.fill);
  const modifiedSvgText = stringify(svgObject);
  const modifiedSvgObject = await parse(modifiedSvgText);

  // Get path data
  const path = findPathDAttribute(modifiedSvgObject);

  const overlayNode = new Konva.Path({
    id: `overlay-${id}`,
    width,
    height,
    scaleX,
    scaleY,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    opacity: alpha * opacity,
    rotation,
    fill: overlayFill,
    stroke,
    strokeWidth: shapeStrokeWidth,
    data: pathDAttribute,
  });

  const shapeNode = new Konva.Path({
    id,
    width,
    height,
    scaleX,
    scaleY,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    opacity,
    rotation,
    shadowColor,
    shadowBlur: shadowBlur / Math.max(scaleX, scaleY),
    shadowOpacity: shadowOpacity * opacity,
    shadowOffsetX: shadowOffsetX / scaleX,
    shadowOffsetY: shadowOffsetY / scaleY,
    fill,
    stroke,
    strokeWidth: shapeStrokeWidth,
    data: path,
  });

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
  });
  if (src) {
    const image = await loadImage(src);
    const scaleImageX = width / image?.width / cropWidth;
    const scaleImageY = height / image?.height / cropHeight;
    const offsetImageX = image?.width * cropX;
    const offsetImageY = image?.height * cropY;
    shapeNode.fillPatternScaleX(scaleImageX / scaleX);
    shapeNode.fillPatternScaleY(scaleImageY / scaleY);
    shapeNode.fillPatternOffsetX(offsetImageX);
    shapeNode.fillPatternOffsetY(offsetImageY);
    shapeNode.fillPatternImage(image);
    shapeNode.setAttr("fill", undefined);
  }

  groupNode.add(shapeNode);
  groupNode.add(overlayNode);

  return groupNode;
};
const findPathDAttribute = (node) => {
  let pathDAttribute = "";

  if (node.name === "path" && node.attributes && node.attributes.d) {
    pathDAttribute = node.attributes.d;
  }
  if (node.children) {
    node.children.forEach((child) => findPathDAttribute(child));
  }
  return pathDAttribute;
};
