import {
	DANH_SACH_MUC_DO_KHO,
	DANH_SACH_NHOM_CO,
	MUC_DO_KHO_MAC_DINH,
	NHOM_CO_MAC_DINH,
} from '@/pages/TH08/constant';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useEffect } from 'react';
import type { BaiTapThuVien, MucDoKho, NhomCo } from '../../types';

export type GiaTriFormBaiTap = {
	tenBaiTap: string;
	nhomCo: NhomCo;
	mucDoKho: MucDoKho;
	moTaNgan: string;
	caloTrungBinhMoiGio: number;
	huongDanChiTiet: string;
};

type Props = {
	visible: boolean;
	form: FormInstance<GiaTriFormBaiTap>;
	banGhiDangSua: BaiTapThuVien | null;
	onHuy: () => void;
	onLuu: (giaTri: GiaTriFormBaiTap) => void;
};

const FormBaiTapModal = ({ visible, form, banGhiDangSua, onHuy, onLuu }: Props) => {
	useEffect(() => {
		if (!visible) {
			return;
		}

		if (banGhiDangSua) {
			form.setFieldsValue({
				tenBaiTap: banGhiDangSua.tenBaiTap,
				nhomCo: banGhiDangSua.nhomCo,
				mucDoKho: banGhiDangSua.mucDoKho,
				moTaNgan: banGhiDangSua.moTaNgan,
				caloTrungBinhMoiGio: banGhiDangSua.caloTrungBinhMoiGio,
				huongDanChiTiet: banGhiDangSua.huongDanChiTiet,
			});
			return;
		}

		form.resetFields();
		form.setFieldsValue({
			nhomCo: NHOM_CO_MAC_DINH,
			mucDoKho: MUC_DO_KHO_MAC_DINH,
			caloTrungBinhMoiGio: 300,
		});
	}, [visible, banGhiDangSua, form]);

	return (
		<Modal
			title={banGhiDangSua ? 'Sửa bài tập' : 'Thêm bài tập mới'}
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
					label='Tên bài tập'
					name='tenBaiTap'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên bài tập' },
						{ whitespace: true, message: 'Tên bài tập không được để trống' },
					]}
				>
					<Input placeholder='Ví dụ: Pull Up' />
				</Form.Item>
				<Form.Item label='Nhóm cơ tác động' name='nhomCo' rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
					<Select>
						{DANH_SACH_NHOM_CO.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Mức độ khó' name='mucDoKho' rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}>
					<Select>
						{DANH_SACH_MUC_DO_KHO.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Mô tả ngắn'
					name='moTaNgan'
					rules={[
						{ required: true, message: 'Vui lòng nhập mô tả ngắn' },
						{ whitespace: true, message: 'Mô tả ngắn không được để trống' },
					]}
				>
					<Input.TextArea rows={3} placeholder='Mô tả ngắn về bài tập' />
				</Form.Item>
				<Form.Item
					label='Calo đốt trung bình/giờ'
					name='caloTrungBinhMoiGio'
					rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}
				>
					<InputNumber min={1} max={5000} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Hướng dẫn thực hiện đầy đủ'
					name='huongDanChiTiet'
					rules={[
						{ required: true, message: 'Vui lòng nhập hướng dẫn chi tiết' },
						{ whitespace: true, message: 'Hướng dẫn chi tiết không được để trống' },
					]}
				>
					<Input.TextArea rows={5} placeholder='Mỗi bước có thể xuống dòng để hiển thị rõ hơn' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormBaiTapModal;
