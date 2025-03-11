import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { useSearchParams } from 'react-router';
import InputMask from 'react-input-mask';
import './user.css';

export default function UserForm() {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const [passwordData, setPasswordData] = useState<{
		oldPassword: string;
		newPassword: string;
		confirmPassword: string;
	}>({ oldPassword: '', newPassword: '', confirmPassword: '' });
	const [passwordError, setPasswordError] = useState(false);
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

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
					password,
					name,
					phone,
				});
			} else {
				await api.post('/user', {
					access_level,
					email,
					login,
					password,
					name,
					phone,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getUser = async () => {
		const response = await api.get(`/user/${id}`);

		setFormData(response.data);
	};

	useEffect(() => {
		if (id) {
			getUser();
		}
	}, []);

	const setNewPassword = async () => {
		setPasswordError(false);
		const regex = new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{6,}$'
		);
		console.log(passwordData);
		console.log(regex.test(passwordData.newPassword));
		if (
			(passwordData.newPassword !== passwordData.confirmPassword &&
				!regex.test(passwordData.newPassword)) ||
			passwordData.oldPassword === '' ||
			passwordData.newPassword === ''
		) {
			setPasswordError(true);
			return;
		}

		console.log('passou');
		try {
			await api.put('reset-password', {
				userId: id,
				oldPassword: passwordData.oldPassword,
				newPassword: passwordData.newPassword,
			});
		} catch (error) {
			console.log(error);
			setPasswordError(true);
		}
	};
	function access(access_level: number | undefined) {
		switch (access_level) {
			case 0:
				return 'Administrador';
			case 1:
				return 'Administrativo';
			case 2:
				return 'Funcionário';
			case 3:
				return 'Externo';
			default:
				return '';
		}
	}

	return (
		<div className="row">
			<div className="col-xl-4 col-lg-5 order-1 order-md-0">
				<div className="card mb-6">
					<div className="card-body pt-12">
						<div className="user-avatar-section">
							<div className=" d-flex align-items-center flex-column">
								<img className="img-fluid rounded mb-4" src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/avatars/1.png"
									 height="120" width="120" alt="User avatar"/>
								<div className="user-info text-center">
									<h5>{formData.name}</h5>
									<span className="badge bg-label-secondary">{access(formData.access_level)}</span>
								</div>
							</div>
						</div>

						<h5 className="pb-4 border-bottom mb-4">Detalhes</h5>
						<div className="info-container">
							<ul className="list-unstyled mb-6">
								<li className="mb-2">
									<span className="h6">Username:</span>
									<span>{formData.login}</span>
								</li>
								<li className="mb-2">
									<span className="h6">Email:</span>
									<span>{formData.email}</span>
								</li>
								<li className="mb-2">
									<span className="h6">Telefone:</span>
									<span>{formData.status}</span>
								</li>

								<li className="mb-2">
									<span className="h6">Status:</span>
									<span>{formData.status}</span>
								</li>
								<li className="mb-2">
									<span className="h6">Endereço:</span>
									<span>{formData.status}</span>
								</li>
								<li className="mb-2">
									<span className="h6">Bairro:</span>
									<span>{formData.status}</span>
								</li>

								<li className="mb-2">
									<span className="h6">Cidade:</span>
									<span>{formData.status}</span>
								</li>
								<li className="mb-2">
									<span className="h6">Estado:</span>
									<span>{formData.status}</span>
								</li>



							</ul>
							<div className="d-flex justify-content-center">
								<a href="javascript:;" className="btn btn-primary me-4" data-bs-target="#editUser"
								   data-bs-toggle="modal">Edit</a>
								<a href="javascript:;" className="btn btn-label-danger suspend-user">Suspend</a>
							</div>
						</div>
					</div>
				</div>

			</div>
			<div className="col-xl-8 col-lg-7 order-0 order-md-1">
				<div className="nav-align-top mb-3">
					<ul className="nav nav-pills flex-column flex-md-row mb-6 flex-wrap row-gap-2">
						<li className="nav-item">
							<a className="nav-link active"><i
								className="icon-base bx bx-user icon-sm me-1_5"></i>Atividades</a>
						</li>
						<li className="nav-item">
							<a className="nav-link"><i
								className="icon-base bx bx-lock-alt icon-sm me-1_5"></i>Editar dados</a>
						</li>
						<li className="nav-item">
							<a className="nav-link"><i
								className="icon-base bx bx-detail icon-sm me-1_5"></i>Trocar Senha</a>
						</li>
					</ul>
				</div>

				<div className="card mb-6">
					<h5 className="card-header">Atividade</h5>
					<div className="card-body pt-1">
						<ul className="timeline mb-0">
							<li className="timeline-item timeline-item-transparent">
								<span className="timeline-point timeline-point-primary"></span>
								<div className="timeline-event">
									<div className="timeline-header mb-3">
										<h6 className="mb-0">OS N°12312312312</h6>
										<small className="text-body-secondary">10/12/2024 10:23</small>
									</div>
									<p className="mb-2">Rua Arnaldo gusi 44, Xaxim Curitiba/PR</p>
									<div className="d-flex align-items-center mb-2">
										<div className="badge bg-lighter rounded d-flex align-items-center">
											<span className="mb-0 text-body">Visualizar</span>
										</div>
									</div>
								</div>
							</li>
							<li className="timeline-item timeline-item-transparent">
								<span className="timeline-point timeline-point-primary"></span>
								<div className="timeline-event">
									<div className="timeline-header mb-3">
										<h6 className="mb-0">OS N°12312312312</h6>
										<small className="text-body-secondary">10/12/2024 10:23</small>
									</div>
									<p className="mb-2">Rua Arnaldo gusi 44, Xaxim Curitiba/PR</p>
									<div className="d-flex align-items-center mb-2">
										<div className="badge bg-lighter rounded d-flex align-items-center">
											<span className="mb-0 text-body">Visualizar</span>
										</div>
									</div>
								</div>
							</li>
							<li className="timeline-item timeline-item-transparent">
								<span className="timeline-point timeline-point-primary"></span>
								<div className="timeline-event">
									<div className="timeline-header mb-3">
										<h6 className="mb-0">OS N°12312312312</h6>
										<small className="text-body-secondary">10/12/2024 10:23</small>
									</div>
									<p className="mb-2">Rua Arnaldo gusi 44, Xaxim Curitiba/PR</p>
									<div className="d-flex align-items-center mb-2">
										<div className="badge bg-lighter rounded d-flex align-items-center">
											<span className="mb-0 text-body">Visualizar</span>
										</div>
									</div>
								</div>
							</li>

						</ul>
					</div>
				</div>
				<div>
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
								<button type="submit" className="btn btn-primary">
									Salvar
								</button>
							</form>
						</div>
					</div>
					{id && (
						<div className="card">
							<h5 className="card-header">Trocar Senha</h5>
							<div className="card-body">
								<div className="row">
									<div className="text-start col-md-7">
										<div className="mb-3 col-md-12">
											<label htmlFor="login" className="form-label">
												Antiga Senha
											</label>
											<input
												type="password"
												className="form-control"
												id="oldPassword"
												onChange={(e) =>
													setPasswordData((prev) => ({
														...prev,
														[e.target.id]: e.target.value,
													}))
												}
											/>
										</div>
										<div className="mb-3 col-md-12">
											<label htmlFor="login" className="form-label">
												Nova Senha
											</label>
											<input
												type="password"
												className="form-control"
												id="newPassword"
												onChange={(e) =>
													setPasswordData((prev) => ({
														...prev,
														[e.target.id]: e.target.value,
													}))
												}
											/>
										</div>

										<div className="mb-3 col-md-12">
											<label htmlFor="login" className="form-label">
												Confirmação de Senha
											</label>
											<input
												type="password"
												className="form-control"
												id="confirmPassword"
												onChange={(e) =>
													setPasswordData((prev) => ({
														...prev,
														[e.target.id]: e.target.value,
													}))
												}
											/>
											{passwordError && (
												<p className="text-danger">
													Senha não corresponde ou não contempla as regras{' '}
												</p>
											)}
										</div>
										<button
											type="button"
											className="btn btn-primary"
											id="password"
											onClick={setNewPassword}
										>
											Salvar
										</button>
									</div>

									<div className="text-end col-md-5">
										<div className="alert alert-warning alert-dismissible" role="alert">
											<h5 className="alert-heading mb-1">Guia para criação de senha forte</h5>
											<br></br>
											<span>Um caractere especial (!@#$%^&*(),./)</span><br></br>
											<span>Uma letra maiúscula</span><br></br>
											<span>Uma letra minuscula</span><br></br>
											<span>Mínimo 6 caracteres</span><br></br>
											<span>Um número (2 são recomendados)</span><br></br>
											<span>Mude com frequencia</span><br></br>
											<button type="button" className="btn-close" data-bs-dismiss="alert"
													aria-label="Close"></button>
										</div>

									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>


		</div>
	);
}
