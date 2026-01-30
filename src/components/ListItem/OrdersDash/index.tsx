import './order.css';
import {
	BsFillPencilFill,
	BsEyeFill,
	BsFillTrashFill,
} from 'react-icons/bs';
import { Link } from 'react-router';
import useAccessLevelStore from '../../../stores/accessLevelStore';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

import Status from '../../StatusOS/';
import Image from '../../Forms/Image';
import {IoDuplicate} from "react-icons/io5";

export default function ListItemOrders({
										   id,
										   qrcode,
										   address,
										   neighborhood,
										   city,
										   state,
										   active,
										   status,
										   date,
										   deleteListItem,
										   duplicateItem,
										   kit,
										   duplicated,
										   userName,
										   userPicture,
									   }: {
	qrcode?: string;
	address?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	active?: number;
	status: number;
	id?: string | number;
	date: Date;
	deleteListItem?: () => void;
	duplicateItem?: () => void;
	kit?: string;
	duplicated?: string;
	userName?: string;
	userPicture?: string;
}) {
	const { accessLevel } = useAccessLevelStore();
	const formattedDate = date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : '';
	const formattedTime = date
		? formatInTimeZone(date, 'UTC', 'HH:mm', { locale: ptBR })
		: '';
	function pegarPrimeirasLetras(completeName = '') {
		if (!completeName) {
			return '';
		}
		if (!completeName.includes(' ')) {
			return completeName[0];
		}
		const [primeiroNome, sobrenome] = completeName.split(' ');
		return primeiroNome[0] + sobrenome[0];
	}

	return (
		<>
			<div
				className={`card mb-2 order 
				${duplicated ? "duplicated" : ""} 
				${active === 0 ? "inactive" : ""}`}
			>
				<div className="row">
					<div className="col-12 col-sm-4 col-md-2 qrcode">
						<p>{qrcode}</p>
						<Status statusOS={status} />
					</div>
					<div className="col-12 col-sm-6 col-md-3 d-flex justify-content-center align-items-center">
						<div>
							<h6 className=" mb-0">{address}</h6>
							<small className="text-truncate">
								{neighborhood} - {city}/{state}
							</small>
						</div>
					</div>
					<div className="col-12 col-sm-1 d-flex justify-content-center align-items-center">
						<p className='day'>
							{(	accessLevel === 0 ||
								accessLevel === 99) && (
								formattedTime
							)}
							<br/>
							{ formattedDate}
						</p>
					</div>
					<div className="col-12 col-sm-2 d-flex justify-content-center align-items-center">
						{kit}
					</div>
					<div className="col-12 col-sm-2 d-flex justify-content-center align-items-center">
						<div className="avatar-wrapper">
							<div className="avatar avatar-sm me-3">
              <span className="avatar-initial rounded-circle bg-label-dark overflow-hidden">
                {userPicture ? (
					<Image image={userPicture} />
				) : (
					<span>{pegarPrimeirasLetras(userName)}</span>
				)}
              </span>
							</div>
						</div>
						<div className="d-flex flex-column">
							<span className="fw-medium">{userName}</span>
						</div>
					</div>
					<div className="col-12 col-sm-2 d-flex justify-content-center align-items-center gap-1 ">
						{(accessLevel === 2 ||
							accessLevel === 1 ||
							accessLevel === 0 ||
							accessLevel === 99) && (
							<Link to={`orders/view?id=${id}`} className="">
								<BsEyeFill />
							</Link>
						)}

						{(accessLevel === 0 ||
							(accessLevel === 2 && status !== 2) ||
							accessLevel === 99) && (
							<Link to={`orders/form?id=${id}`}>
								<BsFillPencilFill />
							</Link>
						)}

						{(accessLevel === 99) && (
							<a className="" onClick={deleteListItem}>
								<BsFillTrashFill />
							</a>
						)}
						{(accessLevel === 99) && (
							<a className="" onClick={duplicateItem}>
								<IoDuplicate />
							</a>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
