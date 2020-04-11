export const getData = (url, params = {}) => {
  return new Promise((resolve) => {
    fetch(`${url}`, { credentials: 'include', ...params}).then(response => response.json()).then(res => resolve(res));
  });
};

export const postData = (url, data, params) => {
  return fetch(`${url}`, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    ...params,
  })
  .then(response => response.json()); // parses response to JSON
};

export const handleGetParams = (url, params) => {
  if (!params) {
    return url;
  }
  let result = `${url}?`;
  Object.keys(params).forEach(key => result += `${key}=${params[key]}&`);
  return result.slice(0, -1);
};