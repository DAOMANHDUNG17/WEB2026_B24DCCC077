import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { KhoiKienThuc } from '../types';

type Props = {
	tieuDe: string;
	chuaCo: string;
	danhSachKhoiKienThuc: KhoiKienThuc[];
	onCreate: (ten: string, ghiChu?: string) => boolean;
	onUpdate: (id: string, ten: string, ghiChu?: string) => boolean;
	onDelete: (id: string) => void;
};

type KhoiForm = {
	ten: string;
	ghiChu?: string;
};

const KhoiKienThucSection = ({ tieuDe, chuaCo, danhSachKhoiKienThuc, onCreate, onUpdate, onDelete }: Props) => {
	const [form] = Form.useForm<KhoiForm>();
	const [mo, setMo] = useState(false);
	const [dangSua, setDangSua] = useState<KhoiKienThuc | null>(null);

	const columns = useMemo<ColumnsType<KhoiKienThuc>>(
		() => [
			{ title: 'Tên khối', dataIndex: 'ten', key: 'ten' },
			{ title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu', render: (value) => value || '-' },
			{
				title: 'Thao tác',
				key: 'action',
				render: (record) => (
					<Space>
						<Button
							size='small'
							onClick={() => {
								setDangSua(record);
								form.setFieldsValue(record);
								setMo(true);
							}}
						>
							Sửa
						</Button>
					<Popconfirm title='Xóa khối này?' onConfirm={() => onDelete(record.id)}>
							<Button danger size='small'>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[form, onDelete],
	);

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const ten = values.ten.trim();
		const ghiChu = values.ghiChu?.trim();
		const thanhCong = dangSua ? onUpdate(dangSua.id, ten, ghiChu) : onCreate(ten, ghiChu);
		if (!thanhCong) return;
		form.resetFields();
		setDangSua(null);
		setMo(false);
	};

	return (
		<Card
			title={tieuDe}
			extra={
				<Button
					type='primary'
					onClick={() => {
						setDangSua(null);
						form.resetFields();
						setMo(true);
					}}
				>
					Thêm khối
				</Button>
			}
		>
			<Table rowKey='id' dataSource={danhSachKhoiKienThuc} columns={columns} pagination={false} locale={{ emptyText: chuaCo }} />
			<Modal
				visible={mo}
				title={dangSua ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
				onOk={handleSubmit}
				onCancel={() => {
					setMo(false);
					setDangSua(null);
				}}
				okText='Luu'
				cancelText='Huy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên khối'
						name='ten'
						rules={[{ required: true, message: 'Nhập tên khối' }, { max: 100, message: 'Tối đa 100 ký tự' }]}
					>
						<Input placeholder='VD: Tổng quan' />
					</Form.Item>
					<Form.Item label='Ghi chú' name='ghiChu'>
						<Input.TextArea rows={3} placeholder='Mô tả ngắn' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default KhoiKienThucSection;
