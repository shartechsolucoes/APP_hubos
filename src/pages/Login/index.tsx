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
	const { handleAccessLevel } = useAccessLevelStore();

	const handleLogin = async (e: any) => {
		try {
			e.preventDefault();
			const { login, password } = formData;
			const response = await api.post('/login', { login, password });
			const { token } = response.data;
			localStorage.setItem('token', token);
			localStorage.setItem('accessLevel', response.data.access_level);
			handleAccessLevel(response.data.access_level);
			navigate('/');
			setError(false);
		} catch (error) {
			setError(true);
			console.error(error);
		}
	};

	return (
		<div className="login flex row align-items-center justify-content-center">
			<h2 className="logo d-none d-md-block">
				<b>HUB</b>OS
			</h2>
			<div className="col-md-6 col-lg-4 col-xl-3 col-sm-6 h-30 box">
				<div className="m-3 h-30 card overflow-hidden p-5">
					<h2 className="text-center p-2 d-block d-md-none">
						<b>HUB</b>OS
					</h2>
					<h2 className="text-center p-2">
						<b>Login</b>
					</h2>
					<p className="m-0 mb-5 text-center">Bem vindo de volta.</p>

					<div className="h-100 w-100 d-flex">
						<form className="w-100" onSubmit={handleLogin}>
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
								{error && 'Login ou Senha errado'}
							</div>
							<div className="mb-3 d-flex w-100 justify-content-between align-items-center">
								<button type="submit" className="btn w-100">
									Entrar
								</button>
							</div>
						</form>
					</div>
				</div>
				<p className="text-end shartech">
					Desenvolvido por <strong>Shartech</strong>
				</p>
			</div>
		</div>
	);
}

export default Login;
