import {useState} from 'react';
import { useLogin } from '../../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error_message, setErrorMessage] = useState('');
    const { mutate: login, isPending } = useLogin({
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        let request_body = {
            'email':email,
            'password':password,
        };

        login(request_body);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                        <input
                            type='email'
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            value={email}
                            placeholder='введите свой email'
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
                        <input
                            type='password'
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            value={password}
                            placeholder='введите пароль'
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={isPending}
                        className="w-full px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <div className='text-danger text-sm mt-4'>{error_message}</div>

            </div>
        </div>
    );
}

export default Login;
