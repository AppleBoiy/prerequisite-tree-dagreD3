# syntax=docker/dockerfile:1.4
FROM ubuntu:latest

# Update package lists and install necessary dependencies
RUN apt-get update && apt-get install -y python3 python3-pip

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
RUN apk add --update alpine-sdk openssh git zsh bash curl neovim

# Install Oh-My-Zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Powerlevel10k theme
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $HOME/.oh-my-zsh/custom/themes/powerlevel10k

# Set Zsh as the default shell
SHELL ["/bin/zsh", "-l"]

# Set Bash as the default shell for interactive sessions
ENV SHELL=/bin/bash

# Install NvChad
RUN git clone ssh://git@github.com:NvChad/NvChad.git /root/.config/nvim \
  && nvim +PlugInstall +qall

