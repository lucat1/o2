package images

import (
	"crypto/aes"
	"encoding/hex"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/store"
	cache "github.com/patrickmn/go-cache"
)

var Cache = cache.New(24*time.Hour, 24*time.Hour)

func Init() {
	folder := store.GetConfig().Section("pictures").Key("directory").String()
	if _, err := os.Stat(folder); os.IsNotExist(err) {
		// create the pictures folder if it doesn't exists
		if err = os.Mkdir(folder, 0666); err != nil {
			log.Fatal().
				Err(err).
				Str("path", folder).
				Msg("Could not create the pictures folder")
		}
	}
}

func Get(hash string) (res []byte, err error) {
	if data, has := Cache.Get(hash); has {
		return data.([]byte), err
	}

	folder := store.GetConfig().Section("pictures").Key("directory").String()
	res, err = ioutil.ReadFile(path.Join(folder, hash+".jpg"))
	return
}

func Save(hash string, value []byte) (err error) {
	folder := store.GetConfig().Section("pictures").Key("directory").String()
	err = ioutil.WriteFile(path.Join(folder, hash+".jpg"), value, 0666)
	return
}

func Encrypt(image []byte) (res string, err error) {
	key := store.GetConfig().Section("pictures").Key("secret").String()
	c, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	out := make([]byte, len(image))
	c.Encrypt(out, []byte(image))

	return hex.EncodeToString(out), nil
}
