import ColumnChart from '@/components/Chart/ColumnChart';
import type { CauLacBo, DonDangKy, LichSuThaoTac } from './types';
import { Card, Col, Row, Space, Statistic, Table, Tag, Timeline, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

type Props = {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	lichSuThaoTac: LichSuThaoTac[];
};

type DongThongKe = {
	id: string;
	tenCauLacBo: string;
	pending: number;
	approved: number;
	rejected: number;
	tong: number;
};

const BaoCaoThongKe = ({ danhSachCauLacBo, danhSachDonDangKy, lichSuThaoTac }: Props) => {
	const tongPending = danhSachDonDangKy.filter((item) => item.trangThai === 'Pending').length;
	const tongApproved = danhSachDonDangKy.filter((item) => item.trangThai === 'Approved').length;
	const tongRejected = danhSachDonDangKy.filter((item) => item.trangThai === 'Rejected').length;

	const duLieuThongKe = useMemo<DongThongKe[]>(() => {
		return danhSachCauLacBo.map((cauLacBo) => {
			const cacDonTheoClb = danhSachDonDangKy.filter((item) => item.idCauLacBo === cauLacBo.id);
			const pending = cacDonTheoClb.filter((item) => item.trangThai === 'Pending').length;
			const approved = cacDonTheoClb.filter((item) => item.trangThai === 'Approved').length;
			const rejected = cacDonTheoClb.filter((item) => item.trangThai === 'Rejected').length;

			return {
				id: cauLacBo.id,
				tenCauLacBo: cauLacBo.tenCauLacBo,
				pending,
				approved,
				rejected,
				tong: pending + approved + rejected,
			};
		});
	}, [danhSachCauLacBo, danhSachDonDangKy]);

	const columns: ColumnsType<DongThongKe> = [
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			key: 'tenCauLacBo',
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Pending',
			dataIndex: 'pending',
			key: 'pending',
			align: 'center',
			render: (value: number) => <Tag color='orange'>{value}</Tag>,
		},
		{
			title: 'Approved',
			dataIndex: 'approved',
			key: 'approved',
			align: 'center',
			render: (value: number) => <Tag color='green'>{value}</Tag>,
		},
		{
			title: 'Rejected',
			dataIndex: 'rejected',
			key: 'rejected',
			align: 'center',
			render: (value: number) => <Tag color='red'>{value}</Tag>,
		},
		{
			title: 'Tổng',
			dataIndex: 'tong',
			key: 'tong',
			align: 'center',
			render: (value: number) => <Tag color='blue'>{value}</Tag>,
		},
	];

	return (
		<Space direction='vertical' size='middle' style={{ width: '100%' }}>
			<Typography.Title level={4} style={{ marginBottom: 0 }}>
				Báo cáo và thống kê hoạt động
			</Typography.Title>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={12} xl={6}>
					<Card bordered={false}>
						<Statistic title='Số câu lạc bộ' value={danhSachCauLacBo.length} prefix={<TeamOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card bordered={false}>
						<Statistic title='Số đơn Pending' value={tongPending} valueStyle={{ color: '#fa8c16' }} prefix={<ClockCircleOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card bordered={false}>
						<Statistic title='Số đơn Approved' value={tongApproved} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card bordered={false}>
						<Statistic title='Số đơn Rejected' value={tongRejected} valueStyle={{ color: '#cf1322' }} prefix={<CloseCircleOutlined />} />
					</Card>
				</Col>
			</Row>

			<Card title='ColumnChart: Số đơn đăng ký theo từng CLB' bordered={false}>
				<ColumnChart
					title='Số đơn đăng ký theo từng câu lạc bộ'
					xAxis={duLieuThongKe.map((item) => item.tenCauLacBo)}
					yAxis={[
						duLieuThongKe.map((item) => item.pending),
						duLieuThongKe.map((item) => item.approved),
						duLieuThongKe.map((item) => item.rejected),
					]}
					yLabel={['Pending', 'Approved', 'Rejected']}
					colors={['#fa8c16', '#52c41a', '#ff4d4f']}
					formatY={(value) => `${Math.round(value)}`}
					height={360}
				/>
			</Card>

			<Card title='Bảng thống kê chi tiết theo câu lạc bộ' bordered={false}>
				<Table<DongThongKe>
					rowKey='id'
					columns={columns}
					dataSource={duLieuThongKe}
					pagination={false}
					locale={{ emptyText: 'Chưa có dữ liệu thống kê.' }}
				/>
			</Card>

			<Card title='Lịch sử hoạt động gần đây' bordered={false}>
				<Timeline>
					{lichSuThaoTac.slice(0, 8).map((item) => (
						<Timeline.Item key={item.id}>
							<div style={{ fontWeight: 500 }}>{item.noiDung}</div>
							<div style={{ color: '#8c8c8c' }}>
								{item.nguoiThucHien} - {item.thoiGian}
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</Space>
	);
};

export default BaoCaoThongKe;
