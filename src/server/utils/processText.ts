import Konva from "konva";
import { Group } from "../types/group.js";
import { Text } from "../types/text.js";
import { drawTextBackground } from "../helper.js";

export const processText = async (textData: Text, groupData?: Group) => {
  const {
    id,
    width,
    height,
    cornerRadiusBottomLeft= 0,
    cornerRadiusTopLeft= 0,
    cornerRadiusBottomRight= 0,
    cornerRadiusTopRight = 0,
    x,
    y,
    opacity,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    rotation,
    text,
    lineHeight,
    letterSpacing,
    textFill,
    fontSize,
    align,
    verticalAlign,
    s3FilePath,
    fill,
    padding,
    autoFitEnabled,
    scaleX, scaleY,
    visible,
  } = textData;

  
  const isEnableBackground = fill && fill !== "" && fill !== "transparent";

  const getTokensInString = (text: any) => {
    if (typeof text === "string") {
      let result: any = [];
      let tokens = text.split(/\s+/);
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].length > 0) {
          result = [...result, tokens[i]];
        }
      }
      return result;
    }
    return [];
  };

  const hasBrokenWords = (sourceTokens: any, renderLines: any) => {
    let combined = "";
    for (let i = 0; i < renderLines.length; i++) {
      combined += (i === 0 ? "" : " ") + renderLines[i].text;
    }
  
    let a = sourceTokens;
    let b = getTokensInString(combined);
  
    if (a.length !== b.length) {
      return true;
    }
  
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return true;
      }
    }
  
    return false;
  };

  const groupNode = new Konva.Group({
    id: `group-${id}`,
    x,
    y,
    width: width,
    height: height,
    opacity,
    rotation,
  })

  const textNode = new Konva.Text({
    x: 0,
    y: 0,
    width: 927,
    height: 270,
    opacity: 1,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    text,
    lineHeight,
    letterSpacing,
    fontSize,
    align,
    verticalAlign,
    s3FilePath,
    fill: textFill,
    padding,
    ellipsis: !autoFitEnabled,
    scaleX,
    scaleY,
    visible,
  });
  

  const _handleResizeText = () => {
    if (!textNode) return;
    const textString = textNode.text();
    const numOfTextLine = textNode.textArr.length;

    let sourceTokens = getTokensInString(textString);
    let brokenWords = hasBrokenWords(sourceTokens, textNode.textArr);
    const { width: mesuareTextWidth } = textNode.measureSize([textString]);
    let overflowWidth =
      mesuareTextWidth > textNode.width() * numOfTextLine;

    while ((brokenWords || overflowWidth) && textNode.fontSize() > 0) {
      textNode.fontSize(textNode.fontSize() - 1);
      brokenWords = hasBrokenWords(sourceTokens, textNode.textArr);
      const { width: mesuareTextWidth } = textNode.measureSize([
        textString,
      ]);
      overflowWidth = mesuareTextWidth > textNode.width() * numOfTextLine;
    }

    if (
      textNode.fontSize() &&
      textNode.fontSize() !== fontSize
    ) {
      textNode.fontSize(textNode.fontSize())
    }
  };

  const _calculateFontSizeFit = () => {
    if (!textNode || !autoFitEnabled) return;
    const containerWidth = Math.max(5, width * scaleX);
    const containerHeight = Math.max(5, height * scaleY);
    textNode.fontSize(containerHeight);
    const { width: mesuareTextWidth } = textNode.measureSize([
      textNode.text(),
    ]);
    let textWidth = Math.round(mesuareTextWidth);
    const fontSize = textNode.fontSize() || textData.fontSize;

    const textScaleX = containerWidth / textWidth;
    console.log("text scale", textScaleX)
    let newFontSize: number = Math.round(fontSize * textScaleX);

    const textScaleY = containerHeight / newFontSize;
    let isTextResized = false;

    if (newFontSize > containerHeight) {
      textNode.fontSize(containerHeight);
      _handleResizeText();
    } else if (textScaleY >= 2) {
      const maxLine = Math.max(Math.round(1 / textScaleX), textScaleY);

      for (
        let textLine = 1;
        textLine <= maxLine && !isTextResized;
        textLine++
      ) {
        newFontSize = Math.round(
        containerHeight / (textLine - 0.5)
        );
        textNode.fontSize(newFontSize);
        const { width: mesuareTextWidth } = textNode.measureSize([
          textNode.text(),
        ]);
        let textWidth = Math.round(mesuareTextWidth);

        if (containerWidth * (textLine + 0.5) >= textWidth) {
          newFontSize = Math.round(
            containerHeight / (textLine - 0.5)
          );
          textNode.fontSize(newFontSize);
          _handleResizeText();
          isTextResized = true;
        }
      }
    } else {
      textNode.fontSize(newFontSize);
      _handleResizeText();
    }
  };


  const cornerRadiusMax = Math.max( cornerRadiusTopLeft,
    cornerRadiusTopRight,
    cornerRadiusBottomRight,
    cornerRadiusBottomLeft)

    const horizontalPadding = Math.max(padding?.horizontal, 0);
    const verticalPadding = Math.max(padding?.vertical, 0);

    _calculateFontSizeFit();

  const backgroundNode = new Konva.Shape({
    x: 0,
    y: 0,
    stroke: fill,
    fill: fill,
    width: width,
    height: height,
    ...(isEnableBackground && {
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowOpacity,
    }),
    cornerRadius: [cornerRadiusTopLeft, cornerRadiusTopRight, cornerRadiusBottomLeft, cornerRadiusBottomRight],
  });

  backgroundNode.sceneFunc(function(ctx: any, shape: any) {
      drawTextBackground({ctx, shape, textElement: textNode, options: {
        horizontalPadding,
        verticalPadding,
        cornerRadius: cornerRadiusMax,
      }})
  })

  groupNode.add(backgroundNode);
  groupNode.add(textNode);
  
  return groupNode;
};
