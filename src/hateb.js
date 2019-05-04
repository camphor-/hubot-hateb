// Description
//   A Hubot script for searching Hatena Bookmark
//
// Commands:
//   hubot hateb all <query> - Show all Hatena bookmark entries
//   hubot hateb hot <query> - Show hot Hatena bookmark entries
//   hubot hateb new <query> - Show new Hatena bookmark entries
//
// Author:
//   Yusuke Miyazaki <miyazaki.dev@gmail.com>

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (robot) => {
  robot.respond(/hateb (all|hot|new) (.*)/, async (msg) => {
    mode = msg.match[1];
    query = msg.match[2].trim();

    if (query === "") {
      msg.send("Query is empty.");
      return;
    }

    try {
      const results = await getEntries(mode, query);
      if (results.length === 0) {
        msg.send("No results.");
        return;
      }

      msg.send(formatResults(results.slice(0, 5)));
    } catch(e) {
      msg.send(`Server error: ${e}`);
    }
  });
};

async function getEntries(mode, query) {
  const params = { url: query };

  switch (mode) {
    case "all":
      params.sort = "eid";
      break;
    case "hot":
      params.sort = "count";
      break;
    case "new":
      break;
    default:
      throw "unknown mode";
  }

  try {
    const response = await axios.get("http://b.hatena.ne.jp/entrylist", { params });
    if (response.status !== 200) {
      throw `HTTP response status is unexpected: ${response.status}`;
    }
    const $ = cheerio.load(response.data);
    return $(".entrylist-contents").map((_, el) => {
      const $item = $(el);
      return {
        title: $item.find(".entrylist-contents-title a").attr("title"),
        url: $item.find(".entrylist-contents-title a").attr("href"),
        num: $item.find(".entrylist-contents-users a span").text(),
      }
    }).toArray();
  } catch (e) {
    throw e;
  }
}

function formatResults(results) {
  return results
    .slice(0, 5)
    .map((result, i) =>
      `#${i + 1}: ${result.num} Users\n${result.title}\n${result.url}`)
    .join("\n\n");
}
