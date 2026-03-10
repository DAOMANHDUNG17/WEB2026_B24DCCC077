import { Space, Typography } from 'antd';
import { DANH_SACH_MUC_DO, MAU_MUC_DO, NHAN_MUC_DO, NOI_DUNG } from './constants';
import useQuanLyCauHoi from './useQuanLyCauHoi';
import KhoiKienThucSection from './components/KhoiKienThucSection';
import MonHocSection from './components/MonHocSection';
import CauHoiSection from './components/CauHoiSection';
import DeThiSection from './components/DeThiSection';

const { Text, Title } = Typography;

const QuanLyCauHoi = () => {
	const {
		danhSachKhoiKienThuc,
		danhSachMonHoc,
		danhSachCauHoi,
		danhSachCauTruc,
		danhSachDeThi,
		themKhoiKienThuc,
		capNhatKhoiKienThuc,
		xoaKhoiKienThuc,
		themMonHoc,
		capNhatMonHoc,
		xoaMonHoc,
		themCauHoi,
		capNhatCauHoi,
		xoaCauHoi,
		themCauTruc,
		capNhatCauTruc,
		xoaCauTruc,
		taoDeThi,
		xoaDeThi,
	} = useQuanLyCauHoi();

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Title level={3}>{NOI_DUNG.tieuDe}</Title>
				<Text type='secondary'>{NOI_DUNG.moTa}</Text>
			</div>

			<KhoiKienThucSection
				tieuDe={NOI_DUNG.khoiKienThuc}
				chuaCo={NOI_DUNG.chuaCo}
				danhSachKhoiKienThuc={danhSachKhoiKienThuc}
				onCreate={themKhoiKienThuc}
				onUpdate={capNhatKhoiKienThuc}
				onDelete={xoaKhoiKienThuc}
			/>

			<MonHocSection
				tieuDe={NOI_DUNG.monHoc}
				chuaCo={NOI_DUNG.chuaCo}
				danhSachMonHoc={danhSachMonHoc}
				onCreate={themMonHoc}
				onUpdate={capNhatMonHoc}
				onDelete={xoaMonHoc}
			/>

			<CauHoiSection
				tieuDe={NOI_DUNG.cauHoi}
				chuaCo={NOI_DUNG.chuaCo}
				danhSachCauHoi={danhSachCauHoi}
				danhSachMonHoc={danhSachMonHoc}
				danhSachKhoiKienThuc={danhSachKhoiKienThuc}
				danhSachMucDo={DANH_SACH_MUC_DO}
				nhanMucDo={NHAN_MUC_DO}
				mauMucDo={MAU_MUC_DO}
				onCreate={themCauHoi}
				onUpdate={capNhatCauHoi}
				onDelete={xoaCauHoi}
			/>

			<DeThiSection
				tieuDe={NOI_DUNG.deThi}
				chuaCo={NOI_DUNG.chuaCo}
				danhSachMonHoc={danhSachMonHoc}
				danhSachKhoiKienThuc={danhSachKhoiKienThuc}
				danhSachCauHoi={danhSachCauHoi}
				danhSachCauTruc={danhSachCauTruc}
				danhSachDeThi={danhSachDeThi}
				danhSachMucDo={DANH_SACH_MUC_DO}
				nhanMucDo={NHAN_MUC_DO}
				onCreateCauTruc={themCauTruc}
				onUpdateCauTruc={capNhatCauTruc}
				onDeleteCauTruc={xoaCauTruc}
				onTaoDeThi={taoDeThi}
				onDeleteDeThi={xoaDeThi}
			/>
		</Space>
	);
};

export default QuanLyCauHoi;
