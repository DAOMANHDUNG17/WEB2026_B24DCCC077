export const TAO_ID = () => `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

export const tronNgauNhien = <T,>(danhSach: T[]) => {
	const ketQua = [...danhSach];
	for (let i = ketQua.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[ketQua[i], ketQua[j]] = [ketQua[j], ketQua[i]];
	}
	return ketQua;
};

