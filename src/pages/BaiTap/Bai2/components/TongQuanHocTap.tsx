import { Card, Col, Row, Statistic } from 'antd';

type ThuocTinh = {
	tongMonHoc: number;
	tongBuoiHocTrongThang: number;
	tongPhutHocTrongThang: number;
};

const TongQuanHocTap = ({ tongMonHoc, tongBuoiHocTrongThang, tongPhutHocTrongThang }: ThuocTinh) => {
	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title='Tổng môn học' value={tongMonHoc} />
				</Card>
			</Col>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title='Số buổi học trong tháng' value={tongBuoiHocTrongThang} />
				</Card>
			</Col>
			<Col xs={24} md={8}>
				<Card>
					<Statistic title='Tổng thời lượng (phút)' value={tongPhutHocTrongThang} />
				</Card>
			</Col>
		</Row>
	);
};

export default TongQuanHocTap;

