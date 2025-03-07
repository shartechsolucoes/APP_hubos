import { useEffect, useRef, useState } from 'react';
import { api } from '../../api';
import { useSearchParams } from 'react-router';
import { format, parseISO } from 'date-fns';
// import { ptBR } from 'date-fns/locale';
import './styles.css';
import { useReactToPrint } from 'react-to-print';
import { BsFileEarmarkPdf } from 'react-icons/bs';

export default function ReportMaterial() {
	// const formattedDate = (date: Date) => {
	// 	const newDate = format(date, `dd/MM/yyyy`);
	// 	return newDate;
	// };

	const formattedURl = (dates: string | null) => {
		if (dates != null) {
			const newDate = format(parseISO(dates), `dd/MM/yyyy`);
			return newDate;
		}
	};

	const [searchParams] = useSearchParams();
	const start = searchParams.get('start');
	const end = searchParams.get('end');
	// const [currentDate, setCurrentDate] = useState(new Date());
	const [orders, setOrders] = useState<
		Array<{
			id: number;
			description: string;
			quantity: number;
		}>
	>([]);
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	const getOrders = async () => {
		const response = await api.get(
			`/orders/report-materials?start=${start}&end=${end}`
		);
		setOrders(response.data);
		console.log(response.data);
	};

	const today = format(new Date(), 'dd/MM/yyyy');

	useEffect(() => {
		getOrders();
	}, []);

	return (
		<>
			<div className="d-flex p-2 pt-0 justify-content-end gap-3">
				<button type="button" onClick={() => reactToPrintFn()} className="btn">
					<BsFileEarmarkPdf /> Baixar PDF
				</button>
			</div>
			<div className="card">
				<div ref={contentRef} className="report">
					<div className="d-flex gap-4 mb-4">
						<img
							alt="logo da prefeitura"
							className="m-4"
							src="/src/assets/prefeitura_logo.png"
							height={70}
							width={50}
						/>
						<span className="flex-fill text-center">
							<h2 className="m-3 mt-5 fw-bolder">
								Serviços Realizados - Materiais
							</h2>
							{
								<p>
									Data de: {formattedURl(start)} Data Até: {formattedURl(end)}
								</p>
							}
						</span>
						<p className="m-4">{today}</p>
					</div>

					<table className="table table-striped">
						<tr>
							<th>Código</th>
							<th>Descrição</th>
							<th>Quantidade</th>
						</tr>
						{orders.map((order) => (
							<>
								<tr className="row-os">
									<td>{order.id}</td>
									<td>{order.description}</td>
									<td>{order.quantity}</td>
								</tr>
							</>
						))}
					</table>
				</div>
			</div>
		</>
	);
}
