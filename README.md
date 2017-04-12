<img align="right" src="https://git.io/vSDJZ">

# Melon Satellite

A permissionless registry for publishing and voting on community-made Melon Protocol modules.

## Usage

Install dependencies with `npm install`

Run tests with `truffle test`

## Sample Functionality

```js
//user creates a new registry entry with name
//and URL to the homepage of their module
registerModule('my-cool-module', 'melon.io/my-cool-module')

//user can vote on others' modules (but not their own)
voteOnModule('great-module', true)          //upvote
voteOnModule('not-so-great-module', false)  //downvote

//module creator can remove module from the registry
removeModule('my-cool-module')
```
