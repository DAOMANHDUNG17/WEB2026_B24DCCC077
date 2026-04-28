import { Button, Card, Empty, Form, Space, Typography, message } from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { GIA_TRI_MAC_DINH_TRANG_THAI_MUC_TIEU } from '../constant';
import { dongBoTrangThaiMucTieu, taoId } from '../helpers';
import useDuLieuTheDuc from '../useDuLieuTheDuc';
import type { MucTieu, TrangThaiLocMucTieu } from '../types';
import BoLocMucTieu from './components/BoLocMucTieu';
import FormMucTieuDrawer, { type GiaTriFormMucTieu } from './components/FormMucTieuDrawer';
import TheMucTieu from './components/TheMucTieu';

const QuanLyMucTieuPage = () => {
	const [formMucTieu] = Form.useForm<GiaTriFormMucTieu>();
	const { danhSachMucTieu, setDanhSachMucTieu } = useDuLieuTheDuc();
	const [trangThaiDangLoc, setTrangThaiDangLoc] = useState<TrangThaiLocMucTieu>(GIA_TRI_MAC_DINH_TRANG_THAI_MUC_TIEU);
	const [visibleDrawer, setVisibleDrawer] = useState(false);
	const [banGhiDangSua, setBanGhiDangSua] = useState<MucTieu | null>(null);

	const danhSachDaLoc = useMemo(() => {
		const duLieuDaSapXep = [...danhSachMucTieu].sort(
			(a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
		);

		if (trangThaiDangLoc === 'tat_ca') {
			return duLieuDaSapXep;
		}

		return duLieuDaSapXep.filter((item) => item.trangThai === trangThaiDangLoc);
	}, [danhSachMucTieu, trangThaiDangLoc]);

	const moDrawerThem = () => {
		setBanGhiDangSua(null);
		setVisibleDrawer(true);
	};

	const moDrawerSua = (banGhi: MucTieu) => {
		setBanGhiDangSua(banGhi);
		setVisibleDrawer(true);
	};

	const dongDrawer = () => {
		setVisibleDrawer(false);
		setBanGhiDangSua(null);
		formMucTieu.resetFields();
	};

	const xuLyLuu = (giaTri: GiaTriFormMucTieu) => {
		const duLieuCoBan: MucTieu = {
			id: banGhiDangSua?.id || taoId('muc-tieu'),
			tenMucTieu: giaTri.tenMucTieu.trim(),
			loaiMucTieu: giaTri.loaiMucTieu,
			giaTriMucTieu: giaTri.giaTriMucTieu,
			giaTriHienTai: giaTri.giaTriHienTai,
			donVi: giaTri.donVi.trim(),
			deadline: giaTri.deadline.toISOString(),
			trangThai: giaTri.trangThai,
		};

		const duLieuLuu = dongBoTrangThaiMucTieu(duLieuCoBan);

		if (banGhiDangSua) {
			setDanhSachMucTieu((duLieuCu) => duLieuCu.map((item) => (item.id === duLieuLuu.id ? duLieuLuu : item)));
			message.success('Cập nhật mục tiêu thành công');
		} else {
			setDanhSachMucTieu((duLieuCu) => [duLieuLuu, ...duLieuCu]);
			message.success('Thêm mục tiêu thành công');
		}

		dongDrawer();
	};

	const xuLyXoa = (id: string) => {
		setDanhSachMucTieu((duLieuCu) => duLieuCu.filter((item) => item.id !== id));
		message.success('Xóa mục tiêu thành công');
	};

	const capNhatGiaTriHienTai = (id: string, giaTri: number) => {
		setDanhSachMucTieu((duLieuCu) =>
			duLieuCu.map((item) => {
				if (item.id !== id) {
					return item;
				}
				return dongBoTrangThaiMucTieu({
					...item,
					giaTriHienTai: giaTri,
				});
			}),
		);
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Typography.Title level={3} style={{ marginBottom: 8 }}>
					TH08 - Quản lý mục tiêu
				</Typography.Title>
				<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
					Theo dõi tiến độ mục tiêu bằng thẻ card, cập nhật giá trị hiện tại trực tiếp và lọc nhanh theo trạng thái.
				</Typography.Paragraph>
			</div>

			<Card
				title='Danh sách mục tiêu'
				extra={
					<Button type='primary' onClick={moDrawerThem}>
						Thêm mục tiêu
					</Button>
				}
			>
				<Space direction='vertical' size='large' style={{ width: '100%' }}>
					<BoLocMucTieu giaTriDangLoc={trangThaiDangLoc} onThayDoi={setTrangThaiDangLoc} />
					{danhSachDaLoc.length > 0 ? (
						<TheMucTieu
							danhSachMucTieu={danhSachDaLoc}
							onSua={moDrawerSua}
							onXoa={xuLyXoa}
							onCapNhatGiaTriHienTai={capNhatGiaTriHienTai}
						/>
					) : (
						<Empty description='Không có mục tiêu phù hợp bộ lọc' />
					)}
				</Space>
			</Card>

			<FormMucTieuDrawer
				visible={visibleDrawer}
				form={formMucTieu}
				banGhiDangSua={banGhiDangSua}
				onDong={dongDrawer}
				onLuu={xuLyLuu}
			/>
		</Space>
	);
};

export default QuanLyMucTieuPage;
