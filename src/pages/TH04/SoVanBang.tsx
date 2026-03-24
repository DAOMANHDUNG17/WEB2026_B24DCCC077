import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface SoVanBangData { id: string; nam: number; soVaoSoHienTai: number; }

const SoVanBang: React.FC = () => {
  const [danhSach, setDanhSach] = useState<SoVanBangData[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem('th04_soVanBang');
    if (data) setDanhSach(JSON.parse(data));
  }, []);

  const xuLyLuu = async () => {
    try {
      const values = await form.validateFields();
      const itemMoi: SoVanBangData = { id: values.id, nam: values.nam, soVaoSoHienTai: 0 };
      const danhSachMoi = [...danhSach, itemMoi];
      setDanhSach(danhSachMoi);
      localStorage.setItem('th04_soVanBang', JSON.stringify(danhSachMoi));
      message.success('Thêm sổ văn bằng thành công!');
      setHienThiModal(false);
    } catch (loi) {}
  };

  const xuLyXoa = (id: string) => {
    const danhSachMoi = danhSach.filter(item => item.id !== id);
    setDanhSach(danhSachMoi);
    localStorage.setItem('th04_soVanBang', JSON.stringify(danhSachMoi));
    message.success('Đã xóa!');
  };

  const columns: ColumnsType<SoVanBangData> = [
    { title: 'Mã Sổ', dataIndex: 'id', key: 'id' },
    { title: 'Năm', dataIndex: 'nam', key: 'nam' },
    { title: 'Số Vào Sổ Hiện Tại', dataIndex: 'soVaoSoHienTai', key: 'soVaoSoHienTai' },
    { title: 'Hành động', key: 'hanhDong', render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => xuLyXoa(record.id)}>Xóa</Button>
    )},
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Sổ Văn Bằng</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setHienThiModal(true); }}>Thêm sổ mới</Button>
      </div>
      <Table columns={columns} dataSource={danhSach} rowKey="id" bordered />
      <Modal title="Thêm Sổ" visible={hienThiModal} onOk={xuLyLuu} onCancel={() => setHienThiModal(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="Mã Sổ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="nam" label="Năm Cấp" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default SoVanBang;