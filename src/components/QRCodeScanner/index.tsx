import { Scanner } from '@yudiel/react-qr-scanner';
import { IoMdClose } from 'react-icons/io';

export default function QRCodeScanner({
	closeQR,
	handleValue,
}: {
	closeQR: () => void;
	handleValue: (value: string) => void;
}) {
	const handlerQr = (value: string) => {
		handleValue(value);
		if (value) {
			closeQR();
		}
	};
	return (
		<div className="position-fixed z-3 h-100 w-100 top-0 start-0 d-flex flex-column align-items-center justify-content-center bg-dark">
			<button
				onClick={() => closeQR()}
				className="btn btn-transparent position-absolute top-0 end-0 m-3"
				type="button"
			>
				<IoMdClose />
			</button>
			<h3 className="mb-5 text-white"> Por Favor escaneio o QR code </h3>
			<Scanner
				styles={{
					container: { alignContent: 'center', height: '60vw', width: '60vw' },
					// video: { height: 20 },
					finderBorder: 2,
				}}
				onScan={(result) => handlerQr(result[0].rawValue)}
			/>
			;
		</div>
	);
}
