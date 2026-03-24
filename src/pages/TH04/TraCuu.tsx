import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, InputNumber, DatePicker, message, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const TraCuu: React.FC = () => {
  const [danhSachVB, setDanhSachVB] = useState<any[]>([]);
  const [ketQua, setKetQua] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const dVB = localStorage.getItem('th04_vanBang');
    if (dVB) setDanhSachVB(JSON.parse(dVB));
  }, []);

  const xuLyTraCuu = async () => {
    const values = form.getFieldsValue();
    const cacTruongDaNhap = Object.values(values).filter(v => v !== undefined && v !== null && v !== '');
    
    if (cacTruongDaNhap.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu!');
      return;
    }

    const locKetQua = danhSachVB.filter(vb => {
      let khop = true;
      if (values.soHieu && !vb.soHieu.includes(values.soHieu)) khop = false;
      if (values.soVaoSo && vb.soVaoSo !== values.soVaoSo) khop = false;
      if (values.maSinhVien && !vb.maSinhVien.includes(values.maSinhVien)) khop = false;
      if (values.hoTen && !vb.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) khop = false;
      if (values.ngaySinh && vb.ngaySinh !== values.ngaySinh.format('DD/MM/YYYY')) khop = false;
      return khop;
    });

    setKetQua(locKetQua);

    // Ghi nhận lượt tra cứu cho Quyết định
    if (locKetQua.length > 0) {
      const dsQDMoi = JSON.parse(localStorage.getItem('th04_quyetDinh') || '[]');
      const cacIdQuyetDinh = [...new Set(locKetQua.map(k => k.quyetDinhId))];
      
      const capNhatQD = dsQDMoi.map((qd: any) => {
        if (cacIdQuyetDinh.includes(qd.id)) return { ...qd, luotTraCuu: (qd.luotTraCuu || 0) + 1 };
        return qd;
      });
      localStorage.setItem('th04_quyetDinh', JSON.stringify(capNhatQD));
      message.success(`Tìm thấy ${locKetQua.length} văn bằng!`);
    } else {
      message.info('Không tìm thấy văn bằng nào khớp với điều kiện.');
    }
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <h2>Tra cứu Văn Bằng</h2>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={xuLyTraCuu}>
          <Form.Item name="soHieu" label="Số Hiệu"><Input placeholder="Nhập số hiệu" /></Form.Item>
          <Form.Item name="soVaoSo" label="Số Vào Sổ"><InputNumber placeholder="Nhập số" /></Form.Item>
          <Form.Item name="maSinhVien" label="Mã SV"><Input placeholder="Nhập mã sinh viên" /></Form.Item>
          <Form.Item name="hoTen" label="Họ Tên"><Input placeholder="Nhập họ tên" /></Form.Item>
          <Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker format="DD/MM/YYYY" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tra cứu</Button></Form.Item>
        </Form>
      </Card>

      <Table dataSource={ketQua} rowKey="maSinhVien" bordered locale={{ emptyText: 'Hãy nhập thông tin và bấm Tra cứu.' }}>
        <Table.Column title="Số Hiệu" dataIndex="soHieu" />
        <Table.Column title="Số Vào Sổ" dataIndex="soVaoSo" />
        <Table.Column title="Mã SV" dataIndex="maSinhVien" />
        <Table.Column title="Họ Tên" dataIndex="hoTen" />
        <Table.Column title="Ngày Sinh" dataIndex="ngaySinh" />
        <Table.Column title="Thuộc Quyết Định" dataIndex="quyetDinhId" />
      </Table>
    </div>
  );
};
export default TraCuu;