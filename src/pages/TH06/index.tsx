import type { DiemDen, HuongSapXep, KeHoachDuLich, KetQuaXuLy, LichTrinh, MucDieuHuong } from './types';
import { CalendarOutlined, CompassOutlined, DollarCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Grid, Menu, Row, Space, Statistic, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import Admin from './components/Admin';
import KhamPha from './components/KhamPha';
import NganSach from './components/NganSach';
import TaoLichTrinh from './components/TaoLichTrinh';
import {
	KHO_LUU_TRU,
	DUONG_DAN_TH06,
	chuanHoaThuTuTheoNgay,
	docDuLieuTuBoNho,
	layMucTheoDuongDan,
	taoId,
	taoKeHoachTuLichTrinh,
	tinhTongChiPhiLichTrinh,
	tinhTongThoiGianDiChuyen,
} from './helpers';
import { duLieuDiemDenKhoiTao } from './mockData';

const { Title } = Typography;

const TH06Page = () => {
	const manHinh = Grid.useBreakpoint();
	const location = useLocation();
	const mucDangChon = layMucTheoDuongDan(location.pathname);

	const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU.danhSachDiemDen, duLieuDiemDenKhoiTao),
	);
	const [lichTrinh, setLichTrinh] = useState<LichTrinh[]>(() => docDuLieuTuBoNho(KHO_LUU_TRU.lichTrinh, []));
	const [danhSachKeHoach, setDanhSachKeHoach] = useState<KeHoachDuLich[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU.danhSachKeHoach, []),
	);
	const [nganSachToiDa, setNganSachToiDa] = useState<number>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU.nganSachToiDa, 12000000),
	);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.danhSachDiemDen, JSON.stringify(danhSachDiemDen));
	}, [danhSachDiemDen]);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.lichTrinh, JSON.stringify(lichTrinh));
	}, [lichTrinh]);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.danhSachKeHoach, JSON.stringify(danhSachKeHoach));
	}, [danhSachKeHoach]);

	useEffect(() => {
		localStorage.setItem(KHO_LUU_TRU.nganSachToiDa, JSON.stringify(nganSachToiDa));
	}, [nganSachToiDa]);

	const chuyenMuc = (muc: MucDieuHuong) => {
		history.push(DUONG_DAN_TH06[muc]);
	};

	const themMucLichTrinh = (diemDenId: string, ngay: number) => {
		const diemDen = danhSachDiemDen.find((item) => item.id === diemDenId);
		if (!diemDen) {
			message.error('Không tìm thấy điểm đến để thêm vào lịch trình.');
			return;
		}

		const thuTuMoi =
			lichTrinh.filter((item) => item.ngay === ngay).sort((a, b) => b.thuTu - a.thuTu)[0]?.thuTu || 0;

		setLichTrinh((prev) =>
			chuanHoaThuTuTheoNgay([
				...prev,
				{
					id: taoId('lich-trinh'),
					ngay,
					thuTu: thuTuMoi + 1,
					diemDen: { ...diemDen },
					ngayTao: new Date().toISOString(),
				},
			]),
		);
	};

	const xoaMucLichTrinh = (id: string) => {
		setLichTrinh((prev) => chuanHoaThuTuTheoNgay(prev.filter((item) => item.id !== id)));
		message.success('Đã xóa điểm đến khỏi lịch trình.');
	};

	const sapXepMucLichTrinh = (id: string, huong: HuongSapXep) => {
		setLichTrinh((prev) => {
			const danhSachMoi = [...prev];
			const mucDangSapXep = danhSachMoi.find((item) => item.id === id);
			if (!mucDangSapXep) {
				return prev;
			}

			const danhSachCungNgay = danhSachMoi
				.filter((item) => item.ngay === mucDangSapXep.ngay)
				.sort((a, b) => a.thuTu - b.thuTu);
			const viTriHienTai = danhSachCungNgay.findIndex((item) => item.id === id);
			const viTriDich = huong === 'len' ? viTriHienTai - 1 : viTriHienTai + 1;

			if (viTriHienTai < 0 || viTriDich < 0 || viTriDich >= danhSachCungNgay.length) {
				return prev;
			}

			const itemHienTai = danhSachCungNgay[viTriHienTai];
			const itemDich = danhSachCungNgay[viTriDich];

			return chuanHoaThuTuTheoNgay(
				danhSachMoi.map((item) => {
					if (item.id === itemHienTai.id) {
						return { ...item, thuTu: itemDich.thuTu };
					}
					if (item.id === itemDich.id) {
						return { ...item, thuTu: itemHienTai.thuTu };
					}
					return item;
				}),
			);
		});
	};

	const xoaTatCaLichTrinh = () => {
		setLichTrinh([]);
		message.success('Đã làm trống lịch trình hiện tại.');
	};

	const luuKeHoach = () => {
		if (!lichTrinh.length) {
			message.warning('Cần ít nhất một điểm đến để lưu lịch trình.');
			return;
		}

		const keHoachMoi = taoKeHoachTuLichTrinh(lichTrinh);
		setDanhSachKeHoach((prev) => [keHoachMoi, ...prev]);
		message.success(`Đã lưu ${keHoachMoi.tenKeHoach}.`);
	};

	const luuDiemDen = (diemDen: DiemDen): KetQuaXuLy => {
		const biTrung = danhSachDiemDen.some(
			(item) =>
				item.id !== diemDen.id &&
				item.tenDiaDiem.trim().toLowerCase() === diemDen.tenDiaDiem.trim().toLowerCase() &&
				item.diaDiem.trim().toLowerCase() === diemDen.diaDiem.trim().toLowerCase(),
		);

		if (biTrung) {
			return {
				success: false,
				message: 'Điểm đến này đã tồn tại trong danh sách quản trị.',
			};
		}

		const daTonTai = danhSachDiemDen.some((item) => item.id === diemDen.id);

		if (daTonTai) {
			setDanhSachDiemDen((prev) => prev.map((item) => (item.id === diemDen.id ? { ...diemDen } : item)));
			setLichTrinh((prev) => prev.map((item) => (item.diemDen.id === diemDen.id ? { ...item, diemDen: { ...diemDen } } : item)));
			return {
				success: true,
				message: 'Cập nhật điểm đến thành công.',
			};
		}

		setDanhSachDiemDen((prev) => [{ ...diemDen }, ...prev]);
		return {
			success: true,
			message: 'Thêm điểm đến thành công.',
		};
	};

	const xoaDiemDen = (id: string): KetQuaXuLy => {
		const dangDuocSuDung = lichTrinh.some((item) => item.diemDen.id === id);
		if (dangDuocSuDung) {
			return {
				success: false,
				message: 'Không thể xóa vì điểm đến đang có trong lịch trình hiện tại.',
			};
		}

		setDanhSachDiemDen((prev) => prev.filter((item) => item.id !== id));
		return {
			success: true,
			message: 'Đã xóa điểm đến khỏi danh sách quản trị.',
		};
	};

	const xoaKeHoach = (id: string) => {
		setDanhSachKeHoach((prev) => prev.filter((item) => item.id !== id));
		message.success('Đã xóa kế hoạch đã lưu.');
	};

	const tongChiPhiHienTai = tinhTongChiPhiLichTrinh(lichTrinh);
	const tongThoiGianDiChuyen = tinhTongThoiGianDiChuyen(lichTrinh);

	const noiDungTheoMuc = {
		kham_pha: <KhamPha danhSachDiemDen={danhSachDiemDen} />,
		lich_trinh: (
			<TaoLichTrinh
				danhSachDiemDen={danhSachDiemDen}
				lichTrinh={lichTrinh}
				tongSoKeHoachDaLuu={danhSachKeHoach.length}
				onThemMuc={themMucLichTrinh}
				onXoaMuc={xoaMucLichTrinh}
				onSapXepMuc={sapXepMucLichTrinh}
				onLuuKeHoach={luuKeHoach}
				onXoaTatCa={xoaTatCaLichTrinh}
			/>
		),
		ngan_sach: <NganSach lichTrinh={lichTrinh} nganSachToiDa={nganSachToiDa} onCapNhatNganSach={setNganSachToiDa} />,
		admin: (
			<Admin
				danhSachDiemDen={danhSachDiemDen}
				lichTrinh={lichTrinh}
				danhSachKeHoach={danhSachKeHoach}
				onLuuDiemDen={luuDiemDen}
				onXoaDiemDen={xoaDiemDen}
				onXoaKeHoach={xoaKeHoach}
			/>
		),
	};

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Card>
				<Space direction='vertical' size={8} style={{ width: '100%' }}>
					<Title level={3} style={{ margin: 0 }}>
						TH06 - Ứng dụng lập kế hoạch du lịch
					</Title>
				</Space>
			</Card>

			<Alert
				type='info'
				showIcon
				message={`Hiện có ${danhSachDiemDen.length} điểm đến, ${lichTrinh.length} mục trong lịch trình, ${danhSachKeHoach.length} kế hoạch đã lưu và tổng chi phí bản nháp là ${tongChiPhiHienTai.toLocaleString('vi-VN')}đ.`}
			/>

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Điểm đến' value={danhSachDiemDen.length} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Lịch trình hiện tại' value={lichTrinh.length} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Chi phí bản nháp' value={tongChiPhiHienTai.toLocaleString('vi-VN')} suffix='đ' />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Thời gian di chuyển' value={tongThoiGianDiChuyen} suffix='giờ' />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={6}>
					<Card bodyStyle={{ padding: manHinh.lg ? 12 : 0 }}>
						<Menu
							mode={manHinh.lg ? 'inline' : 'horizontal'}
							selectedKeys={[mucDangChon]}
							onClick={(event) => chuyenMuc(event.key as MucDieuHuong)}
						>
							<Menu.Item key='kham_pha' icon={<CompassOutlined />}>
								Khám phá điểm đến
							</Menu.Item>
							<Menu.Item key='lich_trinh' icon={<CalendarOutlined />}>
								Tạo lịch trình
							</Menu.Item>
							<Menu.Item key='ngan_sach' icon={<DollarCircleOutlined />}>
								Quản lý ngân sách
							</Menu.Item>
							<Menu.Item key='admin' icon={<SettingOutlined />}>
								Trang quản trị
							</Menu.Item>
						</Menu>
					</Card>
				</Col>
				<Col xs={24} lg={18}>
					{noiDungTheoMuc[mucDangChon]}
				</Col>
			</Row>
		</Space>
	);
};

export default TH06Page;
