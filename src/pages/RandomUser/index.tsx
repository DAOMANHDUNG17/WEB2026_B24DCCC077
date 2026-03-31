import { type IColumn } from '@/components/Table/typing';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const RandomUser = () => {
	const { data, getDataUser } = useModel('randomuser');
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<RandomUser.Record | undefined>();

	useEffect(() => {
		getDataUser();
	}, []);

	const columns: IColumn<RandomUser.Record>[] = [
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			width: 240,
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'balance',
			width: 180,
		},
		{
			title: 'Sửa/xóa',
			key: 'actions',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Sửa
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: RandomUser.Record[] = JSON.parse(localStorage.getItem('data') || '[]');
								const newData = dataLocal.filter((item) => item.address !== record.address);
								localStorage.setItem('data', JSON.stringify(newData));
								getDataUser();
							}}
							type='primary'
						>
							Xóa
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
					setRow(undefined);
				}}
			>
				Add User
			</Button>
			<Table rowKey='address' dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Edit User' : 'Add User'}
				visible={visible}
				onOk={() => {}}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const index = data.findIndex((item: RandomUser.Record) => item.address === row?.address);
						const dataTemp: RandomUser.Record[] = [...data];
						if (isEdit && index >= 0) {
							dataTemp.splice(index, 1, values);
						}
						const dataLocal = isEdit && index >= 0 ? dataTemp : [values, ...data];
						localStorage.setItem('data', JSON.stringify(dataLocal));
						setVisible(false);
						getDataUser();
					}}
				>
					<Form.Item
						initialValue={row?.address}
						label='address'
						name='address'
						rules={[{ required: true, message: 'Please input your address!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.balance}
						label='balance'
						name='balance'
						rules={[{ required: true, message: 'Please input your balance!' }]}
					>
						<Input />
					</Form.Item>
					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default RandomUser;
