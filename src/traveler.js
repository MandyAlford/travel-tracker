import User from './user'

class Traveler extends User {
  constructor(usersData) {
    this.id = usersData.id;
    this.name = usersData.name;
    this.travelerType = usersData.travelerType;
  }
}

export default Traveler;
