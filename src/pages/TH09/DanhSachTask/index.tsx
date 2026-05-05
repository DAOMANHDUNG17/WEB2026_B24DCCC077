import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { DANH_SACH_LOC_TRANG_THAI_TASK, DANH_SACH_TRANG_THAI_TASK } from '../constant';
import FormTaskModal, { type GiaTriFormTask } from '../components/FormTaskModal';
import {
	dinhDangNgay,
	laTaskQuaHan,
	layMauMucDoUuTien,
	layNhanMucDoUuTien,
} from '../helpers';
import useQuanLyTask from '../useQuanLyTask';
import type { CongViecCaNhan, DuLieuTaskLuu, TrangThaiLocTask, TrangThaiTask } from '../types';

const DanhSachTaskTH09 = () => {
	const [formTask] = Form.useForm<GiaTriFormTask>();
	const { danhSachTask, themTask, capNhatTask, xoaTask, capNhatTrangThaiTask } = useQuanLyTask();
	const [visibleModal, setVisibleModal] = useState(false);
	const [taskDangSua, setTaskDangSua] = useState<CongViecCaNhan | null>(null);
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [locTrangThai, setLocTrangThai] = useState<TrangThaiLocTask>('tat_ca');

	const danhSachDaLoc = useMemo(() => {
		const tuKhoaDaChuanHoa = tuKhoaTimKiem.trim().toLowerCase();

		return danhSachTask.filter((task) => {
			const dungTrangThai = locTrangThai === 'tat_ca' ? true : task.trangThai === locTrangThai;
			const dungTuKhoa =
				!tuKhoaDaChuanHoa ||
				task.tenTask.toLowerCase().includes(tuKhoaDaChuanHoa) ||
				task.moTa.toLowerCase().includes(tuKhoaDaChuanHoa);

			return dungTrangThai && dungTuKhoa;
		});
	}, [danhSachTask, locTrangThai, tuKhoaTimKiem]);

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

	const cotBang: ColumnsType<CongViecCaNhan> = [
		{
			title: 'Tên task',
			dataIndex: 'tenTask',
			key: 'tenTask',
			render: (_giaTri, banGhi) => (
				<Space direction='vertical' size={2}>
					<Typography.Text strong>{banGhi.tenTask}</Typography.Text>
					{banGhi.moTa ? (
						<Typography.Text type='secondary' ellipsis style={{ maxWidth: 320 }}>
							{banGhi.moTa}
						</Typography.Text>
					) : null}
				</Space>
			),
		},
		{
			title: 'Mức ưu tiên',
			dataIndex: 'mucDoUuTien',
			key: 'mucDoUuTien',
			align: 'center',
			width: 140,
			render: (giaTri: CongViecCaNhan['mucDoUuTien']) => (
				<Tag color={layMauMucDoUuTien(giaTri)}>{layNhanMucDoUuTien(giaTri)}</Tag>
			),
		},
		{
			title: 'Tag',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) =>
				tags.length ? (
					<Space wrap size={[4, 4]}>
						{tags.map((tag) => (
							<Tag key={tag}>{tag}</Tag>
						))}
					</Space>
				) : (
					<Typography.Text type='secondary'>Chưa có tag</Typography.Text>
				),
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			width: 170,
			sorter: (taskA, taskB) => moment(taskA.deadline).valueOf() - moment(taskB.deadline).valueOf(),
			defaultSortOrder: 'ascend',
			render: (_giaTri, banGhi) => (
				<Space direction='vertical' size={2}>
					<Typography.Text>{dinhDangNgay(banGhi.deadline)}</Typography.Text>
					{laTaskQuaHan(banGhi) ? <Tag color='error'>Quá hạn</Tag> : null}
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 180,
			render: (giaTri: TrangThaiTask, banGhi) => (
				<Select<TrangThaiTask>
					value={giaTri}
					style={{ width: '100%' }}
					options={DANH_SACH_TRANG_THAI_TASK}
					onChange={(trangThaiMoi) => {
						capNhatTrangThaiTask(banGhi.id, trangThaiMoi);
						message.success('Đã cập nhật trạng thái task');
					}}
				/>
			),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			align: 'center',
			width: 180,
			render: (_giaTri, banGhi) => (
				<Space>
					<Button size='small' type='link' onClick={() => moModalSua(banGhi)}>
						Sửa
					</Button>
					<Popconfirm
						title={`Bạn có chắc muốn xóa task "${banGhi.tenTask}"?`}
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => xuLyXoaTask(banGhi.id)}
					>
						<Button size='small' danger type='link'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
				<div>
					<Typography.Title level={3} style={{ marginBottom: 8 }}>
						TH09 - Danh sách task
					</Typography.Title>
					<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
						Hiển thị task dưới dạng bảng Ant Design, hỗ trợ lọc theo trạng thái, tìm kiếm theo tên và sắp xếp theo deadline.
					</Typography.Paragraph>
				</div>

				<Button type='primary' icon={<PlusOutlined />} onClick={moModalThem}>
					Thêm task
				</Button>
			</Space>

			<Space wrap>
				<Input.Search
					allowClear
					value={tuKhoaTimKiem}
					placeholder='Tìm theo tên task hoặc mô tả'
					style={{ width: 320 }}
					onChange={(suKien) => setTuKhoaTimKiem(suKien.target.value)}
				/>
				<Select<TrangThaiLocTask>
					value={locTrangThai}
					style={{ width: 180 }}
					options={DANH_SACH_LOC_TRANG_THAI_TASK}
					onChange={(giaTri) => setLocTrangThai(giaTri)}
				/>
			</Space>

			<Table<CongViecCaNhan>
				rowKey='id'
				columns={cotBang}
				dataSource={danhSachDaLoc}
				pagination={{ pageSize: 6, showSizeChanger: false }}
				scroll={{ x: 1100 }}
			/>

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

export default DanhSachTaskTH09;
