import Konva from "konva";

export const processLineNode = (shapeData) => {
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
    rotation,
    opacity,
  });

  const lineNode = new Konva.Line({
    id,
    points,
    stroke,
    strokeWidth,
    opacity,
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
      opacity: alpha,
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
