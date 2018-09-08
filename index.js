'use strict';

const mm = require('music-metadata');
const jimp = require('jimp');

async function metadata(filePath) {
  const { common } = await mm.parseFile(filePath, { native: true });
  let picture = common.picture && (await jimp.read(common.picture[0].data));
  picture =
    picture &&
    (await picture
    .resize(300, jimp.AUTO)
    .quality(60)
    .getBase64Async(common.picture[0].format));
  return {
    title: common.title,
    artist: common.artists && getUniqueValue(common.artists[0]),
    album: common.album,
    year: common.year && common.year.toString(),
    track: common.track.no,
    genre: common.genre && getUniqueValue(common.genre[0]),
    picture: picture,
    synopsis: common.description && common.description[0],
    show: common.tvShow,
    season: common.tvSeason,
    episode: common.tvEpisode,
    episodeId: common.tvEpisodeId,
    network: common.tvNetwork
  };
}

function getUniqueValue(value) {
  return value && [...new Set(value.match(/(?=\S)[^,]+?(?=\s*(,|$))/g))];
}

module.exports = metadata;
