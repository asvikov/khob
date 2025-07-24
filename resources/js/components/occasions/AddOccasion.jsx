import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormValidateService from "../services/FormValidateService";
import AjaxQuery from "../services/AjaxOuery";

const AddOccasion = ({hideFunc, addFunc}) => {

    const [query_data, setQueryData] = useState(false);
    const [date_start, setDateStart] = useState('');
    const [date_end, setDateEnd] = useState('');
    const [description, setDescription] = useState('');
    const [address_text, setAddressText] = useState('начните вводить адрес или укажите на карте');
    const [coords_picked, setCoordsPicked] = useState([]);
    const [corr_inputs, setCorrInputs] = useState({});
    const [error_message, setErrorMessage] = useState('');
    const valid = new FormValidateService();

    useEffect(() => {
        //const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
        if (!window.ymaps) {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=55d6c42e-805f-4e65-86ab-44572603cf16&suggest_apikey=7e0fc23a-c030-4ac3-90c0-d0ac211eb101';
            script.type = 'text/javascript';
            script.async = true;

            script.onload = () => {
                window.ymaps.ready(initMap);
            };

            script.onerror = () => {
                console.error('Ошибка загрузки Яндекс.Карт');
            };

            document.body.appendChild(script);
        } else {
            initMap();
        }
    }, []);

    const initMap = () => {
        const yandexMap = new window.ymaps.Map("occ_add_map", {
            center: [45.035470, 38.975313],
            zoom: 12
        });

        // Создаем поисковую панель
        const searchControl = new window.ymaps.control.SearchControl({
            options: {
              provider: 'yandex#search',
              boundedBy: yandexMap.getBounds(), // Ограничиваем поиск видимой областью
              strictBounds: true, // Строго ограничивать поиск
              noPlacemark: true, // Показывать метку
              resultsPerPage: 5, // Количество результатов
              size: 'large', // Размер контрола
              noPopup: false // Показывать попап с результатами
            }
          });

        yandexMap.controls.add(searchControl);
        yandexMap.geoObjects.removeAll();

        // При изменении границ карты обновляем boundedBy
        yandexMap.events.add('boundschange', () => {
            searchControl.options.set('boundedBy', yandexMap.getBounds());
        });

        searchControl.events.add('resultselect', function (e) {
            yandexMap.geoObjects.removeAll();
            // Получает массив результатов.
            let results = searchControl.getResultsArray();
            // Индекс выбранного объекта.
            let selected = e.get('index');
            // Получает координаты выбранного объекта.
            let point = results[selected].geometry.getCoordinates();
            let address = results[selected].properties.get('name');
            setCoordsPicked(point);
            setAddressText(address);
        });

        yandexMap.events.add("click", async (e) => {
            const coords = e.get("coords"); // Получаем координаты клика

            // Геокодирование координат в адрес
            try {
                const res = await window.ymaps.geocode(coords);
                const firstGeoObject = res.geoObjects.get(0);

                if (firstGeoObject) {
                    const address = firstGeoObject.getAddressLine();

                    // Можно передать адрес и координаты в состояние React
                    setCoordsPicked(coords);
                    setAddressText(address);
                    addPoint(coords, address);
                }
            } catch (error) {
                console.error("Ошибка геокодирования:", error);
            }
        });

        const addPoint = (coords, address) => {
            // Удаляем предыдущую метку (если есть)
            yandexMap.geoObjects.removeAll();

            // Добавляем новую метку
            const placemark = new window.ymaps.Placemark(
                coords,
                {
                    iconCaption: "Загрузка адреса...",
                },
                {
                    preset: "islands#blueDotIconWithCaption",
                }
            );

            placemark.properties.set({
                iconCaption: address,
                balloonContent: address,
            });

            yandexMap.geoObjects.add(placemark);
        }
    }

    const replaceDate = (date) => {
        let rep_date = date.replace('T', ' ');
        let sec = ':00';
        rep_date = rep_date + sec;
        return rep_date;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let is_corr = {
            'start': valid.required().dateTimeSql().setAccuracyDateTime(1800000).dateTimeLater().check(date_start),
            'description': valid.min(5).check(description),
            'location': valid.required().check(coords_picked)
        };

        if(date_end) {
            is_corr.end = valid.dateTimeSql().dateTimeLater().check(date_end);
        }

        if (!valid.lastChecks()) {
            setCorrInputs(is_corr);
            setErrorMessage('исправьте поля выделенные красным');
            valid.resetLastChecks();
        } else {
            let data = {
                'start': date_start,
                'description': description,
                'address': address_text,
                'location': coords_picked
            }

            if(date_end) {
                data.end = date_end;
            }

            AjaxQuery('/api/occasions', handleResponse, 'POST', data);
        }
    }

    const handleResponse = (responce) => {
        if((responce.status === 200) && !!responce.data) {
            addFunc(responce.data);
            hideFunc();
        }
    }

    const handleCancel = () => {
        hideFunc();
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleDateStart = (event) => {
        let date = event.target.value;

        if(date) {
            date = replaceDate(event.target.value);
        }
        setDateStart(date);
    }

    const handleDateEnd = (event) => {
        let date = event.target.value;

        if(date) {
            date = replaceDate(event.target.value);
        }
        setDateEnd(date);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" >
                <Form.Label >начало события</Form.Label>
                <Form.Control type="datetime-local" className={(corr_inputs.start === false) ? 'is-invalid' : ''} onChange={handleDateStart} />
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>окончание события (не обязательно)</Form.Label>
                <Form.Control type="datetime-local" className={(corr_inputs.end === false) ? 'is-invalid' : ''} onChange={handleDateEnd} />
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>описание события</Form.Label>
                <Form.Control as="textarea" rows={3} className={(corr_inputs.description === false) ? 'is-invalid' : ''} value={description} onChange={handleDescription} />
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label className={(corr_inputs.location === false) ? 'text-danger' : ''}>Адрес: {address_text}</Form.Label>
                <div id='occ_add_map' className="occ-add-map"></div>
            </Form.Group>
            <Form.Group className="mb-3 occ-save-gr-butt" >
                <div className='mb-2 text-danger'>{error_message}</div>
                <Button variant='primary' type="submit">Сохранить</Button>
                <Button variant='primary' onClick={handleCancel}>Отмена</Button>
            </Form.Group>
        </Form>
    );
}

export default AddOccasion;

