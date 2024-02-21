#!/bin/bash

# Deploy script to GCP VM

# Define the GCP zone, instance name, and project ID
ZONE="us-central1-a"
INSTANCE_NAME="ballards-code-challenge-2"
PROJECT_ID="goog-cloud-infrastructure"
REPO_ADDRESS="https://github.com/button-inc/ecocatch-tours-mock-cc.git"

# SSH into VM
echo "SSHing into the VM..."
gcloud compute ssh --zone "$ZONE" "$INSTANCE_NAME" --project "$PROJECT_ID" << EOF
sudo -s

apt update && apt install --yes apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && apt update && apt install --yes docker-ce && curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
usermod -aG docker $USER
curl -SL https://github.com/docker/compose/releases/download/v2.1.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

sudo apt-get update
sudo apt-get install git

git clone $REPO_ADDRESS

cd ecocatch-tours-mock-cc
cd my-app

docker-compose up
