import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

export interface LichHen {
  id: string;
  tenKhachHang: string;
  soDienThoai: string;
  dichVu: string;
  nhanVien: string;
  ngayHen: string;
  gioHen: string;
  trangThai: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
}

const danhSachKhungGio = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '18:00 - 20:00', '20:00 - 22:00'];

const QuanLyLichHen: React.FC = () => {
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>(() => {
    const savedData = localStorage.getItem('th03_lichHen');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [danhSachNhanVienHienTai, setDanhSachNhanVienHienTai] = useState<any[]>([]);
  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [form] = Form.useForm();

  // State để theo dõi xem người dùng đang chọn Mentor nào và Ngày nào (phục vụ việc khoá khung giờ)
  const [mentorDangChon, setMentorDangChon] = useState<string>('');
  const [ngayDangChon, setNgayDangChon] = useState<string>('');

  useEffect(() => {
    const savedNhanVien = localStorage.getItem('th03_nhanVien');
    if (savedNhanVien) {
      setDanhSachNhanVienHienTai(JSON.parse(savedNhanVien));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('th03_lichHen', JSON.stringify(danhSachLichHen));
  }, [danhSachLichHen]);

  const danhSachMentor = danhSachNhanVienHienTai.map(nv => nv.tenNhanVien);
  const danhSachDichVu = Array.from(new Set(
    danhSachNhanVienHienTai.flatMap(nv => nv.chuyenMon?.split(',').map((s: string) => s.trim()) || [])
  ));

  const moModalThem = () => {
    if (danhSachNhanVienHienTai.length === 0) {
      message.warning('Chưa có nhân viên nào! Hãy qua trang Quản lý Nhân viên thêm trước nhé.');
      return;
    }
    form.resetFields();
    form.setFieldsValue({ trangThai: 'Chờ duyệt' });
    setMentorDangChon('');
    setNgayDangChon('');
    setHienThiModal(true);
  };

  const xuLyLuu = async () => {
    try {
      const giaTriForm = await form.validateFields();
      
      // 1. Kiểm tra giới hạn số khách 1 ngày của Mentor
      const nhanVienInfo = danhSachNhanVienHienTai.find(nv => nv.tenNhanVien === giaTriForm.nhanVien);
      
      const soLichTrongNgay = danhSachLichHen.filter(
        (lh) => lh.nhanVien === giaTriForm.nhanVien && 
                lh.ngayHen === giaTriForm.ngayHen && 
                lh.trangThai !== 'Hủy'
      ).length;

      if (nhanVienInfo && soLichTrongNgay >= nhanVienInfo.gioiHanKhach) {
        message.error(`Mentor ${giaTriForm.nhanVien} đã kín lịch (${nhanVienInfo.gioiHanKhach}/${nhanVienInfo.gioiHanKhach} khách) trong ngày ${giaTriForm.ngayHen}. Vui lòng chọn ngày khác!`);
        return;
      }

      // 2. Kiểm tra trùng lịch (Phòng trường hợp thao tác lỗi)
      const lichBiTrung = danhSachLichHen.find(
        (lh) => lh.nhanVien === giaTriForm.nhanVien && lh.ngayHen === giaTriForm.ngayHen && lh.gioHen === giaTriForm.gioHen && lh.trangThai !== 'Hủy'
      );

      if (lichBiTrung) {
        message.error(`Khung giờ này đã có người đặt. Xin đổi khung giờ khác!`);
        return;
      }

      const lichHenMoi: LichHen = { ...giaTriForm, id: Date.now().toString() };
      setDanhSachLichHen([lichHenMoi, ...danhSachLichHen]);
      message.success('Thêm lịch hẹn mới thành công!');
      setHienThiModal(false);
    } catch (error) {
      console.log('Lỗi validate form:', error);
    }
  };

  const capNhatTrangThai = (id: string, trangThaiMoi: LichHen['trangThai']) => {
    const danhSachMoi = danhSachLichHen.map((lh) => lh.id === id ? { ...lh, trangThai: trangThaiMoi } : lh );
    setDanhSachLichHen(danhSachMoi);
    message.success(`Đã chuyển trạng thái thành: ${trangThaiMoi}`);
  };

  const cotDuLieu: ColumnsType<LichHen> = [
    { title: 'Khách hàng', key: 'khachHang', render: (_, record) => (<><strong>{record.tenKhachHang}</strong><br /><span style={{ color: 'gray', fontSize: '12px' }}>{record.soDienThoai}</span></>) },
    { title: 'Dịch vụ & Mentor', key: 'dichVu', render: (_, record) => (<><Tag color="cyan">{record.dichVu}</Tag><br /><span style={{ fontSize: '13px' }}>👤 {record.nhanVien}</span></>) },
    { title: 'Thời gian', key: 'thoiGian', render: (_, record) => (<><span>📅 {record.ngayHen}</span><br /><span>⏰ {record.gioHen}</span></>) },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai',
      render: (trangThai: string) => {
        let mau = 'default';
        if (trangThai === 'Chờ duyệt') mau = 'orange';
        if (trangThai === 'Xác nhận') mau = 'blue';
        if (trangThai === 'Hoàn thành') mau = 'green';
        if (trangThai === 'Hủy') mau = 'red';
        return <Tag color={mau}>{trangThai}</Tag>;
      },
    },
    {
      title: 'Thao tác', key: 'thaoTac', align: 'center',
      render: (_, record) => {
        if (record.trangThai === 'Chờ duyệt') {
          return (
            <Space>
              <Button type="primary" size="small" onClick={() => capNhatTrangThai(record.id, 'Xác nhận')}>Duyệt</Button>
              <Popconfirm title="Hủy lịch này?" onConfirm={() => capNhatTrangThai(record.id, 'Hủy')} okText="Có" cancelText="Không">
                <Button danger size="small">Hủy</Button>
              </Popconfirm>
            </Space>
          );
        }
        if (record.trangThai === 'Xác nhận') {
          return <Button type="primary" style={{ background: 'green' }} size="small" icon={<CheckOutlined />} onClick={() => capNhatTrangThai(record.id, 'Hoàn thành')}>Hoàn thành</Button>;
        }
        return <span style={{ color: '#ccc' }}>Không có thao tác</span>;
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Lịch hẹn (Booking)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>Tạo lịch hẹn mới</Button>
      </div>

      <Table columns={cotDuLieu} dataSource={danhSachLichHen} rowKey="id" bordered pagination={{ pageSize: 5 }} />

      <Modal title="Tạo lịch hẹn mới" visible={hienThiModal} onOk={xuLyLuu} onCancel={() => setHienThiModal(false)} okText="Lưu lịch hẹn" cancelText="Hủy">
        <Form 
          form={form} 
          layout="vertical"
          // Bắt sự kiện khi người dùng gõ/chọn trên form
          onValuesChange={(changedValues) => {
            if (changedValues.nhanVien !== undefined) setMentorDangChon(changedValues.nhanVien);
            if (changedValues.ngayHen !== undefined) setNgayDangChon(changedValues.ngayHen);
            // Nếu đổi nhân viên hoặc ngày, tự động xóa giờ cũ đi để bắt chọn lại
            if (changedValues.nhanVien || changedValues.ngayHen) {
              form.setFieldsValue({ gioHen: undefined });
            }
          }}
        >
          <Form.Item name="tenKhachHang" label="Tên học viên/khách hàng" rules={[{ required: true, message: 'Nhập tên!' }]}><Input placeholder="Nhập họ và tên" /></Form.Item>
          <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT!' }]}><Input placeholder="Nhập số điện thoại liên hệ" /></Form.Item>
          
          <Form.Item name="nhanVien" label="Mentor (Người hỗ trợ)" rules={[{ required: true, message: 'Chọn mentor!' }]}>
            <Select placeholder="Chọn Mentor">
              {danhSachMentor.map(mt => <Option key={mt} value={mt}>{mt}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="dichVu" label="Dịch vụ cần hỗ trợ" rules={[{ required: true, message: 'Chọn dịch vụ!' }]}>
            <Select placeholder="Chọn môn học/dịch vụ">
              {danhSachDichVu.map(dv => <Option key={dv} value={dv}>{dv}</Option>)}
            </Select>
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="ngayHen" label="Ngày hẹn" rules={[{ required: true, message: 'Nhập ngày!' }]}>
              <Input placeholder="DD/MM/YYYY" style={{ width: '150px' }} />
            </Form.Item>
            
            <Form.Item name="gioHen" label="Khung giờ" rules={[{ required: true, message: 'Chọn giờ!' }]}>
              <Select placeholder="Chọn giờ" style={{ width: '200px' }} disabled={!mentorDangChon || !ngayDangChon}>
                {danhSachKhungGio.map(gio => {
                  // Logic kiểm tra xem giờ này đã bị ai đặt chưa
                  const daBiDat = danhSachLichHen.some(
                    (lh) => lh.nhanVien === mentorDangChon && 
                            lh.ngayHen === ngayDangChon && 
                            lh.gioHen === gio && 
                            lh.trangThai !== 'Hủy'
                  );
                  return (
                    <Option key={gio} value={gio} disabled={daBiDat}>
                      {gio} {daBiDat ? '  (Đã có người đặt)' : ' '}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="trangThai" hidden><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyLichHen;