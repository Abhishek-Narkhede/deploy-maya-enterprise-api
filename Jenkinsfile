pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    stages {
        stage('install') {
            when {
                anyOf{
                    expression{env.BRANCH_NAME == 'main'}
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('create-env-dev') {
            when {
                branch 'main'
            }
            environment {
                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                touch .env
                echo PORT=9999 >> .env
                sed -i 's/environment/qa/g' ecosystem.config.js
                
                '''
            }
        }

        stage('deploy-dev') {
            when {
                branch 'main'
            }
            steps {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    pm2 stop ecosystem.config.js && pm2 start ecosystem.config.js && pm2 save
                    echo "App started"
                    '''
            }
        }
    }
}
