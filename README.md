# Overview
The main function of this project is convert the input text to speech. This is made possible by utilizing the power of AWS cloud services like **Lambda**, **API Gateway**, and **Polly**. I used [Serverless](https://www.serverless.com) framework as well for a hassle free setup. This application's emphasis is mainly on the cloud technology side not in the UI so apologies for the very basic UI.

# Stack
In order to build this app, we've used services that are mentioned above. For the UI I used plain React.js (Vite) for a much quicker setup. All in all these are the complete lists of tools/services that I used:

1. React.js - a Javascript library used for building robust user interfaces. Any JS framework will do such as Angular, Svelte or Vue.

2. Serverless - a framework that let users build and provision cloud services easily with the help of IaaS or Infrastructure as a Service. It supports multiple cloud platforms such as Azure, AWS and GCP. It also supports multiple programming languages such as Javascript, Java and Python.

3. Lambda - is a FaaS or Function as a Service offering of AWS wherein it allows its users to build and deploy API endpoints in matter of minutes. It supports multiple programming languages, for this project I used Node.js.

4. AWS API Gateway - is a fully managed service provided by Amazon Web Services (AWS) that allows you to create, publish, maintain, monitor, and secure APIs at any scale. It acts as a gateway for your backend services, enabling you to create RESTful APIs or WebSocket APIs.

5. AWS Polly - a text-to-speech (TTS) service. Polly allows you to convert text into lifelike speech using advanced deep learning technologies. You can use it to create applications that have natural-sounding voice interfaces, or even to generate audio content for various purposes, like podcasts, automated voice responses, and more.

# Getting Started
Now we're a familiar with the tools, I wanted to guide you in building this app, if you don't want to develop this app you can skip this section.

#### Front End
Let's start by building the front end side. You need to create a fresh react project. It doesn't matter if this is CRA generated or VITE the outcome is just the same.

1. Start by running:

`npm create vite@latest`

You can also run:

`npm create vite@latest my-react-app -- --template react`

Go into the project directory and run `npm install`

Run the following commands:

    npm install --save aws4-axios
    npm install axios
    npm install --save react-toastify
    npm install --save-dev vite-plugin-node-polyfills (We need this package since when using aws4-axios, the browser is throwing an exception regarding Buffer)

Since I'm using Vite here, we don't need to install additional dotenv packages as it is supported by default. Just create an .env and add these values:

    VITE_LAMBDA_URL= #Your lambda URL
    VITE_ACCOUNT_REGION= #Your AWS account region
    VITE_ACCESS_KEY_ID= #Your AWS access key id
    VITE_ACCOUNT_SECRET= #Your AWS account secret
    
These values will be used for the request signing and api call.

I won't be posting the whole code here you can check **/speaking-app-fe/src** to my code and file structures. Also take note that I used wrapper classes for Audio and HTTPClient.

#### Back End
For the backend I used the Serverless framework for a much faster provisioning of resources. Run these following commands in order

    npm install serverless -g
    serverless create --template aws-nodejs --path backend
    
This commands install the serverless framework globally then create a serverless template project called **backend**.

Go into the project directory and run `npm install`

Run the following commands after:

    npm install aws-sdk
    npm install middy
    npm install uuid
    npm i serverless-dotenv-plugin

Go to **serverless.yml** and paste this following code:

```
    service: speak-service-v2
    plugins:
      - serverless-dotenv-plugin
    useDotenv: true
    provider:
      name: aws
      runtime: nodejs20.x
      region: # Your AWS account region
      role: ${env:ROLE} // env variable called ROLE
          
    functions:
      speak:
        handler: handler.speak // the path to your function handler, since the filename in the project is handler, that means we have a speak function in the handler.js file
        name: ${sls:stage}-speak-service-v2
        events: // API Gateway
          - http: 
              path: speak
              authorizer:
                type: aws_iam // Authentication method
              method: post
              cors: true // CORS enabled
```

For the handler code please check **/backend/handler.js**.
