import ListItemOrders from '../../components/ListItem/Orders';
import './styles.css';

import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import Modal from '../../components/Modal';
import useModalStore from '../../stores/modalStore';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from '../../components/Pagination';

export default function Orders() {
	const { openModal, closeModal } = useModalStore((state) => state);
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
				registerDay: Date;
				state: string;
			};
			ordersKits: {
				kit_id: number;
				quantity: string;
				kit: { description: string };
			}[];
		}>
	>([]);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [date, setDate] = useState<{ start: Date; end: Date }>({
		start: new Date(),
		end: new Date(),
	});
	const [totalOrders, setTotalOrders] = useState(0);
	const [activeOrders, setActiveOrders] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	const [openReportsDropdown, setOpenReportsDropdown] = useState(false);
	const route = useNavigate();
	const totalPages =
		(totalOrders / 10) % 1 > 0.5
			? Math.ceil(totalOrders / 10)
			: Math.floor(totalOrders / 10);

	useEffect(() => {
		const newDate = format(date.start, 'yyyy-MM-dd');
		console.log(newDate);
	}, [date]);

	const getOrders = async (page = 0) => {
		setCurrentPage(page);
		const response = await api.get('orders', { params: { page } });
		setOrders(response.data.orders);
		console.log(response.data.count);
		setTotalOrders(response.data.count.total);
		setActiveOrders(response.data.count.actives);
	};

	const toReportPage = () => {
		route(
			`report?start=${format(date.start, 'yyyy-MM-dd', {
				locale: ptBR,
			})}&end=${format(date.end, 'yyyy-MM-dd', { locale: ptBR })}`
		);
	};

	const toReportMaterialPage = () => {
		route(
			`report-materials?start=${format(date.start, 'yyyy-MM-dd', {
				locale: ptBR,
			})}&end=${format(date.end, 'yyyy-MM-dd', { locale: ptBR })}`
		);
	};
	useEffect(() => {
		getOrders();
	}, []);

	const deleteItem = async (delItem: unknown) => {
		await api.delete(`/order/${delItem}`);
		getOrders();
		closeModal();
	};

	const duplicateItem = async (itemId: unknown) => {
		await api.post(`/order/duplicate/${itemId}`);
		getOrders();
	};

	return (
		<>
			<div className="col-md-12">
				<div className="d-flex justify-content-end align-items-end gap-3 my-4">
					<div className="d-none d-md-flex d-flex flex-column ">
						<input className="form-control" placeholder="Numero da OS" />
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<select id="status" value="" className="form-control">
							<option selected value="">
								Status
							</option>
							<option selected value="0">
								Aberto
							</option>
							<option value="1">Em trabalho</option>
							<option value="2">Finalizado</option>
						</select>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<input className="form-control" placeholder="Bairro" />
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<DatePicker
							className="form-control"
							locale="pt-BR"
							dateFormat="dd/MM/yyyy"
							selected={date.start}
							onSelect={(value) =>
								setDate((prev) => ({
									...prev,
									start: value ? value : new Date(),
								}))
							}
						/>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<DatePicker
							className="form-control"
							selected={date.end}
							dateFormat="dd/MM/yyyy"
							onSelect={(value) =>
								setDate((prev) => ({
									...prev,
									end: value ? value : new Date(),
								}))
							}
						/>
					</div>

					<div className="d-none d-md-flex d-flex flex-column position-relative">
						<div className="dropdown">
							<button
								className="btn btn-secondary dropdown-toggle"
								type="button"
								onClick={() => setOpenReportsDropdown(!openReportsDropdown)}
							>
								Relatórios
							</button>
							<ul
								className={`dropdown-menu ${openReportsDropdown ? 'show' : ''}`}
							>
								<li>
									<a className="dropdown-item" onClick={toReportPage}>
										Ordens Serviço
									</a>
								</li>
								<li>
									<a className="dropdown-item" onClick={toReportMaterialPage}>
										Materiais utilizados
									</a>
								</li>
							</ul>
						</div>
					</div>
					<NavLink
						to="form"
						className="btn btn-info"
						style={{ height: 'fit-content' }}
					>
						Nova
					</NavLink>
				</div>
				<div className="card pb-0 mb-2">
					{orders.map((order) => (
						<>
							<ListItemOrders
								key={order.order.id}
								qrcode={order?.order?.qr_code}
								id={order.order?.id}
								address={order.order?.address}
								city={order.order?.city}
								neighborhood={order.order?.neighborhood}
								state={order.order?.state}
								status={order.order?.status}
								date={order.order?.registerDay}
								// kit={order.ordersKits[0].kit.description ?? ''}
								deleteListItem={() => {
									setDeleteId(order.order?.id);
									openModal();
								}}
								duplicateItem={() => duplicateItem(order.order.id)}
							/>
						</>
					))}
					<Pagination
						currentPage={currentPage}
						totalItems={activeOrders}
						totalPages={totalPages}
						toggleList={(value) => getOrders(value)}
					/>
				</div>
			</div>

			<div>
				<Modal
					cancelCopy="Cancelar"
					copy="Deseja remover o item selecionado ?"
					saveCopy="Apagar"
					toggleCancel={closeModal}
					toggleSave={() => deleteItem(deleteId)}
				/>
			</div>
		</>
	);
}
