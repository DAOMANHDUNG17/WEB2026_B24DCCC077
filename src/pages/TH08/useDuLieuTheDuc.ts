import { useEffect, useState } from 'react';
import { DU_LIEU_MAC_DINH_TH08, KHO_LUU_TRU_TH08 } from './constant';
import { docDuLieuTuBoNho, luuDuLieuVaoBoNho } from './helpers';
import type { BaiTapThuVien, BuoiTap, ChiSoSucKhoe, MucTieu } from './types';

const useDuLieuTheDuc = () => {
	const [danhSachBuoiTap, setDanhSachBuoiTap] = useState<BuoiTap[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU_TH08.buoiTap, DU_LIEU_MAC_DINH_TH08.buoiTap()),
	);
	const [danhSachChiSo, setDanhSachChiSo] = useState<ChiSoSucKhoe[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU_TH08.chiSoSucKhoe, DU_LIEU_MAC_DINH_TH08.chiSoSucKhoe()),
	);
	const [danhSachMucTieu, setDanhSachMucTieu] = useState<MucTieu[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU_TH08.mucTieu, DU_LIEU_MAC_DINH_TH08.mucTieu()),
	);
	const [danhSachBaiTap, setDanhSachBaiTap] = useState<BaiTapThuVien[]>(() =>
		docDuLieuTuBoNho(KHO_LUU_TRU_TH08.thuVienBaiTap, DU_LIEU_MAC_DINH_TH08.thuVienBaiTap()),
	);

	useEffect(() => {
		luuDuLieuVaoBoNho(KHO_LUU_TRU_TH08.buoiTap, danhSachBuoiTap);
	}, [danhSachBuoiTap]);

	useEffect(() => {
		luuDuLieuVaoBoNho(KHO_LUU_TRU_TH08.chiSoSucKhoe, danhSachChiSo);
	}, [danhSachChiSo]);

	useEffect(() => {
		luuDuLieuVaoBoNho(KHO_LUU_TRU_TH08.mucTieu, danhSachMucTieu);
	}, [danhSachMucTieu]);

	useEffect(() => {
		luuDuLieuVaoBoNho(KHO_LUU_TRU_TH08.thuVienBaiTap, danhSachBaiTap);
	}, [danhSachBaiTap]);

	return {
		danhSachBuoiTap,
		setDanhSachBuoiTap,
		danhSachChiSo,
		setDanhSachChiSo,
		danhSachMucTieu,
		setDanhSachMucTieu,
		danhSachBaiTap,
		setDanhSachBaiTap,
	};
};

export default useDuLieuTheDuc;
