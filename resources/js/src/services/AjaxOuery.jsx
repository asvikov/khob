const AjaxQuery = async function fetchData(url, set_data_fn, method_query = 'GET', parametrs = {}) {

    console.log('ajax go');

    const getUserFromStorage = () => {
        let st_user = localStorage.getItem('user');

        if(st_user !== null && st_user.length) {

            try {
                return JSON.parse(st_user);
            } catch (error) {
                console.error('user in localStorage is not valid JSON');
            }
        } else {
            return {};
        }
    }

    const user = getUserFromStorage();

    let req_options = {
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json;charset=utf-8',
            //'X-XSRF-TOKEN':''
        }
    };


    if(user.bearer_token) {
        req_options.headers.Authorization = 'Bearer '+user.bearer_token
    }


    if(method_query !== 'GET') {
        req_options.method = method_query;
        req_options.body = JSON.stringify(parametrs);
        req_options.credentials = 'omit';
    }

    if(method_query === 'GET') {
        let separ = '?';
        for(let par_name in parametrs) {
            url += separ + par_name + '=' + parametrs[par_name];
            separ = '&';
        }
    }

    try {
        const response = await fetch(url, req_options);

        if(response.status === 401) {
            set_data_fn({'status':401});
        }

        if(response.status === 403) {
            set_data_fn({'status':403});
        }

        if(response.ok || response.status === 422) {
            let result = {};
            result.data = await response.json();
            result.status = response.status;
            
            if(result.data.errors) {
                console.error(result.data.errors);
            }
            set_data_fn(result);
        }
    } catch (error) {
        set_data_fn({});
    }
}

export default AjaxQuery;
