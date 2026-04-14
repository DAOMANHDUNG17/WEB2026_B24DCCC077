// src/pages/KTGK/QuanLyKhoaHoc/constant.ts

export interface IKhoaHoc {
  id: string;
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  trangThai: 'DANG_MO' | 'DA_KET_THUC' | 'TAM_DUNG';
  moTa: string;
}

export const DINH_DANG_ID_KHOA_HOC = /^KH_(\d+)$/;

export const formatMaKhoaHoc = (soThuTu: number) => `KH_${String(soThuTu).padStart(2, '0')}`;

export const laySoThuTuTuMaKhoaHoc = (id: string) => {
  const ketQua = id.match(DINH_DANG_ID_KHOA_HOC);
  if (!ketQua) return null;

  const soThuTu = Number(ketQua[1]);
  return Number.isInteger(soThuTu) && soThuTu > 0 ? soThuTu : null;
};

export const taoMaKhoaHocTiepTheo = (danhSachKhoaHoc: IKhoaHoc[]) => {
  const soLonNhat = danhSachKhoaHoc.reduce((max, khoaHoc) => {
    const soThuTu = laySoThuTuTuMaKhoaHoc(khoaHoc.id);
    return soThuTu ? Math.max(max, soThuTu) : max;
  }, 0);

  return formatMaKhoaHoc(soLonNhat + 1);
};

export const chuanHoaDanhSachKhoaHoc = (danhSachKhoaHoc: IKhoaHoc[]) =>
  danhSachKhoaHoc.map((khoaHoc, index) => ({
    ...khoaHoc,
    id: formatMaKhoaHoc(index + 1),
  }));

export const DANH_SACH_GIANG_VIEN = [
  { value: 'gv_01', label: 'TS. Phan Lý Huỳnh' },
  { value: 'gv_02', label: 'ThS. Đặng Anh Tuấn' },
  { value: 'gv_03', label: 'TS. Ngô Quốc Dũng' },
  { value: 'gv_04', label: 'TS. Phan Huy Trung' },
  { value: 'gv_05', label: 'ThS. Phan Quang Thành' },
  { value: 'gv_06', label: 'TS. Nguyễn Tài Quang' },
];

export const TRANG_THAI_KHOA_HOC = {
  DANG_MO: { text: 'Đang mở', color: 'success', value: 'DANG_MO' },
  DA_KET_THUC: { text: 'Đã kết thúc', color: 'default', value: 'DA_KET_THUC' },
  TAM_DUNG: { text: 'Tạm dừng', color: 'warning', value: 'TAM_DUNG' },
};

export const DANH_SACH_TRANG_THAI = Object.values(TRANG_THAI_KHOA_HOC);
