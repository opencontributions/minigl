export default (uris, cb) => {
    const response = [];
    let getXhr = (uri, cb) => {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', uri);
            xhr.onload = () => {
                res(xhr.responseText);
            };
            xhr.send();
        })
        .then(cb);
    };
    let loadRecurse = () => {
        getXhr(uris.shift(), (data) => {
            response.push(data);
            if (uris.length ) {
                loadRecurse();
                return;
            }
            cb(response);
        });
    };
    loadRecurse();
};