export interface Image {
  id: string;
  elementId: string;
  type: "image";
  elementType: "image";
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
  svgElement: any; // You might want to type this according to your specific SVG element type
  imageWidth: number;
  imageHeight: number;
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
  enableWaterMark: boolean;
}
