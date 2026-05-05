import moment from 'moment';
import { useEffect, useState } from 'react';
import { DU_LIEU_MAC_DINH_TH09, KHO_LUU_TRU_TH09 } from './constant';
import { diChuyenTaskKanban, docDuLieuTuBoNho, luuDuLieuVaoBoNho, taoId } from './helpers';
import type { CongViecCaNhan, DuLieuTaskLuu, TrangThaiTask } from './types';

type ViTriKeoTha = {
	droppableId: string;
	index: number;
};

const chuanHoaTags = (tags: string[]) =>
	Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));

const useQuanLyTask = () => {
	const [danhSachTask, setDanhSachTask] = useState<CongViecCaNhan[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU_TH09.task, DU_LIEU_MAC_DINH_TH09()),
	);

	useEffect(() => {
		luuDuLieuVaoBoNho(KHO_LUU_TRU_TH09.task, danhSachTask);
	}, [danhSachTask]);

	const themTask = (duLieuTask: DuLieuTaskLuu) => {
		const thoiDiemCapNhat = moment().toISOString();
		const taskMoi: CongViecCaNhan = {
			id: taoId('task'),
			tenTask: duLieuTask.tenTask.trim(),
			moTa: duLieuTask.moTa.trim(),
			deadline: duLieuTask.deadline,
			mucDoUuTien: duLieuTask.mucDoUuTien,
			tags: chuanHoaTags(duLieuTask.tags),
			trangThai: 'can_lam',
			ngayTao: thoiDiemCapNhat,
			ngayCapNhat: thoiDiemCapNhat,
		};

		setDanhSachTask((duLieuCu) => [taskMoi, ...duLieuCu]);
		return taskMoi;
	};

	const capNhatTask = (id: string, duLieuTask: DuLieuTaskLuu) => {
		const thoiDiemCapNhat = moment().toISOString();
		setDanhSachTask((duLieuCu) =>
			duLieuCu.map((task) =>
				task.id === id
					? {
							...task,
							tenTask: duLieuTask.tenTask.trim(),
							moTa: duLieuTask.moTa.trim(),
							deadline: duLieuTask.deadline,
							mucDoUuTien: duLieuTask.mucDoUuTien,
							tags: chuanHoaTags(duLieuTask.tags),
							ngayCapNhat: thoiDiemCapNhat,
					  }
					: task,
			),
		);
	};

	const xoaTask = (id: string) => {
		setDanhSachTask((duLieuCu) => duLieuCu.filter((task) => task.id !== id));
	};

	const capNhatTrangThaiTask = (id: string, trangThai: TrangThaiTask) => {
		const thoiDiemCapNhat = moment().toISOString();
		setDanhSachTask((duLieuCu) =>
			duLieuCu.map((task) =>
				task.id === id
					? {
							...task,
							trangThai,
							ngayCapNhat: thoiDiemCapNhat,
					  }
					: task,
			),
		);
	};

	const diChuyenTask = (source: ViTriKeoTha, destination: ViTriKeoTha) => {
		setDanhSachTask((duLieuCu) => diChuyenTaskKanban(duLieuCu, source, destination));
	};

	return {
		danhSachTask,
		setDanhSachTask,
		themTask,
		capNhatTask,
		xoaTask,
		capNhatTrangThaiTask,
		diChuyenTask,
	};
};

export default useQuanLyTask;
