'use strict';

const uuid = require('uuid');




let users = {};

let userGroups = {
  '28e2babc-63dc-422c-8edf-1e38cce46c38': {
    name: 'CBRE', 
    users: []
  },
  'db8d27cd-00b3-471e-ba5e-ef208e137187': {
    name: 'Cushman & Wakefield', 
    users: []
  }
};

let resource = {
  '95f0b83a-e60c-4056-87b2-7679b13f4c9c': {
    propertyName: 'Trump Tower',
    value: 10000000,
    type: 'Multifamily'
  },
  'b2683dfe-2008-4ca9-8f43-ecef0e4df13c': {
    propertyName: 'Walmart #1023',
    value: 1850000,
    type: 'Retail'
  }
};

let resourcePermissions = {
  '95f0b83a-e60c-4056-87b2-7679b13f4c9c': {
    canRead: [],
    canWrite: []
  },
  'b2683dfe-2008-4ca9-8f43-ecef0e4df13c': {
    canRead: [],
    canWrite: []
  }
};



class User {
  constructor(name, userGroups = []) {
    this.name = name;
    this.userGroups = userGroups;
    this.userId = uuid.v4();
    this.canRead = [];
    this.canWrite = [];
  }

  getId() {
    return this.userId;
  }

  getUserGroups() {
    return this.userGroups;
  }

  addUserGroup(groupId) {
    this.userGroups.push(groupId);
    userGroups[groupId].push(this.userId);
  }

  grantReadPermission(resourceId) {
    resourcePermissions[resourceId].canRead.push(this.userId);
    this.canRead.push(resourceId);
  }

  grantWritePermission(resourceId) {
    resourcePermissions[resourceId].canWrite.push(this.userId);
    this.canWrite.push(resourceId);
  }

  revokePermission(resourceId, permissionType) {
    let currResource = resourcePermissions[resourceId];

    if(permissionType === 'Read') {
      let readIndex = currResource.canRead.indexOf(this.userId);

      // If the user has read permission, revoke it
      if(readIndex !== -1) {
        currResource.canRead.splice(readIndex, 1);
      }

    } else if(permissionType === 'Write') {
      let writeIndex = currResource.canWrite.indexOf(this.userId);
      if(writeIndex !== -1) {
        currResource.canWrite.splice(writeIndex, 1);
      }
    }
  }

  canRead(resourceId) {
    return resourcePermissions[resourceId].canRead.includes(this.userId);
  }

  canWrite(resourceId) {
    return resourcePermissions[resourceId].canWrite.includes(this.userId);
  }

  toJson() {
    let userInfo = {
      canRead: this.canRead,
      canWrite: this.canWrite,
      name: this.name,
      userGroups: this.userGroups,
      id: this.userId
    }
    try {
      let output = Json.stringify(userInfo)
    } catch {
      console.log('Error stringifying!');
    }
    return output;


  }

}
let testUser = new User('test', ['28e2babc-63dc-422c-8edf-1e38cce46c38']);
users[testUser.userId] = testUser;
console.log(users[testUser.userId].getUserGroups());