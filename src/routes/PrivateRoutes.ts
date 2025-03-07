import Dashboard from '../pages/Dashboard';
import Form from '../pages/Form';
import Kits from '../pages/Kits';
import Materials from '../pages/Materials';
import Orders from '../pages/Orders';
import Report from '../pages/Reports';
import ReportMaterial from '../pages/ReportsMaterial';
import Tags from '../pages/Tags';
import Users from '../pages/Users';
import Version from '../pages/Version';
import View from '../pages/View';

export const privateRoutes = [
	{
		name: 'Dashboard',
		path: '/',
		icon: 'dashboard',
		component: Dashboard,
		access: [0, 1, 2],
	},
	{
		name: 'Ordem de Serviço',
		path: '/orders',
		icon: 'order',
		component: Orders,
		access: [0, 1, 2],
		children: [
			{
				name: 'Nova Ordem de Serviço',
				path: '/orders/form',
				component: Form,
				access: [0, 1, 2],
			},
			{
				name: 'Visualizar Ordem de Serviço',
				path: '/orders/view',
				component: View,
				access: [0, 1, 2],
			},
			{
				name: 'Relatório Ordens de Serviço do dia',
				path: '/orders/report',
				component: Report,
				access: [0, 1],
			},
			{
				name: 'Relatório Materiais Utilizados',
				path: '/orders/report-materials',
				component: ReportMaterial,
				access: [0, 1],
			},
		],
	},
	{
		name: 'Kits',
		path: '/kits',
		icon: 'kits',
		access: [0],
		component: Kits,
		children: [
			{
				name: 'Novo Kit',
				path: '/kits/form',
				component: Form,
				access: [0],
			},
		],
	},
	{
		name: 'Materiais',
		path: '/materials',
		icon: 'materials',
		component: Materials,
		access: [0],
		children: [
			{
				name: 'Novo Material',
				path: '/materials/form',
				component: Form,
				access: [0],
			},
		],
	},
	{
		name: 'Etiquetas',
		path: '/tags',
		icon: 'tag',
		component: Tags,
		access: [0],
		children: [
			{
				name: 'Novo QR code',
				path: '/tags/form',
				component: Form,
				access: [0, 1, 2],
			},
		],
	},
	{
		name: 'Usuário',
		path: '/users',
		icon: 'users',
		component: Users,
		access: [0, 1],
		children: [
			{
				name: 'Novo usuário',
				path: '/users/form',
				component: Form,
				access: [0, 1],
			},
		],
	},
	{
		name: 'Versão',
		path: '/version',
		icon: 'version',
		component: Version,
		access: [0, 1, 2],
	},
];
