import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { dinhDangNgay, layMauTrangThaiBuoiTap, layNhanLoaiBaiTap, layNhanTrangThaiBuoiTap } from '../../helpers';
import type { BuoiTap } from '../../types';

type Props = {
	danhSachBuoiTap: BuoiTap[];
	onSua: (buoiTap: BuoiTap) => void;
	onXoa: (id: string) => void;
};

const BangBuoiTap = ({ danhSachBuoiTap, onSua, onXoa }: Props) => {
	const cotBang: ColumnsType<BuoiTap> = [
		{
			title: 'Tên bài tập',
			dataIndex: 'tenBaiTap',
			key: 'tenBaiTap',
			width: 220,
		},
		{
			title: 'Ngày',
			key: 'ngayTap',
			width: 140,
			render: (_, banGhi) => dinhDangNgay(banGhi.ngayTap),
		},
		{
			title: 'Loại bài tập',
			key: 'loaiBaiTap',
			width: 140,
			render: (_, banGhi) => <Tag color='blue'>{layNhanLoaiBaiTap(banGhi.loaiBaiTap)}</Tag>,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'thoiLuongPhut',
			key: 'thoiLuongPhut',
			align: 'center',
			width: 140,
		},
		{
			title: 'Calo đốt',
			dataIndex: 'caloDot',
			key: 'caloDot',
			align: 'center',
			width: 120,
			render: (giaTri: number) => `${giaTri} kcal`,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			key: 'trangThai',
			align: 'center',
			width: 140,
			render: (_, banGhi) => (
				<Tag color={layMauTrangThaiBuoiTap(banGhi.trangThai)}>{layNhanTrangThaiBuoiTap(banGhi.trangThai)}</Tag>
			),
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
						title={`Xóa buổi tập "${banGhi.tenBaiTap}"?`}
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
		<Table<BuoiTap>
			rowKey='id'
			columns={cotBang}
			dataSource={danhSachBuoiTap}
			pagination={{ pageSize: 8, showSizeChanger: false }}
			scroll={{ x: 1100 }}
		/>
	);
};

export default BangBuoiTap;
