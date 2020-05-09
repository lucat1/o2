FROM golang:1.14-alpine AS builder

RUN apk update && apk add --no-cache git ca-certificates build-base && update-ca-certificates

WORKDIR /app

COPY . .

RUN go mod download
RUN go mod verify
RUN go get github.com/markbates/pkger/cmd/pkger && \
  rm -rf __quercia/*/server && \
  pkger

RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/o2

FROM scratch

COPY --from=builder /go/bin/o2 /app/o2

ENTRYPOINT ["/app/o2"]