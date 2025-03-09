import {
	BsFillPencilFill,
	BsEyeFill,
	BsFillTrashFill,
	BsCopy,
} from 'react-icons/bs';
import { Link } from 'react-router';
import useAccessLevelStore from '../../../stores/accessLevelStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Status from '../../StatusOS/';

export default function ListItemOrders({
										   id,
										   qrcode,
										   address,
										   neighborhood,
										   city,
										   state,
										   status,
										   date,
										   deleteListItem,
										   duplicateItem,
									   }: {
	qrcode?: string;
	address?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	status: number;
	id?: string | number;
	date: Date;
	deleteListItem?: () => void;
	duplicateItem?: () => void;
}) {
	const { accessLevel } = useAccessLevelStore();
	const formattedDate = date
		? format(date, 'dd/MM/yy', { locale: ptBR })
		: '';

	return (
		<>
			<div className="" style={{borderBottom: "1px solid #f1efef"}}>
				<div className="row px-4 py-3">
					<div className="col-sm-4 col-md-1 d-flex justify-content-start align-items-center">
						<a href="app-ecommerce-order-details.html"><span>#{qrcode}</span></a>
					</div>
					<div className="col-sm-4 col-md-1 d-flex justify-content-center align-items-center">
						<span className="text-truncate d-flex align-items-center text-heading">
						  {formattedDate}
						</span>

					</div>
					<div className="col-sm-6 col-md-2 d-flex justify-content-center align-items-center">
						<div className="d-flex justify-content-start align-items-center">
							<div className="avatar-wrapper">
								<div className="avatar avatar-sm me-3">
									<span className="avatar-initial rounded-circle bg-label-dark ">ER</span>
								</div>
							</div>
							<div className="d-flex flex-column">
								<span
									className="fw-medium">Edson Rodrigues</span>
							</div>
						</div>
					</div>

					<div className="col-md-4 d-flex flex-column justify-content-start align-items-start">
						<div className="d-flex flex-column">
							<h6 className="text-nowrap mb-0">{address}</h6>
							<small className="text-truncate d-none d-sm-block">{neighborhood} - {city}/{state}</small>
						</div>
					</div>
					<div className="col-md-2 d-flex justify-content-center align-items-center"><Status
						statusOS={status}/></div>
					<div className="col-md-2 d-flex justify-content-end align-items-center gap-3">{accessLevel === 2 ||
						(accessLevel === 0 && (
							<Link to={`view?id=${id}`}>
								<BsEyeFill/>
							</Link>
						))}

						{accessLevel === 0 && (
							<Link to={`form?id=${id}`}>
								<BsFillPencilFill/>
							</Link>
						)}
						{accessLevel === 2 && (
							<Link to={`view?id=${id}`}>
								<BsEyeFill />
							</Link>
						)}
						{accessLevel === 0 && (
							<a className="" onClick={deleteListItem}>
								<BsFillTrashFill />
							</a>
						)}
						{accessLevel === 0 && (
							<a className="" onClick={duplicateItem}>
								<BsCopy />
							</a>
						)}</div>
				</div>
			</div>

		</>
	);
}
