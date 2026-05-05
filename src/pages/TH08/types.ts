export type LoaiBaiTap = 'cardio' | 'strength' | 'yoga' | 'hiit' | 'other';

export type TrangThaiBuoiTap = 'hoan_thanh' | 'bo_lo';

export type BuoiTap = {
	id: string;
	ngayTap: string;
	tenBaiTap: string;
	loaiBaiTap: LoaiBaiTap;
	thoiLuongPhut: number;
	caloDot: number;
	ghiChu?: string;
	trangThai: TrangThaiBuoiTap;
};

export type ChiSoSucKhoe = {
	id: string;
	ngayGhiNhan: string;
	canNangKg: number;
	chieuCaoCm: number;
	nhipTimNghiBpm: number;
	gioNgu: number;
};

export type LoaiMucTieu = 'giam_can' | 'tang_co' | 'cai_thien_suc_ben' | 'khac';

export type TrangThaiMucTieu = 'dang_thuc_hien' | 'da_dat' | 'da_huy';

export type MucTieu = {
	id: string;
	tenMucTieu: string;
	loaiMucTieu: LoaiMucTieu;
	giaTriMucTieu: number;
	giaTriHienTai: number;
	donVi: string;
	deadline: string;
	trangThai: TrangThaiMucTieu;
};

export type NhomCo = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full_body';

export type MucDoKho = 'de' | 'trung_binh' | 'kho';

export type BaiTapThuVien = {
	id: string;
	tenBaiTap: string;
	nhomCo: NhomCo;
	mucDoKho: MucDoKho;
	moTaNgan: string;
	caloTrungBinhMoiGio: number;
	huongDanChiTiet: string;
};

export type LuaChon = {
	label: string;
	value: string;
};

export type TrangThaiLocMucTieu = 'tat_ca' | TrangThaiMucTieu;
