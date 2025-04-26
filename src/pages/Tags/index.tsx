import ListItem from '../../components/ListItem/Tags';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../api';
import Pagination from '../../components/Pagination';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

export default function Tags() {
	const [tags, setTags] = useState<
		Array<{
			id: number;
			referenceCode: string;
			qr_code: string;
			date: Date;
			registerDay: Date;
		}>
	>([]);

	const [tagsInput, setTagsInput] = useState<{ start: string; end: string }>({
		start: '',
		end: '',
	});
	const [page, setPage] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [waitingTag, setWaitingTag] = useState(false);
	const [printTagList, setPrintTagList] = useState<string[]>([]);

	const totalPages =
		totalItems < 10
			? 1
			: (totalItems / 10) % 1 > 0.5
			? Math.ceil(totalItems / 10)
			: Math.ceil(totalItems / 10);

	const getTags = async () => {
		const response = await api.get('tags', { params: { page } });
		setTags(response.data.items);
		setTotalItems(response.data.total);
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
			const arrayList = response.data.map((tg: any) => tg.referenceCode);
			setPrintTagList((prevState) => [...prevState, ...arrayList]);
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

			setPrintTagList((prevState) => prevState.filter((item) => item !== tag));
		} else {
			setPrintTagList((prev) => [...prev, tag]);
		}
	};

	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	useEffect(() => {
		getTags();
	}, [page]);

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
					<div className="card  pb-0 mb-5">
						<div className="card-header d-flex justify-content-between">
							<p className="card-title">Etiqueta</p>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => reactToPrintFn()}
							>
								Imprimir
							</button>
						</div>
						<div
							className=" tag-list card-body d-flex flex-wrap justify-content-center print-media overflow-y-auto "
							style={{ gap: '5em !important' }}
							ref={contentRef}
						>
							{printTagList.map((tl) => (
								<>
									<div
										key={tl}
										className="tag-qr position-relative flex-grow-1 d-flex gap-4 flex-column align-items-center m-4"
										style={{ maxHeight: '360px', maxWidth: '360px' }}
									>
										<QRCode
											size={256}
											style={{
												height: 'auto',
												maxWidth: '100%',
												width: '100%',
											}}
											value={tl}
											viewBox={`0 0 24 24`}
										/>
										<p className="d-flex justify-content-center m-4">
											OS: {tl}
										</p>
									</div>
								</>
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
								date={tag.date}
								registeredDay={tag.registerDay}
								deleteItem={function (): void {
									throw new Error('Function not implemented.');
								}}
								selectedList={printTagList}
								selectItem={(e) => setInList(e)}
							/>
						</>
					))}
					<Pagination
						totalPages={totalPages}
						totalItems={totalItems}
						currentPage={page}
						toggleList={(p) => setPage(p)}
					/>
				</div>
			</div>
		</>
	);
}
