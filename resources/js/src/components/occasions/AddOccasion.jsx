import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import FormValidateService from "../../services/FormValidateService";
import AjaxQuery from "../../services/AjaxOuery";
import FormatDate from "../../services/FormatDate";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddOccasion = ({hideFunc, addFunc, show = true, occasion_id = null}) => {

    const [formData, setFormData] = useState({
        start: '',
        end: '',
        description: '',
        address: 'начните вводить адрес или укажите на карте',
        location: []
    });

    const [initialFormData, setInitialFormData] = useState({});
    const [corr_inputs, setCorrInputs] = useState({});
    let is_corr = {};
    const [error_message, setErrorMessage] = useState('');
    const [mapInitialized, setMapInitialized] = useState(false);
    const valid = new FormValidateService();
	const FormDate = new FormatDate();

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
            setMapInitialized(false);
            setCorrInputs({});
            setErrorMessage('');
            return;
        }

        let isMounted = true;

        const waitForYmaps = () => {
            return new Promise((resolve) => {
                if (window.ymaps) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=55d6c42e-805f-4e65-86ab-44572603cf16&suggest_apikey=7e0fc23a-c030-4ac3-90c0-d0ac211eb101';
                script.type = 'text/javascript';
                script.async = true;

                script.onload = () => {
                    window.ymaps.ready(resolve);
                };

                script.onerror = () => {
                    console.error('Ошибка загрузки Яндекс.Карт');
                    resolve();
                };

                document.body.appendChild(script);
            });
        }

        const fetchData = () => {
            return new Promise((resolve, reject) => {
                const request_url = `/api/occasions/${occasion_id}`;
                AjaxQuery(
                    request_url,
                    (response) => {
                        if (response.status === 200 && response.data) {
                            resolve(response.data);
                        } else {
                            reject(new Error('Неверные данные от сервера'));
                        }
                    },
                    'GET'
                );
            });
        }

        const initializeComponent = async () => {
            try {
                await waitForYmaps();
                
                let occasionData = null;
                if (occasion_id) {
                    occasionData = await fetchData();
                }

                if (!isMounted) return;

                // Обновляем форму данными
                if (occasionData && typeof(occasionData) === 'object') {
                    setFormData({
                        start: occasionData.start || '',
                        end: occasionData.end || '',
                        description: occasionData.description || '',
                        address: occasionData.address || 'начните вводить адрес или укажите на карте',
                        location: occasionData.location || []
                    });
                    setInitialFormData(occasionData);
                } else {
                    // Сбрасываем форму для создания нового события
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
                }

                // Инициализируем карту
                initMap(occasionData);
                setMapInitialized(true);
                
            } catch (error) {
                console.error("Ошибка при загрузке данных или карт:", error);
            }
        };

        initializeComponent();

        return () => {
            isMounted = false;
        };
    }, [show, occasion_id]);

    const initMap = (occasion = null) => {
        const mapElement = document.getElementById('occ_add_map');
        if (!mapElement) return;

        // Очищаем предыдущую карту
        mapElement.innerHTML = '';

        const yandexMap = new window.ymaps.Map("occ_add_map", {
            center: [45.035470, 38.975313],
            zoom: 12
        });

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
            addPoint(point, address);
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
                    addPoint(coords, address);
                }
            } catch (error) {
                console.error("Ошибка геокодирования:", error);
            }
        });

        const addPoint = (coords, address) => {
            yandexMap.geoObjects.removeAll();

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

            yandexMap.geoObjects.add(placemark);
        }

        if (occasion && occasion.location && occasion.location.length === 2 && occasion.address) {
            yandexMap.setCenter(occasion.location, 15);
            addPoint(occasion.location, occasion.address);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        valid.resetLastChecks();
        is_corr = {};

        is_corr.start = valid.required().dateTimeSql().setAccuracyDateTime(1800000).dateTimeLater().check(FormDate.toSQLDateTime(formData.start));
        is_corr.description = valid.min(5).check(formData.description);
        is_corr.location = valid.required().check(formData.location);

        if(formData.end) {
            is_corr.end = valid.dateTimeSql().dateTimeLater().check(FormDate.toSQLDateTime(formData.end));
        }

        if (!valid.lastChecks()) {
            setErrorMessage('исправьте поля выделенные красным');
            setCorrInputs(is_corr);
            valid.resetLastChecks();
        } else {
            let data = {};

            if(initialFormData.start !== FormDate.toSQLDateTime(formData.start)) {
                data.start = FormDate.toSQLDateTime(formData.start);
            }

            if(formData.end && (initialFormData.end !== FormDate.toSQLDateTime(formData.end))) {
                data.end = FormDate.toSQLDateTime(formData.end);
            }

            if(initialFormData.description !== formData.description) {
                data.description = formData.description;
            }

            if(initialFormData.address !== formData.address) {
                data.address = formData.address;
            }

            if((initialFormData.location[0] !== formData.location[0]) || (initialFormData.location[1] !== formData.location[1])) {
                data.location = formData.location;
            }

            if(occasion_id) {
                let url = '/api/occasions/' + occasion_id;
                AjaxQuery(url, handleResponse, 'PUT', data);
            } else {
                AjaxQuery('/api/occasions', handleResponse, 'POST', data);
            }
        }
    }

    const handleDelete = () => {
        let url = '/api/occasions/' + occasion_id;
        AjaxQuery(url, handleDeleteResponse, 'DELETE');
    }

    const handleDeleteResponse = (response) => {
        if(response.status === 200) {
            addFunc(response.data, 'delete');
            hideFunc();
        }
    }

    const handleResponse = (response) => {
        if((response.status === 200) && !!response.data) {
            const action = occasion_id ? 'edit' : 'add';
            addFunc(response.data, action);
            hideFunc();
        }
    }

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
    }

    if (!show) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-wrapper-occ">
            <div className="modal-white-bacgound">
                <div className="modal-content">
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
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddOccasion;