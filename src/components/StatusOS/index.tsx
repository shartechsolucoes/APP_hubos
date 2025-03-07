import './styles.css';
export default function Status({statusOS}: { statusOS?: number }) {
	if(statusOS == 0){
		return (
			<>
				<i className="status open"></i>Aberto
			</>
		);
	}
	else if (statusOS == 1){
		return (
			<>
				<i className="status in-work"></i>Em trabalho
			</>
		);
	}
	else if (statusOS == 2){
		return (
			<>
				<i className="status finished"></i>Finalizado
			</>
		);
	}
	else{
		return (
			<>
				<i className="status"></i>Finalizado{status}
			</>
		);
	}


}
