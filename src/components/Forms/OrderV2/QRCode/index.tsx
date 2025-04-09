import { Scanner } from '@yudiel/react-qr-scanner';

export default function QRCode({
	handleValue,
}: {
	handleValue: (value: string) => void;
}) {
	const handlerQr = (value: string) => {
		handleValue(value);
	};
	return (
		<>
			<h3 className="mb-5 "> Por Favor escaneio o QR code </h3>
			<Scanner
				styles={{
					container: { alignContent: 'center', height: '60vw', width: '60vw' },
					// video: { height: 20 },
					finderBorder: 2,
				}}
				onScan={(result) => handlerQr(result[0].rawValue)}
			/>
		</>
	);
}
