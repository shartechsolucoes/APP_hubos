import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

import ListItem from '../../components/ListItem/Tags';
import Pagination from '../../components/Pagination';
import { api } from '../../api';

import './index.css';
import {LuPrinter} from "react-icons/lu";

/* ===================== TYPES ===================== */

type Tag = {
	id: number;
	referenceCode: string;
	qr_code: string;
	date: Date;
	registerDay: Date;
};

type TagsInput = {
	start: string;
	end: string;
};

type PaperType = 'A4_12' | 'A4_20' | 'A4_24';

/* ===================== COMPONENT ===================== */

export default function Tags() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [tagsInput, setTagsInput] = useState<TagsInput>({
		start: '',
		end: '',
	});
	const [page, setPage] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [waitingTag, setWaitingTag] = useState(false);
	const [printTagList, setPrintTagList] = useState<string[]>([]);
	const [paperType, setPaperType] = useState<PaperType>('A4_12');

	/** REF QUE IMPRIME (NÃO MEXER) */
	const contentRef = useRef<HTMLDivElement>(null);

	const totalPages =
		totalItems < 10 ? 1 : Math.ceil(totalItems / 10);

	/* ===================== API ===================== */

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
				{ params: tagsInput }
			);

			const codes = response.data.map(
				(tg: any) => tg.referenceCode
			);

			setPrintTagList((prev) => [...prev, ...codes]);
			getTags();
		} finally {
			setWaitingTag(false);
		}
	};

	/* ===================== SELECTION ===================== */

	const setInList = (code: string) => {
		setPrintTagList((prev) =>
			prev.includes(code)
				? prev.filter((c) => c !== code)
				: [...prev, code]
		);
	};

	/* ===================== PRINT ===================== */

	const reactToPrintFn = useReactToPrint({
		contentRef,
	});

	useEffect(() => {
		getTags();
	}, [page]);

	/* ===================== RENDER ===================== */

	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
				<div className="header-page">
					<h3 className="mb-0">Etiquetas</h3>
					<p>Etiquetas / Gerar</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					<input
						className="form-control"
						placeholder="Início"
						value={tagsInput.start}
						onChange={(e) => {
							setTagsInput((p) => ({
								...p,
								start: e.target.value,
							}));
						}}
					/>

					<input
						className="form-control"
						placeholder="Fim"
						value={tagsInput.end}
						onChange={(e) => {
							setTagsInput((p) => ({
								...p,
								end: e.target.value,
							}));
						}}
					/>

					<select
						className="form-select"
						value={paperType}
						onChange={(e) =>
							setPaperType(e.target.value as PaperType)
						}
					>
						<option value="A4_12">A4 – 12 etiquetas (3x4)</option>
						<option value="A4_20">A4 – 20 etiquetas (4x5)</option>
						<option value="A4_24">A4 – 24 etiquetas (4x6)</option>
					</select>

					<button
						className="btn btn-primary"
						disabled={waitingTag}
						onClick={generateTags}
					>
						Gerar
					</button>

					<button
						className="btn btn-primary"
						onClick={() => reactToPrintFn()}
						disabled={!printTagList.length}
					>
						Imprimir
					</button>
				</div>
			</div>
			<div className="card mt-5">
				<div className="card-body">
			<div className="row">
				<div className="col-md-4">

						{tags.map((tag) => (
							<ListItem
								key={tag.id}
								title={tag.referenceCode}
								used={!!tag.qr_code}
								date={tag.date}
								registeredDay={tag.registerDay}
								deleteItem={() => {}}
								selectedList={printTagList}
								selectItem={setInList}
							/>
						))}
					</div>


				<div className="col-md-8">
					<div className="preview">
						<div className="preview-header d-flex justify-content-between align-items-center">
							<h5>Preview</h5>
							<LuPrinter />
						</div>
						<div className="order-view">
							<div className="row">
								<div className="p-0 m-0">
									<div
										ref={contentRef}
										className={`tag-list paper-${paperType}`}
									>
										{printTagList.map((code) => (
											<div key={code} className="tag-qr">
												<QRCode value={code} size={120} />
												<p>OS: {code}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
				</div>
			</div>


			<Pagination
				totalPages={totalPages}
				totalItems={totalItems}
				currentPage={page}
				toggleList={setPage}
			/>
		</>
	);
}
