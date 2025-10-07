import {
	BsClipboardDataFill,
	BsPersonBadgeFill,
	BsTools,
} from 'react-icons/bs';
import './styles.css';
import ListItemOrdersDash from '../../components/ListItem/OrdersDash/indexMaps.tsx';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { api } from '../../api';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Link } from 'react-router';
import useAccessLevelStore from '../../stores/accessLevelStore.ts';
// import {Util} from "leaflet";
import indexOf = Util.indexOf;

const containerStyle = {
	width: '100%',
	height: '800px',

};

const center = {
	lat: -25.315827,
	lng: -49.287565,
};

// Estilo do mapa (exemplo dark)
const darkTheme = [
	{
		elementType: "geometry",
		stylers: [{ color: "#f5f5f5" }],
	},
	{
		elementType: "labels.icon",
		stylers: [{ visibility: "off" }],
	},
	{
		elementType: "labels.text.fill",
		stylers: [{ color: "#616161" }],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [{ color: "#f5f5f5" }],
	},
	{
		featureType: "administrative.land_parcel",
		elementType: "labels.text.fill",
		stylers: [{ color: "#bdbdbd" }],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [{ color: "#eeeeee" }],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [{ color: "#757575" }],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [{ color: "#e5e5e5" }],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [{ color: "#ffffff" }],
	},
	{
		featureType: "road.arterial",
		elementType: "labels.text.fill",
		stylers: [{ color: "#757575" }],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [{ color: "#dadada" }],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [{ color: "#616161" }],
	},
	{
		featureType: "road.local",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
	{
		featureType: "transit.line",
		elementType: "geometry",
		stylers: [{ color: "#e5e5e5" }],
	},
	{
		featureType: "transit.station",
		elementType: "geometry",
		stylers: [{ color: "#eeeeee" }],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [{ color: "#c9c9c9" }],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9e9e9e" }],
	},
];

type Order = {
	id: number;
	qr_code: string;
	lat: string;
	long: string;
	address: string;
	neighborhood: string;
	city: string;
	state: string;
	status: number;
	user: { name: string; picture: string };
	registerDay: string;
	ordersKits?: string;
};

type ListItemOrdersDashProps = {
	order: Order;
	onClick: () => void;
	active: boolean;
};

export default function Dashboard() {
	const { accessLevel, userId } = useAccessLevelStore();
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
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
		const baseUrl = `/orders?dateStart=${selectedDate}&dateEnd=${selectedDate}`;
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

	const [map, setMap] = useState<any>(null);

	const onLoad = useCallback((map: any) => {
		map.setZoom(13);
		setMap(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, []);

	useEffect(() => {
		if (user.length > 0) {
			getOrders();
			getDashboardData();
		}
	}, [user, selectedDate]);

	useEffect(() => {
		setUser(userId);
	}, [userId]);
	const visibleOrders = selectedOrder ? [selectedOrder] : orders;
	return (
		<>
			<div className="col-xxl-12 col-lg-12 mt-4">
				<div className="card card-maps">
					<div className="row">
						<div className="col-8">
							{isLoaded && (
								<div className="maps">
									<GoogleMap
										mapContainerStyle={containerStyle}
										center={
											selectedOrder
												? { lat: parseFloat(selectedOrder.lat), lng: parseFloat(selectedOrder.long) }
												: center
										}
										onLoad={onLoad}
										onUnmount={onUnmount}
										options={{
											gestureHandling: "greedy",
											disableDefaultUI: true,
											styles: darkTheme,
										}}
									>
										{visibleOrders.map((order, index) => (
											<Marker
												key={index}
												position={{
													lat: parseFloat(order.lat),
													lng: parseFloat(order.long),
												}}
												label={{
													text: `OS:${order.qr_code}`,
													className: "pin-label",
												}}
												onClick={() => setSelectedOrder(order)}
											/>
										))}

										{selectedOrder && (
											<InfoWindow
												position={{
													lat: parseFloat(selectedOrder.lat),
													lng: parseFloat(selectedOrder.long),
												}}
												onCloseClick={() => setSelectedOrder(null)}
											>
												<div style={{ maxWidth: "220px" }}>
													<h6>OS: {selectedOrder.qr_code}</h6>
													<p><b>Endereço:</b> {selectedOrder.address}, {selectedOrder.neighborhood}</p>
													<p><b>Cidade:</b> {selectedOrder.city} - {selectedOrder.state}</p>
													<p><b>Status:</b> {selectedOrder.status === 1 ? "Ativo" : "Inativo"}</p>
													<p><b>Usuário:</b> {selectedOrder.user.name}</p>
												</div>
											</InfoWindow>
										)}
									</GoogleMap>
								</div>
							)}
							{(accessLevel === 99 || accessLevel === 0) && (
								<div className="date">
									<input
										type="date"
										className="form-control"
										value={selectedDate}
										onChange={(e) => setSelectedDate(e.target.value)}
									/>
								</div>
							)}
						</div>

						<div className="col-4">
							<div className="card-body orders">
								{orders.map((order) => (
									<ListItemOrdersDash
										key={order.id}
										userPicture={order.user.picture}
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
										onClick={() => setSelectedOrder(order)}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}