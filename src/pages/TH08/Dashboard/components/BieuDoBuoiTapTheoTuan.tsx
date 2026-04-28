import ColumnChart from '@/components/Chart/ColumnChart';
import { Card, Empty } from 'antd';

type Props = {
	nhanTrucX: string[];
	duLieu: number[];
};

const BieuDoBuoiTapTheoTuan = ({ nhanTrucX, duLieu }: Props) => {
	return (
		<Card title='Số buổi tập theo từng tuần trong tháng'>
			{duLieu.length > 0 ? (
				<ColumnChart
					title='Số buổi tập'
					xAxis={nhanTrucX}
					yAxis={[duLieu]}
					yLabel={['Buổi tập']}
					height={320}
					formatY={(giaTri) => `${giaTri} buổi`}
				/>
			) : (
				<Empty description='Chưa có dữ liệu buổi tập' />
			)}
		</Card>
	);
};

export default BieuDoBuoiTapTheoTuan;
