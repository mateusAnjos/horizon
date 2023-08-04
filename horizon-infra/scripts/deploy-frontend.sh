#!/bin/bash

echo Parando container e deletando imagem atual...
sudo docker stop horizon-front

sudo docker rmi horizon-front

echo Atualizando repositório...
cd ~/grupo-6/horizon-frontend/

git pull origin frontend

cd ~

echo Construindo nova imagem Docker...
sudo docker build -t horizon-front .

echo Fazendo deploy...
sudo docker run -d --rm -p 80:5173 --name horizon-front horizon-front

echo Pronto!
