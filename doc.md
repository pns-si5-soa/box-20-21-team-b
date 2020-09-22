# Requests to launch in this order to test the services

`http://localhost:3002/poll/launch`

`http://localhost:3000/poll/mission`

`http://localhost:3001/poll/mission`

`http://localhost:3002/poll/go` with the following body :
`
{
    "ready" : true
}
`