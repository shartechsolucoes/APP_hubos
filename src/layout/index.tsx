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
	const [level, setLevel] = useState(localStorage.getItem('accessLevel') || '');
	const [name, setName] = useState(localStorage.getItem('userName') || '');
	const [id, setId] = useState(localStorage.getItem('userId') || '');

	useEffect(() => {
		setToken(localStorage.getItem('token') || '');
		setLevel(localStorage.getItem('accessLevel') || '');
		setName(localStorage.getItem('userName') || '');
		setId(localStorage.getItem('userId') || '');
		if (!token) {
			navigate('/login');
		}

		handleAccessLevel(parseInt(level || ''));
		handleUserName(name);
		handleUserId(id);
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
								<div className="content-wrapper">
									<div className="container-xxl flex-grow-1 container-p-y">
										<div className="row">
											<Outlet />
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
