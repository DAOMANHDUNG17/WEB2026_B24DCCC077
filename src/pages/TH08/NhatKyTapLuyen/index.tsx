import { Button, Card, Form, Space, Typography, message } from 'antd';
import moment, { type Moment } from 'moment';
import { useMemo, useState } from 'react';
import { taoId } from '../helpers';
import useDuLieuTheDuc from '../useDuLieuTheDuc';
import type { BuoiTap, LoaiBaiTap } from '../types';
import BangBuoiTap from './components/BangBuoiTap';
import BoLocTapLuyen from './components/BoLocTapLuyen';
import FormBuoiTapModal, { type GiaTriFormBuoiTap } from './components/FormBuoiTapModal';

const NhatKyTapLuyenPage = () => {
	const [formBuoiTap] = Form.useForm<GiaTriFormBuoiTap>();
	const { danhSachBuoiTap, setDanhSachBuoiTap } = useDuLieuTheDuc();
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [loaiDangLoc, setLoaiDangLoc] = useState<LoaiBaiTap | undefined>();
	const [khoangNgayTap, setKhoangNgayTap] = useState<[Moment, Moment] | null>(null);
	const [visibleModal, setVisibleModal] = useState(false);
	const [banGhiDangSua, setBanGhiDangSua] = useState<BuoiTap | null>(null);

	const danhSachDaLoc = useMemo(() => {
		const tuKhoaDaChuanHoa = tuKhoaTimKiem.trim().toLowerCase();

		return danhSachBuoiTap.filter((item) => {
			const dungTuKhoa =
				!tuKhoaDaChuanHoa ||
				item.tenBaiTap.toLowerCase().includes(tuKhoaDaChuanHoa) ||
				(item.ghiChu || '').toLowerCase().includes(tuKhoaDaChuanHoa);
			const dungLoai = !loaiDangLoc || item.loaiBaiTap === loaiDangLoc;
			const dungKhoangNgay =
				!khoangNgayTap || moment(item.ngayTap).isBetween(khoangNgayTap[0], khoangNgayTap[1], 'day', '[]');

			return dungTuKhoa && dungLoai && dungKhoangNgay;
		});
	}, [danhSachBuoiTap, khoangNgayTap, loaiDangLoc, tuKhoaTimKiem]);

	const moModalThem = () => {
		setBanGhiDangSua(null);
		setVisibleModal(true);
	};

	const moModalSua = (buoiTap: BuoiTap) => {
		setBanGhiDangSua(buoiTap);
		setVisibleModal(true);
	};

	const dongModal = () => {
		setVisibleModal(false);
		setBanGhiDangSua(null);
		formBuoiTap.resetFields();
	};

	const xuLyLuu = (giaTri: GiaTriFormBuoiTap) => {
		const duLieuLuu: BuoiTap = {
			id: banGhiDangSua?.id || taoId('buoi-tap'),
			ngayTap: giaTri.ngayTap.toISOString(),
			tenBaiTap: giaTri.tenBaiTap.trim(),
			loaiBaiTap: giaTri.loaiBaiTap,
			thoiLuongPhut: giaTri.thoiLuongPhut,
			caloDot: giaTri.caloDot,
			ghiChu: giaTri.ghiChu?.trim(),
			trangThai: giaTri.trangThai,
		};

		if (banGhiDangSua) {
			setDanhSachBuoiTap((duLieuCu) => duLieuCu.map((item) => (item.id === duLieuLuu.id ? duLieuLuu : item)));
			message.success('Cập nhật buổi tập thành công');
		} else {
			setDanhSachBuoiTap((duLieuCu) =>
				[duLieuLuu, ...duLieuCu].sort((a, b) => moment(b.ngayTap).valueOf() - moment(a.ngayTap).valueOf()),
			);
			message.success('Thêm buổi tập thành công');
		}

		dongModal();
	};

	const xuLyXoa = (id: string) => {
		setDanhSachBuoiTap((duLieuCu) => duLieuCu.filter((item) => item.id !== id));
		message.success('Xóa buổi tập thành công');
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Typography.Title level={3} style={{ marginBottom: 8 }}>
					TH08 - Nhật ký tập luyện
				</Typography.Title>
				<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
					Quản lý lịch sử tập luyện theo ngày, tra cứu nhanh theo tên bài tập, loại bài tập và khoảng thời gian.
				</Typography.Paragraph>
			</div>

			<Card
				title='Danh sách buổi tập'
				extra={
					<Button type='primary' onClick={moModalThem}>
						Thêm buổi tập
					</Button>
				}
			>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<BoLocTapLuyen
						tuKhoaTimKiem={tuKhoaTimKiem}
						onThayDoiTuKhoa={setTuKhoaTimKiem}
						loaiDangLoc={loaiDangLoc}
						onThayDoiLoai={setLoaiDangLoc}
						khoangNgayTap={khoangNgayTap}
						onThayDoiKhoangNgay={setKhoangNgayTap}
					/>
					<BangBuoiTap danhSachBuoiTap={danhSachDaLoc} onSua={moModalSua} onXoa={xuLyXoa} />
				</Space>
			</Card>

			<FormBuoiTapModal
				visible={visibleModal}
				form={formBuoiTap}
				banGhiDangSua={banGhiDangSua}
				onHuy={dongModal}
				onLuu={xuLyLuu}
			/>
		</Space>
	);
};

export default NhatKyTapLuyenPage;
