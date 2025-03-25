import { useEffect, useState } from 'react';
import { api } from '../../../../../api';
import InputMask from 'react-input-mask';

export default function DataRegister({
	id,
	userData,
	updateData,
}: {
	id: string | null;
	userData: { [key: string]: any };
	updateData: () => void;
}) {
	const [passwordError, setPasswordError] = useState(false);
	const [formData, setFormData] = useState<{ [key: string]: any }>(userData);

	const handleUser = async (e: any) => {
		setPasswordError(false);
		e.preventDefault();
		const {
			access_level,
			confirmPassword,
			email,
			login,
			name,
			password,
			phone,
			address,
			neighborhood,
			state,
			city,
			status,
		} = formData;
		if (confirmPassword !== password) {
			setPasswordError(true);
			return;
		}
		try {
			if (id) {
				await api.put(`/user/${id}`, {
					access_level,
					email,
					login,
					name,
					phone,
					address,
					neighborhood,
					state,
					city,
					status,
				});
			} else {
				await api.post('/user', {
					access_level,
					email,
					login,
					password,
					name,
					phone,
					address,
					neighborhood,
					state,
					city,
					status,
				});
			}
			updateData();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setFormData(userData);
	}, [userData]);

	return (
		<div className="card list-height overflow-y-auto p-3 pb-3 my-3">
			<h5 className="card-header">Editar Dados</h5>
			<div className="card-body">
				<form onSubmit={handleUser} className="row">
					<div className="mb-3 col-md-12">
						<label htmlFor="name" className="form-label">
							Nome
						</label>
						<input
							type="text"
							className="form-control"
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						/>
					</div>

					<div className="mb-3 col-md-12">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="text"
							className="form-control"
							id="email"
							value={formData.email}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						/>
					</div>
					<div className="mb-3 col-md-6">
						<label htmlFor="email" className="form-label">
							Telefone
						</label>
						<InputMask
							mask="(99) 99999-9999"
							placeholder="(00) 00000-0000"
							className="form-control"
							id="phone"
							value={formData.phone}
							onChange={(e: any) =>
								setFormData((prev) => ({
									...prev,
									phone: e.target.value,
								}))
							}
						/>
					</div>

					<div className="mb-3 col-md-6">
						<label htmlFor="access_level" className="form-label">
							Status
						</label>
						<select
							className="form-select"
							aria-label="Default select example"
							id="status"
							value={
								formData.status === true || formData.status === '0' ? 0 : 1
							}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						>
							<option value="" selected disabled>
								Status
							</option>
							<option value="0">Ativo</option>
							<option value="1">Inativo</option>
						</select>
					</div>
					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
							Login
						</label>
						<input
							type="text"
							className="form-control"
							id="login"
							value={formData.login}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						/>
					</div>

					<div className="mb-3 col-md-6">
						<label htmlFor="access_level" className="form-label">
							Tipo de usuário
						</label>
						<select
							className="form-select"
							aria-label="Default select example"
							id="access_level"
							value={formData.access_level}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						>
							<option selected disabled>
								Acessos
							</option>
							<option value="0">Administrador</option>
							<option value="1">Administrativo</option>
							<option value="2">Funcionário</option>
							<option value="3">Externo</option>
						</select>
					</div>
					{!id && (
						<>
							<div className="mb-3 col-md-2">
								<label htmlFor="password" className="form-label">
									Senha
								</label>
								<input
									type="password"
									className="form-control"
									id="password"
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[e.target.id]: e.target.value,
										}))
									}
								/>
							</div>
							<div className="mb-3 col-md-2">
								<label htmlFor="password" className="form-label">
									Confirmar Senha
								</label>
								<input
									type="password"
									className="form-control"
									id="confirmPassword"
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[e.target.id]: e.target.value,
										}))
									}
								/>
								{passwordError && 'As senhas são diferentes'}
							</div>
						</>
					)}

					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
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
					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
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
					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
							Cidade
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
					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
							Estado
						</label>
						<input
							type="text"
							className="form-control"
							id="state"
							value={formData.state}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									[e.target.id]: e.target.value,
								}))
							}
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Salvar
					</button>
				</form>
			</div>
		</div>
	);
}
