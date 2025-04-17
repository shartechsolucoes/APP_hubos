import { ChangeEvent, useEffect, useState } from 'react';
import { api } from '../../../api';
import { BsFillTrashFill, BsQrCode } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router';
import QRCodeScanner from '../../QRCodeScanner';
import axios from 'axios';

import './styles.css';
import Toast from '../../Toast';
import { estadosBrasileiros } from './data';
import useAccessLevelStore from '../../../stores/accessLevelStore';
import Image from '../Image';

export default function OrdersForm() {
	const { userId } = useAccessLevelStore();
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const [selectedKit, setSelectedKit] = useState('');
	const [listOfKits, setListOfKits] = useState<
		Array<{
			id: number;
			quantity: string;
			description: string;
			materials?: { material: { description: string } }[];
		}>
	>([]);
	const [kits, setKits] = useState<
		Array<{ id: number; quantity: string; description: string }>
	>([]);
	const [kitAndQuantity, setKitAndQuantity] = useState<
		Array<{ kit_id: number; quantity: string }>
	>([]);
	const [workImages, setWorkImages] = useState<{
		startWork: string;
		endWork: string;
	}>({ startWork: '', endWork: '' });
	const [hasStartPhoto, setHasStartPhoto] = useState(true);
	const [openQR, setOpenQR] = useState(id ? false : true);
	const [success, setSuccess] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const [isSaving, setSaving] = useState(false);
	const [addressError, setAddressError] = useState(false);

	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const route = useNavigate();

	// define the function that finds the users geolocation
	const getUserLocation = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};
		console.log('getting location ');

		// if geolocation is supported by the users browser
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// save the geolocation coordinates in two variables
					const { latitude, longitude } = position.coords;
					console.log(position.coords);
					// update the value of userlocation variable
					setUserLocation({ latitude, longitude });
				},
				// if there was an error getting the users location
				(error) => {
					console.error('Error getting user location:', error);
				},
				options
			);
		}
		// if geolocation is not supported by the users browser
		else {
			console.error('Geolocation is not supported by this browser.');
		}
	};

	const getKits = async () => {
		const response = await api.get('kits');
		setKits(response.data);
	};

	const getOrder = async () => {
		const response = await api.get(`/order/${id}`);
		response.data.ordersKits.map((ok: { kit_id: number; quantity: string }) => {
			const kitInfo = kits.filter((kit) => kit.id === ok.kit_id);
			setListOfKits((prev) => [...prev, kitInfo[0]]);
		});
		setKitAndQuantity(response.data.ordersKits);
		setFormData(response.data);
		setWorkImages({
			startWork: response.data.photoStartWork,
			endWork: response.data.photoEndWork,
		});
	};

	// useEffect(() => {
	// 	getUserLocation();
	// }, []);
	useEffect(() => {
		if (kits.length === 0) {
			getKits();
		}
		if (id && kits.length !== 0) {
			getOrder();
		}
	}, [kits]);

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

	const saveOrder = async (
		e?: any,
		afterPhoto?: string,
		statusEnd?: string
	) => {
		if (e) {
			e.preventDefault();
		}

		setSaving(true);
		if (workImages.startWork.length === 0) {
			setHasStartPhoto((prev) => !prev);
			setSaving(false);
			return;
		}

		const {
			address,
			neighborhood,
			city,
			state,
			status,
			observations,
			// lat,
			// long,
			qr_code,
			protocolNumber,
		} = formData;

		const osStatus = status || 1;

		try {
			if (id) {
				await api.put(`order/${id}`, {
					address,
					neighborhood,
					city,
					state,
					status: statusEnd || status,
					observations,
					qr_code,
					ordersKits: kitAndQuantity,
					protocolNumber,
					photoEndWork: afterPhoto || workImages.endWork,
					photoStartWork: workImages.startWork,
				});
				setSuccess(true);
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
					setSaving(false);
				}, 1300);
			} else {
				await api.post('order', {
					address,
					neighborhood,
					city,
					state,
					status: osStatus,
					observations,
					lat: `${userLocation?.latitude}`,
					long: `${userLocation?.longitude}`,
					qr_code,
					ordersKits: kitAndQuantity,
					protocolNumber,
					userId,
					photoEndWork: workImages.endWork,
					photoStartWork: workImages.startWork,
				});
				setSuccess(true);
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
					route(`/orders`);
					setSaving(false);
				}, 1300);
			}
		} catch (e) {
			console.error(e);
			setOpenToast(true);
			setSuccess(false);
			setTimeout(() => setOpenToast(false), 1000);
			setSaving(false);
		}
	};

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

	useEffect(() => {
		if (!id && userLocation?.latitude && userLocation?.longitude) {
			getLocation();
		}
	}, [userLocation?.latitude, userLocation?.longitude]);

	const getLocation = async () => {
		try {
			const response = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation?.latitude},${userLocation?.longitude}&key=AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0`
			);
			const addressResult = response.data.results[0];
			setFormData((prev) => ({
				...prev,
				address: `${addressResult.address_components[1]?.short_name} n.º:  ${addressResult.address_components[0].short_name}`,
				neighborhood: addressResult.address_components[2]?.short_name,
				city: addressResult.address_components[3]?.short_name,
				state: addressResult.address_components[4]?.short_name,
			}));
		} catch (error) {
			setAddressError(true);
			console.error(error);
		}
	};

	const sentStartWorkPhoto = async (e: any) => {
		const data = new FormData();

		data.append('file', e.target.files[0]);

		const response = await api.post(
			`order/start-work-photo?id=${id || ''}`,
			data,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);

		setWorkImages((prev) => ({ ...prev, startWork: response.data.file }));
	};

	const sentEndWorkPhoto = async (e: any) => {
		const data = new FormData();

		data.append('file', e.target.files[0]);

		try {
			const response = await api.post(
				`order/end-work-photo?id=${id || ''}`,
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			setWorkImages((prev) => ({ ...prev, endWork: response.data.file }));
			setFormData((prev) => ({ ...prev, status: 2 }));

			saveOrder(undefined, response.data.file, '2');
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="card form-container p-3 pb-3 mb-5">
			{openToast && <Toast success={success} />}
			{/* {openEnd && } */}
			<div className="card-body row">
				{openQR && (
					<QRCodeScanner
						closeQR={() => {
							setOpenQR(!openQR);
							getUserLocation();
						}}
						handleValue={(value) =>
							setFormData((prev) => ({
								...prev,
								qr_code: value,
							}))
						}
					/>
				)}
				<form onSubmit={saveOrder}>
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
						<div className="mb-3 col-1 col-md-1 align-qr-code">
							<button
								type="button"
								onClick={() => setOpenQR(!openQR)}
								className="align-self-center btn btn-primary"
							>
								<BsQrCode />
							</button>
						</div>
						<div className="mb-3 col-6 col-md-6 d-flex flex-column">
							<label htmlFor="exampleInputEmail1" className="form-label">
								Início
							</label>
							{workImages.startWork && (
								<Image image={workImages.startWork} height="240px" />
							)}
							<label className="btn btn-primary" htmlFor="start-work">
								Inserir Foto
							</label>
							<input
								style={{ display: 'none' }}
								accept="image/*"
								id="start-work"
								type="file"
								capture="environment"
								onChange={sentStartWorkPhoto}
							/>
							{!hasStartPhoto && (
								<p className="text-danger">Não foi inserida imagem</p>
							)}
						</div>
						<div className="mb-3 col-6 col-md-6 d-flex flex-column">
							{id && (
								<label htmlFor="exampleInputEmail1" className="form-label">
									Fim
								</label>
							)}
							{workImages.endWork && (
								<Image image={workImages.endWork} height="240px" />
							)}

							{id && (
								<label className="btn btn-primary" htmlFor={'end-work'}>
									Inserir Foto
								</label>
							)}
							<input
								style={{ display: 'none' }}
								id="end-work"
								type="file"
								onChange={sentEndWorkPhoto}
								capture="environment"
								accept="image/*"
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
								value={formData.status || 0}
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
								disabled={!selectedKit}
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
																kitAndQuantity.some(
																	(kq) => kq.kit_id === kit.id
																)
																	? kitAndQuantity.filter(
																			(k) => k.kit_id === kit.id
																	  )[0].quantity
																	: ''
															}
															type="text"
															className="form-control"
															onChange={(e) =>
																handleKitQuantity(e, `${kit.id}`)
															}
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
						<button
							disabled={isSaving}
							type="submit"
							className="btn btn-primary"
						>
							{isSaving ? 'Salvando' : 'Salvar'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
