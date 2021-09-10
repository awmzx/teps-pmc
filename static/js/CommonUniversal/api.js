import axios from "axios";

export default axios.create({
  // baseURL: `https://teps.convotest.app/testing_services/api`, // For Dev
  baseURL: `https://app.teps.pk/testing_services/api`, // For Prod
});
