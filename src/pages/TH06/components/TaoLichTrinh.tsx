import type { DiemDen, HuongSapXep, LichTrinh } from '../types';
import {
	CalendarOutlined,
	ClearOutlined,
	ClockCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	SaveOutlined,
	UpOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Empty,
	InputNumber,
	List,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Tag,
	Typography,
	message,
} from 'antd';
import { useState } from 'react';
import {
	dinhDangTien,
	nhomLichTrinhTheoNgay,
	tinhThoiGianDiChuyenGiuaHaiDiem,
	tinhTongChiPhiDiemDen,
	tinhTongChiPhiLichTrinh,
	tinhTongThoiGianDiChuyen,
	tinhTongThoiGianThamQuan,
} from '../helpers';

const { Paragraph, Text, Title } = Typography;

interface TaoLichTrinhProps {
	danhSachDiemDen: DiemDen[];
	lichTrinh: LichTrinh[];
	tongSoKeHoachDaLuu: number;
	onThemMuc: (diemDenId: string, ngay: number) => void;
	onXoaMuc: (id: string) => void;
	onSapXepMuc: (id: string, huong: HuongSapXep) => void;
	onLuuKeHoach: () => void;
	onXoaTatCa: () => void;
}

const TaoLichTrinh = ({
	danhSachDiemDen,
	lichTrinh,
	tongSoKeHoachDaLuu,
	onThemMuc,
	onXoaMuc,
	onSapXepMuc,
	onLuuKeHoach,
	onXoaTatCa,
}: TaoLichTrinhProps) => {
	const [diemDenDangChon, setDiemDenDangChon] = useState<string>();
	const [ngayDangChon, setNgayDangChon] = useState<number>(1);

	const danhSachTheoNgay = nhomLichTrinhTheoNgay(lichTrinh);
	const tongChiPhi = tinhTongChiPhiLichTrinh(lichTrinh);
	const tongThoiGianThamQuan = tinhTongThoiGianThamQuan(lichTrinh);
	const tongThoiGianDiChuyen = tinhTongThoiGianDiChuyen(lichTrinh);

	const themVaoLichTrinh = () => {
		if (!diemDenDangChon) {
			message.warning('Vui lòng chọn điểm đến trước khi thêm vào lịch trình.');
			return;
		}

		onThemMuc(diemDenDangChon, ngayDangChon);
		message.success(`Đã thêm điểm đến vào ngày ${ngayDangChon}.`);
	};

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Điểm đến đã chọn' value={lichTrinh.length} prefix={<CalendarOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Thời gian tham quan' value={tongThoiGianThamQuan} suffix='giờ' />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Thời gian di chuyển' value={tongThoiGianDiChuyen} suffix='giờ' />
					</Card>
				</Col>
				<Col xs={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Ngân sách dự tính' value={dinhDangTien(tongChiPhi)} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={8}>
					<Card title='Tạo lịch trình du lịch'>
						<Space direction='vertical' size={16} style={{ width: '100%' }}>
							<Text type='secondary'>
								Chọn ngày và điểm đến từ danh sách có sẵn. Bạn có thể xóa hoặc thay đổi thứ tự ngay trong từng ngày.
							</Text>

							<div>
								<Text strong>Ngày du lịch</Text>
								<InputNumber
									min={1}
									max={15}
									value={ngayDangChon}
									onChange={(value) => setNgayDangChon(value || 1)}
									style={{ width: '100%', marginTop: 8 }}
								/>
							</div>

							<div>
								<Text strong>Điểm đến</Text>
								<Select
									showSearch
									placeholder='Chọn điểm đến'
									value={diemDenDangChon}
									onChange={setDiemDenDangChon}
									optionFilterProp='children'
									style={{ width: '100%', marginTop: 8 }}
								>
									{danhSachDiemDen.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.tenDiaDiem} - {item.diaDiem}
										</Select.Option>
									))}
								</Select>
							</div>

							<Space wrap>
								<Button type='primary' onClick={themVaoLichTrinh}>
									Thêm vào ngày {ngayDangChon}
								</Button>
								<Button icon={<SaveOutlined />} onClick={onLuuKeHoach} disabled={lichTrinh.length === 0}>
									Lưu lịch trình
								</Button>
							</Space>

							<Popconfirm
								title='Xóa toàn bộ lịch trình hiện tại?'
								okText='Xóa'
								cancelText='Hủy'
								onConfirm={onXoaTatCa}
								disabled={lichTrinh.length === 0}
							>
								<Button danger icon={<ClearOutlined />} disabled={lichTrinh.length === 0}>
									Làm trống lịch trình
								</Button>
							</Popconfirm>

							<Card size='small'>
								<Space direction='vertical' size={4}>
									<Text strong>Tiện ích hiện có</Text>
									<Text type='secondary'>Đã lưu {tongSoKeHoachDaLuu} kế hoạch vào thống kê quản trị.</Text>
									<Text type='secondary'>Chi phí và thời gian sẽ tự động cập nhật theo danh sách hiện tại.</Text>
								</Space>
							</Card>
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={16}>
					<Card title='Lịch trình theo ngày'>
						{danhSachTheoNgay.length === 0 ? (
							<Empty description='Chưa có điểm đến nào trong lịch trình.' />
						) : (
							<Space direction='vertical' size={16} style={{ width: '100%' }}>
								{danhSachTheoNgay.map((nhom) => (
									<Card
										key={nhom.ngay}
										type='inner'
										title={`Ngày ${nhom.ngay}`}
										extra={<Tag color='processing'>{nhom.danhSach.length} điểm đến</Tag>}
									>
										<List
											dataSource={nhom.danhSach}
											renderItem={(item, index) => {
												const thoiGianDiChuyen =
													index === 0 ? 0 : tinhThoiGianDiChuyenGiuaHaiDiem(nhom.danhSach[index - 1].diemDen, item.diemDen);

												return (
													<List.Item
														actions={[
															<Button
																key='len'
																size='small'
																icon={<UpOutlined />}
																onClick={() => onSapXepMuc(item.id, 'len')}
																disabled={index === 0}
															/>,
															<Button
																key='xuong'
																size='small'
																icon={<DownOutlined />}
																onClick={() => onSapXepMuc(item.id, 'xuong')}
																disabled={index === nhom.danhSach.length - 1}
															/>,
															<Popconfirm
																key='xoa'
																title='Xóa điểm đến này khỏi lịch trình?'
																okText='Xóa'
																cancelText='Hủy'
																onConfirm={() => onXoaMuc(item.id)}
															>
																<Button size='small' danger icon={<DeleteOutlined />} />
															</Popconfirm>,
														]}
													>
														<List.Item.Meta
															title={
																<Space wrap>
																	<Title level={5} style={{ margin: 0 }}>
																		{item.thuTu}. {item.diemDen.tenDiaDiem}
																	</Title>
																	<Tag>{item.diemDen.diaDiem}</Tag>
																</Space>
															}
															description={
																<Space direction='vertical' size={8} style={{ width: '100%' }}>
																	<Paragraph style={{ marginBottom: 0 }}>{item.diemDen.moTa}</Paragraph>
																	<Space wrap>
																		<Tag icon={<ClockCircleOutlined />}>
																			Tham quan {item.diemDen.thoiGianThamQuan} giờ
																		</Tag>
																		<Tag color='purple'>
																			Di chuyển {thoiGianDiChuyen === 0 ? 'khởi hành' : `${thoiGianDiChuyen} giờ`}
																		</Tag>
																		<Tag color='volcano'>{dinhDangTien(tinhTongChiPhiDiemDen(item.diemDen))}</Tag>
																	</Space>
																</Space>
															}
														/>
													</List.Item>
												);
											}}
										/>
									</Card>
								))}
							</Space>
						)}
					</Card>
				</Col>
			</Row>
		</Space>
	);
};

export default TaoLichTrinh;
