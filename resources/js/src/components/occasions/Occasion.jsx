import {useEffect, useState} from "react";
import authService from "../../services/authService";
import AddOccasion from "./AddOccasion";
import FormatDate from "../../services/FormatDate";
import useToggleModal from "../../hooks/useToggleModal";
import ShowModal from "./ShowModal";
import { useOccasions } from "../../hooks/useOccasions";
import Layout from "../layout/Layout";

const Occasion = () => {
    const [location, setLocation] = useState(window.location.pathname);
    const user = authService.getUser();
    const FormDate = new FormatDate();
    const [isShowingModal, toggleModal] = useToggleModal();
    const [isShowingModalEdit, toggleModalEdit] = useToggleModal();
    const [modal_occasion_id, setModalOccasionId] = useState(false);
    const [modal_occasion_edit_id, setModalOccasionEditId] = useState(null);
    const { data, isLoading, error } = useOccasions(location, user.id);


    useEffect(() => {
        setLocation(window.location.pathname);
    }, [window.location.pathname]);

    const showModal = (id) => {
        setModalOccasionId(id);
        toggleModal();
    }

    const showModalEdit = (id) => {
        setModalOccasionEditId(id);
        toggleModalEdit();
    }

    return (
        <Layout>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Все события</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{Array.isArray(data) ? `${data.length} событий в Краснодаре и области` : '0 событий'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                            <button className="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap bg-white text-slate-800">По дате</button>
                            <button className="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap text-slate-500 hover:text-slate-700">По числу</button>
                            <button className="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap text-slate-500 hover:text-slate-700">По адресу</button>
                        </div>
                        {!isShowingModalEdit && (
                            <button 
                                onClick={() => { showModalEdit(null); }} 
                                className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <i className="ri-add-line text-base"></i>
                                </div>
                                Добавить событие
                            </button>
                        )}
                    </div>
                </div>
            
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                )}
            
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        Ошибка загрузки данных
                    </div>
                )}
            
                {Array.isArray(data) && data.length > 0 && data.map((item) => {
                    return (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-teal-200 transition-all group mb-3"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">Культура</span>
                                        <span className="flex items-center gap-1 text-xs text-slate-400"><i className="ri-group-line"></i>142 участников</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800 mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                                        {item.description}
                                    </h3>
                                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <div className="w-4 h-4 flex items-center justify-center text-teal-500">
                                                <i className="ri-calendar-event-line text-sm"></i>
                                            </div>
                                            <span><span className="font-medium text-slate-600">Начало:</span> {FormDate.toView(item.start)}</span>
                                        </div>
                                        {item.end && (
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <div className="w-4 h-4 flex items-center justify-center text-rose-400">
                                                    <i className="ri-time-line text-sm"></i>
                                                </div>
                                                <span><span className="font-medium text-slate-600">Конец:</span> {FormDate.toView(item.end)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-1.5 mb-3">
                                        <div className="w-4 h-4 flex items-center justify-center text-slate-400 mt-0.5 flex-shrink-0">
                                            <i className="ri-map-pin-2-line text-sm"></i>
                                        </div>
                                        <span className="text-sm text-slate-500">{item.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button 
                                            onClick={() => { showModal(item.id) }}
                                            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
                                        >
                                            Посмотреть событие
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <i className="ri-arrow-down-s-line text-base"></i>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { showModalEdit(item.id) }}
                                    className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-400 hover:text-teal-600 transition-all cursor-pointer flex-shrink-0" 
                                    title="Редактировать"
                                >
                                    <i className="ri-pencil-line text-sm"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            
                {!isLoading && Array.isArray(data) && data.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-500">Событий пока нет</p>
                    </div>
                )}
            </div>
            <ShowModal show={isShowingModal} onCloseButtonClick={toggleModal} occasion_id={modal_occasion_id} />
            <AddOccasion hideFunc={toggleModalEdit} show={isShowingModalEdit} occasion_id={modal_occasion_edit_id} />
        </Layout>
    );
}

export default Occasion;
