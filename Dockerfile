# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.10-alpine3.15 as builder

WORKDIR /app
COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
  pip3 install -r requirements.txt

COPY . /app
RUN chown -R 1000 /app/
RUN chmod 755 /app/gunicorn_starter.sh
ENTRYPOINT [ "./gunicorn_starter.sh" ]

FROM builder as dev-envs

RUN apk update
RUN apk add --update git zsh bash curl

# # Install Oh-My-Zsh
# RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# # Install Powerlevel10k theme
# RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $HOME/.oh-my-zsh/custom/themes/powerlevel10k

# # Set Zsh as the default shell
# SHELL ["/bin/zsh", "-l"]

# # Set Bash as the default shell for interactive sessions
# ENV SHELL=/bin/bash

