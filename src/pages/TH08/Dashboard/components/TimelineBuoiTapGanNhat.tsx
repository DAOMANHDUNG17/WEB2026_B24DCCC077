import { Card, Empty, Tag, Timeline, Typography } from 'antd';
import { dinhDangNgay, layMauTrangThaiBuoiTap, layNhanLoaiBaiTap, layNhanTrangThaiBuoiTap } from '../../helpers';
import type { BuoiTap } from '../../types';

type Props = {
	danhSachBuoiTap: BuoiTap[];
};

const TimelineBuoiTapGanNhat = ({ danhSachBuoiTap }: Props) => {
	return (
		<Card title='5 buổi tập gần nhất'>
			{danhSachBuoiTap.length > 0 ? (
				<Timeline>
					{danhSachBuoiTap.map((item) => (
						<Timeline.Item key={item.id} color={item.trangThai === 'hoan_thanh' ? 'green' : 'orange'}>
							<Typography.Text strong>{item.tenBaiTap}</Typography.Text>
							<div>{dinhDangNgay(item.ngayTap, 'DD/MM/YYYY HH:mm')}</div>
							<div>
								<Tag color='blue'>{layNhanLoaiBaiTap(item.loaiBaiTap)}</Tag>
								<Tag color={layMauTrangThaiBuoiTap(item.trangThai)}>{layNhanTrangThaiBuoiTap(item.trangThai)}</Tag>
							</div>
							<div>
								{item.thoiLuongPhut} phút - {item.caloDot} kcal
							</div>
							{item.ghiChu ? <Typography.Text type='secondary'>{item.ghiChu}</Typography.Text> : null}
						</Timeline.Item>
					))}
				</Timeline>
			) : (
				<Empty description='Chưa có buổi tập nào' />
			)}
		</Card>
	);
};

export default TimelineBuoiTapGanNhat;
