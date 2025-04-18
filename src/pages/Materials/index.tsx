import ListItem from '../../components/ListItem/Materials';
import './styles.css';
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import useModalStore from '../../stores/modalStore';
import Modal from '../../components/Modal';

export default function Materials() {
	const [materials, setMaterials] = useState<
		Array<{ id: number; description: string; group: string }>
	>([]);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const { openModal, closeModal } = useModalStore((state) => state);
	const [searchMaterial, setSearchMaterial] = useState('');

	const getMaterials = async () => {
		const response = await api.get('materials', {
			params: {
				name: searchMaterial,
			},
		});
		setMaterials(response.data);
	};

	const deleteMaterial = async (id: number) => {
		await api.delete(`material/${id}`);
		getMaterials();
		closeModal();
	};
	useEffect(() => {
		getMaterials();
	}, []);

	return (
		<>
			<div>
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
