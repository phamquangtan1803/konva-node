import axios from "axios";
// import WebFont from "webfontloader";

export const TEXT_ALIGNMENTS = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFY: "justify",
  TOP: "top",
  BOTTOM: "bottom",
  MIDDLE: "middle",
};

export const TEXT_TRANSFORM = {
  SENTENCE_CASE: "sentenceCase",
  UPPERCASE: "uppercase",
  TITLE_CASE: "titleCase",
  AS_TYPED: "none",
};

export async function fetchJsonData(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    throw error;
  }
}

export const calculateLogoSize = (logoData) => {
  const {
    padding: { paddingRight, paddingLeft, paddingBottom, paddingTop },
  } = logoData;
  let logoPadding;

  const ratio = Math.round((logoData.imageWidth / logoData.imageHeight) * 100);
  if (ratio < 62.5) {
    logoPadding = logoData.imageWidth;
  } else if (62.5 <= ratio && ratio <= 100) {
    logoPadding = logoData.imageWidth / 2;
  } else if (100 < ratio && ratio <= 160) {
    logoPadding = logoData.imageHeight / 2;
  } else {
    logoPadding = logoData.imageHeight;
  }
  logoPadding = logoPadding * logoData.paddingRatio;

  const imageBoxPaddingHorizontal =
    (paddingRight ? logoPadding : 0) + (paddingLeft ? logoPadding : 0);
  const imageBoxPaddingVertical =
    (paddingTop ? logoPadding : 0) + (paddingBottom ? logoPadding : 0);

  const imageBoxWidth = logoData.imageWidth + imageBoxPaddingHorizontal;
  const imageBoxHeight = logoData.imageHeight + imageBoxPaddingVertical;

  const scaleY = logoData.height / imageBoxHeight;
  const scaleX = logoData.width / imageBoxWidth;
  const scaleImageBox = scaleX > scaleY ? scaleY : scaleX;
  const containerPadding = logoPadding * scaleImageBox;

  const containerPaddingTop = paddingTop ? containerPadding : 0;
  const containerPaddingRight = paddingRight ? containerPadding : 0;
  const containerPaddingBottom = paddingBottom ? containerPadding : 0;
  const containerPaddingLeft = paddingLeft ? containerPadding : 0;

  const scaleWidth = scaleImageBox * imageBoxWidth;
  const scaleHeight = scaleImageBox * imageBoxHeight;
  const imageWidth = scaleWidth - containerPaddingRight - containerPaddingLeft;
  const imageHeight =
    scaleHeight - containerPaddingTop - containerPaddingBottom;

  const imagePaddingLeft = paddingLeft
    ? paddingRight
      ? (logoData.width - imageWidth) / 2
      : logoData.width - imageWidth
    : 0;
  const imagePaddingTop = paddingTop
    ? paddingBottom
      ? (logoData.height - imageHeight) / 2
      : logoData.height - imageHeight
    : 0;

  return {
    width: Math.round(imageWidth),
    height: Math.round(imageHeight),
    paddingX: Math.round(imagePaddingLeft),
    paddingY: Math.round(imagePaddingTop),
  };
};
export const applyFillColor = (node, fillColor) => {
  if (node.attributes && node.name === "path") {
    node.attributes.fill = fillColor;
  }
  if (node.children) {
    node.children.forEach((child) => applyFillColor(child, fillColor));
  }
};
export const applyStrokeColor = (node, strokeColor) => {
  if (node.attributes) {
    node.attributes.stroke = strokeColor;
  }
  if (node.children) {
    node.children.forEach((child) => applyStrokeColor(child, strokeColor));
  }
};

const drawBorderLine = ({ lines, shape, ctx, textElement, options }) => {
  const {
    horizontalPadding,
    verticalPadding,
    cornerRadius: radius = 0,
  } = options;
  const fill = shape.fill();
  const haveNotFillColor = !fill || fill === "transparent";

  if (haveNotFillColor || !textElement) {
    return;
  }
  const gapX = horizontalPadding;
  const gapY = verticalPadding;

  const maxLineWidth = textElement?.textWidth + gapX * 2;
  const lineHeight = textElement.lineHeight() * textElement.fontSize();
  const maxLineHeight = lineHeight + gapY * 2;
  const shapeHeight = textElement?.height() + gapY * 2;

  const isAlignCenter = textElement?.align() === "center";
  const isVerticalAlignMiddle = textElement?.verticalAlign() === "middle";
  const isVerticalAlignBottom = textElement?.verticalAlign() === "bottom";

  const paddingVertical = isVerticalAlignMiddle
    ? (shapeHeight - gapY * 2 - lineHeight * lines.length) / 2
    : isVerticalAlignBottom
    ? shapeHeight - gapY * 2 - lineHeight * lines.length
    : 0;
  const x = isAlignCenter
    ? (textElement?.width() - textElement?.textWidth) / 2 - gapX
    : -gapX;
  const y = -gapY + paddingVertical;
  let currentY = 0;

  const firstLineWidth = lines[0]?.width + gapX * 2;
  const firstLineX = isAlignCenter
    ? x + (maxLineWidth - firstLineWidth) / 2
    : x;
  // Top-left corner
  ctx.moveTo(firstLineX + firstLineWidth / 2, y);
  // Top-right corner of the first line
  ctx.lineTo(firstLineX + firstLineWidth - radius, y);
  ctx.quadraticCurveTo(
    firstLineX + firstLineWidth,
    y,
    firstLineX + firstLineWidth,
    y + radius
  );
  // Right edge of the first line
  currentY = y + maxLineHeight - radius;
  ctx.lineTo(firstLineX + firstLineWidth, currentY);
  // Bottom-right corner
  for (let i = 1; i < lines.length; i++) {
    const lineWidth = lines[i]?.width + gapX * 2;
    const prevLineWidth = lines[i - 1]?.width + gapX * 2;
    const lineY = y + i * lineHeight;
    const lineX = isAlignCenter ? x + (maxLineWidth - lineWidth) / 2 : x;
    const prevLineX = isAlignCenter
      ? x + (maxLineWidth - prevLineWidth) / 2
      : x;
    const prevLineY = prevLineWidth > lineWidth ? currentY + radius : lineY;
    if (
      Math.abs(prevLineWidth - lineWidth) >
      radius * (isAlignCenter ? 4 : 2)
    ) {
      const lineRadius = prevLineWidth - lineWidth > 0 ? radius : -radius;
      ctx.lineTo(prevLineX + prevLineWidth, prevLineY - radius);
      ctx.quadraticCurveTo(
        prevLineX + prevLineWidth,
        prevLineY,
        prevLineX + prevLineWidth - lineRadius,
        prevLineY
      );
      ctx.lineTo(lineX + lineWidth + lineRadius, prevLineY);
      ctx.quadraticCurveTo(
        lineX + lineWidth,
        prevLineY,
        lineX + lineWidth,
        prevLineY + radius
      );
      ctx.lineTo(lineX + lineWidth, lineY + maxLineHeight - radius);
      currentY = lineY + maxLineHeight - radius;
    } else if (Math.abs(prevLineWidth - lineWidth) > 0) {
      let smallRadius = Math.abs(prevLineWidth - lineWidth) / 4;
      let lineRadius =
        prevLineWidth - lineWidth > 0 ? smallRadius : -smallRadius;
      ctx.lineTo(prevLineX + prevLineWidth, prevLineY - radius);
      ctx.quadraticCurveTo(
        prevLineX + prevLineWidth,
        prevLineY,
        prevLineX + prevLineWidth - lineRadius,
        prevLineY
      );
      ctx.lineTo(lineX + lineWidth + lineRadius, prevLineY);
      ctx.quadraticCurveTo(
        lineX + lineWidth,
        prevLineY,
        lineX + lineWidth,
        prevLineY + smallRadius
      );
      ctx.lineTo(lineX + lineWidth, lineY + maxLineHeight - radius);
      currentY = lineY + maxLineHeight - radius;
    } else {
      ctx.lineTo(lineX + prevLineWidth, lineY + maxLineHeight - radius);
      currentY = lineY + maxLineHeight - radius;
    }
  }
  // Draw last line right
  const lastLineWidth = lines[lines.length - 1]?.width + gapX * 2;
  const lastLineX = isAlignCenter ? x + (maxLineWidth - lastLineWidth) / 2 : x;
  const lastLineY = y + (lines.length - 1) * lineHeight;
  ctx.lineTo(lastLineX + lastLineWidth, lastLineY + maxLineHeight - radius);
  ctx.quadraticCurveTo(
    lastLineX + lastLineWidth,
    lastLineY + maxLineHeight,
    lastLineX + lastLineWidth - radius,
    lastLineY + maxLineHeight
  );

  ctx.lineTo(lastLineX + lastLineWidth / 2, lastLineY + maxLineHeight);
};

export const drawTextBackground = ({ ctx, shape, textElement, options }) => {
  const fill = shape.fill();
  const haveNotFillColor = !fill || fill === "transparent";
  if (haveNotFillColor || !textElement) {
    return;
  }
  let lines = textElement?.textArr || [];
  const { horizontalPadding, verticalPadding, cornerRadius = 0 } = options;

  const isAlignCenter = textElement?.align() === TEXT_ALIGNMENTS.CENTER;
  const isAlignJustify = textElement?.align() === TEXT_ALIGNMENTS.JUSTIFY;
  const isVerticalAlignMiddle =
    textElement?.verticalAlign() === TEXT_ALIGNMENTS.MIDDLE;
  const isVerticalAlignBottom =
    textElement?.verticalAlign() === TEXT_ALIGNMENTS.BOTTOM;
  const isTextOneLine = lines.length === 1;
  const isBackgroundRect =
    shape?.attrs?.isRect || isAlignJustify || isTextOneLine;

  const gapX = horizontalPadding;
  const gapY = verticalPadding;

  const textElementWidth = textElement?.width() * textElement?.scaleX();
  const textElementHeight = textElement?.height() * textElement?.scaleY();
  const shapeWidth = textElementWidth + gapX * 2;
  const shapeHeight = textElementHeight + gapY * 2;
  const maxLineWidth = textElement?.textWidth + gapX * 2;
  const lineHeight = textElement.lineHeight() * textElement.fontSize();
  const maxLineHeight = lineHeight + gapY * 2;

  const radius = isBackgroundRect
    ? Math.min(cornerRadius, shapeHeight / 2, shapeWidth / 2)
    : Math.min(cornerRadius, lineHeight / 2);

  lines = lines.map((line, index) => {
    let lineWidth;
    const prevLine = lines[index - 1];
    const nextLine = lines[index + 1];
    const divPreWidth = Math.abs(line.width - (prevLine?.width ?? 0));
    const divNextWidth = Math.abs(line.width - (nextLine?.width ?? 0));
    if (divPreWidth < radius * 2 && divNextWidth < radius * 2) {
      lineWidth = Math.max(
        line.width,
        prevLine?.width ?? 0,
        nextLine?.width ?? 0
      );
    } else if (divPreWidth < radius * 2) {
      lineWidth = Math.max(line.width, prevLine?.width ?? 0);
    } else if (divNextWidth < radius * 2) {
      lineWidth = Math.max(line.width, nextLine?.width ?? 0);
    } else {
      lineWidth = line.width;
    }
    return {
      ...line,
      width: lineWidth,
    };
  });

  const paddingVertical = isVerticalAlignMiddle
    ? (shapeHeight - gapY * 2 - lineHeight * lines.length) / 2
    : isVerticalAlignBottom
    ? shapeHeight - gapY * 2 - lineHeight * lines.length
    : 0;

  const x = isAlignCenter
    ? (textElementWidth - textElement?.textWidth) / 2 - gapX
    : -gapX;
  const y = -gapY + paddingVertical;

  const firstLineWidth = lines[0]?.width + gapX * 2;
  const firstLineX = isAlignCenter
    ? x + (maxLineWidth - firstLineWidth) / 2
    : x;

  // Draw last line left
  const lastLineWidth = lines[lines.length - 1]?.width + gapX * 2;
  const lastLineX = isAlignCenter ? x + (maxLineWidth - lastLineWidth) / 2 : x;
  const lastLineY = y + (lines.length - 1) * lineHeight;

  // Draw the custom background path
  ctx.beginPath();
  if (textElement?.align() === "right") {
    ctx.translate(textElementWidth, 0);
    ctx.scale(-1, 1);
  }
  if (shape?.attrs?.isRect) {
    const rectX = -gapX;
    const rectY = -gapY;
    const rectWidth = textElement?.width() + gapX * 2;
    const rectHeight = textElement?.height() + gapY * 2;
    const rectRadius = Math.min(rectHeight / 2, rectWidth / 2, radius);
    ctx.moveTo(rectX + rectRadius, rectY);
    ctx.lineTo(rectX + rectWidth - rectRadius, rectY);
    ctx.quadraticCurveTo(
      rectX + rectWidth,
      rectY,
      rectX + rectWidth,
      rectY + rectRadius
    );
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - rectRadius);
    ctx.quadraticCurveTo(
      rectX + rectWidth,
      rectY + rectHeight,
      rectX + rectWidth - rectRadius,
      rectY + rectHeight
    );
    ctx.lineTo(rectX + rectRadius, rectY + rectHeight);
    ctx.quadraticCurveTo(
      rectX,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight - rectRadius
    );
    ctx.lineTo(rectX, rectY + rectRadius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + rectRadius, rectY);

    ctx.closePath();
    ctx.fill();

    shape.hasFill(true);
    ctx.fillStrokeShape(shape);
    return;
  }
  if (isTextOneLine) {
    const rectRadius = Math.min(maxLineHeight / 2, maxLineWidth / 2, radius);
    ctx.roundRect(x, y, maxLineWidth, maxLineHeight, rectRadius);

    shape.hasFill(true);
    ctx.fillStrokeShape(shape);
    return;
  }
  if (isAlignJustify) {
    const rectX = x;
    ctx.moveTo(rectX + radius, y);
    ctx.lineTo(rectX + shapeWidth - radius, y);
    ctx.quadraticCurveTo(rectX + shapeWidth, y, rectX + shapeWidth, y + radius);
    ctx.lineTo(rectX + shapeWidth, lastLineY + maxLineHeight - radius);
    ctx.quadraticCurveTo(
      rectX + shapeWidth,
      lastLineY + maxLineHeight,
      rectX + shapeWidth - radius,
      lastLineY + maxLineHeight
    );
    ctx.lineTo(lastLineX + radius, lastLineY + maxLineHeight);
    ctx.quadraticCurveTo(
      rectX,
      lastLineY + maxLineHeight,
      rectX,
      lastLineY + maxLineHeight - radius
    );
    ctx.lineTo(rectX, y + radius);
    ctx.quadraticCurveTo(rectX, y, rectX + radius, y);

    ctx.closePath();
    ctx.fill();

    shape.hasFill(true);
    ctx.fillStrokeShape(shape);
    return;
  }

  drawBorderLine({
    lines,
    shape,
    ctx,
    textElement,
    options: {
      ...options,
      cornerRadius: radius,
    },
  });

  if (isAlignCenter) {
    ctx.translate(textElementWidth, 0);
    ctx.scale(-1, 1);

    drawBorderLine({
      lines,
      shape,
      ctx,
      textElement,
      options: {
        ...options,
        cornerRadius: radius,
      },
    });
  } else {
    ctx.lineTo(lastLineX + radius, lastLineY + maxLineHeight);
    ctx.quadraticCurveTo(
      lastLineX,
      lastLineY + maxLineHeight,
      lastLineX,
      lastLineY + maxLineHeight - radius
    );
    // Draw first line left
    ctx.lineTo(firstLineX, y + radius);
    ctx.quadraticCurveTo(firstLineX, y, firstLineX + radius, y);
    ctx.lineTo(firstLineX + firstLineWidth / 2, y);
  }

  ctx.closePath();
  ctx.fill();

  shape.hasFill(true);
  ctx.fillStrokeShape(shape);
};
export const joinGroupElement = (elementList) => {
  let groupList = [];
  let listElementInGroup = [];
  elementList.forEach((element) => {
    if (element.type === "group") {
      listElementInGroup.push(...element.elementIds);

      const groupChildren = element.elementIds.map((id) => {
        const children = elementList.filter((item) => item.id === id)[0];
        return children;
      });
      groupList.push({ ...element, groupChildren: groupChildren });
    }
  });
  const newElementList = elementList
    .filter((element) => !listElementInGroup.includes(element.id))
    .filter((element) => element.type != "group");
  newElementList.push(...groupList);
  return newElementList;
};

export const convertFontFamily = (fontFamily = "", fontId = "") => {
  const font = fontFamily.replace(/[^a-zA-Z0-9]/g, "_");
  return `${font}${fontId ? "_" : ""}${fontId}`;
};

export const convertTextToStyle = (paragraph = "", style = "") => {
  switch (style) {
    case TEXT_TRANSFORM.SENTENCE_CASE:
      return paragraph
        .toLowerCase()
        ?.split(". ")
        .map((sentence) => {
          return sentence.charAt(0).toUpperCase() + sentence.slice(1);
        })
        .join(". ");
    case TEXT_TRANSFORM.TITLE_CASE:
      return paragraph
        .toLowerCase()
        ?.split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    case TEXT_TRANSFORM.UPPERCASE:
      return paragraph.toUpperCase();
    default:
      return paragraph;
  }
};
