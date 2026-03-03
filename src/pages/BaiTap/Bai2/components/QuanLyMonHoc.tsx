import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import type { Subject } from '../types';

type ThuocTinh = {
	danhSachMonHoc: Subject[];
	soBuoiTheoMonHoc: Record<string, number>;
	taoMonHoc: (ten: string) => void;
	capNhatMonHoc: (id: string, ten: string) => void;
	xoaMonHoc: (id: string) => void;
};

type GiaTriFormMonHoc = {
	ten: string;
};

const QuanLyMonHoc = ({ danhSachMonHoc, soBuoiTheoMonHoc, taoMonHoc, capNhatMonHoc, xoaMonHoc }: ThuocTinh) => {
	const [formMonHoc] = Form.useForm<GiaTriFormMonHoc>();
	const [moModal, setMoModal] = useState(false);
	const [monHocDangSua, setMonHocDangSua] = useState<Subject | undefined>();

	const cotBang = useMemo(
		() => [
			{
				title: 'Tên môn học',
				dataIndex: 'name',
				key: 'name',
				align: 'center' as const,
			},
			{
				title: 'Số buổi đã học',
				key: 'sessions',
				align: 'center' as const,
				render: (banGhi: Subject) => soBuoiTheoMonHoc[banGhi.id] || 0,
			},
			{
				title: 'Thao tác',
				key: 'action',
				align: 'center' as const,
				render: (banGhi: Subject) => (
					<Space>
						<Button
							size='small'
							onClick={() => {
								setMonHocDangSua(banGhi);
								formMonHoc.setFieldsValue({ ten: banGhi.name });
								setMoModal(true);
							}}
						>
							Sửa
						</Button>
						<Popconfirm title='Bạn chắc chắn muốn xóa môn này?' onConfirm={() => xoaMonHoc(banGhi.id)}>
							<Button size='small' danger>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[formMonHoc, soBuoiTheoMonHoc, xoaMonHoc],
	);

	const xuLyLuu = async () => {
		const giaTri = await formMonHoc.validateFields();
		if (monHocDangSua) {
			capNhatMonHoc(monHocDangSua.id, giaTri.ten.trim());
		} else {
			taoMonHoc(giaTri.ten.trim());
		}
		formMonHoc.resetFields();
		setMonHocDangSua(undefined);
		setMoModal(false);
	};

	return (
		<Card
			title='1. Quản lý danh mục môn học'
			extra={
				<Button
					type='primary'
					onClick={() => {
						formMonHoc.resetFields();
						setMonHocDangSua(undefined);
						setMoModal(true);
					}}
				>
					Thêm môn học
				</Button>
			}
		>
			<Table rowKey='id' dataSource={danhSachMonHoc} columns={cotBang} pagination={false} />
			<Modal
				title={monHocDangSua ? 'Sửa môn học' : 'Thêm môn học'}
				visible={moModal}
				onOk={xuLyLuu}
				onCancel={() => {
					setMoModal(false);
					setMonHocDangSua(undefined);
				}}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={formMonHoc} layout='vertical'>
					<Form.Item
						label='Tên môn học'
						name='ten'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên môn học' },
							{ max: 100, message: 'Tên môn không quá 100 ký tự' },
						]}
					>
						<Input placeholder='Ví dụ: Toán cao cấp' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyMonHoc;

