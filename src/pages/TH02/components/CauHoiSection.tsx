import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { CauHoi, KhoiKienThuc, MonHoc, MucDo } from '../types';

type Props = {
	tieuDe: string;
	chuaCo: string;
	danhSachCauHoi: CauHoi[];
	danhSachMonHoc: MonHoc[];
	danhSachKhoiKienThuc: KhoiKienThuc[];
	danhSachMucDo: { value: MucDo; label: string }[];
	nhanMucDo: Record<MucDo, string>;
	mauMucDo: Record<MucDo, string>;
	onCreate: (values: Omit<CauHoi, 'id'>) => boolean;
	onUpdate: (id: string, values: Omit<CauHoi, 'id'>) => boolean;
	onDelete: (id: string) => void;
};

type CauHoiForm = {
	maCauHoi: string;
	monHocId: string;
	khoiKienThucId: string;
	mucDo: MucDo;
	noiDung: string;
};

const { Text } = Typography;

const CauHoiSection = ({
	tieuDe,
	chuaCo,
	danhSachCauHoi,
	danhSachMonHoc,
	danhSachKhoiKienThuc,
	danhSachMucDo,
	nhanMucDo,
	mauMucDo,
	onCreate,
	onUpdate,
	onDelete,
}: Props) => {
	const [form] = Form.useForm<CauHoiForm>();
	const [mo, setMo] = useState(false);
	const [dangSua, setDangSua] = useState<CauHoi | null>(null);
	const [boLoc, setBoLoc] = useState({
		monHocId: 'tat-ca',
		mucDo: 'tat-ca',
		khoiKienThucId: 'tat-ca',
		tuKhoa: '',
	});

	const banDoMon = useMemo(() => new Map(danhSachMonHoc.map((mon) => [mon.id, mon.tenMon])), [danhSachMonHoc]);
	const banDoKhoi = useMemo(() => new Map(danhSachKhoiKienThuc.map((khoi) => [khoi.id, khoi.ten])), [danhSachKhoiKienThuc]);

	const layTenMon = (id: string) => banDoMon.get(id) ?? 'Không rõ';
	const layTenKhoi = (id: string) => banDoKhoi.get(id) ?? 'Không rõ';

	const danhSachCauHoiLoc = useMemo(() => {
		return danhSachCauHoi.filter((cauHoi) => {
			const hopMon = boLoc.monHocId === 'tat-ca' || cauHoi.monHocId === boLoc.monHocId;
			const hopMucDo = boLoc.mucDo === 'tat-ca' || cauHoi.mucDo === boLoc.mucDo;
			const hopKhoi = boLoc.khoiKienThucId === 'tat-ca' || cauHoi.khoiKienThucId === boLoc.khoiKienThucId;
			const tuKhoa = boLoc.tuKhoa.trim().toLowerCase();
			const hopTuKhoa =
				tuKhoa === '' ||
				cauHoi.maCauHoi.toLowerCase().includes(tuKhoa) ||
				cauHoi.noiDung.toLowerCase().includes(tuKhoa);
			return hopMon && hopMucDo && hopKhoi && hopTuKhoa;
		});
	}, [boLoc, danhSachCauHoi]);

	const columns: ColumnsType<CauHoi> = [
		{ title: 'Mã câu hỏi', dataIndex: 'maCauHoi', key: 'maCauHoi' },
		{ title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => layTenMon(id) },
		{ title: 'Khối kiến thức', dataIndex: 'khoiKienThucId', key: 'khoiKienThucId', render: (id: string) => layTenKhoi(id) },
		{ title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung', ellipsis: true },
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			key: 'mucDo',
			render: (mucDo: MucDo) => <Tag color={mauMucDo[mucDo]}>{nhanMucDo[mucDo]}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (record) => (
				<Space>
					<Button
						size='small'
						onClick={() => {
							setDangSua(record);
							form.setFieldsValue(record);
							setMo(true);
						}}
					>
							Sửa
					</Button>
					<Popconfirm title='Xóa câu hỏi này?' onConfirm={() => onDelete(record.id)}>
						<Button danger size='small'>
								Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const payload: Omit<CauHoi, 'id'> = {
			maCauHoi: values.maCauHoi.trim(),
			monHocId: values.monHocId,
			khoiKienThucId: values.khoiKienThucId,
			mucDo: values.mucDo,
			noiDung: values.noiDung.trim(),
		};
		const thanhCong = dangSua ? onUpdate(dangSua.id, payload) : onCreate(payload);
		if (!thanhCong) return;
		form.resetFields();
		setDangSua(null);
		setMo(false);
	};

	return (
		<Card
			title={tieuDe}
			extra={
				<Button
					type='primary'
					disabled={danhSachMonHoc.length === 0 || danhSachKhoiKienThuc.length === 0}
					onClick={() => {
						setDangSua(null);
						form.resetFields();
						setMo(true);
					}}
				>
					Thêm câu hỏi
				</Button>
			}
		>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={6}>
						<Text strong>Môn học</Text>
						<Select
							value={boLoc.monHocId}
							onChange={(value) => setBoLoc((truocDo) => ({ ...truocDo, monHocId: value }))}
							style={{ width: '100%' }}
						>
							<Select.Option value='tat-ca'>Tất cả</Select.Option>
							{danhSachMonHoc.map((mon) => (
								<Select.Option key={mon.id} value={mon.id}>
									{mon.tenMon}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={24} md={6}>
						<Text strong>Mức độ</Text>
						<Select
							value={boLoc.mucDo}
							onChange={(value) => setBoLoc((truocDo) => ({ ...truocDo, mucDo: value }))}
							style={{ width: '100%' }}
						>
							<Select.Option value='tat-ca'>Tất cả</Select.Option>
							{danhSachMucDo.map((item) => (
								<Select.Option key={item.value} value={item.value}>
									{item.label}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={24} md={6}>
						<Text strong>Khối kiến thức</Text>
						<Select
							value={boLoc.khoiKienThucId}
							onChange={(value) => setBoLoc((truocDo) => ({ ...truocDo, khoiKienThucId: value }))}
							style={{ width: '100%' }}
						>
							<Select.Option value='tat-ca'>Tất cả</Select.Option>
							{danhSachKhoiKienThuc.map((khoi) => (
								<Select.Option key={khoi.id} value={khoi.id}>
									{khoi.ten}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={24} md={6}>
						<Text strong>Từ khóa</Text>
						<Input
							placeholder='Tìm theo mã/nội dung'
							value={boLoc.tuKhoa}
							onChange={(event) => setBoLoc((truocDo) => ({ ...truocDo, tuKhoa: event.target.value }))}
						/>
					</Col>
				</Row>
				<Table rowKey='id' dataSource={danhSachCauHoiLoc} columns={columns} locale={{ emptyText: chuaCo }} />
			</Space>
			<Modal
				visible={mo}
				title={dangSua ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
				onOk={handleSubmit}
				onCancel={() => {
					setMo(false);
					setDangSua(null);
				}}
				okText='Luu'
				cancelText='Huy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Mã câu hỏi'
						name='maCauHoi'
						rules={[{ required: true, message: 'Nhập mã câu hỏi' }, { max: 20, message: 'Tối đa 20 ký tự' }]}
					>
						<Input placeholder='VD: Q001' />
					</Form.Item>
					<Form.Item
						label='Môn học'
						name='monHocId'
						rules={[{ required: true, message: 'Chọn môn học' }]}
					>
						<Select placeholder='Chọn môn'>
							{danhSachMonHoc.map((mon) => (
								<Select.Option key={mon.id} value={mon.id}>
									{mon.tenMon}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Khối kiến thức'
						name='khoiKienThucId'
						rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
					>
						<Select placeholder='Chọn khối'>
							{danhSachKhoiKienThuc.map((khoi) => (
								<Select.Option key={khoi.id} value={khoi.id}>
									{khoi.ten}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Mức độ'
						name='mucDo'
						rules={[{ required: true, message: 'Chọn mức độ' }]}
					>
						<Select placeholder='Chọn mức độ'>
							{danhSachMucDo.map((item) => (
								<Select.Option key={item.value} value={item.value}>
									{item.label}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Nội dung'
						name='noiDung'
						rules={[{ required: true, message: 'Nhập nội dung' }, { max: 1000, message: 'Tối đa 1000 ký tự' }]}
					>
						<Input.TextArea rows={4} placeholder='Nhập nội dung câu hỏi' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default CauHoiSection;
