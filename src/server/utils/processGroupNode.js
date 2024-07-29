import Konva from "konva";
import { processLogoNode } from "./processLogoNode.js";
import { processText } from "./processText.js";
import { processImageNode } from "./processImageNode.js";
import { processLineNode } from "./processLineNode.js";
import { processButtonNode } from "./processButtonNode.js";
import { processStarRatingNode } from "./processStarRating.js";
import { processShapeNode } from "./processShapeNode.js";

export const processGroupNode = async (groupData) => {
  const {
    id,
    visible,
    x,
    y,
    opacity,
    scaleX,
    scaleY,
    rotation,
    width,
    height,
    groupChildren,
  } = groupData;
  const groupNode = new Konva.Group({
    id,
    width,
    height,
    x,
    y,
    opacity,
    rotation,
    visible,
    scaleX,
    scaleY,
    fill: "#000",
  });
  // Load the modified SVG image
  // Create and return a Konva.Image node
  for (const element of groupChildren) {
    const node = await processElement(element);
    if (node) {
      groupNode.add(node);
    }
  }
  return groupNode;
};
const processElement = async (element) => {
  if (!element.visible) return;

  switch (element.type) {
    case "svg":
      return processLogoNode(element);
    case "text":
      return processText(element);
    case "image":
      return processImageNode(element);
    case "video":
      return processImageNode(element);
    case "shape":
      if (
        element.elementType === "line" ||
        element.elementType === "line_outline"
      )
        return processLineNode(element);
      if (element.elementType === "button") return processButtonNode(element);
      if (element.elementType === "star_rating")
        return processStarRatingNode(element);

      return processShapeNode(element);

    case "image":
      return processImageNode(element);
    default:
      console.log("Unknown element type:", element.type);
      return null;
  }
};
