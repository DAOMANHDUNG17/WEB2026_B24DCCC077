import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Row, Col, Space, Tag, Typography, message } from 'antd';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useMemo, useState } from 'react';
import { DANH_SACH_TRANG_THAI_TASK, MO_TA_COT_KANBAN, THU_TU_COT_KANBAN } from '../constant';
import FormTaskModal, { type GiaTriFormTask } from '../components/FormTaskModal';
import TaskKanbanCard from '../components/TaskKanbanCard';
import { layMauTrangThaiTask } from '../helpers';
import useQuanLyTask from '../useQuanLyTask';
import type { CongViecCaNhan, DuLieuTaskLuu, TrangThaiTask } from '../types';

const KanbanBoardTH09 = () => {
	const [formTask] = Form.useForm<GiaTriFormTask>();
	const { danhSachTask, themTask, capNhatTask, xoaTask, diChuyenTask } = useQuanLyTask();
	const [visibleModal, setVisibleModal] = useState(false);
	const [taskDangSua, setTaskDangSua] = useState<CongViecCaNhan | null>(null);

	const taskTheoCot = useMemo(
		() =>
			THU_TU_COT_KANBAN.reduce<Record<TrangThaiTask, CongViecCaNhan[]>>((ketQua, trangThai) => {
				ketQua[trangThai] = danhSachTask.filter((task) => task.trangThai === trangThai);
				return ketQua;
			}, {} as Record<TrangThaiTask, CongViecCaNhan[]>),
		[danhSachTask],
	);

	const moModalThem = () => {
		setTaskDangSua(null);
		setVisibleModal(true);
	};

	const moModalSua = (task: CongViecCaNhan) => {
		setTaskDangSua(task);
		setVisibleModal(true);
	};

	const dongModal = () => {
		setVisibleModal(false);
		setTaskDangSua(null);
		formTask.resetFields();
	};

	const xuLyLuuTask = (duLieuTask: DuLieuTaskLuu) => {
		if (taskDangSua) {
			capNhatTask(taskDangSua.id, duLieuTask);
			message.success('Cập nhật task thành công');
		} else {
			themTask(duLieuTask);
			message.success('Thêm task thành công');
		}

		dongModal();
	};

	const xuLyXoaTask = (id: string) => {
		xoaTask(id);
		message.success('Xóa task thành công');
	};

	const xuLyKeoTha = (ketQua: DropResult) => {
		if (!ketQua.destination) {
			return;
		}

		diChuyenTask(ketQua.source, ketQua.destination);

		if (ketQua.source.droppableId !== ketQua.destination.droppableId) {
			message.success('Đã cập nhật trạng thái task');
		}
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<div>
					<Typography.Title level={3} style={{ marginBottom: 8 }}>
						TH09 - Kanban Board cá nhân
					</Typography.Title>
					<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
						Kéo thả task giữa ba cột Cần làm, Đang làm và Hoàn thành bằng `react-beautiful-dnd`.
					</Typography.Paragraph>
				</div>

				<Button type='primary' icon={<PlusOutlined />} onClick={moModalThem}>
					Thêm task
				</Button>
			</Space>

			<DragDropContext onDragEnd={xuLyKeoTha}>
				<Row gutter={[16, 16]} align='top'>
					{THU_TU_COT_KANBAN.map((trangThai) => {
						const cauHinhCot = DANH_SACH_TRANG_THAI_TASK.find((item) => item.value === trangThai);
						const danhSachTheoCot = taskTheoCot[trangThai];

						return (
							<Col xs={24} lg={8} key={trangThai}>
								<div
									style={{
										height: '100%',
										padding: 16,
										background: '#fafafa',
										border: '1px solid #f0f0f0',
										borderRadius: 8,
									}}
								>
									<Space
										align='start'
										style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}
									>
										<div>
											<Typography.Title level={5} style={{ marginBottom: 4 }}>
												{cauHinhCot?.label}
											</Typography.Title>
											<Typography.Text type='secondary'>{MO_TA_COT_KANBAN[trangThai]}</Typography.Text>
										</div>
										<Tag color={layMauTrangThaiTask(trangThai)}>{`${danhSachTheoCot.length} task`}</Tag>
									</Space>

									<Droppable droppableId={trangThai}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.droppableProps}
												style={{
													minHeight: 260,
													padding: 4,
													borderRadius: 8,
													background: snapshot.isDraggingOver ? '#e6f4ff' : 'transparent',
												}}
											>
												<Space direction='vertical' size='middle' style={{ width: '100%' }}>
													{danhSachTheoCot.length ? (
														danhSachTheoCot.map((task, chiSo) => (
															<Draggable draggableId={task.id} index={chiSo} key={task.id}>
																{(dragProvided, dragSnapshot) => (
																	<div
																		ref={dragProvided.innerRef}
																		{...dragProvided.draggableProps}
																		{...dragProvided.dragHandleProps}
																		style={{
																			...dragProvided.draggableProps.style,
																			boxShadow: dragSnapshot.isDragging
																				? '0 12px 24px rgba(0, 0, 0, 0.12)'
																				: 'none',
																			borderRadius: 8,
																		}}
																	>
																		<TaskKanbanCard task={task} onSua={moModalSua} onXoa={xuLyXoaTask} />
																	</div>
																)}
															</Draggable>
														))
													) : (
														<div
															style={{
																padding: '32px 0',
																border: '1px dashed #d9d9d9',
																borderRadius: 8,
															}}
														>
															<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có task' />
														</div>
													)}
												</Space>
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</div>
							</Col>
						);
					})}
				</Row>
			</DragDropContext>

			<FormTaskModal
				visible={visibleModal}
				form={formTask}
				taskDangSua={taskDangSua}
				onHuy={dongModal}
				onLuu={xuLyLuuTask}
			/>
		</Space>
	);
};

export default KanbanBoardTH09;
