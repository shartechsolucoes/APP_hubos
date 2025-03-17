import {
	BsClipboardDataFill,
	BsPersonBadgeFill,
	BsTools,
} from 'react-icons/bs';
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
			state: number;
			ordersKits: {
				kit_id: number;
				quantity: string;
				kit: { description: string };
			}[];
			user: { name: string };
		}>
	>([]);

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
		const response = await api.get(
			`/orders?start=${formattedDate}&end=${formattedDate}`
		);
		setOrders(response.data.orders);
		setTotalItems((prev) => ({ ...prev, dayOrder: response.data.length }));
		console.log(response.data.length);
	};

	const getDashboardData = async () => {
		const response = await api.get(`/dashboard`);
		const { order, kit, user } = response.data;
		setTotalItems((prev) => ({
			...prev,
			order: order,
			kit: kit,
			user: user,
		}));
	};

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0',
	});

	const [map, setMap] = useState(null);
	// const [pins, setPins] = useState<{ geo: any; os: string }[]>([]);

	const onLoad = useCallback((map: any) => {
		map.setZoom(12);
		setMap(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, [map]);

	// const getGeolocation = async () => {
	// 	const getLocationsOrders = orders.map(async (order) => {
	// 		const address = `${order.address} ${order.neighborhood} ${order.city}`;

	// 		const formatedAddress = address
	// 			.replaceAll('  ', ' ')
	// 			.replaceAll(' ', '%20');

	// 		const response = await axios.get(
	// 			`https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0`
	// 		);

	// 		return { geolocation: response.data, os: order.qr_code };
	// 	});
	// 	const geolocation = await Promise.all(getLocationsOrders);

	// 	const formatedGeo = geolocation.map((loc) => ({
	// 		geo: loc.geolocation.results[0].geometry.location,
	// 		os: loc.os,
	// 	}));

	// 	console.log(formatedGeo);

	// 	setPins(formatedGeo);
	// };
	useEffect(() => {
		getOrders();
		getDashboardData();
	}, []);
	//
	// useEffect(() => {
	// 	if (orders.length > 0) {
	// 		getGeolocation();
	// 	}
	// }, [orders]);

	return (
		<>
			<div className="col-lg-3 col-sm-6">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
								</span>
							</div>
							<h4 className="mb-0">{totalItems.dayOrder}</h4>
						</div>
						<p className="mb-2">Ordem de Serviços Hoje</p>
						{/*<p className="mb-0">*/}
						{/*	<span className="text-heading fw-medium me-2">?+18.2%</span>*/}
						{/*	<span className="text-body-secondary">Maior que ontem</span>*/}
						{/*</p>*/}
					</div>
				</div>
			</div>

			<div className="col-lg-3 col-sm-6 d-none d-md-block">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
								</span>
							</div>
							<h4 className="mb-0">{totalItems.order}</h4>
						</div>
						<p className="mb-2">Ordem de Serviços - Total</p>
						{/*<p className="mb-0">*/}
						{/*	<span className="text-heading fw-medium me-2">?+18.2%</span>*/}
						{/*	<span className="text-body-secondary">Maior que ontem</span>*/}
						{/*</p>*/}
					</div>
				</div>
			</div>

			<div className="col-lg-3 col-sm-6 d-none d-md-block">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<BsTools className="icon-base bx bxs-truck icon-lg" />
								</span>
							</div>
							<h4 className="mb-0">{totalItems.kit}</h4>
						</div>
						<p className="mb-2">Kist's Cadastrados</p>
						{/*<p className="mb-0">*/}
						{/*	<span className="text-heading fw-medium me-2">?+18.2%</span>*/}
						{/*	<span className="text-body-secondary">Maior que ontem</span>*/}
						{/*</p>*/}
					</div>
				</div>
			</div>

			<div className="col-lg-3 col-sm-6 d-none d-md-block">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
									<BsPersonBadgeFill className="icon-base bx bxs-truck icon-lg" />
								</span>
							</div>
							<h4 className="mb-0">{totalItems.user}</h4>
						</div>
						<p className="mb-2">Usuários Ativos</p>
						{/*<p className="mb-0">*/}
						{/*	<span className="text-heading fw-medium me-2">?+18.2%</span>*/}
						{/*	<span className="text-body-secondary">Maior que ontem</span>*/}
						{/*</p>*/}
					</div>
				</div>
			</div>

			<div className="col-xxl-12 col-lg-6 mt-4">
				<div className="card h-100">
					<div className="card-header d-flex align-items-center justify-content-between">
						<div className="card-title mb-0">
							<h5 className="m-0 me-2">Maps</h5>
						</div>
						<div className="dropdown">
							<button
								className="btn p-0"
								type="button"
								id="deliveryExceptions"
								data-bs-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								botão
							</button>
							<div
								className="dropdown-menu dropdown-menu-end"
								aria-labelledby="deliveryExceptions"
							>
								<a className="dropdown-item" href="javascript:void(0);">
									Select All
								</a>
								<a className="dropdown-item" href="javascript:void(0);">
									Refresh
								</a>
								<a className="dropdown-item" href="javascript:void(0);">
									Share
								</a>
							</div>
						</div>
					</div>

					{isLoaded && (
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={center}
							onLoad={onLoad}
							onUnmount={onUnmount}
							options={{ gestureHandling: 'greedy' }}
						>
							{orders.map((order, index) => (
								<Marker
									key={index}
									position={{
										lat: parseFloat(order.lat),
										lng: parseFloat(order.long),
									}}
									label={{
										text: `${order.qr_code}`,
										className: 'pin-label',
									}}
									animation={google.maps.Animation.DROP}
								></Marker>
							))}
						</GoogleMap>
					)}
				</div>
			</div>
			<div className="col-xxl-12 col-lg-6 mt-4">
				<div className="card mb-6">
					{orders.map((order) => (
						<>
							<ListItemOrdersDash
								key={order.id}
								qrcode={order.qr_code}
								register={order.registerDay}
								id={order.id}
								status={order.status}
								address={order.address}
								neighborhood={order.neighborhood}
								city={order.city}
								kit={order?.ordersKits[0]?.kit?.description || ''}
								userName={order.user.name}
							/>
						</>
					))}
				</div>
			</div>
		</>
	);
}
