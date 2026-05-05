export type TrangThaiTask = 'can_lam' | 'dang_lam' | 'hoan_thanh';

export type MucDoUuTien = 'cao' | 'trung_binh' | 'thap';

export type CongViecCaNhan = {
	id: string;
	tenTask: string;
	moTa: string;
	deadline: string;
	mucDoUuTien: MucDoUuTien;
	tags: string[];
	trangThai: TrangThaiTask;
	ngayTao: string;
	ngayCapNhat: string;
};

export type LuaChon<T = string> = {
	label: string;
	value: T;
};

export type DuLieuTaskLuu = {
	tenTask: string;
	moTa: string;
	deadline: string;
	mucDoUuTien: MucDoUuTien;
	tags: string[];
};

export type TrangThaiLocTask = 'tat_ca' | TrangThaiTask;
