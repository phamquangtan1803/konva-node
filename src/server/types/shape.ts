export interface Shape {
  id: string;
  elementId: string;
  type: "shape";
  elementType: "graphicShape";
  name: string;
  src: string;
  borderColor: string;
  text: string;
  width: number;
  height: number;
  groupId: string | null;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  opacity: number;
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
  fontSize: number | null;
  visible: boolean;
  padding: {
    paddingRight: boolean;
    paddingLeft: boolean;
    paddingTop: boolean;
    paddingBottom: boolean;
    horizontal: number;
    vertical: number;
  };
  fill: string;
  align: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  fontStyle: "normal" | "italic" | "oblique";
  letterSpacing: number;
  lineHeight: number;
  textTransform:
    | "none"
    | "capitalize"
    | "uppercase"
    | "lowercase"
    | "sentenceCase";
  textDecoration: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number | null;
  cornerRadiusTopLeft: number;
  cornerRadiusTopRight: number;
  cornerRadiusBottomLeft: number;
  cornerRadiusBottomRight: number;
  fontFamily: string;
  s3FilePath: string;
  category: string;
  paddingRatio: number;
  listening: boolean;
  index: number;
  scaleX: number;
  scaleY: number;
  fillPatternScaleX: number;
  fillPatternScaleY: number;
  svgElement: {
    svgString: string;
    svgUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
    svgWidth: number;
    svgHeight: number;
    children: Array<{
      type: "path" | "circle" | "rect" | "line" | "polygon"; // Include other SVG element types as needed
      d?: string; // Path data
      fill: string;
      stroke: string | null;
      strokeWidth: number;
    }>;
  };
  mute: boolean;
  autoFitEnabled: boolean;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  language: string;
  radiusEnabled: boolean;
}
