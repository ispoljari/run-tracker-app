import axios from 'axios';
import {apiData} from '../views/view.dom-base';

export default class User {
  constructor (user) {
    if (user.name) {
      this.name = user.name
    } 
    
    if (user.displayName) {
      this.displayName = user.displayName
    } 
    
    if (user.avatar) {
      this.avatar = user.avatar
    } 
    
    if (user.username) {
      this.username = user.username
    } 
    
    if (user.password) {
      this.password = user.password
    }
  }

  async createNew() {
    try {
      const res = await axios({
        method: 'post',
        url: apiData.urls.users,
        data: {
          name: this.name,
          displayName: this.displayName,
          username: this.username,
          password: this.password,
          avatar: this.avatar
        }
      });
      
      delete this.password;
      this.result = res;
    } catch (error) {
      this.error = error.response.data;
    }
  }

  async login() {
    try {
      const res = await axios({
        method: 'post',
        url: `${apiData.urls.auth}/login`,
        data: {
          username: this.username,
          password: this.password,
        }
      });

      delete this.password;
      delete this.username;
      this.result = res;
    } catch (error) {
      this.error = error.response.data
    }
  }

  async update() {
    try {
      const res = await axios({
        method: 'put',
        url: `${apiData.urls.users}/${appState.login.JWT.user.id}`,
        data: {
          id: appState.login.JWT.user.id,
          name: this.name,
          displayName: this.displayName,
          avatar: this.avatar
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appState.login.user.result.data.authToken}`
        }
      });

      this.result = res;
    } catch (error) {
      this.error = error.response.data;
    }
  }
}