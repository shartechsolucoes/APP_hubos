import { BsFillPencilFill } from 'react-icons/bs';
import { Link } from 'react-router';
import './index.css';
import useAccessLevelStore from '../../../stores/accessLevelStore.ts';


export default function ListItemOrders({
		   title,
		   email,
		   access_level,
		   login,
		   id,
	   }: {
	title?: string;
	email?: string;
	access_level?: number;
	login?: string;
	id?: string;
}) {
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
	const { accessLevel } = useAccessLevelStore();
	return (
		<>
			<div className="" style={{borderBottom: "1px solid #f1efef"}}>
				<div className="row px-4 py-3">
					<div className="col-sm-6 col-md-4 d-flex justify-content-start align-items-center">
						<div className="d-flex justify-content-start align-items-center">
							{/*<img*/}
							{/*	alt="John Michael"*/}
							{/*	src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg"*/}
							{/*	className="img- img-thumbnail-small"*/}
							{/*/>*/}
							<div className="avatar-wrapper">
								<div className="avatar avatar-sm me-3">
									<span className="avatar-initial rounded-circle bg-label-dark ">ER</span>
								</div>
							</div>
							<div className="d-flex flex-column">
								<span
									className="fw-medium">{title}</span>
								<small className="text-truncate d-none d-sm-block">{email}</small>
							</div>
						</div>
					</div>
					<div className="col-sm-4 col-md-2 d-flex justify-content-start align-items-center">
						<a href="app-ecommerce-order-details.html"><span>{login}</span></a>
					</div>
					<div className="col-sm-4 col-md-2 d-flex justify-content-center align-items-center">
						<span className="text-truncate d-flex align-items-center text-heading">
							{access(access_level)}
						</span>
					</div>


					<div className="col-md-2 d-flex flex-column justify-content-start align-items-start">
						<div className="d-flex flex-column">
							<h6 className="text-nowrap mb-0"></h6>
							<small className="text-truncate d-none d-sm-block"> status </small>
						</div>
					</div>
					<div className="col-md-2 d-flex justify-content-end align-items-center gap-3">

						{accessLevel === 0 && (
							<Link to={`form?id=${id}`}>
								<BsFillPencilFill />
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
