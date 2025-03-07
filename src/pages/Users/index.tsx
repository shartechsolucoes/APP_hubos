import { BsFillPlusSquareFill} from 'react-icons/bs';
import ListItemUsers from '../../components/ListItem/Users';
import { NavLink } from 'react-router';
import { api } from '../../api';
import { useEffect, useState } from 'react';
import './index.css';

export default function Users() {
	const [users, setUsers] = useState<Array<{
		name: string;
		id: string;
		login: string;
		access_level: number;
		email: string;
	}>>([]);

	const getUsers = async () => {
		try {
			const response = await api.get('/users');
			setUsers(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getUsers();
	}, []);
	return (
		<div>
			<div className="d-flex pt-0 justify-content-end align-items-center">
				<NavLink to="form" className="btn-blue">
					<BsFillPlusSquareFill /> Novo
				</NavLink>
			</div>

			<div className="card list-height overflow-y-auto pb-0 mb-5">

				<table className="w-100">
					<thead >
					<tr className="table-header">
						<th className="text-start">Usuário</th>
						<th className="align-content-center text-start">User</th>
						<th>Tipo</th>
						<th className="align-content-center text-start">Email</th>
						<th className="align-content-center text-center">Status</th>
						<th>Ações</th>
					</tr>
					</thead>
					<tbody>
					{users.map((item, index) => (
						<>
							<ListItemUsers
								key={index}
								title={item.name}
								id={item.id}
								login={item.login}
								email={item.email}
								access_level={item.access_level}
							/>
							{users.length - 1 !== index && <hr />}
						</>
					))}
					</tbody>
				</table>
			</div>
		</div>

	);
}
