export interface CauLacBo {
	id: string;
	anhDaiDien: string;
	tenCauLacBo: string;
	ngayThanhLap: string;
	moTa: string;
	chuNhiem: string;
	hoatDong: boolean;
}

export type TrangThaiDon = 'Pending' | 'Approved' | 'Rejected';

export interface DonDangKy {
	id: string;
	hoTen: string;
	email: string;
	sdt: string;
	gioiTinh: string;
	diaChi: string;
	soTruong: string;
	idCauLacBo: string;
	lyDoDangKy: string;
	trangThai: TrangThaiDon;
	ghiChu?: string;
}

export interface LichSuThaoTac {
	id: string;
	idDonDangKy: string;
	nguoiThucHien: string;
	hanhDong: string;
	thoiGian: string;
	noiDung: string;
}

export type KetQuaXuLy = {
	success: boolean;
	message: string;
};
