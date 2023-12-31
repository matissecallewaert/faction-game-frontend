import axios from "axios";
import { Config } from "../Config";

class ApiInstance {
  getApi() {
    const instance = axios.create({
      baseURL: "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.response.use();

    return instance;
  }
}

export default new ApiInstance();
