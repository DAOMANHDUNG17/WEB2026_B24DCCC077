import type { CauLacBo, DonDangKy, KetQuaXuLy, LichSuThaoTac, TrangThaiDon } from './types';
import BaoCaoThongKe from './BaoCaoThongKe';
import { DEFAULT_CAU_LAC_BO, DEFAULT_DON_DANG_KY, DEFAULT_LICH_SU_THAO_TAC } from './mockData';
import QuanLyCauLacBo from './QuanLyCauLacBo';
import QuanLyDonDangKy from './QuanLyDonDangKy';
import QuanLyThanhVien from './QuanLyThanhVien';
import { Alert, Badge, Tabs, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const { TabPane } = Tabs;

const KHO_LUU_TRU = {
	cauLacBo: 'th05_cau_lac_bo',
	donDangKy: 'th05_don_dang_ky',
	lichSuThaoTac: 'th05_lich_su_thao_tac',
};

const NGUOI_THUC_HIEN_MAC_DINH = 'Admin';

const taoId = (tienTo: string) => `${tienTo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const layThoiGianHienTai = () =>
	new Date().toLocaleString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

const docDuLieuTuBoNho = <T,>(key: string, giaTriMacDinh: T): T => {
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
		console.error(`Không đọc được dữ liệu với key ${key}`, error);
		return giaTriMacDinh;
	}
};

const chuanHoaCauLacBo = (duLieu: CauLacBo[]): CauLacBo[] => {
	if (!Array.isArray(duLieu)) {
		return DEFAULT_CAU_LAC_BO;
	}

	return duLieu.map((item, index) => ({
		id: item?.id || `clb-cu-${index + 1}`,
		anhDaiDien: item?.anhDaiDien || '',
		tenCauLacBo: item?.tenCauLacBo || `Câu lạc bộ ${index + 1}`,
		ngayThanhLap: item?.ngayThanhLap || '01/01/2026',
		moTa: item?.moTa || '<p>Chưa có mô tả.</p>',
		chuNhiem: item?.chuNhiem || 'Chưa cập nhật',
		hoatDong: typeof item?.hoatDong === 'boolean' ? item.hoatDong : true,
	}));
};

const chuanHoaDonDangKy = (duLieu: DonDangKy[]): DonDangKy[] => {
	if (!Array.isArray(duLieu)) {
		return DEFAULT_DON_DANG_KY;
	}

	return duLieu.map((item, index) => ({
		id: item?.id || `don-cu-${index + 1}`,
		hoTen: item?.hoTen || `Ứng viên ${index + 1}`,
		email: item?.email || `ungvien${index + 1}@student.ptit.edu.vn`,
		sdt: item?.sdt || '',
		gioiTinh: item?.gioiTinh || 'Nam',
		diaChi: item?.diaChi || 'Chưa cập nhật',
		soTruong: item?.soTruong || 'Chưa cập nhật',
		idCauLacBo: item?.idCauLacBo || '',
		lyDoDangKy: item?.lyDoDangKy || 'Chưa cập nhật',
		trangThai:
			item?.trangThai === 'Approved' || item?.trangThai === 'Rejected' || item?.trangThai === 'Pending'
				? item.trangThai
				: 'Pending',
		ghiChu: item?.ghiChu,
	}));
};

const chuanHoaLichSu = (duLieu: LichSuThaoTac[]): LichSuThaoTac[] => {
	if (!Array.isArray(duLieu)) {
		return DEFAULT_LICH_SU_THAO_TAC;
	}

	return duLieu.map((item, index) => ({
		id: item?.id || `lich-su-cu-${index + 1}`,
		idDonDangKy: item?.idDonDangKy || '',
		nguoiThucHien: item?.nguoiThucHien || NGUOI_THUC_HIEN_MAC_DINH,
		hanhDong: item?.hanhDong || 'Updated',
		thoiGian: item?.thoiGian || layThoiGianHienTai(),
		noiDung: item?.noiDung || 'Chưa có nội dung lịch sử.',
	}));
};

const TH05Page = () => {
	const [tabDangChon, setTabDangChon] = useState('cau-lac-bo');
	const [idCauLacBoDangXem, setIdCauLacBoDangXem] = useState<string | undefined>();
	const [danhSachCauLacBo, setDanhSachCauLacBo] = useState<CauLacBo[]>(() =>
		chuanHoaCauLacBo(docDuLieuTuBoNho(KHO_LUU_TRU.cauLacBo, DEFAULT_CAU_LAC_BO)),
	);
	const [danhSachDonDangKy, setDanhSachDonDangKy] = useState<DonDangKy[]>(() =>
		chuanHoaDonDangKy(docDuLieuTuBoNho(KHO_LUU_TRU.donDangKy, DEFAULT_DON_DANG_KY)),
	);
	const [lichSuThaoTac, setLichSuThaoTac] = useState<LichSuThaoTac[]>(() =>
		chuanHoaLichSu(docDuLieuTuBoNho(KHO_LUU_TRU.lichSuThaoTac, DEFAULT_LICH_SU_THAO_TAC)),
	);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.cauLacBo, JSON.stringify(danhSachCauLacBo));
	}, [danhSachCauLacBo]);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.donDangKy, JSON.stringify(danhSachDonDangKy));
	}, [danhSachDonDangKy]);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.lichSuThaoTac, JSON.stringify(lichSuThaoTac));
	}, [lichSuThaoTac]);

	const tenCauLacBoMap = useMemo(() => {
		return danhSachCauLacBo.reduce<Record<string, string>>((acc, item) => {
			acc[item.id] = item.tenCauLacBo;
			return acc;
		}, {});
	}, [danhSachCauLacBo]);

	const themLichSu = (idDonDangKy: string, hanhDong: string, noiDung: string) => {
		setLichSuThaoTac((prev) => [
			{
				id: taoId('lich-su'),
				idDonDangKy,
				nguoiThucHien: NGUOI_THUC_HIEN_MAC_DINH,
				hanhDong,
				thoiGian: layThoiGianHienTai(),
				noiDung,
			},
			...prev,
		]);
	};

	const xuLyLuuCauLacBo = (cauLacBo: CauLacBo): KetQuaXuLy => {
		const tenBiTrung = danhSachCauLacBo.some(
			(item) =>
				item.id !== cauLacBo.id &&
				item.tenCauLacBo.trim().toLowerCase() === cauLacBo.tenCauLacBo.trim().toLowerCase(),
		);

		if (tenBiTrung) {
			return {
				success: false,
				message: 'Tên câu lạc bộ đã tồn tại.',
			};
		}

		if (cauLacBo.id) {
			setDanhSachCauLacBo((prev) => prev.map((item) => (item.id === cauLacBo.id ? cauLacBo : item)));
			return {
				success: true,
				message: 'Cập nhật câu lạc bộ thành công.',
			};
		}

		setDanhSachCauLacBo((prev) => [
			{
				...cauLacBo,
				id: taoId('clb'),
			},
			...prev,
		]);
		return {
			success: true,
			message: 'Thêm mới câu lạc bộ thành công.',
		};
	};

	const xuLyXoaCauLacBo = (id: string): KetQuaXuLy => {
		const coDonLienQuan = danhSachDonDangKy.some((item) => item.idCauLacBo === id);
		if (coDonLienQuan) {
			return {
				success: false,
				message: 'Không thể xóa câu lạc bộ vì đang có đơn đăng ký hoặc thành viên liên quan.',
			};
		}

		setDanhSachCauLacBo((prev) => prev.filter((item) => item.id !== id));
		if (idCauLacBoDangXem === id) {
			setIdCauLacBoDangXem(undefined);
		}

		return {
			success: true,
			message: 'Xóa câu lạc bộ thành công.',
		};
	};

	const xuLyXemThanhVienTheoClb = (idCauLacBo: string) => {
		setIdCauLacBoDangXem(idCauLacBo);
		setTabDangChon('thanh-vien');
	};

	const xuLyLuuDonDangKy = (donDangKy: DonDangKy, cheDo: 'them' | 'sua'): KetQuaXuLy => {
		const cauLacBo = danhSachCauLacBo.find((item) => item.id === donDangKy.idCauLacBo);
		if (!cauLacBo) {
			return {
				success: false,
				message: 'Câu lạc bộ được chọn không tồn tại.',
			};
		}

		if (!cauLacBo.hoatDong && cheDo === 'them') {
			return {
				success: false,
				message: 'Câu lạc bộ này đang tạm dừng hoạt động, không thể tạo đơn mới.',
			};
		}

		const emailBiTrung = danhSachDonDangKy.some(
			(item) =>
				item.id !== donDangKy.id &&
				item.email.trim().toLowerCase() === donDangKy.email.trim().toLowerCase() &&
				item.idCauLacBo === donDangKy.idCauLacBo &&
				item.trangThai !== 'Rejected',
		);

		if (emailBiTrung) {
			return {
				success: false,
				message: 'Ứng viên này đã có đơn đang xử lý hoặc đã được duyệt trong câu lạc bộ đã chọn.',
			};
		}

		if (cheDo === 'them') {
			const banGhiMoi: DonDangKy = {
				...donDangKy,
				id: taoId('don'),
				trangThai: 'Pending',
				ghiChu: undefined,
			};
			setDanhSachDonDangKy((prev) => [banGhiMoi, ...prev]);
			themLichSu(
				banGhiMoi.id,
				'Created',
				`${NGUOI_THUC_HIEN_MAC_DINH} đã tạo đơn đăng ký của ${banGhiMoi.hoTen} vào ${cauLacBo.tenCauLacBo}.`,
			);
			return {
				success: true,
				message: 'Thêm mới đơn đăng ký thành công.',
			};
		}

		const banGhiCu = danhSachDonDangKy.find((item) => item.id === donDangKy.id);
		if (!banGhiCu) {
			return {
				success: false,
				message: 'Không tìm thấy đơn đăng ký cần cập nhật.',
			};
		}

		const banGhiCapNhat: DonDangKy = {
			...banGhiCu,
			...donDangKy,
		};

		setDanhSachDonDangKy((prev) => prev.map((item) => (item.id === banGhiCapNhat.id ? banGhiCapNhat : item)));
		themLichSu(
			banGhiCapNhat.id,
			'Updated',
			`${NGUOI_THUC_HIEN_MAC_DINH} đã chỉnh sửa đơn đăng ký của ${banGhiCapNhat.hoTen}.`,
		);
		return {
			success: true,
			message: 'Cập nhật đơn đăng ký thành công.',
		};
	};

	const xuLyXoaDonDangKy = (id: string): KetQuaXuLy => {
		const banGhiCanXoa = danhSachDonDangKy.find((item) => item.id === id);
		if (!banGhiCanXoa) {
			return {
				success: false,
				message: 'Không tìm thấy đơn đăng ký để xóa.',
			};
		}

		setDanhSachDonDangKy((prev) => prev.filter((item) => item.id !== id));
		themLichSu(
			id,
			'Deleted',
			`${NGUOI_THUC_HIEN_MAC_DINH} đã xóa đơn đăng ký của ${banGhiCanXoa.hoTen}.`,
		);
		return {
			success: true,
			message: 'Xóa đơn đăng ký thành công.',
		};
	};

	const capNhatTrangThaiDon = (
		ids: string[],
		trangThaiMoi: Exclude<TrangThaiDon, 'Pending'>,
		lyDo?: string,
	): KetQuaXuLy => {
		const danhSachHopLe = danhSachDonDangKy.filter(
			(item) => ids.includes(item.id) && item.trangThai === 'Pending',
		);

		if (danhSachHopLe.length === 0) {
			return {
				success: false,
				message: 'Không có đơn chờ duyệt hợp lệ để xử lý.',
			};
		}

		setDanhSachDonDangKy((prev) =>
			prev.map((item) =>
				ids.includes(item.id) && item.trangThai === 'Pending'
					? {
							...item,
							trangThai: trangThaiMoi,
							ghiChu: trangThaiMoi === 'Rejected' ? lyDo : undefined,
					  }
					: item,
			),
		);

		danhSachHopLe.forEach((item) => {
			const tenCauLacBo = tenCauLacBoMap[item.idCauLacBo] || 'câu lạc bộ';
			const noiDung =
				trangThaiMoi === 'Approved'
					? `${NGUOI_THUC_HIEN_MAC_DINH} đã duyệt đơn của ${item.hoTen} vào ${tenCauLacBo}.`
					: `${NGUOI_THUC_HIEN_MAC_DINH} đã từ chối đơn của ${item.hoTen} vào ${tenCauLacBo} với lý do: ${lyDo}.`;

			themLichSu(item.id, trangThaiMoi, noiDung);
		});

		return {
			success: true,
			message:
				trangThaiMoi === 'Approved'
					? `Đã duyệt ${danhSachHopLe.length} đơn đăng ký.`
					: `Đã từ chối ${danhSachHopLe.length} đơn đăng ký.`,
		};
	};

	const xuLyDuyetDonDangKy = (ids: string[]) => capNhatTrangThaiDon(ids, 'Approved');

	const xuLyTuChoiDonDangKy = (ids: string[], lyDo: string) => {
		if (!lyDo.trim()) {
			return {
				success: false,
				message: 'Lý do từ chối là bắt buộc.',
			};
		};
		return capNhatTrangThaiDon(ids, 'Rejected', lyDo.trim());
	};

	const xuLyChuyenClbChoThanhVien = (ids: string[], idCauLacBoMoi: string): KetQuaXuLy => {
		const cauLacBoMoi = danhSachCauLacBo.find((item) => item.id === idCauLacBoMoi);
		if (!cauLacBoMoi) {
			return {
				success: false,
				message: 'Câu lạc bộ mới không tồn tại.',
			};
		}

		if (!cauLacBoMoi.hoatDong) {
			return {
				success: false,
				message: 'Chỉ có thể chuyển thành viên đến câu lạc bộ đang hoạt động.',
			};
		}

		const danhSachCanChuyen = danhSachDonDangKy.filter(
			(item) =>
				ids.includes(item.id) &&
				item.trangThai === 'Approved' &&
				item.idCauLacBo !== idCauLacBoMoi,
		);

		if (danhSachCanChuyen.length === 0) {
			return {
				success: false,
				message: 'Không có thành viên hợp lệ để chuyển câu lạc bộ.',
			};
		}

		setDanhSachDonDangKy((prev) =>
			prev.map((item) =>
				danhSachCanChuyen.some((thanhVien) => thanhVien.id === item.id)
					? { ...item, idCauLacBo: idCauLacBoMoi }
					: item,
			),
		);

		danhSachCanChuyen.forEach((item) => {
			const tenClbCu = tenCauLacBoMap[item.idCauLacBo] || 'câu lạc bộ cũ';
			themLichSu(
				item.id,
				'TransferClub',
				`${NGUOI_THUC_HIEN_MAC_DINH} đã chuyển ${item.hoTen} từ ${tenClbCu} sang ${cauLacBoMoi.tenCauLacBo}.`,
			);
		});

		return {
			success: true,
			message: `Đã chuyển ${danhSachCanChuyen.length} thành viên sang ${cauLacBoMoi.tenCauLacBo}.`,
		};
	};

	const tongDonChoDuyet = danhSachDonDangKy.filter((item) => item.trangThai === 'Pending').length;
	const tongThanhVien = danhSachDonDangKy.filter((item) => item.trangThai === 'Approved').length;

	return (
		<div style={{ background: '#fff', padding: 24, minHeight: 640 }}>
			<Typography.Title level={3}>TH05 - Hệ thống quản lý câu lạc bộ và đăng ký tham gia</Typography.Title>
			<Alert
				type='info'
				showIcon
				style={{ marginBottom: 16 }}
				message={`Hiện có ${danhSachCauLacBo.length} câu lạc bộ, ${tongDonChoDuyet} đơn chờ duyệt và ${tongThanhVien} thành viên chính thức.`}
			/>

			<Tabs activeKey={tabDangChon} onChange={setTabDangChon}>
				<TabPane tab='1. Danh sách câu lạc bộ' key='cau-lac-bo'>
					<QuanLyCauLacBo
						danhSachCauLacBo={danhSachCauLacBo}
						danhSachDonDangKy={danhSachDonDangKy}
						onSave={xuLyLuuCauLacBo}
						onDelete={xuLyXoaCauLacBo}
						onViewMembers={xuLyXemThanhVienTheoClb}
					/>
				</TabPane>
				<TabPane
					tab={
						<span>
							2. Đơn đăng ký <Badge count={tongDonChoDuyet} offset={[8, -2]} />
						</span>
					}
					key='don-dang-ky'
				>
					<QuanLyDonDangKy
						danhSachCauLacBo={danhSachCauLacBo}
						danhSachDonDangKy={danhSachDonDangKy}
						lichSuThaoTac={lichSuThaoTac}
						onSave={xuLyLuuDonDangKy}
						onDelete={xuLyXoaDonDangKy}
						onApprove={xuLyDuyetDonDangKy}
						onReject={xuLyTuChoiDonDangKy}
					/>
				</TabPane>
				<TabPane
					tab={
						<span>
							3. Thành viên <Badge count={tongThanhVien} offset={[8, -2]} />
						</span>
					}
					key='thanh-vien'
				>
					<QuanLyThanhVien
						danhSachCauLacBo={danhSachCauLacBo}
						danhSachDonDangKy={danhSachDonDangKy}
						idCauLacBoMacDinh={idCauLacBoDangXem}
						onTransferClub={xuLyChuyenClbChoThanhVien}
					/>
				</TabPane>
				<TabPane tab='4. Báo cáo thống kê' key='bao-cao'>
					<BaoCaoThongKe
						danhSachCauLacBo={danhSachCauLacBo}
						danhSachDonDangKy={danhSachDonDangKy}
						lichSuThaoTac={lichSuThaoTac}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default TH05Page;
