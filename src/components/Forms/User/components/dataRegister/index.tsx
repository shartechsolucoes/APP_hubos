import { useEffect, useState } from 'react';
import { api } from '../../../../../api';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router';
import useAccessLevelStore from '../../../../../stores/accessLevelStore';

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
	const route = useNavigate();
	const { avatar } = useAccessLevelStore();
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
		if (!validateEmail(email)) {
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
				updateData();
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
					picture: avatar,
				});
				route('/users');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const validateEmail = (email: any) => {
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return String(email).toLowerCase().match(emailRegex);
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
							required
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
							required
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

						{formData.email && !validateEmail(formData.email) && (
							<p className="text-danger mb-0">O email, não é valido</p>
						)}
					</div>
					<div className="mb-3 col-md-6">
						<label htmlFor="email" className="form-label">
							Telefone
						</label>
						<InputMask
							required
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
							name="status"
							required
							className="form-select"
							aria-label="Default select example"
							id="status"
							value={
								formData.status !== ''
									? formData.status === true || formData.status === '0'
										? 0
										: 1
									: ''
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
							required
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
							required
							name="access_level"
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
							<option selected disabled value="">
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
							<div className="mb-3 col-md-3">
								<label htmlFor="password" className="form-label">
									Senha
								</label>
								<input
									required
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
							<div className="mb-3 col-md-3">
								<label htmlFor="password" className="form-label">
									Confirmar Senha
								</label>
								<input
									required
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
								{passwordError && (
									<p className="text-danger mb-0">As senhas são diferentes</p>
								)}
							</div>
						</>
					)}

					<div className="mb-3 col-md-6">
						<label htmlFor="login" className="form-label">
							Endereço
						</label>
						<input
							required
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
							required
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
							required
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
							required
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
