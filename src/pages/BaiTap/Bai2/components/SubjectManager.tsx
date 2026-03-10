import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import type { Subject } from '../types';

type Props = {
	subjects: Subject[];
	sessionCountBySubject: Record<string, number>;
	onCreate: (name: string) => void;
	onUpdate: (id: string, name: string) => void;
	onDelete: (id: string) => void;
};

type SubjectFormValues = {
	name: string;
};

const SubjectManager = ({ subjects, sessionCountBySubject, onCreate, onUpdate, onDelete }: Props) => {
	const [form] = Form.useForm<SubjectFormValues>();
	const [open, setOpen] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | undefined>();

	const columns = useMemo(
		() => [
			{
				title: 'Tên môn học',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: 'Số buổi đã học',
				key: 'sessions',
				render: (record: Subject) => sessionCountBySubject[record.id] || 0,
			},
			{
				title: 'Thao tác',
				key: 'action',
				render: (record: Subject) => (
					<Space>
						<Button
							size='small'
							onClick={() => {
								setEditingSubject(record);
								form.setFieldsValue({ name: record.name });
								setOpen(true);
							}}
						>
							Sửa
						</Button>
						<Popconfirm title='Bạn chắc chắn muốn xóa môn này?' onConfirm={() => onDelete(record.id)}>
							<Button size='small' danger>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[form, onDelete, sessionCountBySubject],
	);

	const handleSubmit = async () => {
		const values = await form.validateFields();
		if (editingSubject) {
			onUpdate(editingSubject.id, values.name.trim());
		} else {
			onCreate(values.name.trim());
		}
		form.resetFields();
		setEditingSubject(undefined);
		setOpen(false);
	};

	return (
		<Card
			title='1. Quản lý danh mục môn học'
			extra={
				<Button
					type='primary'
					onClick={() => {
						form.resetFields();
						setEditingSubject(undefined);
						setOpen(true);
					}}
				>
					Thêm môn học
				</Button>
			}
		>
			<Table rowKey='id' dataSource={subjects} columns={columns} pagination={false} />
			<Modal
				title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
				visible={open}
				onOk={handleSubmit}
				onCancel={() => {
					setOpen(false);
					setEditingSubject(undefined);
				}}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên môn học'
						name='name'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên môn học' },
							{ max: 100, message: 'Tên môn không quá 100 ký tự' },
						]}
					>
						<Input placeholder='Ví dụ: Toán rời rạc' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default SubjectManager;

