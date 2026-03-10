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
			<div className="d-flex justify-content-between align-items-center">
				<div className="header-page">
					<h3 className="mb-0">Etiquetas</h3>
					<p className=''>Etiquetas / Gerar</p>
				</div>

				<div className="d-flex justify-content-between align-items-center">
					<div className="col-4">
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
					<div className="col-4">
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
						className="btn btn-primary col-4"
						onClick={generateTags}
					>
						Gerar
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => reactToPrintFn()}
					>
						Imprimir
					</button>
				</div>

			</div>
			<div className="">

				<div className="">
					<div className="p-0 m-0">
						<div
							className="tag-list d-flex justify-content-center print-media"
							style={{ gap: '5em !important' }}
							ref={contentRef}
						>
							<div className="row">
								{printTagList.map((tl) => (
									<>
										<div
											key={tl}
											className="tag-qr col-3"
											// style={{ maxHeight: '360px', maxWidth: '360px' }}
										>
											<QRCode
												value={tl}
												viewBox={`0 0 24 24`}
											/>
											<p className="d-flex justify-content-center">
												OS: {tl}
											</p>
										</div>
									</>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="card mb-5">
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
