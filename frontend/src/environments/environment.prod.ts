export const environment = {
  production: true,
  apiBaseDomain: '${DOCKER_ENV_BASE_URL}',
  https: '${DOCKER_ENV_HTTPS}'.toLocaleLowerCase() === 'true',
};
