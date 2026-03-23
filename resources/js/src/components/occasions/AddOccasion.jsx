import { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import FormValidateService from "../../services/FormValidateService";
import FormatDate from "../../services/FormatDate";
import { useQueryClient } from '@tanstack/react-query';
import { useOccasion, useCreateOccasion, useUpdateOccasion, useDeleteOccasion } from "../../hooks/useOccasions";

const AddOccasion = ({ hideFunc, show = true, occasion_id = null }) => {
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        description: '',
        address: 'начните вводить адрес или укажите на карте',
        location: []
    });

    const [initialFormData, setInitialFormData] = useState({});
    const [corr_inputs, setCorrInputs] = useState({});
    const [error_message, setErrorMessage] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const mapInstanceRef = useRef(null);
    const valid = new FormValidateService();
    const FormDate = new FormatDate();
    const queryClient = useQueryClient();
    const { data: occasion, isLoading: isLoadingData, error: dataError } = useOccasion(occasion_id);
    const { mutate: createOccasion, isPending } = useCreateOccasion({
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
            queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
            hideFunc();
        }
    });
    const { mutate: updateOccasion} = useUpdateOccasion({
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['occasion', variables.occasionId] });
            queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
            queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
            hideFunc();
        }
    });
    const { mutate: deleteOccasion } = useDeleteOccasion({
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
            queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
            hideFunc();
        }
    });

    // Загрузка Яндекс.Карт
    useEffect(() => {
        if (!show) return;

        const loadYandexMaps = () => {
            if (window.ymaps) {
                setScriptLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=55d6c42e-805f-4e65-86ab-44572603cf16&suggest_apikey=7e0fc23a-c030-4ac3-90c0-d0ac211eb101';
            script.type = 'text/javascript';
            script.async = true;

            script.onload = () => {
                window.ymaps.ready(() => {
                    setScriptLoaded(true);
                });
            };

            script.onerror = () => {
                console.error('Ошибка загрузки Яндекс.Карт');
                setScriptLoaded(true); // Все равно продолжаем, чтобы не блокировать интерфейс
            };

            document.body.appendChild(script);
        };

        loadYandexMaps();

        return () => {
            // Очистка при скрытии компонента
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [show]);

    // Инициализация формы данными и карты
    useEffect(() => {
        if (!show) {
            // Сбрасываем состояние при скрытии модального окна
            setFormData({
                start: '',
                end: '',
                description: '',
                address: 'начните вводить адрес или укажите на карте',
                location: []
            });
            setCorrInputs({});
            setErrorMessage('');
            setScriptLoaded(false);
            return;
        }

        if (!scriptLoaded || (occasion_id && isLoadingData)) {
            return;
        }

        // Если мы редактируем существующее событие
        if (occasion_id && occasion) {
            setFormData({
                start: occasion.start || '',
                end: occasion.end || '',
                description: occasion.description || '',
                address: occasion.address || 'начните вводить адрес или укажите на карте',
                location: occasion.location || []
            });
            setInitialFormData(occasion);
            initMap(occasion);
        } else if (!occasion_id) {
            // Создание нового события
            setFormData({
                start: '',
                end: '',
                description: '',
                address: 'начните вводить адрес или укажите на карте',
                location: []
            });
            setInitialFormData({
                start: '',
                end: '',
                description: '',
                address: 'начните вводить адрес или укажите на карте',
                location: []
            });
            initMap(null);
        }
    }, [show, occasion_id, scriptLoaded, isLoadingData, occasion]);

    const initMap = (map_occasion_data = null) => {
        const mapElement = document.getElementById('occ_add_map');
        if (!mapElement || !window.ymaps) return;

        // Очищаем предыдущую карту
        mapElement.innerHTML = '';

        const yandexMap = new window.ymaps.Map("occ_add_map", {
            center: [45.035470, 38.975313],
            zoom: 12
        });

        mapInstanceRef.current = yandexMap;

        // Создаем поисковую панель
        const searchControl = new window.ymaps.control.SearchControl({
            options: {
                provider: 'yandex#search',
                noPlacemark: true,
                resultsPerPage: 5,
                size: 'large'
            }
        });

        yandexMap.controls.add(searchControl);

        searchControl.events.add('resultselect', function (e) {
            yandexMap.geoObjects.removeAll();
            let results = searchControl.getResultsArray();
            let selected = e.get('index');
            let point = results[selected].geometry.getCoordinates();
            let address = results[selected].properties.get('name');
            handleChange('location', point);
            handleChange('address', address);
            addPoint(point, address, yandexMap);
        });

        yandexMap.events.add("click", async (e) => {
            const coords = e.get("coords");

            try {
                const res = await window.ymaps.geocode(coords);
                const firstGeoObject = res.geoObjects.get(0);

                if (firstGeoObject) {
                    const address = firstGeoObject.getAddressLine();
                    handleChange('location', coords);
                    handleChange('address', address);
                    addPoint(coords, address, yandexMap);
                }
            } catch (error) {
                console.error("Ошибка геокодирования:", error);
            }
        });

        if (map_occasion_data && map_occasion_data.location && map_occasion_data.location.length === 2 && map_occasion_data.address) {
            yandexMap.setCenter(map_occasion_data.location, 15);
            addPoint(map_occasion_data.location, map_occasion_data.address, yandexMap);
        }
    };

    const addPoint = (coords, address, map) => {
        if (!map) return;

        map.geoObjects.removeAll();

        const placemark = new window.ymaps.Placemark(
            coords,
            {
                iconCaption: address,
                balloonContent: address,
            },
            {
                preset: "islands#blueDotIconWithCaption",
            }
        );

        map.geoObjects.add(placemark);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        valid.resetLastChecks();
        let is_corr = {};

        is_corr.start = valid.required().dateTimeSql().setAccuracyDateTime(1800000).dateTimeLater().check(FormDate.toSQLDateTime(formData.start));
        is_corr.description = valid.min(5).check(formData.description);
        is_corr.location = valid.required().check(formData.location);

        if (formData.end) {
            is_corr.end = valid.dateTimeSql().dateTimeLater().check(FormDate.toSQLDateTime(formData.end));
        }

        if (!valid.lastChecks()) {
            setErrorMessage('исправьте поля выделенные красным');
            setCorrInputs(is_corr);
            valid.resetLastChecks();
        } else {
            let data = {};

            if (initialFormData.start !== FormDate.toSQLDateTime(formData.start)) {
                data.start = FormDate.toSQLDateTime(formData.start);
            }

            if (formData.end && (initialFormData.end !== FormDate.toSQLDateTime(formData.end))) {
                data.end = FormDate.toSQLDateTime(formData.end);
            }

            if (initialFormData.description !== formData.description) {
                data.description = formData.description;
            }

            if (initialFormData.address !== formData.address) {
                data.address = formData.address;
            }

            if ((initialFormData.location[0] !== formData.location[0]) || (initialFormData.location[1] !== formData.location[1])) {
                data.location = formData.location;
            }

            if (occasion_id) {
                updateOccasion({ occasionId: occasion_id, occasionData: data});
            } else {
                createOccasion(data);
            }
        }
    };

    const handleDelete = () => {
        deleteOccasion(occasion_id);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Сбрасываем ошибку для поля при изменении
        if (corr_inputs[field] === false) {
            setCorrInputs(prev => ({
                ...prev,
                [field]: true
            }));
        }
    };

    if (!show) {
        return null;
    }

    // Проверяем состояние загрузки
    const isLoading = !scriptLoaded || (occasion_id && isLoadingData);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
                <form className="px-6 py-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Начало</label>
                            <input
                                type="datetime-local"
                                className={`w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${corr_inputs.start === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                onChange={(e) => { handleChange('start', e.target.value) }}
                                value={FormDate.toInputDateTime(formData.start)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Конец</label>
                            <input
                                type="datetime-local"
                                className={`w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${corr_inputs.end === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                onChange={(e) => { handleChange('end', e.target.value) }}
                                value={FormDate.toInputDateTime(formData.end)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            описание события
                        </label>
                        <textarea
                            rows={3}
                            className={`w-full px-3 py-2.5 text-sm border ${corr_inputs.description === false ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all resize-none`}
                            onChange={(e) => { handleChange('description', e.target.value) }}
                            value={formData.description}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Категория</label>
                        <div className="flex flex-wrap gap-2 w-full">
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-teal-500 text-white"
                            >
                                Культура
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                Технологии
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                Спорт
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                Мастер-классы
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                Музыка
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                Еда
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${corr_inputs.location === false ? 'text-red-600' : 'text-slate-700'
                            }`}>
                            Место проведения: {formData.address}
                        </label>
                        <div id='occ_add_map' className="w-full h-72 rounded-xl overflow-hidden border border-slate-200"></div>
                    </div>


                    <div className="flex gap-3 pt-1">
                        {error_message && (
                            <span className="text-red-600 text-sm">{error_message}</span>
                        )}
                        <button
                            type="button"
                            onClick={hideFunc}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddOccasion;
