const Department = Object.freeze({
    DEP1: 0, //todo what exactly are the departments?
    DEP2: 1,
    DEP3: 2,
    DEP4: 3
});

function get_department(department_str) {
    if (!department_str) return null
    for (let key in Department) {
        if (key === department_str.toUpperCase())
            return key
    }
    return null
}

module.exports = {Department, get_department}