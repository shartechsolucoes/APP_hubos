import './styles.css';

interface IPagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	toggleList: (setPage: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	totalItems,
	toggleList,
}: IPagination) {
	return (
		<div className="row mx-3 justify-content-between my-3 pagination-container">
			<div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
				<div
					className="dt-info"
					aria-live="polite"
					id="DataTables_Table_0_info"
					role="status"
				>
					Mostrando {currentPage + 1} de {totalPages} de {totalItems} registros
				</div>
			</div>
			<div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
				{totalPages > 10 && (
					<div className="dt-paging">
						<nav aria-label="pagination">
							<ul className="pagination">
								<li
									className={`dt-paging-button page-item pagination-button-size`}
								>
									{currentPage > 1 && (
										<button
											className="page-link"
											role="link"
											type="button"
											aria-controls="DataTables_Table_0"
											aria-current="page"
											data-dt-idx="0"
											onClick={() => toggleList(currentPage - 2)}
										>
											{currentPage - 1}
										</button>
									)}
								</li>
								<li
									className={`dt-paging-button page-item pagination-button-size`}
								>
									{currentPage > 0 && (
										<button
											className="page-link"
											role="link"
											type="button"
											aria-controls="DataTables_Table_0"
											aria-current="page"
											data-dt-idx="0"
											onClick={() => toggleList(currentPage - 1)}
										>
											{currentPage}
										</button>
									)}
								</li>
								<li
									className={`dt-paging-button page-item ${
										currentPage === currentPage ? 'active' : ''
									}`}
								>
									<button
										className="page-link"
										role="link"
										type="button"
										aria-controls="DataTables_Table_0"
										aria-current="page"
										data-dt-idx="0"
										onClick={() => toggleList(currentPage)}
									>
										{currentPage + 1}
									</button>
								</li>
								<li
									className={`dt-paging-button page-item pagination-button-size`}
								>
									{totalPages >= currentPage + 2 && (
										<button
											className="page-link"
											role="link"
											type="button"
											aria-controls="DataTables_Table_0"
											aria-current="page"
											data-dt-idx="0"
											onClick={() => toggleList(currentPage + 1)}
										>
											{currentPage + 2}
										</button>
									)}
								</li>
								<li
									className={`dt-paging-button page-item pagination-button-size`}
								>
									{totalPages >= currentPage + 3 && (
										<button
											className="page-link"
											role="link"
											type="button"
											aria-controls="DataTables_Table_0"
											aria-current="page"
											data-dt-idx="0"
											onClick={() => toggleList(currentPage + 2)}
										>
											{currentPage + 3}
										</button>
									)}
								</li>
							</ul>
						</nav>
					</div>
				)}
			</div>
		</div>
	);
}
