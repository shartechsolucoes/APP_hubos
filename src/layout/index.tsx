import { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import './index.css';
import './default.css';
import { Outlet, useNavigate } from 'react-router';

import useAccessLevelStore from '../stores/accessLevelStore';

export default function Layout() {
	const navigate = useNavigate();
	const { handleAccessLevel, handleUserName, handleUserId } =
		useAccessLevelStore();
	const [token, setToken] = useState(localStorage.getItem('token') || '');

	const initializer = async () => {
		await setToken(localStorage.getItem('token') || '');
	};
	useEffect(() => {
		initializer();
		if (!token) {
			navigate('/login');
		}

		handleAccessLevel(parseInt(localStorage.getItem('accessLevel') || ''));
		handleUserName(localStorage.getItem('userName') || '');
		handleUserId(localStorage.getItem('userId') || '');
	}, []);

	return (
		<>
			{token && (
				<>
					<div className="layout-wrapper layout-content-navbar">
						<div className="layout-container">
							<Sidebar />
							<div className="layout-page">
								<Navbar />
								<Outlet />
								<div className="content-wrapper">
									<div className="container-xxl flex-grow-1 container-p-y">
										<div className="row">

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
