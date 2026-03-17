import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Rate, Tag, message } from 'antd';
import { MessageOutlined, StarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Gộp các interface cần thiết
export interface LichHen {
  id: string;
  tenKhachHang: string;
  dichVu: string;
  nhanVien: string;
  ngayHen: string;
  trangThai: string;
  soSao?: number;      // Đánh giá của khách
  nhanXet?: string;    // Lời nhận xét
  phanHoi?: string;    // Lời phản hồi của nhân viên
}

export interface NhanVien {
  id: string;
  tenNhanVien: string;
  danhGia: number;
  [key: string]: any;
}

const QuanLyDanhGia: React.FC = () => {
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);

  const [hienThiModalKhach, setHienThiModalKhach] = useState(false);
  const [hienThiModalMentor, setHienThiModalMentor] = useState(false);
  const [lichDangChon, setLichDangChon] = useState<LichHen | null>(null);
  
  const [formKhach] = Form.useForm();
  const [formMentor] = Form.useForm();

  // 1. Tải dữ liệu từ LocalStorage khi mở trang
  useEffect(() => {
    const savedLichHen = localStorage.getItem('th03_lichHen');
    const savedNhanVien = localStorage.getItem('th03_nhanVien');
    if (savedLichHen) setDanhSachLichHen(JSON.parse(savedLichHen));
    if (savedNhanVien) setDanhSachNhanVien(JSON.parse(savedNhanVien));
  }, []);

  // 2. Lọc chỉ lấy những lịch đã "Hoàn thành"
  const danhSachHoanThanh = danhSachLichHen.filter(lh => lh.trangThai === 'Hoàn thành');

  // 3. Hàm tính toán và cập nhật điểm trung bình cho Mentor
  const capNhatDiemMentor = (tenMentor: string, danhSachLichMoi: LichHen[]) => {
    // Lấy tất cả đánh giá của mentor này
    const cacDanhGia = danhSachLichMoi.filter(lh => lh.nhanVien === tenMentor && lh.soSao);
    let diemTrungBinh = 0;
    
    if (cacDanhGia.length > 0) {
      const tongDiem = cacDanhGia.reduce((tong, lh) => tong + (lh.soSao || 0), 0);
      diemTrungBinh = Number((tongDiem / cacDanhGia.length).toFixed(1)); // Làm tròn 1 chữ số
    }

    // Cập nhật vào danh sách nhân viên
    const danhSachNhanVienMoi = danhSachNhanVien.map(nv => 
      nv.tenNhanVien === tenMentor ? { ...nv, danhGia: diemTrungBinh } : nv
    );

    setDanhSachNhanVien(danhSachNhanVienMoi);
    localStorage.setItem('th03_nhanVien', JSON.stringify(danhSachNhanVienMoi));
  };

  // 4. Xử lý lưu đánh giá của Khách hàng
  const xuLyKhachDanhGia = async () => {
    try {
      const values = await formKhach.validateFields();
      if (lichDangChon) {
        const danhSachMoi = danhSachLichHen.map(lh => 
          lh.id === lichDangChon.id ? { ...lh, soSao: values.soSao, nhanXet: values.nhanXet } : lh
        );
        
        setDanhSachLichHen(danhSachMoi);
        localStorage.setItem('th03_lichHen', JSON.stringify(danhSachMoi));
        
        // Gọi hàm cập nhật điểm trung bình
        capNhatDiemMentor(lichDangChon.nhanVien, danhSachMoi);
        
        message.success('Đã gửi đánh giá thành công!');
        setHienThiModalKhach(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 5. Xử lý lưu phản hồi của Mentor
  const xuLyMentorPhanHoi = async () => {
    try {
      const values = await formMentor.validateFields();
      if (lichDangChon) {
        const danhSachMoi = danhSachLichHen.map(lh => 
          lh.id === lichDangChon.id ? { ...lh, phanHoi: values.phanHoi } : lh
        );
        
        setDanhSachLichHen(danhSachMoi);
        localStorage.setItem('th03_lichHen', JSON.stringify(danhSachMoi));
        
        message.success('Đã gửi phản hồi thành công!');
        setHienThiModalMentor(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cotDuLieu: ColumnsType<LichHen> = [
    { 
      title: 'Khách hàng & Dịch vụ', 
      key: 'khachHang', 
      render: (_, record) => (
        <>
          <strong>{record.tenKhachHang}</strong><br/>
          <Tag color="cyan" style={{ marginTop: 4 }}>{record.dichVu}</Tag>
        </>
      ) 
    },
    { 
      title: 'Mentor phục vụ', 
      dataIndex: 'nhanVien', 
      key: 'nhanVien',
      render: (text) => <span>👤 {text}</span>
    },
    { 
      title: 'Đánh giá của khách', 
      key: 'danhGia', 
      width: '30%',
      render: (_, record) => {
        if (!record.soSao) {
          return (
            <Button size="small" type="dashed" icon={<StarOutlined />} onClick={() => {
              setLichDangChon(record);
              formKhach.resetFields();
              setHienThiModalKhach(true);
            }}>
              Mô phỏng Khách đánh giá
            </Button>
          );
        }
        return (
          <div>
            <Rate disabled defaultValue={record.soSao} style={{ fontSize: 14 }} />
            <div style={{ color: 'gray', fontStyle: 'italic', marginTop: 4 }}>"{record.nhanXet}"</div>
          </div>
        );
      } 
    },
    { 
      title: 'Phản hồi của Mentor', 
      key: 'phanHoi', 
      width: '30%',
      render: (_, record) => {
        if (!record.soSao) return <span style={{ color: '#ccc' }}>Chờ khách đánh giá...</span>;
        if (!record.phanHoi) {
          return (
            <Button size="small" type="primary" ghost icon={<MessageOutlined />} onClick={() => {
              setLichDangChon(record);
              formMentor.resetFields();
              setHienThiModalMentor(true);
            }}>
              Mentor trả lời
            </Button>
          );
        }
        return <div style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4 }}>💬 {record.phanHoi}</div>;
      } 
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý Đánh giá Dịch vụ & Nhân viên</h2>
      
      <Table 
        columns={cotDuLieu} 
        dataSource={danhSachHoanThanh} 
        rowKey="id" 
        bordered 
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'Chưa có lịch hẹn nào hoàn thành để đánh giá.' }}
      />

      {/* Modal cho Khách hàng viết đánh giá */}
      <Modal title={`Đánh giá dịch vụ: ${lichDangChon?.dichVu}`} visible={hienThiModalKhach} onOk={xuLyKhachDanhGia} onCancel={() => setHienThiModalKhach(false)} okText="Gửi đánh giá" cancelText="Hủy">
        <Form form={formKhach} layout="vertical">
          <Form.Item name="soSao" label="Mức độ hài lòng" rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="nhanXet" label="Nhận xét chi tiết" rules={[{ required: true, message: 'Vui lòng viết nhận xét!' }]}>
            <Input.TextArea rows={3} placeholder="Dịch vụ tuyệt vời, mentor nhiệt tình..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cho Mentor phản hồi */}
      <Modal title={`Phản hồi khách hàng: ${lichDangChon?.tenKhachHang}`} visible={hienThiModalMentor} onOk={xuLyMentorPhanHoi} onCancel={() => setHienThiModalMentor(false)} okText="Gửi phản hồi" cancelText="Hủy">
        <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
          <strong>Khách đánh giá:</strong> <Rate disabled defaultValue={lichDangChon?.soSao} style={{ fontSize: 12 }} /><br/>
          <i>"{lichDangChon?.nhanXet}"</i>
        </div>
        <Form form={formMentor} layout="vertical">
          <Form.Item name="phanHoi" label="Nội dung phản hồi của Mentor" rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}>
            <Input.TextArea rows={3} placeholder="Cảm ơn bạn đã tin tưởng sử dụng dịch vụ..." />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default QuanLyDanhGia;