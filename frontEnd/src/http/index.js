import axios from "axios";
const {REACT_APP_API_URL} = require('../utils/consts');
// Створення інстансів для зв'язку з API
const $host = axios.create({
  baseURL: REACT_APP_API_URL,
});

export { $host };