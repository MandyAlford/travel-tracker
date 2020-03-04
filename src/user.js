class User {
  constructor(usersData) {
    this.username = usersData.username
    this.password = usersData.password
  }

  verifyUser(username, password) {
    return this.username === username && this.password === password;
  }
}


export default User;
