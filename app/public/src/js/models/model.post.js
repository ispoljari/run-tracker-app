import axios from 'axios';
import {apiData} from '../views/view.dom-base';

export default class Post {
  constructor(post) {
    // this.title = post.runTitle,
    // this.distanceValue = post.distance.value, // TODO: convert into the smaller unit
    // this.distanceUnit = post.distance.unit,
    // this.durationHours = post.duration.hours, //TODO: aggregate
    // this.durationMinutes = post.duration.minutes,
    // this.duratonSeconds = post.duration.seconds,
    // this.type = post.runType,
    // this.date = post.date,
    // this.time = post.time,
    // this.description = post.description,
    // this.privacy = post.privacy
  }

  async createNew() {
    console.log(this);
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