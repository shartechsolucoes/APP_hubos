import {
	BsClipboardDataFill,
	BsPersonBadgeFill,
	BsTools,
} from 'react-icons/bs';
import './styles.css';
import ListItemOrdersDash from '../../components/ListItem/OrdersDash';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { api } from '../../api';
import {
	GoogleMap,
	Marker,
	// MarkerF,
	useJsApiLoader,
} from '@react-google-maps/api';
import { Link } from 'react-router';
import useAccessLevelStore from '../../stores/accessLevelStore.ts';
// import axios from 'axios';
// import './styles.css';

const containerStyle = {
	width: '100%',
	height: '400px',
};

const center = {
	lat: -25.315827,
	lng: -49.287565,
};

export default function Dashboard() {
	const { accessLevel, userId } = useAccessLevelStore();
	const [orders, setOrders] = useState<
		Array<{
			status: number;
			active: boolean;
			address: string;
			city: string;
			id: number;
			lat: string;
			long: string;
			neighborhood: string;
			observations: string;
			qr_code: string;
			registerDay: string;
			state: string;
			ordersKits: string;
			user: { name: string; picture: string };
		}>
	>([]);
	const [user, setUser] = useState('');

	const [totalItems, setTotalItems] = useState<{
		dayOrder: number;
		order: number;
		user: number;
		kit: number;
	}>({
		dayOrder: 0,
		order: 0,
		user: 0,
		kit: 0,
	});

	const getOrders = async () => {
		const today = new Date();
		const formattedDate = format(today, 'yyyy-MM-dd');

		const baseUrl = `/orders?dateStart=${formattedDate}&dateEnd=${formattedDate}`;
		const url = accessLevel > 0 ? `${baseUrl}&userId=${userId}` : baseUrl;

		const response = await api.get(url);

		setOrders(response.data.orders);
		setTotalItems((prev) => ({
			...prev,
			order: response.data.count.actives,
			dayOrder: response.data.count.total,
		}));
	};

	const getDashboardData = async () => {
		const response = await api.get(`/dashboard?userId=${userId}`);
		const { kit, user } = response.data;
		setTotalItems((prev) => ({
			...prev,

			kit: kit,
			user: user,
		}));
	};

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0',
	});

	const [map, setMap] = useState(null);

	const onLoad = useCallback((map: any) => {
		map.setZoom(13);
		setMap(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, [map]);

	useEffect(() => {
		if (user.length > 0) {
			getOrders();
			getDashboardData();
		}
	}, [user]);

	useEffect(() => {
		setUser(userId);
	}, [userId]);

	return (
		<>
			<div className="d-block d-sm-none col-sm-6">
				<Link to={`orders/form`} className="btn btn-info w-100 mb-3">
					Criar nova OS
				</Link>
			</div>
			<div className="col-lg-3 col-md-3 col-sm-12">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
							</div>
							<h4 className="mb-0">{totalItems.dayOrder}</h4>
						</div>
						<p className="mb-2">Ordem de Serviços Hoje</p>
					</div>
				</div>
			</div>

			<div className="col-lg-3 col-md-3 col-sm-6 d-none d-md-block">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
							</div>
							<h4 className="mb-0">{totalItems.order}</h4>
						</div>
						<p className="mb-2">Ordem de Serviços - Total</p>
					</div>
				</div>
			</div>
			{(accessLevel === 2 || accessLevel === 0) && (
				<>
					<div className="col-lg-3 col-md-3 col-sm-6 d-none d-md-block">
						<div className="card card-border-shadow-primary h-100">
							<div className="card-body">
								<div className="d-flex align-items-center mb-2">
									<div className="avatar me-4">
										<span className="avatar-initial rounded bg-label-primary">
											<Link to={`kits`}>
												<BsTools className="icon-base bx bxs-truck icon-lg" />
											</Link>
										</span>
									</div>
									<h4 className="mb-0">{totalItems.kit}</h4>
								</div>
								<p className="mb-2">Kist's Cadastrados</p>
							</div>
						</div>
					</div>

					<div className="col-lg-3 col-md-3 col-sm-6 d-none d-md-block">
						<div className="card card-border-shadow-primary h-100">
							<div className="card-body">
								<div className="d-flex align-items-center mb-2">
									<div className="avatar me-4">
										<span className="avatar-initial rounded bg-label-primary">
											<Link to={`users`}>
												<BsPersonBadgeFill className="icon-base bx bxs-truck icon-lg" />
											</Link>
										</span>
									</div>
									<h4 className="mb-0">{totalItems.user}</h4>
								</div>
								<p className="mb-2">Usuários Ativos</p>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="col-xxl-12 col-lg-12 mt-4">
				<div className="card h-100">
					<div className="card-header d-flex align-items-center justify-content-between">
						<div className="card-title mb-0">
							<h5 className="m-0 me-2">Maps</h5>
						</div>
					</div>

					{isLoaded && (
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={center}
							onLoad={onLoad}
							onUnmount={onUnmount}
							options={{ gestureHandling: 'greedy', disableDefaultUI: true }}
						>
							{orders.map((order, index) => (
								<Marker
									key={index}
									position={{
										lat: parseFloat(order.lat),
										lng: parseFloat(order.long),
									}}
									label={{
										text: `OS:${order.qr_code}`,
										className: 'pin-label',
									}}
								></Marker>
							))}
						</GoogleMap>
					)}
				</div>
			</div>
			<div className="col-xxl-12 col-lg-12 mt-4">
				<div className="card mb-6">
					{orders.map((order) => (
						<>
							<ListItemOrdersDash
								userPicture={order.user.picture}
								key={order.id}
								qrcode={order.qr_code}
								register={order.registerDay}
								id={order.id}
								status={order.status}
								address={order.address}
								neighborhood={order.neighborhood}
								city={order.city}
								state={order.state}
								kit={order?.ordersKits || ''}
								userName={order.user.name}
							/>
						</>
					))}
				</div>
			</div>
		</>
	);
}
