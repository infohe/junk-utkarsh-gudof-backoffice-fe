import axios from 'axios';

// axios.defaults.baseURL = 'https://infohebackoffice.herokuapp.com';
export const instance = axios.create({
    // baseURL: node.process.env === 'production' ? 'https://infohebackoffice.herokuapp.com' : 'http://localhost:4000'
    baseURL: 'https://infohebackoffice.herokuapp.com' 
    // baseURL : 'http://localhost:4000'
});

// export default {instance};