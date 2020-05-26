# monitoring.jbrunton.com

Configuration and docker-compose application for monitoring.

Requires a Droplet with docker and docker-compose. 

First time setup:

    ssh deployer@monitoring.jbrunton.com
    mkdir -p certs
    mkdir -p data
    mkdir -p nginx_auth
    git clone https://github.com/jbrunton/monitoring.jbrunton.com.git app
    
Scp SSL certificates to `deployer@monitoring.jbrunton.com:/home/deployer/certs`. Then start the app for the firs time:

    cd app
    export DATA_DIR=/home/deployer/data
    export NGINX_CERTS_DIR=/home/deployer/certs
    docker-compose up -d

Prometheus, Grafana and Alertmanagers will error due to lack of permissions, so run:

    sudo chmod a+rwx -R /home/deployer/data/

At this point, CI deployments can take over.

Configuring basic auth:

    sudo apt install apache2-utils
    cd nginx_auth
    htpasswd -c .htpasswd admin

Note: uses credentials in LastPass for prod. For dev, password is 'admin'.
