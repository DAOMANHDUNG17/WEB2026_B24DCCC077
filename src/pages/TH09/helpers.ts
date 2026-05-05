import moment from 'moment';
import {
	MAU_THEO_MUC_DO_UU_TIEN,
	MAU_THEO_TRANG_THAI_TASK,
	NHAN_THEO_MUC_DO_UU_TIEN,
	NHAN_THEO_TRANG_THAI_TASK,
	THU_TU_COT_KANBAN,
} from './constant';
import type { CongViecCaNhan, MucDoUuTien, TrangThaiTask } from './types';

type ViTriKeoTha = {
	droppableId: string;
	index: number;
};

const taoMapTaskTheoCot = (danhSachTask: CongViecCaNhan[]) =>
	THU_TU_COT_KANBAN.reduce<Record<TrangThaiTask, CongViecCaNhan[]>>((ketQua, trangThai) => {
		ketQua[trangThai] = danhSachTask.filter((task) => task.trangThai === trangThai);
		return ketQua;
	}, {} as Record<TrangThaiTask, CongViecCaNhan[]>);

export const taoId = (tienTo: string) => `${tienTo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const docDuLieuTuBoNho = <T,>(key: string, giaTriMacDinh: T): T => {
	if (typeof window === 'undefined') {
		return giaTriMacDinh;
	}

	const duLieuRaw = localStorage.getItem(key);
	if (!duLieuRaw) {
		return giaTriMacDinh;
	}

	try {
		return JSON.parse(duLieuRaw) as T;
	} catch (error) {
		console.error(`Khong the doc du lieu TH09 voi key ${key}`, error);
		return giaTriMacDinh;
	}
};

export const luuDuLieuVaoBoNho = <T,>(key: string, duLieu: T) => {
	if (typeof window === 'undefined') {
		return;
	}

	localStorage.setItem(key, JSON.stringify(duLieu));
};

export const dinhDangNgay = (giaTri: string, dinhDang = 'DD/MM/YYYY') => moment(giaTri).format(dinhDang);

export const layNhanTrangThaiTask = (trangThai: TrangThaiTask) => NHAN_THEO_TRANG_THAI_TASK[trangThai];

export const layMauTrangThaiTask = (trangThai: TrangThaiTask) => MAU_THEO_TRANG_THAI_TASK[trangThai];

export const layNhanMucDoUuTien = (mucDo: MucDoUuTien) => NHAN_THEO_MUC_DO_UU_TIEN[mucDo];

export const layMauMucDoUuTien = (mucDo: MucDoUuTien) => MAU_THEO_MUC_DO_UU_TIEN[mucDo];

export const laTaskQuaHan = (task: CongViecCaNhan, thoiDiem = moment()) =>
	task.trangThai !== 'hoan_thanh' && moment(task.deadline).endOf('day').isBefore(thoiDiem);

export const layThongKeTask = (danhSachTask: CongViecCaNhan[]) => ({
	tongTask: danhSachTask.length,
	taskHoanThanh: danhSachTask.filter((task) => task.trangThai === 'hoan_thanh').length,
	taskQuaHan: danhSachTask.filter((task) => laTaskQuaHan(task)).length,
});

export const layTaskSapToiHan = (danhSachTask: CongViecCaNhan[], soLuong = 5) =>
	[...danhSachTask]
		.filter((task) => task.trangThai !== 'hoan_thanh')
		.sort((taskA, taskB) => moment(taskA.deadline).valueOf() - moment(taskB.deadline).valueOf())
		.slice(0, soLuong);

export const diChuyenTaskKanban = (
	danhSachTask: CongViecCaNhan[],
	source: ViTriKeoTha,
	destination: ViTriKeoTha,
) => {
	const trangThaiNguon = source.droppableId as TrangThaiTask;
	const trangThaiDich = destination.droppableId as TrangThaiTask;

	if (!THU_TU_COT_KANBAN.includes(trangThaiNguon) || !THU_TU_COT_KANBAN.includes(trangThaiDich)) {
		return danhSachTask;
	}

	if (trangThaiNguon === trangThaiDich && source.index === destination.index) {
		return danhSachTask;
	}

	const danhSachTheoCot = taoMapTaskTheoCot(danhSachTask);
	const danhSachNguon = [...danhSachTheoCot[trangThaiNguon]];
	const [taskDuocChuyen] = danhSachNguon.splice(source.index, 1);

	if (!taskDuocChuyen) {
		return danhSachTask;
	}

	const taskDaCapNhat: CongViecCaNhan = {
		...taskDuocChuyen,
		trangThai: trangThaiDich,
		ngayCapNhat: moment().toISOString(),
	};

	if (trangThaiNguon === trangThaiDich) {
		danhSachNguon.splice(destination.index, 0, taskDaCapNhat);
		danhSachTheoCot[trangThaiNguon] = danhSachNguon;
	} else {
		const danhSachDich = [...danhSachTheoCot[trangThaiDich]];
		danhSachDich.splice(destination.index, 0, taskDaCapNhat);
		danhSachTheoCot[trangThaiNguon] = danhSachNguon;
		danhSachTheoCot[trangThaiDich] = danhSachDich;
	}

	return THU_TU_COT_KANBAN.reduce<CongViecCaNhan[]>(
		(ketQua, trangThai) => ketQua.concat(danhSachTheoCot[trangThai]),
		[],
	);
};
