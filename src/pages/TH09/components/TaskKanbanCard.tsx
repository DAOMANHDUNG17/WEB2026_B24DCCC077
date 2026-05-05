import { CalendarOutlined, DeleteOutlined, EditOutlined, FlagOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Tag, Typography } from 'antd';
import { dinhDangNgay, laTaskQuaHan, layMauMucDoUuTien, layNhanMucDoUuTien } from '../helpers';
import type { CongViecCaNhan } from '../types';

type TaskKanbanCardProps = {
	task: CongViecCaNhan;
	onSua: (task: CongViecCaNhan) => void;
	onXoa: (id: string) => void;
};

const TaskKanbanCard = ({ task, onSua, onXoa }: TaskKanbanCardProps) => {
	const taskQuaHan = laTaskQuaHan(task);

	return (
		<Card
			size='small'
			bodyStyle={{ padding: 12 }}
			style={{
				borderRadius: 8,
				borderColor: taskQuaHan ? '#ffccc7' : '#f0f0f0',
			}}
		>
			<Space direction='vertical' size={10} style={{ width: '100%' }}>
				<Space align='start' style={{ width: '100%', justifyContent: 'space-between' }}>
					<Typography.Text strong style={{ fontSize: 15 }}>
						{task.tenTask}
					</Typography.Text>
					<Space size={4}>
						<Button type='text' size='small' icon={<EditOutlined />} onClick={() => onSua(task)} />
						<Popconfirm
							title={`Bạn có chắc muốn xóa task "${task.tenTask}"?`}
							okText='Xóa'
							cancelText='Hủy'
							onConfirm={() => onXoa(task.id)}
						>
							<Button type='text' size='small' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Space>
				</Space>

				{task.moTa ? (
					<Typography.Paragraph ellipsis={{ rows: 2 }} type='secondary' style={{ marginBottom: 0 }}>
						{task.moTa}
					</Typography.Paragraph>
				) : null}

				<Space wrap size={[8, 8]}>
					<Tag color={layMauMucDoUuTien(task.mucDoUuTien)} icon={<FlagOutlined />}>
						{layNhanMucDoUuTien(task.mucDoUuTien)}
					</Tag>
					<Tag color={taskQuaHan ? 'error' : 'default'} icon={<CalendarOutlined />}>
						{`${taskQuaHan ? 'Quá hạn' : 'Deadline'}: ${dinhDangNgay(task.deadline)}`}
					</Tag>
				</Space>

				{task.tags.length ? (
					<Space wrap size={[8, 8]}>
						{task.tags.map((tag) => (
							<Tag key={`${task.id}-${tag}`}>{tag}</Tag>
						))}
					</Space>
				) : null}
			</Space>
		</Card>
	);
};

export default TaskKanbanCard;
