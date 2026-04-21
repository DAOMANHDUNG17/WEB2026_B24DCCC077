import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { IBaiViet, ITheTag } from '../constant';
import { loadPosts, loadTags, saveTags } from '../storage';

const QuanLyThe: FC = () => {
  const [form] = Form.useForm<ITheTag>();
  const [danhSachTag, setDanhSachTag] = useState<ITheTag[]>(() => loadTags());
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<IBaiViet[]>(() => loadPosts());
  const [hienThiModal, setHienThiModal] = useState(false);
  const [tagDangSua, setTagDangSua] = useState<ITheTag | null>(null);

  useEffect(() => {
    saveTags(danhSachTag);
  }, [danhSachTag]);

  useEffect(() => {
    const dongBoBaiViet = () => {
      setDanhSachBaiViet(loadPosts());
    };

    dongBoBaiViet();
    window.addEventListener('focus', dongBoBaiViet);
    window.addEventListener('storage', dongBoBaiViet);

    return () => {
      window.removeEventListener('focus', dongBoBaiViet);
      window.removeEventListener('storage', dongBoBaiViet);
    };
  }, []);

  const thongKeSuDungTag = useMemo(
    () =>
      danhSachBaiViet.reduce<Record<string, number>>((result, baiViet) => {
        baiViet.danhSachTag.forEach((tagId) => {
          result[tagId] = (result[tagId] || 0) + 1;
        });

        return result;
      }, {}),
    [danhSachBaiViet],
  );

  const moModalThem = () => {
    setTagDangSua(null);
    form.resetFields();
    setHienThiModal(true);
  };

  const moModalSua = (record: ITheTag) => {
    setTagDangSua(record);
    form.setFieldsValue(record);
    setHienThiModal(true);
  };

  const dongModal = () => {
    setTagDangSua(null);
    setHienThiModal(false);
    form.resetFields();
  };

  const xuLyXoa = (id: string) => {
    if ((thongKeSuDungTag[id] || 0) > 0) {
      message.error('Không thể xóa thẻ đang được sử dụng trong bài viết.');
      return;
    }

    setDanhSachTag((prevState) => prevState.filter((tag) => tag.id !== id));
    message.success('Đã xóa thẻ.');
  };

  const xuLyLuu = async () => {
    try {
      const values = await form.validateFields();
      const tenTag = values.tenTag.trim();

      if (tagDangSua) {
        setDanhSachTag((prevState) =>
          prevState.map((tag) =>
            tag.id === tagDangSua.id ? { ...tag, tenTag } : tag,
          ),
        );
        message.success('Cập nhật thẻ thành công.');
      } else {
        setDanhSachTag((prevState) => [...prevState, { id: `tag_${Date.now()}`, tenTag }]);
        message.success('Thêm thẻ mới thành công.');
      }

      dongModal();
    } catch (error) {
      return;
    }
  };

  const columns: ColumnsType<ITheTag> = [
    {
      title: 'Tên thẻ',
      dataIndex: 'tenTag',
      key: 'tenTag',
      render: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: 'Số bài viết sử dụng',
      key: 'count',
      width: 180,
      align: 'center',
      render: (_, record) => thongKeSuDungTag[record.id] || 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const dangSuDung = (thongKeSuDungTag[record.id] || 0) > 0;

        return (
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => moModalSua(record)}
            />
            <Popconfirm
              title="Bạn có chắc muốn xóa thẻ này?"
              onConfirm={() => xuLyXoa(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button size="small" danger icon={<DeleteOutlined />} disabled={dangSuDung} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Quản lý thẻ (Tags)"
      bordered={false}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>
          Thêm tag mới
        </Button>
      }
    >
      <Table
        rowKey="id"
        bordered
        columns={columns}
        dataSource={danhSachTag}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <Modal
        title={tagDangSua ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={hienThiModal}
        onOk={xuLyLuu}
        onCancel={dongModal}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form<ITheTag> form={form} layout="vertical">
          <Form.Item
            name="tenTag"
            label="Tên thẻ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thẻ.' },
              {
                validator: async (_, value) => {
                  const tenTag = (value || '').trim().toLowerCase();

                  if (!tenTag) {
                    return Promise.resolve();
                  }

                  const biTrung = danhSachTag.some(
                    (tag) =>
                      tag.tenTag.trim().toLowerCase() === tenTag &&
                      tag.id !== tagDangSua?.id,
                  );

                  if (biTrung) {
                    return Promise.reject(new Error('Tên thẻ đã tồn tại.'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Ví dụ: ReactJS, Markdown..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyThe;
