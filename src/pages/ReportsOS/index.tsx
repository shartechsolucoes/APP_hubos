import { useEffect, useState } from 'react'
import { api } from '../../api'
import {LuToggleLeft, LuToggleRight} from "react-icons/lu";
import {Link} from "react-router";
import {BsClipboardDataFill} from "react-icons/bs";

type NeighborhoodReport = {
	neighborhood: string
	created: number
	duplicated: number
	deleted: number
	createdOutsideBusinessHours: number
}

type OrdersReportsResponse = {
	period: { start: string; end: string }
	total: {
		created: number
		duplicated: number
		deleted: number
		createdOutsideBusinessHours: number
	}
	byNeighborhood: NeighborhoodReport[]
}

const formatDate = (date: Date) => date.toISOString().split('T')[0]

export default function OrdersReports() {
	const today = new Date()
	const thirtyDaysAgo = new Date()
	thirtyDaysAgo.setDate(today.getDate() - 30)

	const [start] = useState(formatDate(thirtyDaysAgo))
	const [end] = useState(formatDate(today))
	const [showFilters, setShowFilters] = useState(false)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<OrdersReportsResponse | null>(null)
	const [error, setError] = useState('')

	const fetchReport = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.get<OrdersReportsResponse>(
				'/reports/ordersRoot',
				{ params: { start, end } }
			)
			setData(response.data)
		} catch {
			setError('Erro ao buscar relatório')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchReport()
	}, [])

	return (
		<div className="mt-3">
			<div className="d-flex justify-content-between align-items-center">
				<div className="header-page">
				<h3 className="mb-0">Relatório</h3>
				<p className=''>Relátorio / Data</p>
				</div>

				<button
					className="btn btn-outline-secondary"
					onClick={() => setShowFilters((v) => !v)}
				>
					{showFilters ? <LuToggleLeft />
						: <LuToggleRight />}
				</button>
			</div>

			{/* ================= FILTROS (HIDDEN / INLINE) ================= */}
			{showFilters && (
				<div className="row g-3 align-items-end mb-4">
					<div className="col-md-3">
						<label>Data inicial</label>
						<input
							type="date"
							className="form-control"
							value={start}
						/>
					</div>

					<div className="col-md-3">
						<label>Data final</label>
						<input
							type="date"
							className="form-control"
							value={end}
						/>
					</div>

					<div className="col-md-3">
						<button
							className="btn btn-primary w-100"
							onClick={fetchReport}
							disabled={loading}
						>
							{loading ? 'Carregando...' : 'Atualizar relatório'}
						</button>
					</div>
				</div>
			)}

			{error && <div className="alert alert-danger">{error}</div>}

			{data && (
				<>
					<div className="row mb-3">
						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="rounded bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.created}</h4>
									</div>
									<p className="mb-0">Ordem de Serviços</p>
								</div>
							</div>
						</div>

						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.duplicated}</h4>
									</div>
									<p className="mb-0">OS Duplicadas</p>
								</div>
							</div>
						</div>

						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.deleted}</h4>
									</div>
									<p className="mb-0">OS Deletadas</p>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.duplicated}</h4>
									</div>
									<p className="mb-0">OS Duplicadas</p>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.duplicated}</h4>
									</div>
									<p className="mb-0">OS Duplicadas</p>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-3 col-sm-12">
							<div className="card card-border-shadow-primary h-100">
								<div className="card-body">
									<div className="d-flex align-items-center mb-2">
										<div className="icon me-2">
								<span className="bg-label-primary">
									<Link to={`orders`}>
										<BsClipboardDataFill className="icon-base bx bxs-truck icon-lg" />
									</Link>
								</span>
										</div>
										<h4 className="mb-0">{data.total.createdOutsideBusinessHours}</h4>
									</div>
									<p className="mb-0">OS Fora de Horário</p>
								</div>
							</div>
						</div>
					</div>

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
	)
}
