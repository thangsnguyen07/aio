pipeline {
    agent { 
        node {
            label 'docker-agent-node'
            }
      }
    triggers{
        pollSCM 'H/2 * * * *'
    }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                echo "Doing build stuff..."
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                echo "Doing test stuff..."
                '''
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
                sh '''
                echo "Doing delivery stuff..."
                '''
            }
        }
    }
}