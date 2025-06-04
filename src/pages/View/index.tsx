import { useLocation } from 'react-router';
import OrdersView from '../../components/Views/Orders';
import ProtocolView from '../../components/Views/Protocol';

export default function View() {
	const { pathname } = useLocation();

	const returnView = () => {
		switch (pathname) {
			case '/orders/view':
				return <OrdersView />;
			case '/protocol/view':
				return <ProtocolView />;
			default:
				break;
		}
	};

	return <div>{returnView()}</div>;
}
