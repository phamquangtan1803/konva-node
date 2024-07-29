export interface Group {
  id: string;
  type: "group";
  elementType: "group";
  elementIds: string[]; // Array of IDs for elements contained in the group
  templateSizeId: string;
  templateId: string;
  visible: boolean;
  listening: boolean;
  groupId: string | null;
  name: string;
  index: number;
  opacity: number;
  width: number;
  height: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  pageId: string;
  groupChildren: any;
}
