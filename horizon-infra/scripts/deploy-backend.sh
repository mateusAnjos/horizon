#!/bin/bash

echo Deletando build anterior...
rm ~/grupo-6/horizon-backend/target/ ~/grupo-6/horizon-backend/target/

echo Parando container e deletando imagem atual...
sudo docker stop horizon-back

sudo docker rmi horizon-back

echo Criando nova build
cd ~/grupo-6/horizon-backend/

git pull origin backend

mvn clean install

cd ~

echo Construindo nova imagem Docker...
sudo docker build -t horizon-back .

echo Fazendo deploy...
sudo docker run -d --rm -p 8080:8080 --name horizon-back horizon-back

echo Pronto!
