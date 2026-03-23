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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Загрузка данных...</p>
                        </div>
                    ) : hasError ? (
                        <div>
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                                Ошибка загрузки данных события
                            </div>
                            <button
                                onClick={onCloseButtonClick}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                            >
                                Закрыть
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-4 h-4 flex items-center justify-center text-teal-500">
                                        <i className="ri-calendar-event-line text-sm"></i>
                                    </div>
                                    <span className="font-medium text-slate-700">начало события:</span>
                                    {occasion_data.start ? FormDate.toView(occasion_data.start) : 'не указано'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-4 h-4 flex items-center justify-center text-rose-400">
                                        <i className="ri-time-line text-sm"></i>
                                    </div>
                                    <span className="font-medium text-slate-700">окончание события:</span>
                                    {occasion_data.end ? FormDate.toView(occasion_data.end) : 'не указано'}
                                </div>
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-teal-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium text-slate-700">описание:</span>
                                    {occasion_data.description || 'нет описания'}
                                </div>
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <div className="w-4 h-4 flex items-center justify-center text-slate-400 mt-0.5 flex-shrink-0">
                                        <i className="ri-map-pin-2-line text-sm"></i>
                                    </div>
                                    <span className="font-medium text-slate-700">место проведения:</span>
                                    {occasion_data.address || 'адрес не указан'}
                                </div>
                                {scriptLoaded && occasion_data?.location ? (
                                    <div className='mt-4 h-64 rounded-xl overflow-hidden border border-slate-200' id='occ_map'></div>
                                ) : (
                                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mt-4">
                                        Карта недоступна
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end pt-4 border-slate-200">
                                <button 
                                    onClick={onCloseButtonClick}
                                    className="px-5 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                                >
                                    Закрыть
                                </button>
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
