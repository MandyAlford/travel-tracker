import User from './user'

class Traveler extends User {
  constructor(usersData) {
    super();
    this.id = usersData.id;
    this.name = usersData.name;
    this.travelerType = usersData.travelerType;
    this.trips = [];
  }
}

export default Traveler;
