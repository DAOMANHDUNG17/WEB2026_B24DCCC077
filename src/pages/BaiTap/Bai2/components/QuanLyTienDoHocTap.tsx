import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Typography } from 'antd';
import moment, { type Moment } from 'moment';
import { useMemo, useState } from 'react';
import type { StudySession, Subject } from '../types';

type ThuocTinh = {
	danhSachMonHoc: Subject[];
	danhSachBuoiHoc: StudySession[];
	taoBuoiHoc: (duLieu: Omit<StudySession, 'id'>) => void;
	capNhatBuoiHoc: (id: string, duLieu: Omit<StudySession, 'id'>) => void;
	xoaBuoiHoc: (id: string) => void;
};

type GiaTriForm = {
	monHocId: string;
	ngayGioHoc: Moment;
	thoiLuongPhut: number;
	noiDungHoc: string;
	ghiChu?: string;
};

const { Text } = Typography;

const QuanLyTienDoHocTap = ({ danhSachMonHoc, danhSachBuoiHoc, taoBuoiHoc, capNhatBuoiHoc, xoaBuoiHoc }: ThuocTinh) => {
	const [formBuoiHoc] = Form.useForm<GiaTriForm>();
	const [moModal, setMoModal] = useState(false);
	const [buoiHocDangSua, setBuoiHocDangSua] = useState<StudySession | undefined>();

	const bangMonHoc = useMemo(() => new Map(danhSachMonHoc.map((monHoc) => [monHoc.id, monHoc.name])), [danhSachMonHoc]);
	const cotBang = useMemo(
		() => [
			{
				title: 'Môn học',
				key: 'subjectId',
				align: 'center' as const,
				render: (banGhi: StudySession) => bangMonHoc.get(banGhi.subjectId) || 'Không xác định',
			},
			{
				title: 'Ngày giờ học',
				key: 'studyAt',
				align: 'center' as const,
				render: (banGhi: StudySession) => moment(banGhi.studyAt).format('HH:mm DD/MM/YYYY'),
			},
			{
				title: 'Thời lượng (phút)',
				dataIndex: 'durationMinutes',
				key: 'durationMinutes',
				align: 'center' as const,
			},
			{
				title: 'Nội dung đã học',
				dataIndex: 'content',
				key: 'content',
				align: 'center' as const,
			},
			{
				title: 'Ghi chú',
				dataIndex: 'note',
				key: 'note',
				align: 'center' as const,
				render: (giaTri: string | undefined) => giaTri || '-',
			},
			{
				title: 'Thao tác',
				key: 'action',
				align: 'center' as const,
				render: (banGhi: StudySession) => (
					<Space>
						<Button
							size='small'
							onClick={() => {
								setBuoiHocDangSua(banGhi);
								formBuoiHoc.setFieldsValue({
									monHocId: banGhi.subjectId,
									ngayGioHoc: moment(banGhi.studyAt),
									thoiLuongPhut: banGhi.durationMinutes,
									noiDungHoc: banGhi.content,
									ghiChu: banGhi.note,
								});
								setMoModal(true);
							}}
						>
							Sửa
						</Button>
						<Popconfirm title='Bạn chắc chắn muốn xóa lịch học này?' onConfirm={() => xoaBuoiHoc(banGhi.id)}>
							<Button size='small' danger>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[bangMonHoc, formBuoiHoc, xoaBuoiHoc],
	);

	const xuLyLuu = async () => {
		const giaTri = await formBuoiHoc.validateFields();
		const duLieu: Omit<StudySession, 'id'> = {
			subjectId: giaTri.monHocId,
			studyAt: giaTri.ngayGioHoc.toISOString(),
			durationMinutes: giaTri.thoiLuongPhut,
			content: giaTri.noiDungHoc.trim(),
			note: giaTri.ghiChu?.trim(),
		};

		if (buoiHocDangSua) {
			capNhatBuoiHoc(buoiHocDangSua.id, duLieu);
		} else {
			taoBuoiHoc(duLieu);
		}

		formBuoiHoc.resetFields();
		setBuoiHocDangSua(undefined);
		setMoModal(false);
	};

	return (
		<Card
			title='2. Quản lý tiến độ học tập'
			extra={
				<Button
					type='primary'
					disabled={danhSachMonHoc.length === 0}
					onClick={() => {
						formBuoiHoc.resetFields();
						setBuoiHocDangSua(undefined);
						setMoModal(true);
					}}
				>
					Thêm lịch học
				</Button>
			}
		>
			{danhSachMonHoc.length === 0 ? <Text type='warning'>Vui lòng thêm môn học trước khi tạo lịch học.</Text> : null}
			<Table rowKey='id' dataSource={danhSachBuoiHoc} columns={cotBang} pagination={{ pageSize: 5 }} />

			<Modal
				title={buoiHocDangSua ? 'Sửa lịch học' : 'Thêm lịch học'}
				visible={moModal}
				onOk={xuLyLuu}
				onCancel={() => {
					setMoModal(false);
					setBuoiHocDangSua(undefined);
				}}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={formBuoiHoc} layout='vertical'>
					<Form.Item name='monHocId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{danhSachMonHoc.map((monHoc) => (
								<Select.Option key={monHoc.id} value={monHoc.id}>
									{monHoc.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='ngayGioHoc' label='Ngày giờ học' rules={[{ required: true, message: 'Vui lòng chọn ngày giờ học' }]}>
						<DatePicker style={{ width: '100%' }} showTime format='HH:mm DD/MM/YYYY' />
					</Form.Item>
					<Form.Item
						name='thoiLuongPhut'
						label='Thời lượng học (phút)'
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng học' }]}
					>
						<InputNumber min={1} max={1000} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='noiDungHoc' label='Nội dung đã học' rules={[{ required: true, message: 'Vui lòng nhập nội dung đã học' }]}>
						<Input.TextArea rows={3} placeholder='Ví dụ: Ôn tập chương 2, giải 10 bài tập...' />
					</Form.Item>
					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea rows={2} placeholder='Ghi chú thêm (nếu có)' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyTienDoHocTap;

