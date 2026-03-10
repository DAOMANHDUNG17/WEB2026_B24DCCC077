import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { MonHoc } from '../types';

type Props = {
	tieuDe: string;
	chuaCo: string;
	danhSachMonHoc: MonHoc[];
	onCreate: (maMon: string, tenMon: string, soTinChi: number) => boolean;
	onUpdate: (id: string, maMon: string, tenMon: string, soTinChi: number) => boolean;
	onDelete: (id: string) => void;
};

type MonForm = {
	maMon: string;
	tenMon: string;
	soTinChi: number;
};

const MonHocSection = ({ tieuDe, chuaCo, danhSachMonHoc, onCreate, onUpdate, onDelete }: Props) => {
	const [form] = Form.useForm<MonForm>();
	const [mo, setMo] = useState(false);
	const [dangSua, setDangSua] = useState<MonHoc | null>(null);

	const columns = useMemo<ColumnsType<MonHoc>>(
		() => [
			{ title: 'Mã môn', dataIndex: 'maMon', key: 'maMon' },
			{ title: 'Tên môn', dataIndex: 'tenMon', key: 'tenMon' },
			{ title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', align: 'center' },
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
					<Popconfirm title='Xóa môn này?' onConfirm={() => onDelete(record.id)}>
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
		const maMon = values.maMon.trim();
		const tenMon = values.tenMon.trim();
		const thanhCong = dangSua
			? onUpdate(dangSua.id, maMon, tenMon, values.soTinChi)
			: onCreate(maMon, tenMon, values.soTinChi);
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
					Thêm môn
				</Button>
			}
		>
			<Table rowKey='id' dataSource={danhSachMonHoc} columns={columns} pagination={false} locale={{ emptyText: chuaCo }} />
			<Modal
				visible={mo}
				title={dangSua ? 'Sửa môn học' : 'Thêm môn học'}
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
						label='Mã môn'
						name='maMon'
						rules={[{ required: true, message: 'Nhập mã môn' }, { max: 20, message: 'Tối đa 20 ký tự' }]}
					>
						<Input placeholder='VD: IT001' />
					</Form.Item>
					<Form.Item
						label='Tên môn'
						name='tenMon'
						rules={[{ required: true, message: 'Nhập tên môn' }, { max: 100, message: 'Tối đa 100 ký tự' }]}
					>
						<Input placeholder='VD: Lập trình cơ bản' />
					</Form.Item>
					<Form.Item
						label='Số tín chỉ'
						name='soTinChi'
						rules={[{ required: true, message: 'Nhập số tín chỉ' }]}
					>
						<InputNumber min={1} max={10} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default MonHocSection;
