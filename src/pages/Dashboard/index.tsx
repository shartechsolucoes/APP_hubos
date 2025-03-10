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
import axios from 'axios';
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
			order: {
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
			};
			ordersKits: {
				kit_id: number;
				quantity: string;
				kit: { description: string };
			}[];
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
			`/orders/report?start=${formattedDate}&end=${formattedDate}`
		);
		setOrders(response.data);
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
	const [pins, setPins] = useState<{ geo: any; os: string }[]>([]);

	const onLoad = useCallback(
		(map) => {
			map.setZoom(12);
			setMap(map);
		},
		[pins]
	);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, [map]);

	const getGeolocation = async () => {
		const getLocationsOrders = orders.map(async (order) => {
			const address = `${order.order.address} ${order.order.neighborhood} ${order.order.city}`;

			const formatedAddress = address
				.replaceAll('  ', ' ')
				.replaceAll(' ', '%20');

			const response = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0`
			);

			return { geolocation: response.data, os: order.order.qr_code };
		});
		const geolocation = await Promise.all(getLocationsOrders);

		const formatedGeo = geolocation.map((loc) => ({
			geo: loc.geolocation.results[0].geometry.location,
			os: loc.os,
		}));

		console.log(formatedGeo);

		setPins(formatedGeo);
	};
	useEffect(() => {
		getOrders();
		getDashboardData();
	}, []);

	useEffect(() => {
		if (orders.length > 0) {
			getGeolocation();
		}
	}, [orders]);

	return (
		<>

			<div className="col-lg-3 col-sm-6">
				<div className="card card-border-shadow-primary h-100">
					<div className="card-body">
						<div className="d-flex align-items-center mb-2">
							<div className="avatar me-4">
								<span className="avatar-initial rounded bg-label-primary">
								<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg"/>
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
								<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg"/>
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
								<BsTools className="icon-base bx bxs-truck icon-lg"/>
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
								<BsPersonBadgeFill className="icon-base bx bxs-truck icon-lg"/>
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
							<button className="btn p-0" type="button" id="deliveryExceptions" data-bs-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false">
								botão
							</button>
							<div className="dropdown-menu dropdown-menu-end" aria-labelledby="deliveryExceptions">
								<a className="dropdown-item" href="javascript:void(0);">Select All</a>
								<a className="dropdown-item" href="javascript:void(0);">Refresh</a>
								<a className="dropdown-item" href="javascript:void(0);">Share</a>
							</div>
						</div>
					</div>
					<div className="card-body">
						{isLoaded && (
							<GoogleMap
								mapContainerStyle={containerStyle}
								center={center}
								onLoad={onLoad}
								onUnmount={onUnmount}
								options={{ gestureHandling: 'greedy' }}
							>
								{pins.map((pin, index) => (
									<Marker
										position={pin.geo}
										label={{ text: `${pin.os}`, className: 'pin-label' }}
										animation={google.maps.Animation.DROP}
									></Marker>
								))}
							</GoogleMap>
						)}
					</div>
				</div>
			</div>
			<div className="col-xxl-12 col-lg-6 mt-4">
			<div className="card mb-6">
				<div className="mb-4">
					<div id="DataTables_Table_0_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
						<div className="row card-header border-bottom mx-0 px-3 py-2">
							<div
								className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
								<h5 className="card-title mb-0 text-nowrap text-md-start text-center">Course you are
									taking</h5></div>
							<div
								className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
								<div className="dt-search"><input type="search" className="form-control"
																  id="dt-search-0" placeholder="Search Course"
																  aria-controls="DataTables_Table_0"/><label
									htmlFor="dt-search-0"></label></div>
							</div>
						</div>


						<div className="justify-content-between dt-layout-table">
							<div
								className="d-md-flex justify-content-between align-items-center col-12 dt-layout-full col-md">
								<table
									className="table table-sm datatables-academy-course dataTable dtr-column collapsed"
									id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info"
								>
									<colgroup>
										<col data-dt-column="0" width="10%"/>
										<col data-dt-column="1" width="10%"/>
										<col data-dt-column="2" width="20%"/>
										<col data-dt-column="3" width="20%"/>
										<col data-dt-column="4" width="20%"/>
									</colgroup>
									<thead>
									<tr>
										<th data-dt-column="0" className="control dt-orderable-none">
											<span className="dt-column-title">OS</span>
										</th>
										<th data-dt-column="1" className="control dt-orderable-none">
											<span className="dt-column-title"> Hora </span>
										</th>
										<th data-dt-column="2" className="control dt-orderable-none">
											<span className="dt-column-title"> Kit </span>
										</th>
										<th data-dt-column="3" className="control dt-orderable-none">
											<span className="dt-column-title"> endereço </span>
										</th>
										<th data-dt-column="4" className="control dt-orderable-none">
											<span className="dt-column-title"> Status </span>
										</th>
										<th data-dt-column="5" className="control dt-orderable-none">
											<span className="dt-column-title"> Ações </span>
										</th>
									</tr>
									</thead>
									{orders.map((order) => (
										<>
											<ListItemOrdersDash
												key={order.order.id}
												qrcode={order.order.qr_code}
												register={order.order.registerDay}
												id={order.order.id}
												status={order.order.status}
												address={order.order.address}
												neighborhood={order.order.neighborhood}
												city={order.order.city}
											/>
										</>
									))}
									<tfoot></tfoot>
								</table>
							</div>
						</div>
						<div className="row mx-3 justify-content-between">
							<div
								className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
								<div className="dt-info" aria-live="polite" id="DataTables_Table_0_info"
									 role="status">Showing 1 to 5 of 25 entries
								</div>
							</div>
							<div
								className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
								<div className="dt-paging">
									<nav aria-label="pagination">
										<ul className="pagination">
											<li className="dt-paging-button page-item disabled">
												<button className="page-link previous" role="link" type="button"
														aria-controls="DataTables_Table_0" aria-disabled="true"
														aria-label="Previous" data-dt-idx="previous" tabIndex="-1"><i
													className="icon-base bx bx-chevron-left scaleX-n1-rtl icon-18px"></i>
												</button>
											</li>
											<li className="dt-paging-button page-item active">
											<button className="page-link" role="link" type="button"
														aria-controls="DataTables_Table_0" aria-current="page"
														data-dt-idx="0">1
												</button>
											</li>
											<li className="dt-paging-button page-item">
												<button className="page-link" role="link" type="button"
														aria-controls="DataTables_Table_0" data-dt-idx="1">2
												</button>
											</li>
											<li className="dt-paging-button page-item">
												<button className="page-link" role="link" type="button"
														aria-controls="DataTables_Table_0" data-dt-idx="2">3
												</button>
											</li>
											<li className="dt-paging-button page-item">
												<button className="page-link" role="link" type="button"
														aria-controls="DataTables_Table_0" data-dt-idx="3">4
												</button>
											</li>
											<li className="dt-paging-button page-item">
												<button className="page-link" role="link" type="button"
														aria-controls="DataTables_Table_0" data-dt-idx="4">5
												</button>
											</li>
											<li className="dt-paging-button page-item">
												<button className="page-link next" role="link" type="button"
														aria-controls="DataTables_Table_0" aria-label="Next"
														data-dt-idx="next"><i
													className="icon-base bx bx-chevron-right scaleX-n1-rtl icon-18px"></i>
												</button>
											</li>
										</ul>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</div>

		</>
	);
}
