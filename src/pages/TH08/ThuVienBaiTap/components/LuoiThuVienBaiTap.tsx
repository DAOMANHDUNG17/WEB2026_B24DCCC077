import { Button, Card, Col, Empty, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import type { MouseEvent } from 'react';
import { layMauMucDoKho, layNhanMucDoKho, layNhanNhomCo } from '../../helpers';
import type { BaiTapThuVien } from '../../types';

type Props = {
	danhSachBaiTap: BaiTapThuVien[];
	onXemChiTiet: (baiTap: BaiTapThuVien) => void;
	onSua: (baiTap: BaiTapThuVien) => void;
	onXoa: (id: string) => void;
};

const chanSuKienNoiBot = (suKien: MouseEvent<HTMLElement>) => {
	suKien.stopPropagation();
};

const LuoiThuVienBaiTap = ({ danhSachBaiTap, onXemChiTiet, onSua, onXoa }: Props) => {
	if (danhSachBaiTap.length === 0) {
		return <Empty description='Không có bài tập phù hợp bộ lọc' />;
	}

	return (
		<Row gutter={[16, 16]}>
			{danhSachBaiTap.map((item) => (
				<Col xs={24} md={12} xl={8} key={item.id}>
					<Card
						hoverable
						onClick={() => onXemChiTiet(item)}
						title={item.tenBaiTap}
						extra={<Tag color={layMauMucDoKho(item.mucDoKho)}>{layNhanMucDoKho(item.mucDoKho)}</Tag>}
					>
						<Space direction='vertical' size='middle' style={{ width: '100%' }}>
							<div>
								<Typography.Text type='secondary'>Nhóm cơ tác động</Typography.Text>
								<div>{layNhanNhomCo(item.nhomCo)}</div>
							</div>
							<div>
								<Typography.Text type='secondary'>Mô tả ngắn</Typography.Text>
								<Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
									{item.moTaNgan}
								</Typography.Paragraph>
							</div>
							<div>
								<Typography.Text type='secondary'>Calo đốt trung bình/giờ</Typography.Text>
								<div>{item.caloTrungBinhMoiGio} kcal</div>
							</div>
							<Space>
								<Button
									type='link'
									onClick={(suKien) => {
										chanSuKienNoiBot(suKien);
										onSua(item);
									}}
								>
									Sửa
								</Button>
								<Popconfirm
									title={`Xóa bài tập "${item.tenBaiTap}"?`}
									okText='Xóa'
									cancelText='Hủy'
									onConfirm={() => onXoa(item.id)}
								>
									<Button
										type='link'
										danger
										onClick={(suKien) => {
											chanSuKienNoiBot(suKien);
										}}
									>
										Xóa
									</Button>
								</Popconfirm>
							</Space>
						</Space>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default LuoiThuVienBaiTap;
