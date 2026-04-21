export type TTrangThaiBaiViet = 'NHAP' | 'DA_DANG';

export interface ITheTag {
  id: string;
  tenTag: string;
}

export interface IBaiViet {
  id: string;
  tieuDe: string;
  slug: string;
  anhDaiDien: string;
  tomTat: string;
  noiDung: string;
  ngayDang: string;
  tacGia: string;
  luotXem: number;
  trangThai: TTrangThaiBaiViet;
  danhSachTag: string[];
}

export interface ILienKetXaHoi {
  label: string;
  url: string;
}

export interface IThongTinTacGia {
  ten: string;
  vaiTro: string;
  anhDaiDien: string;
  tieuSu: string;
  hocVan: string;
  chuyenNganh: string;
  kinhNghiem: string;
  soThich: string;
  kyNang: string[];
  lienKetXaHoi: ILienKetXaHoi[];
}

export const STORAGE_KEYS = {
  baiViet: 'TH07_BAI_VIET',
  the: 'TH07_TAGS',
} as const;

export const TRANG_THAI_BAI_VIET: Record<
  TTrangThaiBaiViet,
  { text: string; color: 'default' | 'success'; value: TTrangThaiBaiViet }
> = {
  NHAP: { text: 'Bản nháp', color: 'default', value: 'NHAP' },
  DA_DANG: { text: 'Đã đăng', color: 'success', value: 'DA_DANG' },
};

export const THONG_TIN_TAC_GIA: IThongTinTacGia = {
  ten: 'Đào Mạnh Dũng',
  vaiTro: 'Frontend Developer / Sinh viên PTIT',
  anhDaiDien: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  tieuSu:
    'Mình yêu thích xây dựng các giao diện web rõ ràng, dễ dùng và có cấu trúc dữ liệu tốt. Blog này là nơi mình ghi lại kiến thức học được trong quá trình làm việc với React, TypeScript, UmiJS và Ant Design.',
  hocVan: 'Sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
  chuyenNganh: 'Công nghệ phần mềm / Hệ thống thông tin',
  kinhNghiem: 'Xây dựng ứng dụng web học tập, trang quản trị và các bài thực hành React',
  soThich: 'Lập trình giao diện, viết blog kỹ thuật, tối ưu trải nghiệm người dùng',
  kyNang: ['ReactJS', 'TypeScript', 'Ant Design', 'UmiJS', 'Node.js', 'Markdown'],
  lienKetXaHoi: [
    { label: 'GitHub', url: 'https://github.com/DAOMANHDUNG17' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com' },
    { label: 'Facebook', url: 'https://www.facebook.com' },
  ],
};

export const MOCK_TAGS: ITheTag[] = [
  { id: 'tag_1', tenTag: 'ReactJS' },
  { id: 'tag_2', tenTag: 'TypeScript' },
  { id: 'tag_3', tenTag: 'Ant Design' },
  { id: 'tag_4', tenTag: 'Markdown' },
  { id: 'tag_5', tenTag: 'UmiJS' },
  { id: 'tag_6', tenTag: 'Quản trị nội dung' },
];

const taoNoiDungMarkdown = (
  moTa: string,
  yChinh: string[],
  viDu: string,
): string => `## Mở đầu

${moTa}

## Nội dung chính

${yChinh.map((item) => `- ${item}`).join('\n')}

## Ví dụ

\`\`\`tsx
${viDu}
\`\`\`

## Kết luận

Bài viết tập trung vào cách triển khai thực tế, dễ áp dụng ngay trong dự án blog cá nhân.
`;

const DU_LIEU_BAI_VIET_MAU: (
  Omit<IBaiViet, 'noiDung' | 'tacGia'> & {
    moTa: string;
    yChinh: string[];
    viDu: string;
  }
)[] = [
  {
    id: 'bv_01',
    tieuDe: 'Bắt đầu với ReactJS khi xây dựng blog cá nhân',
    slug: 'bat-dau-voi-reactjs-khi-xay-dung-blog-ca-nhan',
    anhDaiDien: 'https://picsum.photos/seed/th07-react/1200/720',
    tomTat: 'Lộ trình ngắn gọn để khởi tạo blog với React, chia component và quản lý state hợp lý.',
    ngayDang: '21/04/2026',
    luotXem: 162,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_1', 'tag_2'],
    moTa: 'ReactJS phù hợp để xây dựng blog cá nhân vì component hóa rõ ràng và dễ mở rộng.',
    yChinh: [
      'Tách card bài viết, bộ lọc, form quản trị thành các khối độc lập.',
      'Dùng state cục bộ cho dữ liệu nhỏ và localStorage cho dữ liệu demo.',
      'Thiết kế luồng xem danh sách và xem chi tiết thật rõ ràng.',
    ],
    viDu: 'const [posts, setPosts] = useState<IBaiViet[]>(loadPosts());',
  },
  {
    id: 'bv_02',
    tieuDe: 'Tổ chức kiểu dữ liệu TypeScript cho bài viết và thẻ tag',
    slug: 'to-chuc-kieu-du-lieu-typescript-cho-bai-viet-va-the-tag',
    anhDaiDien: 'https://picsum.photos/seed/th07-typescript/1200/720',
    tomTat: 'Định nghĩa interface giúp quản lý bài viết, trạng thái và tag nhất quán hơn.',
    ngayDang: '20/04/2026',
    luotXem: 145,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_2'],
    moTa: 'Một mô hình dữ liệu tốt sẽ giúp form thêm, sửa và trang chủ dùng chung logic.',
    yChinh: [
      'Tạo kiểu trạng thái `NHAP | DA_DANG`.',
      'Quy ước `slug`, `luotXem` và `danhSachTag` ngay từ đầu.',
      'Phân biệt rõ dữ liệu hiển thị và dữ liệu lưu trữ.',
    ],
    viDu: 'type TTrangThaiBaiViet = \'NHAP\' | \'DA_DANG\';',
  },
  {
    id: 'bv_03',
    tieuDe: 'Thiết kế card bài viết đẹp, đủ thông tin và dễ đọc',
    slug: 'thiet-ke-card-bai-viet-dep-du-thong-tin-va-de-doc',
    anhDaiDien: 'https://picsum.photos/seed/th07-card/1200/720',
    tomTat: 'Card bài viết nên có ảnh, tiêu đề, tóm tắt, ngày đăng, tác giả và tag để đọc nhanh.',
    ngayDang: '19/04/2026',
    luotXem: 98,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_1', 'tag_3'],
    moTa: 'Trang chủ blog tốt cần cho người đọc quét thông tin nhanh và chọn được bài phù hợp.',
    yChinh: [
      'Giới hạn số dòng cho tóm tắt để card cân đối.',
      'Hiển thị metadata ngay dưới tiêu đề.',
      'Tag nên bấm được để lọc tức thì.',
    ],
    viDu: '<Paragraph ellipsis={{ rows: 3 }}>{post.tomTat}</Paragraph>',
  },
  {
    id: 'bv_04',
    tieuDe: 'Render Markdown trong trang chi tiết bài viết',
    slug: 'render-markdown-trong-trang-chi-tiet-bai-viet',
    anhDaiDien: 'https://picsum.photos/seed/th07-markdown/1200/720',
    tomTat: 'Markdown giúp nội dung bài viết rõ cấu trúc hơn và dễ nhập từ form quản trị.',
    ngayDang: '18/04/2026',
    luotXem: 134,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_4'],
    moTa: 'Khi dùng Markdown, phần chi tiết bài viết có thể hiện heading, danh sách và block code rõ ràng.',
    yChinh: [
      'Lưu nội dung Markdown dưới dạng chuỗi.',
      'Render bằng `react-markdown` ở trang chi tiết.',
      'Giữ trình soạn thảo đơn giản nhưng đủ cho bài thực hành.',
    ],
    viDu: '<ReactMarkdown>{selectedPost.noiDung}</ReactMarkdown>',
  },
  {
    id: 'bv_05',
    tieuDe: 'Cách dùng debounce 300ms cho ô tìm kiếm bài viết',
    slug: 'cach-dung-debounce-300ms-cho-o-tim-kiem-bai-viet',
    anhDaiDien: 'https://picsum.photos/seed/th07-search/1200/720',
    tomTat: 'Debounce giúp lọc bài viết mượt hơn và tránh xử lý liên tục theo từng ký tự gõ vào.',
    ngayDang: '17/04/2026',
    luotXem: 84,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_1', 'tag_2'],
    moTa: 'Tìm kiếm theo từ khóa nên phản hồi nhanh nhưng không cập nhật state quá dày.',
    yChinh: [
      'Giữ riêng `tuKhoaInput` và `tuKhoaDebounce`.',
      'Dùng `setTimeout` 300ms trong `useEffect`.',
      'Lọc cả tiêu đề, tóm tắt, tác giả và tag để kết quả sát nhu cầu.',
    ],
    viDu: 'useEffect(() => setTimeout(() => setKeyword(value), 300), [value]);',
  },
  {
    id: 'bv_06',
    tieuDe: 'Tối ưu giao diện quản lý bài viết bằng Ant Design Table',
    slug: 'toi-uu-giao-dien-quan-ly-bai-viet-bang-ant-design-table',
    anhDaiDien: 'https://picsum.photos/seed/th07-table/1200/720',
    tomTat: 'Table phù hợp để lọc, tìm kiếm và thao tác nhanh trên danh sách bài viết trong trang quản trị.',
    ngayDang: '16/04/2026',
    luotXem: 121,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_3', 'tag_6'],
    moTa: 'Trang quản trị cần rõ dữ liệu và thao tác đủ nhanh để người viết chỉnh nội dung liên tục.',
    yChinh: [
      'Hiển thị trạng thái bằng tag màu.',
      'Tách modal thêm và sửa dùng chung một form.',
      'Xác nhận xóa bằng `Popconfirm` để tránh thao tác nhầm.',
    ],
    viDu: '<Table rowKey="id" columns={columns} dataSource={filteredPosts} />',
  },
  {
    id: 'bv_07',
    tieuDe: 'Liên kết bài viết cùng tag để giữ chân người đọc',
    slug: 'lien-ket-bai-viet-cung-tag-de-giu-chan-nguoi-doc',
    anhDaiDien: 'https://picsum.photos/seed/th07-related/1200/720',
    tomTat: 'Mục bài viết liên quan giúp điều hướng tốt hơn và tăng thời gian đọc trên blog.',
    ngayDang: '15/04/2026',
    luotXem: 77,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_1', 'tag_6'],
    moTa: 'Một blog cá nhân đơn giản vẫn nên có khối bài viết liên quan để điều hướng tự nhiên.',
    yChinh: [
      'Chọn các bài cùng tag và loại trừ bài hiện tại.',
      'Giới hạn 3 bài liên quan để giao diện gọn.',
      'Cho phép click trực tiếp từ danh sách liên quan.',
    ],
    viDu: 'post.danhSachTag.some((tag) => currentPost.danhSachTag.includes(tag))',
  },
  {
    id: 'bv_08',
    tieuDe: 'Quản lý tag hiệu quả trong blog cá nhân',
    slug: 'quan-ly-tag-hieu-qua-trong-blog-ca-nhan',
    anhDaiDien: 'https://picsum.photos/seed/th07-tags/1200/720',
    tomTat: 'Tag cần dễ thêm, dễ sửa và có cảnh báo khi đang được sử dụng bởi bài viết khác.',
    ngayDang: '14/04/2026',
    luotXem: 66,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_6'],
    moTa: 'Tag là lớp dữ liệu quan trọng để lọc bài viết và tạo mối liên hệ giữa các nội dung.',
    yChinh: [
      'Đếm số bài viết đang dùng tag ngay trong bảng.',
      'Chặn xóa tag nếu vẫn đang được dùng.',
      'Kiểm tra trùng tên khi thêm hoặc sửa tag.',
    ],
    viDu: 'const count = posts.filter((post) => post.danhSachTag.includes(tag.id)).length;',
  },
  {
    id: 'bv_09',
    tieuDe: 'Dùng UmiJS để tổ chức route cho menu TH07',
    slug: 'dung-umijs-de-to-chuc-route-cho-menu-th07',
    anhDaiDien: 'https://picsum.photos/seed/th07-umi/1200/720',
    tomTat: 'Route lồng nhau trong UmiJS giúp gom nhóm các chức năng blog vào một menu TH07 rõ ràng.',
    ngayDang: '13/04/2026',
    luotXem: 88,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_5'],
    moTa: 'Khi chia bài thực hành theo từng chủ đề, route nhóm giúp menu dễ theo dõi hơn.',
    yChinh: [
      'Khai báo menu TH07 với các trang chính theo đề bài.',
      'Thêm redirect từ `/th07` về trang chủ blog.',
      'Giữ tên route đồng bộ với `menu.ts` để hiển thị chuẩn.',
    ],
    viDu: 'path: \'/th07/trang-chu-blog\', component: \'./TH07/TrangChuBlog\'',
  },
  {
    id: 'bv_10',
    tieuDe: 'Những lỗi thường gặp khi lưu dữ liệu blog bằng localStorage',
    slug: 'nhung-loi-thuong-gap-khi-luu-du-lieu-blog-bang-localstorage',
    anhDaiDien: 'https://picsum.photos/seed/th07-storage/1200/720',
    tomTat: 'Cần đọc ghi localStorage an toàn để tránh lỗi parse JSON và mất dữ liệu mẫu ban đầu.',
    ngayDang: '12/04/2026',
    luotXem: 91,
    trangThai: 'DA_DANG',
    danhSachTag: ['tag_2', 'tag_6'],
    moTa: 'Với bài thực hành không có backend, localStorage là phương án phù hợp nhưng cần dùng cẩn thận.',
    yChinh: [
      'Bọc đọc JSON trong `try/catch`.',
      'Tự seed dữ liệu mẫu nếu storage đang rỗng.',
      'Đóng gói helper dùng chung thay vì lặp mã ở từng trang.',
    ],
    viDu: 'const raw = window.localStorage.getItem(STORAGE_KEYS.baiViet);',
  },
  {
    id: 'bv_11',
    tieuDe: 'Bản nháp: checklist trước khi xuất bản một bài viết',
    slug: 'ban-nhap-checklist-truoc-khi-xuat-ban-mot-bai-viet',
    anhDaiDien: 'https://picsum.photos/seed/th07-draft-1/1200/720',
    tomTat: 'Một checklist ngắn để rà soát slug, tóm tắt, ảnh đại diện và tag trước khi đăng bài.',
    ngayDang: '11/04/2026',
    luotXem: 14,
    trangThai: 'NHAP',
    danhSachTag: ['tag_6'],
    moTa: 'Bản nháp phục vụ trang quản trị và sẽ không hiển thị ở trang chủ blog.',
    yChinh: [
      'Kiểm tra chính tả tiêu đề.',
      'Đảm bảo slug không trùng.',
      'Bổ sung tag để bài viết được lọc đúng.',
    ],
    viDu: 'if (values.trangThai === \'DA_DANG\') { /* publish */ }',
  },
  {
    id: 'bv_12',
    tieuDe: 'Bản nháp: cải thiện trải nghiệm đọc trên thiết bị di động',
    slug: 'ban-nhap-cai-thien-trai-nghiem-doc-tren-thiet-bi-di-dong',
    anhDaiDien: 'https://picsum.photos/seed/th07-draft-2/1200/720',
    tomTat: 'Ghi chú cho phần responsive: khoảng cách, cột, typography và block code trên màn hình nhỏ.',
    ngayDang: '10/04/2026',
    luotXem: 8,
    trangThai: 'NHAP',
    danhSachTag: ['tag_1', 'tag_4'],
    moTa: 'Bài nháp dùng để kiểm tra lọc trạng thái ở màn hình quản lý bài viết.',
    yChinh: [
      'Giảm số cột card trên mobile.',
      'Giữ khoảng cách đủ thoáng giữa các khối.',
      'Bọc code block tránh tràn ngang.',
    ],
    viDu: '@media (max-width: 768px) { .cardGrid { grid-template-columns: 1fr; } }',
  },
];

export const MOCK_BAI_VIET: IBaiViet[] = DU_LIEU_BAI_VIET_MAU.map((item) => ({
  id: item.id,
  tieuDe: item.tieuDe,
  slug: item.slug,
  anhDaiDien: item.anhDaiDien,
  tomTat: item.tomTat,
  noiDung: taoNoiDungMarkdown(item.moTa, item.yChinh, item.viDu),
  ngayDang: item.ngayDang,
  tacGia: THONG_TIN_TAC_GIA.ten,
  luotXem: item.luotXem,
  trangThai: item.trangThai,
  danhSachTag: item.danhSachTag,
}));

export const chuanHoaSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const layThoiGianTuNgayDang = (value: string): number => {
  const [day, month, year] = value.split('/').map(Number);

  if (!day || !month || !year) {
    return 0;
  }

  return new Date(year, month - 1, day).getTime();
};
