import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const QuyetDinh: React.FC = () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [danhSachSo, setDanhSachSo] = useState<any[]>([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem('th04_quyetDinh');
    const dataSo = localStorage.getItem('th04_soVanBang');
    if (data) setDanhSach(JSON.parse(data));
    if (dataSo) setDanhSachSo(JSON.parse(dataSo));
  }, []);

  const xuLyLuu = async () => {
    try {
      const values = await form.validateFields();
      const itemMoi = { 
        id: values.id, 
        ngayBanHanh: values.ngayBanHanh.format('DD/MM/YYYY'), 
        trichYeu: values.trichYeu, 
        soVanBangId: values.soVanBangId, 
        luotTraCuu: 0 
      };
      const danhSachMoi = [...danhSach, itemMoi];
      setDanhSach(danhSachMoi);
      localStorage.setItem('th04_quyetDinh', JSON.stringify(danhSachMoi));
      message.success('Thêm thành công!');
      setHienThiModal(false);
    } catch (loi) {}
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Quyết Định Tốt Nghiệp</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setHienThiModal(true); }}>Thêm QĐ</Button>
      </div>
      <Table dataSource={danhSach} rowKey="id" bordered>
        <Table.Column title="Số QĐ" dataIndex="id" />
        <Table.Column title="Ngày Ban Hành" dataIndex="ngayBanHanh" />
        <Table.Column title="Thuộc Sổ" dataIndex="soVanBangId" />
        <Table.Column title="Trích Yếu" dataIndex="trichYeu" />
        <Table.Column title="Lượt Tra Cứu" dataIndex="luotTraCuu" render={val => <Tag color="green">{val || 0} lượt</Tag>} />
      </Table>
      <Modal title="Thêm Quyết Định" visible={hienThiModal} onOk={xuLyLuu} onCancel={() => setHienThiModal(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="Số Quyết Định" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ngayBanHanh" label="Ngày Ban Hành" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item>
          <Form.Item name="soVanBangId" label="Chọn Sổ Văn Bằng" rules={[{ required: true }]}>
            <Select>{danhSachSo.map(so => <Select.Option key={so.id} value={so.id}>{so.id}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="trichYeu" label="Trích Yếu" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default QuyetDinh;
