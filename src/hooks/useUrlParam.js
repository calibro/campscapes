import { useCallback, useMemo } from "react";
import qs from "query-string";

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

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
  }, [defaultValue, location.search, name]);

  const setQueryParams = useCallback(
    (nextValue, historyMethod = "push") => {
      if (isFunction(nextValue)) {
        nextValue = nextValue(queryParams);
      }
      if (encode(nextValue) === encode(queryParams)) {
        return;
      }

      const currentQueryParams = qs.parse(location.search);
      const queryString = qs.stringify(
        {
          ...currentQueryParams,
          [name]: encode(nextValue)
        },
        options
      );
      const url = `${location.pathname}?${queryString}`;
      history[historyMethod](url);
    },
    [location.search, location.pathname, name, options, history]
  );

  return [queryParams, setQueryParams];
}
