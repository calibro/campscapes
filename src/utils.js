const BASE_URL = "http://www.dbportal.ic-access.specs-lab.com";
const isDev = process.env.NODE_ENV === "development";

export const proxyDevUrl = url =>
  isDev ? url.replace(BASE_URL, "") : url.replace("http://", "https://");
