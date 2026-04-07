import { tienVietNam } from '@/utils/utils';
import type { DiemDen, KeHoachDuLich, LichTrinh, LoaiHinh, MucDieuHuong, VungMien } from './types';

export const KHO_LUU_TRU = {
	danhSachDiemDen: 'th06_danh_sach_diem_den',
	lichTrinh: 'th06_lich_trinh',
	danhSachKeHoach: 'th06_danh_sach_ke_hoach',
	nganSachToiDa: 'th06_ngan_sach_toi_da',
};

export const DUONG_DAN_TH06: Record<MucDieuHuong, string> = {
	kham_pha: '/th06/kham-pha',
	lich_trinh: '/th06/lich-trinh',
	ngan_sach: '/th06/ngan-sach',
	admin: '/th06/admin',
};

export const taoId = (tienTo: string) => `${tienTo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const docDuLieuTuBoNho = <T,>(key: string, giaTriMacDinh: T): T => {
	if (typeof window === 'undefined') {
		return giaTriMacDinh;
	}

	const duLieuRaw = localStorage.getItem(key);
	if (!duLieuRaw) {
		return giaTriMacDinh;
	}

	try {
		return JSON.parse(duLieuRaw) as T;
	} catch (error) {
		console.error(`Không thể đọc dữ liệu TH06 với key ${key}`, error);
		return giaTriMacDinh;
	}
};

export const dinhDangTien = (giaTri: number) => tienVietNam(giaTri);

export const layNhanLoaiHinh = (loaiHinh: LoaiHinh) => {
	switch (loaiHinh) {
		case 'bien':
			return 'Biển';
		case 'nui':
			return 'Núi';
		default:
			return 'Thành phố';
	}
};

export const layMauLoaiHinh = (loaiHinh: LoaiHinh) => {
	switch (loaiHinh) {
		case 'bien':
			return 'cyan';
		case 'nui':
			return 'green';
		default:
			return 'geekblue';
	}
};

export const layNhanVungMien = (vungMien: VungMien) => {
	switch (vungMien) {
		case 'bac':
			return 'Miền Bắc';
		case 'trung':
			return 'Miền Trung';
		default:
			return 'Miền Nam';
	}
};

export const tinhTongChiPhiDiemDen = (diemDen: DiemDen) =>
	diemDen.chiPhiAnUong + diemDen.chiPhiLuuTru + diemDen.chiPhiDiChuyen;

export const sapXepLichTrinh = (lichTrinh: LichTrinh[]) =>
	[...lichTrinh].sort((a, b) => {
		if (a.ngay !== b.ngay) {
			return a.ngay - b.ngay;
		}
		if (a.thuTu !== b.thuTu) {
			return a.thuTu - b.thuTu;
		}
		return a.ngayTao.localeCompare(b.ngayTao);
	});

export const chuanHoaThuTuTheoNgay = (lichTrinh: LichTrinh[]) => {
	const nhomTheoNgay = sapXepLichTrinh(lichTrinh).reduce<Record<number, LichTrinh[]>>((acc, item) => {
		if (!acc[item.ngay]) {
			acc[item.ngay] = [];
		}
		acc[item.ngay].push(item);
		return acc;
	}, {});

	return Object.keys(nhomTheoNgay)
		.map(Number)
		.sort((a, b) => a - b)
		.flatMap((ngay) =>
			nhomTheoNgay[ngay].map((item, index) => ({
				...item,
				thuTu: index + 1,
			})),
		);
};

export const tinhThoiGianDiChuyenGiuaHaiDiem = (diemTruoc?: DiemDen, diemSau?: DiemDen) => {
	if (!diemTruoc || !diemSau || diemTruoc.id === diemSau.id) {
		return 0;
	}

	let tongThoiGian = 1.5;

	if (diemTruoc.vungMien !== diemSau.vungMien) {
		tongThoiGian += 2.5;
	}

	if (diemTruoc.loaiHinh !== diemSau.loaiHinh) {
		tongThoiGian += 0.75;
	}

	if (diemTruoc.diaDiem !== diemSau.diaDiem) {
		tongThoiGian += 0.5;
	}

	return Math.round(tongThoiGian * 10) / 10;
};

export const tinhTongThoiGianDiChuyen = (lichTrinh: LichTrinh[]) => {
	const danhSachDaSapXep = sapXepLichTrinh(lichTrinh);

	return Math.round(
		danhSachDaSapXep.reduce((tong, item, index) => {
			if (index === 0) {
				return tong;
			}

			return tong + tinhThoiGianDiChuyenGiuaHaiDiem(danhSachDaSapXep[index - 1].diemDen, item.diemDen);
		}, 0) * 10,
	) / 10;
};

export const tinhTongThoiGianThamQuan = (lichTrinh: LichTrinh[]) =>
	lichTrinh.reduce((tong, item) => tong + item.diemDen.thoiGianThamQuan, 0);

export const tinhTongTheoHangMuc = (lichTrinh: LichTrinh[]) =>
	lichTrinh.reduce(
		(tong, item) => ({
			anUong: tong.anUong + item.diemDen.chiPhiAnUong,
			luuTru: tong.luuTru + item.diemDen.chiPhiLuuTru,
			diChuyen: tong.diChuyen + item.diemDen.chiPhiDiChuyen,
		}),
		{ anUong: 0, luuTru: 0, diChuyen: 0 },
	);

export const tinhTongChiPhiLichTrinh = (lichTrinh: LichTrinh[]) => {
	const tongHangMuc = tinhTongTheoHangMuc(lichTrinh);
	return tongHangMuc.anUong + tongHangMuc.luuTru + tongHangMuc.diChuyen;
};

export const nhomLichTrinhTheoNgay = (lichTrinh: LichTrinh[]) => {
	const nhomTheoNgay = sapXepLichTrinh(lichTrinh).reduce<Record<number, LichTrinh[]>>((acc, item) => {
		if (!acc[item.ngay]) {
			acc[item.ngay] = [];
		}
		acc[item.ngay].push(item);
		return acc;
	}, {});

	return Object.keys(nhomTheoNgay)
		.map(Number)
		.sort((a, b) => a - b)
		.map((ngay) => ({
			ngay,
			danhSach: nhomTheoNgay[ngay],
		}));
};

export const layMucTheoDuongDan = (pathname: string): MucDieuHuong => {
	if (pathname.includes('/th06/lich-trinh')) {
		return 'lich_trinh';
	}
	if (pathname.includes('/th06/ngan-sach')) {
		return 'ngan_sach';
	}
	if (pathname.includes('/th06/admin')) {
		return 'admin';
	}
	return 'kham_pha';
};

export const taoTenKeHoach = () =>
	`Kế hoạch ${new Date().toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})}`;

export const taoKeHoachTuLichTrinh = (lichTrinh: LichTrinh[]): KeHoachDuLich => {
	const lichTrinhDaSapXep = sapXepLichTrinh(lichTrinh).map((item) => ({
		...item,
		diemDen: { ...item.diemDen },
	}));

	return {
		id: taoId('ke-hoach'),
		tenKeHoach: taoTenKeHoach(),
		ngayTao: new Date().toISOString(),
		lichTrinh: lichTrinhDaSapXep,
		tongChiPhi: tinhTongChiPhiLichTrinh(lichTrinhDaSapXep),
		tongThoiGianThamQuan: tinhTongThoiGianThamQuan(lichTrinhDaSapXep),
		tongThoiGianDiChuyen: tinhTongThoiGianDiChuyen(lichTrinhDaSapXep),
	};
};
