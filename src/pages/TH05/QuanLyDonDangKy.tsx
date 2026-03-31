import type { CauLacBo, DonDangKy, KetQuaXuLy, LichSuThaoTac, TrangThaiDon } from './types';
import {
	Button,
	Card,
	Descriptions,
	Form,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
	Timeline,
	Typography,
	message,
} from 'antd';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EyeOutlined,
	HistoryOutlined,
	PlusOutlined,
	EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import { useMemo, useState } from 'react';

type CheDoForm = 'them' | 'sua';

type Props = {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	lichSuThaoTac: LichSuThaoTac[];
	onSave: (donDangKy: DonDangKy, cheDo: CheDoForm) => KetQuaXuLy;
	onDelete: (id: string) => KetQuaXuLy;
	onApprove: (ids: string[]) => KetQuaXuLy;
	onReject: (ids: string[], lyDo: string) => KetQuaXuLy;
};

const cauHinhTrangThai: Record<TrangThaiDon, { color: string; text: string }> = {
	Pending: { color: 'orange', text: 'Chờ duyệt' },
	Approved: { color: 'green', text: 'Đã duyệt' },
	Rejected: { color: 'red', text: 'Đã từ chối' },
};

const QuanLyDonDangKy = ({
	danhSachCauLacBo,
	danhSachDonDangKy,
	lichSuThaoTac,
	onSave,
	onDelete,
	onApprove,
	onReject,
}: Props) => {
	const [formDonDangKy] = Form.useForm<DonDangKy>();
	const [formTuChoi] = Form.useForm<{ lyDo: string }>();
	const [tuKhoa, setTuKhoa] = useState('');
	const [locTrangThai, setLocTrangThai] = useState<'All' | TrangThaiDon>('All');
	const [locCauLacBo, setLocCauLacBo] = useState<'All' | string>('All');
	const [danhSachIdChon, setDanhSachIdChon] = useState<Key[]>([]);
	const [cheDoForm, setCheDoForm] = useState<CheDoForm>('them');
	const [banGhiDangXem, setBanGhiDangXem] = useState<DonDangKy | null>(null);
	const [banGhiDangSua, setBanGhiDangSua] = useState<DonDangKy | null>(null);
	const [hienThiModalForm, setHienThiModalForm] = useState(false);
	const [hienThiModalChiTiet, setHienThiModalChiTiet] = useState(false);
	const [hienThiModalTuChoi, setHienThiModalTuChoi] = useState(false);
	const [hienThiModalLichSu, setHienThiModalLichSu] = useState(false);
	const [mucTieuTuChoi, setMucTieuTuChoi] = useState<{ ids: string[]; title: string }>({ ids: [], title: '' });

	const tenCauLacBoMap = useMemo(() => {
		return danhSachCauLacBo.reduce<Record<string, string>>((acc, item) => {
			acc[item.id] = item.tenCauLacBo;
			return acc;
		}, {});
	}, [danhSachCauLacBo]);

	const danhSachDaLoc = useMemo(() => {
		const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();
		return danhSachDonDangKy.filter((item) => {
			const dungTuKhoa =
				!tuKhoaChuanHoa ||
				item.hoTen.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.email.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.sdt.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.soTruong.toLowerCase().includes(tuKhoaChuanHoa);
			const dungTrangThai = locTrangThai === 'All' ? true : item.trangThai === locTrangThai;
			const dungCauLacBo = locCauLacBo === 'All' ? true : item.idCauLacBo === locCauLacBo;

			return dungTuKhoa && dungTrangThai && dungCauLacBo;
		});
	}, [danhSachDonDangKy, locCauLacBo, locTrangThai, tuKhoa]);

	const lichSuTheoDonDangXem = useMemo(() => {
		if (!banGhiDangXem) {
			return [];
		}

		return lichSuThaoTac.filter((item) => item.idDonDangKy === banGhiDangXem.id);
	}, [banGhiDangXem, lichSuThaoTac]);

	const tongDonChoDuyetDuocChon = useMemo(() => {
		return danhSachDonDangKy.filter(
			(item) => danhSachIdChon.includes(item.id) && item.trangThai === 'Pending',
		).length;
	}, [danhSachDonDangKy, danhSachIdChon]);

	const dongModalForm = () => {
		setHienThiModalForm(false);
		setBanGhiDangSua(null);
		formDonDangKy.resetFields();
	};

	const moModalThem = () => {
		setCheDoForm('them');
		setBanGhiDangSua(null);
		formDonDangKy.resetFields();
		formDonDangKy.setFieldsValue({
			gioiTinh: 'Nam',
			trangThai: 'Pending',
		} as Partial<DonDangKy>);
		setHienThiModalForm(true);
	};

	const moModalSua = (record: DonDangKy) => {
		setCheDoForm('sua');
		setBanGhiDangSua(record);
		formDonDangKy.setFieldsValue(record);
		setHienThiModalForm(true);
	};

	const moModalChiTiet = (record: DonDangKy) => {
		setBanGhiDangXem(record);
		setHienThiModalChiTiet(true);
	};

	const xuLyLuu = async () => {
		const values = await formDonDangKy.validateFields();
		const ketQua = onSave(
			{
				id: banGhiDangSua?.id || '',
				hoTen: values.hoTen.trim(),
				email: values.email.trim(),
				sdt: values.sdt.trim(),
				gioiTinh: values.gioiTinh,
				diaChi: values.diaChi.trim(),
				soTruong: values.soTruong.trim(),
				idCauLacBo: values.idCauLacBo,
				lyDoDangKy: values.lyDoDangKy.trim(),
				trangThai: banGhiDangSua?.trangThai || 'Pending',
				ghiChu: banGhiDangSua?.ghiChu,
			},
			cheDoForm,
		);

		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		dongModalForm();
	};

	const xuLyXoa = (id: string) => {
		const ketQua = onDelete(id);
		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		setDanhSachIdChon((prev) => prev.filter((item) => item !== id));
	};

	const xuLyDuyet = (ids: string[]) => {
		const ketQua = onApprove(ids);
		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		setDanhSachIdChon([]);
	};

	const moModalTuChoi = (ids: string[], title: string) => {
		setMucTieuTuChoi({ ids, title });
		formTuChoi.resetFields();
		setHienThiModalTuChoi(true);
	};

	const xuLyTuChoi = async () => {
		const values = await formTuChoi.validateFields();
		const ketQua = onReject(mucTieuTuChoi.ids, values.lyDo.trim());
		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		setHienThiModalTuChoi(false);
		setDanhSachIdChon([]);
		formTuChoi.resetFields();
	};

	const rowSelection = {
		selectedRowKeys: danhSachIdChon,
		onChange: (selectedRowKeys: Key[]) => setDanhSachIdChon(selectedRowKeys),
		getCheckboxProps: (record: DonDangKy) => ({
			disabled: record.trangThai !== 'Pending',
		}),
	};

	const columns: ColumnsType<DonDangKy> = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			width: 170,
			sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: 220,
			sorter: (a, b) => a.email.localeCompare(b.email),
		},
		{
			title: 'SĐT',
			dataIndex: 'sdt',
			key: 'sdt',
			width: 120,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
			width: 100,
			align: 'center',
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			key: 'diaChi',
			width: 160,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			key: 'soTruong',
			width: 180,
		},
		{
			title: 'Câu lạc bộ',
			key: 'cauLacBo',
			width: 210,
			sorter: (a, b) =>
				(tenCauLacBoMap[a.idCauLacBo] || '').localeCompare(tenCauLacBoMap[b.idCauLacBo] || ''),
			render: (_, record) => <Tag color='processing'>{tenCauLacBoMap[record.idCauLacBo] || 'Chưa xác định'}</Tag>,
		},
		{
			title: 'Lý do đăng ký',
			dataIndex: 'lyDoDangKy',
			key: 'lyDoDangKy',
			width: 260,
			render: (value: string) => (
				<Typography.Paragraph ellipsis={{ rows: 2, tooltip: value }} style={{ marginBottom: 0 }}>
					{value}
				</Typography.Paragraph>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 120,
			align: 'center',
			sorter: (a, b) => a.trangThai.localeCompare(b.trangThai),
			render: (value: TrangThaiDon) => <Tag color={cauHinhTrangThai[value].color}>{cauHinhTrangThai[value].text}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
			width: 220,
			render: (value?: string) => value || <span style={{ color: '#bfbfbf' }}>Chưa có</span>,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right',
			width: 320,
			render: (_, record) => (
				<Space wrap>
					<Button type='link' icon={<EyeOutlined />} onClick={() => moModalChiTiet(record)}>
						Chi tiết
					</Button>
					<Button type='link' icon={<EditOutlined />} onClick={() => moModalSua(record)}>
						Sửa
					</Button>
					<Popconfirm
						title={`Bạn có chắc muốn xóa đơn của ${record.hoTen}?`}
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => xuLyXoa(record.id)}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
					<Button type='link' icon={<HistoryOutlined />} onClick={() => moModalChiTiet(record)}>
						Lịch sử
					</Button>
					{record.trangThai === 'Pending' ? (
						<>
							<Button type='link' icon={<CheckCircleOutlined />} onClick={() => xuLyDuyet([record.id])}>
								Duyệt
							</Button>
							<Button
								type='link'
								danger
								icon={<CloseCircleOutlined />}
								onClick={() => moModalTuChoi([record.id], `Từ chối đơn của ${record.hoTen}`)}
							>
								Từ chối
							</Button>
						</>
					) : null}
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size='middle' style={{ width: '100%' }}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<Typography.Title level={4} style={{ marginBottom: 0 }}>
					Quản lý đơn đăng ký thành viên
				</Typography.Title>
				<Space wrap>
					<Button type='primary' icon={<PlusOutlined />} onClick={moModalThem}>
						Thêm mới đơn đăng ký
					</Button>
					<Button
						disabled={tongDonChoDuyetDuocChon === 0}
						icon={<CheckCircleOutlined />}
						onClick={() => xuLyDuyet(danhSachIdChon.map((item) => item.toString()))}
					>
						Duyệt {tongDonChoDuyetDuocChon} đơn đã chọn
					</Button>
					<Button
						danger
						disabled={tongDonChoDuyetDuocChon === 0}
						icon={<CloseCircleOutlined />}
						onClick={() =>
							moModalTuChoi(
								danhSachIdChon.map((item) => item.toString()),
								`Từ chối ${tongDonChoDuyetDuocChon} đơn đã chọn`,
							)
						}
					>
						Không duyệt {tongDonChoDuyetDuocChon} đơn đã chọn
					</Button>
				</Space>
			</Space>

			<Space wrap>
				<Input.Search
					allowClear
					placeholder='Tìm theo họ tên, email, SĐT, sở trường'
					style={{ width: 320 }}
					value={tuKhoa}
					onChange={(event) => setTuKhoa(event.target.value)}
				/>
				<Select value={locTrangThai} style={{ width: 170 }} onChange={(value) => setLocTrangThai(value as 'All' | TrangThaiDon)}>
					<Select.Option value='All'>Tất cả trạng thái</Select.Option>
					<Select.Option value='Pending'>Chờ duyệt</Select.Option>
					<Select.Option value='Approved'>Đã duyệt</Select.Option>
					<Select.Option value='Rejected'>Đã từ chối</Select.Option>
				</Select>
				<Select value={locCauLacBo} style={{ width: 240 }} onChange={(value) => setLocCauLacBo(value as 'All' | string)}>
					<Select.Option value='All'>Tất cả câu lạc bộ</Select.Option>
					{danhSachCauLacBo.map((item) => (
						<Select.Option key={item.id} value={item.id}>
							{item.tenCauLacBo}
						</Select.Option>
					))}
				</Select>
				<Button icon={<HistoryOutlined />} onClick={() => setHienThiModalLichSu(true)}>
					Xem toàn bộ lịch sử
				</Button>
			</Space>

			<Table<DonDangKy>
				rowKey='id'
				rowSelection={rowSelection}
				columns={columns}
				dataSource={danhSachDaLoc}
				scroll={{ x: 2200 }}
				pagination={{ pageSize: 5 }}
				locale={{ emptyText: 'Chưa có đơn đăng ký nào.' }}
			/>

			<Card title='Lịch sử thao tác gần đây'>
				<Timeline>
					{lichSuThaoTac.slice(0, 6).map((item) => (
						<Timeline.Item key={item.id}>
							<div style={{ fontWeight: 500 }}>{item.noiDung}</div>
							<div style={{ color: '#8c8c8c' }}>
								{item.nguoiThucHien} - {item.thoiGian}
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>

			<Modal
				destroyOnClose
				title={cheDoForm === 'them' ? 'Thêm mới đơn đăng ký' : 'Chỉnh sửa đơn đăng ký'}
				visible={hienThiModalForm}
				width={760}
				okText='Lưu'
				cancelText='Hủy'
				onOk={xuLyLuu}
				onCancel={dongModalForm}
			>
				<Form form={formDonDangKy} layout='vertical'>
					<Form.Item
						label='Họ tên'
						name='hoTen'
						rules={[
							{ required: true, message: 'Vui lòng nhập họ tên.' },
							{ whitespace: true, message: 'Họ tên không được để trống.' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label='Email' name='email' rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ.' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='SĐT'
						name='sdt'
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại.' },
							{ whitespace: true, message: 'Số điện thoại không được để trống.' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label='Giới tính' name='gioiTinh' rules={[{ required: true, message: 'Vui lòng chọn giới tính.' }]}>
						<Select>
							<Select.Option value='Nam'>Nam</Select.Option>
							<Select.Option value='Nữ'>Nữ</Select.Option>
							<Select.Option value='Khác'>Khác</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label='Địa chỉ'
						name='diaChi'
						rules={[
							{ required: true, message: 'Vui lòng nhập địa chỉ.' },
							{ whitespace: true, message: 'Địa chỉ không được để trống.' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Sở trường'
						name='soTruong'
						rules={[
							{ required: true, message: 'Vui lòng nhập sở trường.' },
							{ whitespace: true, message: 'Sở trường không được để trống.' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label='Câu lạc bộ' name='idCauLacBo' rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ.' }]}>
						<Select>
							{danhSachCauLacBo.map((item) => (
								<Select.Option key={item.id} value={item.id}>
									{item.tenCauLacBo} {item.hoatDong ? '' : '(Tạm dừng)'}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Lý do đăng ký'
						name='lyDoDangKy'
						rules={[
							{ required: true, message: 'Vui lòng nhập lý do đăng ký.' },
							{ whitespace: true, message: 'Lý do đăng ký không được để trống.' },
						]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				destroyOnClose
				title='Chi tiết đơn đăng ký'
				visible={hienThiModalChiTiet}
				width={860}
				footer={null}
				onCancel={() => {
					setHienThiModalChiTiet(false);
					setBanGhiDangXem(null);
				}}
			>
				{banGhiDangXem ? (
					<>
						<Descriptions bordered column={2} size='small'>
							<Descriptions.Item label='Họ tên'>{banGhiDangXem.hoTen}</Descriptions.Item>
							<Descriptions.Item label='Email'>{banGhiDangXem.email}</Descriptions.Item>
							<Descriptions.Item label='SĐT'>{banGhiDangXem.sdt}</Descriptions.Item>
							<Descriptions.Item label='Giới tính'>{banGhiDangXem.gioiTinh}</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ'>{banGhiDangXem.diaChi}</Descriptions.Item>
							<Descriptions.Item label='Câu lạc bộ'>
								{tenCauLacBoMap[banGhiDangXem.idCauLacBo] || 'Chưa xác định'}
							</Descriptions.Item>
							<Descriptions.Item label='Sở trường'>{banGhiDangXem.soTruong}</Descriptions.Item>
							<Descriptions.Item label='Trạng thái'>
								<Tag color={cauHinhTrangThai[banGhiDangXem.trangThai].color}>
									{cauHinhTrangThai[banGhiDangXem.trangThai].text}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label='Lý do đăng ký' span={2}>
								{banGhiDangXem.lyDoDangKy}
							</Descriptions.Item>
							<Descriptions.Item label='Ghi chú' span={2}>
								{banGhiDangXem.ghiChu || 'Chưa có'}
							</Descriptions.Item>
						</Descriptions>

						<Card size='small' title='Lịch sử thao tác của đơn này' style={{ marginTop: 16 }}>
							<Timeline>
								{lichSuTheoDonDangXem.length > 0 ? (
									lichSuTheoDonDangXem.map((item) => (
										<Timeline.Item key={item.id}>
											<div style={{ fontWeight: 500 }}>{item.noiDung}</div>
											<div style={{ color: '#8c8c8c' }}>
												{item.nguoiThucHien} - {item.thoiGian}
											</div>
										</Timeline.Item>
									))
								) : (
									<Timeline.Item>Chưa có lịch sử thao tác.</Timeline.Item>
								)}
							</Timeline>
						</Card>
					</>
				) : null}
			</Modal>

			<Modal
				destroyOnClose
				title={mucTieuTuChoi.title || 'Từ chối đơn đăng ký'}
				visible={hienThiModalTuChoi}
				okText='Xác nhận từ chối'
				cancelText='Hủy'
				onOk={xuLyTuChoi}
				onCancel={() => setHienThiModalTuChoi(false)}
			>
				<Form form={formTuChoi} layout='vertical'>
					<Form.Item
						label='Lý do từ chối'
						name='lyDo'
						rules={[
							{ required: true, message: 'Vui lòng nhập lý do từ chối.' },
							{ whitespace: true, message: 'Lý do từ chối không được để trống.' },
						]}
					>
						<Input.TextArea rows={4} placeholder='Nhập lý do từ chối bắt buộc' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				destroyOnClose
				title='Toàn bộ lịch sử thao tác'
				visible={hienThiModalLichSu}
				width={780}
				footer={null}
				onCancel={() => setHienThiModalLichSu(false)}
			>
				<Timeline>
					{lichSuThaoTac.map((item) => (
						<Timeline.Item key={item.id}>
							<div style={{ fontWeight: 500 }}>{item.noiDung}</div>
							<div style={{ color: '#8c8c8c' }}>
								{item.hanhDong} - {item.nguoiThucHien} - {item.thoiGian}
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			</Modal>
		</Space>
	);
};

export default QuanLyDonDangKy;
