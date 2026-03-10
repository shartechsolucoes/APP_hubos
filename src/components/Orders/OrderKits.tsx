import { ChangeEvent } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';

interface Kit {
    id: number;
    description: string;
    materials?: { material: { description: string } }[];
}

interface KitQuantity {
    kit_id: number;
    quantity: string;
}

interface OrderKitsProps {
    kits: Kit[];
    selectedKit: string;
    setSelectedKit: (v: string) => void;
    listOfKits: Kit[];
    kitAndQuantity: KitQuantity[];
    onAddKit: () => void;
    onChangeQuantity: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
    onDeleteKit: (kitId: number) => void;
}

export default function OrderKits({
                                      kits,
                                      selectedKit,
                                      setSelectedKit,
                                      listOfKits,
                                      kitAndQuantity,
                                      onAddKit,
                                      onChangeQuantity,
                                      onDeleteKit,
                                  }: OrderKitsProps) {
    return (
        <>
            {/* Seleção */}
            <div className="mb-3 d-flex justify-content-between align-items-end gap-5">
				<span className="flex-fill">
					<label className="form-label">Kits</label>
					<select
                        className="form-select"
                        value={selectedKit}
                        onChange={(e) => setSelectedKit(e.target.value)}
                    >
						<option value="" disabled>
							Selecione o(s) Kit(s)
						</option>
                        {kits.map((kit) => (
                            <option key={kit.id} value={kit.id}>
                                {kit.description}
                            </option>
                        ))}
					</select>
				</span>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!selectedKit}
                    onClick={onAddKit}
                >
                    +
                </button>
            </div>

            {/* Lista */}
            {listOfKits.map((kit) => (
                <div key={kit.id} className="mb-3 mt-3">
                    <li className="d-flex">
                        <div className="avatar flex-shrink-0 me-3">
							<span className="avatar-initial rounded bg-label-secondary">
								<i className="bx bx-football"></i>
							</span>
                        </div>

                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                                <h6 className="mb-0">{kit.description}</h6>
                                <small className="d-flex">
                                    {kit.materials?.map((m, idx) => (
                                        <small key={idx}>{m.material.description} - </small>
                                    ))}
                                </small>
                            </div>

                            <div className="user-progress d-flex gap-2">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={
                                        kitAndQuantity.find((k) => k.kit_id === kit.id)?.quantity ||
                                        ''
                                    }
                                    onChange={(e) =>
                                        onChangeQuantity(e, String(kit.id))
                                    }
                                />

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => onDeleteKit(kit.id)}
                                >
                                    <BsFillTrashFill />
                                </button>
                            </div>
                        </div>
                    </li>
                </div>
            ))}
        </>
    );
}
