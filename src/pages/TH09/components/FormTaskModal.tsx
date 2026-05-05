import { DatePicker, Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import moment, { type Moment } from 'moment';
import { useEffect } from 'react';
import { DANH_SACH_MUC_DO_UU_TIEN } from '../constant';
import type { CongViecCaNhan, DuLieuTaskLuu, MucDoUuTien } from '../types';

export type GiaTriFormTask = {
	tenTask: string;
	moTa?: string;
	deadline: Moment;
	mucDoUuTien: MucDoUuTien;
	tags?: string[];
};

type FormTaskModalProps = {
	visible: boolean;
	form: FormInstance<GiaTriFormTask>;
	taskDangSua?: CongViecCaNhan | null;
	onHuy: () => void;
	onLuu: (duLieuTask: DuLieuTaskLuu) => void;
};

const FormTaskModal = ({ visible, form, taskDangSua, onHuy, onLuu }: FormTaskModalProps) => {
	useEffect(() => {
		if (!visible) {
			return;
		}

		if (taskDangSua) {
			form.setFieldsValue({
				tenTask: taskDangSua.tenTask,
				moTa: taskDangSua.moTa,
				deadline: moment(taskDangSua.deadline),
				mucDoUuTien: taskDangSua.mucDoUuTien,
				tags: taskDangSua.tags,
			});
			return;
		}

		form.setFieldsValue({
			tenTask: '',
			moTa: '',
			deadline: moment().add(1, 'day'),
			mucDoUuTien: 'trung_binh',
			tags: [],
		});
	}, [visible, taskDangSua, form]);

	const xuLyLuu = async () => {
		const giaTri = await form.validateFields();
		onLuu({
			tenTask: giaTri.tenTask.trim(),
			moTa: giaTri.moTa?.trim() || '',
			deadline: giaTri.deadline.endOf('day').toISOString(),
			mucDoUuTien: giaTri.mucDoUuTien,
			tags: giaTri.tags || [],
		});
	};

	return (
		<Modal
			destroyOnClose
			width={640}
			title={taskDangSua ? 'Chỉnh sửa task' : 'Thêm task mới'}
			visible={visible}
			okText='Lưu'
			cancelText='Hủy'
			onOk={xuLyLuu}
			onCancel={onHuy}
			afterClose={() => form.resetFields()}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Tên task'
					name='tenTask'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên task' },
						{ whitespace: true, message: 'Tên task không được để trống' },
					]}
				>
					<Input placeholder='Nhập tên task' />
				</Form.Item>
				<Form.Item label='Mô tả' name='moTa'>
					<Input.TextArea rows={4} placeholder='Nhập mô tả công việc' />
				</Form.Item>
				<Form.Item
					label='Deadline'
					name='deadline'
					rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
				>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item
					label='Mức độ ưu tiên'
					name='mucDoUuTien'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
				>
					<Select options={DANH_SACH_MUC_DO_UU_TIEN} placeholder='Chọn mức độ ưu tiên' />
				</Form.Item>
				<Form.Item label='Tag' name='tags'>
					<Select
						mode='tags'
						tokenSeparators={[',']}
						placeholder='Nhập tag và nhấn Enter'
						open={false}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormTaskModal;
