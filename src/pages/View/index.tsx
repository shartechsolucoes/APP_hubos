import { useLocation } from 'react-router';
import OrdersView from '../../components/Views/Orders';

export default function View() {
	const { pathname } = useLocation();

	const returnView = () => {
		switch (pathname) {
			case '/orders/view':
				return <OrdersView />;
			default:
				break;
		}
	};

	return <div>{returnView()}</div>;
}
