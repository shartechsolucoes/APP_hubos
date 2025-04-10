import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
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
		<div className="" style={{ borderBottom: '1px solid #f1efef' }}>
			<div className="row px-4 py-3">
				<div className="col-sm-10 col-md-10 d-flex justify-content-start align-items-center">
					<a href="app-ecommerce-order-details.html">
						<span>{title}</span>
					</a>
				</div>

				<div className="col-md-2 d-flex justify-content-end align-items-center gap-3">
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
				</div>
			</div>
		</div>
	);
}
