import { BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs';
import { Link } from 'react-router';
import './index.css';
import useAccessLevelStore from '../../../stores/accessLevelStore.ts';

export default function ListItemOrders({
	title,
	id,
	deleteListItem,
}: {
	title?: string;
	id?: string;
	deleteListItem?: () => void;
}) {
	const { accessLevel } = useAccessLevelStore();
	return (
		<tr>
			<td className="text-start ">
				<div className="d-flex gap-3 ">
					<img
						alt="John Michael"
						src="https://themewagon.github.io/soft-ui-dashboard-react/static/media/team-2.e725aef8c892cb21f262.jpg"
						className="img-fluid img-thumbnail"
					/>
					<div className="align-content-center">
						<p className="title">{title}</p>
						(2) Parafuso tipo Máquina M16X350 - Mão de obra LED
					</div>
				</div>
			</td>
			<td className="align-content-center">
				<i className="status active"></i>Ativo
			</td>
			<td className="align-content-center">
				{accessLevel === 0 && (
					<Link to={`form?id=${id}`}>
						<BsFillPencilFill />
					</Link>
				)}

				{accessLevel === 0 && (
					<a className="" onClick={deleteListItem}>
						<BsFillTrashFill />
					</a>
				)}
			</td>
		</tr>
	);
}
