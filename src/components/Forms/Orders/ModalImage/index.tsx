import { MdClose } from 'react-icons/md';
import Image from '../../Image';
import { forwardRef, useImperativeHandle, useState } from 'react';

export default forwardRef(function ModalImage(
	{ image }: { image: string },
	ref
) {
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({ setOpen }));

	return (
		<>
			{open && (
				<div
					className="position-fixed top-0 start-0  h-100 w-100 d-flex justify-content-end align-items-center "
					onClick={() => setOpen(false)}
					style={{ backgroundColor: `rgba(50,50,50,0.5)` }}
				>
					<div className="card w-50 h-100 rounded-start-2">
						<div className="card-body">
							<div>
								<button
									className="btn"
									type="button"
									onClick={() => setOpen(false)}
								>
									<MdClose />
								</button>
							</div>
							<div className="w-100 h-100 d-flex align-items-center justify-content-center">
								<Image image={image} />
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
