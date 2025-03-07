import {BsQrCode} from 'react-icons/bs';
import './index.css';
// import ListItem from '../../components/ListItem';
// import { NavLink } from 'react-router';

export default function Tags() {
	// const listMock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13];
	return (
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
							<BsQrCode />
						</div>
					</div>

				</div>
			</div>
			</div>
		</>
	);
}
