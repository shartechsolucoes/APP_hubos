import React, { useEffect, useState } from 'react';
import { api } from '../../../api';
import { useSearchParams } from 'react-router';

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

export default function ProtocolForm() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: id === 'numberPost' ? parseInt(value) : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) {
			api.post('services', formData);
			return;
		}
		api.put(`services/${id}`, formData);
		// Aqui você pode enviar os dados para uma API ou serviço
	};

	async function getProtocol() {
		try {
			const response = await api.get(`services/${id}`);
			setFormData(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (id) {
			getProtocol();
		}
	}, []);

	return (
		<div className="container card p-4 mt-4">
			<form className="card-body row" onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="protocolNumber" className="form-label">
						Número do Protocolo
					</label>
					<input
						type="text"
						className="form-control"
						id="protocolNumber"
						value={formData.protocolNumber}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="address" className="form-label">
						Endereço
					</label>
					<input
						type="text"
						className="form-control"
						id="address"
						value={formData.address}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="numberPost" className="form-label">
						Número
					</label>
					<input
						type="number"
						className="form-control"
						id="numberPost"
						value={formData.numberPost}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="neighborhood" className="form-label">
						Bairro
					</label>
					<input
						type="text"
						className="form-control"
						id="neighborhood"
						value={formData.neighborhood}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="city" className="form-label">
						Cidade
					</label>
					<input
						type="text"
						className="form-control"
						id="city"
						value={formData.city}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="state" className="form-label">
						Estado
					</label>
					<input
						type="text"
						className="form-control"
						id="state"
						value={formData.state}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 col-12">
					<label htmlFor="observation" className="form-label">
						Observações
					</label>
					<textarea
						className="form-control"
						id="observation"
						rows={6}
						value={formData.observation}
						onChange={handleChange}
					></textarea>
				</div>

				<button type="submit" className="btn btn-primary">
					Salvar
				</button>
			</form>
		</div>
	);
}
