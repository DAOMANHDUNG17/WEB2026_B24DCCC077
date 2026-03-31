import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const CauHinh: React.FC = () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem('th04_cauHinh');
    if (data) setDanhSach(JSON.parse(data));
  }, []);

  const xuLyLuu = async () => {
    try {
      const values = await form.validateFields();
      if(danhSach.find(i => i.maTruong === values.maTruong)) { message.error('Mã trùng!'); return; }
      const danhSachMoi = [...danhSach, values];
      setDanhSach(danhSachMoi);
      localStorage.setItem('th04_cauHinh', JSON.stringify(danhSachMoi));
      setHienThiModal(false);
    } catch (loi) {}
  };

  const xuLyXoa = (maTruong: string) => {
    const danhSachMoi = danhSach.filter(item => item.maTruong !== maTruong);
    setDanhSach(danhSachMoi);
    localStorage.setItem('th04_cauHinh', JSON.stringify(danhSachMoi));
  }

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Cấu Hình Biểu Mẫu Phụ Lục</h2>
        <Button type="primary" onClick={() => { form.resetFields(); setHienThiModal(true); }}>Thêm Trường</Button>
      </div>
      <Table dataSource={danhSach} rowKey="maTruong" bordered>
        <Table.Column title="Mã Trường" dataIndex="maTruong" />
        <Table.Column title="Tên Trường" dataIndex="tenTruong" />
        <Table.Column title="Kiểu Dữ Liệu" dataIndex="kieuDuLieu" render={v => <Tag color="blue">{v}</Tag>} />
        <Table.Column title="Hành động" render={(_, rec: any) => <Button danger icon={<DeleteOutlined/>} onClick={()=>xuLyXoa(rec.maTruong)}>Xóa</Button>} />
      </Table>
      <Modal title="Thêm Cấu Hình" visible={hienThiModal} onOk={xuLyLuu} onCancel={() => setHienThiModal(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="maTruong" label="Mã Trường (VD: dan_toc)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="tenTruong" label="Tên Hiển Thị (VD: Dân tộc)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu Dữ Liệu" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="String">String</Select.Option>
              <Select.Option value="Number">Number</Select.Option>
              <Select.Option value="Date">Date</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default CauHinh;
