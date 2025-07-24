import React from 'react';
import { useEffect, useState } from 'react';
import AjaxQuery from '../../services/AjaxOuery';
import { useNavigate } from 'react-router-dom';

const Users = () => {

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
       AjaxQuery('/api/users', handleResponse);
    }, []);

    const handleResponse = (responce) => {
        if((responce.status === 200) && !!responce.data) {
            setData(responce.data);
        }
    }

    const html_data = data.map(function(item) {
        return <li key={item.id}>{item.name} {item.email}</li>;
    });

    return (
        <ul>
            {html_data}
        </ul>
    );
}

export default Users;
