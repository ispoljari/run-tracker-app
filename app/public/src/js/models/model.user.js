import axios from 'axios';
import {apiData} from '../views/view.static-dom-base';

export default class User {
  constructor (user) {
    this.name = user.name,
    this.displayName = user.displayName,
    this.username = user.username,
    this.password = user.password
  }

  async createNew() {
    try {
      const res = await axios({
        method: 'post',
        url: apiData.user.url,
        data: {
          name: this.name,
          displayName: this.displayName,
          username: this.username,
          password: this.password
        }
      });
      this.result = res;
    } catch (error) {
      console.log(`An error occured! Message: ${error}`);
    }
  }
}