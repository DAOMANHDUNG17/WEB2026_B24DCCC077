import {
	DANH_SACH_LOAI_MUC_TIEU,
	DANH_SACH_TRANG_THAI_MUC_TIEU,
	LOAI_MUC_TIEU_MAC_DINH,
	TRANG_THAI_MUC_TIEU_MAC_DINH,
} from '@/pages/TH08/constant';
import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import moment, { type Moment } from 'moment';
import { useEffect } from 'react';
import type { LoaiMucTieu, MucTieu, TrangThaiMucTieu } from '../../types';

export type GiaTriFormMucTieu = {
	tenMucTieu: string;
	loaiMucTieu: LoaiMucTieu;
	giaTriMucTieu: number;
	giaTriHienTai: number;
	donVi: string;
	deadline: Moment;
	trangThai: TrangThaiMucTieu;
};

type Props = {
	visible: boolean;
	form: FormInstance<GiaTriFormMucTieu>;
	banGhiDangSua: MucTieu | null;
	onDong: () => void;
	onLuu: (giaTri: GiaTriFormMucTieu) => void;
};

const FormMucTieuDrawer = ({ visible, form, banGhiDangSua, onDong, onLuu }: Props) => {
	useEffect(() => {
		if (!visible) {
			return;
		}

		if (banGhiDangSua) {
			form.setFieldsValue({
				tenMucTieu: banGhiDangSua.tenMucTieu,
				loaiMucTieu: banGhiDangSua.loaiMucTieu,
				giaTriMucTieu: banGhiDangSua.giaTriMucTieu,
				giaTriHienTai: banGhiDangSua.giaTriHienTai,
				donVi: banGhiDangSua.donVi,
				deadline: moment(banGhiDangSua.deadline),
				trangThai: banGhiDangSua.trangThai,
			});
			return;
		}

		form.resetFields();
		form.setFieldsValue({
			loaiMucTieu: LOAI_MUC_TIEU_MAC_DINH,
			giaTriMucTieu: 10,
			giaTriHienTai: 0,
			donVi: 'kg',
			deadline: moment().add(30, 'day'),
			trangThai: TRANG_THAI_MUC_TIEU_MAC_DINH,
		});
	}, [visible, banGhiDangSua, form]);

	return (
		<Drawer
			title={banGhiDangSua ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
			width={420}
			visible={visible}
			onClose={onDong}
			destroyOnClose
			footer={
				<Space style={{ float: 'right' }}>
					<Button onClick={onDong}>Hủy</Button>
					<Button
						type='primary'
						onClick={async () => {
							const giaTri = await form.validateFields();
							onLuu(giaTri);
						}}
					>
						Lưu
					</Button>
				</Space>
			}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Tên mục tiêu'
					name='tenMucTieu'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên mục tiêu' },
						{ whitespace: true, message: 'Tên mục tiêu không được để trống' },
					]}
				>
					<Input placeholder='Ví dụ: Giảm cân về 68kg' />
				</Form.Item>
				<Form.Item
					label='Loại mục tiêu'
					name='loaiMucTieu'
					rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}
				>
					<Select>
						{DANH_SACH_LOAI_MUC_TIEU.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Giá trị mục tiêu'
					name='giaTriMucTieu'
					rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}
				>
					<InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Giá trị hiện tại'
					name='giaTriHienTai'
					rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}
				>
					<InputNumber min={0} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Đơn vị'
					name='donVi'
					rules={[
						{ required: true, message: 'Vui lòng nhập đơn vị' },
						{ whitespace: true, message: 'Đơn vị không được để trống' },
					]}
				>
					<Input placeholder='Ví dụ: kg, km, giờ' />
				</Form.Item>
				<Form.Item label='Deadline' name='deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label='Trạng thái'
					name='trangThai'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
				>
					<Select>
						{DANH_SACH_TRANG_THAI_MUC_TIEU.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default FormMucTieuDrawer;
