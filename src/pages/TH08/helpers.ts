import moment from 'moment';
import {
	DANH_SACH_LOAI_BAI_TAP,
	DANH_SACH_LOAI_MUC_TIEU,
	DANH_SACH_MUC_DO_KHO,
	DANH_SACH_NHOM_CO,
	DANH_SACH_TRANG_THAI_BUOI_TAP,
	DANH_SACH_TRANG_THAI_MUC_TIEU,
	MAU_THEO_BMI,
	MAU_THEO_MUC_DO_KHO,
	MAU_THEO_TRANG_THAI_BUOI_TAP,
	MAU_THEO_TRANG_THAI_MUC_TIEU,
} from './constant';
import type {
	BaiTapThuVien,
	BuoiTap,
	ChiSoSucKhoe,
	LoaiBaiTap,
	LoaiMucTieu,
	MucDoKho,
	MucTieu,
	NhomCo,
	TrangThaiBuoiTap,
	TrangThaiMucTieu,
} from './types';

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
		console.error(`Không thể đọc dữ liệu TH08 với key ${key}`, error);
		return giaTriMacDinh;
	}
};

export const luuDuLieuVaoBoNho = <T,>(key: string, duLieu: T) => {
	if (typeof window === 'undefined') {
		return;
	}

	localStorage.setItem(key, JSON.stringify(duLieu));
};

export const dinhDangNgay = (giaTri: string, format = 'DD/MM/YYYY') => moment(giaTri).format(format);

export const layNhanLoaiBaiTap = (giaTri: LoaiBaiTap) =>
	DANH_SACH_LOAI_BAI_TAP.find((item) => item.value === giaTri)?.label || 'Khác';

export const layNhanTrangThaiBuoiTap = (giaTri: TrangThaiBuoiTap) =>
	DANH_SACH_TRANG_THAI_BUOI_TAP.find((item) => item.value === giaTri)?.label || 'Không xác định';

export const layMauTrangThaiBuoiTap = (giaTri: TrangThaiBuoiTap) => MAU_THEO_TRANG_THAI_BUOI_TAP[giaTri];

export const layNhanLoaiMucTieu = (giaTri: LoaiMucTieu) =>
	DANH_SACH_LOAI_MUC_TIEU.find((item) => item.value === giaTri)?.label || 'Khác';

export const layNhanTrangThaiMucTieu = (giaTri: TrangThaiMucTieu) =>
	DANH_SACH_TRANG_THAI_MUC_TIEU.find((item) => item.value === giaTri)?.label || 'Không xác định';

export const layMauTrangThaiMucTieu = (giaTri: TrangThaiMucTieu) => MAU_THEO_TRANG_THAI_MUC_TIEU[giaTri];

export const layNhanNhomCo = (giaTri: NhomCo) =>
	DANH_SACH_NHOM_CO.find((item) => item.value === giaTri)?.label || 'Khác';

export const layNhanMucDoKho = (giaTri: MucDoKho) =>
	DANH_SACH_MUC_DO_KHO.find((item) => item.value === giaTri)?.label || 'Không xác định';

export const layMauMucDoKho = (giaTri: MucDoKho) => MAU_THEO_MUC_DO_KHO[giaTri];

export const tinhBmi = (canNangKg: number, chieuCaoCm: number) => {
	if (!canNangKg || !chieuCaoCm) {
		return 0;
	}

	const chieuCaoM = chieuCaoCm / 100;
	return Number((canNangKg / (chieuCaoM * chieuCaoM)).toFixed(1));
};

export const layThongTinBmi = (bmi: number) => {
	if (bmi < 18.5) {
		return {
			nhan: 'Thiếu cân',
			mau: MAU_THEO_BMI.thieu_can,
		};
	}
	if (bmi < 25) {
		return {
			nhan: 'Bình thường',
			mau: MAU_THEO_BMI.binh_thuong,
		};
	}
	if (bmi < 30) {
		return {
			nhan: 'Thừa cân',
			mau: MAU_THEO_BMI.thua_can,
		};
	}
	return {
		nhan: 'Béo phì',
		mau: MAU_THEO_BMI.beo_phi,
	};
};

export const tinhPhanTramMucTieu = (giaTriHienTai: number, giaTriMucTieu: number) => {
	if (!giaTriMucTieu || giaTriMucTieu <= 0) {
		return 0;
	}

	return Math.min(100, Math.max(0, Math.round((giaTriHienTai / giaTriMucTieu) * 100)));
};

export const dongBoTrangThaiMucTieu = (mucTieu: MucTieu): MucTieu => {
	if (mucTieu.trangThai === 'da_huy') {
		return mucTieu;
	}

	const trangThaiMoi = mucTieu.giaTriHienTai >= mucTieu.giaTriMucTieu ? 'da_dat' : 'dang_thuc_hien';
	return {
		...mucTieu,
		trangThai: trangThaiMoi,
	};
};

export const sapXepBuoiTapMoiNhat = (danhSachBuoiTap: BuoiTap[]) =>
	[...danhSachBuoiTap].sort((a, b) => moment(b.ngayTap).valueOf() - moment(a.ngayTap).valueOf());

export const sapXepChiSoTheoNgayTangDan = (danhSachChiSo: ChiSoSucKhoe[]) =>
	[...danhSachChiSo].sort((a, b) => moment(a.ngayGhiNhan).valueOf() - moment(b.ngayGhiNhan).valueOf());

export const layDanhSachBuoiTapGanNhat = (danhSachBuoiTap: BuoiTap[], soLuong = 5) =>
	sapXepBuoiTapMoiNhat(danhSachBuoiTap).slice(0, soLuong);

export const tinhTongBuoiTapTrongThang = (danhSachBuoiTap: BuoiTap[], thoiDiem = moment()) =>
	danhSachBuoiTap.filter(
		(item) =>
			item.trangThai === 'hoan_thanh' &&
			moment(item.ngayTap).isSame(thoiDiem, 'month') &&
			moment(item.ngayTap).isSame(thoiDiem, 'year'),
	).length;

export const tinhTongCaloTrongThang = (danhSachBuoiTap: BuoiTap[], thoiDiem = moment()) =>
	danhSachBuoiTap.reduce((tong, item) => {
		if (
			item.trangThai === 'hoan_thanh' &&
			moment(item.ngayTap).isSame(thoiDiem, 'month') &&
			moment(item.ngayTap).isSame(thoiDiem, 'year')
		) {
			return tong + item.caloDot;
		}
		return tong;
	}, 0);

export const tinhStreakTapLuyen = (danhSachBuoiTap: BuoiTap[]) => {
	const danhSachNgay = Array.from(
		new Set(
			danhSachBuoiTap
				.filter((item) => item.trangThai === 'hoan_thanh')
				.map((item) => moment(item.ngayTap).format('YYYY-MM-DD')),
		),
	).sort((a, b) => moment(b).valueOf() - moment(a).valueOf());

	if (danhSachNgay.length === 0) {
		return 0;
	}

	let streak = 1;
	for (let index = 1; index < danhSachNgay.length; index += 1) {
		const ngayTruoc = moment(danhSachNgay[index - 1]);
		const ngayHienTai = moment(danhSachNgay[index]);
		if (ngayTruoc.diff(ngayHienTai, 'day') === 1) {
			streak += 1;
			continue;
		}
		break;
	}

	return streak;
};

export const tinhTyLeHoanThanhMucTieu = (danhSachMucTieu: MucTieu[]) => {
	const mucTieuHopLe = danhSachMucTieu.filter((item) => item.trangThai !== 'da_huy');
	if (mucTieuHopLe.length === 0) {
		return 0;
	}

	const tongTienDo = mucTieuHopLe.reduce(
		(tong, item) => tong + tinhPhanTramMucTieu(item.giaTriHienTai, item.giaTriMucTieu),
		0,
	);
	return Math.round(tongTienDo / mucTieuHopLe.length);
};

export const taoDuLieuBuoiTapTheoTuan = (danhSachBuoiTap: BuoiTap[], thoiDiem = moment()) => {
	const batDauThang = thoiDiem.clone().startOf('month');
	const ketThucThang = thoiDiem.clone().endOf('month');
	const nhanTrucX = [] as string[];
	const duLieuCot = [] as number[];

	let conTro = batDauThang.clone();
	let soTuan = 1;

	while (conTro.isSameOrBefore(ketThucThang, 'day')) {
		const ketThucTuan = moment.min(conTro.clone().add(6, 'day'), ketThucThang);
		nhanTrucX.push(`Tuần ${soTuan}`);

		const tongBuoi = danhSachBuoiTap.filter(
			(item) =>
				item.trangThai === 'hoan_thanh' &&
				moment(item.ngayTap).isBetween(conTro, ketThucTuan, 'day', '[]'),
		).length;

		duLieuCot.push(tongBuoi);
		conTro = ketThucTuan.clone().add(1, 'day');
		soTuan += 1;
	}

	return {
		nhanTrucX,
		duLieuCot,
	};
};

export const taoDuLieuCanNangTheoThoiGian = (danhSachChiSo: ChiSoSucKhoe[]) => {
	const danhSachDaSapXep = sapXepChiSoTheoNgayTangDan(danhSachChiSo);

	return {
		nhanTrucX: danhSachDaSapXep.map((item) => dinhDangNgay(item.ngayGhiNhan)),
		duLieu: danhSachDaSapXep.map((item) => item.canNangKg),
	};
};

export const layGiaTriCuoiCung = (danhSachChiSo: ChiSoSucKhoe[]) => {
	const danhSachDaSapXep = sapXepChiSoTheoNgayTangDan(danhSachChiSo);
	return danhSachDaSapXep[danhSachDaSapXep.length - 1];
};

export const dinhDangSoThapPhan = (giaTri: number, soLe = 1) => Number(giaTri.toFixed(soLe));

export const locBuoiTapTheoKhoangNgay = (danhSachBuoiTap: BuoiTap[], khoangNgay: [string, string] | null) => {
	if (!khoangNgay) {
		return danhSachBuoiTap;
	}

	return danhSachBuoiTap.filter((item) =>
		moment(item.ngayTap).isBetween(moment(khoangNgay[0]), moment(khoangNgay[1]), 'day', '[]'),
	);
};

export const locThuVienTheoBoLoc = (
	danhSachBaiTap: BaiTapThuVien[],
	tuKhoa: string,
	nhomCo?: NhomCo,
	mucDoKho?: MucDoKho,
) => {
	const tuKhoaDaChuanHoa = tuKhoa.trim().toLowerCase();

	return danhSachBaiTap.filter((item) => {
		const dungTuKhoa =
			!tuKhoaDaChuanHoa ||
			item.tenBaiTap.toLowerCase().includes(tuKhoaDaChuanHoa) ||
			item.moTaNgan.toLowerCase().includes(tuKhoaDaChuanHoa);
		const dungNhomCo = !nhomCo || item.nhomCo === nhomCo;
		const dungMucDoKho = !mucDoKho || item.mucDoKho === mucDoKho;

		return dungTuKhoa && dungNhomCo && dungMucDoKho;
	});
};
