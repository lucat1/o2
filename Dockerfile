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

FROM scratch

COPY --from=builder /go/bin/o2 /bin/o2

ENTRYPOINT ["/bin/o2", "--debug"]