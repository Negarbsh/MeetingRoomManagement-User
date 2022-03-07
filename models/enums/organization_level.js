const OrganizationLevel = Object.freeze({
    JUNIOR: 0,
    EXPERT: 1,
    SENIOR: 2,
    TEAM_LEAD: 3,
    MANAGER: 4,
});

function get_organization_level(level_str) {
    if(!level_str) return null
    for (let key in OrganizationLevel) {
        if (key === level_str.toUpperCase())
            return key
    }
    return null
}

module.exports = {OrganizationLevel, get_organization_level}