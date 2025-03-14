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

export default function Orders() {
	const { openModal, closeModal } = useModalStore((state) => state);
	const [orders, setOrders] = useState<
		Array<{
			id: number;
			qr_code: string;
			address: string;
			city: string;
			neighborhood: string;
			state: string;
			status: number;
			registerDay: Date;
		}>
	>([]);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [date, setDate] = useState<{ start: Date; end: Date }>({
		start: new Date(),
		end: new Date(),
	});
	const [totalOrders, setTotalOrders] = useState(0);

	const [openReportsDropdown, setOpenReportsDropdown] = useState(false);
	const route = useNavigate();

	useEffect(() => {
		const newDate = format(date.start, 'yyyy-MM-dd');
		console.log(newDate);
	}, [date]);

	const getOrders = async (page?: number) => {
		const response = await api.get('orders', { params: { page } });
		setOrders(response.data.orders);
		console.log(response.data.count);
		setTotalOrders(response.data.count.total);
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
								key={order.id}
								qrcode={order.qr_code}
								id={order.id}
								address={order.address}
								city={order.city}
								neighborhood={order.neighborhood}
								state={order.state}
								status={order.status}
								date={order.registerDay}
								deleteListItem={() => {
									setDeleteId(order.id);
									openModal();
								}}
								duplicateItem={() => duplicateItem(order.id)}
							/>
						</>
					))}
					<div className="row mx-3 justify-content-between my-3">
						<div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
							<div
								className="dt-info"
								aria-live="polite"
								id="DataTables_Table_0_info"
								role="status"
							>
								Mostrando {1} de {Math.ceil(totalOrders / 10)} de {totalOrders}{' '}
								registros
							</div>
						</div>
						<div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
							<div className="dt-paging">
								<nav aria-label="pagination">
									<ul className="pagination">
										{[...Array(Math.ceil(totalOrders / 10))].map(
											(_page, index) => (
												<li className="dt-paging-button page-item active">
													<button
														className="page-link"
														role="link"
														type="button"
														aria-controls="DataTables_Table_0"
														aria-current="page"
														data-dt-idx="0"
														onClick={() => getOrders(index)}
													>
														{index}
													</button>
												</li>
											)
										)}
									</ul>
								</nav>
							</div>
						</div>
					</div>
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
