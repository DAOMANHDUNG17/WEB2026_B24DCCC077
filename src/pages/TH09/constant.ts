import moment from 'moment';
import type { CongViecCaNhan, LuaChon, MucDoUuTien, TrangThaiLocTask, TrangThaiTask } from './types';

const taoTaskMacDinh = (
	chiSo: number,
	duLieu: Omit<CongViecCaNhan, 'id' | 'ngayTao' | 'ngayCapNhat'> & {
		ngayTao?: string;
		ngayCapNhat?: string;
	},
): CongViecCaNhan => ({
	id: `task-${chiSo}`,
	ngayTao: duLieu.ngayTao || moment().subtract(chiSo, 'day').startOf('day').toISOString(),
	ngayCapNhat: duLieu.ngayCapNhat || moment().subtract(Math.max(chiSo - 1, 0), 'day').endOf('day').toISOString(),
	...duLieu,
});

export const KHO_LUU_TRU_TH09 = {
	task: 'th09_kanban_tasks',
};

export const DANH_SACH_TRANG_THAI_TASK: LuaChon<TrangThaiTask>[] = [
	{ label: 'Cần làm', value: 'can_lam' },
	{ label: 'Đang làm', value: 'dang_lam' },
	{ label: 'Hoàn thành', value: 'hoan_thanh' },
];

export const DANH_SACH_LOC_TRANG_THAI_TASK: LuaChon<TrangThaiLocTask>[] = [
	{ label: 'Tất cả', value: 'tat_ca' },
	...DANH_SACH_TRANG_THAI_TASK,
];

export const DANH_SACH_MUC_DO_UU_TIEN: LuaChon<MucDoUuTien>[] = [
	{ label: 'Cao', value: 'cao' },
	{ label: 'Trung bình', value: 'trung_binh' },
	{ label: 'Thấp', value: 'thap' },
];

export const NHAN_THEO_TRANG_THAI_TASK: Record<TrangThaiTask, string> = {
	can_lam: 'Cần làm',
	dang_lam: 'Đang làm',
	hoan_thanh: 'Hoàn thành',
};

export const MAU_THEO_TRANG_THAI_TASK: Record<TrangThaiTask, string> = {
	can_lam: 'default',
	dang_lam: 'processing',
	hoan_thanh: 'success',
};

export const NHAN_THEO_MUC_DO_UU_TIEN: Record<MucDoUuTien, string> = {
	cao: 'Cao',
	trung_binh: 'Trung bình',
	thap: 'Thấp',
};

export const MAU_THEO_MUC_DO_UU_TIEN: Record<MucDoUuTien, string> = {
	cao: 'error',
	trung_binh: 'warning',
	thap: 'green',
};

export const MO_TA_COT_KANBAN: Record<TrangThaiTask, string> = {
	can_lam: 'Các đầu việc mới hoặc chưa bắt đầu.',
	dang_lam: 'Task đang được xử lý trong hiện tại.',
	hoan_thanh: 'Task đã hoàn tất và sẵn sàng lưu trữ.',
};

export const THU_TU_COT_KANBAN: TrangThaiTask[] = ['can_lam', 'dang_lam', 'hoan_thanh'];

export const DU_LIEU_MAC_DINH_TH09 = (): CongViecCaNhan[] => [
	taoTaskMacDinh(1, {
		tenTask: 'Chuẩn bị proposal khách hàng',
		moTa: 'Tổng hợp phạm vi, timeline và chi phí để gửi trước buổi họp sáng mai.',
		deadline: moment().add(1, 'day').endOf('day').toISOString(),
		mucDoUuTien: 'cao',
		tags: ['Công việc', 'Khách hàng'],
		trangThai: 'can_lam',
	}),
	taoTaskMacDinh(2, {
		tenTask: 'Thiết kế wireframe dashboard',
		moTa: 'Phác thảo nhanh layout thẻ thống kê và bảng dữ liệu cho màn dashboard.',
		deadline: moment().add(2, 'day').endOf('day').toISOString(),
		mucDoUuTien: 'trung_binh',
		tags: ['UI/UX', 'Dashboard'],
		trangThai: 'can_lam',
	}),
	taoTaskMacDinh(3, {
		tenTask: 'Viết test cho module đăng nhập',
		moTa: 'Bổ sung case login sai mật khẩu và token hết hạn.',
		deadline: moment().subtract(1, 'day').endOf('day').toISOString(),
		mucDoUuTien: 'cao',
		tags: ['Frontend', 'Test'],
		trangThai: 'dang_lam',
	}),
	taoTaskMacDinh(4, {
		tenTask: 'Review pull request tích hợp thanh toán',
		moTa: 'Kiểm tra validation form và luồng callback từ cổng thanh toán.',
		deadline: moment().add(3, 'hour').endOf('day').toISOString(),
		mucDoUuTien: 'cao',
		tags: ['Code Review'],
		trangThai: 'dang_lam',
	}),
	taoTaskMacDinh(5, {
		tenTask: 'Cập nhật backlog sprint',
		moTa: 'Chuẩn hóa priority theo planning của tuần này.',
		deadline: moment().subtract(2, 'day').endOf('day').toISOString(),
		mucDoUuTien: 'thap',
		tags: ['Scrum'],
		trangThai: 'hoan_thanh',
	}),
	taoTaskMacDinh(6, {
		tenTask: 'Dọn tài liệu release note',
		moTa: 'Gộp thay đổi nổi bật và các lỗi đã sửa cho bản phát hành tháng 5.',
		deadline: moment().add(1, 'day').endOf('day').toISOString(),
		mucDoUuTien: 'trung_binh',
		tags: ['Tài liệu'],
		trangThai: 'hoan_thanh',
	}),
];
