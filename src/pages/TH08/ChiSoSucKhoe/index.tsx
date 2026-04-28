import { Button, Card, Form, Space, Typography, message } from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { taoId } from '../helpers';
import useDuLieuTheDuc from '../useDuLieuTheDuc';
import type { ChiSoSucKhoe } from '../types';
import BangChiSoSucKhoe from './components/BangChiSoSucKhoe';
import FormChiSoSucKhoeModal, { type GiaTriFormChiSoSucKhoe } from './components/FormChiSoSucKhoeModal';

const ChiSoSucKhoePage = () => {
	const [formChiSo] = Form.useForm<GiaTriFormChiSoSucKhoe>();
	const { danhSachChiSo, setDanhSachChiSo } = useDuLieuTheDuc();
	const [visibleModal, setVisibleModal] = useState(false);
	const [banGhiDangSua, setBanGhiDangSua] = useState<ChiSoSucKhoe | null>(null);

	const danhSachSapXep = useMemo(
		() => [...danhSachChiSo].sort((a, b) => moment(b.ngayGhiNhan).valueOf() - moment(a.ngayGhiNhan).valueOf()),
		[danhSachChiSo],
	);

	const moModalThem = () => {
		setBanGhiDangSua(null);
		setVisibleModal(true);
	};

	const moModalSua = (banGhi: ChiSoSucKhoe) => {
		setBanGhiDangSua(banGhi);
		setVisibleModal(true);
	};

	const dongModal = () => {
		setVisibleModal(false);
		setBanGhiDangSua(null);
		formChiSo.resetFields();
	};

	const xuLyLuu = (giaTri: GiaTriFormChiSoSucKhoe) => {
		const duLieuLuu: ChiSoSucKhoe = {
			id: banGhiDangSua?.id || taoId('chi-so'),
			ngayGhiNhan: giaTri.ngayGhiNhan.toISOString(),
			canNangKg: giaTri.canNangKg,
			chieuCaoCm: giaTri.chieuCaoCm,
			nhipTimNghiBpm: giaTri.nhipTimNghiBpm,
			gioNgu: giaTri.gioNgu,
		};

		if (banGhiDangSua) {
			setDanhSachChiSo((duLieuCu) => duLieuCu.map((item) => (item.id === duLieuLuu.id ? duLieuLuu : item)));
			message.success('Cập nhật chỉ số sức khỏe thành công');
		} else {
			setDanhSachChiSo((duLieuCu) =>
				[duLieuLuu, ...duLieuCu].sort((a, b) => moment(b.ngayGhiNhan).valueOf() - moment(a.ngayGhiNhan).valueOf()),
			);
			message.success('Thêm chỉ số sức khỏe thành công');
		}

		dongModal();
	};

	const xuLyXoa = (id: string) => {
		setDanhSachChiSo((duLieuCu) => duLieuCu.filter((item) => item.id !== id));
		message.success('Xóa chỉ số sức khỏe thành công');
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Typography.Title level={3} style={{ marginBottom: 8 }}>
					TH08 - Nhật ký chỉ số sức khỏe
				</Typography.Title>
				<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
					BMI được tự động tính theo công thức: cân nặng (kg) / (chiều cao (m))² và gắn màu theo đúng phân loại đề bài.
				</Typography.Paragraph>
			</div>

			<Card
				title='Bảng theo dõi chỉ số sức khỏe'
				extra={
					<Button type='primary' onClick={moModalThem}>
						Thêm chỉ số
					</Button>
				}
			>
				<BangChiSoSucKhoe danhSachChiSo={danhSachSapXep} onSua={moModalSua} onXoa={xuLyXoa} />
			</Card>

			<FormChiSoSucKhoeModal
				visible={visibleModal}
				form={formChiSo}
				banGhiDangSua={banGhiDangSua}
				onHuy={dongModal}
				onLuu={xuLyLuu}
			/>
		</Space>
	);
};

export default ChiSoSucKhoePage;
