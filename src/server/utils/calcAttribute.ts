import Konva from "konva";

export const rotatePoint = ({ x, y }, rad = 0) => {
  const rcos = Math.cos(rad);
  const rsin = Math.sin(rad);
  return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
};

export function rotateAroundCenter(node, rotation) {
  const isNode = node instanceof Konva.Node;

  const nodeWidth = isNode
    ? node.width() * node.scaleX()
    : node.width * node.scaleX;
  const nodeHeight = isNode
    ? node.height() * node.scaleY()
    : node.height * node.scaleY;
  const nodeX = isNode ? node.x() : node.x;
  const nodeY = isNode ? node.y() : node.y;
  const nodeRotate = isNode ? node.rotation() : node.rotation || 0;
  const topLeft = { x: -nodeWidth / 2, y: -nodeHeight / 2 };
  const current = rotatePoint(topLeft, Konva.getAngle(nodeRotate));
  const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
  const dx = rotated.x - current.x,
    dy = rotated.y - current.y;
  return {
    x: nodeX + dx,
    y: nodeY + dy,
    rotation,
  };
}

export function revertRotateAroundCenter(node, rotation) {
  const { x, y, width, height } = node;
  const topLeft = { x: -width / 2, y: -height / 2 };
  const current = rotatePoint(topLeft, Konva.getAngle(rotation));
  const rotated = rotatePoint(topLeft, Konva.getAngle(0));
  const dx = rotated.x - current.x,
    dy = rotated.y - current.y;
  return {
    x: Math.round(x + dx),
    y: Math.round(y + dy),
  };
}

export function rotateAroundPoint({ x, y, pointX, pointY, rotation }: any) {
  const topLeft = { x: -pointX, y: -pointY };
  const current = rotatePoint(topLeft, Konva.getAngle(0));
  const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
  const dx = rotated.x - current.x,
    dy = rotated.y - current.y;
  return {
    x: x + dx,
    y: y + dy,
  };
}

export const getMouseAngel = (container, element) => {
  if (!container) return 0;
  const containerPos = container.getAbsolutePosition() || {};
  const mousePos = element
    ? element.getClientRect()
    : container.getStage().getPointerPosition();

  const nodeScale = container.getAbsoluteScale();
  const nodeWidth = container.width() * nodeScale.x;
  const nodeHeight = container.height() * nodeScale.y;

  const originalLocation = revertRotateAroundCenter(
    {
      x: containerPos.x,
      y: containerPos.y,
      width: nodeWidth,
      height: nodeHeight,
    },
    container.rotation()
  );

  const absCenter = {
    x: nodeWidth * 0.5 + originalLocation.x,
    y: nodeHeight * 0.5 + originalLocation.y,
  };

  const angleInRadians = Math.atan2(
    absCenter.y - mousePos.y,
    absCenter.x - mousePos.x
  );
  return angleInRadians;
};

export const calcCropImageAttrs = (image, options) => {
  if (image) {
    const { cropX, cropY, cropWidth, cropHeight, rotation = 0 } = options;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const cropImageWidth = imageWidth / cropWidth;
    const cropImageHeight = imageHeight / cropHeight;

    const distanceX = cropX * cropImageWidth;
    const distanceY = cropY * cropImageHeight;

    const originalLocation = revertRotateAroundCenter(
      {
        x: image.x,
        y: image.y,
        width: imageWidth,
        height: imageHeight,
      },
      rotation
    );
    const cropRotatePoint = {
      x: distanceX + imageWidth / 2,
      y: distanceY + imageHeight / 2,
    };
    const rotateCropPosition = rotateAroundPoint({
      x: originalLocation.x - distanceX,
      y: originalLocation.y - distanceY,
      pointX: cropRotatePoint.x,
      pointY: cropRotatePoint.y,
      rotation,
    });

    const params = {
      width: imageWidth,
      height: imageHeight,
      x: rotateCropPosition.x,
      y: rotateCropPosition.y,
      scaleX: 1 / cropWidth,
      scaleY: 1 / cropHeight,
      rotation,
    };

    return {
      ...params,
    };
  } else {
    return {};
  }
};

export const getPosAfterRotate = ({
  x = 0,
  y = 0,
  width = 1,
  height = 1,
  rotation = 0,
}) => {
  const originalLocation = revertRotateAroundCenter(
    {
      x,
      y,
      width,
      height,
    },
    rotation
  );
  const rotatePosition = rotateAroundPoint({
    x: originalLocation.x,
    y: originalLocation.y,
    pointX: width / 2,
    pointY: height / 2,
    rotation,
  });

  return {
    x: rotatePosition.x,
    y: rotatePosition.y,
  };
};

export const cursorSVG = ({ size = 20, rotation }) => {
  const centre = 10; // haft viewbox
  const scale = 0.9;
  const translate = 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none">
    <g
      transform="rotate(${rotation} ${centre} ${centre}) scale(${scale}) translate(${translate})"
      filter="url(#shadow)"
    >
      <path d="M16 19L19 15H13L16 19Z" fill="white" stroke="#FC64FF"/>
      <path d="M5 4H9.71429C11.3814 4 12.9802 4.66224 14.159 5.84104C15.3378 7.01984 16 8.61864 16 10.2857V15" stroke="#FC64FF" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 4L5 7L5 1L1 4Z" fill="white" stroke="#FC64FF"/>
    </g>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
