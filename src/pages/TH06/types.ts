export type LoaiHinh = 'bien' | 'nui' | 'thanh_pho';

export type VungMien = 'bac' | 'trung' | 'nam';

export type MucDieuHuong = 'kham_pha' | 'lich_trinh' | 'ngan_sach' | 'admin';

export type HuongSapXep = 'len' | 'xuong';

export interface DiemDen {
	id: string;
	tenDiaDiem: string;
	diaDiem: string;
	loaiHinh: LoaiHinh;
	vungMien: VungMien;
	hinhAnh: string;
	rating: number;
	moTa: string;
	thoiGianThamQuan: number;
	chiPhiAnUong: number;
	chiPhiLuuTru: number;
	chiPhiDiChuyen: number;
}

export interface LichTrinh {
	id: string;
	ngay: number;
	thuTu: number;
	diemDen: DiemDen;
	ngayTao: string;
}

export interface KeHoachDuLich {
	id: string;
	tenKeHoach: string;
	ngayTao: string;
	lichTrinh: LichTrinh[];
	tongChiPhi: number;
	tongThoiGianThamQuan: number;
	tongThoiGianDiChuyen: number;
}

export interface KetQuaXuLy {
	success: boolean;
	message: string;
}
