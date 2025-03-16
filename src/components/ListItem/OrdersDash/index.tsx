import { BsEyeFill, BsFillPencilFill } from 'react-icons/bs';
import { Link } from 'react-router';

import useAccessLevelStore from '../../../stores/accessLevelStore';

import Status from '../../StatusOS';

export default function ListItemOrders({
	address,
	id,
	qrcode,
	neighborhood,
	city,

	status,
	kit,
}: {
	qrcode?: string;
	address?: string;
	neighborhood?: string;
	city?: string;
	register?: string;
	state?: string;
	id?: string | number;
	status?: number;
	kit?: string;
}) {
	const { accessLevel } = useAccessLevelStore();
	// const date  = register ? format(register, "HH:mm:ss", {locale:ptBR} ): '';

	return (
		<>
			<div className="" style={{ borderBottom: '1px solid #f1efef' }}>
				<div className="row px-4 py-3">
					<div className="col-sm-4 col-md-1 d-flex justify-content-start align-items-center">
						<a href="app-ecommerce-order-details.html">
							<span>#{qrcode}</span>
						</a>
					</div>
					<div className="col-sm-4 col-md-1 d-flex justify-content-center align-items-center">
						<span className="text-truncate d-flex align-items-center text-heading">
							{kit}
						</span>
					</div>
					<div className="col-sm-6 col-md-2 d-flex justify-content-center align-items-center">
						<div className="d-flex justify-content-start align-items-center">
							<div className="avatar-wrapper">
								<div className="avatar avatar-sm me-3">
									<span className="avatar-initial rounded-circle bg-label-dark ">
										ER
									</span>
								</div>
							</div>
							<div className="d-flex flex-column">
								<span className="fw-medium">Edson Rodrigues</span>
							</div>
						</div>
					</div>

					<div className="col-md-4 d-flex flex-column justify-content-start align-items-start">
						<div className="d-flex flex-column">
							<h6 className="text-nowrap mb-0">{address}</h6>
							<small className="text-truncate d-none d-sm-block">
								{neighborhood} - {city}/
							</small>
						</div>
					</div>
					<div className="col-md-2 d-flex justify-content-center align-items-center">
						<Status statusOS={status} />
					</div>
					<div className="col-md-2 d-flex justify-content-end align-items-center gap-3">
						{accessLevel === 2 ||
							(accessLevel === 0 && (
								<Link to={`orders/view?id=${id}`}>
									<BsEyeFill />
								</Link>
							))}
						{accessLevel === 0 && (
							<Link to={`orders/form?id=${id}`}>
								<BsFillPencilFill />
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
