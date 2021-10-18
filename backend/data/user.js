import bcryptjs from 'bcryptjs';

const users = [
	{
		name: 'Admin User',
		email: 'admin@exmaple.com',
		password: bcryptjs.hashSync('123456', 10),
		isAdmin: true,
	},
	{
		name: 'John Doe',
		email: 'joe@exmaple.com',
		password: bcryptjs.hashSync('123456', 10),
	},
	{
		name: 'Soufian',
		email: 'soufian@exmaple.com',
		password: bcryptjs.hashSync('123456', 10),
	},
];

export default users;
