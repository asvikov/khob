import ReactDOM from 'react-dom';
import AjaxQuery from "../services/AjaxOuery";
import { useEffect, useState } from 'react';
import FormatDate from "../services/FormatDate";


const Modal = ({ show, onCloseButtonClick, occasion_id }) => {
    const [occasion, setOccasion] = useState({});
    const request_url = '/api/occasions/'+occasion_id;
    const FormDate = new FormatDate();

    useEffect(() => {
        if (!show) return;

        let isMounted = true;

        const waitForYmaps = () => {
            return new Promise((resolve) => {

                if (!window.ymaps) {
                    const ym_script = document.createElement('script');
                    ym_script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=55d6c42e-805f-4e65-86ab-44572603cf16&suggest_apikey=7e0fc23a-c030-4ac3-90c0-d0ac211eb101';
                    ym_script.type = 'text/javascript';
                    ym_script.async = true;

                    ym_script.onload = () => {
                        window.ymaps.ready(resolve);
                    };

                    ym_script.onerror = () => {
                        console.error('Ошибка загрузки Яндекс.Карт');
                        resolve();
                    };

                    document.body.appendChild(ym_script);
                } else {
                    window.ymaps.ready(resolve);
                }
            });
        }

        const fetchData = () => {
            return new Promise((resolve, reject) => {
                AjaxQuery(
                    request_url,
                    (response) => {
                        if (response.status === 200 && response.data?.id) {
                            resolve(response.data);
                        } else {
                            reject(new Error('Неверные данные от сервера'));
                        }
                    },
                    'GET'
                );
            });
        }

        Promise.all([waitForYmaps(), fetchData()])
        .then(([_, occasionData]) => {
            if (!isMounted) return;
            setOccasion(occasionData);
            initMap(occasionData);
        })
        .catch((error) => {
            console.error("Ошибка при загрузке данных или карт:", error);
        });

        return () => {
            isMounted = false;
        };
    }, [show, occasion_id]);

    const initMap = (response) => {
        response.location[0] = Number(response.location[0]);
        response.location[1] = Number(response.location[1]);
        //change into array

        const yandexMap = new window.ymaps.Map("occ_map", {
            center: response.location,
            zoom: 12
        });

        yandexMap.geoObjects.removeAll();

        const placemark = new window.ymaps.Placemark(
            response.location,
            {
                iconCaption: "Загрузка адреса...",
            },
            {
                preset: "islands#blueDotIconWithCaption",
            }
        );

        placemark.properties.set({
            iconCaption: response.address,
            balloonContent: response.address,
        });

        yandexMap.geoObjects.add(placemark);
    }

    if (!show) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-wrapper-occ">
            <div className='modal-white-bacgound'>
                <div className="modal-content">
                    <div>
                        <div><span className="modal-occ-name-p">начало события: </span>{occasion.start ? FormDate.toView(occasion.start) : ''}</div>
                        <div><span className="modal-occ-name-p">окончание события: </span>{occasion.end ? FormDate.toView(occasion.end) : ''}</div>
                        <div><span className="modal-occ-name-p">описание: </span>{occasion.description}</div>
                        <div><span className="modal-occ-name-p">место проведения: </span>{occasion.address}</div>
                        <div className='modal-occ-map' id='occ_map'></div>
                    </div>
                    <div className="modal-actions">
                        <button onClick={onCloseButtonClick}>Закрыть</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default Modal;
