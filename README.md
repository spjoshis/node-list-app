# Perfect Cycle App

This application has an endpoint to track the occurrence of a perfect cycle in a list. The perfect cycle has two conditions needed to arise in a list, and they are as follows:

- All elements of the list must be visited.
- The last element to be visited takes you back to position zero.
 
# Setup
1. Clone the repo using below command
`git clone https://github.com/spjoshis/node-list-app.git`

2. Checkout `master` branch and take latest pull

3. Install package dependencies, run below command in root directory of application
  - For those who is using NPM, `npm install`
  - For those who is using YARN, `yarn install`

4. To run the application in local, run `yarn run start` command


5. To run test cases in local, please run `yarn test` command

# Part-2 Solution (Messaging System)

Imagine that size of the JSON input has increased significantly, APIs will not work for this approach, and we decided to use a messaging system.

![Message System](https://user-images.githubusercontent.com/6280020/185378972-5527a9ce-2e96-433e-9165-2c515f95e135.png)


Infrastructure: Load balancer and auto scalling is used to scale the backend server which is built in nodejs. 

Messaging System: Amazon's SQS + SNS + Lambda function will be used for messaging system and cloudwatch will be used to store and monitor the logs of lambda function.

Database: Mongodb database will be used to store the lists along with status.

### APIS


#### API-1: POST /process-list
Request Payload:
```
{
	"lists": {
		"list-1": [2,4,6,2],
		"list-2": [1,2,6,0],
		.
		.
		"list-n": [0]
	}
}
```

Response:
```
{
	"status": 201,
	"data": {
		"requestId": 1823913213
	}
}
```

- This API accepts multiple list in payload.
- Stores each list in mongodb with unique request id which will be used to retrieve the result.

**Mongo Document:**
```
{
	"requestId": "1823913213",
	"status": "In-Progress/Completed",
	"lists": {
		"list-1": [2,4,6,2],
		"list-2": [1,2,6,0],
		.
		.
		"list-n": [0]
	},
	"status": {
		"list-1": false,
		"list-2": false,
		.
		.
		"list-n": true
	}
}
```

- As soon as the list is saved in mongo connection, it push each list with requestId in SQS message (one message for one list). SQS will be configured with SNS that will trigger the Lambda function as soon as new message is pushed in queue and returns requestId in response.

- Lambda function will takes list from SQS message and validate the list. After validating the list it will update its status in mongodb document using request id and list key.

- Lambda function will update "status" of request to "Completed" if all the lists in particular request is processed.


#### API-2: GET /get-list/:requestId

Success Response:
```
{
	"status": 200,
	"data": {
		"lists": {
			"list-1": [2,4,6,2],
			"list-2": [1,2,6,0],
			.
			.
			"list-n": [0]
		},
		"status": {
			"list-1": false,
			"list-2": false,
			.
			.
			"list-n": true
		}
	}
}
```

Failure response:
```
{
	"status": 404,
	"message": "Request does not exists"
}
```

This API takes 'requestId' from URL and find the list information from mongodb using 'requestId'.
- If list is found from DB, it returns success response with status of each list
- If list does not exist then it return 404 response with error message

