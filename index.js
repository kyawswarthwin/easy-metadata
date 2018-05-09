'use strict';

const jsmediatags = require('jsmediatags');

function metadata(filePath) {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(filePath)
      .setTagsToRead(['title', 'artist', 'album', 'year', 'comment', 'track', 'genre', 'picture'])
      .read({
        onSuccess: data => {
          resolve({
            title: data.tags.title,
            artist: data.tags.artist,
            album: data.tags.album,
            year: data.tags.year,
            comment:
              data.tags.comment && data.tags.comment.text
                ? data.tags.comment.text
                : data.tags.comment,
            track: data.tags.track,
            genre: data.tags.genre,
            picture:
              data.tags.picture &&
              `data:${data.tags.picture.format};base64,${Buffer.from(
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
