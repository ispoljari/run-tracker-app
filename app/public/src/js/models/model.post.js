import axios from 'axios';
import {apiData} from '../views/view.dom-base';
import {appState} from '../state/state.app';

export default class Post {
  constructor(post) {
    this.title = post.runTitle,
    this.distanceValue = post.distance.value, 
    this.distanceUnit = post.distance.unit,
    this.durationHours = post.duration.hours,
    this.durationMinutes = post.duration.minutes,
    this.durationSeconds = post.duration.seconds,
    this.runType = post.runType,
    this.date = post.date,
    this.time = post.time,
    this.description = post.description,
    this.privacy = post.privacy
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
          description: this.description,
          privacy: this.privacy
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
    // some code
  }

  async retrieveSingleByID() {
    // some code
  }

  async deleteByID() {
    // some code
  }

  async updateByID() {
    // some code
  }
}