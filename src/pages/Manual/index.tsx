import { useState } from 'react';
import './manual.css';
import {IoLogInOutline} from "react-icons/io5";
import {RiLoginBoxFill} from "react-icons/ri";
import {MdDashboard, MdDocumentScanner, MdTipsAndUpdates} from "react-icons/md";
import {BiSolidReport, BiSupport} from "react-icons/bi";
import {SiProtondrive} from "react-icons/si";

function Manual() {
	const [activeTab, setActiveTab] = useState('login');

	const renderContent = () => {
		switch (activeTab) {
			case 'login':
				return (
					<div>
						<h2>💡 Acesso ao Sistema GeoOS</h2>
						<p>
							Digite seus dados no formulário para acessar o sistema e gerenciar sua rede de iluminação
							pública de forma inteligente, integrada e em tempo real.
						</p>
						<ul>
							<li>Acesso rápido e seguro.</li>
							<li>Interface intuitiva e responsiva.</li>
							<li>Suporte técnico especializado.</li>
						</ul>
					</div>
				);
			case 'dashboard':
				return (
					<div>
						<h2>📊 Dashboard</h2>
						<p>
							Acompanhe indicadores em tempo real e visualize as principais informações da operação:
						</p>
						<ul>
							<li>Quantidade de OS abertas, em andamento e concluídas;</li>
							<li>Status dos pontos de iluminação;</li>
							<li>Desempenho das equipes e tempo médio de atendimento.</li>
						</ul>
					</div>
				);
			case 'ordens':
				return (
					<div>
						<h2>🧾 Ordens de Serviço</h2>
						<p>
							Gerencie todas as OS com praticidade. O sistema permite abrir, editar, concluir e
							acompanhar o status de cada ordem de serviço.
						</p>
						<ul>
							<li>Registro via geolocalização (mapa interativo);</li>
							<li>Anexos de fotos e detalhes da ocorrência;</li>
							<li>Filtros por tipo, status e responsável.</li>
						</ul>
					</div>
				);
			case 'relatorios':
				return (
					<div>
						<h2>📑 Relatórios</h2>
						<p>
							Gere relatórios completos com dados sobre as OS, desempenho e histórico de atendimentos.
						</p>
					</div>
				);
			case 'protocolos':
				return (
					<div>
						<h2>📬 Protocolos</h2>
						<p>
							Registre e acompanhe protocolos vinculados às ordens de serviço ou solicitações de usuários.
						</p>
					</div>
				);
			case 'dicas':
				return (
					<div>
						<h2>💡 Dicas Gerais</h2>
						<p>
							Aproveite ao máximo o GeoOS! Explore atalhos, boas práticas e recomendações para uso
							eficiente do sistema.
						</p>
					</div>
				);
			case 'suporte':
				return (
					<div>
						<h2>🛠️ Suporte</h2>
						<p>
							Em caso de dúvidas ou dificuldades, entre em contato com nossa equipe de suporte técnico:
						</p>
						<ul>
							<li>Email: suporte@geoos.com.br</li>
							<li>Telefone: (11) 99999-9999</li>
							<li>Atendimento: Segunda a sexta, das 8h às 18h.</li>
						</ul>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-4 sub-menu">
					<ul>
						<li><button onClick={() => setActiveTab('login')}>
							<RiLoginBoxFill/>
							<span>Login</span>
						</button></li>
						<li><button onClick={() => setActiveTab('dashboard')}>
							<MdDashboard />
							<span>Dashboard</span>
						</button></li>
						<li>
							<button onClick={() => setActiveTab('ordens')}>
								<MdDocumentScanner />
								<span>Ordens de Serviço</span>
							</button>
						</li>
						<li><button onClick={() => setActiveTab('relatorios')}>
							<BiSolidReport />
							<span>Relatórios</span>
						</button></li>
						<li><button onClick={() => setActiveTab('protocolos')}>
							<SiProtondrive />
							<span>Protocolos</span>
						</button></li>
						<li><button onClick={() => setActiveTab('dicas')}>
							<MdTipsAndUpdates />
							<span>Dicas Gerais</span>
						</button></li>
						<li><button onClick={() => setActiveTab('suporte')}>
							<BiSupport />
							<span>Suporte</span>
						</button></li>
					</ul>
				</div>

				<div className="col-md-8 content-area">
					{renderContent()}
				</div>
			</div>
		</div>
	);
}

export default Manual;
