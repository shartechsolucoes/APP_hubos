import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spiner';
import useModalStore from '../../stores/modalStore';
import Modal from '../../components/Modal';
import { api } from '../../api';
import ListItemService from '../../components/ListItem/Service';
import { Link } from 'react-router';
import useAccessLevelStore from '../../stores/accessLevelStore';

export type ServiceType = {
	id: number;
	protocolNumber: string;
	numberPost: number;
	observation: string;
	userId: string | null; // null se o campo for opcional
	orderId: number;
	address: string;
	neighborhood: string;
	city: string;
	state: string;
	user: {
		id: string;
		name: string;
		email: string;
		picture: string;
	} | null;
	order: {
		status: number;
	};
};

export default function Services() {
	const { accessLevel, userId } = useAccessLevelStore();
	const { openModal, closeModal } = useModalStore((state) => state);

	const [searchService, setSearchService] = useState('');
	const [totalServices, setTotalServices] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [services, setServices] = useState<ServiceType[]>();
	const [myId, setMyId] = useState<string>('');

	const totalPages =
		totalServices < 10
			? 1
			: (totalServices / 10) % 1 > 0.5
			? Math.ceil(totalServices / 10)
			: Math.ceil(totalServices / 10);

	const getServices = async (page = 0) => {
		setLoading(true);
		setCurrentPage(page);
		try {
			const response = await api.get(`/services?page=${page}&userId=${myId}`);
			setServices(response.data.data);
			setTotalServices(response.data.meta.data.total);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const deleteItem = async (delItem: unknown) => {
		await api.delete(`/services/${delItem}`);
		getServices();
		closeModal();
	};

	const attachToUser = async (protocol: ServiceType) => {
		try {
			await api.put(`services/${protocol.id}`, { ...protocol, userId: userId });
			getServices();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getServices();
	}, [myId]);

	return (
		<div className="col-md-12">
			<div className="d-flex justify-content-between align-items-end gap-3 my-4">
				<button
					type="button"
					className="btn btn-info"
					style={{ height: 'fit-content' }}
					onClick={() => (myId ? setMyId('') : setMyId(userId))}
				>
					{myId ? 'Todos' : 'Meus'}
				</button>
				<span className="d-flex justify-content-end align-items-end gap-3">
					<div className="d-none d-md-flex d-flex flex-column ">
						<input
							className="form-control"
							placeholder="Numero do Pedido"
							value={searchService}
							onChange={(e) => setSearchService(e.target.value)}
						/>
					</div>
					{(accessLevel === 2 || accessLevel === 0) && (
						<Link
							to="form"
							className="btn btn-info"
							style={{ height: 'fit-content' }}
						>
							Nova
						</Link>
					)}
				</span>
			</div>
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
						{services?.map((service) => (
							<>
								<ListItemService
									key={service.id}
									id={service.id}
									address={service.address}
									city={service.city}
									neighborhood={service.neighborhood}
									state={service.state}
									protocolNumber={service.protocolNumber}
									userId={service.user?.id}
									startOs={service.user?.id === myId}
									userName={service?.user?.name}
									userPicture={service.user?.picture}
									status={service.order?.status}
									deleteListItem={() => {
										setDeleteId(service.id);
										openModal();
									}}
									attachUser={(protol) => attachToUser(protol)}
								/>
							</>
						))}
						<Pagination
							currentPage={currentPage}
							totalItems={totalServices}
							totalPages={totalPages}
							toggleList={(value) => getServices(value)}
						/>
					</>
				)}
			</div>

			<Modal
				cancelCopy="Cancelar"
				copy="Deseja remover o item selecionado ?"
				saveCopy="Apagar"
				toggleCancel={closeModal}
				toggleSave={() => deleteItem(deleteId)}
			/>
		</div>
	);
}
