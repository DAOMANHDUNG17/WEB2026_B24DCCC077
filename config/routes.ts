export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		name: 'BT01',
		path: '/bt01',
		icon: 'ShopOutlined',
		routes: [
			{
				name: 'QuanLySanPham',
				path: 'quan-ly-san-pham',
				component: './BT01/QuanLySanPham',
			},
		],
	},
	{
		name: 'BT02',
		path: '/bt02',
		icon: 'ProfileOutlined',
		routes: [
			{
				name: 'QuanLyCongViec',
				path: 'quan-ly-cong-viec',
				component: './BT02/QuanLyCongViec',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

		{
		name: 'BaiTap',
		path: '/bai-tap',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'Bai1',
				path: 'doan-so',
				component: './BaiTap/DoanSo',
			},
			{
				name: 'Bai2',
				path: 'quan-ly-hoc-tap',
				component: './BaiTap/Bai2',
			},
		],
	},
	{
		name: 'TH02',
		path: '/th02',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'OanTuTi',
				path: 'oan-tu-ti',
				component: './TH02/OanTuTi',
			},
			{
				name: 'QuanLyCauHoi',
				path: 'quan-ly-cau-hoi',
				component: './TH02/QuanLyCauHoi',
			},
		],
	},
	{
    path: '/th03',
    name: 'TH03',
    icon: 'crown', 
    routes: [
      {
        path: '/th03/nhan-vien',
        name: 'Quản lý Nhân viên',
        component: './TH03/QuanLyNhanVien',
      },
	  {
        path: '/th03/lich-hen',
        name: 'Quản lý Lịch hẹn', 
        component: './TH03/QuanLyLichHen',
      },
	  {
        path: '/th03/danh-gia',
        name: 'Đánh giá Dịch vụ', 
        component: './TH03/QuanLyDanhGia',
      },
	  {
        path: '/th03/thong-ke',
        name: 'Báo cáo & Thống kê', 
        component: './TH03/ThongKeBaoCao',
      },
    ],
  },
  {
    path: '/th04',
    name: 'TH04',
    icon: 'SafetyCertificateOutlined',
    routes: [
      {
        path: '/th04/so-van-bang',
        name: '1. Sổ văn bằng',
        component: './TH04/SoVanBang',
      },
      {
        path: '/th04/quyet-dinh',
        name: '2. Quyết định tốt nghiệp',
        component: './TH04/QuyetDinh',
      },
      {
        path: '/th04/cau-hinh',
        name: '3. Cấu hình biểu mẫu',
        component: './TH04/CauHinh',
      },
      {
        path: '/th04/van-bang',
        name: '4. Thông tin văn bằng',
        component: './TH04/VanBang',
      },
      {
        path: '/th04/tra-cuu',
        name: '5. Tra cứu văn bằng',
        component: './TH04/TraCuu',
      },
    ],
  },
	{
		path: '/th05',
		name: 'TH05',
		icon: 'TeamOutlined',
		component: './TH05',
	},
	{
		name: 'TH06',
		path: '/th06',
		icon: 'SendOutlined',
		routes: [
			{
				path: '/th06',
				redirect: '/th06/kham-pha',
			},
			{
				name: 'Khám phá',
				path: '/th06/kham-pha',
				component: './TH06',
			},
			{
				name: 'Lịch Trình',
				path: '/th06/lich-trinh',
				component: './TH06',
			},
			{
				name: 'Ngân Sách',
				path: '/th06/ngan-sach',
				component: './TH06',
			},
			{
				name: 'Admin ',
				path: '/th06/admin',
				component: './TH06',
			},
		],
	},
	// config/routes.ts
{
  path: '/ktgk',
  name: 'KTGK',
  icon: 'ReadOutlined',
  // access: 'canAdmin', <-- Hãy thử comment dòng này lại hoặc xóa đi để kiểm tra
  routes: [
    {
      path: '/ktgk/quan-ly-khoa-hoc',
      name: 'Quản Lý Khóa Học',
      component: './KTGK/QuanLyKhoaHoc',
    },
  ],
},

		

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
