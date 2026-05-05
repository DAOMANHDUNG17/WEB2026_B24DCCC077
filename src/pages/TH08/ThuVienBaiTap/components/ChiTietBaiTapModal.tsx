import { Descriptions, Modal, Tag, Typography } from 'antd';
import { layMauMucDoKho, layNhanMucDoKho, layNhanNhomCo } from '../../helpers';
import type { BaiTapThuVien } from '../../types';

type Props = {
	visible: boolean;
	baiTapDangXem: BaiTapThuVien | null;
	onDong: () => void;
};

const ChiTietBaiTapModal = ({ visible, baiTapDangXem, onDong }: Props) => {
	return (
		<Modal
			title={baiTapDangXem?.tenBaiTap || 'Chi tiết bài tập'}
			visible={visible}
			onCancel={onDong}
			footer={null}
			destroyOnClose
		>
			{baiTapDangXem ? (
				<>
					<Descriptions column={1} bordered size='small'>
						<Descriptions.Item label='Nhóm cơ tác động'>{layNhanNhomCo(baiTapDangXem.nhomCo)}</Descriptions.Item>
						<Descriptions.Item label='Mức độ khó'>
							<Tag color={layMauMucDoKho(baiTapDangXem.mucDoKho)}>{layNhanMucDoKho(baiTapDangXem.mucDoKho)}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Calo đốt trung bình/giờ'>
							{baiTapDangXem.caloTrungBinhMoiGio} kcal
						</Descriptions.Item>
						<Descriptions.Item label='Mô tả ngắn'>{baiTapDangXem.moTaNgan}</Descriptions.Item>
					</Descriptions>
					<div style={{ marginTop: 16 }}>
						<Typography.Title level={5}>Hướng dẫn thực hiện</Typography.Title>
						<SpaceHuongDan noiDung={baiTapDangXem.huongDanChiTiet} />
					</div>
				</>
			) : null}
		</Modal>
	);
};

const SpaceHuongDan = ({ noiDung }: { noiDung: string }) => {
	return (
		<div>
			{noiDung.split('\n').map((dong) => (
				<Typography.Paragraph key={dong} style={{ marginBottom: 8 }}>
					{dong}
				</Typography.Paragraph>
			))}
		</div>
	);
};

export default ChiTietBaiTapModal;
