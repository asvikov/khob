import {useEffect, useState} from "react";
import AjaxQuery from "../../services/AjaxOuery";
import Container from "react-bootstrap/Container";
import AuthService from "../../services/AuthService";
import AddOccasion from "./AddOccasion";
import FormatDate from "../../services/FormatDate";
import useToggleModal from "../../hooks/useToggleModal";
import ShowModal from "./ShowModal";
import EditSvg from "../../svg/EditSvg";

const Occasion = () => {
    const location = window.location.pathname;
    const [occasion_list, setOccasionList] = useState([]);
    const Auth = new AuthService();
    const FormDate = new FormatDate();
    const [isShowingModal, toggleModal] = useToggleModal();
    const [isShowingModalEdit, toggleModalEdit] = useToggleModal();
    const [modal_occasion_id, setModalOccasionId] = useState(false);
    const [modal_occasion_edit_id, setModalOccasionEditId] = useState(null);

    useEffect(() => {
        let data = {};
        let url_query;

        if(location === '/occasions') {
            data.location = 'occasions';
        }

        if(!Auth.check()) {
            url_query = '/api/welcome';
        } else {
            url_query = '/api/occasions';
        }

        AjaxQuery(url_query, handleResponse, 'GET', data);
    }, [location]);

    const showModal = (id) => {
        setModalOccasionId(id);
        toggleModal();
    }

    const showModalEdit = (id) => {
        setModalOccasionEditId(id);
        toggleModalEdit();
    }

    const html_occasions = occasion_list.map(function(item) {
        return (
            <div key={item.id} className="occ-mar-t">
                <div className="d-sm-flex"><div role="button" onClick={() => {showModalEdit(item.id)}}><EditSvg /></div></div>
                <div><span className="occ-name-p">начало события: </span>{FormDate.toView(item.start)}</div>
                {item.end ? (<div><span className="occ-name-p">окончание события: </span>{FormDate.toView(item.end)}</div>) : ('')}
                <div><span className="occ-name-p">описание: </span>{item.description}</div>
                <div><span className="occ-name-p">место проведения: </span>{item.address}</div>
                <div className="occ-link" onClick={() => {showModal(item.id)}}>посмотреть событие</div>
            </div>
        );
    });

    const handleResponse = (responce) => {
        if((responce.status === 200) && !!responce.data) {
            setOccasionList(responce.data);
        }
    }

    const addToListOcc = (par_add, action = 'add') => {
        if(action === 'add') {
            let new_occ_list = [...occasion_list, par_add];
            setOccasionList(new_occ_list);
        } else if (action === 'edit') {
            let new_occ_list = occasion_list.map(item => 
                item.id === par_add.id ? par_add : item
            );
            setOccasionList(new_occ_list);
        } else if (action === 'delete') {
            let new_occ_list = occasion_list.filter((item) => {
                return item.id !== par_add.id;
            });
            setOccasionList(new_occ_list);
        }
    }

    return (
        <Container>
            <div>{!isShowingModalEdit && (<div onClick={() => {showModalEdit(null);}} className="btn btn-success">добавить событие</div>)}</div>
            <div>{html_occasions}</div>
            <ShowModal show={isShowingModal} onCloseButtonClick={toggleModal} occasion_id={modal_occasion_id} />
            <AddOccasion hideFunc={toggleModalEdit} addFunc={addToListOcc} show={isShowingModalEdit} occasion_id={modal_occasion_edit_id} />
        </Container>
    );
}

export default Occasion;
