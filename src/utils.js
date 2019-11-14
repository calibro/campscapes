const BASE_URL = "http://www.dbportal.ic-access.specs-lab.com";
const BASE_URL_SSL = "https://dbportal-ic-access.specs-lab.com";
const isDev = process.env.NODE_ENV === "development";

export const proxyDevUrl = url =>
  isDev ? url.replace(BASE_URL, "") : url.replace(BASE_URL, BASE_URL_SSL);
