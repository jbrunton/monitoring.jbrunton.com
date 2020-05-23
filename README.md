# monitoring.jbrunton.com

Configuration and docker-compose application for monitoring.

First time setup:

    ssh deployer@monitoring.jbrunton.com
    mkdir -p certs
    mkdir -p data
    sudo chmod a+rw -R data/
    git clone https://github.com/jbrunton/monitoring.jbrunton.com.git app

Then scp SSL certificates to `deployer@monitoring.jbrunton.com:/home/deployer/certs`.
