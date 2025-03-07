import { MdOutlineSearch } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';
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

	const [openReportsDropdown, setOpenReportsDropdown] = useState(false);
	const route = useNavigate();

	useEffect(() => {
		const newDate = format(date.start, 'yyyy-MM-dd');
		console.log(newDate);
	}, [date]);
	const getOrders = async () => {
		const response = await api.get('orders');
		setOrders(response.data.orders);
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
			<div>
				<div className=" pb-0 mb-2">
						<div className="d-flex justify-content-end align-items-end gap-3">
							<div className="d-flex flex-column ">
								<input className="form-control" placeholder="Numero da OS" />
							</div>
							<div className="d-flex flex-column ">
								<input className="form-control" placeholder="Bairro" />
							</div>
							<div className=" d-flex flex-column ">
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
							<div className="d-flex flex-column ">
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
							<a
								onClick={toReportPage}
								className="btn"
								style={{ height: 'fit-content' }}
							>
								<MdOutlineSearch /> Pesquisar
							</a>
							<div className="d-flex flex-column position-relative">
								<div className="dropdown">
									<button
										className="btn btn-secondary dropdown-toggle"
										type="button"
										onClick={() => setOpenReportsDropdown(!openReportsDropdown)}
									>
										Tipo de Relatório
									</button>
									<ul
										className={`dropdown-menu ${
											openReportsDropdown ? 'show' : ''
										}`}
									>
										<li>
											<a className="dropdown-item" onClick={toReportPage}>
												Ordens
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												onClick={toReportMaterialPage}
											>
												Materiais utilizados
											</a>
										</li>
									</ul>
								</div>
							</div>
							<NavLink
								to="form"
								className="btn-blue"
								style={{ height: 'fit-content' }}
							>
								<MdAdd />
							</NavLink>
						</div>
				</div>
				<div className="card pb-0 mb-5">
					<table className="w-100">
						<thead>
							<tr>
								<th className="text-start">Numero OS</th>
								<th>Data</th>
								<th>Hora</th>
								<th className="text-start">Usuário</th>
								<th className="text-start">Endereço</th>
								<th className="text-start">Bairro</th>
								<th className="text-start">Cidade/UF</th>
								<th>Status</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
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
									<hr />
								</>
							))}
						</tbody>
					</table>
					<div className="card-footer">
						<div className="d-flex justify-content-between align-items-center gap-3">
							<div className="d-flex ">
								<p className="">Mostrando 1 a 7 de 15 registros</p>
							</div>
							<div className="pagination">
								<ul className="">
									<li className="active">1</li>
									<li>2</li>
									<li>3</li>
									<li>4</li>
								</ul>
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
