import { DatePicker, Form, InputNumber, Modal } from 'antd';
import type { FormInstance } from 'antd/es/form';
import moment, { type Moment } from 'moment';
import { useEffect } from 'react';
import type { ChiSoSucKhoe } from '../../types';

export type GiaTriFormChiSoSucKhoe = {
	ngayGhiNhan: Moment;
	canNangKg: number;
	chieuCaoCm: number;
	nhipTimNghiBpm: number;
	gioNgu: number;
};

type Props = {
	visible: boolean;
	form: FormInstance<GiaTriFormChiSoSucKhoe>;
	banGhiDangSua: ChiSoSucKhoe | null;
	onHuy: () => void;
	onLuu: (giaTri: GiaTriFormChiSoSucKhoe) => void;
};

const FormChiSoSucKhoeModal = ({ visible, form, banGhiDangSua, onHuy, onLuu }: Props) => {
	useEffect(() => {
		if (!visible) {
			return;
		}

		if (banGhiDangSua) {
			form.setFieldsValue({
				ngayGhiNhan: moment(banGhiDangSua.ngayGhiNhan),
				canNangKg: banGhiDangSua.canNangKg,
				chieuCaoCm: banGhiDangSua.chieuCaoCm,
				nhipTimNghiBpm: banGhiDangSua.nhipTimNghiBpm,
				gioNgu: banGhiDangSua.gioNgu,
			});
			return;
		}

		form.resetFields();
		form.setFieldsValue({
			ngayGhiNhan: moment(),
			canNangKg: 70,
			chieuCaoCm: 170,
			nhipTimNghiBpm: 72,
			gioNgu: 7,
		});
	}, [visible, banGhiDangSua, form]);

	return (
		<Modal
			title={banGhiDangSua ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
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
					label='Ngày ghi nhận'
					name='ngayGhiNhan'
					rules={[{ required: true, message: 'Vui lòng chọn ngày ghi nhận' }]}
				>
					<DatePicker showTime format='DD/MM/YYYY HH:mm' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Cân nặng (kg)'
					name='canNangKg'
					rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
				>
					<InputNumber min={1} max={300} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Chiều cao (cm)'
					name='chieuCaoCm'
					rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
				>
					<InputNumber min={50} max={250} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Nhịp tim lúc nghỉ (bpm)'
					name='nhipTimNghiBpm'
					rules={[{ required: true, message: 'Vui lòng nhập nhịp tim lúc nghỉ' }]}
				>
					<InputNumber min={30} max={200} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item label='Giờ ngủ' name='gioNgu' rules={[{ required: true, message: 'Vui lòng nhập số giờ ngủ' }]}>
					<InputNumber min={0} max={24} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormChiSoSucKhoeModal;
