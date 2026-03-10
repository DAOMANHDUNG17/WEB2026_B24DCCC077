import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Typography,
	message,
} from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { CauHoi, CauTrucDe, DeThi, KhoiKienThuc, MonHoc, MucDo, YeuCauCauHoi } from '../types';
import { TAO_ID } from '../utils';

const { Text } = Typography;

type Props = {
	tieuDe: string;
	chuaCo: string;
	danhSachMonHoc: MonHoc[];
	danhSachKhoiKienThuc: KhoiKienThuc[];
	danhSachCauHoi: CauHoi[];
	danhSachCauTruc: CauTrucDe[];
	danhSachDeThi: DeThi[];
	danhSachMucDo: { value: MucDo; label: string }[];
	nhanMucDo: Record<MucDo, string>;
	onCreateCauTruc: (ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => boolean;
	onUpdateCauTruc: (id: string, ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => boolean;
	onDeleteCauTruc: (id: string) => void;
	onTaoDeThi: (ten: string, monHocId: string, cauTrucId: string) => boolean;
	onDeleteDeThi: (id: string) => void;
};

type CauTrucForm = {
	ten: string;
	monHocId: string;
	yeuCau: Omit<YeuCauCauHoi, 'id'>[];
};

type TaoDeForm = {
	ten: string;
	monHocId: string;
	cauTrucId: string;
};

const DeThiSection = ({
	tieuDe,
	chuaCo,
	danhSachMonHoc,
	danhSachKhoiKienThuc,
	danhSachCauHoi,
	danhSachCauTruc,
	danhSachDeThi,
	danhSachMucDo,
	nhanMucDo,
	onCreateCauTruc,
	onUpdateCauTruc,
	onDeleteCauTruc,
	onTaoDeThi,
	onDeleteDeThi,
}: Props) => {
	const [formCauTruc] = Form.useForm<CauTrucForm>();
	const [formTaoDe] = Form.useForm<TaoDeForm>();
	const [moCauTruc, setMoCauTruc] = useState(false);
	const [cauTrucDangSua, setCauTrucDangSua] = useState<CauTrucDe | null>(null);
	const [cauTrucDangXem, setCauTrucDangXem] = useState<CauTrucDe | null>(null);
	const [deThiDangXem, setDeThiDangXem] = useState<DeThi | null>(null);
	const [monHocTaoDe, setMonHocTaoDe] = useState<string | undefined>();

	const banDoMon = useMemo(() => new Map(danhSachMonHoc.map((mon) => [mon.id, mon.tenMon])), [danhSachMonHoc]);
	const banDoKhoi = useMemo(() => new Map(danhSachKhoiKienThuc.map((khoi) => [khoi.id, khoi.ten])), [danhSachKhoiKienThuc]);
	const banDoCauTruc = useMemo(() => new Map(danhSachCauTruc.map((cauTruc) => [cauTruc.id, cauTruc.ten])), [danhSachCauTruc]);
	const banDoCauHoi = useMemo(() => new Map(danhSachCauHoi.map((cauHoi) => [cauHoi.id, cauHoi])), [danhSachCauHoi]);

	const layTenMon = (id: string) => banDoMon.get(id) ?? 'Không rõ';
	const layTenKhoi = (id: string) => banDoKhoi.get(id) ?? 'Không rõ';

	const danhSachCauTrucTheoMon = useMemo(() => {
		if (!monHocTaoDe) return danhSachCauTruc;
		return danhSachCauTruc.filter((cauTruc) => cauTruc.monHocId === monHocTaoDe);
	}, [danhSachCauTruc, monHocTaoDe]);

	const handleLuuCauTruc = async () => {
		const values = await formCauTruc.validateFields();
		if (!values.yeuCau || values.yeuCau.length === 0) {
			message.warning('Can it nhat 1 yeu cau cau hoi.');
			return;
		}
		const yeuCau: YeuCauCauHoi[] = values.yeuCau.map((item) => ({
			id: TAO_ID(),
			khoiKienThucId: item.khoiKienThucId,
			mucDo: item.mucDo,
			soLuong: item.soLuong,
		}));
		const ten = values.ten.trim();
		const thanhCong = cauTrucDangSua
			? onUpdateCauTruc(cauTrucDangSua.id, ten, values.monHocId, yeuCau)
			: onCreateCauTruc(ten, values.monHocId, yeuCau);
		if (!thanhCong) return;
		formCauTruc.resetFields();
		setCauTrucDangSua(null);
		setMoCauTruc(false);
	};

	const handleTaoDe = async () => {
		const values = await formTaoDe.validateFields();
		const thanhCong = onTaoDeThi(values.ten.trim(), values.monHocId, values.cauTrucId);
		if (!thanhCong) return;
		formTaoDe.resetFields();
		setMonHocTaoDe(undefined);
	};

	const cotCauTruc: ColumnsType<CauTrucDe> = [
		{ title: 'Tên cấu trúc', dataIndex: 'ten', key: 'ten' },
		{ title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => layTenMon(id) },
		{ title: 'Số yêu cầu', key: 'soYeuCau', render: (record) => record.yeuCau.length },
		{
			title: 'Thao tác',
			key: 'action',
			render: (record) => (
				<Space>
					<Button size='small' onClick={() => setCauTrucDangXem(record)}>
						Xem
					</Button>
					<Button
						size='small'
						onClick={() => {
							setCauTrucDangSua(record);
							formCauTruc.setFieldsValue({
								ten: record.ten,
								monHocId: record.monHocId,
								yeuCau: record.yeuCau,
							});
							setMoCauTruc(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Xóa cấu trúc này?' onConfirm={() => onDeleteCauTruc(record.id)}>
						<Button danger size='small'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const cotDeThi: ColumnsType<DeThi> = [
		{ title: 'Tên đề', dataIndex: 'ten', key: 'ten' },
		{ title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => layTenMon(id) },
		{ title: 'Cấu trúc', dataIndex: 'cauTrucId', key: 'cauTrucId', render: (id: string) => banDoCauTruc.get(id) ?? 'Không rõ' },
		{ title: 'Số câu', key: 'soCau', render: (record) => record.danhSachCauHoi.length },
		{
			title: 'Thao tác',
			key: 'action',
			render: (record) => (
				<Space>
					<Button size='small' onClick={() => setDeThiDangXem(record)}>
						Xem
					</Button>
					<Popconfirm title='Xóa đề thi này?' onConfirm={() => onDeleteDeThi(record.id)}>
						<Button danger size='small'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title={tieuDe}
			extra={
				<Button
					type='primary'
					disabled={danhSachMonHoc.length === 0 || danhSachKhoiKienThuc.length === 0}
					onClick={() => {
						setCauTrucDangSua(null);
						formCauTruc.resetFields();
						formCauTruc.setFieldsValue({ yeuCau: [{ mucDo: 'de', soLuong: 1 }] });
						setMoCauTruc(true);
					}}
				>
					Thêm cấu trúc
				</Button>
			}
		>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<Card size='small' title='Tạo đề thi'>
					<Form form={formTaoDe} layout='vertical'>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={6}>
								<Form.Item
									label='Môn học'
									name='monHocId'
									rules={[{ required: true, message: 'Chọn môn học' }]}
								>
									<Select
										placeholder='Chọn môn'
										onChange={(value) => {
											formTaoDe.setFieldsValue({ cauTrucId: undefined });
											setMonHocTaoDe(value);
										}}
									>
										{danhSachMonHoc.map((mon) => (
											<Select.Option key={mon.id} value={mon.id}>
												{mon.tenMon}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={6}>
								<Form.Item
									label='Cấu trúc'
									name='cauTrucId'
									rules={[{ required: true, message: 'Chọn cấu trúc' }]}
								>
									<Select placeholder='Chọn cấu trúc'>
										{danhSachCauTrucTheoMon.map((cauTruc) => (
											<Select.Option key={cauTruc.id} value={cauTruc.id}>
												{cauTruc.ten}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									label='Tên đề'
									name='ten'
									rules={[{ required: true, message: 'Nhập tên đề' }]}
								>
									<Input placeholder='VD: Đề thi giữa kỳ' />
								</Form.Item>
							</Col>
							<Col xs={24} md={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
								<Button type='primary' onClick={handleTaoDe} style={{ width: '100%' }}>
									Tạo đề
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>

				<Row gutter={[16, 16]}>
					<Col xs={24} md={12}>
					<Card size='small' title='Cấu trúc đề thi'>
							<Table rowKey='id' dataSource={danhSachCauTruc} columns={cotCauTruc} pagination={false} locale={{ emptyText: chuaCo }} />
						</Card>
					</Col>
					<Col xs={24} md={12}>
					<Card size='small' title='Đề thi đã tạo'>
							<Table rowKey='id' dataSource={danhSachDeThi} columns={cotDeThi} pagination={false} locale={{ emptyText: chuaCo }} />
						</Card>
					</Col>
				</Row>
			</Space>

			<Modal
				visible={moCauTruc}
				title={cauTrucDangSua ? 'Sửa cấu trúc đề' : 'Thêm cấu trúc đề'}
				onOk={handleLuuCauTruc}
				onCancel={() => {
					setMoCauTruc(false);
					setCauTrucDangSua(null);
				}}
				okText='Luu'
				cancelText='Huy'
				width={720}
			>
				<Form form={formCauTruc} layout='vertical'>
					<Form.Item
						label='Tên cấu trúc'
						name='ten'
						rules={[{ required: true, message: 'Nhập tên cấu trúc' }]}
					>
						<Input placeholder='VD: Cấu trúc giữa kỳ' />
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
					<Form.List name='yeuCau'>
						{(fields, { add, remove }) => (
							<Space direction='vertical' style={{ width: '100%' }}>
								{fields.map((field) => (
									<Card key={field.key} size='small' title='Yêu cầu câu hỏi'>
										<Row gutter={[16, 16]}>
											<Col xs={24} md={10}>
												<Form.Item
												label='Khối kiến thức'
												name={[field.name, 'khoiKienThucId']}
												rules={[{ required: true, message: 'Chọn khối' }]}
											>
												<Select placeholder='Chọn khối'>
														{danhSachKhoiKienThuc.map((khoi) => (
															<Select.Option key={khoi.id} value={khoi.id}>
																{khoi.ten}
															</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col xs={24} md={8}>
												<Form.Item
												label='Mức độ'
												name={[field.name, 'mucDo']}
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
											</Col>
											<Col xs={24} md={4}>
												<Form.Item
												label='Số lượng'
												name={[field.name, 'soLuong']}
												rules={[{ required: true, message: 'Nhập số lượng' }]}
											>
													<InputNumber min={1} style={{ width: '100%' }} />
												</Form.Item>
											</Col>
											<Col xs={24} md={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
												<Button danger onClick={() => remove(field.name)}>
												Xóa
												</Button>
											</Col>
										</Row>
									</Card>
								))}
								<Button type='dashed' onClick={() => add({ mucDo: 'de', soLuong: 1 })}>
									Thêm yêu cầu
								</Button>
							</Space>
						)}
					</Form.List>
				</Form>
			</Modal>

			<Modal
				visible={!!cauTrucDangXem}
				title='Chi tiết cấu trúc'
				footer={null}
				onCancel={() => setCauTrucDangXem(null)}
			>
				{cauTrucDangXem ? (
					<Space direction='vertical' style={{ width: '100%' }}>
						<Text strong>Ten: {cauTrucDangXem.ten}</Text>
						<Text>Môn học: {layTenMon(cauTrucDangXem.monHocId)}</Text>
						<Divider />
						{cauTrucDangXem.yeuCau.map((item, index) => (
							<Card key={`${item.khoiKienThucId}-${item.mucDo}-${index}`} size='small'>
								<Space direction='vertical'>
									<Text>Khối: {layTenKhoi(item.khoiKienThucId)}</Text>
									<Text>Mức độ: {nhanMucDo[item.mucDo]}</Text>
									<Text>Số lượng: {item.soLuong}</Text>
								</Space>
							</Card>
						))}
					</Space>
				) : null}
			</Modal>

			<Modal
				visible={!!deThiDangXem}
				title='Chi tiết đề thi'
				footer={null}
				onCancel={() => setDeThiDangXem(null)}
				width={800}
			>
				{deThiDangXem ? (
					<Space direction='vertical' style={{ width: '100%' }}>
						<Text strong>Tên đề: {deThiDangXem.ten}</Text>
						<Text>Môn học: {layTenMon(deThiDangXem.monHocId)}</Text>
						<Text>Cấu trúc: {banDoCauTruc.get(deThiDangXem.cauTrucId) ?? 'Không rõ'}</Text>
						<Divider />
						{deThiDangXem.danhSachCauHoi.map((id, index) => {
							const cauHoi = banDoCauHoi.get(id);
							if (!cauHoi) return null;
							return (
								<Card key={id} size='small'>
									<Space direction='vertical'>
										<Text strong>
											Cau {index + 1}: {cauHoi.noiDung}
										</Text>
										<Text>Ma: {cauHoi.maCauHoi}</Text>
										<Text>Khối: {layTenKhoi(cauHoi.khoiKienThucId)}</Text>
										<Text>Mức độ: {nhanMucDo[cauHoi.mucDo]}</Text>
									</Space>
								</Card>
							);
						})}
					</Space>
				) : null}
			</Modal>
		</Card>
	);
};

export default DeThiSection;
