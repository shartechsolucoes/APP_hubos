import { BsFillPlusSquareFill } from 'react-icons/bs';
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

	const getMaterials = async () => {
		const response = await api.get('materials');
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
				<div className="d-flex p-2 pt-0 justify-content-end align-items-center">
					<NavLink to="form" className="btn-blue">
						<BsFillPlusSquareFill /> Novo
					</NavLink>
				</div>
				<div className="card overflow-y-auto pb-0 mb-5">
					<table className="w-100">
						<thead>
						<tr>
							<th className="text-start">Material</th>
							<th>Tipo</th>
							<th>Status</th>
							<th>Ações</th>
						</tr>
						</thead>
						<tbody>
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
						</tbody>
					</table>
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
