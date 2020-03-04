class User {
  constructor() {
  }

  verifyUser(username, password) {
    return this.username === username && this.password === password;
  }
}


export default User;
