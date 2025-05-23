import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { api } from '../../../../api';
import useModalStore from '../../../../stores/modalStore';
import ListItemOrders from '../../../ListItem/Kits';
import Modal from '../../../Modal';

export default forwardRef(function KitList(_, ref) {
	const { openModal, closeModal } = useModalStore((state) => state);
	const [deleteId, setDeleteId] = useState<unknown>(null);
	const [kits, setKits] = useState<Array<{ id: number; description: string }>>(
		[]
	);

	const getKits = async () => {
		const response = await api.get('kits', {});
		setKits(response.data);
	};

	useImperativeHandle(ref, () => ({ getKits }));

	const deleteItem = async (delItem: unknown) => {
		await api.delete(`/kit/${delItem}`);
		getKits();
		closeModal();
	};

	useEffect(() => {
		getKits();
	}, []);

	useEffect(() => {
		if (window) {
			const el = window.document.getElementById('saveKit');
			if (el) {
				el.addEventListener('click', getKits, false);
			}
		}
	}, []);

	return (
		<>
			{kits.map((kit) => (
				<>
					<ListItemOrders
						title={kit.description}
						id={`${kit.id}`}
						showStatus={false}
						deleteListItem={() => {
							setDeleteId(kit.id);
							openModal();
						}}
					/>
				</>
			))}

			<Modal
				cancelCopy="Cancelar"
				copy="Deseja remover o item selecionado ?"
				saveCopy="Apagar"
				toggleCancel={closeModal}
				toggleSave={() => deleteItem(deleteId)}
			/>
		</>
	);
});
