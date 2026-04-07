import type { DiemDen, LoaiHinh } from '../types';
import {
	ClockCircleOutlined,
	EnvironmentOutlined,
	FilterOutlined,
	StarFilled,
	WalletOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Rate, Row, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import {
	dinhDangTien,
	layMauLoaiHinh,
	layNhanLoaiHinh,
	layNhanVungMien,
	tinhTongChiPhiDiemDen,
} from '../helpers';

const { Paragraph, Text, Title } = Typography;

interface KhamPhaProps {
	danhSachDiemDen: DiemDen[];
}

type MucGiaLoc = 'tat_ca' | 'duoi_2000000' | 'tu_2000000_den_3000000' | 'tren_3000000';
type SapXepTheo = 'de_xuat' | 'rating_giam' | 'rating_tang' | 'gia_tang' | 'gia_giam';

const KhamPha = ({ danhSachDiemDen }: KhamPhaProps) => {
	const [loaiHinhLoc, setLoaiHinhLoc] = useState<LoaiHinh | 'tat_ca'>('tat_ca');
	const [mucGiaLoc, setMucGiaLoc] = useState<MucGiaLoc>('tat_ca');
	const [danhGiaToiThieu, setDanhGiaToiThieu] = useState<number>(0);
	const [sapXepTheo, setSapXepTheo] = useState<SapXepTheo>('de_xuat');

	const danhSachSauLoc = danhSachDiemDen.filter((item) => {
		const tongChiPhi = tinhTongChiPhiDiemDen(item);
		const dungLoai = loaiHinhLoc === 'tat_ca' || item.loaiHinh === loaiHinhLoc;
		const dungDanhGia = item.rating >= danhGiaToiThieu;
		const dungMucGia =
			mucGiaLoc === 'tat_ca' ||
			(mucGiaLoc === 'duoi_2000000' && tongChiPhi < 2000000) ||
			(mucGiaLoc === 'tu_2000000_den_3000000' && tongChiPhi >= 2000000 && tongChiPhi <= 3000000) ||
			(mucGiaLoc === 'tren_3000000' && tongChiPhi > 3000000);

		return dungLoai && dungDanhGia && dungMucGia;
	});

	const danhSachHienThi = [...danhSachSauLoc].sort((a, b) => {
		if (sapXepTheo === 'rating_giam') {
			return b.rating - a.rating;
		}
		if (sapXepTheo === 'rating_tang') {
			return a.rating - b.rating;
		}
		if (sapXepTheo === 'gia_tang') {
			return tinhTongChiPhiDiemDen(a) - tinhTongChiPhiDiemDen(b);
		}
		if (sapXepTheo === 'gia_giam') {
			return tinhTongChiPhiDiemDen(b) - tinhTongChiPhiDiemDen(a);
		}
		return b.rating - a.rating;
	});

	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<Card>
				<Space direction='vertical' size={8} style={{ width: '100%' }}>
					<Space align='center'>
						<FilterOutlined />
						<Title level={4} style={{ margin: 0 }}>
							Khám phá điểm đến
						</Title>
					</Space>
					<Text type='secondary'>
						Lọc theo loại hình, mức giá và đánh giá để tìm điểm đến phù hợp với kế hoạch du lịch của bạn.
					</Text>
					<Row gutter={[12, 12]} style={{ marginTop: 4 }}>
						<Col xs={24} sm={12} xl={6}>
							<Select value={loaiHinhLoc} onChange={setLoaiHinhLoc} style={{ width: '100%' }}>
								<Select.Option value='tat_ca'>Tất cả loại hình</Select.Option>
								<Select.Option value='bien'>Biển</Select.Option>
								<Select.Option value='nui'>Núi</Select.Option>
								<Select.Option value='thanh_pho'>Thành phố</Select.Option>
							</Select>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Select value={mucGiaLoc} onChange={setMucGiaLoc} style={{ width: '100%' }}>
								<Select.Option value='tat_ca'>Tất cả mức giá</Select.Option>
								<Select.Option value='duoi_2000000'>Dưới 2.000.000đ</Select.Option>
								<Select.Option value='tu_2000000_den_3000000'>Từ 2.000.000đ đến 3.000.000đ</Select.Option>
								<Select.Option value='tren_3000000'>Trên 3.000.000đ</Select.Option>
							</Select>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Select value={danhGiaToiThieu} onChange={setDanhGiaToiThieu} style={{ width: '100%' }}>
								<Select.Option value={0}>Mọi đánh giá</Select.Option>
								<Select.Option value={4}>Từ 4.0 trở lên</Select.Option>
								<Select.Option value={4.5}>Từ 4.5 trở lên</Select.Option>
								<Select.Option value={4.8}>Từ 4.8 trở lên</Select.Option>
							</Select>
						</Col>
						<Col xs={24} sm={12} xl={6}>
							<Select value={sapXepTheo} onChange={setSapXepTheo} style={{ width: '100%' }}>
								<Select.Option value='de_xuat'>Đề xuất tốt nhất</Select.Option>
								<Select.Option value='rating_giam'>Đánh giá cao đến thấp</Select.Option>
								<Select.Option value='rating_tang'>Đánh giá thấp đến cao</Select.Option>
								<Select.Option value='gia_tang'>Chi phí tăng dần</Select.Option>
								<Select.Option value='gia_giam'>Chi phí giảm dần</Select.Option>
							</Select>
						</Col>
					</Row>
				</Space>
			</Card>

			{danhSachHienThi.length === 0 ? (
				<Card>
					<Empty description='Không có điểm đến nào phù hợp với bộ lọc hiện tại.' />
				</Card>
			) : (
				<Row gutter={[16, 16]}>
					{danhSachHienThi.map((item) => (
						<Col xs={24} sm={12} xl={8} key={item.id}>
							<Card
								hoverable
								cover={
									<img
										alt={item.tenDiaDiem}
										src={item.hinhAnh}
										style={{ height: 220, objectFit: 'cover' }}
									/>
								}
								bodyStyle={{ padding: 18 }}
							>
								<Space direction='vertical' size={12} style={{ width: '100%' }}>
									<Space wrap>
										<Tag color={layMauLoaiHinh(item.loaiHinh)}>{layNhanLoaiHinh(item.loaiHinh)}</Tag>
										<Tag>{layNhanVungMien(item.vungMien)}</Tag>
									</Space>

									<div>
										<Title level={4} style={{ marginBottom: 4 }}>
											{item.tenDiaDiem}
										</Title>
										<Space size={6} align='center'>
											<EnvironmentOutlined />
											<Text type='secondary'>{item.diaDiem}</Text>
										</Space>
									</div>

									<Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: 66, marginBottom: 0 }}>
										{item.moTa}
									</Paragraph>

									<Row gutter={[8, 8]}>
										<Col span={12}>
											<Space size={4} align='center'>
												<StarFilled style={{ color: '#faad14' }} />
												<Text strong>{item.rating.toFixed(1)}</Text>
											</Space>
											<div>
												<Rate disabled allowHalf value={Math.round(item.rating * 2) / 2} style={{ fontSize: 14 }} />
											</div>
										</Col>
										<Col span={12}>
											<Space size={4} align='center'>
												<ClockCircleOutlined />
												<Text strong>{item.thoiGianThamQuan} giờ</Text>
											</Space>
										</Col>
									</Row>

									<Space align='center' size={6}>
										<WalletOutlined style={{ color: '#cf1322' }} />
										<Text strong>{dinhDangTien(tinhTongChiPhiDiemDen(item))}</Text>
									</Space>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</Space>
	);
};

export default KhamPha;
