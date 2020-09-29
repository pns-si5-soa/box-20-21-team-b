# Requests to launch in this order to test the services

`http://localhost/mission/poll/launch`

Next post are using the following body :
`
{
    "ready" : true | false
}
`

`http://localhost/weather/poll/answer-mission`

`http://localhost/rocket/poll/answer-mission`

`http://localhost/mission/poll/mission`