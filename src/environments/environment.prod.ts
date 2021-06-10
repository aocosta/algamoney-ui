export const environment = {
  production: true,
  // apiUrl: 'http://localhost:8080',
  apiUrl: 'https://aocosta-algamoney-api.herokuapp.com',

  tokenAllowedDomains: [ new RegExp('aocosta-algamoney-api.herokuapp.com') ],
  tokenDisallowedRoutes: [ new RegExp('\/oauth\/token') ]
};
