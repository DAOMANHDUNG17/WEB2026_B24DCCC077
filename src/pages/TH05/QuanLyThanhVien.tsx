import type { CauLacBo, DonDangKy, KetQuaXuLy } from './types';
import { Badge, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { SwapOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	idCauLacBoMacDinh?: string;
	onTransferClub: (ids: string[], idCauLacBoMoi: string) => KetQuaXuLy;
};

type ThanhVien = DonDangKy;

const QuanLyThanhVien = ({
	danhSachCauLacBo,
	danhSachDonDangKy,
	idCauLacBoMacDinh,
	onTransferClub,
}: Props) => {
	const [formChuyenClb] = Form.useForm<{ idCauLacBoMoi: string }>();
	const [tuKhoa, setTuKhoa] = useState('');
	const [locCauLacBo, setLocCauLacBo] = useState<'All' | string>(idCauLacBoMacDinh || 'All');
	const [danhSachIdChon, setDanhSachIdChon] = useState<Key[]>([]);
	const [hienThiModalChuyen, setHienThiModalChuyen] = useState(false);
	const [mucTieuChuyen, setMucTieuChuyen] = useState<{ ids: string[]; title: string }>({ ids: [], title: '' });

	useEffect(() => {
		if (idCauLacBoMacDinh) {
			setLocCauLacBo(idCauLacBoMacDinh);
		}
	}, [idCauLacBoMacDinh]);

	const tenCauLacBoMap = useMemo(() => {
		return danhSachCauLacBo.reduce<Record<string, string>>((acc, item) => {
			acc[item.id] = item.tenCauLacBo;
			return acc;
		}, {});
	}, [danhSachCauLacBo]);

	const danhSachThanhVien = useMemo(() => {
		const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();
		return danhSachDonDangKy.filter((item) => {
			if (item.trangThai !== 'Approved') {
				return false;
			}

			const dungTuKhoa =
				!tuKhoaChuanHoa ||
				item.hoTen.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.email.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.sdt.toLowerCase().includes(tuKhoaChuanHoa) ||
				item.soTruong.toLowerCase().includes(tuKhoaChuanHoa);
			const dungCauLacBo = locCauLacBo === 'All' ? true : item.idCauLacBo === locCauLacBo;

			return dungTuKhoa && dungCauLacBo;
		});
	}, [danhSachDonDangKy, locCauLacBo, tuKhoa]);

	const thongKeTheoClb = useMemo(() => {
		return danhSachDonDangKy.reduce<Record<string, number>>((acc, item) => {
			if (item.trangThai !== 'Approved') {
				return acc;
			}

			acc[item.idCauLacBo] = (acc[item.idCauLacBo] || 0) + 1;
			return acc;
		}, {});
	}, [danhSachDonDangKy]);

	const clbDongNhat =
		danhSachCauLacBo
			.map((item) => ({
				tenCauLacBo: item.tenCauLacBo,
				soLuong: thongKeTheoClb[item.id] || 0,
			}))
			.sort((a, b) => b.soLuong - a.soLuong)[0]?.tenCauLacBo || 'Chưa có dữ liệu';

	const moModalChuyen = (ids: string[], title: string) => {
		setMucTieuChuyen({ ids, title });
		formChuyenClb.resetFields();
		setHienThiModalChuyen(true);
	};

	const xuLyChuyenClb = async () => {
		const values = await formChuyenClb.validateFields();
		const ketQua = onTransferClub(mucTieuChuyen.ids, values.idCauLacBoMoi);

		if (!ketQua.success) {
			message.error(ketQua.message);
			return;
		}

		message.success(ketQua.message);
		setHienThiModalChuyen(false);
		setDanhSachIdChon([]);
		formChuyenClb.resetFields();
	};

	const columns: ColumnsType<ThanhVien> = [
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
			title: 'Câu lạc bộ hiện tại',
			key: 'idCauLacBo',
			width: 220,
			render: (_, record) => <Tag color='processing'>{tenCauLacBoMap[record.idCauLacBo] || 'Chưa xác định'}</Tag>,
		},
		{
			title: 'Trạng thái',
			key: 'trangThai',
			width: 180,
			render: () => <Badge status='success' text='Thành viên chính thức' />,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right',
			width: 170,
			render: (_, record) => (
				<Button
					type='link'
					icon={<SwapOutlined />}
					onClick={() => moModalChuyen([record.id], `Chuyển câu lạc bộ cho ${record.hoTen}`)}
				>
					Đổi CLB
				</Button>
			),
		},
	];

	return (
		<Space direction='vertical' size='middle' style={{ width: '100%' }}>
			<Typography.Title level={4} style={{ marginBottom: 0 }}>
				Quản lý thành viên câu lạc bộ
			</Typography.Title>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card bordered={false}>
						<div style={{ color: '#8c8c8c' }}>Tổng thành viên</div>
						<div style={{ fontSize: 28, fontWeight: 700 }}>
							{danhSachDonDangKy.filter((item) => item.trangThai === 'Approved').length}
						</div>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered={false}>
						<div style={{ color: '#8c8c8c' }}>CLB đang có thành viên</div>
						<div style={{ fontSize: 28, fontWeight: 700 }}>{Object.keys(thongKeTheoClb).length}</div>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered={false}>
						<div style={{ color: '#8c8c8c' }}>CLB đông nhất</div>
						<div style={{ fontSize: 18, fontWeight: 700 }}>{clbDongNhat}</div>
					</Card>
				</Col>
			</Row>

			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<Space wrap>
					<Input.Search
						allowClear
						placeholder='Tìm theo họ tên, email, SĐT, sở trường'
						style={{ width: 320 }}
						value={tuKhoa}
						onChange={(event) => setTuKhoa(event.target.value)}
					/>
					<Select value={locCauLacBo} style={{ width: 240 }} onChange={(value) => setLocCauLacBo(value as 'All' | string)}>
						<Select.Option value='All'>Tất cả câu lạc bộ</Select.Option>
						{danhSachCauLacBo.map((item) => (
							<Select.Option key={item.id} value={item.id}>
								{item.tenCauLacBo}
							</Select.Option>
						))}
					</Select>
				</Space>

				<Button
					type='primary'
					icon={<TeamOutlined />}
					disabled={danhSachIdChon.length === 0}
					onClick={() =>
						moModalChuyen(
							danhSachIdChon.map((item) => item.toString()),
							`Chuyển câu lạc bộ cho ${danhSachIdChon.length} thành viên`,
						)
					}
				>
					Đổi CLB cho {danhSachIdChon.length} thành viên
				</Button>
			</Space>

			<Table<ThanhVien>
				rowKey='id'
				rowSelection={{
					selectedRowKeys: danhSachIdChon,
					onChange: (selectedRowKeys) => setDanhSachIdChon(selectedRowKeys),
				}}
				columns={columns}
				dataSource={danhSachThanhVien}
				scroll={{ x: 1600 }}
				pagination={{ pageSize: 5 }}
				locale={{ emptyText: 'Chưa có thành viên chính thức nào.' }}
			/>

			<Modal
				destroyOnClose
				title={mucTieuChuyen.title || 'Chuyển câu lạc bộ'}
				visible={hienThiModalChuyen}
				okText='Xác nhận chuyển'
				cancelText='Hủy'
				onOk={xuLyChuyenClb}
				onCancel={() => setHienThiModalChuyen(false)}
			>
				<Form form={formChuyenClb} layout='vertical'>
					<Form.Item
						label='Câu lạc bộ muốn chuyển đến'
						name='idCauLacBoMoi'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ muốn chuyển đến.' }]}
					>
						<Select placeholder='Chọn câu lạc bộ mới'>
							{danhSachCauLacBo
								.filter((item) => item.hoatDong)
								.map((item) => (
									<Select.Option key={item.id} value={item.id}>
										{item.tenCauLacBo}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default QuanLyThanhVien;
