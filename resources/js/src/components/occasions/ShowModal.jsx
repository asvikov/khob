import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import FormatDate from "../../services/FormatDate";
import { useOccasion } from '../../hooks/useOccasions';

const Modal = ({ show, onCloseButtonClick, occasion_id }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const mapInstanceRef = useRef(null);
    const FormDate = new FormatDate();
    const { data: occasion_data, isLoading: isLoadingData, error: dataError } = useOccasion(occasion_id);

    // Загрузка Яндекс.Карт
    useEffect(() => {
        if (!show) return;

        if (window.ymaps) {
            setScriptLoaded(true);
            return;
        }

        const ym_script = document.createElement('script');
        ym_script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=55d6c42e-805f-4e65-86ab-44572603cf16&suggest_apikey=7e0fc23a-c030-4ac3-90c0-d0ac211eb101';
        ym_script.type = 'text/javascript';
        ym_script.async = true;

        ym_script.onload = () => {
            window.ymaps.ready(() => {
                setScriptLoaded(true);
            });
        };

        ym_script.onerror = () => {
            console.error('Ошибка загрузки Яндекс.Карт');
            setScriptLoaded(true); // Все равно продолжаем, чтобы показать данные
        };

        document.body.appendChild(ym_script);

        return () => {
            // Очистка при скрытии модального окна
            if (mapInstanceRef.current) {
				mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [show]);

    // Инициализация карты когда загружены и данные, и скрипт
    useEffect(() => {
        if (!show || !scriptLoaded || isLoadingData || !occasion_data) {
            return;
        }

        initMap(occasion_data);
    }, [show, scriptLoaded, isLoadingData, occasion_data]);

    const initMap = (response) => {
        const mapElement = document.getElementById('occ_map');
        if (!mapElement || !window.ymaps || !response?.location) return;

        // Очищаем предыдущую карту если она есть
        if (mapInstanceRef.current) {
            mapElement.innerHTML = '';
        }

        const location = [
            Number(response.location[0]),
            Number(response.location[1])
        ];

        try {
            const yandexMap = new window.ymaps.Map("occ_map", {
                center: location,
                zoom: 12
            });
			//yandexMap.geoObjects.removeAll();

            mapInstanceRef.current = yandexMap;

            const placemark = new window.ymaps.Placemark(
                location,
                {
                    iconCaption: response.address || "Адрес",
                    balloonContent: response.address || "Адрес",
                },
                {
                    preset: "islands#blueDotIconWithCaption",
                }
            );

            yandexMap.geoObjects.add(placemark);

            //placemark.balloon.open();

        } catch (error) {
            console.error("Ошибка инициализации карты:", error);
        }
    };

    if (!show) {
        return null;
    }

    const isLoading = !scriptLoaded || isLoadingData;
    const hasError = dataError || (!isLoadingData && !occasion_data);

    return ReactDOM.createPortal(
        <div className="modal-wrapper-occ">
            <div className='modal-white-bacgound'>
                <div className="modal-content">
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3">Загрузка данных...</p>
                        </div>
                    ) : hasError ? (
                        <div className="alert alert-danger">
                            Ошибка загрузки данных события
                            <button 
                                onClick={onCloseButtonClick} 
                                className="btn btn-secondary mt-3 d-block"
                            >
                                Закрыть
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <div>
                                    <span className="modal-occ-name-p">начало события: </span>
                                    {occasion_data.start ? FormDate.toView(occasion_data.start) : 'не указано'}
                                </div>
                                <div>
                                    <span className="modal-occ-name-p">окончание события: </span>
                                    {occasion_data.end ? FormDate.toView(occasion_data.end) : 'не указано'}
                                </div>
                                <div>
                                    <span className="modal-occ-name-p">описание: </span>
                                    {occasion_data.description || 'нет описания'}
                                </div>
                                <div>
                                    <span className="modal-occ-name-p">место проведения: </span>
                                    {occasion_data.address || 'адрес не указан'}
                                </div>
                                {scriptLoaded && occasion_data?.location ? (
                                    <div className='modal-occ-map' id='occ_map'></div>
                                ) : (
                                    <div className="alert alert-info mt-3">
                                        Карта недоступна
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button onClick={onCloseButtonClick}>Закрыть</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
