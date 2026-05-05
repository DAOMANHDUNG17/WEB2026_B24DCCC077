import LineChart from '@/components/Chart/LineChart';
import { Card, Empty } from 'antd';

type Props = {
	nhanTrucX: string[];
	duLieu: number[];
};

const BieuDoCanNang = ({ nhanTrucX, duLieu }: Props) => {
	return (
		<Card title='Sự thay đổi cân nặng theo thời gian'>
			{duLieu.length > 0 ? (
				<LineChart
					title='Cân nặng'
					xAxis={nhanTrucX}
					yAxis={[duLieu]}
					yLabel={['Cân nặng']}
					height={320}
					formatY={(giaTri) => `${giaTri} kg`}
					colors={['#13c2c2']}
					otherOptions={{
						stroke: {
							curve: 'smooth',
							width: 3,
						},
						markers: {
							size: 5,
						},
					}}
				/>
			) : (
				<Empty description='Chưa có dữ liệu chỉ số sức khỏe' />
			)}
		</Card>
	);
};

export default BieuDoCanNang;
