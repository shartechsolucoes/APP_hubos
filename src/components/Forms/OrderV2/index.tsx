import { ChangeEvent, useEffect, useState } from 'react';
import { api } from '../../../api';
import { useNavigate, useSearchParams } from 'react-router';

import axios from 'axios';

import './styles.css';
import Toast from '../../Toast';
import useAccessLevelStore from '../../../stores/accessLevelStore';

import QRCode from './QRCode';
import StartPhoto from './StartPhoto';
import EndPhoto from './EndPhoto';
import DataForm from './DataForm';

export default function OrdersFormV2() {
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
	const [success, setSuccess] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const [isSaving, setSaving] = useState(false);
	const [addressError, setAddressError] = useState(false);
	const [screen, setScreen] = useState(1);

	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const route = useNavigate();

	// define the function that finds the users geolocation

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

	useEffect(() => {
		if (id && kits.length !== 0) {
			getOrder();
		}
	}, [kits]);

	const saveOrder = async (e?: any) => {
		e.preventDefault();
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
					status,
					observations,
					qr_code,
					ordersKits: kitAndQuantity,
					protocolNumber,
					photoEndWork: workImages.endWork,
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
		}
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
		saveOrder();
	};

	const screens = () => {
		switch (screen) {
			case 2:
				return (
					<DataForm
						isSaving={isSaving}
						saveOrder={(e) => console.log(e)}
						addressError={addressError}
					/>
				);
			case 3:
				return (
					<StartPhoto
						startWork={workImages.startWork}
						sentStartWorkPhoto={sentStartWorkPhoto}
					/>
				);
			case 4:
				return (
					<EndPhoto
						endWork={workImages.endWork}
						sentEndWorkPhoto={sentEndWorkPhoto}
					/>
				);

			default:
				return <QRCode handleValue={(e) => console.log(e)} />;
		}
	};

	return (
		<>
			<div className="d-flex justify-content-center mb-4">
				<button
					type="button"
					className="btn btn-success"
					onClick={() => setScreen(1)}
				>
					1
				</button>
				<button
					type="button"
					className="btn btn-success"
					onClick={() => setScreen(2)}
				>
					2
				</button>
				<button
					type="button"
					className="btn btn-success"
					onClick={() => setScreen(3)}
				>
					3
				</button>
				<button
					type="button"
					className="btn btn-success "
					onClick={() => setScreen(4)}
				>
					4
				</button>
			</div>
			<div className="card  form-container  p-3 pb-3 mb-5">
				{openToast && <Toast success={success} />}

				<div className="card-body row">{screens()}</div>
			</div>
		</>
	);
}
