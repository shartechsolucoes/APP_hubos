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
	const formattedTime = date
		? format(date, 'HH:mm', { locale: ptBR })
		: '';
	return (
		<tr>
			<td className="text-start align-content-center">
				<div className="d-flex gap-3 ">
					<div className="align-content-center" >
						<p className="title">#{qrcode}</p>
					</div>
				</div>
			</td>
			<td className="align-content-center">{formattedDate}</td>
			<td className="align-content-center">{formattedTime}</td>
			<td className="align-content-center text-start">?Usuário</td>
			<td className="align-content-center text-start">{address}</td>
			<td className="align-content-center text-start">{neighborhood}</td>
			<td className="align-content-center text-start">{city}/{state}</td>
			<td className="align-content-center text-start">
				<Status statusOS={status} />
			</td>
			<td className="align-content-center ">

				{accessLevel === 2 ||
					(accessLevel === 0 && (
						<Link to={`view?id=${id}`}>
							<BsEyeFill />
						</Link>
					))}

				{accessLevel === 0 && (
					<Link to={`form?id=${id}`}>
						<BsFillPencilFill />
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
				)}
			</td>
		</tr>
	);
}
