'use strict';

const mm = require('music-metadata');

function metadata(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const { native, common } = await mm.parseFile(filePath, { native: true });
      const metadata = {
        title: common.title,
        artist: common.artists,
        album: common.album,
        albumArtist: common.albumartist,
        year: common.year && common.year.toString(),
        track: common.track.no,
        genre: common.genre,
        cover:
          common.picture &&
          `data:${common.picture[0].format};base64,${common.picture[0].data.toString('base64')}`
      };
      if (native['iTunes MP4']) {
        const iTunes = mm.orderTags(native['iTunes MP4']);
        metadata.synopsis = iTunes.ldes && iTunes.ldes[0];
        metadata.show = iTunes.tvsh && iTunes.tvsh[0];
        metadata.season = iTunes.tvsn && iTunes.tvsn[0];
        metadata.episode = iTunes.tves && iTunes.tves[0];
        metadata.episodeId = iTunes.tven && iTunes.tven[0];
        metadata.network = iTunes.tvnn && iTunes.tvnn[0];
      }
      resolve(metadata);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = metadata;
