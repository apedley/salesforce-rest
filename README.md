## Salesforce REST

Salesforce REST is a module for interfacing with the Salesforce REST API. To use this module you will need to create a connected app and have permission to manipulate the objects.

### Usage

1. Download module
  ```
  npm install --save salesforce-rest
  ```
2. Import it  
  ```
  var salesforceRest = require('salesforce-rest');
  ```
3. Set config variables
  ```javascript
  salesforceRest.setOptions({
    key: 'salesforce key',
    secret: 'salesforce secret',
    username: 'salesforce username',
    password: 'salesforce password',
    userSecurityToken: 'get this from your user profile page',
    hostName: 'login host eg. login.salesforce.com or test.salesforce.com',
    tokenPath: 'usually /services/oauth2/token',
  });
  ```
4. Login
  ```javascript
    salesforceRest.login(function(error, success) {
      if (error) { throw new Error('Login failed'); }
    });
  ```
5. Use rest methods:

#### Get

Get runs a query using SalesForce's SOQL syntax. Example:

```javascript
salesforceRest.get('Select Name FROM Contact', function(error, data) {
  console.log(data);
}
```

#### Post

Creates a new record for an object. Example:

```javascript
var postData = {
          "FirstName": "Buddy",
          "LastName": "Testman"
          }
salesforceRest.post('/services/data/v20.0/sobjects/Contact/', postData, function(error, data) {
  console.log(data);
}
```
#### Put

Updates an object. Example:

```javascript
var id = 2;
var updatedInfo = {LastName: 'Redman'};

salesforceRest.put('Contact', id, updatedInfo, function(error, data) {
  console.log(data);
});
```

#### Delete

Deletes an object. Example:

```javascript
var id = 2;
salesforceRest.delete('Contact', id, function(error, data) {
  console.log(data);
}
```

