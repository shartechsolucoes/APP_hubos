import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { api } from '../../../api';
import { BsQrCode} from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router';
import QRCodeScanner from '../../QRCodeScanner';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import OrderPhotos from './../../Orders/OrderPhotos.tsx';
import OrderKits from './../../Orders/OrderKits.tsx';
// import OrderView from './../../Orders/OrderView.tsx';

import './styles.css';
import Toast from '../../Toast';
import { estadosBrasileiros } from './data';
import useAccessLevelStore from '../../../stores/accessLevelStore';
import ModalImage from './ModalImage';
import { ServiceType } from '../../../pages/Services';
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";
import Image from "../Image";
import { format, parse } from 'date-fns';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0';

export default function OrdersForm() {
	const { userId, accessLevel } = useAccessLevelStore();
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const protocol = searchParams.get('protocol');
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

	const [openQR, setOpenQR] = useState(id ? false : true);
	const [success, setSuccess] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const [isSaving, setSaving] = useState(false);
	const [addressError, setAddressError] = useState(false);

	const [hasOS, setHasOs] = useState(false);

	const [openImage, setOpenImage] = useState('');
	const imageModalRef = useRef<any>();
	const [services, setServices] = useState<ServiceType>();

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

		// Mantém exatamente sua lógica atual de kits
		response.data.ordersKits.map(
			(ok: { kit_id: number; quantity: string }) => {
				const kitInfo = kits.filter((kit) => kit.id === ok.kit_id);
				setListOfKits((prev) => [...prev, kitInfo[0]]);
			}
		);

		// Mantém kits + quantidades
		setKitAndQuantity(response.data.ordersKits);

		// 🔴 AJUSTE AQUI: converter registerDay para datetime-local
		setFormData({
			...response.data,
			registerDay: formatRegisterDayForDisplay(response.data.registerDay),
		});

		// Mantém imagens
		setWorkImages({
			startWork: response.data.photoStartWork,
			endWork: response.data.photoEndWork,
		});
	};

	async function getProtocol() {
		try {
			const response = await api.get(`services/${protocol}`);
			setServices(response.data);
			setFormData((prev) => ({
				...prev,
				protocolNumber: response.data.protocolNumber,
			}));
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (kits.length === 0) {
			getKits();
		}
		if (id && kits.length !== 0) {
			getOrder();
		}
	}, [kits]);

	useEffect(() => {
		if (formData) {
			getProtocol();
		}
	}, []);
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
		statusEnd?: string,
		startPhoto?: string
	) => {
		if (e) e.preventDefault();

		setSaving(true);

		const {
			address,
			neighborhood,
			city,
			state,
			status,
			observations,
			lat,
			long,
			type,
			qr_code,
			protocolNumber,
		} = formData;

		if (!qr_code) {
			setHasOs(true);
			setSaving(false);
			return;
		}

		const osStatus = status || 1;

		try {
			if (id) {
				// Atualizar ordem existente
				await api.put(`order/${id}`, {
					address,
					neighborhood,
					city,
					state,
					status: statusEnd || status,
					observations,
					qr_code,
					lat,
					long,
					type,
					registerDay: normalizeRegisterDay(formData.registerDay),
					ordersKits: kitAndQuantity,
					protocolNumber,
					photoEndWork: afterPhoto || workImages.endWork,
					photoStartWork: startPhoto || workImages.startWork,
				});

				setSuccess(true);
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
					setSaving(false);
				}, 1300);
			} else {
				// Criar nova ordem
				const response = await api.post('order', {
					address,
					neighborhood,
					city,
					state,
					status: osStatus,
					observations,
					lat: lat || `${userLocation?.latitude}`,
					long: long || `${userLocation?.longitude}`,
					qr_code,
					registerDay: normalizeRegisterDay(formData.registerDay),
					ordersKits: kitAndQuantity,
					protocolNumber,
					userId,
					photoEndWork: workImages.endWork,
					photoStartWork: workImages.startWork,
				});

				const newOrderId = response?.data?.id;

				if (!newOrderId) {
					throw new Error('Falha ao obter o ID da nova ordem.');
				}
				console.log(newOrderId);
				console.log('Atualizando serviço com:', {
					...services,
					orderId: newOrderId,
				});
				if (protocol && newOrderId) {
					console.log(newOrderId);
					await api.put(`services/${protocol}`, {
						...services,
						orderId: newOrderId,
					});
				}

				setSuccess(true);
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
					route(`/orders`);
					setSaving(false);
				}, 1300);
			}
		} catch (e: any) {
			console.error(
				'Erro ao salvar ordem ou atualizar serviço:',
				e?.response?.data || e
			);
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

	const [startLoad, setStartLoad] = useState(false);
	const [endLoad, setEndLoad] = useState(false);

	const sentStartWorkPhoto = async (e: any) => {
		if (!e.target.files[0]) return;

		setStartLoad(true);
		const os = formData.qr_code;
		const originalFile = e.target.files[0];

		try {
			// 1. Comprimir imagem
			const compressedFile = await imageCompression(originalFile, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1024,
				useWebWorker: true,
			});

			// 2. Converter para JPG usando canvas
			const convertToJPG = async (file: File): Promise<File> => {
				const imageBitmap = await createImageBitmap(file);
				const canvas = document.createElement('canvas');
				canvas.width = imageBitmap.width;
				canvas.height = imageBitmap.height;

				const ctx = canvas.getContext('2d');
				if (!ctx) throw new Error('Erro ao obter contexto do canvas');
				ctx.drawImage(imageBitmap, 0, 0);

				return new Promise((resolve) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) throw new Error('Erro ao converter imagem para JPG');
							const newFile = new File([blob], 'foto.jpg', {
								type: 'image/jpeg',
							});
							resolve(newFile);
						},
						'image/jpeg',
						0.9
					); // qualidade de 0.9
				});
			};

			const finalFile = await convertToJPG(compressedFile);

			// 3. Enviar
			const data = new FormData();
			data.append('file', finalFile);

			const response = await api.post(
				`order/start-work-photo?id=${id || ''}&os=${os}`,
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			await Promise.all([
				setWorkImages((prev) => ({
					...prev,
					startWork: response.data.file,
				})),
				id
					? saveOrder(undefined, undefined, undefined, response.data.file)
					: Promise.resolve(),
			]);
		} catch (error) {
			console.error(error);
		} finally {
			setStartLoad(false);
		}
		setStartLoad(false);
	};

	const sentEndWorkPhoto = async (e: any) => {
		if (!e.target.files[0]) return;

		setEndLoad(true);
		const os = formData.qr_code;
		const originalFile = e.target.files[0];

		try {
			// 1. Comprimir imagem
			const compressedFile = await imageCompression(originalFile, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1024,
				useWebWorker: true,
			});

			// 2. Converter para JPG usando canvas
			const convertToJPG = async (file: File): Promise<File> => {
				const imageBitmap = await createImageBitmap(file);
				const canvas = document.createElement('canvas');
				canvas.width = imageBitmap.width;
				canvas.height = imageBitmap.height;

				const ctx = canvas.getContext('2d');
				if (!ctx) throw new Error('Erro ao obter contexto do canvas');
				ctx.drawImage(imageBitmap, 0, 0);

				return new Promise((resolve) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) throw new Error('Erro ao converter imagem para JPG');
							const newFile = new File([blob], 'foto.jpg', {
								type: 'image/jpeg',
							});
							resolve(newFile);
						},
						'image/jpeg',
						0.9
					);
				});
			};

			const finalFile = await convertToJPG(compressedFile);

			// 3. Enviar
			const data = new FormData();
			data.append('file', finalFile);

			const response = await api.post(
				`order/end-work-photo?id=${id || ''}&os=${os}`,
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			// 4. Atualizar estado e salvar
			await Promise.all([
				setWorkImages((prev) => ({ ...prev, endWork: response.data.file })),
				setFormData((prev) => ({ ...prev, status: 2 })),
				saveOrder(undefined, response.data.file, '2'),
			]);
		} catch (error) {
			console.error(error);
		} finally {
			setEndLoad(false);
		}
	};
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (hasOS && inputRef.current) {
			inputRef.current.focus();
		}
	}, [hasOS]);

	const normalizeRegisterDay = (value?: string) => {
		if (!value) return null;

		const parsedBrDate = parse(value, 'dd/MM/yyyy HH:mm', new Date());
		if (!isNaN(parsedBrDate.getTime())) {
			return parsedBrDate.toISOString();
		}

		const date = new Date(value);
		return isNaN(date.getTime()) ? null : date.toISOString();
	};

	const formatRegisterDayForDisplay = (value?: string) => {
		if (!value) return '';
		const date = new Date(value);
		return isNaN(date.getTime()) ? '' : format(date, 'dd/MM/yyyy HH:mm');
	};

	const handleRegisterDayChange = (value: string) => {
		let formattedValue = value.replace(/\D/g, '').slice(0, 12);

		if (formattedValue.length > 2) {
			formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
		}
		if (formattedValue.length > 5) {
			formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5)}`;
		}
		if (formattedValue.length > 10) {
			formattedValue = `${formattedValue.slice(0, 10)} ${formattedValue.slice(10)}`;
		}
		if (formattedValue.length > 13) {
			formattedValue = `${formattedValue.slice(0, 13)}:${formattedValue.slice(13)}`;
		}

		setFormData((prev) => ({
			...prev,
			registerDay: formattedValue,
		}));
	};

	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
	});

	async function getCoordinatesFromAddress() {
		try {
			const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}`;
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
					fullAddress
				)}&key=${GOOGLE_MAPS_API_KEY}`
			);
			const data = await response.json();
			if (data.results.length > 0) {
				const location = data.results[0].geometry.location;
				setCoordinates({ lat: location.lat, lng: location.lng });
			}
		} catch (error) {
			console.error('Erro ao buscar coordenadas:', error);
		}
	}

	useEffect(() => {
		if (formData.address) {
			getCoordinatesFromAddress();
		}
	}, [formData]);

	return (
		<div className="mt-3" >
			<div className="d-flex justify-content-between align-items-center mb-5">
				<div className="header-page">
					<h3 className="mb-0">Lista de OS</h3>
					<p>Ordem de Serviço / Lista</p>
				</div>

				<div className="d-flex gap-2">
					<button
						type="submit"
						form="orderForm"
						className="btn btn-primary"
						disabled={isSaving}
					>
						{isSaving ? "Salvando..." : "Salvar"}
					</button>

					<a href="/orders" className="btn btn-secondary">
						Voltar
					</a>

					<button type="button" className="btn btn-primary">
						Visualizar
					</button>
				</div>
			</div>

			<div className="card form-container p-3 pb-3 mb-5 ">
				{openToast && <Toast success={success} />}
				{/* {openEnd && } */}
				<div className="card-body row">
					<form id="orderForm" onSubmit={saveOrder}>
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
						<div className="row">
							<div className="col-md-6 ">
								<div className="row">
									<div className="mb-3 col-2 col-md-2 d-none">
										<label htmlFor="exampleInputEmail1" className="form-label">
											Poste
										</label>
										<input
											type="text"
											className="form-control"
											id="qr_code"
											// value={formData.qr_code}
											inputMode="numeric"
											maxLength={7}
											ref={inputRef}
											onChange={(e) => {
												const reg = new RegExp(/^\d*$/);
												if (reg.test(e.target.value)) {
													setFormData((prev) => ({
														...prev,
														[e.target.id]: `${e.target.value}`,
													}));
												}
											}}
										/>
										{hasOS && <p className="text-danger">OS não inserida</p>}
									</div>
									<div className="mb-3 col-7 col-md-7">
										<label htmlFor="exampleInputEmail1" className="form-label">
											Número da OS
										</label>
										<input
											type="text"
											className="form-control"
											id="qr_code"
											value={formData.qr_code}
											inputMode="numeric"
											maxLength={7}
											ref={inputRef}
											onChange={(e) => {
												const reg = new RegExp(/^\d*$/);
												if (reg.test(e.target.value)) {
													setFormData((prev) => ({
														...prev,
														[e.target.id]: `${e.target.value}`,
													}));
												}
											}}
										/>
										{hasOS && <p className="text-danger">OS não inserida</p>}
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
									<div className="mb-3 col-3">
										<label htmlFor="exampleInputEmail1" className="form-label">
											Status
										</label>
										<select
											id="status"
											value={formData.status ?? 0}
											className="form-control"
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													status: Number(e.target.value),
												}))
											}
										>
											<option value={0}>Aberto</option>
											<option value={1}>Em trabalho</option>
											<option value={2}>Finalizado</option>
										</select>
									</div>
									<div className="mb-3 col-3">
										<label htmlFor="exampleInputEmail1" className="form-label">
											Serviço
										</label>
										<select
											id="type"
											value={formData.type || 0}
											className="form-control"
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													[e.target.id]: e.target.value,
												}))
											}
										>
											<option value="0">Implantação</option>
											<option value="1">Reparo</option>
											<option value="2">Reparo Garantia</option>
											<option value="3">Vandalismo</option>

										</select>
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

									<OrderPhotos
										id={id}
										formData={formData}
										workImages={workImages}
										startLoad={startLoad}
										endLoad={endLoad}
										onStartPhoto={sentStartWorkPhoto}
										onEndPhoto={sentEndWorkPhoto}
										setOpenImage={setOpenImage}
										imageModalRef={imageModalRef}
									/>

									{services?.id && (
										<div className="mb-3 px-4">
											<div className="row alert alert-primary">
												<p>Informações do protocolo</p>
												<p className="col">Rua: {services.address}</p>
												<p className="col">Bairro: {services.neighborhood}</p>
												<p className="col">Cidade: {services.city}</p>
												<p className="col">Estado: {services.state}</p>
												<p className="col">Número do Poste: {services.numberPost}</p>
											</div>
										</div>
									)}
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
											value={formData.state || ""}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													state: e.target.value,
												}))
											}
										>
											<option value="" disabled>
												Selecione uma UF
											</option>

											{estadosBrasileiros.map((state, index) => (
												<option key={index} value={state.acronym}>
													{state.state}
												</option>
											))}
										</select>
									</div>
									{(accessLevel === 0 ||accessLevel === 99 )&& (
										<>

											<div className="mb-3 col-12 col-md-6">
												<label htmlFor="exampleInputEmail1" className="form-label">
													Data de Cadastro
												</label>
												<input
													type="text"
													className="form-control"
													id="registerDay"
													value={formData.registerDay || ''}
													inputMode="numeric"
													placeholder="dd/mm/aaaa hh:mm"
													onChange={(e) => handleRegisterDayChange(e.target.value)}
												/>
												<small className="text-muted">Formato: 21/04/2026 20:56</small>
											</div>

											<div className="mb-3 col-12 col-md-6">
												<label htmlFor="exampleInputEmail1" className="form-label">
													Latitude
												</label>
												<input
													type="text"
													className="form-control"
													id="lat"
													value={formData.lat}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															[e.target.id]: e.target.value,
														}))
													}
												/>
											</div>

											<div className="mb-3 col-12 col-md-6">
												<label htmlFor="exampleInputEmail1" className="form-label">
													Longitude
												</label>
												<input
													type="text"
													className="form-control"
													id="long"
													value={formData.long}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															[e.target.id]: e.target.value,
														}))
													}
												/>
											</div>
										</>
									)}

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
									<OrderKits
										kits={kits}
										selectedKit={selectedKit}
										setSelectedKit={setSelectedKit}
										listOfKits={listOfKits}
										kitAndQuantity={kitAndQuantity}
										onAddKit={handleKitList}
										onChangeQuantity={handleKitQuantity}
										onDeleteKit={(kitId) =>
											deleteKitOrder(kitId, parseInt(id || '0'))
										}
									/>

									<button
										disabled={isSaving}
										type="submit"
										className="btn btn-primary"
									>
										{isSaving ? 'Salvando' : 'Salvar'}
									</button>
								</div>
							</div>
							<div className="col-6 box p-5">

								<div>
									<div className="card-body">
										{isLoaded ? (
											coordinates ? (
												<div style={{ height: '20%', width: '100%' }}>
													<GoogleMap
														center={coordinates}
														zoom={16}
														mapContainerStyle={{ height: '100%', width: '100%' }}
														options={{
															disableDefaultUI: true, // Remove toda a UI (controles de zoom, etc.)
															draggable: false, // Impede arrastar
															zoomControl: false, // Impede zoom manual
															scrollwheel: false, // Impede zoom com o scroll do mouse
															disableDoubleClickZoom: true,
															gestureHandling: 'none', // Impede qualquer gesto
														}}
													>
														<Marker position={coordinates} />admin

													</GoogleMap>
												</div>
											) : (
												<p>Endereço não encontrado no mapa.</p>
											)
										) : (
											<p>Carregando mapa...</p>
										)}
												<div className="d-flex gap-4 mb-4">
													<img
														alt="logo da prefeitura"
														className="m-4"
														src="/src/assets/prefeitura_logo.png"
														height={70}
														width={50}
													/>
													<span className="flex-fill text-center">
							<h2 className="m-3 mt-5 fw-bolder">
								Ordem de Serviço #{formData.qr_code}
							</h2>
														{<p>Executado em {formData.registerDay}</p>}
						</span>
													<p className="m-4">{formData.today}</p>
												</div>

												<div className="m-3 row">

													<h4 className="">Endereço</h4>
													<hr />
													<div className="col-6 mt-2">
														<strong>Rua:</strong> {formData.address}
													</div>
													<div className="col-6 mt-2">
														<strong>Bairro:</strong> {formData.neighborhood}
													</div>
													<div className="col-6 mt-2">
														<strong>Município:</strong> {formData.city}
													</div>
													<div className="col-6 mt-2">
														<strong>UF:</strong> {formData.state}
													</div>
													<div className="col-md-6 mt-2">
														<strong>Latitude:</strong> {formData.lat}
													</div>
													<div className="col-6 mt-2">
														<strong>Longitude:</strong> {formData.long}
													</div>

													<h4 className="mt-4">Obs:</h4>
													<hr />
													<div className="mb-3">{formData.observations}</div>

													<h4 className="mt-4">Fotos</h4>
													<hr />
													<div className="mb-3 d-flex gap-4 justify-content-center">
							<span className="d-flex flex-column fw-bold align-items-center">
								{formData.photoStartWork && (
									<>
										<label className="mb-3">Inicio</label>
										<Image
											image={formData.photoStartWork}
											height="240px"
											orientation="from-image"
										/>
									</>
								)}
							</span>
														<span className="d-flex flex-column fw-bold align-items-center">
								{formData.photoEndWork && (
									<>
										<label className="mb-3">Fim</label>
										<Image
											image={formData.photoEndWork}
											height="240px"
											orientation="from-image"
										/>
									</>
								)}
							</span>
													</div>

													<h4 className="mt-4">Kit(s)</h4>
													<hr />
													<table className="mt-2">
														<tr>
															<th>Kit</th>
															<th>Materiais</th>
															<th className="text-center">Quantidade</th>
														</tr>

														{listOfKits.length > 0 && (
															<>
																{listOfKits.map((kit) => (
																	<tr>
																		<td>{kit.description}</td>
																		<td>
																			{kit?.materials?.map((material) => (
																				<div className="ms-3 my-2">
																					{material.material.description}
																				</div>
																			))}
																		</td>
																		<td className="text-center">
																			{kitAndQuantity.some((kq) => kq.kit_id === kit.id)
																				? kitAndQuantity.filter((k) => k.kit_id === kit.id)[0]
																					.quantity
																				: ''}
																		</td>
																	</tr>
																))}
															</>
														)}
													</table>
												</div>
											</div>

								</div>

							</div>
						</div>

					</form>
				</div>
				<ModalImage image={openImage} ref={imageModalRef} />
			</div>
		</div>

	);
}
