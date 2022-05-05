imageName=rest-api
containerName=$imageName
registry=localhost:30002


# Nach laufender Docker-Registry in Kubernetes suchen
if kubectl get pods | grep -q registry; then
echo "Docker-Registry in Kubernetes gefunden"
else
echo "Docker-Registry nicht gefunden!"
echo "Docker-Registry wird erstellt..."
kubectl apply -f ./k8s/registry.yaml
fi 

# Altes image löschen
docker image rm -f $imageName

# Neues Image bauen
docker build --tag $registry/$imageName .

# Image in Docker-Registry in K8s pushen
docker push $registry/$imageName

# Pods nach definierter Rollout Strategie neustarten
kubectl apply -f ./k8s/rest-api.yaml
kubectl rollout restart deployment $imageName