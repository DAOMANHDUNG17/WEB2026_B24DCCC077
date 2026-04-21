import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EyeOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import type { IBaiViet, ITheTag } from '../constant';
import { THONG_TIN_TAC_GIA, layThoiGianTuNgayDang } from '../constant';
import { loadPosts, loadTags, savePosts } from '../storage';

const { Title, Paragraph, Text } = Typography;

const TrangChuBlog: FC = () => {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<IBaiViet[]>(() => loadPosts());
  const [danhSachTag] = useState<ITheTag[]>(() => loadTags());
  const [tuKhoaInput, setTuKhoaInput] = useState('');
  const [tuKhoaDebounce, setTuKhoaDebounce] = useState('');
  const [tagDangChon, setTagDangChon] = useState<string | null>(null);
  const [baiVietDangXem, setBaiVietDangXem] = useState<IBaiViet | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTuKhoaDebounce(tuKhoaInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [tuKhoaInput]);

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

  const baiVietDaDang = useMemo(
    () =>
      [...danhSachBaiViet]
        .filter((baiViet) => baiViet.trangThai === 'DA_DANG')
        .sort((a, b) => layThoiGianTuNgayDang(b.ngayDang) - layThoiGianTuNgayDang(a.ngayDang)),
    [danhSachBaiViet],
  );

  const duLieuHienThi = useMemo(() => {
    return baiVietDaDang.filter((baiViet) => {
      const coTag = tagDangChon ? baiViet.danhSachTag.includes(tagDangChon) : true;
      const tuKhoa = tuKhoaDebounce.toLowerCase();
      const noiDungTimKiem = [
        baiViet.tieuDe,
        baiViet.tomTat,
        baiViet.noiDung,
        baiViet.tacGia,
        baiViet.danhSachTag.map((idTag) => banDoTag[idTag] || '').join(' '),
      ]
        .join(' ')
        .toLowerCase();

      const khopTuKhoa = tuKhoa ? noiDungTimKiem.includes(tuKhoa) : true;

      return coTag && khopTuKhoa;
    });
  }, [baiVietDaDang, banDoTag, tagDangChon, tuKhoaDebounce]);

  const moChiTietBaiViet = (baiViet: IBaiViet) => {
    const danhSachMoi = danhSachBaiViet.map((item) =>
      item.id === baiViet.id ? { ...item, luotXem: item.luotXem + 1 } : item,
    );
    const baiVietMoi = danhSachMoi.find((item) => item.id === baiViet.id) || baiViet;

    setDanhSachBaiViet(danhSachMoi);
    setBaiVietDangXem(baiVietMoi);
  };

  const baiVietLienQuan = useMemo(() => {
    if (!baiVietDangXem) {
      return [];
    }

    return baiVietDaDang
      .filter(
        (baiViet) =>
          baiViet.id !== baiVietDangXem.id &&
          baiViet.danhSachTag.some((tag) => baiVietDangXem.danhSachTag.includes(tag)),
      )
      .slice(0, 3);
  }, [baiVietDaDang, baiVietDangXem]);

  if (baiVietDangXem) {
    return (
      <Card bordered={false}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => setBaiVietDangXem(null)}
          style={{ marginBottom: 24 }}
        >
          Quay lại danh sách
        </Button>

        <img
          alt={baiVietDangXem.tieuDe}
          src={baiVietDangXem.anhDaiDien}
          style={{
            width: '100%',
            maxHeight: 360,
            objectFit: 'cover',
            borderRadius: 12,
            marginBottom: 24,
          }}
        />

        <Title level={2}>{baiVietDangXem.tieuDe}</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          {baiVietDangXem.tomTat}
        </Paragraph>

        <Space
          split={<Divider type="vertical" />}
          wrap
          style={{ marginBottom: 24, color: 'rgba(0, 0, 0, 0.65)' }}
        >
          <Text>
            <UserOutlined /> {baiVietDangXem.tacGia}
          </Text>
          <Text>
            <CalendarOutlined /> {baiVietDangXem.ngayDang}
          </Text>
          <Text>
            <EyeOutlined /> {baiVietDangXem.luotXem} lượt xem
          </Text>
        </Space>

        <Card
          size="small"
          style={{ marginBottom: 24, background: '#fafafa' }}
          bodyStyle={{ padding: 16 }}
        >
          <Space align="start">
            <Avatar size={56} src={THONG_TIN_TAC_GIA.anhDaiDien} icon={<UserOutlined />} />
            <div>
              <Text strong>{THONG_TIN_TAC_GIA.ten}</Text>
              <div>
                <Text type="secondary">{THONG_TIN_TAC_GIA.vaiTro}</Text>
              </div>
              <Paragraph style={{ margin: '8px 0 0' }}>{THONG_TIN_TAC_GIA.tieuSu}</Paragraph>
            </div>
          </Space>
        </Card>

        <div style={{ marginBottom: 24 }}>
          <Space wrap size={[8, 8]}>
            {baiVietDangXem.danhSachTag.map((tagId) => (
              <Tag key={tagId} color="blue" icon={<TagOutlined />}>
                {banDoTag[tagId] || 'Chưa gắn thẻ'}
              </Tag>
            ))}
          </Space>
        </div>

        <Card
          bodyStyle={{
            fontSize: 16,
            lineHeight: 1.8,
            whiteSpace: 'normal',
          }}
        >
          <ReactMarkdown>{baiVietDangXem.noiDung}</ReactMarkdown>
        </Card>

        <div style={{ marginTop: 32 }}>
          <Title level={4}>Bài viết liên quan</Title>
          {baiVietLienQuan.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
              dataSource={baiVietLienQuan}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    size="small"
                    cover={
                      <img
                        alt={item.tieuDe}
                        src={item.anhDaiDien}
                        style={{ height: 160, objectFit: 'cover' }}
                      />
                    }
                    onClick={() => moChiTietBaiViet(item)}
                  >
                    <Card.Meta
                      title={item.tieuDe}
                      description={
                        <Space split={<Divider type="vertical" />} size={4}>
                          <Text type="secondary">{item.ngayDang}</Text>
                          <Text type="secondary">
                            <EyeOutlined /> {item.luotXem}
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="Chưa có bài viết liên quan" />
          )}
        </div>
      </Card>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={18}>
        <Card title="Trang chủ Blog cá nhân" bordered={false}>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề, nội dung, tác giả hoặc tag..."
            value={tuKhoaInput}
            onChange={(event) => setTuKhoaInput(event.target.value)}
            allowClear
            size="large"
            style={{ marginBottom: 24 }}
          />

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, xl: 3 }}
            pagination={{ pageSize: 9, showSizeChanger: false }}
            locale={{ emptyText: 'Không có bài viết phù hợp' }}
            dataSource={duLieuHienThi}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => moChiTietBaiViet(item)}
                  cover={
                    <img
                      alt={item.tieuDe}
                      src={item.anhDaiDien}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  bodyStyle={{ minHeight: 260 }}
                >
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {item.tieuDe}
                    </Title>

                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {item.tomTat}
                    </Paragraph>

                    <Space split={<Divider type="vertical" />} wrap size={4}>
                      <Text type="secondary">
                        <UserOutlined /> {item.tacGia}
                      </Text>
                      <Text type="secondary">
                        <CalendarOutlined /> {item.ngayDang}
                      </Text>
                      <Text type="secondary">
                        <EyeOutlined /> {item.luotXem}
                      </Text>
                    </Space>

                    <Space wrap size={[8, 8]}>
                      {item.danhSachTag.map((tagId) => (
                        <Tag
                          key={tagId}
                          color={tagDangChon === tagId ? 'processing' : 'blue'}
                          onClick={(event) => {
                            event.stopPropagation();
                            setTagDangChon(tagId);
                          }}
                        >
                          {banDoTag[tagId] || 'Tag'}
                        </Tag>
                      ))}
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} lg={6}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Card title="Lọc theo thẻ" bordered={false}>
            <Space wrap size={[8, 8]}>
              <Tag.CheckableTag checked={tagDangChon === null} onChange={() => setTagDangChon(null)}>
                Tất cả
              </Tag.CheckableTag>
              {danhSachTag.map((tag) => (
                <Tag.CheckableTag
                  key={tag.id}
                  checked={tagDangChon === tag.id}
                  onChange={(checked) => setTagDangChon(checked ? tag.id : null)}
                >
                  {tag.tenTag}
                </Tag.CheckableTag>
              ))}
            </Space>
          </Card>

          <Card title="Tác giả" bordered={false}>
            <Space align="start">
              <Avatar size={56} src={THONG_TIN_TAC_GIA.anhDaiDien} icon={<UserOutlined />} />
              <div>
                <Text strong>{THONG_TIN_TAC_GIA.ten}</Text>
                <div>
                  <Text type="secondary">{THONG_TIN_TAC_GIA.vaiTro}</Text>
                </div>
              </div>
            </Space>
            <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
              {THONG_TIN_TAC_GIA.tieuSu}
            </Paragraph>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TrangChuBlog;
