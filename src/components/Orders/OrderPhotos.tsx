import { LiaSearchPlusSolid } from 'react-icons/lia';
import Spinner from '../Spiner';
import Image from '../Forms/Image';

interface OrderPhotosProps {
    id?: string | null;
    formData: any;
    workImages: {
        startWork: string;
        endWork: string;
    };
    startLoad: boolean;
    endLoad: boolean;
    onStartPhoto: (e: any) => void;
    onEndPhoto: (e: any) => void;
    setOpenImage: (img: string) => void;
    imageModalRef: any;
}

export default function OrderPhotos({
                                        id,
                                        formData,
                                        workImages,
                                        startLoad,
                                        endLoad,
                                        onStartPhoto,
                                        onEndPhoto,
                                        setOpenImage,
                                        imageModalRef,
                                    }: OrderPhotosProps) {
    return (
        <div className="mb-3 col-12">
            <div className="img-box row">
                {/* INÍCIO */}
                <div className="mb-3 col-12 col-md-6 d-flex flex-column">
                    <label className="form-label">Início</label>

                    {startLoad ? (
                        <div className="d-flex justify-content-center my-5">
                            <Spinner />
                        </div>
                    ) : (
                        workImages.startWork && (
                            <button
                                type="button"
                                className="btn position-relative"
                                onClick={() => {
                                    setOpenImage(workImages.startWork);
                                    imageModalRef.current.setOpen(true);
                                }}
                            >
                                <Image image={workImages.startWork} height="240px" />
                                <LiaSearchPlusSolid
                                    style={{
                                        position: 'absolute',
                                        bottom: '.5em',
                                        right: '.5em',
                                        height: '24px',
                                        width: '24px',
                                    }}
                                />
                            </button>
                        )
                    )}

                    <label
                        className={`btn btn-primary ${
                            formData.qr_code ? '' : 'disabled'
                        }`}
                        htmlFor="start-work"
                    >
                        Inserir Foto
                    </label>
                    <input
                        id="start-work"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={onStartPhoto}
                    />
                </div>

                {/* FIM */}
                <div className="mb-3 col-12 col-md-6 d-flex flex-column">
                    {id && <label className="form-label">Fim</label>}

                    {endLoad ? (
                        <div className="d-flex justify-content-center my-5">
                            <Spinner />
                        </div>
                    ) : (
                        workImages.endWork && (
                            <button
                                type="button"
                                className="btn position-relative"
                                onClick={() => {
                                    setOpenImage(workImages.endWork);
                                    imageModalRef.current.setOpen(true);
                                }}
                            >
                                <Image image={workImages.endWork} height="240px" />
                                <LiaSearchPlusSolid
                                    style={{
                                        position: 'absolute',
                                        bottom: '.5em',
                                        right: '.5em',
                                        height: '24px',
                                        width: '24px',
                                    }}
                                />
                            </button>
                        )
                    )}

                    {id && (
                        <label className="btn btn-primary" htmlFor="end-work">
                            Inserir Foto
                        </label>
                    )}
                    <input
                        id="end-work"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={onEndPhoto}
                    />
                </div>
            </div>
        </div>
    );
}
