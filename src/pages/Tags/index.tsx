import ListItem from '../../components/ListItem/Tags';
import './index.css';
import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function tags() {
	const [materials, setMaterials] = useState<
		Array<{ id: number; description: string; group: string }>
	>([]);

	const getMaterials = async () => {
		const response = await api.get('materials');
		setMaterials(response.data);
	};

	useEffect(() => {
		getMaterials();
	}, []);
	return(
		<>
			<div className="row">
				<div className="col-3">
					<div className="card list-height overflow-y-auto pb-0 mb-5">
						<div className="card-header">
							<p className="card-title">Gerar Etiqueta</p>
						</div>
						<div className="card-body">
							<div className="mb-3 col-9">
								<input
									value= ''
									type="text"
									placeholder="Inicio"
									className="form-control"
									id="Valor"
								/>
							</div>
							<div className="mb-3 col-9">
								<input
									value= ''
									type="text"
									placeholder="Fim"
									className="form-control"
									id="Valor"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="col-9">
					<div className="card list-height overflow-y-auto pb-0 mb-5">
						<div className="card-header">
							<p className="card-title">Etiqueta</p>
							<a href="#">Imprimir</a>
						</div>
						<div className="card-body">
							<div className="tag-qr">

							</div>
						</div>

					</div>
				</div>
				<div className="card list-height">
					{materials.map((material) => (
						<>
							<ListItem
								group={material.group}
								id={material.id}
								title={material.description} deleteItem={function (): void {
								throw new Error('Function not implemented.');
							}}							/>
						</>
					))}
				</div>
			</div>
		</>
	);
}
