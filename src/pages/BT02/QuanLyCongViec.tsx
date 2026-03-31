import { Button, DatePicker, Form, Input, Modal, Popconfirm, Segmented, Select, Space, Table, Tag, Typography, message } from 'antd';
import moment, { type Moment } from 'moment';
import { useMemo, useState } from 'react';

type MucUuTien = 'Thap' | 'TrungBinh' | 'Cao';
type TrangThai = 'ChuaXong' | 'DaXong';

type CongViec = {
	id: number;
	tenCongViec: string;
	moTa?: string;
	mucUuTien: MucUuTien;
	hanHoanThanh: string;
	trangThai: TrangThai;
};

type GiaTriForm = {
	tenCongViec: string;
	moTa?: string;
	mucUuTien: MucUuTien;
	hanHoanThanh: Moment;
};

const DU_LIEU_MAU: CongViec[] = [
	{ id: 1, tenCongViec: 'Hoàn thành giao diện trang chủ', mucUuTien: 'Cao', hanHoanThanh: moment().add(1, 'day').toISOString(), trangThai: 'ChuaXong' },
	{ id: 2, tenCongViec: 'Viết tài liệu hướng dẫn sử dụng', mucUuTien: 'TrungBinh', hanHoanThanh: moment().add(3, 'day').toISOString(), trangThai: 'ChuaXong' },
	{ id: 3, tenCongViec: 'Kiểm tra lỗi trên mobile', mucUuTien: 'Cao', hanHoanThanh: moment().add(2, 'day').toISOString(), trangThai: 'DaXong' },
	{ id: 4, tenCongViec: 'Tối ưu hiệu năng bảng', mucUuTien: 'Thap', hanHoanThanh: moment().add(5, 'day').toISOString(), trangThai: 'ChuaXong' },
	{ id: 5, tenCongViec: 'Đồng bộ dữ liệu với API', mucUuTien: 'TrungBinh', hanHoanThanh: moment().add(4, 'day').toISOString(), trangThai: 'DaXong' },
];

const mauUuTien: Record<MucUuTien, string> = {
	Thap: 'default',
	TrungBinh: 'processing',
	Cao: 'error',
};

const QuanLyCongViec = () => {
	const [formCongViec] = Form.useForm<GiaTriForm>();
	const [danhSachCongViec, setDanhSachCongViec] = useState<CongViec[]>(DU_LIEU_MAU);
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [locTrangThai, setLocTrangThai] = useState<'TatCa' | TrangThai>('TatCa');
	const [moModalThem, setMoModalThem] = useState(false);

	const danhSachDaLoc = useMemo(() => {
		const tuKhoa = tuKhoaTimKiem.trim().toLowerCase();
		return danhSachCongViec.filter((congViec) => {
			const dungTuKhoa =
				!tuKhoa ||
				congViec.tenCongViec.toLowerCase().includes(tuKhoa) ||
				(congViec.moTa || '').toLowerCase().includes(tuKhoa);
			const dungTrangThai = locTrangThai === 'TatCa' ? true : congViec.trangThai === locTrangThai;
			return dungTuKhoa && dungTrangThai;
		});
	}, [danhSachCongViec, tuKhoaTimKiem, locTrangThai]);

	const cotBang = [
		{
			title: 'STT',
			key: 'stt',
			align: 'center' as const,
			width: 70,
			render: (_giaTri: unknown, _banGhi: CongViec, chiSo: number) => chiSo + 1,
		},
		{
			title: 'Tên công việc',
			dataIndex: 'tenCongViec',
			key: 'tenCongViec',
		},
		{
			title: 'Mức ưu tiên',
			key: 'mucUuTien',
			align: 'center' as const,
			render: (banGhi: CongViec) => <Tag color={mauUuTien[banGhi.mucUuTien]}>{banGhi.mucUuTien}</Tag>,
		},
		{
			title: 'Hạn hoàn thành',
			key: 'hanHoanThanh',
			align: 'center' as const,
			render: (banGhi: CongViec) => moment(banGhi.hanHoanThanh).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			key: 'trangThai',
			align: 'center' as const,
			render: (banGhi: CongViec) =>
				banGhi.trangThai === 'DaXong' ? <Tag color='success'>Đã xong</Tag> : <Tag color='warning'>Chưa xong</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			align: 'center' as const,
			render: (banGhi: CongViec) => (
				<Space>
					<Button
						size='small'
						type='link'
						onClick={() => {
							setDanhSachCongViec((duLieuCu) =>
								duLieuCu.map((congViec) =>
									congViec.id === banGhi.id
										? { ...congViec, trangThai: congViec.trangThai === 'DaXong' ? 'ChuaXong' : 'DaXong' }
										: congViec,
								),
							);
						}}
					>
						Đổi trạng thái
					</Button>
					<Popconfirm
						title={`Bạn có chắc muốn xóa "${banGhi.tenCongViec}"?`}
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => {
							setDanhSachCongViec((duLieuCu) => duLieuCu.filter((congViec) => congViec.id !== banGhi.id));
							message.success('Xóa công việc thành công');
						}}
					>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const moFormThem = () => {
		formCongViec.resetFields();
		formCongViec.setFieldsValue({ mucUuTien: 'TrungBinh', hanHoanThanh: moment().add(1, 'day') });
		setMoModalThem(true);
	};

	const xuLyThemCongViec = async () => {
		const giaTri = await formCongViec.validateFields();
		const idMoi = danhSachCongViec.length > 0 ? Math.max(...danhSachCongViec.map((congViec) => congViec.id)) + 1 : 1;
		setDanhSachCongViec((duLieuCu) => [
			...duLieuCu,
			{
				id: idMoi,
				tenCongViec: giaTri.tenCongViec.trim(),
				moTa: giaTri.moTa?.trim(),
				mucUuTien: giaTri.mucUuTien,
				hanHoanThanh: giaTri.hanHoanThanh.toISOString(),
				trangThai: 'ChuaXong',
			},
		]);
		setMoModalThem(false);
		formCongViec.resetFields();
		message.success('Thêm công việc thành công');
	};

	return (
		<Space direction='vertical' size='middle' style={{ width: '100%' }}>
			<Typography.Title level={3} style={{ marginBottom: 0 }}>
				BT02 - Quản lý công việc
			</Typography.Title>

			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<Space wrap>
					<Input.Search
						allowClear
						placeholder='Tìm theo tên/mô tả công việc...'
						style={{ width: 320 }}
						value={tuKhoaTimKiem}
						onChange={(suKien) => setTuKhoaTimKiem(suKien.target.value)}
					/>
					<Segmented
						value={locTrangThai}
						options={[
							{ label: 'Tất cả', value: 'TatCa' },
							{ label: 'Chưa xong', value: 'ChuaXong' },
							{ label: 'Đã xong', value: 'DaXong' },
						]}
						onChange={(giaTri) => setLocTrangThai(giaTri as 'TatCa' | TrangThai)}
					/>
				</Space>
				<Button type='primary' onClick={moFormThem}>
					Thêm công việc
				</Button>
			</Space>

			<Table<CongViec> rowKey='id' columns={cotBang} dataSource={danhSachDaLoc} pagination={{ pageSize: 8 }} />

			<Modal
				title='Thêm công việc mới'
				visible={moModalThem}
				okText='Lưu'
				cancelText='Hủy'
				onOk={xuLyThemCongViec}
				onCancel={() => setMoModalThem(false)}
				destroyOnClose
			>
				<Form form={formCongViec} layout='vertical'>
					<Form.Item
						label='Tên công việc'
						name='tenCongViec'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên công việc' },
							{ whitespace: true, message: 'Tên công việc không được để trống' },
						]}
					>
						<Input placeholder='Nhập tên công việc' />
					</Form.Item>
					<Form.Item label='Mô tả' name='moTa'>
						<Input.TextArea rows={3} placeholder='Nhập mô tả (nếu có)' />
					</Form.Item>
					<Form.Item label='Mức ưu tiên' name='mucUuTien' rules={[{ required: true, message: 'Vui lòng chọn mức ưu tiên' }]}>
						<Select>
							<Select.Option value='Thap'>Thấp</Select.Option>
							<Select.Option value='TrungBinh'>Trung bình</Select.Option>
							<Select.Option value='Cao'>Cao</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label='Hạn hoàn thành' name='hanHoanThanh' rules={[{ required: true, message: 'Vui lòng chọn hạn hoàn thành' }]}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default QuanLyCongViec;
