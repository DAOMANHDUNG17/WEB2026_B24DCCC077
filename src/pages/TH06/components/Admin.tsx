import type { DiemDen, KeHoachDuLich, KetQuaXuLy, LichTrinh } from '../types';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { blobToBase64 } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Form,
	Image,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
	Upload,
	message,
} from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import {
	chuanHoaThuTuTheoNgay,
	dinhDangTien,
	layMauLoaiHinh,
	layNhanLoaiHinh,
	layNhanVungMien,
	taoId,
	tinhTongChiPhiDiemDen,
	tinhTongChiPhiLichTrinh,
	tinhTongTheoHangMuc,
	tinhTongThoiGianDiChuyen,
	tinhTongThoiGianThamQuan,
} from '../helpers';

const { Text } = Typography;
const { TextArea } = Input;

interface AdminProps {
	danhSachDiemDen: DiemDen[];
	lichTrinh: LichTrinh[];
	danhSachKeHoach: KeHoachDuLich[];
	onLuuDiemDen: (diemDen: DiemDen) => KetQuaXuLy;
	onXoaDiemDen: (id: string) => KetQuaXuLy;
	onXoaKeHoach: (id: string) => void;
}

const Admin = ({
	danhSachDiemDen,
	lichTrinh,
	danhSachKeHoach,
	onLuuDiemDen,
	onXoaDiemDen,
	onXoaKeHoach,
}: AdminProps) => {
	const [form] = Form.useForm<DiemDen>();
	const [dangMoModal, setDangMoModal] = useState(false);
	const [idDangSua, setIdDangSua] = useState<string>();
	const [anhXemTruoc, setAnhXemTruoc] = useState('');

	const keHoachTam = lichTrinh.length
		? {
				id: 'ban-nhap-hien-tai',
				tenKeHoach: 'Bản nháp hiện tại',
				ngayTao: new Date().toISOString(),
				lichTrinh: chuanHoaThuTuTheoNgay(lichTrinh),
				tongChiPhi: tinhTongChiPhiLichTrinh(lichTrinh),
				tongThoiGianThamQuan: tinhTongThoiGianThamQuan(lichTrinh),
				tongThoiGianDiChuyen: tinhTongThoiGianDiChuyen(lichTrinh),
		  }
		: undefined;

	const duLieuThongKe = danhSachKeHoach.length ? danhSachKeHoach : keHoachTam ? [keHoachTam] : [];
	const tongTheoHangMuc = duLieuThongKe.reduce(
		(tong, keHoach) => {
			const ketQua = tinhTongTheoHangMuc(keHoach.lichTrinh);
			return {
				anUong: tong.anUong + ketQua.anUong,
				luuTru: tong.luuTru + ketQua.luuTru,
				diChuyen: tong.diChuyen + ketQua.diChuyen,
			};
		},
		{ anUong: 0, luuTru: 0, diChuyen: 0 },
	);

	const tongGiaTriBooking = duLieuThongKe.reduce((tong, keHoach) => tong + keHoach.tongChiPhi, 0);
	const doanhThuUocTinh = Math.round(tongGiaTriBooking * 0.15);
	const duLieuTheoThang = Array.from({ length: 12 }, (_, index) =>
		duLieuThongKe.filter((item) => new Date(item.ngayTao).getMonth() === index).length,
	);

	const bangPhoBien = Object.values(
		duLieuThongKe.reduce<Record<string, { key: string; tenDiaDiem: string; diaDiem: string; soLuot: number; rating: number }>>(
			(acc, keHoach) => {
				keHoach.lichTrinh.forEach((item) => {
					if (!acc[item.diemDen.id]) {
						acc[item.diemDen.id] = {
							key: item.diemDen.id,
							tenDiaDiem: item.diemDen.tenDiaDiem,
							diaDiem: item.diemDen.diaDiem,
							soLuot: 0,
							rating: item.diemDen.rating,
						};
					}

					acc[item.diemDen.id].soLuot += 1;
				});
				return acc;
			},
			{},
		),
	).sort((a, b) => b.soLuot - a.soLuot);

	function moModalThem() {
		setIdDangSua(undefined);
		setAnhXemTruoc('');
		form.setFieldsValue({
			id: undefined,
			tenDiaDiem: '',
			diaDiem: '',
			loaiHinh: 'bien',
			vungMien: 'bac',
			hinhAnh: '',
			rating: 4.5,
			moTa: '',
			thoiGianThamQuan: 4,
			chiPhiAnUong: 500000,
			chiPhiLuuTru: 1000000,
			chiPhiDiChuyen: 300000,
		});
		setDangMoModal(true);
	}

	function moModalSua(diemDen: DiemDen) {
		setIdDangSua(diemDen.id);
		setAnhXemTruoc(diemDen.hinhAnh);
		form.setFieldsValue(diemDen);
		setDangMoModal(true);
	}

	function dongModal() {
		form.resetFields();
		setIdDangSua(undefined);
		setAnhXemTruoc('');
		setDangMoModal(false);
	}

	async function xuLyTaiAnh(file: RcFile) {
		const duLieuAnh = await blobToBase64(file);
		form.setFieldsValue({ hinhAnh: duLieuAnh });
		setAnhXemTruoc(duLieuAnh);
		return false;
	}

	async function xuLyLuu() {
		try {
			const values = await form.validateFields();
			const diemDen: DiemDen = {
				...values,
				id: idDangSua || taoId('diem-den'),
			};
			const ketQua = onLuuDiemDen(diemDen);
			if (ketQua.success) {
				message.success(ketQua.message);
				dongModal();
				return;
			}
			message.error(ketQua.message);
		} catch (error) {
			return error;
		}
	}

	const cotBangDiemDen: ColumnsType<DiemDen> = [
		{
			title: 'Hình ảnh',
			dataIndex: 'hinhAnh',
			key: 'hinhAnh',
			width: 110,
			render: (hinhAnh: string, banGhi) => (
				<Image src={hinhAnh} alt={banGhi.tenDiaDiem} width={80} height={56} style={{ objectFit: 'cover', borderRadius: 8 }} />
			),
		},
		{
			title: 'Điểm đến',
			key: 'tenDiaDiem',
			render: (_, banGhi) => (
				<Space direction='vertical' size={2}>
					<Text strong>{banGhi.tenDiaDiem}</Text>
					<Text type='secondary'>{banGhi.diaDiem}</Text>
				</Space>
			),
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			key: 'loaiHinh',
			width: 140,
			render: (loaiHinh: DiemDen['loaiHinh']) => <Tag color={layMauLoaiHinh(loaiHinh)}>{layNhanLoaiHinh(loaiHinh)}</Tag>,
		},
		{
			title: 'Vùng miền',
			dataIndex: 'vungMien',
			key: 'vungMien',
			width: 130,
			render: (vungMien: DiemDen['vungMien']) => layNhanVungMien(vungMien),
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			width: 90,
			render: (rating: number) => rating.toFixed(1),
		},
		{
			title: 'Tổng chi',
			key: 'tongChiPhi',
			width: 160,
			render: (_, banGhi) => dinhDangTien(tinhTongChiPhiDiemDen(banGhi)),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 130,
			render: (_, banGhi) => (
				<Space>
					<Button size='small' icon={<EditOutlined />} onClick={() => moModalSua(banGhi)} />
					<Popconfirm
						title='Xóa điểm đến này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => {
							const ketQua = onXoaDiemDen(banGhi.id);
							if (ketQua.success) {
								message.success(ketQua.message);
							} else {
								message.error(ketQua.message);
							}
						}}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const cotBangPhoBien: ColumnsType<(typeof bangPhoBien)[number]> = [
		{
			title: 'Điểm đến phổ biến',
			key: 'tenDiaDiem',
			render: (_, banGhi) => (
				<Space direction='vertical' size={2}>
					<Text strong>{banGhi.tenDiaDiem}</Text>
					<Text type='secondary'>{banGhi.diaDiem}</Text>
				</Space>
			),
		},
		{
			title: 'Số lượt chọn',
			dataIndex: 'soLuot',
			key: 'soLuot',
			width: 140,
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			width: 100,
			render: (rating: number) => rating.toFixed(1),
		},
	];

	const cotBangKeHoach: ColumnsType<KeHoachDuLich> = [
		{
			title: 'Kế hoạch',
			dataIndex: 'tenKeHoach',
			key: 'tenKeHoach',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			width: 180,
			render: (ngayTao: string) => new Date(ngayTao).toLocaleString('vi-VN'),
		},
		{
			title: 'Số điểm',
			key: 'soDiem',
			width: 100,
			render: (_, banGhi) => banGhi.lichTrinh.length,
		},
		{
			title: 'Giá trị booking',
			dataIndex: 'tongChiPhi',
			key: 'tongChiPhi',
			width: 180,
			render: (tongChiPhi: number) => dinhDangTien(tongChiPhi),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 120,
			render: (_, banGhi) =>
				banGhi.id === 'ban-nhap-hien-tai' ? (
					<Tag color='gold'>Bản nháp</Tag>
				) : (
					<Popconfirm title='Xóa kế hoạch đã lưu?' okText='Xóa' cancelText='Hủy' onConfirm={() => onXoaKeHoach(banGhi.id)}>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				),
		},
	];

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Điểm đến đang quản lý' value={danhSachDiemDen.length} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Kế hoạch đã lưu' value={danhSachKeHoach.length} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Giá trị booking' value={dinhDangTien(tongGiaTriBooking)} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Doanh thu ước tính (15%)' value={dinhDangTien(doanhThuUocTinh)} />
					</Card>
				</Col>
			</Row>

			<Card
				title='Quản lý điểm đến'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={moModalThem}>
						Thêm điểm đến
					</Button>
				}
			>
				<Table rowKey='id' columns={cotBangDiemDen} dataSource={danhSachDiemDen} scroll={{ x: 1100 }} />
			</Card>

			<Row gutter={[16, 16]}>
				<Col xs={24} xl={12}>
					<Card title='Thống kê số lượt lịch trình theo tháng'>
						<ColumnChart
							xAxis={Array.from({ length: 12 }, (_, index) => `Th${index + 1}`)}
							yAxis={[duLieuTheoThang]}
							yLabel={['Số kế hoạch']}
							height={320}
							colors={['#1677ff']}
							formatY={(value: number) => `${value} lượt`}
						/>
					</Card>
				</Col>
				<Col xs={24} xl={12}>
					<Card title='Phân bổ tiền theo từng hạng mục'>
						<DonutChart
							xAxis={['Ăn uống', 'Lưu trú', 'Di chuyển']}
							yAxis={[[tongTheoHangMuc.anUong, tongTheoHangMuc.luuTru, tongTheoHangMuc.diChuyen]]}
							yLabel={['Ngân sách']}
							colors={['#ff7a45', '#597ef7', '#36cfc9']}
							showTotal
							formatY={dinhDangTien}
							height={320}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} xl={12}>
					<Card title='Địa điểm phổ biến'>
						<Table
							rowKey='key'
							pagination={false}
							columns={cotBangPhoBien}
							dataSource={bangPhoBien.slice(0, 5)}
							locale={{ emptyText: 'Chưa có dữ liệu phổ biến. Hãy lưu ít nhất một kế hoạch.' }}
						/>
					</Card>
				</Col>
				<Col xs={24} xl={12}>
					<Card title='Danh sách kế hoạch đã lưu'>
						<Table
							rowKey='id'
							pagination={false}
							columns={cotBangKeHoach}
							dataSource={duLieuThongKe}
							locale={{ emptyText: 'Chưa có kế hoạch nào được lưu.' }}
						/>
					</Card>
				</Col>
			</Row>

			<Modal
				title={idDangSua ? 'Cập nhật điểm đến' : 'Thêm điểm đến mới'}
				visible={dangMoModal}
				onCancel={dongModal}
				onOk={xuLyLuu}
				okText='Lưu'
				cancelText='Hủy'
				width={900}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Row gutter={[16, 0]}>
						<Col xs={24} md={12}>
							<Form.Item
								label='Tên điểm đến'
								name='tenDiaDiem'
								rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến.' }]}
							>
								<Input placeholder='Ví dụ: Đà Nẵng' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Địa điểm'
								name='diaDiem'
								rules={[{ required: true, message: 'Vui lòng nhập địa điểm.' }]}
							>
								<Input placeholder='Ví dụ: Đà Nẵng' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Loại hình'
								name='loaiHinh'
								rules={[{ required: true, message: 'Vui lòng chọn loại hình.' }]}
							>
								<Select>
									<Select.Option value='bien'>Biển</Select.Option>
									<Select.Option value='nui'>Núi</Select.Option>
									<Select.Option value='thanh_pho'>Thành phố</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Vùng miền'
								name='vungMien'
								rules={[{ required: true, message: 'Vui lòng chọn vùng miền.' }]}
							>
								<Select>
									<Select.Option value='bac'>Miền Bắc</Select.Option>
									<Select.Option value='trung'>Miền Trung</Select.Option>
									<Select.Option value='nam'>Miền Nam</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item
								label='Rating'
								name='rating'
								rules={[{ required: true, message: 'Vui lòng nhập rating.' }]}
							>
								<InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item
								label='Thời gian tham quan (giờ)'
								name='thoiGianThamQuan'
								rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan.' }]}
							>
								<InputNumber min={1} max={24} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item
								label='Chi phí ăn uống'
								name='chiPhiAnUong'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống.' }]}
							>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Chi phí lưu trú'
								name='chiPhiLuuTru'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí lưu trú.' }]}
							>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Chi phí di chuyển'
								name='chiPhiDiChuyen'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển.' }]}
							>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label='Mô tả'
								name='moTa'
								rules={[{ required: true, message: 'Vui lòng nhập mô tả điểm đến.' }]}
							>
								<TextArea rows={4} placeholder='Mô tả trải nghiệm, điểm nổi bật, đối tượng phù hợp...' />
							</Form.Item>
						</Col>
						<Col xs={24} lg={14}>
							<Form.Item
								label='Link hình ảnh hoặc dữ liệu ảnh'
								name='hinhAnh'
								rules={[{ required: true, message: 'Vui lòng cung cấp hình ảnh.' }]}
							>
								<Input placeholder='Dán link ảnh hoặc dùng nút tải ảnh từ máy' onChange={(event) => setAnhXemTruoc(event.target.value)} />
							</Form.Item>
						</Col>
						<Col xs={24} lg={10}>
							<Space direction='vertical' size={8} style={{ width: '100%' }}>
								<Text strong>Tải ảnh từ máy</Text>
								<Upload showUploadList={false} beforeUpload={xuLyTaiAnh} accept='image/*'>
									<Button icon={<UploadOutlined />}>Chọn ảnh</Button>
								</Upload>
							</Space>
						</Col>
						<Col span={24}>
							{anhXemTruoc ? (
								<Card size='small'>
									<Space direction='vertical' size={8}>
										<Text strong>Xem trước hình ảnh</Text>
										<Image
											src={anhXemTruoc}
											alt='Hình xem trước'
											width={220}
											height={140}
											style={{ objectFit: 'cover', borderRadius: 8 }}
										/>
									</Space>
								</Card>
							) : null}
						</Col>
					</Row>
				</Form>
			</Modal>
		</Space>
	);
};

export default Admin;
