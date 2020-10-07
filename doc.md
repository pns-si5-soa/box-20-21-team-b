# Requests to launch in this order to test the services

Post `http://localhost/mission/poll/initiate`

Next post are using the following body :
`
{
    "ready" : true | false
}
`

Get `http://localhost/weather/status`

Post `http://localhost/weather/poll/respond`

**Get `http://localhost/rocket/status**`

Post `http://localhost/rocket/poll/respond`

Post `http://localhost/mission/poll/mission`

Post `http://localhost/rocket/launch`

Post `http://localhost/rocket/detach-payload/altitude` with the following body
`
{
    "altitude" : 140
}
`

Get `http://localhost/telemetry-sender/rocket-metrics/null/null`