FROM jenkins/jenkins:2.303.3-jdk11
ENV JAVA_OPTS "-Djenkins.install.runSetupWizard=false"
USER root
COPY jenkins-plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

COPY seedjob.groovy /usr/local/seedjob.groovy
COPY jenkins-casc.yaml /usr/local/jenkins-casc.yaml
ENV CASC_JENKINS_CONFIG /usr/local/jenkins-casc.yaml
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
    https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
    signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
    https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
