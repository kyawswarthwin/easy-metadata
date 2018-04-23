'use strict';

const jsmediatags = require('jsmediatags');

function metadata(filePath) {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(filePath)
      .setTagsToRead(['title', 'artist', 'album', 'year', 'track', 'genre', 'comment', 'picture'])
      .read({
        onSuccess: data => {
          resolve({
            title: data.tags.title,
            artist: data.tags.artist,
            album: data.tags.album,
            year: data.tags.year,
            track: data.tags.track,
            genre: data.tags.genre,
            comment: data.tags.comment.text,
            picture: `data:${data.tags.picture.format};base64,${Buffer.from(
              new Uint8Array(data.tags.picture.data)
            ).toString('base64')}`
          });
        },
        onError: error => {
          reject(error);
        }
      });
  });
}

module.exports = metadata;
