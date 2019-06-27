#!/bin/bash
# My first script

echo 'Removing old docker installation'
sudo apt-get remove docker docker-engine docker.io containerd runc
echo 'Installation docker'
wait 1000
echo 'Done'