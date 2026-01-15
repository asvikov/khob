import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import authService from "../../services/authService";
import AddOccasion from "./AddOccasion";
import FormatDate from "../../services/FormatDate";
import useToggleModal from "../../hooks/useToggleModal";
import ShowModal from "./ShowModal";
import EditSvg from "../../svg/EditSvg";
import { useOccasions } from "../../hooks/useOccasions";

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
        <Container>
            <div>{!isShowingModalEdit && (<div onClick={() => { showModalEdit(null); }} className="btn btn-success">добавить событие</div>)}</div>
            <div>{Array.isArray(data) && data.length > 0 && data.map((item) => {
                return (
                <div key={item.id} className="occ-mar-t">
                    <div className="d-sm-flex"><div role="button" onClick={() => { showModalEdit(item.id) }}><EditSvg /></div></div>
                    <div><span className="occ-name-p">начало события: </span>{FormDate.toView(item.start)}</div>
                    {item.end ? (<div><span className="occ-name-p">окончание события: </span>{FormDate.toView(item.end)}</div>) : ('')}
                    <div><span className="occ-name-p">описание: </span>{item.description}</div>
                    <div><span className="occ-name-p">место проведения: </span>{item.address}</div>
                    <div className="occ-link" onClick={() => { showModal(item.id) }}>посмотреть событие</div>
                </div>
                );
            })}</div>
            <ShowModal show={isShowingModal} onCloseButtonClick={toggleModal} occasion_id={modal_occasion_id} />
            <AddOccasion hideFunc={toggleModalEdit} show={isShowingModalEdit} occasion_id={modal_occasion_edit_id} />
        </Container>
    );
}

export default Occasion;
