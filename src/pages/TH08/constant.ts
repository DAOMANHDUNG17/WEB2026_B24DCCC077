import moment from 'moment';
import type {
	BaiTapThuVien,
	BuoiTap,
	ChiSoSucKhoe,
	LoaiBaiTap,
	LoaiMucTieu,
	LuaChon,
	MucDoKho,
	MucTieu,
	NhomCo,
	TrangThaiBuoiTap,
	TrangThaiLocMucTieu,
	TrangThaiMucTieu,
} from './types';

const taoIdMacDinh = (tienTo: string, chiSo: number) => `${tienTo}-${chiSo}`;

export const KHO_LUU_TRU_TH08 = {
	buoiTap: 'th08_buoi_tap',
	chiSoSucKhoe: 'th08_chi_so_suc_khoe',
	mucTieu: 'th08_muc_tieu',
	thuVienBaiTap: 'th08_thu_vien_bai_tap',
};

export const DANH_SACH_LOAI_BAI_TAP: LuaChon[] = [
	{ label: 'Cardio', value: 'cardio' },
	{ label: 'Strength', value: 'strength' },
	{ label: 'Yoga', value: 'yoga' },
	{ label: 'HIIT', value: 'hiit' },
	{ label: 'Other', value: 'other' },
];

export const DANH_SACH_TRANG_THAI_BUOI_TAP: LuaChon[] = [
	{ label: 'Hoàn thành', value: 'hoan_thanh' },
	{ label: 'Bỏ lỡ', value: 'bo_lo' },
];

export const DANH_SACH_LOAI_MUC_TIEU: LuaChon[] = [
	{ label: 'Giảm cân', value: 'giam_can' },
	{ label: 'Tăng cơ', value: 'tang_co' },
	{ label: 'Cải thiện sức bền', value: 'cai_thien_suc_ben' },
	{ label: 'Khác', value: 'khac' },
];

export const DANH_SACH_TRANG_THAI_MUC_TIEU: LuaChon[] = [
	{ label: 'Đang thực hiện', value: 'dang_thuc_hien' },
	{ label: 'Đã đạt', value: 'da_dat' },
	{ label: 'Đã hủy', value: 'da_huy' },
];

export const DANH_SACH_LOC_MUC_TIEU: LuaChon[] = [
	{ label: 'Tất cả', value: 'tat_ca' },
	...DANH_SACH_TRANG_THAI_MUC_TIEU,
];

export const DANH_SACH_NHOM_CO: LuaChon[] = [
	{ label: 'Chest', value: 'chest' },
	{ label: 'Back', value: 'back' },
	{ label: 'Legs', value: 'legs' },
	{ label: 'Shoulders', value: 'shoulders' },
	{ label: 'Arms', value: 'arms' },
	{ label: 'Core', value: 'core' },
	{ label: 'Full Body', value: 'full_body' },
];

export const DANH_SACH_MUC_DO_KHO: LuaChon[] = [
	{ label: 'Dễ', value: 'de' },
	{ label: 'Trung bình', value: 'trung_binh' },
	{ label: 'Khó', value: 'kho' },
];

export const GIA_TRI_MAC_DINH_TRANG_THAI_MUC_TIEU: TrangThaiLocMucTieu = 'tat_ca';

const taoDanhSachBuoiTapMacDinh = (): BuoiTap[] => {
	const mocThoiGian = moment();

	return [
		{
			id: taoIdMacDinh('buoi-tap', 1),
			ngayTap: mocThoiGian.clone().subtract(0, 'day').hour(6).minute(30).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Chạy bộ buổi sáng',
			loaiBaiTap: 'cardio',
			thoiLuongPhut: 45,
			caloDot: 420,
			ghiChu: 'Giữ pace ổn định 6:10/km.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 2),
			ngayTap: mocThoiGian.clone().subtract(1, 'day').hour(18).minute(0).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Yoga hồi phục',
			loaiBaiTap: 'yoga',
			thoiLuongPhut: 35,
			caloDot: 160,
			ghiChu: 'Ưu tiên kéo giãn lưng và hông.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 3),
			ngayTap: mocThoiGian.clone().subtract(2, 'day').hour(17).minute(15).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'HIIT đốt mỡ',
			loaiBaiTap: 'hiit',
			thoiLuongPhut: 30,
			caloDot: 360,
			ghiChu: '8 hiệp, nghỉ 30 giây.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 4),
			ngayTap: mocThoiGian.clone().subtract(4, 'day').hour(19).minute(10).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Tập ngực và tay sau',
			loaiBaiTap: 'strength',
			thoiLuongPhut: 60,
			caloDot: 510,
			ghiChu: 'Tăng mức tạ ở bài bench press.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 5),
			ngayTap: mocThoiGian.clone().subtract(6, 'day').hour(6).minute(45).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Đạp xe trong nhà',
			loaiBaiTap: 'cardio',
			thoiLuongPhut: 40,
			caloDot: 320,
			ghiChu: 'Bỏ lỡ do họp đột xuất.',
			trangThai: 'bo_lo',
		},
		{
			id: taoIdMacDinh('buoi-tap', 6),
			ngayTap: mocThoiGian.clone().subtract(8, 'day').hour(18).minute(30).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Tập chân tổng hợp',
			loaiBaiTap: 'strength',
			thoiLuongPhut: 65,
			caloDot: 580,
			ghiChu: 'Hoàn thành squat, lunge, leg press.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 7),
			ngayTap: mocThoiGian.clone().subtract(12, 'day').hour(7).minute(0).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Đi bộ nhanh',
			loaiBaiTap: 'other',
			thoiLuongPhut: 50,
			caloDot: 240,
			ghiChu: 'Kết hợp nghe podcast.',
			trangThai: 'hoan_thanh',
		},
		{
			id: taoIdMacDinh('buoi-tap', 8),
			ngayTap: mocThoiGian.clone().subtract(16, 'day').hour(19).minute(20).second(0).millisecond(0).toISOString(),
			tenBaiTap: 'Pilates core',
			loaiBaiTap: 'other',
			thoiLuongPhut: 45,
			caloDot: 210,
			ghiChu: 'Tập trung nhóm cơ bụng sâu.',
			trangThai: 'hoan_thanh',
		},
	];
};

const taoDanhSachChiSoMacDinh = (): ChiSoSucKhoe[] => {
	const mocThoiGian = moment();

	return [
		{
			id: taoIdMacDinh('chi-so', 1),
			ngayGhiNhan: mocThoiGian.clone().subtract(25, 'day').hour(7).minute(0).second(0).toISOString(),
			canNangKg: 71.8,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 76,
			gioNgu: 6.4,
		},
		{
			id: taoIdMacDinh('chi-so', 2),
			ngayGhiNhan: mocThoiGian.clone().subtract(20, 'day').hour(7).minute(0).second(0).toISOString(),
			canNangKg: 71.2,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 74,
			gioNgu: 6.8,
		},
		{
			id: taoIdMacDinh('chi-so', 3),
			ngayGhiNhan: mocThoiGian.clone().subtract(15, 'day').hour(7).minute(0).second(0).toISOString(),
			canNangKg: 70.9,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 73,
			gioNgu: 7.0,
		},
		{
			id: taoIdMacDinh('chi-so', 4),
			ngayGhiNhan: mocThoiGian.clone().subtract(10, 'day').hour(7).minute(0).second(0).toISOString(),
			canNangKg: 70.4,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 72,
			gioNgu: 7.2,
		},
		{
			id: taoIdMacDinh('chi-so', 5),
			ngayGhiNhan: mocThoiGian.clone().subtract(5, 'day').hour(7).minute(0).second(0).toISOString(),
			canNangKg: 70.1,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 71,
			gioNgu: 7.1,
		},
		{
			id: taoIdMacDinh('chi-so', 6),
			ngayGhiNhan: mocThoiGian.clone().hour(7).minute(0).second(0).toISOString(),
			canNangKg: 69.8,
			chieuCaoCm: 172,
			nhipTimNghiBpm: 70,
			gioNgu: 7.4,
		},
	];
};

const taoDanhSachMucTieuMacDinh = (): MucTieu[] => {
	const mocThoiGian = moment();

	return [
		{
			id: taoIdMacDinh('muc-tieu', 1),
			tenMucTieu: 'Giảm cân về 68kg',
			loaiMucTieu: 'giam_can',
			giaTriMucTieu: 68,
			giaTriHienTai: 69.8,
			donVi: 'kg',
			deadline: mocThoiGian.clone().add(45, 'day').toISOString(),
			trangThai: 'dang_thuc_hien',
		},
		{
			id: taoIdMacDinh('muc-tieu', 2),
			tenMucTieu: 'Bench press 80kg',
			loaiMucTieu: 'tang_co',
			giaTriMucTieu: 80,
			giaTriHienTai: 72,
			donVi: 'kg',
			deadline: mocThoiGian.clone().add(60, 'day').toISOString(),
			trangThai: 'dang_thuc_hien',
		},
		{
			id: taoIdMacDinh('muc-tieu', 3),
			tenMucTieu: 'Chạy 5km dưới 30 phút',
			loaiMucTieu: 'cai_thien_suc_ben',
			giaTriMucTieu: 5,
			giaTriHienTai: 5,
			donVi: 'km',
			deadline: mocThoiGian.clone().add(15, 'day').toISOString(),
			trangThai: 'da_dat',
		},
		{
			id: taoIdMacDinh('muc-tieu', 4),
			tenMucTieu: 'Duy trì ngủ đủ 7 giờ',
			loaiMucTieu: 'khac',
			giaTriMucTieu: 7,
			giaTriHienTai: 6.8,
			donVi: 'giờ',
			deadline: mocThoiGian.clone().add(20, 'day').toISOString(),
			trangThai: 'dang_thuc_hien',
		},
	];
};

const taoDanhSachThuVienMacDinh = (): BaiTapThuVien[] => [
	{
		id: taoIdMacDinh('bai-tap', 1),
		tenBaiTap: 'Barbell Bench Press',
		nhomCo: 'chest',
		mucDoKho: 'trung_binh',
		moTaNgan: 'Bài đẩy ngực cơ bản giúp phát triển ngực, vai trước và tay sau.',
		caloTrungBinhMoiGio: 420,
		huongDanChiTiet:
			'1. Nằm trên ghế phẳng, chân đặt chắc trên sàn.\n2. Cầm đòn rộng hơn vai một chút.\n3. Hạ đòn có kiểm soát về giữa ngực.\n4. Đẩy mạnh lên, siết ngực ở đỉnh chuyển động.\n5. Giữ cổ tay trung tính và không nảy đòn khỏi ngực.',
	},
	{
		id: taoIdMacDinh('bai-tap', 2),
		tenBaiTap: 'Pull Up',
		nhomCo: 'back',
		mucDoKho: 'kho',
		moTaNgan: 'Bài kéo xà phát triển lưng xô, tay trước và sức mạnh thân trên.',
		caloTrungBinhMoiGio: 500,
		huongDanChiTiet:
			'1. Treo người trên xà với tay nắm rộng bằng vai.\n2. Siết cơ bụng, hạ vai xuống.\n3. Kéo người lên cho tới khi cằm vượt xà.\n4. Hạ xuống chậm và kiểm soát.\n5. Tránh đung đưa quá mức nếu không tập kiểu kipping.',
	},
	{
		id: taoIdMacDinh('bai-tap', 3),
		tenBaiTap: 'Goblet Squat',
		nhomCo: 'legs',
		mucDoKho: 'de',
		moTaNgan: 'Bài squat với tạ đơn giúp tăng sức mạnh chân và cải thiện kỹ thuật squat.',
		caloTrungBinhMoiGio: 390,
		huongDanChiTiet:
			'1. Ôm tạ trước ngực, khuỷu tay hướng xuống.\n2. Mở chân rộng bằng vai, mũi chân hơi chếch ra ngoài.\n3. Hạ hông xuống cho tới khi đùi song song sàn.\n4. Đẩy gót chân để đứng dậy.\n5. Giữ lưng thẳng và đầu gối đi cùng hướng mũi chân.',
	},
	{
		id: taoIdMacDinh('bai-tap', 4),
		tenBaiTap: 'Shoulder Press',
		nhomCo: 'shoulders',
		mucDoKho: 'trung_binh',
		moTaNgan: 'Bài đẩy vai giúp phát triển vai trước, vai giữa và tay sau.',
		caloTrungBinhMoiGio: 360,
		huongDanChiTiet:
			'1. Giữ tạ ngang vai, lòng bàn tay hướng về trước.\n2. Siết bụng và mông để ổn định thân người.\n3. Đẩy tạ thẳng lên trên đầu.\n4. Hạ về vị trí cũ thật chậm.\n5. Không ưỡn lưng quá nhiều khi đẩy.',
	},
	{
		id: taoIdMacDinh('bai-tap', 5),
		tenBaiTap: 'Biceps Curl',
		nhomCo: 'arms',
		mucDoKho: 'de',
		moTaNgan: 'Bài cô lập tay trước, phù hợp cho người mới bắt đầu tập kháng lực.',
		caloTrungBinhMoiGio: 250,
		huongDanChiTiet:
			'1. Đứng thẳng, giữ tạ hai bên thân người.\n2. Gập khuỷu tay để nâng tạ lên.\n3. Không vung tay hay đẩy vai ra trước.\n4. Hạ tạ từ từ tới vị trí ban đầu.\n5. Duy trì khuỷu tay sát thân người.',
	},
	{
		id: taoIdMacDinh('bai-tap', 6),
		tenBaiTap: 'Plank',
		nhomCo: 'core',
		mucDoKho: 'de',
		moTaNgan: 'Bài giữ tĩnh để tăng sức bền nhóm cơ bụng, lưng dưới và thân giữa.',
		caloTrungBinhMoiGio: 220,
		huongDanChiTiet:
			'1. Chống khuỷu tay ngay dưới vai.\n2. Giữ thân người thành một đường thẳng.\n3. Siết bụng, siết mông và thở đều.\n4. Tránh võng lưng hoặc nâng hông quá cao.\n5. Giữ thời gian phù hợp với thể lực hiện tại.',
	},
	{
		id: taoIdMacDinh('bai-tap', 7),
		tenBaiTap: 'Burpee',
		nhomCo: 'full_body',
		mucDoKho: 'kho',
		moTaNgan: 'Bài toàn thân cường độ cao giúp tăng tim mạch và đốt calo nhanh.',
		caloTrungBinhMoiGio: 700,
		huongDanChiTiet:
			'1. Từ tư thế đứng, hạ xuống chống tay lên sàn.\n2. Bật chân về sau thành plank.\n3. Thực hiện một chống đẩy nếu cần.\n4. Thu chân về gần tay.\n5. Bật nhảy thẳng đứng và lặp lại nhịp nhàng.',
	},
	{
		id: taoIdMacDinh('bai-tap', 8),
		tenBaiTap: 'Sun Salutation',
		nhomCo: 'full_body',
		mucDoKho: 'trung_binh',
		moTaNgan: 'Chuỗi yoga toàn thân giúp khởi động, tăng linh hoạt và kiểm soát hơi thở.',
		caloTrungBinhMoiGio: 280,
		huongDanChiTiet:
			'1. Bắt đầu ở tư thế đứng thẳng, chắp tay trước ngực.\n2. Hít vào, đưa tay lên cao và vươn người.\n3. Thở ra, gập người về trước.\n4. Lùi chân về plank rồi chuyển sang upward dog và downward dog.\n5. Bước chân lên trước, đứng dậy và lặp lại theo nhịp thở.',
	},
	{
		id: taoIdMacDinh('bai-tap', 9),
		tenBaiTap: 'Romanian Deadlift',
		nhomCo: 'legs',
		mucDoKho: 'trung_binh',
		moTaNgan: 'Bài bản lề hông giúp phát triển gân kheo, mông và lưng dưới.',
		caloTrungBinhMoiGio: 410,
		huongDanChiTiet:
			'1. Đứng thẳng, giữ tạ sát đùi.\n2. Đẩy hông ra sau và hạ tạ dọc theo chân.\n3. Giữ lưng trung lập và đầu gối hơi chùng.\n4. Hạ tới khi cảm nhận căng gân kheo.\n5. Dùng hông kéo người về tư thế đứng.',
	},
];

export const DU_LIEU_MAC_DINH_TH08 = {
	buoiTap: taoDanhSachBuoiTapMacDinh,
	chiSoSucKhoe: taoDanhSachChiSoMacDinh,
	mucTieu: taoDanhSachMucTieuMacDinh,
	thuVienBaiTap: taoDanhSachThuVienMacDinh,
};

export const MAU_THEO_TRANG_THAI_BUOI_TAP: Record<TrangThaiBuoiTap, string> = {
	hoan_thanh: 'success',
	bo_lo: 'warning',
};

export const MAU_THEO_MUC_DO_KHO: Record<MucDoKho, string> = {
	de: 'blue',
	trung_binh: 'gold',
	kho: 'red',
};

export const MAU_THEO_TRANG_THAI_MUC_TIEU: Record<TrangThaiMucTieu, string> = {
	dang_thuc_hien: 'processing',
	da_dat: 'success',
	da_huy: 'default',
};

export const MAU_THEO_BMI = {
	thieu_can: 'blue',
	binh_thuong: 'green',
	thua_can: 'gold',
	beo_phi: 'red',
};

export const DON_VI_MUC_TIEU_GOI_Y = ['kg', 'km', 'phút', 'buổi', 'giờ'];

export const LOAI_BAI_TAP_MAC_DINH: LoaiBaiTap = 'cardio';
export const TRANG_THAI_BUOI_TAP_MAC_DINH: TrangThaiBuoiTap = 'hoan_thanh';
export const LOAI_MUC_TIEU_MAC_DINH: LoaiMucTieu = 'giam_can';
export const TRANG_THAI_MUC_TIEU_MAC_DINH: TrangThaiMucTieu = 'dang_thuc_hien';
export const NHOM_CO_MAC_DINH: NhomCo = 'chest';
export const MUC_DO_KHO_MAC_DINH: MucDoKho = 'de';
