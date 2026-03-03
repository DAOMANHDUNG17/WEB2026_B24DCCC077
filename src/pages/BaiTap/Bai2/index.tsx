import { Button, message, Space, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import QuanLyMucTieuThang from './components/QuanLyMucTieuThang';
import TongQuanHocTap from './components/TongQuanHocTap';
import QuanLyTienDoHocTap from './components/QuanLyTienDoHocTap';
import QuanLyMonHoc from './components/QuanLyMonHoc';
import { createDefaultData, generateId, loadStudyTrackerData, saveStudyTrackerData } from './storage';
import type { MonthlyGoal, StudySession, Subject } from './types';

const { Title } = Typography;

const Bai2Page = () => {
	const duLieuBanDau = useMemo(() => loadStudyTrackerData(), []);
	const [danhSachMonHoc, setDanhSachMonHoc] = useState<Subject[]>(duLieuBanDau.subjects);
	const [danhSachBuoiHoc, setDanhSachBuoiHoc] = useState<StudySession[]>(duLieuBanDau.sessions);
	const [danhSachMucTieu, setDanhSachMucTieu] = useState<MonthlyGoal[]>(duLieuBanDau.goals);
	const [thangDangChon, setThangDangChon] = useState<string>(moment().format('YYYY-MM'));

	useEffect(() => {
		saveStudyTrackerData({ subjects: danhSachMonHoc, sessions: danhSachBuoiHoc, goals: danhSachMucTieu });
	}, [danhSachMonHoc, danhSachBuoiHoc, danhSachMucTieu]);

	const soBuoiTheoMonHoc = useMemo(() => {
		const ketQua: Record<string, number> = {};
		danhSachBuoiHoc.forEach((buoiHoc) => {
			ketQua[buoiHoc.subjectId] = (ketQua[buoiHoc.subjectId] || 0) + 1;
		});
		return ketQua;
	}, [danhSachBuoiHoc]);

	const danhSachBuoiHocTrongThang = useMemo(
		() => danhSachBuoiHoc.filter((buoiHoc) => moment(buoiHoc.studyAt).format('YYYY-MM') === thangDangChon),
		[danhSachBuoiHoc, thangDangChon],
	);

	const soPhutTheoMonTrongThang = useMemo(() => {
		const ketQua: Record<string, number> = {};
		danhSachBuoiHocTrongThang.forEach((buoiHoc) => {
			ketQua[buoiHoc.subjectId] = (ketQua[buoiHoc.subjectId] || 0) + buoiHoc.durationMinutes;
		});
		return ketQua;
	}, [danhSachBuoiHocTrongThang]);

	const tongSoPhutTrongThang = useMemo(
		() => danhSachBuoiHocTrongThang.reduce((tong, buoiHoc) => tong + buoiHoc.durationMinutes, 0),
		[danhSachBuoiHocTrongThang],
	);
	const mucTieuThangDangChon = useMemo(
		() => danhSachMucTieu.find((mucTieu) => mucTieu.month === thangDangChon),
		[danhSachMucTieu, thangDangChon],
	);

	const taoMonHoc = (ten: string) => {
		if (danhSachMonHoc.some((monHoc) => monHoc.name.trim().toLowerCase() === ten.toLowerCase())) {
			message.warning('Môn học đã tồn tại.');
			return;
		}
		setDanhSachMonHoc((duLieuCu) => [
			...duLieuCu,
			{
				id: generateId(),
				name: ten,
				createdAt: new Date().toISOString(),
			},
		]);
		message.success('Đã thêm môn học.');
	};

	const capNhatMonHoc = (id: string, ten: string) => {
		if (danhSachMonHoc.some((monHoc) => monHoc.id !== id && monHoc.name.trim().toLowerCase() === ten.toLowerCase())) {
			message.warning('Tên môn học đã tồn tại.');
			return;
		}
		setDanhSachMonHoc((duLieuCu) => duLieuCu.map((monHoc) => (monHoc.id === id ? { ...monHoc, name: ten } : monHoc)));
		message.success('Đã cập nhật môn học.');
	};

	const xoaMonHoc = (id: string) => {
		setDanhSachMonHoc((duLieuCu) => duLieuCu.filter((monHoc) => monHoc.id !== id));
		setDanhSachBuoiHoc((duLieuCu) => duLieuCu.filter((buoiHoc) => buoiHoc.subjectId !== id));
		setDanhSachMucTieu((duLieuCu) =>
			duLieuCu.map((mucTieu) => {
				const mucTieuTheoMon = { ...mucTieu.subjectTargets };
				delete mucTieuTheoMon[id];
				return { ...mucTieu, subjectTargets: mucTieuTheoMon };
			}),
		);
		message.success('Đã xóa môn học và các dữ liệu liên quan.');
	};

	const taoBuoiHoc = (duLieu: Omit<StudySession, 'id'>) => {
		setDanhSachBuoiHoc((duLieuCu) => [...duLieuCu, { id: generateId(), ...duLieu }]);
		message.success('Đã thêm lịch học.');
	};

	const capNhatBuoiHoc = (id: string, duLieu: Omit<StudySession, 'id'>) => {
		setDanhSachBuoiHoc((duLieuCu) => duLieuCu.map((buoiHoc) => (buoiHoc.id === id ? { id, ...duLieu } : buoiHoc)));
		message.success('Đã cập nhật lịch học.');
	};

	const xoaBuoiHoc = (id: string) => {
		setDanhSachBuoiHoc((duLieuCu) => duLieuCu.filter((buoiHoc) => buoiHoc.id !== id));
		message.success('Đã xóa lịch học.');
	};

	const luuMucTieuThang = (duLieu: { month: string; totalMinutesTarget?: number; subjectTargets: Record<string, number> }) => {
		setDanhSachMucTieu((duLieuCu) => {
			const viTri = duLieuCu.findIndex((mucTieu) => mucTieu.month === duLieu.month);
			const mucTieuMoi: MonthlyGoal = {
				month: duLieu.month,
				totalMinutesTarget: duLieu.totalMinutesTarget,
				subjectTargets: duLieu.subjectTargets,
				updatedAt: new Date().toISOString(),
			};
			if (viTri >= 0) {
				const ketQua = [...duLieuCu];
				ketQua[viTri] = mucTieuMoi;
				return ketQua;
			}
			return [...duLieuCu, mucTieuMoi];
		});
		message.success('Đã lưu mục tiêu tháng.');
	};

	const resetDuLieu = () => {
		const duLieuMacDinh = createDefaultData();
		setDanhSachMonHoc(duLieuMacDinh.subjects);
		setDanhSachBuoiHoc(duLieuMacDinh.sessions);
		setDanhSachMucTieu(duLieuMacDinh.goals);
		setThangDangChon(moment().format('YYYY-MM'));
		message.success('Đã reset dữ liệu về mặc định.');
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<div>
				<Title level={3}>Bài 2: Quản lý tiến độ học tập</Title>
			</div>

			<TongQuanHocTap
				tongMonHoc={danhSachMonHoc.length}
				tongBuoiHocTrongThang={danhSachBuoiHocTrongThang.length}
				tongPhutHocTrongThang={tongSoPhutTrongThang}
			/>

			<QuanLyMonHoc
				danhSachMonHoc={danhSachMonHoc}
				soBuoiTheoMonHoc={soBuoiTheoMonHoc}
				taoMonHoc={taoMonHoc}
				capNhatMonHoc={capNhatMonHoc}
				xoaMonHoc={xoaMonHoc}
			/>

			<QuanLyTienDoHocTap
				danhSachMonHoc={danhSachMonHoc}
				danhSachBuoiHoc={[...danhSachBuoiHoc].sort((a, b) => moment(b.studyAt).valueOf() - moment(a.studyAt).valueOf())}
				taoBuoiHoc={taoBuoiHoc}
				capNhatBuoiHoc={capNhatBuoiHoc}
				xoaBuoiHoc={xoaBuoiHoc}
			/>

			<QuanLyMucTieuThang
				thangDangChon={thangDangChon}
				danhSachMonHoc={danhSachMonHoc}
				mucTieuThang={mucTieuThangDangChon}
				soPhutTheoMonTrongThang={soPhutTheoMonTrongThang}
				tongSoPhutTrongThang={tongSoPhutTrongThang}
				doiThang={setThangDangChon}
				luuMucTieu={luuMucTieuThang}
			/>

			<Space>
				<Button type='link' onClick={resetDuLieu} style={{ paddingLeft: 0 }}>
					Reset dữ liệu về mặc định
				</Button>
			</Space>
		</Space>
	);
};

export default Bai2Page;
