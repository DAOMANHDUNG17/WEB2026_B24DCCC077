// src/pages/KTGK/QuanLyKhoaHoc/components/FormKhoaHoc.tsx
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Modal } from 'antd';
import TinyEditor from '@/components/TinyEditor'; // Import TinyEditor từ base của bạn
import { IKhoaHoc, DANH_SACH_GIANG_VIEN, DANH_SACH_TRANG_THAI } from '../constant';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (duLieuMoi: IKhoaHoc) => void;
  khoaHocSua?: IKhoaHoc | null;
  danhSachHienTai: IKhoaHoc[];
}

const FormKhoaHoc: React.FC<IProps> = ({
  visible,
  onCancel,
  onSuccess,
  khoaHocSua,
  danhSachHienTai,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && khoaHocSua) {
      form.setFieldsValue(khoaHocSua);
    } else {
      form.resetFields();
    }
  }, [visible, khoaHocSua]);

  const handleLuuDuLieu = async () => {
    try {
      const values = await form.validateFields();

      let idMoi = '';
      if (khoaHocSua) {
        idMoi = khoaHocSua.id; 
      } else {
        if (danhSachHienTai.length === 0) {
          idMoi = 'KH_01';
        } else {
          const maxNum = Math.max(
            ...danhSachHienTai.map((kh) => {
              const num = parseInt(kh.id.replace('KH_', ''), 10);
              return isNaN(num) ? 0 : num;
            })
          );
          const nextNum = maxNum + 1;
          // Thêm số 0 đằng trước nếu nhỏ hơn 10 (vd: KH_03)
          idMoi = `KH_${nextNum < 10 ? '0' + nextNum : nextNum}`;
        }
      }

      const duLieuMoi: IKhoaHoc = {
        id: idMoi,
        ...values,
      };

      onSuccess(duLieuMoi);
    } catch (error) {
      console.error('Lỗi validate form', error);
    }
  };


  const kiemTraTenTrung = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const tonTai = danhSachHienTai.find(
      (kh) => kh.tenKhoaHoc.toLowerCase() === value.toLowerCase() && kh.id !== khoaHocSua?.id
    );
    if (tonTai) {
      return Promise.reject(new Error('Tên khóa học đã tồn tại, vui lòng chọn tên khác!'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
  title={khoaHocSua ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
  visible={visible} // <-- Sửa 'open' thành 'visible'
  onCancel={onCancel}
  onOk={handleLuuDuLieu}
  width={800}
  destroyOnClose
>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="tenKhoaHoc"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học!' },
            { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự!' },
            { validator: kiemTraTenTrung }
          ]}
        >
          <Input placeholder="Nhập tên khóa học" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          name="giangVien"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
          <Select
            placeholder="Chọn giảng viên"
            options={DANH_SACH_GIANG_VIEN}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="soLuongHocVien"
          label="Số lượng học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={0} placeholder="Nhập số lượng" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          initialValue="DANG_MO"
        >
          <Select placeholder="Chọn trạng thái">
            {DANH_SACH_TRANG_THAI.map((tt) => (
              <Select.Option key={tt.value} value={tt.value}>
                {tt.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
        >
          <TinyEditor />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormKhoaHoc;