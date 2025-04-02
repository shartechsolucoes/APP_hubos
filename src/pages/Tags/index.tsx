import ListItem from '../../components/ListItem/Tags';
import './index.css';
import { useEffect, useState } from 'react';
import { api } from '../../api';
// import Pagination from '../../components/Pagination';
import QRCode from 'react-qr-code';

export default function Tags() {
	const [tags, setTags] = useState<
		Array<{ id: number; referenceCode: string; qr_code: string }>
	>([]);

	const [tagsInput, setTagsInput] = useState<{ start: string; end: string }>({
		start: '',
		end: '',
	});
	// const [page, setPage] = useState(3);
	const [waitingTag, setWaitingTag] = useState(false);
	const [printTagList, setPrintTagList] = useState<string[]>([]);

	const getTags = async () => {
		const response = await api.get('tags', { params: { page: 3 } });
		setTags(response.data);
	};

	const generateTags = async () => {
		setWaitingTag(true);
		try {
			const response = await api.post(
				'tags',
				{},
				{
					params: { start: tagsInput.start, end: tagsInput.end },
				}
			);
			response.data();
			console.log(response.data);
			getTags();
			setWaitingTag(false);
		} catch (error) {
			console.error(error);
			setWaitingTag(false);
		}
	};

	const setInList = (tag: string) => {
		const hasTag = printTagList.some((t) => t === tag);
		if (hasTag) {
			const slicedList = printTagList;
			slicedList.splice(slicedList.indexOf(tag), 1);
			console.log(slicedList);
			setPrintTagList((prevState) => prevState.filter((item) => item !== tag));
		} else {
			setPrintTagList((prev) => [...prev, tag]);
		}
	};

	useEffect(() => {
		getTags();
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-3">
					<div className="card list-height overflow-y-auto pb-0 mb-5">
						<div className="card-header">
							<p className="card-title">Gerar Etiqueta</p>
						</div>
						<div className="card-body d-grid">
							<div className="mb-3 ">
								<input
									value={tagsInput.start}
									type="text"
									placeholder="Inicio"
									className="form-control"
									onChange={(e) =>
										setTagsInput((prev) => ({ ...prev, start: e.target.value }))
									}
								/>
							</div>
							<div className="mb-3 ">
								<input
									value={tagsInput.end}
									type="text"
									placeholder="Fim"
									className="form-control"
									onChange={(e) =>
										setTagsInput((prev) => ({ ...prev, end: e.target.value }))
									}
								/>
							</div>
							<button
								disabled={waitingTag}
								type="button"
								className="btn btn-primary"
								onClick={generateTags}
							>
								Gerar
							</button>
						</div>
					</div>
				</div>
				<div className="col-9">
					<div className="card list-height overflow-y-auto pb-0 mb-5">
						<div className="card-header">
							<p className="card-title">Etiqueta</p>
							<a href="#">Imprimir</a>
						</div>
						<div className="card-body d-flex gap-4 flex-wrap">
							{printTagList.map((tl) => (
								<div
									key={tl}
									className="tag-qr position-relative flex-grow-1"
									style={{ maxHeight: '150px', maxWidth: '150px' }}
								>
									<QRCode
										size={256}
										style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
										value={tl}
										viewBox={`0 0 24 24`}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="card list-height">
					{tags.map((tag) => (
						<>
							<ListItem
								key={tag.id}
								title={tag.referenceCode}
								used={!!tag.qr_code}
								deleteItem={function (): void {
									throw new Error('Function not implemented.');
								}}
								selectItem={(e) => setInList(e)}
							/>
						</>
					))}
					{/* <Pagination currentPage={page} toggleList={(p) => setPage(p)} /> */}
				</div>
			</div>
		</>
	);
}
