export class Person {
	id: string;
	pelvis: { tx: number; ty: number; tz: number };
	spine_navel: { tx: number; ty: number; tz: number };
	spine_chest: { tx: number; ty: number; tz: number };
	neck: { tx: number; ty: number; tz: number };
	clavicle_l: { tx: number; ty: number; tz: number };
	shoulder_l: { tx: number; ty: number; tz: number };
	elbow_l: { tx: number; ty: number; tz: number };
	wrist_l: { tx: number; ty: number; tz: number };
	hand_l: { tx: number; ty: number; tz: number };
	handtip_l: { tx: number; ty: number; tz: number };
	thumb_l: { tx: number; ty: number; tz: number };
	clavicle_r: { tx: number; ty: number; tz: number };
	shoulder_r: { tx: number; ty: number; tz: number };
	elbow_r: { tx: number; ty: number; tz: number };
	wrist_r: { tx: number; ty: number; tz: number };
	hand_r: { tx: number; ty: number; tz: number };
	handtip_r: { tx: number; ty: number; tz: number };
	thumb_r: { tx: number; ty: number; tz: number };
	hip_l: { tx: number; ty: number; tz: number };
	knee_l: { tx: number; ty: number; tz: number };
	ankle_l: { tx: number; ty: number; tz: number };
	foot_l: { tx: number; ty: number; tz: number };
	hip_r: { tx: number; ty: number; tz: number };
	knee_r: { tx: number; ty: number; tz: number };
	ankle_r: { tx: number; ty: number; tz: number };
	foot_r: { tx: number; ty: number; tz: number };
	head: { tx: number; ty: number; tz: number };
	nose: { tx: number; ty: number; tz: number };
	eye_l: { tx: number; ty: number; tz: number };
	eye_r: { tx: number; ty: number; tz: number };
	ear_l: { tx: number; ty: number; tz: number };
	ear_r: { tx: number; ty: number; tz: number };

	constructor(data: (number | string)[]) {
		this.id = data[0] as string;
		this.pelvis = { tx: data[1] as number, ty: data[2] as number, tz: data[3] as number };
		this.spine_navel = { tx: data[4] as number, ty: data[5] as number, tz: data[6] as number };
		this.spine_chest = { tx: data[7] as number, ty: data[8] as number, tz: data[9] as number };
		this.neck = { tx: data[10] as number, ty: data[11] as number, tz: data[12] as number };
		// left arm
		this.clavicle_l = { tx: data[13] as number, ty: data[14] as number, tz: data[15] as number };
		this.shoulder_l = { tx: data[16] as number, ty: data[17] as number, tz: data[18] as number };
		this.elbow_l = { tx: data[19] as number, ty: data[20] as number, tz: data[21] as number };
		this.wrist_l = { tx: data[22] as number, ty: data[23] as number, tz: data[24] as number };
		this.hand_l = { tx: data[25] as number, ty: data[26] as number, tz: data[27] as number };
		this.handtip_l = { tx: data[28] as number, ty: data[29] as number, tz: data[30] as number };
		this.thumb_l = { tx: data[31] as number, ty: data[32] as number, tz: data[33] as number };
		// right arm
		this.clavicle_r = { tx: data[34] as number, ty: data[35] as number, tz: data[36] as number };
		this.shoulder_r = { tx: data[37] as number, ty: data[38] as number, tz: data[39] as number };
		this.elbow_r = { tx: data[40] as number, ty: data[41] as number, tz: data[42] as number };
		this.wrist_r = { tx: data[43] as number, ty: data[44] as number, tz: data[45] as number };
		this.hand_r = { tx: data[46] as number, ty: data[47] as number, tz: data[48] as number };
		this.handtip_r = { tx: data[49] as number, ty: data[50] as number, tz: data[51] as number };
		this.thumb_r = { tx: data[52] as number, ty: data[53] as number, tz: data[54] as number };
		// left leg
		this.hip_l = { tx: data[55] as number, ty: data[56] as number, tz: data[57] as number };
		this.knee_l = { tx: data[58] as number, ty: data[59] as number, tz: data[60] as number };
		this.ankle_l = { tx: data[61] as number, ty: data[62] as number, tz: data[63] as number };
		this.foot_l = { tx: data[64] as number, ty: data[65] as number, tz: data[66] as number };
		// right leg
		this.hip_r = { tx: data[67] as number, ty: data[68] as number, tz: data[69] as number };
		this.knee_r = { tx: data[70] as number, ty: data[71] as number, tz: data[72] as number };
		this.ankle_r = { tx: data[73] as number, ty: data[74] as number, tz: data[75] as number };
		this.foot_r = { tx: data[76] as number, ty: data[77] as number, tz: data[78] as number };
		// head
		this.head = { tx: data[79] as number, ty: data[80] as number, tz: data[81] as number };
		this.nose = { tx: data[82] as number, ty: data[83] as number, tz: data[84] as number };
		this.eye_l = { tx: data[85] as number, ty: data[86] as number, tz: data[87] as number };
		this.ear_l = { tx: data[88] as number, ty: data[89] as number, tz: data[90] as number };
		this.eye_r = { tx: data[91] as number, ty: data[92] as number, tz: data[93] as number };
		this.ear_r = { tx: data[94] as number, ty: data[95] as number, tz: data[96] as number };
	}
}
