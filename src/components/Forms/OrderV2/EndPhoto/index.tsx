import { ChangeEvent } from 'react';
import Image from '../../Image';

export default function EndPhoto({
	endWork,
	sentEndWorkPhoto,
}: {
	endWork: string;
	sentEndWorkPhoto: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="mb-3 col-6 col-md-6 d-flex flex-column">
			<label htmlFor="exampleInputEmail1" className="form-label">
				Depois
			</label>

			{endWork && <Image image={endWork} height="240px" />}

			<label className="btn btn-primary" htmlFor={'end-work'}>
				Inserir Foto
			</label>

			<input
				style={{ display: 'none' }}
				id="end-work"
				type="file"
				onChange={(e) => sentEndWorkPhoto(e)}
				capture="environment"
				accept="image/*"
			/>
		</div>
	);
}
