import {
	BsClipboardDataFill,
	BsPersonBadgeFill,
	BsTools,
} from 'react-icons/bs';
import ListItemOrdersDash from '../../components/ListItem/OrdersDash';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { api } from '../../api';

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

	useEffect(() => {
		getOrders();
		getDashboardData();
	}, []);

	return (
		<div>
			<div className="row pt-0">
				<div className="col-12 col-md-3 ">
					<div className="card">
						<div className="card-body">
							<div className="float-start">
								<p className="card-title">Ordens de Serviço</p>
								<h3 className="fw-bold">
									{totalItems.dayOrder}
									<span className="card-text"> Hoje</span>
								</h3>
							</div>
							<div className="icons">
								<BsClipboardDataFill />
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-3 d-none d-md-block">
					<div className="card">
						<div className="card-body">
							<div className="float-start">
								<p className="card-title">Ordens de Serviço</p>
								<h3 className="fw-bold">
									{totalItems.order}
									<span className="card-text"> Total</span>
								</h3>
							</div>
							<div className="icons">
								<BsClipboardDataFill />
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-3  d-none d-md-block">
					<div className="card">
						<div className="card-body">
							<div className="float-start">
								<p className="card-title">Kits Cadastrados</p>
								<h3 className="fw-bold">
									{totalItems.kit}
									<span className="card-text"> Total</span>
								</h3>
							</div>
							<div className="icons">
								<BsTools />
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-3 d-none d-md-block">
					<div className="card">
						<div className="card-body">
							<div className="float-start">
								<p className="card-title">Usuários</p>
								<h3 className="fw-bold">
									{totalItems.user}
									<span className="card-text"> Total</span>
								</h3>
							</div>
							<div className="icons">
								<BsPersonBadgeFill />
							</div>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-8 mt-4 d-none d-md-block">
					<div className="card">
						<div className="card-body">
							<p className="card-title">Atendimentos realizado hoje</p>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-4 mt-4  d-none d-md-block">
					<div className="card">
						<div className="card-body bg-info">
							<p className="card-title mb-5">Aviso Importante</p>
							<h4 className="fw-bold">Sistema em desenvolvimento</h4>
							<h4 className="fw-bold mb-5">Aguarde lançamento</h4>

							<a className="mt-5 text-white" href="/version">
								Saiba Mais
							</a>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-12 mt-4">
					<div className="card list-height overflow-y-auto pb-0 mb-5">
						<div className="card-header pb-0">
							<p className="card-title">OS do dia</p>
						</div>

							<table className="w-100">
								<thead>
									<tr>
										<th className="text-start">Numero OS</th>
										<th className="text-center">Hora</th>
										<th className="text-start">Endereço</th>
										<th className="text-start">Bairro</th>
										<th className="text-start">Cidade</th>
										<th className="text-start">Status</th>
										<th>Ver</th>
									</tr>
								</thead>
								<tbody>
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
											<hr />
										</>
									))}
								</tbody>
							</table>
					</div>
				</div>
			</div>
		</div>
	);
}
