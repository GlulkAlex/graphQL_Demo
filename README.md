Tech stack|architecture
===
- GraphQL - as data model|validator|source of truth;
- React - view rendering|UI components;
- MongoDB - persistent storage;
- Socket.io - real-time bidirectional event-based communication|messaging 
  between client and server;
- RxJS - as helper|warper
  using Observables + Operators + Schedulers to ditch the Promise pattern
  > Reactive Extensions for JavaScript  
  unify both  
  the world of Promises,  
  callbacks as well as  
  evented data such as  
  DOM Input,  
  Web Workers, and  
  Web Sockets.  
  Unifying these concepts  
  enables rich composition.
  
API Basejump: File Metadata (size) Microservice
===
> ###Objective: 
Build a full stack JavaScript app
that is functionally similar to
this [reference case](https://cryptic-ridge-9197.herokuapp.com)
and
deploy it to Heroku.
> ###User story:  
  1. user can
  _submit_ a FormData object
  that includes a **file upload**.
  2. after submission,
  user will receive
  the **file size** in _bytes_
  within the JSON _response_.
  
Live demo:
---
  * [https://api-file-metadata-microservice.herokuapp.com/](https://api-file-metadata-microservice.herokuapp.com/)
> ###Usage example:
  * image search results:
  input:
    `package.json`
  output:
    ```json
    {
      "file_Size": 475
    }
    ```
