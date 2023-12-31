function getConfigVar(key) {
    const val = process.env[key];
    console.log(val);
    if (val === undefined) {
      throw new Error(`The variable with name ${key} is not set in .env.`);
    }
    return val;
  }
  
export class Config {
  static getBackendUrl() {
    return getConfigVar("URL_BACKEND");
  }
}