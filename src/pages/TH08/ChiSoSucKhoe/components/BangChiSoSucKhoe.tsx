import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { dinhDangNgay, layThongTinBmi, tinhBmi } from '../../helpers';
import type { ChiSoSucKhoe } from '../../types';

type Props = {
	danhSachChiSo: ChiSoSucKhoe[];
	onSua: (banGhi: ChiSoSucKhoe) => void;
	onXoa: (id: string) => void;
};

const BangChiSoSucKhoe = ({ danhSachChiSo, onSua, onXoa }: Props) => {
	const cotBang: ColumnsType<ChiSoSucKhoe> = [
		{
			title: 'Ngày',
			key: 'ngayGhiNhan',
			width: 130,
			render: (_, banGhi) => dinhDangNgay(banGhi.ngayGhiNhan),
		},
		{
			title: 'Cân nặng (kg)',
			dataIndex: 'canNangKg',
			key: 'canNangKg',
			align: 'center',
			width: 130,
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'chieuCaoCm',
			key: 'chieuCaoCm',
			align: 'center',
			width: 140,
		},
		{
			title: 'BMI',
			key: 'bmi',
			align: 'center',
			width: 180,
			render: (_, banGhi) => {
				const bmi = tinhBmi(banGhi.canNangKg, banGhi.chieuCaoCm);
				const thongTinBmi = layThongTinBmi(bmi);
				return (
					<Space>
						<span>{bmi}</span>
						<Tag color={thongTinBmi.mau}>{thongTinBmi.nhan}</Tag>
					</Space>
				);
			},
		},
		{
			title: 'Nhịp tim lúc nghỉ (bpm)',
			dataIndex: 'nhipTimNghiBpm',
			key: 'nhipTimNghiBpm',
			align: 'center',
			width: 180,
		},
		{
			title: 'Giờ ngủ',
			dataIndex: 'gioNgu',
			key: 'gioNgu',
			align: 'center',
			width: 100,
			render: (giaTri: number) => `${giaTri} giờ`,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			align: 'center',
			width: 150,
			render: (_, banGhi) => (
				<Space>
					<Button type='link' onClick={() => onSua(banGhi)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa chỉ số này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => onXoa(banGhi.id)}
					>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Table<ChiSoSucKhoe>
			rowKey='id'
			columns={cotBang}
			dataSource={danhSachChiSo}
			pagination={{ pageSize: 8, showSizeChanger: false }}
			scroll={{ x: 1050 }}
		/>
	);
};

export default BangChiSoSucKhoe;
