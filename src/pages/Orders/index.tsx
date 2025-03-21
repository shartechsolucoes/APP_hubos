import ListItemOrders from '../../components/ListItem/Orders';
import './styles.css';

import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import Modal from '../../components/Modal';
import useModalStore from '../../stores/modalStore';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spiner';
import useAccessLevelStore from '../../stores/accessLevelStore.ts';

export default function Orders() {
	const { accessLevel } = useAccessLevelStore();
	const { openModal, closeModal } = useModalStore((state) => state);
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
			registerDay: Date;
			state: string;
			ordersKits: {
				kit_id: number;
				quantity: string;
				kit: { description: string };
			}[];
			user: {
				name: string;
			};
		}>
	>([]);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [date, setDate] = useState<{ start: Date | null; end: Date | null }>({
		start: null,
		end: null,
	});
	const [activeOrders, setActiveOrders] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [searchOS, setSearchOS] = useState('');
	const [searchStatus, setSearchStatus] = useState('');
	const [searchNeighborhood, setSearchNeighborhood] = useState('');

	const [openReportsDropdown, setOpenReportsDropdown] = useState(false);

	const route = useNavigate();
	const totalPages =
		totalOrders < 10
			? 1
			: (totalOrders / 10) % 1 > 0.5
			? Math.ceil(totalOrders / 10)
			: Math.floor(totalOrders / 10);

	const getOrders = async (page = 0) => {
		setLoading(true);
		setCurrentPage(page);
		try {
			const response = await api.get('orders', {
				params: {
					page,
					os: searchOS,
					status: searchStatus,
					neighborhood: searchNeighborhood,
					dateStart: date.start
						? format(date.start, 'yyyy-MM-dd', {
								locale: ptBR,
						  })
						: '',
					dateEnd: date.end
						? format(date.end, 'yyyy-MM-dd', {
								locale: ptBR,
						  })
						: '',
				},
			});
			setOrders(response.data.orders);
			setActiveOrders(response.data.count.actives);
			setTotalOrders(response.data.count.total);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const toReportPage = () => {
		route(
			`report?start=${format(date.start || '', 'yyyy-MM-dd', {
				locale: ptBR,
			})}&end=${format(date.end || '', 'yyyy-MM-dd', { locale: ptBR })}`
		);
	};

	const toReportMaterialPage = () => {
		route(
			`report-materials?start=${format(date.start || '', 'yyyy-MM-dd', {
				locale: ptBR,
			})}&end=${format(date.end || '', 'yyyy-MM-dd', { locale: ptBR })}`
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
						<input
							className="form-control"
							placeholder="Numero da OS"
							value={searchOS}
							onChange={(e) => setSearchOS(e.target.value)}
						/>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<select
							id="status"
							value={searchStatus}
							className="form-control"
							onChange={(e) => setSearchStatus(e.target.value)}
						>
							<option selected disabled value="">
								Status
							</option>
							<option value="0">Aberto</option>
							<option value="1">Em trabalho</option>
							<option value="2">Finalizado</option>
						</select>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<input
							className="form-control"
							placeholder="Bairro"
							value={searchNeighborhood}
							onChange={(e) => setSearchNeighborhood(e.target.value)}
						/>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<DatePicker
							placeholderText="Data Inicial"
							className="form-control"
							locale="pt-BR"
							dateFormat="dd/MM/yyyy"
							selected={date.start}
							onSelect={(value) =>
								setDate((prev) => ({
									...prev,
									start: value,
								}))
							}
						/>
					</div>
					<div className="d-none d-md-flex d-flex flex-column ">
						<DatePicker
							placeholderText="Data Final"
							className="form-control"
							selected={date.end}
							dateFormat="dd/MM/yyyy"
							onSelect={(value) =>
								setDate((prev) => ({
									...prev,
									end: value,
								}))
							}
						/>
					</div>
					<a
						onClick={() => getOrders()}
						className=" d-none d-md-flex d-flex flex-column btn btn-info"
						style={{ height: 'fit-content' }}
					>
						Pesquisar
					</a>

					{accessLevel === 0 && (
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
									className={`dropdown-menu ${
										openReportsDropdown ? 'show' : ''
									}`}
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
					)}

					{(accessLevel === 2 || accessLevel === 0) && (
						<Link
							to="form"
							className="btn btn-info"
							style={{ height: 'fit-content' }}
						>
							Nova
						</Link>
					)}
				</div>
				{/* //corrigir estilo */}
				<div
					className="card pb-0 mb-2 position-relative"
					style={{ minHeight: '8em' }}
				>
					{loading ? (
						<div className="d-flex justify-content-center mt-5">
							<Spinner />
						</div>
					) : (
						<>
							{orders.map((order) => (
								<>
									<ListItemOrders
										key={order.id}
										qrcode={order?.qr_code}
										id={order.id}
										address={order.address}
										city={order.city}
										neighborhood={order.neighborhood}
										state={order.state}
										status={order.status}
										date={order.registerDay}
										kit={order?.ordersKits[0]?.kit?.description ?? ''}
										deleteListItem={() => {
											setDeleteId(order.id);
											openModal();
										}}
										duplicateItem={() => duplicateItem(order.id)}
										userName={order.user.name}
									/>
								</>
							))}
							<Pagination
								currentPage={currentPage}
								totalItems={totalOrders}
								totalPages={totalPages}
								toggleList={(value) => getOrders(value)}
							/>
						</>
					)}
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
