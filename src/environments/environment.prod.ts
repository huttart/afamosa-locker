export const environment = {
  production: true,
  // api_url: 'http://192.168.1.156/gmc-locker-api/'
  // api_url: 'http://127.0.0.1/gmc-locker-api/',
  api_url: localStorage.getItem('api_url') ? ('http://' + localStorage.getItem('api_url') + '/gmc-locker-api/') : 'http://127.0.0.1/gmc-locker-api/'


};
