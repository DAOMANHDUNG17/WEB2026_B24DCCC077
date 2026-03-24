import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

type KieuDuLieuPhuLuc = 'String' | 'Number' | 'Date';

interface CauHinhPhuLuc {
  maTruong: string;
  tenTruong: string;
  kieuDuLieu: KieuDuLieuPhuLuc;
}

const docJsonTuLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(`Không đọc được dữ liệu localStorage với key ${key}:`, error);
    return null;
  }
};

const chuanHoaKieuDuLieu = (value: string): KieuDuLieuPhuLuc => {
  switch ((value || '').toLowerCase()) {
    case 'number':
      return 'Number';
    case 'date':
      return 'Date';
    default:
      return 'String';
  }
};

const chuanHoaCauHinh = (data: any): CauHinhPhuLuc[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => ({
      maTruong: item?.maTruong || item?.ma || '',
      tenTruong: item?.tenTruong || item?.ten || item?.maTruong || item?.ma || '',
      kieuDuLieu: chuanHoaKieuDuLieu(item?.kieuDuLieu || item?.type || 'String'),
    }))
    .filter((item) => item.maTruong && item.tenTruong);
};

const chuyenGiaTriNgay = (value: any) => {
  if (value && typeof value.format === 'function') {
    return value.format('DD/MM/YYYY');
  }

  return value;
};

const renderInputPhuLuc = (kieuDuLieu: KieuDuLieuPhuLuc) => {
  if (kieuDuLieu === 'Number') {
    return <InputNumber style={{ width: '100%' }} placeholder="Nhập số..." />;
  }

  if (kieuDuLieu === 'Date') {
    return <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày" />;
  }

  return <Input placeholder="Nhập chữ..." />;
};

const VanBang: React.FC = () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [danhSachQD, setDanhSachQD] = useState<any[]>([]);
  const [danhSachSo, setDanhSachSo] = useState<any[]>([]);
  const [cauHinh, setCauHinh] = useState<CauHinhPhuLuc[]>([]);
  const [soHienTai, setSoHienTai] = useState<any>(null);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const duLieuVanBang = docJsonTuLocalStorage('th04_vanBang');
    const duLieuQuyetDinh = docJsonTuLocalStorage('th04_quyetDinh');
    const duLieuSoVanBang = docJsonTuLocalStorage('th04_soVanBang');
    const duLieuCauHinh =
      docJsonTuLocalStorage('th04_cauHinh') ?? docJsonTuLocalStorage('th04_cauHinhBieuMau');
    const cauHinhChuanHoa = chuanHoaCauHinh(duLieuCauHinh);

    if (Array.isArray(duLieuVanBang)) {
      setDanhSach(duLieuVanBang);
    }

    if (Array.isArray(duLieuQuyetDinh)) {
      setDanhSachQD(duLieuQuyetDinh);
    }

    if (Array.isArray(duLieuSoVanBang)) {
      setDanhSachSo(duLieuSoVanBang);
    }

    setCauHinh(cauHinhChuanHoa);

    if (cauHinhChuanHoa.length > 0) {
      localStorage.setItem('th04_cauHinh', JSON.stringify(cauHinhChuanHoa));
    }
  }, []);

  const dongModal = () => {
    setHienThiModal(false);
    setSoHienTai(null);
    form.resetFields();
  };

  const xuLyChonQD = (qdId: string) => {
    const quyetDinh = danhSachQD.find((item) => item.id === qdId);

    if (!quyetDinh) {
      setSoHienTai(null);
      form.setFieldsValue({ soVaoSo: undefined });
      return;
    }

    const soVanBang = danhSachSo.find((item) => item.id === quyetDinh.soVanBangId);

    if (!soVanBang) {
      setSoHienTai(null);
      form.setFieldsValue({ soVaoSo: undefined });
      message.error('Quyết định này chưa liên kết với sổ văn bằng.');
      return;
    }

    setSoHienTai(soVanBang);
    form.setFieldsValue({ soVaoSo: soVanBang.soVaoSoHienTai + 1 });
  };

  const xuLyLuu = (values: any) => {
    try {
      if (!soHienTai) {
        message.error('Vui lòng chọn quyết định có sổ văn bằng hợp lệ.');
        return;
      }

      if (danhSach.some((item) => item.maSinhVien === values.maSinhVien)) {
        message.error('Mã sinh viên này đã được cấp văn bằng.');
        return;
      }

      if (danhSach.some((item) => item.soHieu === values.soHieu)) {
        message.error('Số hiệu văn bằng đã tồn tại.');
        return;
      }

      const thongTinPhuLuc = { ...(values.thongTinPhuLuc || {}) };

      cauHinh.forEach((item) => {
        const giaTri = thongTinPhuLuc[item.maTruong];

        if (giaTri === undefined || giaTri === null || giaTri === '') {
          return;
        }

        thongTinPhuLuc[item.maTruong] =
          item.kieuDuLieu === 'Date' ? chuyenGiaTriNgay(giaTri) : giaTri;
      });

      const vanBangMoi = {
        ...values,
        ngaySinh: chuyenGiaTriNgay(values.ngaySinh) || '',
        soVaoSo: soHienTai.soVaoSoHienTai + 1,
        thongTinPhuLuc,
      };

      const danhSachMoi = [...danhSach, vanBangMoi];
      const danhSachSoMoi = danhSachSo.map((item) =>
        item.id === soHienTai.id ? { ...item, soVaoSoHienTai: item.soVaoSoHienTai + 1 } : item,
      );

      setDanhSach(danhSachMoi);
      setDanhSachSo(danhSachSoMoi);
      localStorage.setItem('th04_vanBang', JSON.stringify(danhSachMoi));
      localStorage.setItem('th04_soVanBang', JSON.stringify(danhSachSoMoi));

      message.success('Cấp phát văn bằng thành công.');
      dongModal();
    } catch (error) {
      console.error('Lỗi khi lưu văn bằng:', error);
      message.error('Có lỗi trong quá trình lưu dữ liệu.');
    }
  };

  const xuLyLoiNhapLieu = () => {
    message.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
  };

  const xuLyXoa = (maSinhVien: string) => {
    const danhSachMoi = danhSach.filter((item) => item.maSinhVien !== maSinhVien);
    setDanhSach(danhSachMoi);
    localStorage.setItem('th04_vanBang', JSON.stringify(danhSachMoi));
    message.success('Đã xóa văn bằng.');
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý thông tin văn bằng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setSoHienTai(null);
            setHienThiModal(true);
          }}
        >
          Cấp văn bằng mới
        </Button>
      </div>

      <Table
        dataSource={danhSach}
        rowKey="maSinhVien"
        bordered
        locale={{ emptyText: 'Chưa có văn bằng nào' }}
      >
        <Table.Column title="Số hiệu" dataIndex="soHieu" render={(value) => <strong>{value}</strong>} />
        <Table.Column
          title="Số vào sổ"
          dataIndex="soVaoSo"
          render={(value) => <Tag color="blue">{value}</Tag>}
        />
        <Table.Column title="Mã SV" dataIndex="maSinhVien" />
        <Table.Column title="Họ tên" dataIndex="hoTen" />
        <Table.Column title="Thuộc quyết định" dataIndex="quyetDinhId" />
        <Table.Column
          title="Hành động"
          render={(_, record: any) => (
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => xuLyXoa(record.maSinhVien)}
            >
              Xóa
            </Button>
          )}
        />
      </Table>

      <Modal
        title="Cấp phát văn bằng"
        visible={hienThiModal}
        onOk={() => form.submit()}
        onCancel={dongModal}
        width={750}
        okText="Lưu dữ liệu"
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={xuLyLuu} onFinishFailed={xuLyLoiNhapLieu}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="quyetDinhId"
              label="Thuộc quyết định đợt"
              rules={[{ required: true, message: 'Bạn chưa chọn quyết định.' }]}
            >
              <Select placeholder="-- Chọn quyết định --" onChange={xuLyChonQD}>
                {danhSachQD.map((qd) => (
                  <Select.Option key={qd.id} value={qd.id}>
                    {qd.id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="soVaoSo" label="Số vào sổ (tự động tăng)">
              <InputNumber
                disabled
                style={{ width: '100%' }}
                placeholder="Hệ thống tự động sinh"
              />
            </Form.Item>

            <Form.Item
              name="soHieu"
              label="Số hiệu văn bằng"
              rules={[{ required: true, message: 'Chưa nhập số hiệu.' }]}
            >
              <Input placeholder="VD: B123456" />
            </Form.Item>

            <Form.Item
              name="maSinhVien"
              label="Mã sinh viên"
              rules={[{ required: true, message: 'Chưa nhập mã sinh viên.' }]}
            >
              <Input placeholder="VD: B24DCCC077" />
            </Form.Item>

            <Form.Item
              name="hoTen"
              label="Họ và tên"
              rules={[{ required: true, message: 'Chưa nhập họ tên.' }]}
            >
              <Input placeholder="VD: Đào Mạnh Dũng" />
            </Form.Item>

            <Form.Item
              name="ngaySinh"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Chưa chọn ngày sinh.' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </div>

          {cauHinh.length > 0 ? (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                border: '1px dashed #1890ff',
                borderRadius: 8,
                background: '#e6f7ff',
              }}
            >
              <h4 style={{ marginBottom: 16, color: '#1890ff' }}>Thông tin phụ lục</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {cauHinh.map((item) => (
                  <Form.Item
                    key={item.maTruong}
                    name={['thongTinPhuLuc', item.maTruong]}
                    label={item.tenTruong}
                    rules={[{ required: true, message: `Bạn chưa điền ${item.tenTruong}.` }]}
                  >
                    {renderInputPhuLuc(item.kieuDuLieu)}
                  </Form.Item>
                ))}
              </div>
            </div>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default VanBang;
