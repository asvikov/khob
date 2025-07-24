const AjaxQuery = async function fetchData(url, set_data_fn, method_query = 'GET', parametrs = {}) {

    console.log('ajax go');

    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};

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

        if(response.ok || response.status === 422) {
            let result = {};
            result.data = await response.json();
            result.status = response.status;
            set_data_fn(result);
        }
    } catch (error) {
        set_data_fn({});
    }
}

export default AjaxQuery;
