import { Button, Card, Form, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { locThuVienTheoBoLoc, taoId } from '../helpers';
import useDuLieuTheDuc from '../useDuLieuTheDuc';
import type { BaiTapThuVien, MucDoKho, NhomCo } from '../types';
import BoLocThuVienBaiTap from './components/BoLocThuVienBaiTap';
import ChiTietBaiTapModal from './components/ChiTietBaiTapModal';
import FormBaiTapModal, { type GiaTriFormBaiTap } from './components/FormBaiTapModal';
import LuoiThuVienBaiTap from './components/LuoiThuVienBaiTap';

const ThuVienBaiTapPage = () => {
	const [formBaiTap] = Form.useForm<GiaTriFormBaiTap>();
	const { danhSachBaiTap, setDanhSachBaiTap } = useDuLieuTheDuc();
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [nhomCoDangLoc, setNhomCoDangLoc] = useState<NhomCo | undefined>();
	const [mucDoKhoDangLoc, setMucDoKhoDangLoc] = useState<MucDoKho | undefined>();
	const [visibleModalChiTiet, setVisibleModalChiTiet] = useState(false);
	const [visibleModalForm, setVisibleModalForm] = useState(false);
	const [baiTapDangXem, setBaiTapDangXem] = useState<BaiTapThuVien | null>(null);
	const [banGhiDangSua, setBanGhiDangSua] = useState<BaiTapThuVien | null>(null);

	const danhSachDaLoc = useMemo(
		() => locThuVienTheoBoLoc(danhSachBaiTap, tuKhoaTimKiem, nhomCoDangLoc, mucDoKhoDangLoc),
		[danhSachBaiTap, mucDoKhoDangLoc, nhomCoDangLoc, tuKhoaTimKiem],
	);

	const moModalChiTiet = (baiTap: BaiTapThuVien) => {
		setBaiTapDangXem(baiTap);
		setVisibleModalChiTiet(true);
	};

	const dongModalChiTiet = () => {
		setVisibleModalChiTiet(false);
		setBaiTapDangXem(null);
	};

	const moModalThem = () => {
		setBanGhiDangSua(null);
		setVisibleModalForm(true);
	};

	const moModalSua = (baiTap: BaiTapThuVien) => {
		setBanGhiDangSua(baiTap);
		setVisibleModalForm(true);
	};

	const dongModalForm = () => {
		setVisibleModalForm(false);
		setBanGhiDangSua(null);
		formBaiTap.resetFields();
	};

	const xuLyLuu = (giaTri: GiaTriFormBaiTap) => {
		const duLieuLuu: BaiTapThuVien = {
			id: banGhiDangSua?.id || taoId('bai-tap'),
			tenBaiTap: giaTri.tenBaiTap.trim(),
			nhomCo: giaTri.nhomCo,
			mucDoKho: giaTri.mucDoKho,
			moTaNgan: giaTri.moTaNgan.trim(),
			caloTrungBinhMoiGio: giaTri.caloTrungBinhMoiGio,
			huongDanChiTiet: giaTri.huongDanChiTiet.trim(),
		};

		if (banGhiDangSua) {
			setDanhSachBaiTap((duLieuCu) => duLieuCu.map((item) => (item.id === duLieuLuu.id ? duLieuLuu : item)));
			message.success('Cập nhật bài tập thành công');
		} else {
			setDanhSachBaiTap((duLieuCu) => [duLieuLuu, ...duLieuCu]);
			message.success('Thêm bài tập thành công');
		}

		dongModalForm();
	};

	const xuLyXoa = (id: string) => {
		setDanhSachBaiTap((duLieuCu) => duLieuCu.filter((item) => item.id !== id));
		if (baiTapDangXem?.id === id) {
			dongModalChiTiet();
		}
		message.success('Xóa bài tập thành công');
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Typography.Title level={3} style={{ marginBottom: 8 }}>
					TH08 - Thư viện bài tập
				</Typography.Title>
				<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
					Quản lý danh sách bài tập theo nhóm cơ, mức độ khó và xem nhanh hướng dẫn thực hiện chi tiết bằng modal.
				</Typography.Paragraph>
			</div>

			<Card
				title='Danh sách bài tập'
				extra={
					<Button type='primary' onClick={moModalThem}>
						Thêm bài tập
					</Button>
				}
			>
				<Space direction='vertical' size='large' style={{ width: '100%' }}>
					<BoLocThuVienBaiTap
						tuKhoaTimKiem={tuKhoaTimKiem}
						onThayDoiTuKhoa={setTuKhoaTimKiem}
						nhomCoDangLoc={nhomCoDangLoc}
						onThayDoiNhomCo={setNhomCoDangLoc}
						mucDoKhoDangLoc={mucDoKhoDangLoc}
						onThayDoiMucDoKho={setMucDoKhoDangLoc}
					/>
					<LuoiThuVienBaiTap
						danhSachBaiTap={danhSachDaLoc}
						onXemChiTiet={moModalChiTiet}
						onSua={moModalSua}
						onXoa={xuLyXoa}
					/>
				</Space>
			</Card>

			<ChiTietBaiTapModal visible={visibleModalChiTiet} baiTapDangXem={baiTapDangXem} onDong={dongModalChiTiet} />
			<FormBaiTapModal
				visible={visibleModalForm}
				form={formBaiTap}
				banGhiDangSua={banGhiDangSua}
				onHuy={dongModalForm}
				onLuu={xuLyLuu}
			/>
		</Space>
	);
};

export default ThuVienBaiTapPage;
