import {Alert,Button,Card,Col,Row,Space,Statistic,Table,Tag,Typography,} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Text, Title } = Typography;

type LuaChon = 'Kéo' | 'Búa' | 'bao';
type KetQua = 'Thắng' | 'Thua' | 'hoa';

type ChiTietVanDau = {
	key: string;
	van: number;
	luaChonNguoiChoi: LuaChon;
	luaChonMayTinh: LuaChon;
	ketQua: KetQua;
	thoiGian: string;
};

const NOI_DUNG = {
	tieuDe: 'Bài 1: Trò chơi oẳn tù tì',
	moTa: 'Người chơi chọn kéo, búa hoặc bao. Sau đó máy sẽ chọn ngẫu nhiên để xác định thắng, thua hoặc hòa',
	chonLua: 'Chọn nước đi',
	thongKe: 'Thống kê',
	ketQuaGanNhat: 'Kết quả gần đây',
	lichSu: 'Lịch sử đấu',
	lamMoi: 'Làm mới',
	banChon: 'Bạn',
	mayChon: 'Máy',
	ketQua: 'Kết quả',
	Thắng: 'Thắng',
	Thua: 'Thua',
	hoa: 'Hòa',
	chuaCo: 'Chưa có',
	goiY: 'Hãy chọn kéo, búa hoặc bao để bắt đầu.',
};

const LUA_CHON: LuaChon[] = ['Kéo', 'Búa', 'bao'];

const NHAN_LUA_CHON: Record<LuaChon, string> = {
	Kéo: 'Kéo',
	Búa: 'Búa',
	bao: 'Bao',
};

const NHAN_KET_QUA: Record<KetQua, string> = {
	Thắng: NOI_DUNG.Thắng,
	Thua: NOI_DUNG.Thua,
	hoa: NOI_DUNG.hoa,
};

const MAU_KET_QUA: Record<KetQua, string> = {
	Thắng: 'success',
	Thua: 'error',
	hoa: 'warning',
};

const taoLuaChonMay = (): LuaChon => {
	const chiSo = Math.floor(Math.random() * LUA_CHON.length);
	return LUA_CHON[chiSo];
};

const xacDinhKetQua = (nguoi: LuaChon, may: LuaChon): KetQua => {
	if (nguoi === may) return 'hoa';
	if (nguoi === 'Kéo' && may === 'bao') return 'Thắng';
	if (nguoi === 'Búa' && may === 'Kéo') return 'Thắng';
	if (nguoi === 'bao' && may === 'Búa') return 'Thắng';
	return 'Thua';
};

const layLoaiThongBao = (ketQua: KetQua | null): 'success' | 'info' | 'warning' | 'error' => {
	if (!ketQua) return 'info';
	if (ketQua === 'Thắng') return 'success';
	if (ketQua === 'Thua') return 'error';
	return 'warning';
};

const OanTuTi = () => {
	const [lichSu, setLichSu] = useState<ChiTietVanDau[]>([]);
	const [soVan, setSoVan] = useState<number>(1);
	const [luaChonNguoiChoi, setLuaChonNguoiChoi] = useState<LuaChon | null>(null);
	const [luaChonMayTinh, setLuaChonMayTinh] = useState<LuaChon | null>(null);
	const [ketQuaCuoiCung, setKetQuaCuoiCung] = useState<KetQua | null>(null);
	const [thoiGianCuoi, setThoiGianCuoi] = useState<string>('');

	const thongKe = useMemo(() => {
		return lichSu.reduce(
			(acc, item) => {
				acc[item.ketQua] += 1;
				return acc;
			},
			{ Thắng: 0, Thua: 0, hoa: 0 } as Record<KetQua, number>,
		);
	}, [lichSu]);

	const choiVanMoi = (luaChon: LuaChon) => {
		const luaChonMay = taoLuaChonMay();
		const ketQua = xacDinhKetQua(luaChon, luaChonMay);
		const thoiGian = new Date().toLocaleTimeString('vi-VN');
		const vanDauMoi: ChiTietVanDau = {
			key: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
			van: soVan,
			luaChonNguoiChoi: luaChon,
			luaChonMayTinh: luaChonMay,
			ketQua,
			thoiGian,
		};

		setLuaChonNguoiChoi(luaChon);
		setLuaChonMayTinh(luaChonMay);
		setKetQuaCuoiCung(ketQua);
		setThoiGianCuoi(thoiGian);
		setLichSu((truocDo) => [vanDauMoi, ...truocDo]);
		setSoVan((truocDo) => truocDo + 1);
	};

	const lamMoi = () => {
		setLichSu([]);
		setSoVan(1);
		setLuaChonNguoiChoi(null);
		setLuaChonMayTinh(null);
		setKetQuaCuoiCung(null);
		setThoiGianCuoi('');
	};

	const noiDungThongBao = ketQuaCuoiCung
		? `Ban chon ${NHAN_LUA_CHON[luaChonNguoiChoi ?? 'Kéo']} - May chon ${NHAN_LUA_CHON[luaChonMayTinh ?? 'Kéo']}. Ket qua: ${NHAN_KET_QUA[ketQuaCuoiCung]}.`
		: NOI_DUNG.goiY;

	const cotBang: ColumnsType<ChiTietVanDau> = [
		{
			title: 'Ván',
			dataIndex: 'van',
			key: 'van',
			align: 'center',
		},
		{
			title: 'Bạn chọn',
			dataIndex: 'luaChonNguoiChoi',
			key: 'luaChonNguoiChoi',
			align: 'center',
			render: (giaTri: LuaChon) => NHAN_LUA_CHON[giaTri],
		},
		{
			title: 'Máy chọn',
			dataIndex: 'luaChonMayTinh',
			key: 'luaChonMayTinh',
			align: 'center',
			render: (giaTri: LuaChon) => NHAN_LUA_CHON[giaTri],
		},
		{
			title: 'Kết quả',
			dataIndex: 'ketQua',
			key: 'ketQua',
			align: 'center',
			render: (giaTri: KetQua) => (<Tag color={MAU_KET_QUA[giaTri]}>{NHAN_KET_QUA[giaTri].toUpperCase()}</Tag>),
		},
		{
			title: 'Thời',
			dataIndex: 'thoiGian',
			key: 'thoiGian',
			align: 'center',
		},
	];

	return (
		<Card bordered={false}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={3} style={{ marginBottom: 8 }}>
						{NOI_DUNG.tieuDe}
					</Title>
					<Text type='secondary'>{NOI_DUNG.moTa}</Text>
				</div>

				<Row gutter={[16, 16]}>
					<Col xs={24} md={14}>
						<Card size='small' title={NOI_DUNG.chonLua}>
							<Space wrap>
								{LUA_CHON.map((luaChon) => (
									<Button
										key={luaChon}
										type={luaChonNguoiChoi === luaChon ? 'primary' : 'default'}
										onClick={() => choiVanMoi(luaChon)}
									>
										{NHAN_LUA_CHON[luaChon]}
									</Button>
								))}
								<Button onClick={lamMoi}>{NOI_DUNG.lamMoi}</Button>
							</Space>
						</Card>
					</Col>
					<Col xs={24} md={10}>
						<Card size='small' title={NOI_DUNG.thongKe}>
							<Row gutter={[16, 16]}>
								<Col span={8}>
									<Statistic title={NOI_DUNG.Thắng} value={thongKe.Thắng} />
								</Col>
								<Col span={8}>
									<Statistic title={NOI_DUNG.Thua} value={thongKe.Thua} />
								</Col>
								<Col span={8}>
									<Statistic title={NOI_DUNG.hoa} value={thongKe.hoa} />
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>

				<Alert message={noiDungThongBao} type={layLoaiThongBao(ketQuaCuoiCung)} showIcon />

				<Card size='small' title={NOI_DUNG.ketQuaGanNhat}>
					<Space wrap>
						<Tag color='blue'>
							{NOI_DUNG.banChon}: {luaChonNguoiChoi ? NHAN_LUA_CHON[luaChonNguoiChoi] : NOI_DUNG.chuaCo}
						</Tag>
						<Tag color='geekblue'>
							{NOI_DUNG.mayChon}: {luaChonMayTinh ? NHAN_LUA_CHON[luaChonMayTinh] : NOI_DUNG.chuaCo}
						</Tag>
						{ketQuaCuoiCung ? (
							<Tag color={MAU_KET_QUA[ketQuaCuoiCung]}>{NHAN_KET_QUA[ketQuaCuoiCung]}</Tag>
						) : (
							<Tag>{NOI_DUNG.chuaCo}</Tag>
						)}
					</Space>
					{thoiGianCuoi ? (
						<div style={{ marginTop: 8 }}>
							<Text type='secondary'>Thoi gian: {thoiGianCuoi}</Text>
						</div>
					) : null}
				</Card>

				<Card size='small' title={NOI_DUNG.lichSu}>
					<Table
						dataSource={lichSu}
						columns={cotBang}
						rowKey='key'
						pagination={{ pageSize: 5 }}
						size='middle'
						locale={{ emptyText: NOI_DUNG.chuaCo }}
						bordered
					/>
				</Card>
			</Space>
		</Card>
	);
};

export default OanTuTi;
