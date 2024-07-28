import Konva from "konva";
import { loadImage } from "canvas";
import { Group } from "../types/group.js";
import { parse, stringify } from "svgson";
import { Shape } from "../types/shape.js";
import { applyFillColor } from "../helper.js";
const NUM_STARS = 5;
const STARS_ARR = [...Array(NUM_STARS).keys()];
const STAR_PATH =
  "M52 0.545044L64.2755 38.3253H104L71.8622 61.6747L84.1378 99.4549L52 76.1055L19.8622 99.4549L32.1378 61.6747L0 38.3253H39.7245L52 0.545044Z";
export const processStarRatingNode = async (
  starRatingData: Shape,
  groupData?: Group
) => {
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
  } = starRatingData;
  const starWidth = width / 5;
  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    rotation,
    opacity,
  });
  const starAttr = {
    id,
    width,
    height,
    x: 0,
    y: 0,
    shadowColor,
    shadowBlur: shadowBlur,
    shadowOpacity: shadowOpacity * opacity,
    shadowOffsetX: shadowOffsetX,
    shadowOffsetY: shadowOffsetY,
    fill,
    stroke,
    data: STAR_PATH,
  };
  console.log("STARARR", STARS_ARR);
  STARS_ARR.forEach((star, index) => {
    const starNode = new Konva.Path({
      ...starAttr,
      id: id + index,
      x: index * starWidth,
      width: starWidth,
      //   offsetX: starWidth * 0.05,
      offsetX: -starWidth * 0.05 * index,
    });
    groupNode.add(starNode);
    if (overlayFill) {
      const overlayNode = new Konva.Path({
        ...starAttr,
        id: `overlay-${id + index}`,
        x: index * starWidth,
        width: starWidth,
        fill: overlayFill,
        opacity: alpha,
        offsetX: -starWidth * 0.05 * index,
      });
      groupNode.add(overlayNode);
    }
  });

  return groupNode;
};
