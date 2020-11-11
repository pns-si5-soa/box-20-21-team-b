# Requests to launch in this order to test the services

Post `http://localhost/mission/poll/initiate` with body
`
{
    "rocketId" : 1
}
`

Get `http://localhost/weather/status`

Post `http://localhost/weather/poll/respond` with body
`
{
    "rocketId" : 1,
    "ready": true
}
`

Get `http://localhost/rocket/status**`

Post `http://localhost/rocket/poll/respond` with body
`
{
    "rocketId" : 1,
    "ready": true
}
`

Post `http://localhost/mission/poll/mission` with body
`
{
    "rocketId" : 1,
    "ready": true
}
`

Post `http://localhost/rocket/launch`

Post `http://localhost/rocket/detach-payload/altitude` with the following body
`
{
    "altitude" : 140
}
`

Get `http://localhost/telemetry/rocket-metrics/null/null`
