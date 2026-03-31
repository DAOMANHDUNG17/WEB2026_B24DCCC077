import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';

type SanPham = {
	id: number;
	ten: string;
	gia: number;
	soLuong: number;
};

type DuLieuForm = {
	ten: string;
	gia: number;
	soLuong: number;
};

const DU_LIEU_MAU: SanPham[] = [
	{ id: 1, ten: 'Laptop Dell XPS 13', gia: 25000000, soLuong: 10 },
	{ id: 2, ten: 'iPhone 15 Pro Max', gia: 30000000, soLuong: 15 },
	{ id: 3, ten: 'Samsung Galaxy S24', gia: 22000000, soLuong: 20 },
	{ id: 4, ten: 'iPad Air M2', gia: 18000000, soLuong: 12 },
	{ id: 5, ten: 'MacBook Air M3', gia: 28000000, soLuong: 8 },
];

const dinhDangTienVND = (gia: number) => gia.toLocaleString('vi-VN');

const QuanLySanPham = () => {
	const [formSanPham] = Form.useForm<DuLieuForm>();
	const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>(DU_LIEU_MAU);
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [moModalThem, setMoModalThem] = useState(false);

	const danhSachDaLoc = useMemo(() => {
		const tuKhoa = tuKhoaTimKiem.trim().toLowerCase();
		if (!tuKhoa) return danhSachSanPham;
		return danhSachSanPham.filter((sanPham) => sanPham.ten.toLowerCase().includes(tuKhoa));
	}, [danhSachSanPham, tuKhoaTimKiem]);

	const cotBang = [
		{
			title: 'STT',
			key: 'stt',
			align: 'center' as const,
			render: (_giaTri: unknown, _banGhi: SanPham, chiSo: number) => chiSo + 1,
			width: 80,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Giá',
			dataIndex: 'gia',
			key: 'gia',
			align: 'right' as const,
			render: (gia: number) => `${dinhDangTienVND(gia)} đ`,
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			key: 'soLuong',
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			align: 'center' as const,
			render: (banGhi: SanPham) => (
				<Popconfirm
					title={`Bạn có chắc muốn xóa "${banGhi.ten}"?`}
					okText='Xóa'
					cancelText='Hủy'
					onConfirm={() => {
						setDanhSachSanPham((duLieuCu) => duLieuCu.filter((sanPham) => sanPham.id !== banGhi.id));
						message.success('Xóa sản phẩm thành công');
					}}
				>
					<Button danger size='small'>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	const moFormThem = () => {
		formSanPham.resetFields();
		setMoModalThem(true);
	};

	const xuLyThemSanPham = async () => {
		const giaTri = await formSanPham.validateFields();
		const idMoi =
			danhSachSanPham.length > 0 ? Math.max(...danhSachSanPham.map((sanPham) => sanPham.id)) + 1 : 1;
		const sanPhamMoi: SanPham = {
			id: idMoi,
			ten: giaTri.ten.trim(),
			gia: giaTri.gia,
			soLuong: giaTri.soLuong,
		};
		setDanhSachSanPham((duLieuCu) => [...duLieuCu, sanPhamMoi]);
		setMoModalThem(false);
		formSanPham.resetFields();
		message.success('Thêm sản phẩm thành công');
	};

	return (
		<div>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Typography.Title level={3} style={{ marginBottom: 0 }}>
					BT01 - Quản lý sản phẩm
				</Typography.Title>

				<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
					<Input.Search
						placeholder='Tìm theo tên sản phẩm...'
						allowClear
						style={{ width: 320 }}
						value={tuKhoaTimKiem}
						onChange={(suKien) => setTuKhoaTimKiem(suKien.target.value)}
					/>
					<Button type='primary' onClick={moFormThem}>
						Thêm sản phẩm
					</Button>
				</Space>

				<Table<SanPham> rowKey='id' columns={cotBang} dataSource={danhSachDaLoc} pagination={{ pageSize: 8 }} />
			</Space>

			<Modal
				title='Thêm sản phẩm mới'
				visible={moModalThem}
				okText='Lưu'
				cancelText='Hủy'
				onOk={xuLyThemSanPham}
				onCancel={() => setMoModalThem(false)}
				destroyOnClose
			>
				<Form form={formSanPham} layout='vertical'>
					<Form.Item
						label='Tên sản phẩm'
						name='ten'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên sản phẩm' },
							{ whitespace: true, message: 'Tên sản phẩm không được để trống' },
						]}
					>
						<Input placeholder='Nhập tên sản phẩm' />
					</Form.Item>

					<Form.Item
						label='Giá'
						name='gia'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá' },
							{
								validator: async (_quyTac, giaTri) => {
									if (typeof giaTri !== 'number' || giaTri <= 0) {
										throw new Error('Giá phải là số dương');
									}
								},
							},
						]}
					>
						<InputNumber style={{ width: '100%' }} min={1} placeholder='Nhập giá sản phẩm' />
					</Form.Item>

					<Form.Item
						label='Số lượng'
						name='soLuong'
						rules={[
							{ required: true, message: 'Vui lòng nhập số lượng' },
							{
								validator: async (_quyTac, giaTri) => {
									if (!Number.isInteger(giaTri) || giaTri <= 0) {
										throw new Error('Số lượng phải là số nguyên dương');
									}
								},
							},
						]}
					>
						<InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder='Nhập số lượng' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLySanPham;
