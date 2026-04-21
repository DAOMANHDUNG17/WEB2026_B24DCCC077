// src/pages/KTGK/QuanLyKhoaHoc/index.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Input, Select, Table, Space, Popconfirm, Tag, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { IKhoaHoc, DANH_SACH_GIANG_VIEN, TRANG_THAI_KHOA_HOC, DANH_SACH_TRANG_THAI } from './constant';
import FormKhoaHoc from './components/FormKhoaHoc';

const QuanLyKhoaHoc: React.FC = () => {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<IKhoaHoc[]>(() => {
    try {
      const duLieuLuuTru = localStorage.getItem('KHOA_HOC_DATA');
      if (duLieuLuuTru) {
        return JSON.parse(duLieuLuuTru);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ LocalStorage:', error);
    }
    return [
      {
        id: 'KH_01',
        tenKhoaHoc: 'Cơ sở dữ liệu',
        giangVien: 'gv_01',
        soLuongHocVien: 52,
        trangThai: 'DANG_MO',
        moTa: '<p>Khóa học nâng cao khả năng kiểm soát dữ liệu</p>',
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
  });


  useEffect(() => {
    localStorage.setItem('KHOA_HOC_DATA', JSON.stringify(danhSachKhoaHoc));
  }, [danhSachKhoaHoc]);


  const [tuKhoa, setTuKhoa] = useState<string>('');
  const [locGiangVien, setLocGiangVien] = useState<string | undefined>(undefined);
  const [locTrangThai, setLocTrangThai] = useState<string | undefined>(undefined);
  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [khoaHocDangSua, setKhoaHocDangSua] = useState<IKhoaHoc | null>(null);

  const duLieuHienThi = useMemo(() => {
    return danhSachKhoaHoc.filter((kh) => {
      const matchTuKhoa = kh.tenKhoaHoc.toLowerCase().includes(tuKhoa.toLowerCase());
      const matchGiangVien = locGiangVien ? kh.giangVien === locGiangVien : true;
      const matchTrangThai = locTrangThai ? kh.trangThai === locTrangThai : true;
      return matchTuKhoa && matchGiangVien && matchTrangThai;
    });
  }, [danhSachKhoaHoc, tuKhoa, locGiangVien, locTrangThai]);

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
      render: (val: string) => {
        const gv = DANH_SACH_GIANG_VIEN.find((g) => g.value === val);
        return gv ? gv.label : val;
      },
    },
    {
      title: 'Số lượng HV',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      width: 150,
      sorter: (a: IKhoaHoc, b: IKhoaHoc) => a.soLuongHocVien - b.soLuongHocVien, // Chức năng sắp xếp
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (val: keyof typeof TRANG_THAI_KHOA_HOC) => {
        const tt = TRANG_THAI_KHOA_HOC[val];
        return <Tag color={tt?.color}>{tt?.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: IKhoaHoc) => {
        const choPhepXoa = record.soLuongHocVien === 0; // Điều kiện xóa

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


  const handleXoa = (id: string) => {
    setDanhSachKhoaHoc((prev) => prev.filter((kh) => kh.id !== id));
    message.success('Xóa khóa học thành công!');
  };


  const handleThanhCong = (duLieuMoi: IKhoaHoc) => {
    if (khoaHocDangSua) {
      // Cập nhật
      setDanhSachKhoaHoc((prev) =>
        prev.map((kh) => (kh.id === duLieuMoi.id ? duLieuMoi : kh))
      );
      message.success('Cập nhật khóa học thành công!');
    } else {
      // Thêm mới
      setDanhSachKhoaHoc([duLieuMoi, ...danhSachKhoaHoc]);
      message.success('Thêm mới khóa học thành công!');
    }
    setHienThiModal(false);
  };

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
            onChange={(val) => setLocGiangVien(val)}
            allowClear
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            options={DANH_SACH_TRANG_THAI.map(tt => ({ label: tt.text, value: tt.value }))}
            onChange={(val) => setLocTrangThai(val)}
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
        onCancel={() => setHienThiModal(false)}
        onSuccess={handleThanhCong}
        khoaHocSua={khoaHocDangSua}
        danhSachHienTai={danhSachKhoaHoc}
      />
    </Card>
  );
};

export default QuanLyKhoaHoc;