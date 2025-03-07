import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { useNavigate, useSearchParams } from 'react-router';
import Toast from '../../Toast';

export default function MaterialsForm() {
	const [formData, setFormData] = useState<{
		[field: string]: string;
	}>({
		description: '',
		group: '',
		active: 'true',
	});
	const route = useNavigate();
	const [searchParams] = useSearchParams();
	const [success, setSuccess] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const id = searchParams.get('id');

	const saveMaterial = async (e: any) => {
		e.preventDefault();
		try {
			if (id) {
				await api.put(`material/${id}`, formData);
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
				}, 1300);
			} else {
				const response = await api.post('material', formData);
				const { id } = response.data;
				setOpenToast(true);
				setTimeout(() => {
					setOpenToast(false);
				}, 1300);
				route(`/materials/form?id=${id}`);
			}
			setSuccess(true);
		} catch (error) {
			console.error(error);
			setOpenToast(true);
			setSuccess(false);
		}
	};

	const getMaterial = async () => {
		const response = await api.get(`material/${id}`);
		const { description, active, group } = response.data;
		setFormData({ description, active, group });
		console.log(response.data);
	};

	useEffect(() => {
		if (id) {
			getMaterial();
		}
	}, []);

	return (
		<div className="row">
			{openToast && <Toast success={success} />}
			<div className="col-md-3">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header">
						<p className="card-title">Materiais</p>
					</div>
					<div className="card-body p-3"></div>
				</div>
			</div>
			<div className="col-md-9">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header">
						<p className="card-title">Editar</p>
						<button
							type="submit"
							onClick={saveMaterial}
							className="btn btn-primary"
						>
							Salvar
						</button>
					</div>
					<hr />
					<div className="card-body p-3">
						<form>
							<div className="row">
								<div className="mb-3 col-12">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Descrição
									</label>
									<input
										value={formData.description}
										type="text"
										className="form-control"
										id="description"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value,
											}))
										}
									/>
								</div>

								<div className="mb-3 col-6">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Grupo
									</label>
									<input
										value={formData.group}
										type="text"
										className="form-control"
										id="group"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value,
											}))
										}
									/>
								</div>
								<div className="mb-3 col-6">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Status
									</label>
									<select
										id="active"
										value={`${formData.active}`}
										className="form-control mt-2"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value,
											}))
										}
									>
										<option selected value="true">
											Ativo
										</option>
										<option value="false">Inativo</option>
									</select>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
