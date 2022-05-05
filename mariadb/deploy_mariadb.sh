# Install Helm

curl https://baltocdn.com/helm/signing.asc | apt-key add -
 apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
apt-get update
apt-get install helm

# MariaDB Repo von Bitnami hinzufügen
helm repo add bitnami https://charts.bitnami.com/bitnami

# MariaDB im Cluster ausrollen
helm install my-release bitnami/mariadb

# Verzeichnisse für Persistent Volumes anlegen
mkdir ~/data
mkdir ~/data1
mkdir ~/data2

# Eigentümer von den Verzeichnissen auf Nutzer mit ID 1001 ändern
chown -R 1001:1001 data
chown -R 1001:1001 data1
chown -R 1001:1001 data2

# Persistent Volumes ausrollen
kubectl apply -f ./persistentVolume.yaml