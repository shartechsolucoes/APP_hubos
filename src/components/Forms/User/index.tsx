import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { useSearchParams } from 'react-router';
import InputMask from 'react-input-mask';

export default function UserForm() {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
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

	useEffect(() => {
		console.log(formData);
	}, [formData]);

	return (
		<>
			<div className="col-12">
				<div className="card mb-6">
					<div className="user-profile-header-banner">
						<img src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/profile-banner.png" alt="Banner image"
							 className="rounded-top img-fluid"/>
					</div>
					<div className="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-8">
						<div className="flex-shrink-0 mt-1 mx-sm-0 mx-auto">
							<img src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg" alt="user image"
								 className="d-block h-auto ms-0 ms-sm-6 rounded-3 user-profile-img"/>
						</div>
						<div className="flex-grow-1 mt-3 mt-lg-5">
							<div
								className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4">
								<div className="user-profile-info">
									<h4 className="mb-2 mt-lg-7">John Doe</h4>
									<ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 mt-4">
										<li className="list-inline-item"><i
											className="icon-base bx bx-palette me-2 align-top"></i><span
											className="fw-medium">UX Designer</span></li>
										<li className="list-inline-item"><i
											className="icon-base bx bx-map me-2 align-top"></i><span
											className="fw-medium">Vatican City</span></li>
										<li className="list-inline-item"><i
											className="icon-base bx bx-calendar me-2 align-top"></i><span
											className="fw-medium"> Joined April 2021</span></li>
									</ul>
								</div>
								<a href="javascript:void(0)" className="btn btn-primary mb-1"> <i
									className="icon-base bx bx-user-check icon-sm me-2"></i>Connected </a>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div className="row">
				<div className="col-md-3">
					<div className="card list-height overflow-y-auto pb-0 mb-5 bg_gray">
						<div className="card-header">
							<p className="card-title">Usuários</p>
						</div>
						<div className="card-body p-3"></div>
					</div>
				</div>
				<div className="col-md-9">
					<div className="card list-height overflow-y-auto p-3 pb-3 mb-3">
						<div className="card-header">
							<div className="d-flex gap-3">
								<img
									alt="John Michael"
									src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg"
									className="img-fluid img-thumbnail"
								/>
								<div className="align-content-center">
									<p className="card-title">{formData.name}</p>
									<p className="title">Administrador</p>
								</div>
							</div>

							<button type="submit" className="btn btn-primary">
								Salvar
							</button>
						</div>
					</div>
					<div className="card list-height overflow-y-auto p-3 pb-3 mb-3">
						<div className="card-header">
							<h3 className="card-title">Informações Basicas</h3>
						</div>
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
					<div className="card p-3 pb-3 mb-3">
					<div className="card-header">
						<h3 className="card-title">Trocar Senha</h3>
					</div>
					<div className="card-body">
						<div className="mb-3 col-md-12">
							<label htmlFor="login" className="form-label">
								Senha
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

						<div className="mb-3 col-md-12">
							<label htmlFor="login" className="form-label">
								Confiração de Senha
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
						<p className="card-title">Password requirements</p>
						<p>Please follow this guide for a strong password</p>

						<p>One special characters</p>
						<p>Min 6 characters</p>
						<p>One number (2 are recommended)</p>
						<p>Change it often</p>
					</div>
				</div>
				</div>
			</div>
		</>
	);
}
