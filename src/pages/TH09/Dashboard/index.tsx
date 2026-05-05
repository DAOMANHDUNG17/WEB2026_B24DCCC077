import { CheckCircleOutlined, ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, List, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { Link } from 'umi';
import { dinhDangNgay, laTaskQuaHan, layMauMucDoUuTien, layMauTrangThaiTask, layNhanMucDoUuTien, layNhanTrangThaiTask, layTaskSapToiHan, layThongKeTask } from '../helpers';
import useQuanLyTask from '../useQuanLyTask';

const DashboardTH09 = () => {
	const { danhSachTask } = useQuanLyTask();

	const thongKe = useMemo(() => layThongKeTask(danhSachTask), [danhSachTask]);
	const danhSachSapToiHan = useMemo(() => layTaskSapToiHan(danhSachTask), [danhSachTask]);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<div>
					<Typography.Title level={3} style={{ marginBottom: 8 }}>
						TH09 - Dashboard quản lý công việc cá nhân
					</Typography.Title>
					<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
						Theo dõi nhanh tổng số task, tiến độ hoàn thành và các đầu việc đang quá hạn trong hệ thống Kanban cá nhân.
					</Typography.Paragraph>
				</div>

				<Space wrap>
					<Link to='/th09/kanban-board'>
						<Button>Kanban Board</Button>
					</Link>
					<Link to='/th09/danh-sach-task'>
						<Button type='primary'>Danh sách task</Button>
					</Link>
				</Space>
			</Space>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Tổng số task'
							value={thongKe.tongTask}
							prefix={<ProfileOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Task hoàn thành'
							value={thongKe.taskHoanThanh}
							valueStyle={{ color: '#389e0d' }}
							prefix={<CheckCircleOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Task quá hạn'
							value={thongKe.taskQuaHan}
							valueStyle={{ color: '#cf1322' }}
							prefix={<ClockCircleOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Task sắp tới hạn'>
				{danhSachSapToiHan.length ? (
					<List
						dataSource={danhSachSapToiHan}
						renderItem={(task) => (
							<List.Item
								actions={[
									<Tag color={layMauTrangThaiTask(task.trangThai)} key='trang-thai'>
										{layNhanTrangThaiTask(task.trangThai)}
									</Tag>,
								]}
							>
								<List.Item.Meta
									title={
										<Space wrap size={[8, 8]}>
											<Typography.Text strong>{task.tenTask}</Typography.Text>
											<Tag color={layMauMucDoUuTien(task.mucDoUuTien)}>
												{layNhanMucDoUuTien(task.mucDoUuTien)}
											</Tag>
											{laTaskQuaHan(task) ? <Tag color='error'>Quá hạn</Tag> : null}
										</Space>
									}
									description={
										<Space direction='vertical' size={4}>
											<Typography.Text type='secondary'>{`Deadline: ${dinhDangNgay(task.deadline)}`}</Typography.Text>
											{task.moTa ? <Typography.Text type='secondary'>{task.moTa}</Typography.Text> : null}
										</Space>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có task đang mở' />
				)}
			</Card>
		</Space>
	);
};

export default DashboardTH09;
