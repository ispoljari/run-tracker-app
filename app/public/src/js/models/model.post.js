import axios from 'axios';
import {apiData} from '../views/view.dom-base';
import {appState} from '../state/state.app';

export default class Post {
  constructor(post) {
    if (post) {
      if (post.id) {
        this.id = post.id
      } 
      
      if (post.runTitle) {
        this.title = post.runTitle
      } 
  
      if (post.distance) {
        this.distanceValue = post.distance.value 
        this.distanceUnit = post.distance.unit
      }
  
      if (post.duration) {
        this.durationHours = post.duration.hours
        this.durationMinutes = post.duration.minutes
        this.durationSeconds = post.duration.seconds
      }
  
      if (post.runType) {
        this.runType = post.runType
      }
  
      if (post.date) {
        this.date = post.date
      }
      
      if (post.time) {
        this.time = post.time
      }
  
      if (post.description) {
        this.description = post.description
      }
    }

    // this.privacy = post.privacy
  }

  async createNew() {
    try {
      const res = await axios({
        method: 'post',
        url: apiData.urls.posts,
        data: {
          title: this.title,
          distanceValue: this.distanceValue, 
          distanceUnit: this.distanceUnit,
          durationHours: this.durationHours,
          durationMinutes: this.durationMinutes,
          durationSeconds: this.durationSeconds,
          runType: this.runType,
          date: this.date,
          time: this.time,
          description: this.description
          // privacy: this.privacy
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

  async retrieveAll() {
    try {
      const res = await axios({
        method: 'get',
        url: apiData.urls.posts
      });
      this.result = res; 
    } catch (error) {
      this.error = error.response.data;  
    }
  }

  async retrieveSingleByID() {
    try {
      const res = await axios({
        method: 'get',
        url: `${apiData.urls.posts}/${this.id}`,
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

  async deleteByID() {
    try {
      const res = await axios({
        method: 'delete',
        url: `${apiData.urls.posts}/${this.id}`,
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

  async updateByID() {
    // some code
  }
}