export type ColorData = [number, number, number];

export interface RectData {
	type: "rect";
	x: number;
	y: number;
	width: number;
	height: number;
	color: ColorData;
}

export interface CircleData {
	type: "circle";
	x: number;
	y: number;
	radius: number;
	color: ColorData;
}

export interface LineData {
	type: "line";
	from: { x: number; y: number };
	to: { x: number; y: number };
	blankBefore: boolean;
	blankAfter: boolean;
	color: ColorData;
}

export type ShapeData = Array<RectData | LineData | CircleData>;
