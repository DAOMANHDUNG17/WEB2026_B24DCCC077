import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface NhanVien {
  id: string;
  tenNhanVien: string;
  chuyenMon: string;
  gioiHanKhach: number;
  lichLamViec: string;
  danhGia: number;
}

const duLieuMau: NhanVien[] = [
  { id: '1', tenNhanVien: 'Đào Mạnh Dũng', chuyenMon: 'Toán Cao Cấp, Hóa Đại Cương', gioiHanKhach: 3, lichLamViec: '18h-22h (Thứ 2 - Thứ 6)', danhGia: 4.8 },
  { id: '2', tenNhanVien: 'Đoàn Khánh Linh', chuyenMon: 'Lập trình OOP, Giải thuật', gioiHanKhach: 4, lichLamViec: '8h-17h (Thứ 7 - CN)', danhGia: 5.0 },
];

const QuanLyNhanVien: React.FC = () => {
  // Lay du lieu tu LocalStorage (neu co), neu khong thi dung duLieuMau
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>(() => {
    const savedData = localStorage.getItem('th03_nhanVien');
    return savedData ? JSON.parse(savedData) : duLieuMau;
  });

  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [nhanVienDangSua, setNhanVienDangSua] = useState<NhanVien | null>(null);
  const [form] = Form.useForm();

  // Dong bo vao LocalStorage moi khi danhSachNhanVien thay doi
  useEffect(() => {
    localStorage.setItem('th03_nhanVien', JSON.stringify(danhSachNhanVien));
  }, [danhSachNhanVien]);

  const moModalThemSua = (nhanVien?: NhanVien) => {
    if (nhanVien) {
      setNhanVienDangSua(nhanVien);
      form.setFieldsValue(nhanVien);
    } else {
      setNhanVienDangSua(null);
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xuLyLuu = async () => {
    try {
      const giaTriForm = await form.validateFields();
      if (nhanVienDangSua) {
        const danhSachMoi = danhSachNhanVien.map((nv) =>
          nv.id === nhanVienDangSua.id ? { ...nv, ...giaTriForm } : nv
        );
        setDanhSachNhanVien(danhSachMoi);
        message.success('Cập nhật thông tin nhân viên thành công!');
      } else {
        const nhanVienMoi: NhanVien = { ...giaTriForm, id: Date.now().toString(), danhGia: 0 };
        setDanhSachNhanVien([...danhSachNhanVien, nhanVienMoi]);
        message.success('Thêm nhân viên mới thành công!');
      }
      setHienThiModal(false);
    } catch (error) {
      console.log('Lỗi validate form:', error);
    }
  };

  const xuLyXoa = (id: string) => {
    const danhSachMoi = danhSachNhanVien.filter((nv) => nv.id !== id);
    setDanhSachNhanVien(danhSachMoi);
    message.success('Đã xóa nhân viên!');
  };

  const cotDuLieu: ColumnsType<NhanVien> = [
    { title: 'Tên nhân viên', dataIndex: 'tenNhanVien', key: 'tenNhanVien', render: (text: string) => <strong>{text}</strong> },
    { title: 'Chuyên môn', dataIndex: 'chuyenMon', key: 'chuyenMon', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Lịch làm việc', dataIndex: 'lichLamViec', key: 'lichLamViec' },
    { title: 'Giới hạn khách/ngày', dataIndex: 'gioiHanKhach', key: 'gioiHanKhach', align: 'center' },
    { title: 'Đánh giá', dataIndex: 'danhGia', key: 'danhGia', render: (diem: number) => <span>{diem > 0 ? `${diem} ⭐` : 'Chưa có'}</span>, align: 'center' },
    {
      title: 'Thao tác', key: 'thaoTac', align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => moModalThemSua(record)}>Sửa</Button>
          <Popconfirm title="Xóa nhân viên này?" onConfirm={() => xuLyXoa(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Nhân viên (Mentor)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalThemSua()}>Thêm nhân viên</Button>
      </div>
      <Table columns={cotDuLieu} dataSource={danhSachNhanVien} rowKey="id" bordered pagination={{ pageSize: 5 }} />
      <Modal title={nhanVienDangSua ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'} visible={hienThiModal} onOk={xuLyLuu} onCancel={() => setHienThiModal(false)} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="tenNhanVien" label="Tên nhân viên" rules={[{ required: true, message: 'Nhập tên!' }]}><Input placeholder="Nhập họ và tên" /></Form.Item>
          <Form.Item name="chuyenMon" label="Chuyên môn (Cách nhau bằng dấu phẩy)" rules={[{ required: true, message: 'Nhập chuyên môn!' }]}><Input placeholder="VD: Lập trình OOP, Toán..." /></Form.Item>
          <Form.Item name="lichLamViec" label="Lịch làm việc" rules={[{ required: true, message: 'Nhập lịch làm việc!' }]}><Input placeholder="VD: 8h-17h" /></Form.Item>
          <Form.Item name="gioiHanKhach" label="Giới hạn khách / ngày" rules={[{ required: true, message: 'Nhập số lượng!' }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyNhanVien;