FROM golang:1.14-alpine AS builder

RUN apk update && apk add --no-cache git ca-certificates build-base && update-ca-certificates

WORKDIR /app

COPY . .

RUN go mod download
RUN go mod verify
RUN go get github.com/markbates/pkger/cmd/pkger && \
  rm -rf __quercia/*/server && \
  pkger

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -tags netgo -ldflags '-w -s' -o /go/bin/o2
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -tags netgo -ldflags '-w -s' -o /go/bin/o2-post-receive cmd/post-receive/*.go

RUN mkdir -p /data/repos

FROM alpine:latest

RUN apk update && apk add --no-cache git

WORKDIR /
COPY --from=builder /data /data
COPY --from=builder /go/bin/o2 /bin/o2
COPY --from=builder /go/bin/o2-post-receive /bin/o2-post-receive

ENTRYPOINT ["/bin/o2", "--debug"]