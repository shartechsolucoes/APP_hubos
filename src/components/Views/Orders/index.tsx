import { useEffect,useRef, useState } from 'react';
import { api } from '../../../api';
import { useSearchParams } from 'react-router';
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import {BsFileEarmarkPdf} from "react-icons/bs";
import { useReactToPrint } from 'react-to-print';

export default function OrdersView() {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const [listOfKits, setListOfKits] = useState<
		Array<{
			id: number;
			quantity:
				string;
			description: string;
			materials?: { material: { description: string;  quantity: string;} }[];
		}>
	>([]);
	const [kits, setKits] = useState<
		Array<{ id: number; quantity: string; description: string }>
	>([]);
	const [kitAndQuantity, setKitAndQuantity] = useState<
		Array<{ kit_id: number; quantity: string }>
	>([]);
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	const getKits = async () => {
		const response = await api.get('kits');
		setKits(response.data);
	};

	const getOrder = async () => {
		const response = await api.get(`/order/${id}`);
		response.data.ordersKits.map((ok: { kit_id: number; quantity: string }) => {
			const kitInfo = kits.filter((kit) => kit.id === ok.kit_id);
			setListOfKits((prev) => [...prev, kitInfo[0]]);
		});
		setKitAndQuantity(response.data.ordersKits);
		setFormData(response.data);
	};



	useEffect(() => {
		if (kits.length === 0) {
			getKits();
		}
		if (id && kits.length !== 0) {
			getOrder();
		}
	}, [kits]);

	useEffect(() => {
		console.log(formData);
	}, [formData]);

	const registerDay  = formData.registerDay ? format(formData.registerDay, "dd/MM/yyyy", {locale:ptBR} ): '';
	const registerTime  = formData.registerDay ? format(formData.registerDay, "hh:mm", {locale:ptBR} ): '';

	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	return (
		<>
			<div className="d-flex p-2 pt-0 justify-content-end gap-3">
				<button type="button" onClick={() => reactToPrintFn()} className="btn">
					<BsFileEarmarkPdf /> Baixar PDF
				</button>
			</div>
			<div className="card list-height overflow-y-auto p-3 pb-3 mb-5"  ref={contentRef}>

				<div className="card-body">
					<div className="m-3 row">
						<h1 className="mb-3">Ordem de Serviço #{formData.qr_code}</h1>
						<h4 className="mt-5">Informações Gerais</h4>
						<hr/>
						<div className="col-md-12 mt-2">
							<strong>Empresa:</strong> Prefeitura da cidade de Almirante Tamandaré{formData.data}
						</div>
						<div className="col-md-4 mt-2">
							<strong>Data:</strong> {registerDay}
						</div>
						<div className="col-md-4 mt-2">
							<strong>Hora:</strong> {registerTime}
						</div>

						<h4 className="mt-5">Endereço</h4>
						<hr/>
						<div className="col-md-6 mt-2">
							<strong>Rua:</strong> {formData.address}
						</div>
						<div className="col-md-6 mt-2">
							<strong>Bairro:</strong> {formData.neighborhood}
						</div>
						<div className="col-md-6 mt-2">
							<strong>Município:</strong> {formData.city}
						</div>
						<div className="col-md-6 mt-2">
							<strong>UF:</strong> {formData.state}
						</div>

						<div className="col-md-6 mt-2">
							<strong>Latitude:</strong> {formData.lat}
						</div>
						<div className="col-md-6 mt-2">
							<strong>Longitude:</strong> {formData.long}
						</div>

						<h4  className="mt-5">Obs</h4>
						<hr/>
						<div className="mb-3">
							{formData.observations}
						</div>

						<h4 className="mt-5">Kit(s)</h4>
						<hr/>
						<table className="mt-2">
							<tr>
								<th>Descrição</th>
								<th>Materiais</th>
								<th className="text-center">Quantidade</th>
							</tr>

							{listOfKits.length > 0 && (
								<>
									{listOfKits.map((kit) => (
										<tr>
											<td>{kit.description}</td>
											<td>
												{kit?.materials?.map((material) => (
													<div className="ms-3 my-2">
														({material.material.quantity}) {material.material.description}
													</div>
												))}
											</td>
											<td className="text-center">{
												kitAndQuantity.some((kq) => kq.kit_id === kit.id)
													? kitAndQuantity.filter(
														(k) => k.kit_id === kit.id
													)[0].quantity
													: ''
											}</td>
										</tr>
									))}
								</>
							)}
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
