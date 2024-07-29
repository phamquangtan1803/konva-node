import Konva from "konva";
import { loadImage } from "canvas";
import { parse, stringify } from "svgson";
import { Shape } from "../types/shape.js";
import { applyFillColor } from "../helper.js";

export const processRectNode = async (shapeData: Shape) => {
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
    name,
    cornerRadiusTopLeft,
    cornerRadiusBottomLeft,
    cornerRadiusBottomRight,
    cornerRadiusTopRight,
    scaleX,
    scaleY
  } = shapeData;

  const newScaleX = width / svgElement.width;
  const newScaleY = height / svgElement.height;
  const shapeStrokeWidth = (strokeWidth * 10) / Math.max(newScaleX, newScaleY);
  const cornerScale = Math.max(
    width / (svgElement.width),
    height / (svgElement.height)
  );


  const cornerProps = [
    name !== "Circle"
      ? cornerRadiusTopLeft
      : (Math.max(svgElement.width, svgElement.height) * cornerScale / 2),
    name !== "Circle"
      ? cornerRadiusTopRight
      : (Math.max(svgElement.width, svgElement.height) * cornerScale / 2) ,
    name !== "Circle"
      ? cornerRadiusBottomRight
      : (Math.max(svgElement.width, svgElement.height) * cornerScale / 2),
    name !== "Circle"
      ? cornerRadiusBottomLeft
      : (Math.max(svgElement.width, svgElement.height) * cornerScale / 2) ,
  ];
  //   // Fetch the SVG data
  //   const response = await fetch(svgElement.svgUrl);
  //   const svgText = await response.text();

  //   // Parse the SVG

  //   const svgObject = await parse(svgText);
  //   // Modify the fill color
  //   if (svgObject.attributes) {
  //     svgObject.attributes.fill = shapeData.fill;
  //   }
  //   if (svgObject.children) {
  //     svgObject.children.forEach((child) =>
  //       applyFillColor(child, shapeData.fill)
  //     );
  //   }
  //   const modifiedSvgText = stringify(svgObject);
  //   const modifiedSvgObject = await parse(modifiedSvgText);
  //   // Get path data
  //   const path = findPathDAttribute(modifiedSvgObject);

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    rotation,
    opacity,
  });

  const shapeNode = new Konva.Rect({
    id,
    width: width,
    height: height,
    scaleX,
    scaleY,
    x: 0, // Set relative to the group
    y: 0, // Set relative to the group
    shadowColor,
    shadowBlur: shadowBlur / Math.max(scaleX, scaleY),
    shadowOpacity: shadowOpacity * opacity,
    shadowOffsetX: shadowOffsetX / scaleX,
    shadowOffsetY: shadowOffsetY / scaleY,
    fill,
    stroke,
    strokeWidth: shapeStrokeWidth,
    cornerRadius: cornerProps,
  });

  if (src) {
    try {
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
    } catch (error: any) {
      console.error(`Failed to load image: ${error.message}`);
    }
  }

  groupNode.add(shapeNode);
  if (overlayFill) {
    const overlayNode = new Konva.Rect({
      id: `overlay-${id}`,
      width: svgElement.width,
      height: svgElement.height,
      scaleX,
      scaleY,
      x: 0, // Set relative to the group
      y: 0, // Set relative to the group
      opacity: alpha,
      fill: overlayFill,
      stroke: overlayFill,
      strokeWidth: shapeStrokeWidth,
      cornerRadius: cornerProps,
    });
    groupNode.add(overlayNode);
  }
  return groupNode;
};
