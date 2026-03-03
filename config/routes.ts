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

