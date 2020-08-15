import axios from 'axios';

// axios.defaults.baseURL = 'https://infohebackoffice.herokuapp.com';
export const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://infohebackoffice.herokuapp.com' : 'http://localhost:4000'
});

// export default {instance};