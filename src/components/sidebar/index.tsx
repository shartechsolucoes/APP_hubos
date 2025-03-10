import {NavLink} from 'react-router';
import { privateRoutes } from '../../routes/PrivateRoutes';
import './styles.css';
import useAccessLevelStore from '../../stores/accessLevelStore';
import Navbar from 'react-bootstrap/Navbar';
import {
	MdDashboard,
	MdSupervisorAccount,
	MdSubject,
	MdOutlineQrCode2,
	MdOutlineHandyman,
	MdHardware,
	MdDocumentScanner

} from "react-icons/md";
import {IoIosArrowBack} from "react-icons/io";

export default function Sidebar() {
	const { accessLevel } = useAccessLevelStore();
	function icons(icon: string) {
		switch (icon) {
			case 'dashboard':
				return <MdDashboard className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'order':
				return <MdDocumentScanner className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'kits':
				return <MdOutlineHandyman className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'tag':
				return <MdOutlineQrCode2 className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'materials':
				return <MdHardware className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'users':
				return <MdSupervisorAccount className="menu-icon tf-icons bx bx-home-circle"/>;
			case 'version':
				return <MdSubject className="menu-icon tf-icons bx bx-home-circle"/>;
			default:
				return <MdSubject className="menu-icon tf-icons bx bx-home-circle"/>;
		}
	}

	return (

		<>
			{[ 'md'].map((expand) => (
				// <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
				<Navbar key={expand} expand={expand} className="layout-menu menu-vertical menu bg-menu-theme">

					<div className="app-brand">
						<a href="#" className="app-brand-link">
							<span className="app-brand-logo demo">

							</span>
							<span className="app-brand-text demo menu-text fw-bolder ms-2">HubOS</span>
						</a>

						<a className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
							<IoIosArrowBack className="bx bx-chevron-left bx-sm align-middle"/>
						</a>
					</div>
					<div className="menu-inner-shadow"></div>
					<ul className="menu-inner py-1 pt-5">
						{/*<li className="menu-item">*/}
						{/*	<h5>Almirante Tamandaré</h5>*/}
						{/*</li>*/}

						{privateRoutes.map((route) => (
							<>
								{route?.access?.some((ac) => ac === accessLevel) && (
									<>
										<li className="menu-item">
											<NavLink
												className="menu-link menu-toggle"
												aria-current="page"
												to={route.path}
											>
											{icons(route.icon)}
											<div data-i18n="User interface">{route.name}</div>
											</NavLink>
										</li>
									</>


								)}
							</>
						))}
					</ul>

				</Navbar>
				// </aside>
			))}
		</>
	);
}
