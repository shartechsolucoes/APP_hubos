import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { api } from '../../../api';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router';
import Toast from '../../Toast';
import KitList from './KitList';

export default function KitsForm() {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const route = useNavigate();
	const [materials, setMaterials] = useState<
		Array<{ id: number; description: string; group: string }>
	>([]);

	const [listOfMaterials, setListOfMaterials] = useState<
		Array<{ id: number; description: string; group: string }>
	>([]);
	const [selectedMaterial, setSelectedMaterial] = useState('');
	const [materialAndQuantity, setMaterialAndQuantity] = useState<
		Array<{ id: number; quantity: string }>
	>([]);
	const [openToast, setOpenToast] = useState(false);
	const [success, setSuccess] = useState(true);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	const getMaterials = async () => {
		const response = await api.get('materials');
		setMaterials(response.data);
	};

	const childRef = useRef<any>();

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
		setListOfMaterials([]);
		getMaterials();
	}, [id]);

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
		const kit = {
			description: formData.description,
			materials: materialAndQuantity,
		};
		try {
			setErrorMsg('');
			if (id) {
				await api.put(`kit/${id}`, kit);
				setSuccess(true);
				setSuccessMsg('Kit atualizado com sucesso');
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
				}, 1300);
			} else {
				await api.post(`kit`, kit);
				setSuccess(true);
				setSuccessMsg('Kit criado com sucesso');
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
					route(`/kits`);
				}, 1300);
			}
			childRef?.current?.getKits();
		} catch (error) {
			setSuccess(false);
			setSuccessMsg('');
			setErrorMsg('Erro ao criar o Kit');
			setOpenToast(true);
			console.error(error);
			setTimeout(() => {
				setOpenToast(false);
			}, 1300);
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
		if (materialId && kitId) {
			try {
				await api.delete(`/kit-material/${materialId}/${kitId} `);
				setOpenToast(true);
				materialAndQuantity.splice(
					materialAndQuantity.findIndex(
						(material) => material.id === materialId
					),
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
				setSuccessMsg('');
				setErrorMsg('Nào foi possível Remover o material ');
			}

			setTimeout(() => {
				setSuccessMsg('');
				setErrorMsg('');
				setOpenToast(false);
			}, 1300);
		}
	};

	return (
		<>
		<div className="row">
		{id && (
			<div className="col-md-3">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header">
						<p className="card-title">Kits</p>
					</div>
					<div className="card-body p-3">
						<KitList ref={childRef} />
					</div>
				</div>
			</div>
		)}
		<div className={id ? 'col-md-9' : 'col-md-12'}>
			<div className="card p-4">
				<h5 className="card-title">Editar</h5>
				<hr />
				<form>
					<div className="row">
						<div className="mb-3 col-9">
							<label
								htmlFor="exampleInputEmail1"
								className="form-label"
							>
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
							<label
								htmlFor="exampleInputEmail1"
								className="form-label"
							>
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
											<label
												htmlFor="exampleInputEmail1"
												className="form-label"
											>
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
							disabled={selectedMaterial.length === 0}
							type="button"
							className="btn btn-primary"
							onClick={() => handleMaterialList()}
						>
							+
						</button>
					</div>

					<ul className="p-0 m-0"></ul>

					{listOfMaterials.length > 0 && (
						<>
							{listOfMaterials.map((material) => (
								<div className="mb-2">
									<li className="d-flex">
										<div className="avatar flex-shrink-0 me-3">
															<span className="avatar-initial rounded bg-label-secondary">
																<i className="bx bx-football"></i>
															</span>
										</div>
										<div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
											<div className="me-2">
												<h6 className="mb-0">{material.description}</h6>
												<small className="text-muted">
													{material.group}
												</small>
											</div>
											<div className="user-progress d-flex gap-2">
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
									</li>
								</div>
							))}
						</>
					)}
					<button
						type="submit"
						className="btn btn-primary"
						onClick={saveKit}
					>
						Salvar
					</button>
				</form>
			</div>


		</div>

		{openToast && (
			<Toast success={success} msgSuccess={successMsg} msgError={errorMsg} />
		)}
		</div>
</>
);
}
