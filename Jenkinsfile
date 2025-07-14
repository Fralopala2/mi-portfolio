pipeline {
    agent any

    environment {
        // Reemplaza 'melbur' con tu usuario real de Docker Hub si es diferente
        DOCKER_HUB_USERNAME = 'melbur'
        // Reemplaza 'mi-portfolio' con el nombre de tu repositorio Docker Hub si es diferente
        DOCKER_IMAGE_NAME = 'mi-portfolio'
        // Este es el ID de las credenciales de Docker Hub que creaste en Jenkins
        DOCKER_HUB_CRED_ID = 'dockerhub-creds'
        // Este será el nombre de la imagen que construiremos y desplegaremos
        FULL_DOCKER_IMAGE = "${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Genera un tag único para la imagen (ej: v1.0.TIMESTAMP_COMMITID)
                    // Esto asegura que Kubernetes siempre tira de una nueva imagen
                    def gitCommitId = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    def buildTimestamp = new Date().format('yyyyMMddHHmmss')
                    env.IMAGE_TAG = "v1.0.${buildTimestamp}-${gitCommitId}"
                    echo "Building Docker image: ${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG}"

                    // Construye la imagen Docker
                    sh "docker build -t ${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Sube la imagen a Docker Hub usando las credenciales de Jenkins
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG}"
                        sh "docker logout" // Buena práctica para limpiar
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Actualiza el Deployment en Kubernetes con la nueva imagen
                    // Aquí usamos kubectl set image para actualizar la imagen del contenedor
                    echo "Deploying ${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG} to Kubernetes"
                    sh "kubectl set image deployment/portfolio-deployment portfolio-container=${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG} --namespace default"

                    // Esperar a que el despliegue se complete
                    sh "kubectl rollout status deployment/portfolio-deployment --timeout=5m --namespace default"

                    echo "Deployment complete. Access your portfolio via: minikube service portfolio-service --url"
                }
            }
        }
    }

    post {
        always {
            // Para limpiar, puedes añadir pasos aquí para eliminar imágenes locales, etc.
            echo "Pipeline finished for ${env.FULL_DOCKER_IMAGE}:${env.IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed!"
            // Aquí podrías añadir notificaciones por email, Slack, etc.
        }
    }
}