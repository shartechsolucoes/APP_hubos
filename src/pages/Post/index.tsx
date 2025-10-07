import ListItem from '../../components/ListItem/Materials';
import './styles.css';
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import useModalStore from '../../stores/modalStore';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

export default function Posts() {
	const [materials, setPosts] = useState<
		Array<{
			id: number;
			description: string;
			group: string;
			unit: string;
			status: string;
		}>
	>([]);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const { openModal, closeModal } = useModalStore((state) => state);
	const [searchMaterial, setSearchMaterial] = useState('');
	const [openToast, setOpenToast] = useState(false);
	const [messageError, setMessageError] = useState('');
	const [messageSuccess, setMessageSuccess] = useState('');
	const [success, setSuccess] = useState(false);

	const getMaterials = async () => {
		const response = await api.get('posts');
		setPosts(response.data);
	};

	const deleteMaterial = async (id: number) => {
		try {
			await api.delete(`post/${id}`);
			getMaterials();
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
	useEffect(() => {
		getMaterials();
	}, []);

	return (
		<>
			<div>
				{openToast && (
					<Toast
						success={success}
						msgError={messageError}
						msgSuccess={messageSuccess}
					/>
				)}
				<div className="d-flex py-4 gap-4 pt-0 justify-content-end align-items-center">
					<div className="d-none d-md-flex d-flex flex-column ">
						<input
							className="form-control"
							placeholder="Nome do material"
							value={searchMaterial}
							onChange={(e) => setSearchMaterial(e.target.value)}
						/>
					</div>
					<a
						onClick={() => getMaterials()}
						className=" d-none d-md-flex d-flex flex-column btn btn-info"
						style={{ height: 'fit-content' }}
					>
						Pesquisar
					</a>
					<NavLink to="form" className="btn btn-info">
						Novo
					</NavLink>
				</div>
				<div className="card pb-0 mb-5">
					{materials.map((material) => (
						<>
							<ListItem
								group={material.group}
								id={material.id}
								title={material.description}
								unit={material.unit}
								status={material.status}
								showMedida={true}
								showStatus={true}
								deleteItem={() => {
									setDeleteId(material.id);
									openModal();
								}}
							/>
						</>
					))}
				</div>
			</div>
			<div>
				<Modal
					cancelCopy="Cancelar"
					copy="Deseja remover o item selecionado ?"
					saveCopy="Apagar"
					toggleCancel={closeModal}
					toggleSave={() => deleteMaterial(deleteId || 0)}
				/>
			</div>
		</>
	);
}
