import { Col, Row, Space, Typography } from 'antd';
import { useMemo } from 'react';
import {
	layDanhSachBuoiTapGanNhat,
	taoDuLieuBuoiTapTheoTuan,
	taoDuLieuCanNangTheoThoiGian,
	tinhStreakTapLuyen,
	tinhTongBuoiTapTrongThang,
	tinhTongCaloTrongThang,
	tinhTyLeHoanThanhMucTieu,
} from '../helpers';
import useDuLieuTheDuc from '../useDuLieuTheDuc';
import BieuDoBuoiTapTheoTuan from './components/BieuDoBuoiTapTheoTuan';
import BieuDoCanNang from './components/BieuDoCanNang';
import ThongKeTongQuan from './components/ThongKeTongQuan';
import TimelineBuoiTapGanNhat from './components/TimelineBuoiTapGanNhat';

const DashboardTH08 = () => {
	const { danhSachBuoiTap, danhSachChiSo, danhSachMucTieu } = useDuLieuTheDuc();

	const duLieuTongQuan = useMemo(
		() => ({
			tongBuoiTap: tinhTongBuoiTapTrongThang(danhSachBuoiTap),
			tongCalo: tinhTongCaloTrongThang(danhSachBuoiTap),
			streak: tinhStreakTapLuyen(danhSachBuoiTap),
			tienDoMucTieu: tinhTyLeHoanThanhMucTieu(danhSachMucTieu),
		}),
		[danhSachBuoiTap, danhSachMucTieu],
	);

	const duLieuCot = useMemo(() => taoDuLieuBuoiTapTheoTuan(danhSachBuoiTap), [danhSachBuoiTap]);
	const duLieuCanNang = useMemo(() => taoDuLieuCanNangTheoThoiGian(danhSachChiSo), [danhSachChiSo]);
	const danhSachBuoiTapGanNhat = useMemo(() => layDanhSachBuoiTapGanNhat(danhSachBuoiTap), [danhSachBuoiTap]);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Typography.Title level={3} style={{ marginBottom: 8 }}>
					TH08 - Dashboard thể dục và sức khỏe
				</Typography.Title>
				<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
					Theo dõi nhanh hiệu suất tập luyện, tiến độ mục tiêu và biến động chỉ số sức khỏe trong tháng hiện tại.
				</Typography.Paragraph>
			</div>

			<ThongKeTongQuan {...duLieuTongQuan} />

			<Row gutter={[16, 16]}>
				<Col xs={24} xl={14}>
					<BieuDoBuoiTapTheoTuan nhanTrucX={duLieuCot.nhanTrucX} duLieu={duLieuCot.duLieuCot} />
				</Col>
				<Col xs={24} xl={10}>
					<BieuDoCanNang nhanTrucX={duLieuCanNang.nhanTrucX} duLieu={duLieuCanNang.duLieu} />
				</Col>
			</Row>

			<TimelineBuoiTapGanNhat danhSachBuoiTap={danhSachBuoiTapGanNhat} />
		</Space>
	);
};

export default DashboardTH08;
