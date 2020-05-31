# monitoring.jbrunton.com

Configuration and docker-compose application for monitoring.

## In production

Requires a Droplet with docker and docker-compose.

First time setup:

    ssh deployer@monitoring.jbrunton.com
    mkdir -p certs
    mkdir -p data
    mkdir -p nginx_auth
    git clone https://github.com/jbrunton/monitoring.jbrunton.com.git app
    
Scp SSL certificates to `deployer@monitoring.jbrunton.com:/home/deployer/certs`. Then start the app for the first time:

    cd app
    cp .env.prod .env
    docker-compose up -d

Prometheus, Grafana and Alertmanagers will error due to lack of permissions, so run:

    sudo chmod a+rwx -R /home/deployer/data/

At this point, CI deployments can take over.

Configuring basic auth:

    sudo apt install apache2-utils
    cd nginx_auth
    htpasswd -c .htpasswd admin

Note: uses credentials in LastPass for prod. For dev, password is 'admin'.

## Development

Initial setup:

    ./setup.sh dev

Run:

    docker-compose up

This will setup the services at the following URLs:

* http://localhost/prometheus
* http://localhost/alertmanager
* http://localhost/grafana

Note: in dev, basic auth credentials for Prometheus and Alertmanager are `admin` / `admin`.

If you want to test end to end alerting, you will need to update the values of the following config secrets in `grafana/config.yml`:

    slack_api_url: ...
    opsgenie_api_key: ...

## Kubernetes

### Minikube

Initial setup:

    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm install nginx-ingress stable/nginx-ingress -f k8s/values.yml
    kubectl create secret generic basic-auth --from-file=k8s/dev/secrets/auth

To deploy:

    kubectl apply -k .

Then the following services will be running:

* Grafana: `open http://$(eval minikube ip):<port>/grafana`
* Prometheus: `open http://$(eval minikube ip):<port>/prometheus`
* Alertmanager: `open http://$(eval minikube ip):<port>/alertmanager`
