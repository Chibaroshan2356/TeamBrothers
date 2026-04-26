# Kubernetes Service Exposure Project

## Overview
This project demonstrates deployment of a containerized full-stack web application using Docker and Kubernetes.

## Technologies Used
- React (Frontend)
- Node.js + Express (Backend)
- MongoDB (Database)
- Docker
- Kubernetes (Minikube)

## Features
- Full-stack application
- Firebase authentication
- Containerized using Docker
- Deployed using Kubernetes
- Exposed using Kubernetes Service

## Setup Instructions

### 1. Start Minikube
minikube start

### 2. Apply Deployments
kubectl apply -f deployment.yaml
kubectl apply -f backend-deployment.yaml

### 3. Apply Services
kubectl apply -f service.yaml
kubectl apply -f backend-service.yaml

### 4. Access Application
kubectl port-forward service/teambrothers-service 9090:80
kubectl port-forward service/backend-service 5000:5000

Frontend: http://localhost:9090
Backend: http://localhost:5000

## Note
Sensitive data is not included. Environment variables are used for security.
