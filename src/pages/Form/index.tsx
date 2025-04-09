import { useLocation } from 'react-router';
import KitsForm from '../../components/Forms/Kits';
import MaterialsForm from '../../components/Forms/Materials';
import UserForm from '../../components/Forms/User';
import OrdersForm from '../../components/Forms/Orders';
import OrdersFormV2 from '../../components/Forms/OrderV2';

export default function Form() {
	const { pathname } = useLocation();

	const returnForm = () => {
		switch (pathname) {
			case '/materials/form':
				return <MaterialsForm />;
			case '/kits/form':
				return <KitsForm />;
			case '/users/form':
				return <UserForm />;
			case '/orders/form':
				return <OrdersForm />;
			case '/orders/form-v2':
				return <OrdersFormV2 />;
			default:
				break;
		}
	};

	return <div>{returnForm()}</div>;
}
