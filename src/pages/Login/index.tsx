import { useNavigate } from 'react-router';
import './login.css';
import { api } from '../../api';
import { useState } from 'react';
import useAccessLevelStore from '../../stores/accessLevelStore';
import { FaArrowRight } from 'react-icons/fa';

function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState<{ login: string; password: string }>(
		{ login: '', password: '' }
	);
	const {
		handleAccessLevel,
		handleUserName,
		handleUserId,
		handleUserAvatar,
		updateNavAvatar,
	} = useAccessLevelStore();

	const handleLogin = async (e: any) => {
		try {
			e.preventDefault();
			const { login, password } = formData;
			const response = await api.post('/login', { login, password });
			const { token } = response.data;
			localStorage.setItem('token', token);
			localStorage.setItem('accessLevel', response.data.access_level);
			localStorage.setItem('userName', response.data.userName);
			localStorage.setItem('userId', response.data.userId);
			if (response.data.picture) {
				localStorage.setItem('userAvatar', response.data.picture);
			}
			handleAccessLevel(response.data.access_level);
			handleUserName(response.data.userName);
			handleUserId(response.data.userId);
			handleUserAvatar(response.data.picture);
			updateNavAvatar();
			navigate('/');
			setError(false);
		} catch (error) {
			setError(true);
			console.error(error);
		}
	};

	return (
		<div className="container-fluid login h-100 p-0">
			<div className="row">
				<div className="full-height col-12 col-md-5 container__cadastro d-flex align-items-center">
					<div className="col-12 text-center">
						<div className="navbar-wrapper-login">
							<div className="m-header">
								<a className="b-brand" href="">
									<img src="/public/assets/logo.png" width="90"/>
								</a>
							</div>
							<div className="navbar-content next-scroll"></div>
						</div>
						{/*<h4 className="title">Para quem já é nosso cliente</h4>*/}
						<form onSubmit={handleLogin}>
							<div className="mb-3">
								<input
									type="text"
									className="form-control"
									id="login"
									placeholder="Seu usuário"
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[e.target.id]: e.target.value,
										}))
									}
								/>
							</div>
							<div className="mb-3">
								<input
									type="password"
									className="form-control"
									id="password"
									placeholder="Sua senha"
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[e.target.id]: e.target.value,
										}))
									}
								/>
								{error && (
									<div className="msg-error">
										Login ou Senha errado
									</div>
								)}
							</div>
							<div className="mb-3 d-flex w-100 justify-content-between align-items-center">
								<button
									type="submit"
									className="btn btn-primary d-grid w-100 d-flex gap-3 align-items-center justify-content-center btn-login"
								>
									Continuar <FaArrowRight />
								</button>
							</div>
							<p className="mt-4"></p>
							<h5>
								Ainda não tem uma conta?{' '}
								<a href="https://api.whatsapp.com/send?phone=5541996565771" target="_blank">
									Fale com a gente
								</a>
							</h5>

							<p>
								<i className="bi bi-lock margem_direita"></i>Desenvolvido por
								<a href="https://www.shartech.com.br" target="_blank"> Shartech</a>
								<br />© 2021-2025
							</p>
						</form>
					</div>
				</div>
				<div className="full-height col-12 col-md-7 text-start container__display d-flex align-items-center">
					<div className="card-login d-flex align-items-center">
						<div className="col-12 col-xl-8">
							<h2 className="text-white">
								Digite seus dados para acessar o Sistema e gerenciar sua rede de iluminação pública de forma inteligente e integrada.
							</h2>

							<h4 className="mt-5 mb-3 text-white">
								Com o GeoOS, você pode:
							</h4>
							<p>
								Visualizar e acompanhar ordens de serviço no mapa;
							</p>
							<p>
								Monitorar o status das manutenções;
							</p>
							<p>
								Registrar ocorrências com fotos e detalhes;
							</p>
							<p>
								Otimizar a operação e reduzir custos.
							</p>
							<p>
								Com o GeoOS, você pode gerenciar toda a rede de iluminação pública de forma inteligente e integrada.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
