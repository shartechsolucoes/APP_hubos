import './order.css';
import {
	BsFillPencilFill,
	BsEyeFill,
} from 'react-icons/bs';
import { Link } from 'react-router';
import useAccessLevelStore from '../../../stores/accessLevelStore';

import Image from '../../Forms/Image';

export default function ListItemOrders({
										   id,
										   address,
										   neighborhood,
										   city,
										   state,
										   active,
										   status,
										   photoEndWork,
										   kit,
										   duplicated,
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
	photoEndWork?: string;
	kit?: string;
	duplicated?: string;
	userName?: string;
	userPicture?: string;
}) {
	const { accessLevel } = useAccessLevelStore();

	return (
		<>
			<div
				className={` orders mt-2 overflow-hidden
				${duplicated ? "duplicated" : ""} 
				${active === 0 ? "inactive" : ""}`}
			>


				<div className="card-body d-flex gap-2 justify-content-start p-0">
					<div className="thumbnail">
						<Image
							image={photoEndWork}
							height="240px"
							orientation="from-image"
						/>
					</div>
					<>
						<div className="d-flex gap-2 justify-content-between">
							<div>
								<h6 className=" mb-0">{address}</h6>
								<small className="text-truncate">
									{neighborhood} - {city}/{state}
								</small>
								<br/>
								{kit}
							</div>
							<div>
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
							</div>

						</div>
					</>
				</div>
			</div>
		</>
	);
}
