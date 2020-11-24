#!/bin/bash

set -eu

# If this isn't the first time a command is run within this container we don't need to do anything
FILE=resolve.script.done
if [[ ! -f "$FILE" ]]; then
    echo "Replacing references to environment variables within application files"

    # Generate and apply a SED script to resolve references to (Docker) environment variables
    env | sed 's/[\%]/\\&/g;s/\([^=]*\)=\(.*\)/s%${DOCKER_ENV_\1}%\2%/' > resolve.script
    find dist -type f -exec sed -i -f resolve.script {} +

    # Remember what we just did!
    touch ${FILE}
fi

# Proceed with the actual app, itself
exec $@
