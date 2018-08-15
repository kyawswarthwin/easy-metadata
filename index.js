'use strict';

const jsmediatags = require('jsmediatags');

function metadata(filePath) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(filePath, {
      onSuccess: ({ type, tags }) => {
        const metadata = {
          title: tags.title,
          artist: tags.artist,
          album: tags.album,
          year: tags.year,
          comment: tags.comment && tags.comment.text ? tags.comment.text : tags.comment,
          track: tags.track,
          genre: tags.genre,
          picture:
            tags.picture &&
            `data:${tags.picture.format};base64,${Buffer.from(
              new Uint8Array(tags.picture.data)
            ).toString('base64')}`
        };
        if (type === 'MP4') {
          metadata.synopsis = tags.ldes && tags.ldes.data;
          metadata.show = tags.tvsh && tags.tvsh.data;
          metadata.season = tags.tvsn && tags.tvsn.data;
          metadata.episode = tags.tves && tags.tves.data;
          metadata.episodeId = tags.tven && tags.tven.data;
          metadata.network = tags.tvnn && tags.tvnn.data;
        }
        resolve(metadata);
      },
      onError: error => {
        reject(error);
      }
    });
  });
}

module.exports = metadata;
