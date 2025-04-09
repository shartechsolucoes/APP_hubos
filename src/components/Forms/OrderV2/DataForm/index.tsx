import { ChangeEvent, useEffect, useState } from 'react';
import { estadosBrasileiros } from '../data';
import { BsFillTrashFill } from 'react-icons/bs';
import { api } from '../../../../api';

export default function DataForm({
	saveOrder,
	addressError,
	isSaving,
}: {
	saveOrder: (value: any) => void;
	addressError: boolean;
	isSaving: boolean;
}) {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const [kits, setKits] = useState<
		Array<{ id: number; quantity: string; description: string }>
	>([]);
	const [selectedKit, setSelectedKit] = useState('');
	const [listOfKits, setListOfKits] = useState<
		Array<{
			id: number;
			quantity: string;
			description: string;
			materials?: { material: { description: string } }[];
		}>
	>([]);
	const [kitAndQuantity, setKitAndQuantity] = useState<
		Array<{ kit_id: number; quantity: string }>
	>([]);
	const deleteKitOrder = async (kitId: number, orderId: number) => {
		kitAndQuantity.splice(
			kitAndQuantity.findIndex((kit) => kit.kit_id === kitId),
			1
		);
		listOfKits.splice(
			listOfKits.findIndex((kit) => kit.id === kitId),
			1
		);

		setListOfKits([...listOfKits]);
		await api.delete(`/kit-order/${kitId}/${orderId} `);
	};

	const getKits = async () => {
		const response = await api.get('kits');
		setKits(response.data);
	};

	function handleKitList() {
		const filteredKit = kits.filter((kit) => kit.id === parseInt(selectedKit));
		if (
			selectedKit &&
			listOfKits.every((kit) => kit.id !== parseInt(selectedKit))
		) {
			setListOfKits((prev) => [...prev, filteredKit[0]]);
			setSelectedKit('');
		}
		if (!kitAndQuantity.some((item) => item.kit_id === parseInt(selectedKit))) {
			setKitAndQuantity((prev) => [
				...prev,
				{ kit_id: parseInt(selectedKit), quantity: '1' },
			]);
		}
	}

	const handleKitQuantity = (e: ChangeEvent<HTMLInputElement>, id: string) => {
		const value: string = e.target.value;
		if (!kitAndQuantity.some((item) => item.kit_id === parseInt(id))) {
			setKitAndQuantity((prev) => [
				...prev,
				{ kit_id: parseInt(id), quantity: value },
			]);
		} else {
			setKitAndQuantity((prev) =>
				prev.map((p) => {
					if (p.kit_id === parseInt(id)) {
						return { ...p, quantity: value };
					} else return p;
				})
			);
		}
	};

	useEffect(() => {
		getKits();
	}, []);

	const save = (e: any) => {
		e.preventDefault();
		saveOrder(formData);
	};

	return (
		<form onSubmit={save}>
			<div className="row">
				<div className="mb-3 col-10 col-md-11">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Número da OS
					</label>
					<input
						type="text"
						className="form-control"
						id="qr_code"
						value={formData.qr_code}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: `${e.target.value}`,
							}))
						}
					/>
				</div>
				<div className="mb-3 col-6 col-md-6">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Número do Protocolo
					</label>
					<input
						type="text"
						className="form-control"
						id="protocolNumber"
						value={formData.protocolNumber}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					/>
				</div>
				<div className="mb-3 col-6">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Status
					</label>
					<select
						id="status"
						value="2"
						className="form-control"
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					>
						<option value="0">Aberto</option>
						<option value="1">Em trabalho</option>
						<option selected value="2">
							Finalizado
						</option>
					</select>
				</div>
				{addressError && (
					<div className="mb-3 alert alert-danger">
						Tivemos um problema ao tentar achar sua localização, por favor
						insira manualmente
					</div>
				)}
				<div className="mb-3 ">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Endereço
					</label>
					<input
						type="text"
						className="form-control"
						id="address"
						value={formData.address}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					/>
				</div>
				<div className="mb-3 col-6 col-md-5">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Bairro
					</label>
					<input
						type="text"
						className="form-control"
						id="neighborhood"
						value={formData.neighborhood}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					/>
				</div>

				<div className="mb-3 col-6 col-md-5">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Município
					</label>
					<input
						type="text"
						className="form-control"
						id="city"
						value={formData.city}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					/>
				</div>

				<div className="mb-3 col-12 col-md-2">
					<label htmlFor="exampleInputEmail1" className="form-label">
						UF
					</label>
					<select
						className="form-control"
						id="state"
						value={formData.state}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					>
						<option value={''} selected disabled>
							Selecione uma UF
						</option>
						{estadosBrasileiros.map((state, index) => (
							<option key={index} value={state.acronym}>
								{state.state}
							</option>
						))}
					</select>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">
						OBS:
					</label>
					<textarea
						className="form-control"
						id="observations"
						value={formData.observations}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								[e.target.id]: e.target.value,
							}))
						}
					/>
				</div>
				<div className="mb-3 d-flex justify-content-between align-items-end gap-5">
					<span className="flex-fill">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Kits
						</label>
						<select
							className="form-select"
							aria-label="Default select example"
							id="kit"
							onChange={(e) => setSelectedKit(e.target.value)}
						>
							<option value={''} selected disabled>
								Selecione o(s) Kit(s)
							</option>
							{kits.map((kit) => (
								<option value={kit.id}>{kit.description}</option>
							))}
						</select>
					</span>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => {
							handleKitList();
						}}
					>
						+
					</button>
				</div>
				{listOfKits.length > 0 && (
					<>
						{listOfKits.map((kit) => (
							<div className="mb-3 mt-3">
								<div className="mb-2">
									<li className="d-flex">
										<div className="avatar flex-shrink-0 me-3">
											<span className="avatar-initial rounded bg-label-secondary">
												<i className="bx bx-football"></i>
											</span>
										</div>
										<div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
											<div className="me-2">
												<h6 className="mb-0">{kit.description}</h6>
												<small className="d-flex">
													{kit?.materials?.map((material) => (
														<small>{material.material.description} -</small>
													))}
												</small>
											</div>
											<div className="user-progress d-flex gap-2">
												<input
													required
													value={
														kitAndQuantity.some((kq) => kq.kit_id === kit.id)
															? kitAndQuantity.filter(
																	(k) => k.kit_id === kit.id
															  )[0].quantity
															: ''
													}
													type="text"
													className="form-control"
													onChange={(e) => handleKitQuantity(e, `${kit.id}`)}
												/>
												<button
													type="button"
													className="btn btn-primary"
													onClick={() =>
														deleteKitOrder(kit.id, parseInt(id || ''))
													}
												>
													<BsFillTrashFill />
												</button>
											</div>
										</div>
									</li>
								</div>
							</div>
						))}
					</>
				)}
				<button disabled={isSaving} type="submit" className="btn btn-primary">
					{isSaving ? 'Salvando' : 'Salvar'}
				</button>
			</div>
		</form>
	);
}
