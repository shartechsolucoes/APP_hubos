import { useState } from 'react';
import { api } from '../../api';

type NeighborhoodReport = {
	neighborhood: string;
	created: number;
	duplicated: number;
	deleted: number;
	createdOutsideBusinessHours: number
};

type OrdersReportsResponse = {
	period: {
		start: string;
		end: string;
	};
	total: {
		created: number;
		duplicated: number;
		deleted: number;
		createdOutsideBusinessHours: number
	};
	byNeighborhood: NeighborhoodReport[];
};

export default function OrdersReports() {
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<OrdersReportsResponse | null>(null);
	const [error, setError] = useState('');

	const fetchReport = async () => {
		if (!start || !end) {
			setError('Informe o período inicial e final');
			return;
		}

		setError('');
		setLoading(true);

		try {
			const response = await api.get<OrdersReportsResponse>(
				'/reports/ordersRoot',
				{
					params: { start, end },
				}
			);

			setData(response.data);
		} catch (err) {
			console.error(err);
			setError('Erro ao buscar relatório');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<h3>Relatório de Ordens de Serviço</h3>

			{/* ================= FILTROS ================= */}
			<div className="row g-3 align-items-end mb-4">
				<div className="col-md-3">
					<label>Data inicial</label>
					<input
						type="date"
						className="form-control"
						value={start}
						onChange={(e) => setStart(e.target.value)}
					/>
				</div>

				<div className="col-md-3">
					<label>Data final</label>
					<input
						type="date"
						className="form-control"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
					/>
				</div>

				<div className="col-md-3">
					<button
						className="btn btn-primary w-100"
						onClick={fetchReport}
						disabled={loading}
					>
						{loading ? 'Carregando...' : 'Gerar relatório'}
					</button>
				</div>
			</div>

			{/* ================= ERRO ================= */}
			{error && <div className="alert alert-danger">{error}</div>}

			{/* ================= RESUMO ================= */}
			{data && (
				<>
					<div className="row mb-3">
						<div className="col-md-3">
							<div className="card p-3">
								<strong>OS Criadas</strong>
								<h4>{data.total.created}</h4>
							</div>
						</div>

						<div className="col-md-3">
							<div className="card p-3">
								<strong>OS Duplicadas</strong>
								<h4>{data.total.duplicated}</h4>
							</div>
						</div>

						<div className="col-md-3">
							<div className="card p-3">
								<strong>OS Deletadas</strong>
								<h4>{data.total.deleted}</h4>
							</div>
						</div>

						<div className="col-md-3">
							<div className="card p-3">
								<strong>OS Fora de Horário</strong>
								<h4>{data.total.createdOutsideBusinessHours}</h4>
							</div>
						</div>
					</div>

					{/* ================= TABELA ================= */}
					<div className="card">
						<table className="table table-striped mb-0">
							<thead>
							<tr>
								<th>Bairro</th>
								<th>Criadas</th>
								<th>Duplicadas</th>
								<th>Deletadas</th>
							</tr>
							</thead>
							<tbody>
							{data.byNeighborhood.map((item) => (
								<tr key={item.neighborhood}>
									<td>{item.neighborhood}</td>
									<td>{item.created}</td>
									<td>{item.duplicated}</td>
									<td>{item.deleted}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}
