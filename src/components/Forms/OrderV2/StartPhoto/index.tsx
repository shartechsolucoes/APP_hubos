import { ChangeEvent } from 'react';
import Image from '../../Image';

export default function StartPhoto({
	startWork,
	sentStartWorkPhoto,
}: {
	startWork: string;
	sentStartWorkPhoto: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="mb-3 col-6 col-md-6 d-flex flex-column">
			<label htmlFor="exampleInputEmail1" className="form-label">
				Antes
			</label>
			{startWork && <Image image={startWork} height="240px" />}
			<label className="btn btn-primary" htmlFor="start-work">
				Inserir Foto
			</label>
			<input
				style={{ display: 'none' }}
				accept="image/*"
				id="start-work"
				type="file"
				capture="environment"
				onChange={sentStartWorkPhoto}
			/>
		</div>
	);
}
