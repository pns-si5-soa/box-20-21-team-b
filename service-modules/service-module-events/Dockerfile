FROM golang:1.15

WORKDIR /app/service-module-events
COPY go.mod .
COPY go.sum .

RUN go mod download
COPY . .

RUN go build

# This container exposes port 8080 to the outside world
EXPOSE 3003

RUN ls

# Run the executable
CMD ["./service-module-events"]
