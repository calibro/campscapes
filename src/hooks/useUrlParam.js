import useRouterQueryParam from "magik-react-hooks/useRouterQueryParam";

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
