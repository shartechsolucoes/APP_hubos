import { useForm } from "react-hook-form";

type FormValues = {
	code: string;
	address?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	latitude?: number;
	longitude?: number;
	type?: string;
	heightMeters?: number;
	installedAt?: string;
	status?: string;
	notes?: string;
	photo?: FileList;
};

export default function PostForm({ onSubmit }: { onSubmit: any }) {
	const { register, handleSubmit } = useForm<FormValues>();

	return (
		<div className="card form-container p-3 pb-3 mb-5">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="mb-3 col-2 col-md-2">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Código
						</label>
						<input {...register("code", { required: true })} placeholder="Código" className="form-control" />
					</div>
					<div className="mb-3 col-6 col-md-8">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Endereço
						</label>
						<input {...register("address")} placeholder="Endereço" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-2">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Numero
						</label>
						<input {...register("address")} placeholder="Número" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-4">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Bairro
						</label>
						<input {...register("neighborhood")} placeholder="Bairro" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-4">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Cidade
						</label>
						<input {...register("city")} placeholder="Cidade" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-4">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Estado
						</label>
						<input {...register("state")} placeholder="Estado" className="form-control" />
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Latitude
						</label>
						<input {...register("latitude")} placeholder="Latitude" type="number" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Longitude
						</label>
						<input {...register("longitude")} placeholder="Longitude" type="number" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Tipo (Material)
						</label>
						<select {...register("type")} className="form-control">
							<option value="WOOD">Madeira</option>
							<option value="CONCRETE">Concreto</option>
							<option value="METAL">Metal</option>
							<option value="OTHER">Outro</option>
						</select>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Altura (m)
						</label>
						<input {...register("heightMeters")} placeholder="Altura (m)" type="number" className="form-control"/>
					</div>

					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Data
						</label>
						<input {...register("installedAt")} type="date" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Status
						</label>
						<select {...register("status")} className="form-control">
							<option value="ACTIVE">Ativo</option>
							<option value="INACTIVE">Inativo</option>
							<option value="MAINTENANCE">Manutenção</option>
						</select>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Observações
						</label>
						<textarea {...register("notes")} placeholder="Observações" className="form-control"/>
					</div>
					<div className="mb-3 col-6 col-md-6">
						<label htmlFor="exampleInputEmail1" className="form-label">
							Foto
						</label>
						<input type="file" {...register("photo")} />
					</div>

				</div>

				<button type="submit">Salvar</button>
			</form>
		</div>
	);
}
