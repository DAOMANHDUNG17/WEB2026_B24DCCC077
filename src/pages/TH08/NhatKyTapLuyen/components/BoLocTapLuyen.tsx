import { DANH_SACH_LOAI_BAI_TAP } from '@/pages/TH08/constant';
import { DatePicker, Input, Select, Space } from 'antd';
import type { Moment } from 'moment';
import type { LoaiBaiTap } from '../../types';

type Props = {
	tuKhoaTimKiem: string;
	onThayDoiTuKhoa: (giaTri: string) => void;
	loaiDangLoc?: LoaiBaiTap;
	onThayDoiLoai: (giaTri?: LoaiBaiTap) => void;
	khoangNgayTap: [Moment, Moment] | null;
	onThayDoiKhoangNgay: (giaTri: [Moment, Moment] | null) => void;
};

const BoLocTapLuyen = ({
	tuKhoaTimKiem,
	onThayDoiTuKhoa,
	loaiDangLoc,
	onThayDoiLoai,
	khoangNgayTap,
	onThayDoiKhoangNgay,
}: Props) => {
	return (
		<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
			<Space wrap>
				<Input.Search
					allowClear
					placeholder='Tìm theo tên bài tập...'
					style={{ width: 280 }}
					value={tuKhoaTimKiem}
					onChange={(suKien) => onThayDoiTuKhoa(suKien.target.value)}
				/>
				<Select
					allowClear
					placeholder='Lọc theo loại bài tập'
					style={{ width: 220 }}
					value={loaiDangLoc}
					onChange={(giaTri) => onThayDoiLoai(giaTri as LoaiBaiTap | undefined)}
				>
					{DANH_SACH_LOAI_BAI_TAP.map((item) => (
						<Select.Option key={item.value} value={item.value}>
							{item.label}
						</Select.Option>
					))}
				</Select>
				<DatePicker.RangePicker
					format='DD/MM/YYYY'
					value={khoangNgayTap as any}
					onChange={(giaTri) => onThayDoiKhoangNgay(giaTri as [Moment, Moment] | null)}
				/>
			</Space>
		</Space>
	);
};

export default BoLocTapLuyen;
