import type { FC } from 'react';
import { Avatar, Button, Card, Col, Descriptions, Row, Space, Tag, Typography } from 'antd';
import {
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { THONG_TIN_TAC_GIA } from '../constant';

const { Title, Paragraph, Text } = Typography;

const iconTheoNhan = {
  GitHub: <GithubOutlined />,
  LinkedIn: <LinkedinOutlined />,
  Facebook: <FacebookOutlined />,
};

const GioiThieu: FC = () => {
  return (
    <Row justify="center">
      <Col xs={24} lg={18}>
        <Card bordered={false}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Avatar
                size={160}
                src={THONG_TIN_TAC_GIA.anhDaiDien}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={3} style={{ marginBottom: 4 }}>
                {THONG_TIN_TAC_GIA.ten}
              </Title>
              <Text type="secondary">{THONG_TIN_TAC_GIA.vaiTro}</Text>

              <div style={{ marginTop: 20 }}>
                <Space wrap>
                  {THONG_TIN_TAC_GIA.lienKetXaHoi.map((item) => (
                    <Button
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      icon={iconTheoNhan[item.label as keyof typeof iconTheoNhan]}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Space>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Title level={4}>Tiểu sử</Title>
              <Paragraph>{THONG_TIN_TAC_GIA.tieuSu}</Paragraph>

              <Descriptions
                title="Thông tin tác giả"
                column={1}
                bordered
                size="small"
                style={{ marginTop: 24 }}
              >
                <Descriptions.Item label="Học vấn">
                  {THONG_TIN_TAC_GIA.hocVan}
                </Descriptions.Item>
                <Descriptions.Item label="Chuyên ngành">
                  {THONG_TIN_TAC_GIA.chuyenNganh}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm">
                  {THONG_TIN_TAC_GIA.kinhNghiem}
                </Descriptions.Item>
                <Descriptions.Item label="Sở thích">
                  {THONG_TIN_TAC_GIA.soThich}
                </Descriptions.Item>
                <Descriptions.Item label="Kỹ năng">
                  <Space wrap size={[8, 8]}>
                    {THONG_TIN_TAC_GIA.kyNang.map((kyNang) => (
                      <Tag color="geekblue" key={kyNang}>
                        {kyNang}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default GioiThieu;
