import type { MucDo } from './types';

export const NOI_DUNG = {
	tieuDe: 'Bài 2: Quản lý ngân hàng câu hỏi tự luận',
	moTa: 'Quản lý khối kiến thức, môn học, câu hỏi và tạo đề thi theo cấu trúc.',
	khoiKienThuc: '1. Danh mục khối kiến thức',
	monHoc: '2. Danh mục môn học',
	cauHoi: '3. Quản lý câu hỏi',
	deThi: '4. Quản lý đề thi',
	lamMoi: 'Làm mới',
	chuaCo: 'Chưa có dữ liệu',
};

export const DANH_SACH_MUC_DO: { value: MucDo; label: string }[] = [
	{ value: 'de', label: 'De' },
	{ value: 'trung_binh', label: 'Trung binh' },
	{ value: 'kho', label: 'Kho' },
	{ value: 'rat_kho', label: 'Rat kho' },
];

export const NHAN_MUC_DO: Record<MucDo, string> = {
	de: 'De',
	trung_binh: 'Trung binh',
	kho: 'Kho',
	rat_kho: 'Rat kho',
};

export const MAU_MUC_DO: Record<MucDo, string> = {
	de: 'success',
	trung_binh: 'processing',
	kho: 'warning',
	rat_kho: 'error',
};
