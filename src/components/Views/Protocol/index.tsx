import React, { useEffect, useRef, useState } from 'react';
import { BsFileEarmarkPdf } from 'react-icons/bs';
import { useSearchParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { api } from '../../../api';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

type User = {
	id: string;
	name: string;
};

type Protocol = {
	id?: number;
	protocolNumber: string;
	address: string;
	numberPost: number;
	neighborhood: string;
	city: string;
	state: string;
	observation: string;
	user: User;
};

// 🔑 Substitua isso pela sua chave da API
const GOOGLE_MAPS_API_KEY = 'AIzaSyCLYeK1ksPfWhPxgZZ687Vdi-eDFLFRCr0';

export default function ProtocolView() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	const [formData, setFormData] = useState<Protocol>({
		protocolNumber: '',
		address: '',
		numberPost: 0,
		neighborhood: '',
		city: '',
		state: '',
		observation: '',
		user: { id: '', name: '' },
	});

	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
	});

	async function getProtocol() {
		try {
			const response = await api.get(`services/${id}`);
			setFormData(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	async function getCoordinatesFromAddress(address: string) {
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
		if (id) {
			getProtocol();
		}
	}, []);

	useEffect(() => {
		if (formData.address) {
			getCoordinatesFromAddress(formData.address);
		}
	}, [formData]);

	return (
		<>
			<div className="d-flex p-2 pt-0 justify-content-end gap-3">
				<button type="button" onClick={() => reactToPrintFn()} className="btn">
					<BsFileEarmarkPdf /> Baixar PDF
				</button>
			</div>
			<div className="card p-3 pb-3 mb-5">
				<div className="card-body" ref={contentRef}>
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
								Numero do protocolo #{formData.protocolNumber}
							</h2>
						</span>
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

						<h4 className="mt-4">Obs:</h4>
						<hr />
						<div className="mb-3">{formData.observation}</div>

						<h4 className="mt-4">Localização no Mapa</h4>
						<hr />
						<div className="col-12 mt-2">
							{isLoaded ? (
								coordinates ? (
									<div style={{ height: '300px', width: '100%' }}>
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
											<Marker position={coordinates} />
										</GoogleMap>
									</div>
								) : (
									<p>Endereço não encontrado no mapa.</p>
								)
							) : (
								<p>Carregando mapa...</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
