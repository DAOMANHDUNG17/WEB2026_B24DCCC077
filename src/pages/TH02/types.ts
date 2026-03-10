export type MucDo = 'de' | 'trung_binh' | 'kho' | 'rat_kho';

export type KhoiKienThuc = {
	id: string;
	ten: string;
	ghiChu?: string;
};

export type MonHoc = {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
};

export type CauHoi = {
	id: string;
	maCauHoi: string;
	monHocId: string;
	noiDung: string;
	mucDo: MucDo;
	khoiKienThucId: string;
};

export type YeuCauCauHoi = {
	id: string;
	khoiKienThucId: string;
	mucDo: MucDo;
	soLuong: number;
};

export type CauTrucDe = {
	id: string;
	ten: string;
	monHocId: string;
	yeuCau: YeuCauCauHoi[];
};

export type DeThi = {
	id: string;
	ten: string;
	monHocId: string;
	cauTrucId: string;
	danhSachCauHoi: string[];
	createdAt: string;
};
