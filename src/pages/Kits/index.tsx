import { BsFillPlusSquareFill } from 'react-icons/bs';
import ListItem from '../../components/ListItem/Kits';
import { NavLink } from 'react-router';
import { api } from '../../api';
import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import useModalStore from '../../stores/modalStore';

export default function Kits() {
	const { openModal, closeModal } = useModalStore((state) => state);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [kits, setKits] = useState<Array<{ id: number; description: string }>>(
		[]
	);

	const getKits = async () => {
		const response = await api.get('kits');
		setKits(response.data);
	};

	const deleteItem = async (delItem: unknown) => {
		await api.delete(`/kit/${delItem}`);
		getKits();
		closeModal();
	};

	useEffect(() => {
		getKits();
	}, []);
	return (
		<div className="row">
			<div className="d-flex p-2 pt-0 justify-content-end align-items-center">
				<NavLink to="form" className="btn">
					<BsFillPlusSquareFill /> Novo
				</NavLink>
			</div>
			<div className="col-md-8">

				<div className="card pb-0 mb-5">
					<table className="w-100">
						<thead>
							<tr>
								<th className="text-start">Kit</th>
								<th>Status</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							{kits.map((kit) => (
								<>
									<ListItem
										title={kit.description}
										id={`${kit.id}`}
										deleteListItem={() => {
											setDeleteId(kit.id);
											openModal();
										}}
									/>
									<hr />
								</>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="col-md-4">
				<div className="card">
					<div className="card-body">
						Grafico de uso de cada kit ultimo Mês
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
		</div>
	);
}
