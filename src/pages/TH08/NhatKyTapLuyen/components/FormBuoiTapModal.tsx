import { DANH_SACH_LOAI_BAI_TAP, DANH_SACH_TRANG_THAI_BUOI_TAP, LOAI_BAI_TAP_MAC_DINH, TRANG_THAI_BUOI_TAP_MAC_DINH } from '@/pages/TH08/constant';
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import moment, { type Moment } from 'moment';
import { useEffect } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { BuoiTap, LoaiBaiTap, TrangThaiBuoiTap } from '../../types';

export type GiaTriFormBuoiTap = {
	ngayTap: Moment;
	tenBaiTap: string;
	loaiBaiTap: LoaiBaiTap;
	thoiLuongPhut: number;
	caloDot: number;
	ghiChu?: string;
	trangThai: TrangThaiBuoiTap;
};

type Props = {
	visible: boolean;
	form: FormInstance<GiaTriFormBuoiTap>;
	banGhiDangSua: BuoiTap | null;
	onHuy: () => void;
	onLuu: (giaTri: GiaTriFormBuoiTap) => void;
};

const FormBuoiTapModal = ({ visible, form, banGhiDangSua, onHuy, onLuu }: Props) => {
	useEffect(() => {
		if (!visible) {
			return;
		}

		if (banGhiDangSua) {
			form.setFieldsValue({
				ngayTap: moment(banGhiDangSua.ngayTap),
				tenBaiTap: banGhiDangSua.tenBaiTap,
				loaiBaiTap: banGhiDangSua.loaiBaiTap,
				thoiLuongPhut: banGhiDangSua.thoiLuongPhut,
				caloDot: banGhiDangSua.caloDot,
				ghiChu: banGhiDangSua.ghiChu,
				trangThai: banGhiDangSua.trangThai,
			});
			return;
		}

		form.resetFields();
		form.setFieldsValue({
			ngayTap: moment(),
			loaiBaiTap: LOAI_BAI_TAP_MAC_DINH,
			thoiLuongPhut: 30,
			caloDot: 250,
			trangThai: TRANG_THAI_BUOI_TAP_MAC_DINH,
		});
	}, [visible, banGhiDangSua, form]);

	return (
		<Modal
			title={banGhiDangSua ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
			visible={visible}
			okText='Lưu'
			cancelText='Hủy'
			onCancel={onHuy}
			onOk={async () => {
				const giaTri = await form.validateFields();
				onLuu(giaTri);
			}}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Ngày tập'
					name='ngayTap'
					rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}
				>
					<DatePicker showTime format='DD/MM/YYYY HH:mm' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Tên bài tập'
					name='tenBaiTap'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên bài tập' },
						{ whitespace: true, message: 'Tên bài tập không được để trống' },
					]}
				>
					<Input placeholder='Ví dụ: Chạy bộ buổi sáng' />
				</Form.Item>
				<Form.Item
					label='Loại bài tập'
					name='loaiBaiTap'
					rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}
				>
					<Select placeholder='Chọn loại bài tập'>
						{DANH_SACH_LOAI_BAI_TAP.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Thời lượng (phút)'
					name='thoiLuongPhut'
					rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
				>
					<InputNumber min={1} max={300} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item label='Calo đốt' name='caloDot' rules={[{ required: true, message: 'Vui lòng nhập calo đốt' }]}>
					<InputNumber min={1} max={5000} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item label='Ghi chú' name='ghiChu'>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú buổi tập' />
				</Form.Item>
				<Form.Item
					label='Trạng thái'
					name='trangThai'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
				>
					<Select>
						{DANH_SACH_TRANG_THAI_BUOI_TAP.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormBuoiTapModal;
