import React, { useState } from 'react';
import FormValidateService from '../../services/FormValidateService';
import { useRegister } from '../../hooks/useAuth';
import { useUsersForRegister } from '../../hooks/useUsers';

const Register = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conf_password, setConfPassword] = useState('');
    const [radio_val, setRadioVal] = useState('own');
    const [pn_options, setPnOptions] = useState(false);
    const [parent_id, setParentId] = useState(false);
    const [parent_elem, setParentElem] = useState('');
    const [error_message, setErrorMessage] = useState('');
    const [corr_inputs, setCorrInputs] = useState({});
    const [searchName, setSearchName] = useState('');
    const valid = new FormValidateService();
    const { mutate: register } = useRegister({
        onError: (error) => {
            if(error.status === 422) {
                setErrorMessage(error.message);
            }
        }
    });
    const { data: users, isLoading, error } = useUsersForRegister(searchName);

    const handleSubmit = (event) => {
        event.preventDefault();
        let is_corr = {
            'first_name':valid.min(4).check(first_name),
            'last_name':valid.min(4).check(last_name),
            'email':valid.email().check(email),
            'password':valid.equal(conf_password).min(4).check(password)
        };

        if(!valid.lastChecks()) {
            setCorrInputs(is_corr);
            setErrorMessage('исправьте поля выделенные красным');
            valid.resetLastChecks();
        } else {
            let data = {
                'first_name':first_name,
                'last_name':last_name,
                'email':email,
                'password':password
            }

            if(parent_id) {
                data.parent_id = parent_id;
            }
            register(data);
        }
    }

    const handleRadio = (event) => {
        setRadioVal(event.target.value);

        if(event.target.value === 'own') {
            setParentId(false);
            setPnOptions(false);
        }
    }

    const handleParentName = (event) => {
        if(event.target.value.length > 2) {
            let susname = event.target.value.trim();
            setSearchName(susname);
            setPnOptions(true);
        } else {
            setPnOptions(false);
        }
    }

    const handlePickParUser = (user) => {
        setParentId(user.id);
        setPnOptions(false);
        setParentElem(
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img src={user.img_src} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>{user.name+' '+user.last_name}</div>
                <button role='button' onClick={handleDelParUs} className="ml-auto text-red-500 hover:text-red-700">
                    &#10060;
                </button>
            </div>
        );
    }

    const handleDelParUs = () => {
        setParentId(false);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h1 className="text-2xl font-semibold text-slate-800 mb-6">Регистрация</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Имя</label>
                            <input
                                type='text'
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${
                                    corr_inputs.first_name === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                value={first_name}
                                placeholder='введите имя'
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Фамилия</label>
                            <input
                                type='text'
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${
                                    corr_inputs.last_name === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                value={last_name}
                                placeholder='введите фамилию'
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type='email'
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${
                                    corr_inputs.email === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                value={email}
                                placeholder='введите свой email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
                            <input
                                type='password'
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${
                                    corr_inputs.password === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                value={password}
                                placeholder='введите пароль'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Подтверждение пароля</label>
                            <input
                                type='password'
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all ${
                                    corr_inputs.password === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                value={conf_password}
                                placeholder='подтвердите пароль'
                                onChange={(e) => setConfPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-5 space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type='radio'
                                    name='group1'
                                    value='own'
                                    checked={radio_val === 'own'}
                                    onChange={handleRadio}
                                    className="h-4 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-slate-700">основной аккаунт</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type='radio'
                                    name='group1'
                                    value='coown'
                                    checked={radio_val === 'coown'}
                                    onChange={handleRadio}
                                    className="h-4 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-slate-700">аккаунт помошник. Создайте такой аккаунту, чтобы следить или помогать основному аккаунту (рекомендуется родителям)</span>
                            </label>
                        </div>
                        <div className={`mb-5 ${parent_id ? 'hidden' : ''}`}>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">К кому вы хотите прсоединиться</label>
                            <input
                                type='text'
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all disabled:bg-slate-100"
                                placeholder='начните вводить имя'
                                disabled={radio_val === 'own'}
                                onChange={handleParentName}
                            />
                            <div className={`relative mt-1 ${pn_options ? '' : 'hidden'}`}>
                                <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {Array.isArray(users) && users.length > 0 && users.map((user) => {
                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                                onClick={() => handlePickParUser(user)}
                                            >
                                                <img
                                                    src={user.avatar ? user.avatar : '/storage/img/no_img_avatar.webp'}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>{user.name + ' ' + user.last_name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={parent_id ? '' : 'hidden'}>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                {parent_elem}
                            </div>
                        </div>
                        <div className="text-red-600 text-sm mb-4">{error_message}</div>
                        
                        <button
                            type='submit'
                            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
