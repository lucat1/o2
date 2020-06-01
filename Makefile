all: o2 cmds

run: cmds
	PATH=$$PATH:$$PWD/bins go run main.go --debug

o2:
	go build main.go

cmds:
	go build -o bins/o2-post-receive cmd/post-receive/main.go