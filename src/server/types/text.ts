export interface Text {
  id: string;
  elementId: string;
  type: "text";
  elementType: string;
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
  fontSize: number;
  visible: boolean;
  backgroundColor: string;
  padding: {
    paddingRight: boolean;
    paddingLeft: boolean;
    paddingTop: boolean;
    paddingBottom: boolean;
    horizontal: number;
    vertical: number;
  };
  fill: string;
  align: "left" | "center" | "right" | "justify";
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
  strokeWidth: number;
  cornerRadius: number | null;
  cornerRadiusTopLeft: number;
  cornerRadiusTopRight: number;
  cornerRadiusBottomLeft: number;
  cornerRadiusBottomRight: number;
  textFill: string;
  fontFamily: string;
  fontId: string;
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
  imageWidth: number | null;
  imageHeight: number | null;
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
