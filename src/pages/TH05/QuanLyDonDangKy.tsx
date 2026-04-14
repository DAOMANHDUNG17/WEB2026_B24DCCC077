import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Input, message } from 'antd';
import { DonDangKy, CauLacBo, LichSuThaoTac } from './types';
import dayjs from 'dayjs';

interface Props {
  danhSachDonDangKy: DonDangKy[];
  setDanhSachDonDangKy: React.Dispatch<React.SetStateAction<DonDangKy[]>>;
  danhSachCauLacBo: CauLacBo[];
  lichSuThaoTac: LichSuThaoTac[];
  setLichSuThaoTac: React.Dispatch<React.SetStateAction<LichSuThaoTac[]>>;
}

const QuanLyDonDangKy: React.FC<Props> = ({ danhSachDonDangKy, setDanhSachDonDangKy, danhSachCauLacBo, lichSuThaoTac, setLichSuThaoTac }) => {
  const [dsDonDuocChon, setDsDonDuocChon] = useState<React.Key[]>([]);
  const [hienThiModalTuChoi, setHienThiModalTuChoi] = useState(false);
  const [lyDoTuChoi, setLyDoTuChoi] = useState('');
  const [hienThiModalLichSu, setHienThiModalLichSu] = useState(false);
  const [lichSuHienTai, setLichSuHienTai] = useState<LichSuThaoTac[]>([]);

  const ghiNhanLichSu = (idDon: string, noiDung: string) => {
    const ls: LichSuThaoTac = {
      id: Date.now().toString() + Math.random().toString(),
      idDonDangKy: idDon,
      thoiGian: dayjs().format('HH:mm DD/MM/YYYY'),
      noiDung
    };
    setLichSuThaoTac(prev => [ls, ...prev]);
  };

  const xuLyDuyet = () => {
    setDanhSachDonDangKy(prev => {
      return prev.map(don => {
        if (dsDonDuocChon.includes(don.id)) {
          ghiNhanLichSu(don.id, `Admin đã Approved vào lúc ${dayjs().format('HH:mm DD/MM/YYYY')}`);
          return { ...don, trangThai: 'Approved' };
        }
        return don; // Bắt buộc return cho tất cả trường hợp
      });
    });
    message.success(`Đã duyệt ${dsDonDuocChon.length} đơn`);
    setDsDonDuocChon([]);
  };

  const xuLyTuChoi = () => {
    if (!lyDoTuChoi.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setDanhSachDonDangKy(prev => {
      return prev.map(don => {
        if (dsDonDuocChon.includes(don.id)) {
          ghiNhanLichSu(don.id, `Admin đã Rejected vào lúc ${dayjs().format('HH:mm DD/MM/YYYY')} với lý do: ${lyDoTuChoi}`);
          return { ...don, trangThai: 'Rejected', ghiChu: lyDoTuChoi };
        }
        return don; // Bắt buộc return cho tất cả trường hợp
      });
    });
    message.success(`Đã từ chối ${dsDonDuocChon.length} đơn`);
    setHienThiModalTuChoi(false);
    setLyDoTuChoi('');
    setDsDonDuocChon([]);
  };

  const xemLichSu = (idDon: string) => {
    const ls = lichSuThaoTac.filter(item => item.idDonDangKy === idDon);
    setLichSuHienTai(ls);
    setHienThiModalLichSu(true);
  };

  const cot = [
    { title: 'Họ tên', dataIndex: 'hoTen' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'sdt' },
    { 
      title: 'Câu lạc bộ', 
      render: (_: any, r: DonDangKy) => {
        const clb = danhSachCauLacBo.find(c => c.id === r.idCauLacBo);
        return clb ? clb.tenCauLacBo : '';
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      render: (tt: string) => {
        return <Tag color={tt === 'Approved' ? 'green' : tt === 'Rejected' ? 'red' : 'orange'}>{tt}</Tag>;
      }
    },
    { title: 'Ghi chú', dataIndex: 'ghiChu' },
    { 
      title: 'Thao tác', 
      render: (_: any, record: DonDangKy) => {
        return <Button type="link" onClick={() => xemLichSu(record.id)}>Xem lịch sử</Button>;
      }
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" disabled={dsDonDuocChon.length === 0} onClick={xuLyDuyet}>
          Duyệt {dsDonDuocChon.length > 0 && dsDonDuocChon.length} đơn đã chọn
        </Button>
        <Button danger disabled={dsDonDuocChon.length === 0} onClick={() => setHienThiModalTuChoi(true)}>
          Từ chối {dsDonDuocChon.length > 0 && dsDonDuocChon.length} đơn đã chọn
        </Button>
      </Space>

      <Table 
        rowSelection={{ selectedRowKeys: dsDonDuocChon, onChange: setDsDonDuocChon }}
        columns={cot} 
        dataSource={danhSachDonDangKy} 
        rowKey="id" 
      />

      <Modal title="Lý do từ chối" visible={hienThiModalTuChoi} onOk={xuLyTuChoi} onCancel={() => setHienThiModalTuChoi(false)}>
        <Input.TextArea rows={4} value={lyDoTuChoi} onChange={e => setLyDoTuChoi(e.target.value)} placeholder="Nhập lý do bắt buộc..." />
      </Modal>

      <Modal title="Lịch sử thao tác" visible={hienThiModalLichSu} footer={null} onCancel={() => setHienThiModalLichSu(false)}>
        {lichSuHienTai.length === 0 ? <p>Chưa có lịch sử thao tác.</p> : 
          <ul>{lichSuHienTai.map(ls => <li key={ls.id}><b>{ls.thoiGian}:</b> {ls.noiDung}</li>)}</ul>
        }
      </Modal>
    </div>
  );
};

export default QuanLyDonDangKy;