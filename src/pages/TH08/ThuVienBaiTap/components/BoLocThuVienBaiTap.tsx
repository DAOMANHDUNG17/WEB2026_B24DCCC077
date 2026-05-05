import { DANH_SACH_MUC_DO_KHO, DANH_SACH_NHOM_CO } from '@/pages/TH08/constant';
import { Input, Select, Space } from 'antd';
import type { MucDoKho, NhomCo } from '../../types';

type Props = {
	tuKhoaTimKiem: string;
	onThayDoiTuKhoa: (giaTri: string) => void;
	nhomCoDangLoc?: NhomCo;
	onThayDoiNhomCo: (giaTri?: NhomCo) => void;
	mucDoKhoDangLoc?: MucDoKho;
	onThayDoiMucDoKho: (giaTri?: MucDoKho) => void;
};

const BoLocThuVienBaiTap = ({
	tuKhoaTimKiem,
	onThayDoiTuKhoa,
	nhomCoDangLoc,
	onThayDoiNhomCo,
	mucDoKhoDangLoc,
	onThayDoiMucDoKho,
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
					placeholder='Lọc theo nhóm cơ'
					style={{ width: 180 }}
					value={nhomCoDangLoc}
					onChange={(giaTri) => onThayDoiNhomCo(giaTri as NhomCo | undefined)}
				>
					{DANH_SACH_NHOM_CO.map((item) => (
						<Select.Option key={item.value} value={item.value}>
							{item.label}
						</Select.Option>
					))}
				</Select>
				<Select
					allowClear
					placeholder='Lọc theo mức độ khó'
					style={{ width: 180 }}
					value={mucDoKhoDangLoc}
					onChange={(giaTri) => onThayDoiMucDoKho(giaTri as MucDoKho | undefined)}
				>
					{DANH_SACH_MUC_DO_KHO.map((item) => (
						<Select.Option key={item.value} value={item.value}>
							{item.label}
						</Select.Option>
					))}
				</Select>
			</Space>
		</Space>
	);
};

export default BoLocThuVienBaiTap;
