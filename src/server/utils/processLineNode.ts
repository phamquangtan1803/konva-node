import Konva from "konva";
import { Group } from "../types/group.js";
import { Line } from "../types/line.js";

export const processLineNode = (shapeData: Line, groupData?: Group) => {
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
    stroke,
    strokeWidth,
    fill,
    overlayFill,
    alpha,
    points,
    dash,
  } = shapeData;

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
  });

  const lineNode = new Konva.Line({
    id,
    points,
    stroke,
    strokeWidth,
    opacity,
    rotation,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    dash,
  });
  groupNode.add(lineNode);

  if (overlayFill) {
    const overlayNode = new Konva.Line({
      id: `overlay-${id}`,
      points,
      stroke: overlayFill,
      strokeWidth,
      opacity: alpha * opacity,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      shadowOffsetX,
      shadowOffsetY,
      dash,
    });
    groupNode.add(overlayNode);
  }

  return groupNode;
};
