class FormatDate {

    toViewWithTimezone(inputDate) {

        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    toView(inputDate) {
        let separ = ' ';

        if(inputDate.indexOf('T') !== -1) {
            separ = 'T';
        }
        const [datePart, timePart] = inputDate.split(separ);
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');
        const shortYear = year.slice(-2);
        const paddedMonth = month.padStart(2, '0');
        const paddedDay = day.padStart(2, '0');
        const paddedHours = hours.padStart(2, '0');
        const paddedMinutes = minutes.padStart(2, '0');

        return `${paddedDay}.${paddedMonth}.${shortYear} ${paddedHours}:${paddedMinutes}`;
    }

    toInputDate(inputDate) {
        const date = new Date(inputDate);
        return date.toISOString().slice(0, 10);
    }

    toInputDateTime(datatime) {
        if(!datatime) return '';
        return datatime.replace(' ', 'T').slice(0, 16);
    }

    toViewDate(inputDate) {
        let separ = ' ';

        if(inputDate.indexOf('T') !== -1) {
            separ = 'T';
        }
        const [datePart, timePart] = inputDate.split(separ);
        const [year, month, day] = datePart.split('-');
        const paddedMonth = month.padStart(2, '0');
        const paddedDay = day.padStart(2, '0');

        return `${paddedDay}.${paddedMonth}.${year}`;
    }

    toSQLDateTime(inputDate) {
        if (!inputDate) {
            return null;
        }
        
        const date = new Date(inputDate);
        
        if (isNaN(date.getTime())) {
            return null;
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default FormatDate;
