import React, { useEffect, useState } from 'react';
import { api } from '../../../api';
import { useNavigate, useSearchParams } from 'react-router';
import Toast from '../../Toast';
import { estadosBrasileiros } from '../Orders/data';
import useAccessLevelStore from '../../../stores/accessLevelStore';

type Protocol = {
	id?: number;
	protocolNumber: string;
	address: string;
	numberPost: number;
	neighborhood: string;
	city: string;
	state: string;
	observation: string;
	orderId: number | null;
	userId?: string;
};

export default function ProtocolForm() {
	const route = useNavigate();
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
		orderId: null,
		userId: '',
	});

	const { accessLevel } = useAccessLevelStore();

	const [users, setUsers] = useState<
		Array<{
			name: string;
			id: string;
			login: string;
			access_level: number;
			email: string;
			status: boolean;
			picture: string;
		}>
	>([]);

	const [errors, setErrors] = useState<{
		protocolNumber?: string;
		address?: string;
		neighborhood?: string;
		city?: string;
		state?: string;
	}>({});

	const [openToast, setOpenToast] = useState(false);
	const [success, setSuccess] = useState(true);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: id === 'numberPost' ? parseInt(value) : value,
		}));

		// Limpa o erro ao digitar
		setErrors((prev) => ({ ...prev, [id]: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: any = {};
		if (!formData.protocolNumber.trim()) {
			newErrors.protocolNumber = 'O número do protocolo é obrigatório.';
		}
		if (!formData.address.trim()) {
			newErrors.address = 'O endereço é obrigatório.';
		}
		if (!formData.neighborhood.trim()) {
			newErrors.neighborhood = 'O bairro é obrigatório.';
		}
		if (!formData.city.trim()) {
			newErrors.city = 'A cidade é obrigatória.';
		}
		if (!formData.state.trim()) {
			newErrors.state = 'O estado é obrigatório.';
		}

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		try {
			if (!id) {
				await api.post('services', formData);
				setSuccess(true);
				setSuccessMsg('Protocolo criado com sucesso!');
			} else {
				await api.put(`services/${id}`, formData);
				setSuccess(true);
				setSuccessMsg('Protocolo atualizado com sucesso!');
			}

			setOpenToast(true);
			setTimeout(() => {
				setOpenToast(false);
				setSuccessMsg('');
				setErrorMsg('');
				route('/protocol'); // ✅ redireciona apenas em caso de sucesso
			}, 1300);
		} catch (error) {
			console.error(error);
			setSuccess(false);
			setErrorMsg('Erro ao salvar os dados do protocolo.');
			setOpenToast(true);
			setTimeout(() => {
				setOpenToast(false);
				setSuccessMsg('');
				setErrorMsg('');
			}, 1300);
		}
	};

	useEffect(() => {
		if (id) {
			getProtocol();
			getUsers();
		}
	}, []);

	async function getProtocol() {
		try {
			const response = await api.get(`services/${id}`);
			setFormData(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	const getUsers = async () => {
		try {
			const response = await api.get('/users');
			setUsers(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container card p-4 mt-4">
			<form className="card-body row" onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="protocolNumber" className="form-label">
						Número do Protocolo
					</label>
					<input
						type="text"
						className={`form-control ${
							errors.protocolNumber ? 'is-invalid' : ''
						}`}
						id="protocolNumber"
						value={formData.protocolNumber}
						onChange={handleChange}
					/>
					{errors.protocolNumber && (
						<div className="invalid-feedback">{errors.protocolNumber}</div>
					)}
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="address" className="form-label">
						Endereço
					</label>
					<input
						type="text"
						className={`form-control ${errors.address ? 'is-invalid' : ''}`}
						id="address"
						value={formData.address}
						onChange={handleChange}
					/>
					{errors.address && (
						<div className="invalid-feedback">{errors.address}</div>
					)}
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="neighborhood" className="form-label">
						Bairro
					</label>
					<input
						type="text"
						className={`form-control ${
							errors.neighborhood ? 'is-invalid' : ''
						}`}
						id="neighborhood"
						value={formData.neighborhood}
						onChange={handleChange}
					/>
					{errors.neighborhood && (
						<div className="invalid-feedback">{errors.neighborhood}</div>
					)}
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="city" className="form-label">
						Cidade
					</label>
					<input
						type="text"
						className={`form-control ${errors.city ? 'is-invalid' : ''}`}
						id="city"
						value={formData.city}
						onChange={handleChange}
					/>
					{errors.city && <div className="invalid-feedback">{errors.city}</div>}
				</div>

				<div className="mb-3 col-12 col-md-6">
					<label htmlFor="state" className="form-label">
						Estado
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
					{errors.state && (
						<div className="invalid-feedback">{errors.state}</div>
					)}
				</div>

				{accessLevel === 0 && (
					<div className="mb-3 col-12">
						<label htmlFor="state" className="form-label">
							Adicionar técnico
						</label>

						<select
							className="form-control"
							id="technic"
							value={formData.userId}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									userId: e.target.value,
								}))
							}
						>
							<option value={''} selected disabled>
								Selecione um técnico
							</option>
							{users
								.filter((user) => user.access_level === 2)
								.map((user, index) => (
									<option key={index} value={user.id}>
										{user.name}
									</option>
								))}
						</select>
					</div>
				)}

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
			{openToast && (
				<Toast success={success} msgSuccess={successMsg} msgError={errorMsg} />
			)}
		</div>
	);
}
