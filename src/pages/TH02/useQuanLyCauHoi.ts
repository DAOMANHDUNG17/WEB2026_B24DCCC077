import { message } from 'antd';
import { useState } from 'react';
import { NHAN_MUC_DO } from './constants';
import type { CauHoi, CauTrucDe, DeThi, KhoiKienThuc, MonHoc, YeuCauCauHoi } from './types';
import { TAO_ID, tronNgauNhien } from './utils';

const useQuanLyCauHoi = () => {
	const [danhSachKhoiKienThuc, setDanhSachKhoiKienThuc] = useState<KhoiKienThuc[]>([]);
	const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
	const [danhSachCauHoi, setDanhSachCauHoi] = useState<CauHoi[]>([]);
	const [danhSachCauTruc, setDanhSachCauTruc] = useState<CauTrucDe[]>([]);
	const [danhSachDeThi, setDanhSachDeThi] = useState<DeThi[]>([]);

	const layTenKhoi = (id: string) => danhSachKhoiKienThuc.find((item) => item.id === id)?.ten ?? 'Không rõ';

	const themKhoiKienThuc = (ten: string, ghiChu?: string) => {
		if (danhSachKhoiKienThuc.some((item) => item.ten.toLowerCase() === ten.toLowerCase())) {
			message.warning('Khối kiến thức đã tồn tại.');
			return false;
		}
		setDanhSachKhoiKienThuc((truocDo) => [...truocDo, { id: TAO_ID(), ten, ghiChu }]);
		message.success('Đã thêm khối kiến thức.');
		return true;
	};

	const capNhatKhoiKienThuc = (id: string, ten: string, ghiChu?: string) => {
		if (danhSachKhoiKienThuc.some((item) => item.id !== id && item.ten.toLowerCase() === ten.toLowerCase())) {
			message.warning('Khối kiến thức đã tồn tại.');
			return false;
		}
		setDanhSachKhoiKienThuc((truocDo) => truocDo.map((item) => (item.id === id ? { ...item, ten, ghiChu } : item)));
		message.success('Đã cập nhật khối kiến thức.');
		return true;
	};

	const xoaKhoiKienThuc = (id: string) => {
		setDanhSachKhoiKienThuc((truocDo) => truocDo.filter((item) => item.id !== id));
	};

	const themMonHoc = (maMon: string, tenMon: string, soTinChi: number) => {
		if (
			danhSachMonHoc.some(
				(item) => item.maMon.toLowerCase() === maMon.toLowerCase() || item.tenMon.toLowerCase() === tenMon.toLowerCase(),
			)
		) {
			message.warning('Mã môn hoặc tên môn đã tồn tại.');
			return false;
		}
		setDanhSachMonHoc((truocDo) => [...truocDo, { id: TAO_ID(), maMon, tenMon, soTinChi }]);
		message.success('Đã thêm môn học.');
		return true;
	};

	const capNhatMonHoc = (id: string, maMon: string, tenMon: string, soTinChi: number) => {
		if (
			danhSachMonHoc.some(
				(item) =>
					item.id !== id &&
					(item.maMon.toLowerCase() === maMon.toLowerCase() || item.tenMon.toLowerCase() === tenMon.toLowerCase()),
			)
		) {
			message.warning('Mã môn hoặc tên môn đã tồn tại.');
			return false;
		}
		setDanhSachMonHoc((truocDo) =>
			truocDo.map((item) => (item.id === id ? { ...item, maMon, tenMon, soTinChi } : item)),
		);
		message.success('Đã cập nhật môn học.');
		return true;
	};

	const xoaMonHoc = (id: string) => {
		setDanhSachMonHoc((truocDo) => truocDo.filter((item) => item.id !== id));
		setDanhSachCauHoi((truocDo) => truocDo.filter((item) => item.monHocId !== id));
		setDanhSachCauTruc((truocDo) => truocDo.filter((item) => item.monHocId !== id));
		setDanhSachDeThi((truocDo) => truocDo.filter((item) => item.monHocId !== id));
	};

	const themCauHoi = (values: Omit<CauHoi, 'id'>) => {
		if (danhSachCauHoi.some((item) => item.maCauHoi.toLowerCase() === values.maCauHoi.toLowerCase())) {
			message.warning('Mã câu hỏi đã tồn tại.');
			return false;
		}
		setDanhSachCauHoi((truocDo) => [...truocDo, { id: TAO_ID(), ...values }]);
			message.success('Đã thêm câu hỏi.');
		return true;
	};

	const capNhatCauHoi = (id: string, values: Omit<CauHoi, 'id'>) => {
		if (danhSachCauHoi.some((item) => item.id !== id && item.maCauHoi.toLowerCase() === values.maCauHoi.toLowerCase())) {
			message.warning('Mã câu hỏi đã tồn tại.');
			return false;
		}
		setDanhSachCauHoi((truocDo) => truocDo.map((item) => (item.id === id ? { id, ...values } : item)));
			message.success('Đã cập nhật câu hỏi.');
		return true;
	};

	const xoaCauHoi = (id: string) => {
		setDanhSachCauHoi((truocDo) => truocDo.filter((item) => item.id !== id));
	};

	const themCauTruc = (ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => {
		if (yeuCau.length === 0) {
			message.warning('Cần ít nhất 1 yêu cầu câu hỏi.');
			return false;
		}
		setDanhSachCauTruc((truocDo) => [
			...truocDo,
			{
				id: TAO_ID(),
				ten,
				monHocId,
				yeuCau: yeuCau.map((item) => ({ ...item, id: item.id || TAO_ID() })),
			},
		]);
		message.success('Đã thêm cấu trúc đề.');
		return true;
	};

	const capNhatCauTruc = (id: string, ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => {
		if (yeuCau.length === 0) {
			message.warning('Cần ít nhất 1 yêu cầu câu hỏi.');
			return false;
		}
		setDanhSachCauTruc((truocDo) =>
			truocDo.map((item) =>
				item.id === id
					? {
							...item,
							ten,
							monHocId,
							yeuCau: yeuCau.map((muc) => ({ ...muc, id: muc.id || TAO_ID() })),
						}
					: item,
				),
		);
		message.success('Đã cập nhật cấu trúc đề.');
		return true;
	};

	const xoaCauTruc = (id: string) => {
		setDanhSachCauTruc((truocDo) => truocDo.filter((item) => item.id !== id));
	};

	const taoDeThi = (ten: string, monHocId: string, cauTrucId: string) => {
		const cauTruc = danhSachCauTruc.find((item) => item.id === cauTrucId);
		if (!cauTruc) {
			message.error('Không tìm thấy cấu trúc đề.');
			return false;
		}
		if (cauTruc.monHocId !== monHocId) {
			message.error('Cấu trúc đề không khớp môn học.');
			return false;
		}
		const cauHoiTheoMon = danhSachCauHoi.filter((item) => item.monHocId === monHocId);
		if (cauHoiTheoMon.length === 0) {
			message.error('Môn học này chưa có câu hỏi.');
			return false;
		}

		const daChon = new Set<string>();
		const danhSachCauHoiDe: string[] = [];

		for (const yeuCau of cauTruc.yeuCau) {
			const ungVien = cauHoiTheoMon.filter(
				(item) =>
					item.khoiKienThucId === yeuCau.khoiKienThucId &&
					item.mucDo === yeuCau.mucDo &&
					!daChon.has(item.id),
			);
			if (ungVien.length < yeuCau.soLuong) {
				message.error(
					`Không đủ câu hỏi cho khối ${layTenKhoi(yeuCau.khoiKienThucId)} - mức độ ${NHAN_MUC_DO[yeuCau.mucDo]}.`,
				);
				return false;
			}
			const chon = tronNgauNhien(ungVien).slice(0, yeuCau.soLuong);
			chon.forEach((item) => {
				daChon.add(item.id);
				danhSachCauHoiDe.push(item.id);
			});
		}

		setDanhSachDeThi((truocDo) => [
			...truocDo,
			{
				id: TAO_ID(),
				ten: ten.trim(),
				monHocId,
				cauTrucId,
				danhSachCauHoi: danhSachCauHoiDe,
				createdAt: new Date().toISOString(),
			},
		]);
		message.success('Đã tạo đề thi.');
		return true;
	};

	const xoaDeThi = (id: string) => {
		setDanhSachDeThi((truocDo) => truocDo.filter((item) => item.id !== id));
	};

	return {
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
	};
};

export default useQuanLyCauHoi;
