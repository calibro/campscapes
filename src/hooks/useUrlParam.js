// import useRouterQueryParam from "magik-react-hooks/useRouterQueryParam";
import { useCallback } from "react";
import useRouter from "magik-react-hooks/useRouter";
import useQueryParam from "magik-react-hooks/useQueryParam";

function useRouterQueryParam(
  name,
  defaultValue,
  qpEncoder = false,
  options = {}
) {
  const { location, history } = useRouter();

  const setSearchStr = useCallback(
    (nextQueryString, historyMethod = "push") => {
      const url = `${location.pathname}?${nextQueryString}`;
      const newLocation = {
        pathname: `${location.pathname}`,
        search: `${nextQueryString}`,
        state: location.state
      };
      history[historyMethod](newLocation);
    },
    [location.pathname, history]
  );

  const proxied = useQueryParam(
    location.search,
    setSearchStr,
    name,
    defaultValue,
    qpEncoder,
    options
  );

  return proxied;
}

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export const encodeArray = v => (v ? v.join(",") : "");
export const decodeArray = v => (v ? v.split(",").map(x => +x) : null);

export default function useUrlParam(
  name,
  defaultValue,
  encode = JSON.stringify,
  decode = JSON.parse,
  options = {},
  validator
) {
  const encDec = {
    encode,
    decode
  };

  const [param, setParam] = useRouterQueryParam(
    name,
    defaultValue,
    encDec,
    options
  );

  let realParam = param;
  if (isFunction(validator)) {
    realParam = validator(param) ? param : defaultValue;
  }

  return [realParam, setParam];
}
