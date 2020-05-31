package git

var postReceiveHook = []byte(`#!/bin/sh
$O2_POST_RECEIVE --config $CONFIGPATH
`)
