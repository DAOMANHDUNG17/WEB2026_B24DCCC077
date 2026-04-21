import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { IBaiViet, ITheTag, TTrangThaiBaiViet } from '../constant';
import { THONG_TIN_TAC_GIA, TRANG_THAI_BAI_VIET, chuanHoaSlug } from '../constant';
import { loadPosts, loadTags, savePosts } from '../storage';

type IFormBaiViet = Pick<
  IBaiViet,
  'tieuDe' | 'slug' | 'anhDaiDien' | 'tomTat' | 'noiDung' | 'danhSachTag' | 'trangThai'
>;

const QuanLyBaiViet: FC = () => {
  const [form] = Form.useForm<IFormBaiViet>();
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<IBaiViet[]>(() => loadPosts());
  const [danhSachTag] = useState<ITheTag[]>(() => loadTags());
  const [tuKhoa, setTuKhoa] = useState('');
  const [locTrangThai, setLocTrangThai] = useState<TTrangThaiBaiViet | undefined>(undefined);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [baiVietDangSua, setBaiVietDangSua] = useState<IBaiViet | null>(null);

  useEffect(() => {
    savePosts(danhSachBaiViet);
  }, [danhSachBaiViet]);

  const banDoTag = useMemo(
    () =>
      danhSachTag.reduce<Record<string, string>>((result, tag) => {
        result[tag.id] = tag.tenTag;
        return result;
      }, {}),
    [danhSachTag],
  );

  const duLieuHienThi = useMemo(() => {
    const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();

    return danhSachBaiViet.filter((baiViet) => {
      const khopTieuDe = baiViet.tieuDe.toLowerCase().includes(tuKhoaChuanHoa);
      const khopTrangThai = locTrangThai ? baiViet.trangThai === locTrangThai : true;
      return khopTieuDe && khopTrangThai;
    });
  }, [danhSachBaiViet, locTrangThai, tuKhoa]);

  function moModalThem(): void {
    setBaiVietDangSua(null);
    form.resetFields();
    form.setFieldsValue({
      trangThai: 'NHAP',
      danhSachTag: [],
    });
    setHienThiModal(true);
  }

  function moModalSua(record: IBaiViet): void {
    setBaiVietDangSua(record);
    form.setFieldsValue({
      tieuDe: record.tieuDe,
      slug: record.slug,
      anhDaiDien: record.anhDaiDien,
      tomTat: record.tomTat,
      noiDung: record.noiDung,
      danhSachTag: record.danhSachTag,
      trangThai: record.trangThai,
    });
    setHienThiModal(true);
  }

  function dongModal(): void {
    setHienThiModal(false);
    setBaiVietDangSua(null);
    form.resetFields();
  }

  function xuLyXoa(id: string): void {
    setDanhSachBaiViet((prevState) => prevState.filter((baiViet) => baiViet.id !== id));
    message.success('Đã xóa bài viết.');
  }

  async function xuLyLuuForm(): Promise<void> {
    try {
      const values = await form.validateFields();
      const payload: IFormBaiViet = {
        ...values,
        slug: chuanHoaSlug(values.slug || values.tieuDe),
        danhSachTag: values.danhSachTag || [],
        trangThai: values.trangThai || 'NHAP',
      };

      if (baiVietDangSua) {
        setDanhSachBaiViet((prevState) =>
          prevState.map((baiViet) =>
            baiViet.id === baiVietDangSua.id ? { ...baiViet, ...payload } : baiViet,
          ),
        );
        message.success('Cập nhật bài viết thành công.');
      } else {
        const baiVietMoi: IBaiViet = {
          ...payload,
          id: `bv_${Date.now()}`,
          ngayDang: dayjs().format('DD/MM/YYYY'),
          tacGia: THONG_TIN_TAC_GIA.ten,
          luotXem: 0,
        };

        setDanhSachBaiViet((prevState) => [baiVietMoi, ...prevState]);
        message.success('Thêm bài viết thành công.');
      }

      dongModal();
    } catch (error) {
      return;
    }
  }

  const columns: ColumnsType<IBaiViet> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 260,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (value: TTrangThaiBaiViet) => {
        const trangThai = TRANG_THAI_BAI_VIET[value];
        return <Tag color={trangThai.color}>{trangThai.text}</Tag>;
      },
    },
    {
      title: 'Thẻ',
      dataIndex: 'danhSachTag',
      key: 'danhSachTag',
      render: (danhSachTagCuaBai: string[]) => (
        <Space wrap size={[4, 4]}>
          {danhSachTagCuaBai.map((tagId) => (
            <Tag key={tagId} color="blue">
              {banDoTag[tagId] || tagId}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'luotXem',
      key: 'luotXem',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.luotXem - b.luotXem,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayDang',
      key: 'ngayDang',
      width: 130,
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => moModalSua(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => xuLyXoa(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý bài viết Blog" bordered={false}>
      <Space
        style={{
          marginBottom: 16,
          width: '100%',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 12,
        }}
      >
        <Space wrap>
          <Input
            placeholder="Tìm theo tiêu đề..."
            prefix={<SearchOutlined />}
            value={tuKhoa}
            onChange={(event) => setTuKhoa(event.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select<TTrangThaiBaiViet>
            placeholder="Lọc trạng thái"
            value={locTrangThai}
            options={Object.values(TRANG_THAI_BAI_VIET).map((item) => ({
              label: item.text,
              value: item.value,
            }))}
            onChange={(value) => setLocTrangThai(value)}
            allowClear
            style={{ width: 180 }}
          />
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>
          Thêm bài viết
        </Button>
      </Space>

      <Table
        rowKey="id"
        bordered
        columns={columns}
        dataSource={duLieuHienThi}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={baiVietDangSua ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={hienThiModal}
        onCancel={dongModal}
        onOk={xuLyLuuForm}
        okText="Lưu bài viết"
        cancelText="Hủy"
        width={860}
        destroyOnClose
      >
        <Form<IFormBaiViet>
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if (changedValues.tieuDe && !form.getFieldValue('slug')) {
              form.setFieldsValue({ slug: chuanHoaSlug(changedValues.tieuDe) });
            }
          }}
        >
          <Form.Item
            name="tieuDe"
            label="Tiêu đề bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết.' }]}
          >
            <Input placeholder="Ví dụ: Học React trong 10 phút" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={14}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[
                  { required: true, message: 'Vui lòng nhập slug.' },
                  {
                    validator: async (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      const slugChuanHoa = chuanHoaSlug(value);
                      const daTonTai = danhSachBaiViet.some(
                        (baiViet) =>
                          baiViet.slug === slugChuanHoa &&
                          baiViet.id !== baiVietDangSua?.id,
                      );

                      if (daTonTai) {
                        return Promise.reject(new Error('Slug đã tồn tại.'));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="hoc-react-trong-10-phut" />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item
                name="trangThai"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
              >
                <Select
                  options={Object.values(TRANG_THAI_BAI_VIET).map((item) => ({
                    label: item.text,
                    value: item.value,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="anhDaiDien"
            label="Ảnh đại diện (URL)"
            rules={[
              { required: true, message: 'Vui lòng nhập URL ảnh đại diện.' },
              { type: 'url', message: 'URL ảnh chưa hợp lệ.' },
            ]}
          >
            <Input placeholder="https://domain.com/image.jpg" />
          </Form.Item>

          <Form.Item name="danhSachTag" label="Thẻ">
            <Select
              mode="multiple"
              placeholder="Chọn thẻ tag"
              options={danhSachTag.map((tag) => ({ label: tag.tenTag, value: tag.id }))}
            />
          </Form.Item>

          <Form.Item
            name="tomTat"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt bài viết.' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="noiDung"
            label="Nội dung bài viết (Markdown)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết.' }]}
          >
            <Input.TextArea
              rows={10}
              placeholder="Sử dụng Markdown để viết nội dung chi tiết..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyBaiViet;
