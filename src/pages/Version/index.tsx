import Accordion from 'react-bootstrap/Accordion';
export default function Version() {
	return (

		<div>
			<div className="row d-flex">
				<div className="col-8">
					<Accordion defaultActiveKey="0">
						<Accordion.Item eventKey="0">
							<Accordion.Header>Release 1.2</Accordion.Header>
							<Accordion.Body>
								<p>Update 03 de fevereiro de 2026, 16:09AM</p>

								<h5>Novas Funções implementadas</h5>
								<p>- Relatório de Material Usado </p>
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>Release 1.1</Accordion.Header>
							<Accordion.Body>
								<p>Update 17 de fevereiro de 2026, 22:12AM</p>

								<h5>Novas Funções implementadas</h5>
								<p>- Sistema de duplicação de OS </p>
								<p>- Relatório OS por dia </p>
								<p>- Inclusão campo número de protocolo </p>

								<h5>Correções</h5>
								<p>- Exclusão de kit da OS</p>

							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="2">
							<Accordion.Header>Release 1.0</Accordion.Header>
							<Accordion.Body>
								<p>Update 07 de fevereiro de 2026, 10:12AM</p>

								<h5>Novas Funções implementadas</h5>
								<p>- Cadastro de ordens de serviços</p>
								<p>- Cadastro e edição de usuários</p>
								<p>- Lista de usuários</p>

								<h5>Correções</h5>
								<p>- Tela de Login para smartphones</p>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

				</div>
				<div className="col-4">
					<div className="card">
						<div className="card-body">
							<h5>Manuais</h5>
							<a href="">Manual do Usuário</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
