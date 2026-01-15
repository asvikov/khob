import { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import FormValidateService from "../../services/FormValidateService";
import FormatDate from "../../services/FormatDate";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
        <div className="modal-wrapper-occ">
            <div className="modal-white-bacgound">
                <div className="modal-content">
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3">Загрузка карты и данных...</p>
                        </div>
                    ) : dataError ? (
                        <div className="alert alert-danger">
                            Ошибка загрузки данных: {dataError.message}
                            <Button variant="secondary" onClick={hideFunc} className="mt-3">
                                Закрыть
                            </Button>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>начало события</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    className={(corr_inputs.start === false) ? 'is-invalid' : ''}
                                    onChange={(e) => { handleChange('start', e.target.value) }}
                                    value={FormDate.toInputDateTime(formData.start)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>окончание события (не обязательно)</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    className={(corr_inputs.end === false) ? 'is-invalid' : ''}
                                    onChange={(e) => { handleChange('end', e.target.value) }}
                                    value={FormDate.toInputDateTime(formData.end)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>описание события</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    className={(corr_inputs.description === false) ? 'is-invalid' : ''}
                                    onChange={(e) => { handleChange('description', e.target.value) }}
                                    value={formData.description}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className={(corr_inputs.location === false) ? 'text-danger' : ''}>
                                    Адрес: {formData.address}
                                </Form.Label>
                                <div id='occ_add_map' className="occ-add-map"></div>
                            </Form.Group>
                            <Form.Group className="mb-3 occ-save-gr-butt">
                                {occasion_id && (<div role='button' onClick={handleDelete}>удалить ✘</div>)}
                                <div className='mb-2 text-danger'>{error_message}</div>
                                <Button variant='primary' type="submit">Сохранить</Button>
                                <Button variant='secondary' onClick={hideFunc}>Отмена</Button>
                            </Form.Group>
                        </Form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddOccasion;
