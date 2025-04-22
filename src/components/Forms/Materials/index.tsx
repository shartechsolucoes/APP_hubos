import { useEffect, useRef, useState } from 'react';
import { api } from '../../../api';
import { useNavigate, useSearchParams } from 'react-router';
import Toast from '../../Toast';
import MaterialList from './MaterialList';

export default function MaterialsForm() {
	const [formData, setFormData] = useState<{
		description: string;
		group: string;
		active: string;
		status: boolean;
	}>({
		description: '',
		group: '',
		active: 'true',
		status: true,
	});
	const route = useNavigate();
	const [searchParams] = useSearchParams();
	const [success, setSuccess] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const [fieldError, setFieldError] = useState(false);
	const id = searchParams.get('id');
	const childRef = useRef<any>();

	const saveMaterial = async (e: any) => {
		e.preventDefault();
		if (!formData.description) {
			setFieldError(true);
			return;
		}
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
			setFieldError(false);
			setSuccess(true);
			childRef?.current?.getMaterials();
		} catch (error) {
			console.error(error);
			setOpenToast(true);
			setSuccess(false);
		}
	};

	const getMaterial = async () => {
		const response = await api.get(`material/${id}`);
		const { description, active, group, unit, status } = response.data;
		setFormData({ description, active, group, unit, status });
	};

	useEffect(() => {
		if (id) {
			getMaterial();
		}
	}, [id]);

	return (
		<div className="row">
			{openToast && (
				<Toast success={success} msgError="Erro ao salvar o material" />
			)}
			{id && (
				<div className="col-md-3">
					<MaterialList ref={childRef} />
				</div>
			)}
			<div className="col">
				<div className="card list-height overflow-y-auto pb-0 mb-5">
					<div className="card-header d-flex justify-content-between align-itens-center">
						<p className="card-title fs-5 m-0  p-0 align-items-center d-flex fw-bold">
							Editar
						</p>
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
								<div className="mb-3 col-9">
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
									{fieldError && (
										<p className="text-danger">Descrição vazia </p>
									)}
								</div>
								<div className="mb-3 col-3">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Unidade de medida
									</label>
									<select
										id="unit"
										value={formData.unit ? `${formData.unit}` : ''}
										className="form-control mt-2"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value,
											}))
										}
									>
										<option value="" selected disabled>
											Selecione
										</option>
										<option value="m">Metros</option>
										<option value="und">Unidades</option>
									</select>
									{/* <input
										value={formData.unit}
										type="text"
										className="form-control"
										id="unit"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value,
											}))
										}
									/> */}
								</div>

								<div className="mb-3 col-6">
									<label htmlFor="exampleInputEmail1" className="form-label">
										Grupo
									</label>
									<input
										value={formData.group || ''}
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
										id="status"
										value={`${formData.status}`}
										className="form-control mt-2"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[e.target.id]: e.target.value === 'true' ? true : false,
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
