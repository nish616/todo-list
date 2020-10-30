//module.exports = getDate;  //node_module refer node docs

exports.getDate = () => { //module is an object it can have properties and methhods

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date().toLocaleDateString('en-US', options);

}

exports.getDay = () => { //module is an object it can have properties and methhods

    const options = {
        weekday: 'long'
    };

    return new Date().toLocaleDateString('en-US', options);

}