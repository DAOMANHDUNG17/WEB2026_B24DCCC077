import { Card, Col, Row, Statistic } from 'antd';

type Props = {
	tongBuoiTap: number;
	tongCalo: number;
	streak: number;
	tienDoMucTieu: number;
};

const ThongKeTongQuan = ({ tongBuoiTap, tongCalo, streak, tienDoMucTieu }: Props) => {
	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Tổng buổi tập trong tháng' value={tongBuoiTap} suffix='buổi' />
				</Card>
			</Col>
			<Col xs={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Tổng calo đã đốt' value={tongCalo} suffix='kcal' />
				</Card>
			</Col>
			<Col xs={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Số ngày tập liên tiếp' value={streak} suffix='ngày' />
				</Card>
			</Col>
			<Col xs={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Mục tiêu hoàn thành' value={tienDoMucTieu} suffix='%' />
				</Card>
			</Col>
		</Row>
	);
};

export default ThongKeTongQuan;
