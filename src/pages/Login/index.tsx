import { useNavigate } from 'react-router';
import './styles.css';
import { api } from '../../api';
import { useState } from 'react';
import useAccessLevelStore from '../../stores/accessLevelStore';

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
		<>
			<div className="container-xxl">
				<div className="authentication-wrapper authentication-basic container-p-y">
					<div className="authentication-inner">
						<div className="card">
							<div className="card-body">
								<div className="mt-2 mb-4 text-center">
									<img
										src="/public/assets/logo.png"
										className="w-25 justify-content-center m-auto"
									/>
								</div>
								<h4 className="mb-4 text-center">Bem vindo de volta! 👋</h4>
								{/*<p className="mb-4">Please sign-in to your account and start the adventure</p>*/}
								<form className="w-100" onSubmit={handleLogin}>
									<div className="mb-3">
										<label htmlFor="email" className="form-label">
											Usuário
										</label>
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
										<label htmlFor="email" className="form-label">
											Senha
										</label>
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
										<div className="msg-error">
											{error && 'Login ou Senha errado'}
										</div>
									</div>
									<div className="mb-3 d-flex w-100 justify-content-between align-items-center">
										<button
											type="submit"
											className="btn btn-primary d-grid w-100"
										>
											Entrar
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
