const roles = ['user', 'admin'];
const adminRoles = ['admin']; //only this roles can login to dashboard

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', "manageUsers"]);
roleRights.set(roles[1], ['getUsers', 'adminAccess', 'manageProducts',"manageUsers"]);

module.exports = {
  roles,
  roleRights,
  adminRoles
};
