import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, message, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import FormKhoaHoc from './components/FormKhoaHoc';
import {
  chuanHoaDanhSachKhoaHoc,
  DANH_SACH_GIANG_VIEN,
  DANH_SACH_TRANG_THAI,
  TRANG_THAI_KHOA_HOC,
} from './constant';
import type { IKhoaHoc } from './constant';

const KHOA_HOC_MAC_DINH: IKhoaHoc[] = [
  {
    id: 'KH_01',
    tenKhoaHoc: 'Lập trình ReactJS Thực chiến',
    giangVien: 'gv_01',
    soLuongHocVien: 120,
    trangThai: 'DANG_MO',
    moTa: '<p>Khóa học nâng cao ReactJS</p>',
  },
  {
    id: 'KH_02',
    tenKhoaHoc: 'Cấu trúc dữ liệu và giải thuật',
    giangVien: 'gv_02',
    soLuongHocVien: 0,
    trangThai: 'TAM_DUNG',
    moTa: '<p>Cơ bản về CTDL</p>',
  },
];

const QuanLyKhoaHoc: React.FC = () => {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<IKhoaHoc[]>(() => {
    let duLieuKhoiTao = KHOA_HOC_MAC_DINH;

    try {
      const duLieuLuuTru = localStorage.getItem('KHOA_HOC_DATA');
      if (duLieuLuuTru) {
        duLieuKhoiTao = JSON.parse(duLieuLuuTru) as IKhoaHoc[];
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ LocalStorage:', error);
    }

    return chuanHoaDanhSachKhoaHoc(duLieuKhoiTao);
  });

  useEffect(() => {
    localStorage.setItem('KHOA_HOC_DATA', JSON.stringify(danhSachKhoaHoc));
  }, [danhSachKhoaHoc]);

  const [tuKhoa, setTuKhoa] = useState('');
  const [locGiangVien, setLocGiangVien] = useState<string | undefined>(undefined);
  const [locTrangThai, setLocTrangThai] = useState<string | undefined>(undefined);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [khoaHocDangSua, setKhoaHocDangSua] = useState<IKhoaHoc | null>(null);

  const duLieuHienThi = useMemo(() => {
    return danhSachKhoaHoc.filter((khoaHoc) => {
      const matchTuKhoa = khoaHoc.tenKhoaHoc.toLowerCase().includes(tuKhoa.toLowerCase());
      const matchGiangVien = locGiangVien ? khoaHoc.giangVien === locGiangVien : true;
      const matchTrangThai = locTrangThai ? khoaHoc.trangThai === locTrangThai : true;

      return matchTuKhoa && matchGiangVien && matchTrangThai;
    });
  }, [danhSachKhoaHoc, tuKhoa, locGiangVien, locTrangThai]);

  const handleDongModal = () => {
    setHienThiModal(false);
    setKhoaHocDangSua(null);
  };

  const handleXoa = (id: string) => {
    setDanhSachKhoaHoc((prev) => prev.filter((khoaHoc) => khoaHoc.id !== id));
    message.success('Xóa khóa học thành công!');
  };

  const handleThanhCong = (duLieuMoi: IKhoaHoc) => {
    if (khoaHocDangSua) {
      setDanhSachKhoaHoc((prev) =>
        prev.map((khoaHoc) => (khoaHoc.id === duLieuMoi.id ? duLieuMoi : khoaHoc)),
      );
      message.success('Cập nhật khóa học thành công!');
    } else {
      setDanhSachKhoaHoc((prev) => [duLieuMoi, ...prev]);
      message.success('Thêm mới khóa học thành công!');
    }

    handleDongModal();
  };

  const columns = [
    {
      title: 'Mã KH',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (value: string) => {
        const giangVien = DANH_SACH_GIANG_VIEN.find((item) => item.value === value);
        return giangVien ? giangVien.label : value;
      },
    },
    {
      title: 'Số lượng HV',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      width: 150,
      sorter: (a: IKhoaHoc, b: IKhoaHoc) => a.soLuongHocVien - b.soLuongHocVien,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (value: keyof typeof TRANG_THAI_KHOA_HOC) => {
        const trangThai = TRANG_THAI_KHOA_HOC[value];
        return <Tag color={trangThai?.color}>{trangThai?.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: IKhoaHoc) => {
        const choPhepXoa = record.soLuongHocVien === 0;

        return (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setKhoaHocDangSua(record);
                  setHienThiModal(true);
                }}
              />
            </Tooltip>

            <Tooltip title={choPhepXoa ? 'Xóa' : 'Chưa thể xóa do đang có học viên'}>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa khóa học này không?"
                onConfirm={() => handleXoa(record.id)}
                disabled={!choPhepXoa}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button danger icon={<DeleteOutlined />} size="small" disabled={!choPhepXoa} />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Card title="Quản lý khóa học Online">
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm theo tên khóa học..."
            prefix={<SearchOutlined />}
            onChange={(e) => setTuKhoa(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo giảng viên"
            options={DANH_SACH_GIANG_VIEN}
            onChange={(value) => setLocGiangVien(value)}
            allowClear
            style={{ width: 200 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            options={DANH_SACH_TRANG_THAI.map((item) => ({ label: item.text, value: item.value }))}
            onChange={(value) => setLocTrangThai(value)}
            allowClear
            style={{ width: 150 }}
          />
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setKhoaHocDangSua(null);
            setHienThiModal(true);
          }}
        >
          Thêm mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={duLieuHienThi}
        rowKey="id"
        bordered
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      />

      <FormKhoaHoc
        visible={hienThiModal}
        onCancel={handleDongModal}
        onSuccess={handleThanhCong}
        khoaHocSua={khoaHocDangSua}
        danhSachHienTai={danhSachKhoaHoc}
      />
    </Card>
  );
};

export default QuanLyKhoaHoc;
