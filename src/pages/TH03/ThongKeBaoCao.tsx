import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface LichHen {
  id: string;
  tenKhachHang: string;
  dichVu: string;
  nhanVien: string;
  ngayHen: string;
  trangThai: string;
}
const GIA_MOI_CA = 200000;

const ThongKeBaoCao: React.FC = () => {
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);

  useEffect(() => {
    const savedLichHen = localStorage.getItem('th03_lichHen');
    if (savedLichHen) {
      setDanhSachLichHen(JSON.parse(savedLichHen));
    }
  }, []);
  const tongSoLich = danhSachLichHen.length;
  const lichHoanThanh = danhSachLichHen.filter(lh => lh.trangThai === 'Hoàn thành').length;
  const lichHuy = danhSachLichHen.filter(lh => lh.trangThai === 'Hủy').length;
  const tongDoanhThu = lichHoanThanh * GIA_MOI_CA;

  
  const thongKeTheoNgayMap = danhSachLichHen.reduce((acc: any, curr) => {
    if (!acc[curr.ngayHen]) {
      acc[curr.ngayHen] = { ngay: curr.ngayHen, tong: 0, hoanThanh: 0, huy: 0 };
    }
    acc[curr.ngayHen].tong += 1;
    if (curr.trangThai === 'Hoàn thành') acc[curr.ngayHen].hoanThanh += 1;
    if (curr.trangThai === 'Hủy') acc[curr.ngayHen].huy += 1;
    return acc;
  }, {});
  const duLieuTheoNgay = Object.values(thongKeTheoNgayMap);

  
  const thongKeNhanVienMap = danhSachLichHen.reduce((acc: any, curr) => {
    if (curr.trangThai !== 'Hoàn thành') return acc; // Chỉ tính tiền ca đã xong
    if (!acc[curr.nhanVien]) {
      acc[curr.nhanVien] = { ten: curr.nhanVien, soCa: 0, doanhThu: 0 };
    }
    acc[curr.nhanVien].soCa += 1;
    acc[curr.nhanVien].doanhThu += GIA_MOI_CA;
    return acc;
  }, {});
  const duLieuNhanVien = Object.values(thongKeNhanVienMap).sort((a: any, b: any) => b.doanhThu - a.doanhThu); // Sắp xếp giảm dần

  
  const thongKeDichVuMap = danhSachLichHen.reduce((acc: any, curr) => {
    if (curr.trangThai !== 'Hoàn thành') return acc;
    if (!acc[curr.dichVu]) {
      acc[curr.dichVu] = { ten: curr.dichVu, soCa: 0, doanhThu: 0 };
    }
    acc[curr.dichVu].soCa += 1;
    acc[curr.dichVu].doanhThu += GIA_MOI_CA;
    return acc;
  }, {});
  const duLieuDichVu = Object.values(thongKeDichVuMap).sort((a: any, b: any) => b.doanhThu - a.doanhThu);


  
  const formatTien = (tien: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien);

  const cotTheoNgay: ColumnsType<any> = [
    { title: 'Ngày hẹn', dataIndex: 'ngay', key: 'ngay', render: text => <strong>{text}</strong> },
    { title: 'Tổng số lịch', dataIndex: 'tong', key: 'tong', align: 'center' },
    { title: 'Hoàn thành', dataIndex: 'hoanThanh', key: 'hoanThanh', align: 'center', render: val => <Tag color="green">{val}</Tag> },
    { title: 'Đã hủy', dataIndex: 'huy', key: 'huy', align: 'center', render: val => <Tag color="red">{val}</Tag> },
  ];

  const cotNhanVien: ColumnsType<any> = [
    { title: 'Tên Mentor / Nhân viên', dataIndex: 'ten', key: 'ten', render: text => <span>👤 {text}</span> },
    { title: 'Số ca hoàn thành', dataIndex: 'soCa', key: 'soCa', align: 'center' },
    { title: 'Doanh thu mang lại', dataIndex: 'doanhThu', key: 'doanhThu', align: 'right', render: val => <strong style={{ color: '#faad14' }}>{formatTien(val)}</strong> },
  ];

  const cotDichVu: ColumnsType<any> = [
    { title: 'Tên Dịch vụ', dataIndex: 'ten', key: 'ten', render: text => <Tag color="blue">{text}</Tag> },
    { title: 'Số lượt sử dụng', dataIndex: 'soCa', key: 'soCa', align: 'center' },
    { title: 'Tổng doanh thu', dataIndex: 'doanhThu', key: 'doanhThu', align: 'right', render: val => <strong style={{ color: '#faad14' }}>{formatTien(val)}</strong> },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '80vh' }}>
      <h2 style={{ marginBottom: 24 }}>Thống kê & Báo cáo Hoạt động</h2>

      {/* Hàng 1: Các chỉ số KPIs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Tổng số lịch hẹn" value={tongSoLich} prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Đã hoàn thành" value={lichHoanThanh} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Đã hủy" value={lichHuy} valueStyle={{ color: '#cf1322' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Tổng doanh thu" value={tongDoanhThu} prefix={<DollarOutlined style={{ color: '#faad14' }} />} formatter={value => formatTien(Number(value))} />
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Bảng chi tiết */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê Lịch hẹn theo Ngày" bordered={false} style={{ borderRadius: 8 }}>
            <Table columns={cotTheoNgay} dataSource={duLieuTheoNgay} rowKey="ngay" pagination={{ pageSize: 5 }} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bảng xếp hạng Doanh thu Nhân viên" bordered={false} style={{ borderRadius: 8 }}>
            <Table columns={cotNhanVien} dataSource={duLieuNhanVien} rowKey="ten" pagination={{ pageSize: 5 }} size="small" />
          </Card>
        </Col>
      </Row>

      {/* Hàng 3: Doanh thu theo dịch vụ */}
      <Card title="Phân tích Doanh thu theo Dịch vụ" bordered={false} style={{ marginTop: 24, borderRadius: 8 }}>
        <Table columns={cotDichVu} dataSource={duLieuDichVu} rowKey="ten" pagination={false} size="middle" />
      </Card>

    </div>
  );
};

export default ThongKeBaoCao;