import { DANH_SACH_LOC_MUC_TIEU } from '@/pages/TH08/constant';
import { Segmented } from 'antd';
import type { TrangThaiLocMucTieu } from '../../types';

type Props = {
	giaTriDangLoc: TrangThaiLocMucTieu;
	onThayDoi: (giaTri: TrangThaiLocMucTieu) => void;
};

const BoLocMucTieu = ({ giaTriDangLoc, onThayDoi }: Props) => {
	return (
		<Segmented
			block
			value={giaTriDangLoc}
			options={DANH_SACH_LOC_MUC_TIEU.map((item) => ({
				label: item.label,
				value: item.value,
			}))}
			onChange={(giaTri) => onThayDoi(giaTri as TrangThaiLocMucTieu)}
		/>
	);
};

export default BoLocMucTieu;
