import type { LichTrinh } from '../types';
import DonutChart from '@/components/Chart/DonutChart';
import { Alert, Card, Col, Empty, InputNumber, Progress, Row, Space, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
	dinhDangTien,
	tinhTongChiPhiDiemDen,
	tinhTongChiPhiLichTrinh,
	tinhTongTheoHangMuc,
	tinhTongThoiGianDiChuyen,
} from '../helpers';

const { Text, Title } = Typography;

interface NganSachProps {
	lichTrinh: LichTrinh[];
	nganSachToiDa: number;
	onCapNhatNganSach: (giaTri: number) => void;
}

const NganSach = ({ lichTrinh, nganSachToiDa, onCapNhatNganSach }: NganSachProps) => {
	const tongTheoHangMuc = tinhTongTheoHangMuc(lichTrinh);
	const tongChiPhi = tinhTongChiPhiLichTrinh(lichTrinh);
	const tongThoiGianDiChuyen = tinhTongThoiGianDiChuyen(lichTrinh);
	const nganSachConLai = nganSachToiDa - tongChiPhi;
	const vuotNganSach = tongChiPhi > nganSachToiDa;
	const phanTramSuDung = nganSachToiDa > 0 ? Math.round((tongChiPhi / nganSachToiDa) * 100) : 0;

	const cotBang: ColumnsType<LichTrinh> = [
		{
			title: 'Điểm đến',
			dataIndex: ['diemDen', 'tenDiaDiem'],
			key: 'tenDiaDiem',
		},
		{
			title: 'Ngày',
			dataIndex: 'ngay',
			key: 'ngay',
			width: 90,
			render: (ngay: number) => `Ngày ${ngay}`,
		},
		{
			title: 'Tổng chi phí',
			key: 'tongChiPhi',
			width: 180,
			render: (_, banGhi) => dinhDangTien(tinhTongChiPhiDiemDen(banGhi.diemDen)),
		},
	];

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Card>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} lg={12}>
						<Space direction='vertical' size={8} style={{ width: '100%' }}>
							<Title level={4} style={{ margin: 0 }}>
								Quản lý ngân sách
							</Title>
							<Text type='secondary'>
								Thiết lập ngân sách tổng để hệ thống tự so sánh, cảnh báo vượt mức và hiển thị phân bổ theo hạng mục.
							</Text>
						</Space>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Text strong>Ngân sách tối đa</Text>
						<InputNumber
							min={0}
							step={500000}
							value={nganSachToiDa}
							onChange={(value) => onCapNhatNganSach(value || 0)}
							style={{ width: '100%', marginTop: 8 }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Text strong>Tỷ lệ sử dụng</Text>
						<div style={{ marginTop: 8 }}>
							<Progress
								percent={Math.min(phanTramSuDung, 100)}
								status={vuotNganSach ? 'exception' : 'active'}
								format={() => `${phanTramSuDung}%`}
							/>
						</div>
					</Col>
				</Row>
			</Card>

			{lichTrinh.length === 0 ? (
				<Card>
					<Empty description='Chưa có dữ liệu ngân sách vì lịch trình hiện đang trống.' />
				</Card>
			) : (
				<>
					<Alert
						type={vuotNganSach ? 'error' : 'success'}
						showIcon
						message={
							vuotNganSach
								? `Bạn đã vượt ngân sách ${dinhDangTien(Math.abs(nganSachConLai))}. Hãy điều chỉnh lại lịch trình hoặc tăng ngân sách.`
								: `Ngân sách vẫn trong mức an toàn. Còn lại ${dinhDangTien(nganSachConLai)} để phân bổ thêm.`
						}
					/>

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} xl={6}>
							<Card>
								<Statistic title='Tổng chi phí' value={dinhDangTien(tongChiPhi)} />
							</Card>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Card>
								<Statistic title='Ăn uống' value={dinhDangTien(tongTheoHangMuc.anUong)} />
							</Card>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Card>
								<Statistic title='Lưu trú' value={dinhDangTien(tongTheoHangMuc.luuTru)} />
							</Card>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Card>
								<Statistic title='Di chuyển' value={dinhDangTien(tongTheoHangMuc.diChuyen)} suffix={`| ${tongThoiGianDiChuyen} giờ`} />
							</Card>
						</Col>
					</Row>

					<Row gutter={[16, 16]}>
						<Col xs={24} xl={12}>
							<Card title='Biểu đồ phân bổ ngân sách'>
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
						<Col xs={24} xl={12}>
							<Card title='Chi tiết từng hạng mục'>
								<Space direction='vertical' size={16} style={{ width: '100%' }}>
									<div>
										<Text strong>Ăn uống: {dinhDangTien(tongTheoHangMuc.anUong)}</Text>
										<Progress percent={tongChiPhi ? Math.round((tongTheoHangMuc.anUong / tongChiPhi) * 100) : 0} strokeColor='#ff7a45' />
									</div>
									<div>
										<Text strong>Lưu trú: {dinhDangTien(tongTheoHangMuc.luuTru)}</Text>
										<Progress percent={tongChiPhi ? Math.round((tongTheoHangMuc.luuTru / tongChiPhi) * 100) : 0} strokeColor='#597ef7' />
									</div>
									<div>
										<Text strong>Di chuyển: {dinhDangTien(tongTheoHangMuc.diChuyen)}</Text>
										<Progress percent={tongChiPhi ? Math.round((tongTheoHangMuc.diChuyen / tongChiPhi) * 100) : 0} strokeColor='#36cfc9' />
									</div>
								</Space>
							</Card>
						</Col>
					</Row>

					<Card title='Các điểm đến đang tiêu tốn nhiều ngân sách'>
						<Table
							rowKey='id'
							pagination={false}
							columns={cotBang}
							dataSource={[...lichTrinh].sort((a, b) => tinhTongChiPhiDiemDen(b.diemDen) - tinhTongChiPhiDiemDen(a.diemDen))}
						/>
					</Card>
				</>
			)}
		</Space>
	);
};

export default NganSach;
