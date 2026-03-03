import { Button, Card, Col, DatePicker, Form, InputNumber, Progress, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import type { MonthlyGoal, Subject } from '../types';

type ThuocTinh = {
	thangDangChon: string;
	danhSachMonHoc: Subject[];
	mucTieuThang?: MonthlyGoal;
	soPhutTheoMonTrongThang: Record<string, number>;
	tongSoPhutTrongThang: number;
	doiThang: (giaTri: string) => void;
	luuMucTieu: (duLieu: { month: string; totalMinutesTarget?: number; subjectTargets: Record<string, number> }) => void;
};

type GiaTriForm = {
	mucTieuTongPhut?: number;
	mucTieuTheoMon?: Record<string, number>;
};

const { Text } = Typography;

const QuanLyMucTieuThang = ({
	thangDangChon,
	danhSachMonHoc,
	mucTieuThang,
	soPhutTheoMonTrongThang,
	tongSoPhutTrongThang,
	doiThang,
	luuMucTieu,
}: ThuocTinh) => {
	const [formMucTieu] = Form.useForm<GiaTriForm>();

	useEffect(() => {
		formMucTieu.setFieldsValue({
			mucTieuTongPhut: mucTieuThang?.totalMinutesTarget,
			mucTieuTheoMon: mucTieuThang?.subjectTargets || {},
		});
	}, [formMucTieu, mucTieuThang, thangDangChon]);

	const xuLyLuuMucTieu = async () => {
		const giaTri = await formMucTieu.validateFields();
		const duLieuTheoMonGoc = giaTri.mucTieuTheoMon || {};
		const duLieuTheoMon: Record<string, number> = {};
		Object.keys(duLieuTheoMonGoc).forEach((khoa) => {
			const giaTriPhut = duLieuTheoMonGoc[khoa];
			if (typeof giaTriPhut === 'number' && giaTriPhut > 0) {
				duLieuTheoMon[khoa] = giaTriPhut;
			}
		});
		luuMucTieu({
			month: thangDangChon,
			totalMinutesTarget: giaTri.mucTieuTongPhut,
			subjectTargets: duLieuTheoMon,
		});
	};

	return (
		<Card title='3. Thiết lập mục tiêu học tập hàng tháng'>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Space wrap>
					<Text strong>Chọn tháng:</Text>
					<DatePicker picker='month' value={moment(thangDangChon, 'YYYY-MM')} onChange={(giaTri) => doiThang((giaTri || moment()).format('YYYY-MM'))} />
				</Space>

				<Form form={formMucTieu} layout='vertical'>
					<Form.Item name='mucTieuTongPhut' label='Mục tiêu tổng thời lượng trong tháng (phút)'>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Ví dụ: 1200' />
					</Form.Item>
					<Row gutter={[12, 12]}>
						{danhSachMonHoc.map((monHoc) => {
							const soPhutDaHoc = soPhutTheoMonTrongThang[monHoc.id] || 0;
							const mucTieuMon = mucTieuThang?.subjectTargets?.[monHoc.id] || 0;
							const phanTram = mucTieuMon > 0 ? Math.min(100, Math.round((soPhutDaHoc / mucTieuMon) * 100)) : 0;
							const daDat = mucTieuMon > 0 && soPhutDaHoc >= mucTieuMon;
							return (
								<Col xs={24} md={12} key={monHoc.id}>
									<Card size='small' title={monHoc.name}>
										<Form.Item name={['mucTieuTheoMon', monHoc.id]} label='Mục tiêu môn học (phút)'>
											<InputNumber min={1} style={{ width: '100%' }} placeholder='Không bắt buộc' />
										</Form.Item>
										<Progress percent={phanTram} status={daDat ? 'success' : 'active'} />
										<Text>
											Đã học: <b>{soPhutDaHoc}</b> phút
										</Text>
										{' - '}
										{mucTieuMon > 0 ? (
											daDat ? (
												<Tag color='success'>Đạt mục tiêu môn</Tag>
											) : (
												<Tag color='warning'>Chưa đạt mục tiêu môn</Tag>
											)
										) : (
											<Tag>Chưa đặt mục tiêu môn</Tag>
										)}
									</Card>
								</Col>
							);
						})}
					</Row>
				</Form>

				<Text type='secondary'>Tổng thời lượng đã học trong tháng: {tongSoPhutTrongThang} phút</Text>
				<Button type='primary' onClick={xuLyLuuMucTieu}>
					Lưu mục tiêu tháng
				</Button>
			</Space>
		</Card>
	);
};

export default QuanLyMucTieuThang;

