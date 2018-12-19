'use strict';

const mm = require('music-metadata');
const jimp = require('jimp');

function metadata(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const { native, common } = await mm.parseFile(filePath, { native: true });
      let picture = common.picture && (await jimp.read(common.picture[0].data));
      picture =
        picture &&
        (await picture
          .resize(300, jimp.AUTO)
          .quality(60)
          .getBase64Async(common.picture[0].format));
      const metadata = {
        title: common.title,
        artist: common.artists && getUniqueValue(common.artists[0]),
        album: common.album,
        year: common.year && common.year.toString(),
        track: common.track.no,
        genre: common.genre && getUniqueValue(common.genre[0]),
        picture: picture
      };
      if (native['iTunes']) {
        const iTunes = mm.orderTags(native['iTunes']);
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

function getUniqueValue(value) {
  return value && [...new Set(value.match(/(?=\S)[^,]+?(?=\s*(,|$))/g))];
}

module.exports = metadata;
