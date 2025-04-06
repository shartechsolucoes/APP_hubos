export default function Image({
	image,
	height,
}: {
	image: string;
	height?: string;
}) {
	return (
		<img
			className="img-fluid rounded mb-4"
			style={{
				// maxHeight: height,
				// maxWidth: '162px',
				width: 'auto',
				height: height,
				objectFit: 'contain',
			}}
			src={`${import.meta.env.VITE_API_URL}${image}`}
			// height="120"
			// width="120"
			alt="User avatar"
		/>
	);
}
