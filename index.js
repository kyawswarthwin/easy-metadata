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
    artist: splitCommaSeparatedValues(common.artists),
    album: common.album,
    year: common.year && common.year.toString(),
    track: common.track.no,
    genre: splitCommaSeparatedValues(common.genre),
    picture: picture,
    synopsis: common.description && common.description,
    show: common.tvShow,
    season: common.tvSeason,
    episode: common.tvEpisode,
    episodeId: common.tvEpisodeId,
    network: common.tvNetwork
  };
}

function splitCommaSeparatedValues(array) {
  if(array && array.length === 1) {
    return array[0].split(',').map(v => v.trim());
  }
  return array;
}

module.exports = metadata;
