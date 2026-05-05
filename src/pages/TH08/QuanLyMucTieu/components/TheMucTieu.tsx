import { Button, Card, Col, InputNumber, Popconfirm, Progress, Row, Space, Tag, Typography } from 'antd';
import { dinhDangNgay, layMauTrangThaiMucTieu, layNhanLoaiMucTieu, layNhanTrangThaiMucTieu, tinhPhanTramMucTieu } from '../../helpers';
import type { MucTieu } from '../../types';

type Props = {
	danhSachMucTieu: MucTieu[];
	onSua: (mucTieu: MucTieu) => void;
	onXoa: (id: string) => void;
	onCapNhatGiaTriHienTai: (id: string, giaTri: number) => void;
};

const TheMucTieu = ({ danhSachMucTieu, onSua, onXoa, onCapNhatGiaTriHienTai }: Props) => {
	return (
		<Row gutter={[16, 16]}>
			{danhSachMucTieu.map((item) => {
				const phanTram = tinhPhanTramMucTieu(item.giaTriHienTai, item.giaTriMucTieu);

				return (
					<Col xs={24} md={12} xl={8} key={item.id}>
						<Card
							title={item.tenMucTieu}
							extra={
								<Space>
									<Button type='link' onClick={() => onSua(item)}>
										Sửa
									</Button>
									<Popconfirm
										title={`Xóa mục tiêu "${item.tenMucTieu}"?`}
										okText='Xóa'
										cancelText='Hủy'
										onConfirm={() => onXoa(item.id)}
									>
										<Button type='link' danger>
											Xóa
										</Button>
									</Popconfirm>
								</Space>
							}
						>
							<Space direction='vertical' size='middle' style={{ width: '100%' }}>
								<Space wrap>
									<Tag color='blue'>{layNhanLoaiMucTieu(item.loaiMucTieu)}</Tag>
									<Tag color={layMauTrangThaiMucTieu(item.trangThai)}>{layNhanTrangThaiMucTieu(item.trangThai)}</Tag>
								</Space>
								<div>
									<Typography.Text type='secondary'>Giá trị mục tiêu</Typography.Text>
									<div>
										<Typography.Text strong>
											{item.giaTriMucTieu} {item.donVi}
										</Typography.Text>
									</div>
								</div>
								<div>
									<Typography.Text type='secondary'>Giá trị hiện tại</Typography.Text>
									<div style={{ marginTop: 8 }}>
										<InputNumber
											min={0}
											step={item.donVi === 'kg' ? 0.1 : 1}
											style={{ width: '100%' }}
											value={item.giaTriHienTai}
											disabled={item.trangThai === 'da_huy'}
											onChange={(giaTri) => onCapNhatGiaTriHienTai(item.id, Number(giaTri || 0))}
										/>
									</div>
								</div>
								<Progress percent={phanTram} status={item.trangThai === 'da_huy' ? 'normal' : undefined} />
								<div>
									<Typography.Text type='secondary'>Deadline</Typography.Text>
									<div>{dinhDangNgay(item.deadline)}</div>
								</div>
							</Space>
						</Card>
					</Col>
				);
			})}
		</Row>
	);
};

export default TheMucTieu;
