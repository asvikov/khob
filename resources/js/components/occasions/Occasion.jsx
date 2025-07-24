import {useEffect, useState} from "react";
import AjaxQuery from "../services/AjaxOuery";
import Container from "react-bootstrap/Container";
import AuthService from "../services/AuthService";
import AddOccasion from "./AddOccasion";
import FormatDate from "../services/FormatDate";
import useToggleModal from "../hooks/useToggleModal";
import Modal from "./Modal";

const Occasion = () => {
    const location = window.location.pathname;
    const [occasion_list, setOccasionList] = useState([]);
    const Auth = new AuthService();
    const [add_occasion, setAddOccasion] = useState(false);
    const FormDate = new FormatDate();
    const [isShowingModal, toggleModal] = useToggleModal();
    const [modal_occasion_id, setModalOccasionId] = useState(false);

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

    const html_occasions = occasion_list.map(function(item) {
        return (
            <div key={item.id} className="occ-mar-t">
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

    const hideAddOcc = () => {
        setAddOccasion(false);
    }

    const addToListOcc = (par_add) => {
        let new_occ_list = [...occasion_list, par_add];
        setOccasionList(new_occ_list);
    }

    const handleAddOccasion = () => {
        setAddOccasion(true);
    }

    return (
        <Container>
            <div>{add_occasion ? (
                <AddOccasion hideFunc={hideAddOcc} addFunc={addToListOcc} />
                ) : (
                <div onClick={handleAddOccasion} className="btn btn-success">добавить событие</div>
                )}
            </div>
            <div>{html_occasions}</div>
            <Modal show={isShowingModal} onCloseButtonClick={toggleModal} occasion_id={modal_occasion_id} />
        </Container>
    );
}

export default Occasion;
