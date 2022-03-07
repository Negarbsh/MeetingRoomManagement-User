const office = Object.freeze({
    TEHRAN: 'Tehran',
    MASHHAD: 'Mashhad',
    SHIRAZ: 'Shiraz',
    TABRIZ: 'Tabriz'
});

function get_office(office_str) {
    if(!office_str) return null
    for (let key in office) {
        if (office[key] === office_str.toUpperCase())
            return key
    }
    return null
}

module.exports = {office, get_office}