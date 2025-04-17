import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import ListItemOrders from '../../../ListItem/Materials';
import { api } from '../../../../api';
import useModalStore from '../../../../stores/modalStore';
import Modal from '../../../Modal';

export default forwardRef(function MaterialList(_, ref) {
	const [materials, setMaterials] = useState<
		Array<{ id: number; description: string; group: string }>
	>([]);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const { openModal, closeModal } = useModalStore((state) => state);

	useImperativeHandle(ref, () => ({ getMaterials }));

	const getMaterials = async () => {
		const response = await api.get('materials', {});
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
		<div className="card list-height overflow-y-auto pb-0 mb-5">
			<div className="card-header mb-0 pb-0 d-flex align-items-center">
				<p className="card-title fw-bold fs-5 mb-0 ">Materiais</p>
			</div>
			<div className="card-body p-3">
				{materials.map((material) => (
					<>
						<ListItemOrders
							group={material.group}
							id={material.id}
							title={material.description}
							showGroup={false}
							showMedida={false}
							deleteItem={() => {
								setDeleteId(material.id);
								openModal();
							}}
						/>
					</>
				))}
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
		</div>
	);
});
