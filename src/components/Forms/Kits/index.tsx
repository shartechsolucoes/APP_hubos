import { ChangeEvent, useEffect, useState } from 'react';
import { api } from '../../../api';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router';
import Toast from '../../Toast';

export default function KitsForm() {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const route = useNavigate();
	const [materials, setMaterials] = useState<
		Array<{ id: number; description: string }>
	>([]);

	const [listOfMaterials, setListOfMaterials] = useState<
		Array<{ id: number; description: string }>
	>([]);
	const [selectedMaterial, setSelectedMaterial] = useState('');
	const [materialAndQuantity, setMaterialAndQuantity] = useState<
		Array<{ id: number; quantity: string }>
	>([]);
	const [openToast, setOpenToast] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	const getMaterials = async () => {
		const response = await api.get('materials');
		setMaterials(response.data);
	};

	const getKit = async () => {
		const response = await api.get(`/kit/${id}`);
		const materialsList = response.data.materials.map(
			(km: { material_id: number; quantity: string }) => {
				const materialInfo = materials.filter(
					(material) => material.id === km.material_id
				);
				setListOfMaterials((prev) => [...prev, materialInfo[0]]);
				return {
					id: km.material_id,
					quantity: km.quantity,
				};
			}
		);

		setMaterialAndQuantity(materialsList);
		setFormData(response.data);
	};

	useEffect(() => {
		getMaterials();
	}, []);

	useEffect(() => {
		if (id && materials.length > 0) {
			getKit();
		}
	}, [materials]);

	function handleMaterialList() {
		const filteredMaterial = materials.filter(
			(material) => material.id === parseInt(selectedMaterial)
		);

		if (
			selectedMaterial &&
			listOfMaterials.every(
				(material) => material.id !== parseInt(selectedMaterial)
			)
		) {
			setListOfMaterials((prev) => [...prev, filteredMaterial[0]]);
			setSelectedMaterial('');
		}

		if (
			!materialAndQuantity.some(
				(item) => item.id === parseInt(selectedMaterial)
			)
		) {
			setMaterialAndQuantity((prev) => [
				...prev,
				{ id: parseInt(selectedMaterial), quantity: '1' },
			]);
		}
	}

	const saveKit = async () => {
		setOpenToast(true);
		const kit = {
			description: formData.description,
			materials: materialAndQuantity,
		};
		try {
			if (id) {
				await api.put(`kit/${id}`, kit);
				setSuccess(true);
				setTimeout(() => {
					setOpenToast(false);
				}, 1300);
			} else {
				await api.post(`kit`, kit);
				setSuccess(true);
				setTimeout(() => {
					setOpenToast(false);
					route(`/kits`);
				}, 1300);
			}
		} catch (error) {
			setSuccess(false);
			console.error(error);
		}
	};

	const handleMaterialQuantity = (
		e: ChangeEvent<HTMLInputElement>,
		id: string
	) => {
		const value: string = e.target.value;
		if (!materialAndQuantity.some((item) => item.id === parseInt(id))) {
			setMaterialAndQuantity((prev) => [
				...prev,
				{ id: parseInt(id), quantity: '1' },
			]);
		} else {
			setMaterialAndQuantity((prev) =>
				prev.map((p) => {
					if (p.id === parseInt(id)) {
						return { ...p, quantity: value };
					} else return p;
				})
			);
		}
	};

	const deleteKitMaterial = async (kitId: number, materialId: number) => {
		try {
			await api.delete(`/kit-material/${materialId}/${kitId} `);
			setOpenToast(true);
			materialAndQuantity.splice(
				materialAndQuantity.findIndex((material) => material.id === materialId),
				1
			);
			listOfMaterials.splice(
				listOfMaterials.findIndex((material) => material.id === materialId),
				1
			);

			setListOfMaterials([...listOfMaterials]);

			setSuccessMsg('Material removido');
		} catch (error) {
			console.error(error);
			setOpenToast(true);
			setErrorMsg('Nào foi possível Remover o material ');
		}

		setTimeout(() => {
			setSuccessMsg('');
			setErrorMsg('');
			setOpenToast(false);
		}, 1300);
	};

	return (
		<div className="row">
			{openToast && (
				<Toast success={success} msgSuccess={successMsg} msgError={errorMsg} />
			)}
			<div className="col-md-3">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header">
						<p className="card-title">Kits</p>
					</div>
					<div className="card-body p-3"></div>
				</div>
			</div>
			<div className="col-md-9">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header">
						<p className="card-title">Editar</p>
						<button type="submit" className="btn btn-primary" onClick={saveKit}>
							Salvar
						</button>
					</div>
					<hr />
					<div className="card-body p-3">
						<form>
							<div className="row">
								<div className="mb-3 col-9">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Descrição
									</label>
									<input
										type="text"
										className="form-control"
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: `${e.target.value}`,
											}))
										}
									/>
								</div>
								<div className="mb-3 col-3">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Status
									</label>
									<input
										value={formData.status}
										type="text"
										className="form-control"
										id="status"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: `${e.target.value}`,
											}))
										}
									/>
								</div>
							</div>
							<div className="mb-3 d-flex justify-content-between align-items-end gap-5">
								<span className="flex-fill">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Materiais
									</label>
									<select
										className="form-select"
										aria-label="Default select example"
										onChange={(e) => setSelectedMaterial(e.target.value)}
									>
										<option selected disabled value={''}>
											Selecione o Material
										</option>
										{materials.map((material) => (
											<option value={material.id}>
												{material.description}
											</option>
										))}
									</select>
								</span>
								<button
									type="button"
									className="btn btn-primary"
									onClick={() => handleMaterialList()}
								>
									+
								</button>
							</div>
							<table className="w-100">
								<thead>
									<tr>
										<th className="text-start">Kit</th>
										<th>Status</th>
										<th>Ações</th>
									</tr>
								</thead>
								<tbody>
									{listOfMaterials.length > 0 && (
										<>
											{listOfMaterials.map((material) => (
												<div className="mb-3 mt-3">
													<div className="d-flex justify-content-between align-items-end">
														<div>{material.description}</div>
														<div className="d-flex align-items-end gap-5">
															<span>
																<label
																	htmlFor="exampleInputEmail1"
																	className="form-label"
																>
																	Quantidade
																</label>
																<input
																	value={
																		materialAndQuantity.some(
																			(mq) => mq.id === material.id
																		)
																			? materialAndQuantity.filter(
																					(m) => m.id === material.id
																			  )[0].quantity
																			: ''
																	}
																	type="text"
																	className="form-control"
																	onChange={(e) =>
																		handleMaterialQuantity(e, `${material.id}`)
																	}
																/>
															</span>
															<button
																type="button"
																className="btn btn-primary"
																onClick={() =>
																	deleteKitMaterial(
																		parseInt(id || ''),
																		material.id
																	)
																}
															>
																<BsFillTrashFill />
															</button>
														</div>
													</div>
												</div>
											))}
										</>
									)}
								</tbody>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
