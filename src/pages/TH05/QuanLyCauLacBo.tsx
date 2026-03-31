import type { CauLacBo, DonDangKy, KetQuaXuLy } from './types';
import {
	Avatar,
	Button,
	Card,
	Form,
	Input,
	Modal,
	Popconfirm,
	Space,
	Switch,
	Table,
	Tag,
	Tooltip,
	Typography,
	message,
} from 'antd';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

type Props = {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	onSave: (cauLacBo: CauLacBo) => KetQuaXuLy;
	onDelete: (id: string) => KetQuaXuLy;
	onViewMembers: (idCauLacBo: string) => void;
};

const boTheHtml = (chuoi: string) => chuoi.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const chuyenNgayThanhSo = (ngay: string) => {
	const [ngaySo, thangSo, namSo] = ngay.split('/');
	return new Date(Number(namSo), Number(thangSo) - 1, Number(ngaySo)).getTime();
};

const QuanLyCauLacBo = ({
	danhSachCauLacBo,
	danhSachDonDangKy,
	onSave,
	onDelete,
	onViewMembers,
}: Props) => {
	const [form] = Form.useForm<CauLacBo>();
	const [tuKhoa, setTuKhoa] = useState('');
	const [banGhiDangSua, setBanGhiDangSua] = useState<CauLacBo | null>(null);
	const [hienThiModal, setHienThiModal] = useState(false);
	const moTaDangNhap = Form.useWatch('moTa', form);

	const thongKeTheoClb = useMemo(() => {
		return danhSachDonDangKy.reduce<Record<string, { tongDon: number; tongThanhVien: number }>>((acc, item) => {
			if (!acc[item.idCauLacBo]) {
				acc[item.idCauLacBo] = { tongDon: 0, tongThanhVien: 0 };
			}

			acc[item.idCauLacBo].tongDon += 1;
			if (item.trangThai === 'Approved') {
				acc[item.idCauLacBo].tongThanhVien += 1;
			}

			return acc;
		}, {});
	}, [danhSachDonDangKy]);

	const danhSachDaLoc = useMemo(() => {
		const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();
		if (!tuKhoaChuanHoa) {
			return danhSachCauLacBo;
		}

		return danhSachCauLacBo.filter((item) => {
			const moTaKhongThe = boTheHtml(item.moTa);
			return (
				item.tenCauLacBo.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.chuNhiem.toLowerCase().includes(tuKhoaChuanHoa) ||
				moTaKhongThe.toLowerCase().includes(tuKhoaChuanHoa)
			);
		});
	}, [danhSachCauLacBo, tuKhoa]);

	const moModal = (record?: CauLacBo) => {
		if (record) {
			setBanGhiDangSua(record);
			form.setFieldsValue(record);
		} else {
			setBanGhiDangSua(null);
			form.resetFields();
			form.setFieldsValue({
				anhDaiDien: '',
				hoatDong: true,
				moTa: '<p></p>',
			});
		}
		setHienThiModal(true);
	};

	const dongModal = () => {
		setBanGhiDangSua(null);
		setHienThiModal(false);
		form.resetFields();
	};

	const xuLyLuu = async () => {
		const values = await form.validateFields();
		const ketQua = onSave({
			id: banGhiDangSua?.id || '',
			anhDaiDien: values.anhDaiDien?.trim() || '',
			tenCauLacBo: values.tenCauLacBo.trim(),
			ngayThanhLap: values.ngayThanhLap.trim(),
			moTa: values.moTa.trim(),
			chuNhiem: values.chuNhiem.trim(),
			hoatDong: Boolean(values.hoatDong),
		});

		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		dongModal();
	};

	const xuLyXoa = (id: string) => {
		const ketQua = onDelete(id);
		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
	};

	const columns: ColumnsType<CauLacBo> = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			key: 'anhDaiDien',
			width: 110,
			align: 'center',
			render: (value: string, record) => (
				<Avatar shape='square' size={56} src={value || undefined}>
					{record.tenCauLacBo.charAt(0).toUpperCase()}
				</Avatar>
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			key: 'tenCauLacBo',
			sorter: (a, b) => a.tenCauLacBo.localeCompare(b.tenCauLacBo),
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			width: 140,
			sorter: (a, b) => chuyenNgayThanhSo(a.ngayThanhLap) - chuyenNgayThanhSo(b.ngayThanhLap),
		},
		{
			title: 'Mô tả (HTML)',
			dataIndex: 'moTa',
			key: 'moTa',
			width: 320,
			render: (value: string) => {
				const noiDungRutGon = boTheHtml(value);
				return (
					<Tooltip title={<div dangerouslySetInnerHTML={{ __html: value }} />}>
						<div style={{ maxWidth: 300 }}>
							<Typography.Paragraph ellipsis={{ rows: 3, tooltip: noiDungRutGon }} style={{ marginBottom: 0 }}>
								{noiDungRutGon}
							</Typography.Paragraph>
						</div>
					</Tooltip>
				);
			},
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiem',
			key: 'chuNhiem',
			width: 170,
			sorter: (a, b) => a.chuNhiem.localeCompare(b.chuNhiem),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			key: 'hoatDong',
			width: 120,
			align: 'center',
			sorter: (a, b) => Number(a.hoatDong) - Number(b.hoatDong),
			render: (value: boolean) => (value ? <Tag color='green'>Có</Tag> : <Tag color='red'>Không</Tag>),
		},
		{
			title: 'Thành viên',
			key: 'thanhVien',
			width: 130,
			align: 'center',
			render: (_, record) => <Tag color='blue'>{thongKeTheoClb[record.id]?.tongThanhVien || 0} thành viên</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right',
			width: 220,
			render: (_, record) => (
				<Space wrap>
					<Button type='link' icon={<TeamOutlined />} onClick={() => onViewMembers(record.id)}>
						Xem thành viên
					</Button>
					<Button type='link' icon={<EditOutlined />} onClick={() => moModal(record)}>
						Chỉnh sửa
					</Button>
					<Popconfirm
						title={`Bạn có chắc muốn xóa ${record.tenCauLacBo}?`}
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => xuLyXoa(record.id)}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size='middle' style={{ width: '100%' }}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<Typography.Title level={4} style={{ marginBottom: 0 }}>
					Danh sách câu lạc bộ
				</Typography.Title>
				<Space wrap>
					<Input.Search
						allowClear
						placeholder='Tìm theo tên, chủ nhiệm, mô tả'
						style={{ width: 320 }}
						value={tuKhoa}
						onChange={(event) => setTuKhoa(event.target.value)}
					/>
					<Button type='primary' onClick={() => moModal()}>
						Thêm mới câu lạc bộ
					</Button>
				</Space>
			</Space>

			<Table<CauLacBo>
				rowKey='id'
				columns={columns}
				dataSource={danhSachDaLoc}
				scroll={{ x: 1450 }}
				pagination={{ pageSize: 5 }}
				locale={{ emptyText: 'Chưa có câu lạc bộ nào.' }}
			/>

			<Modal
				destroyOnClose
				title={banGhiDangSua ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
				visible={hienThiModal}
				width={760}
				okText='Lưu'
				cancelText='Hủy'
				onOk={xuLyLuu}
				onCancel={dongModal}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên câu lạc bộ'
						name='tenCauLacBo'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên câu lạc bộ.' },
							{ whitespace: true, message: 'Tên câu lạc bộ không được để trống.' },
						]}
					>
						<Input placeholder='Ví dụ: CLB Lập Trình Web' />
					</Form.Item>

					<Form.Item label='Ảnh đại diện' name='anhDaiDien'>
						<Input placeholder='Nhập URL ảnh đại diện' />
					</Form.Item>

					<Form.Item
						label='Ngày thành lập'
						name='ngayThanhLap'
						rules={[
							{ required: true, message: 'Vui lòng nhập ngày thành lập.' },
							{ whitespace: true, message: 'Ngày thành lập không được để trống.' },
						]}
					>
						<Input placeholder='DD/MM/YYYY' />
					</Form.Item>

					<Form.Item
						label='Chủ nhiệm CLB'
						name='chuNhiem'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên chủ nhiệm.' },
							{ whitespace: true, message: 'Tên chủ nhiệm không được để trống.' },
						]}
					>
						<Input placeholder='Nhập tên chủ nhiệm câu lạc bộ' />
					</Form.Item>

					<Form.Item
						label='Mô tả (HTML)'
						name='moTa'
						rules={[
							{ required: true, message: 'Vui lòng nhập mô tả câu lạc bộ.' },
							{ whitespace: true, message: 'Mô tả không được để trống.' },
						]}
					>
						<Input.TextArea
							rows={6}
							placeholder='<p>Nhập mô tả bằng HTML. Ví dụ: <strong>CLB</strong> tổ chức workshop hằng tháng.</p>'
						/>
					</Form.Item>

					<Card size='small' title='Xem trước mô tả'>
						<div
							style={{ minHeight: 80 }}
							dangerouslySetInnerHTML={{
								__html: moTaDangNhap || '<p style="color:#999">Chưa có nội dung mô tả.</p>',
							}}
						/>
					</Card>

					<Form.Item label='Hoạt động' name='hoatDong' valuePropName='checked' style={{ marginTop: 16 }}>
						<Switch checkedChildren='Có' unCheckedChildren='Không' />
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default QuanLyCauLacBo;
