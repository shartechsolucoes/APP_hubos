import { useState } from 'react';
import './styles.css';
import { FaSearch } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import useAccessLevelStore from '../../stores/accessLevelStore';

export default function Navbar() {
	const navigate = useNavigate();
	const { userName } = useAccessLevelStore();
	const [toggleDropdown, setToggleDropdown] = useState(false);
	const toggleMenu = () => {
		const r = document.documentElement;
		r.style.cssText = '--menu-position: 0vw;';
		// 	const r = document.getElementsByClassName('menu')[0];
		// r.classList.add('navbar-toggle');
	};

	// let expand;

	const logOut = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};
	return (
		<>
			<nav
				className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
				id="layout-navbar"
			>
				<div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
					<a
						className="nav-item nav-link px-0 me-xl-4 d-xl-none"
						onClick={toggleMenu}
					>
						<i className="bx bx-menu bx-sm ">
							<IoMenu />
						</i>
					</a>
				</div>

				<div
					className="navbar-nav-right d-flex align-items-center"
					id="navbar-collapse"
				>
					<div className="navbar-nav align-items-center">
						<div className="nav-item d-flex align-items-center">
							<FaSearch />

							<input
								type="text"
								className="form-control border-0 shadow-none"
								placeholder="Search..."
								aria-label="Search..."
							/>
						</div>
					</div>

					<ul className="navbar-nav flex-row align-items-center ms-auto">
						<li className="nav-item lh-1 me-3"></li>

						<li className="nav-item navbar-dropdown dropdown-user dropdown">
							<a
								className="nav-link dropdown-toggle hide-arrow"
								data-bs-toggle="dropdown"
								onClick={() => setToggleDropdown((prev) => !prev)}
							>
								<div className="avatar avatar-online">
									<img
										src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg"
										className="w-px-40 h-auto rounded-circle"
									/>
								</div>
							</a>

							<ul
								className={`dropdown-menu dropdown-menu-end drop-menu ${
									toggleDropdown && 'show'
								}`}
							>
								{/* <li>
									<a className="dropdown-item" href="#">
										<div className="d-flex">
											<div className="flex-shrink-0 me-3">
												<div className="avatar avatar-online">
													<img
														src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg"
														className="w-px-40 h-auto rounded-circle"
													/>
												</div>
											</div>
											<div className="flex-grow-1">
												<span className="fw-semibold d-block">John Doe</span>
												<small className="text-muted">Admin</small>
											</div>
										</div>
									</a>
								</li>
								<li>
									<div className="dropdown-divider"></div>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										<i className="bx bx-user me-2"></i>
										<span className="align-middle">My Profile</span>
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										<i className="bx bx-cog me-2"></i>
										<span className="align-middle">Settings</span>
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										<span className="d-flex align-items-center align-middle">
											<i className="flex-shrink-0 bx bx-credit-card me-2"></i>
											<span className="flex-grow-1 align-middle">Billing</span>
											<span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
												4
											</span>
										</span>
									</a>
								</li>
								<li>
									<div className="dropdown-divider"></div>
								</li> */}
								<li>
									<div className="dropdown-item">
										<i className="bx bx-power-off me-2"></i>
										<span className="align-middle">{userName}</span>
									</div>
								</li>
								<li>
									<div className="dropdown-divider"></div>
								</li>
								<li>
									<a className="dropdown-item" onClick={logOut}>
										<i className="bx bx-power-off me-2"></i>
										<span className="align-middle">Sair</span>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
			{/*<h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light"></span>{paths(pathname)}*/}
			{/*</h4>*/}
		</>
	);
}
