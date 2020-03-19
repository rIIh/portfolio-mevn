# Compose file path
COMPOSE=docker-compose.traefik.yml

# Remote url first argument
export REMOTE=${1:?"Provide remote"}

# Registry url second argument. Default is url registry.yourremote.com
# Passed to compose file as variable
export REGISTRY=${2:-"registry.${REMOTE}"}/

echo Building images
docker-compose -f $COMPOSE build || exit $?

echo Pushing images to host registry
docker-compose -f $COMPOSE push || exit $?

echo Pull on remote?
docker-compose -f $COMPOSE -H "ssh://root@$REMOTE" pull || exit $?

echo Starting container on remote "$REMOTE"
docker-compose -f $COMPOSE -H "ssh://root@$REMOTE" up -d --force-recreate --no-build || exit $?