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

var Cache = cache.New(time.Hour, time.Hour)

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
	log.Debug().
		Str("hash", hash).
		Msg("Reading image from the filesystem")

	folder := store.GetConfig().Section("pictures").Key("directory").String()
	res, err = ioutil.ReadFile(path.Join(folder, hash+".jpeg"))

	// since we read the image we should now cache it to prevent further readings
	Cache.Add(hash, res, cache.DefaultExpiration)

	return
}

func Save(hash string, value []byte) (err error) {
	folder := store.GetConfig().Section("pictures").Key("directory").String()
	err = ioutil.WriteFile(path.Join(folder, hash+".jpeg"), value, 0666)
	if err != nil {
		return err
	}

	// add the image to the cache
	Cache.Set(hash, value, cache.DefaultExpiration)

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
