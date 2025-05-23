import ListItem from '../../components/ListItem/Kits';
import { NavLink } from 'react-router';
import { api } from '../../api';
import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import useModalStore from '../../stores/modalStore';
import Toast from '../../components/Toast';

export default function Kits() {
	const { openModal, closeModal } = useModalStore((state) => state);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [kits, setKits] = useState<
		Array<{ id: number; description: string; status: boolean }>
	>([]);

	const [openToast, setOpenToast] = useState(false);
	const [messageError, setMessageError] = useState('');
	const [messageSuccess, setMessageSuccess] = useState('');
	const [success, setSuccess] = useState(false);

	const getKits = async () => {
		const response = await api.get('kits', {
			params: {
				name: searchKits,
				material: searchMaterials,
			},
		});
		setKits(response.data);
	};

	const deleteItem = async (delItem: unknown) => {
		try {
			await api.delete(`/kit/${delItem}`);
			getKits();
			closeModal();
			setSuccess(true);
			setMessageSuccess('Apagado com sucesso');
			setOpenToast(true);
			setTimeout(() => {
				setOpenToast(false);
				setMessageSuccess('');
			}, 2000);
		} catch (error: any) {
			console.error(error);
			closeModal();
			setSuccess(false);
			setMessageError(JSON.parse(error.request.response).msg);
			setOpenToast(true);
			setTimeout(() => {
				setOpenToast(false);
				setMessageError('');
			}, 2000);
		}
	};

	const [searchKits, setSearchKits] = useState('');
	const [searchMaterials, setSearchMaterials] = useState('');
	useEffect(() => {
		getKits();
	}, []);
	return (
		<>
			<div className="d-flex py-4 pt-0 gap-4 justify-content-end align-items-center">
				{openToast && (
					<Toast
						success={success}
						msgError={messageError}
						msgSuccess={messageSuccess}
					/>
				)}
				<div className="d-none d-md-flex d-flex flex-column ">
					<input
						className="form-control"
						placeholder="Nome do Kit"
						value={searchKits}
						onChange={(e) => setSearchKits(e.target.value)}
					/>
				</div>
				<div className="d-none d-md-flex d-flex flex-column ">
					<input
						className="form-control"
						placeholder="Nome do Material"
						value={searchMaterials}
						onChange={(e) => setSearchMaterials(e.target.value)}
					/>
				</div>
				<a
					onClick={() => getKits()}
					className=" d-none d-md-flex d-flex flex-column btn btn-info"
					style={{ height: 'fit-content' }}
				>
					Pesquisar
				</a>

				<NavLink to="form" className="btn btn-info">
					Novo
				</NavLink>
			</div>
			<div className="col-md-9">
				<div className="card pb-0 mb-5">
					{kits.map((kit) => (
						<>
							<ListItem
								title={kit.description}
								id={`${kit.id}`}
								status={kit.status}
								deleteListItem={() => {
									setDeleteId(kit.id);
									openModal();
								}}
							/>
						</>
					))}
				</div>
			</div>
			<div className="col-md-3">
				<div className="card">
					<div className="card-body">Grafico de uso de cada kit ultimo Mês</div>
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
