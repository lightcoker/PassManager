# Passmanager

A web application of password manager implemented by microservice architecture.

## Contents

- [Objective](#objective)
- [Introduction](#introduction)
- [System Architecture](#system-architecture)
- [Technologies](#technologies)
- [Architectural Pattern](#architectural-pattern)
- [Design Pattern](#design-pattern)
- [CI/CD](#cicd-1)
- [Screenshot](#screenshot)

## Objective

The goal of this project is to learn and implement system architecture and design patterns that I researched recently through learning by doing. It also serves as a demo of my skills in web development.

## Introduction

The passmanager is a web application to generate, store and manage passwords of user's online accounts. After signing up, users only need to remember the master password to access all other password stored online on all devices. The passmanager also serves as a random password generation app. User can generate a strong and lengthy password and instantly store it in passmanager.

To better understand and learn system design and design pattern, I applied several architectural patterns and design patterns in the project. For example, two major architectural patterns, which include microservices and the command and query responsibility segregation (CQRS), are applied. Furthermore, several design patterns are applied, including singleton, strategy, repository and simple factory pattern.

Continuous Integration/Continuous Deployment (CI/CD) is applied to introduce automation into the development process.

## System Architecture

<img src="https://raw.githubusercontent.com/lightcoker/passmanager/main/doc/img/Systems%20Architecture.png" alt="Systems Architecture" style="zoom:6%;" />

## Technologies

##### Frontend service

- Frontend framework: React & Next.js for server-side rendering (SSR)
- CSS framework: Bulma 

##### Authentication service

- Backend framework: Node.js & Express with TypeScript
- Persistent storage: MongoDB

##### Password service

- Backend framework: Node.js & Express with TypeScript
- Persistent storage: MongoDB

##### Query service

- Backend framework: Node.js & Express with TypeScript
- Persistent storage: PostgreSQL or MongoDB
- In-memory cache: Redis

##### Event bus

- NATS streaming service

##### CI/CD

- Testing framework: Jest
- CI platform: GitHub actions
- Deployment: Kubernetes on DigitalOcean

## Architectural Pattern

##### Microservice Architecture

- Each service can be developed, maintained and deployed independently. Backend services communicate with each other by events through NATS Streaming server as the event bus. 
- Each service has only one major functionality. The authentication service provides registration and identification verification functionalities. The password service can generate and manage the password record. The query service serves read-only data for user and password records.
- The code reuse is achieved by publishing common codes to npm as a package.  

##### CQRS

- CQRS separates reads and writes into different logic units. Query unit is for read operation. while command unit is for other operations.
  - The command unit includes authentication service and password service. Authentication service creates user records and password service creates and manages password records.
  - The query unit is the query service. It receives events when new records, including user and password records, are created or operated, and then store the copies in its database.
- Not only the read and write operations are separated, but it also provides opportunities to devise them differently or optimizes them independently with mechanisms according to the corresponding operations. For example, MongoDB is applied in the command unit to optimize write operations. In the query service, PostgreSQL and in-memory cache are applied to optimize write operations.

## Design Pattern

- **Singleton pattern**: It is applied for databases/services connections to make sure the connection is created only once while it could be reused by other codes to operate databases/services. For example, connection for PostgreSQL and NATS streaming server.
- **Strategy pattern**: It is applied to make it easier to add new functionalities/algorithms and facilitate switching functionalities according to the execution context at runtime. For example, random password generation algorithms could be implemented with a different implementation. In the query service, cache functionalities are changeable for password record and for user record. 
- **Repository pattern**: It provides an abstract of data and creates objects to centralized different data access logics. For one thing, the abstraction facilitates switching between different database implementations. For example, both PostgreSQL and MongoDB are implemented and are interchangeable in the query service. For another, each repository object also serves as a data access object (DAO). If the queries need to be modified or extended, we only need to write codes in DAO and not all codes in other files.
- **Simple factory pattern**: The simple factory pattern is simplified and applied in the tests of authentication service. It produces cookies for users of different authentication status i.e. users who logged in and logged out, as well as invalid users. 

## CI/CD

- Unit testing in the authentication service ensures any changes introduced would not break the overall application.
- GitHub action is chosen as the CI platform to run tests and deploy the app to the cloud platform.
- The app is deployed on the DigitalOcean Kubernetes (DOKS). 

## Screenshot

- Homepage: Users can generate a random password according to the chosen length. The default length is 32 characters.

![homepage](https://raw.githubusercontent.com/lightcoker/passmanager/main/doc/img/Screenshot_homepage.png)

- Save passwords: Users can save a password along with domain and account to their collection.

![save password](https://raw.githubusercontent.com/lightcoker/passmanager/main/doc/img/Screenshot_save.png)

- Manage passwords: Users could manage the their password collection, including add create, edit and delete password records.

![manage passwords](https://raw.githubusercontent.com/lightcoker/passmanager/main/doc/img/Screenshot_manage.png)
