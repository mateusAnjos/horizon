#!/bin/bash

echo Atualizando o sistema...
sudo apt update

sudo apt upgrade -y

echo Instalando dependências necessárias...
sudo apt install git nodejs -y

git --version

node --version

npm --version

npm install --global yarn

yarn --version

echo Instalando Docker...
sudo apt-get install ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

sudo apt update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo Clonando repositório...
git clone https://gitlab.ctd.academy/ctd/brasil/projeto-integrador-1/0523/grupo-6.git
