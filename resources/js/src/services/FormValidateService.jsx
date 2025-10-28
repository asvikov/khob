
class FormValidateService {

    constructor() {

        this._last_checks = true;
        this._check = true;
        this._todo = {};
        this._accuracy_datetime = 0;
    }

    check(field) {

        for(let key in this._todo) {

            this._check = this[key](field, this._todo[key]);

            if(!this._check) {
                this._last_checks = false;
                break;
            }
        }
        this._todo = {};
        return this._check;
    }

    required(field) {

        if(field === undefined) {
            this._todo.required = false;
            return this;
        } else {

            if(typeof(field) === 'string') {
                return (field.length > 0);
            } else if(typeof(field) === 'number' || typeof(field) === 'boolean') {
                return true;
            } else if(typeof(field) === 'object' && field !== null) {
                return (Object.keys(field).length > 0);
            } else {
                return false;
            }
        }
    }

    min(field_or_cel, cel) {

        if(cel === undefined) {
            this._todo.min = field_or_cel;
            return this;
        } else {
            return (typeof(field_or_cel) === 'string' && field_or_cel.length >= cel);
        }
    }

    max(field_or_cel, cel) {

        if(cel === undefined) {
            this._todo.max = field_or_cel;
            return this;
        } else {
            return (typeof(field_or_cel) === 'string' && field_or_cel.length <= cel);
        }
    }

    email(field) {

        if(field === undefined) {
            this._todo.email = false;
            return this;
        } else {
            let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (typeof(field) === 'string' && reg.test(field));
        }
    }

    equal(field, field_two) {

        if(field_two === undefined) {
            this._todo.equal = field;
            return this;
        } else {
            return (this.required(field) && (field === field_two));
        }
    }

    dateTimeSql(field) {

        if(field === undefined) {
            this._todo.dateTimeSql = false;
            return this;
        } else {
            let reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
            return (typeof(field) === 'string' && reg.test(field));
        }
    }

    dateTimeLater(field, accuracy) {

        if(field === undefined) {
            this._todo.dateTimeLater = false;
            return this;
        } else {
            let field_data = new Date(field);
            let now = new Date;
            now = now - this._accuracy_datetime;
            return (field_data > now);
        }
    }

    /**
     * 1800000 ms = 30 min
     * @param {ms} accuracy
     */
    setAccuracyDateTime(accuracy) {

        if(typeof(accuracy) === 'number') {
            this._accuracy_datetime = accuracy;
        }
        return this;
    }

    lastChecks() {

        return this._last_checks;
    }

    resetLastChecks() {

        this._last_checks = true;
    }
}

export default FormValidateService;
