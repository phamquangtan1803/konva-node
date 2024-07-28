import Konva from "konva";
import { processText } from "./processText.js";
import { processImageNode } from "./processImageNode.js";
import { processLogoNode } from "./processLogoNode.js";
import { processShapeNode } from "./processShapeNode.js";
import { processLineNode } from "./processLineNode.js";

export const createStage = async (data: any) => {
  const backgroundNode = new Konva.Rect({
    x: 0,
    y: 0,
    width: data.width,
    height: data.height,
    fill: data.background,
  });

  const stage = new Konva.Stage({
    width: data.width,
    height: data.height,
  });

  const layer = new Konva.Layer();

  layer.add(backgroundNode);

  // Add element to layer
  for (const element of data.children) {
    const node = await processElement(element);
    if (node) {
      layer.add(node);
    }
  }
  layer.batchDraw();

  stage.add(layer);

  return stage;
};

const processElement = async (element: any) => {
  switch (element.type) {
    case "svg":
      return processLogoNode(element);
    case "text":
      return processText(element);
    case "image":
      return processImageNode(element);
    case "shape":
      if (
        element.elementType === "line" ||
        element.elementType === "line_outline"
      )
        return processLineNode(element);
      return processShapeNode(element);
    default:
      console.log("Unknown element type:", element.type);
      return null;
  }
};
