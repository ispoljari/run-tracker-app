import axios from 'axios';
import {apiData} from '../views/view.static-dom-base';

export default class User {
  constructor (user) {
    this.name = user.name,
    this.displayName = user.displayName,
    this.username = user.username,
    this.password = user.password,
    this.avatar = user.avatar
  }

  async createNew() {
    try {
      const res = await axios({
        method: 'post',
        url: apiData.users.url,
        data: {
          name: this.name,
          displayName: this.displayName,
          username: this.username,
          password: this.password,
          avatar: this.avatar
        }
      });
      this.result = res;
    } catch (error) {
      console.clear();
      this.error = error.response.data;
    }
  }
}