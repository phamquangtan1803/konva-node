import { processImage } from "./processImage.js";
import { processLogo } from "./processLogo.js";
import { processShape } from "./processShape.js";
import { processText } from "./processText.js";

export const processData = async (data: any) => {
  const promises = data.children.map((item: any) => processElement(item));

  const newChildren = await Promise.all(promises);

  const backgroundNode = {
    attrs: {
      x: 0,
      y: 0,
      width: data.width,
      height: data.height,
      fill: data.background,
    },
    className: "Rect",
  };
  const stage = {
    attrs: {
      width: data.width,
      height: data.height,
    },
    className: "Stage",
    children: [
      {
        attrs: {
          fill: "#FFFFFF",
        },
        className: "Layer",
        children: [backgroundNode, ...newChildren],
      },
    ],
  };
  console.log(stage.children[0].children);
  return stage;
};

const processElement = async (element: any) => {
  switch (element.type) {
    case "svg":
      return processLogo(element);
    // Uncomment and add cases as needed
    case "text":
      return processText(element);
    case "image":
      return processImage(element);
    case "shape":
      return processShape(element);
    // case "graphicShape":
    //   return processShape(element);
    // case "cta":
    //   return processCta(element);
    // Add cases for other element types as needed
    default:
      console.log("Unknown element type:", element.type);
      return null;
  }
};
