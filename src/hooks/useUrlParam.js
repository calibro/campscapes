import { useCallback, useMemo } from "react";
import qs from "query-string";

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export const encodeArray = v => (v ? v.join(",") : "");
export const decodeArray = v => (v ? v.split(",").map(x => +x) : null);

export default function useQueryParam(
  location,
  history,
  name,
  defaultValue,
  encode = JSON.stringify,
  decode = JSON.parse,
  options = {},
  validator
) {
  const queryParams = useMemo(() => {
    const allParams = qs.parse(location.search);
    if (allParams[name] !== undefined) {
      const out = decode(allParams[name]);
      if (isFunction(validator)) {
        return validator(out) ? out : defaultValue;
      }
      return out;
    } else {
      return defaultValue;
    }
  }, [decode, defaultValue, location.search, name, validator]);

  const setQueryParams = useCallback(
    (nextValue, historyMethod = "push") => {
      if (isFunction(nextValue)) {
        nextValue = nextValue(queryParams);
      }
      // if (encode(nextValue) === encode(queryParams)) {
      //   return;
      // }

      const encodedValue = encode(nextValue);
      const currentQueryParams = qs.parse(location.search);
      const queryString = qs.stringify(
        {
          ...currentQueryParams,
          [name]:
            encodedValue !== "" && encodedValue !== null
              ? encodedValue
              : undefined
        },
        options
      );

      history[historyMethod]({
        pathname: location.pathname,
        search: queryString,
        state: location.state
      });
    },
    [
      encode,
      location.search,
      location.pathname,
      location.state,
      name,
      options,
      history,
      queryParams
    ]
  );

  return [queryParams, setQueryParams];
}
