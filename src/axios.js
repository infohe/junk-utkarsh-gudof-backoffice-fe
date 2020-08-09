import axios from 'axios';

// axios.defaults.baseURL = 'https://infohebackoffice.herokuapp.com';
export const instance = axios.create({
    baseURL: 'https://infohebackoffice.herokuapp.com' 
    // baseURL : 'http://localhost:4000'
});

// export default {instance};