const Role = Object.freeze({
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    OTHER: 'other'
});

function get_role(role_str) {
    if (!role_str) return null
    for (let key in Role) {
        if (key === role_str.toUpperCase())
            return key
    }
    return Role.OTHER
}

module.exports = {Role, get_role}