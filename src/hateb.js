/*
 * Description
 *   Hubot Script for Hatena Bookmark
 *
 * Configuration:
 *   None
 *
 * Commands:
 *   hubot hateb new <query> <n> - Search new entries
 *   hubot hateb hot|hotentry|ranking <query> <n> - Search hot entries
 *
 * Notes:
 *
 * Author:
 *   Yusuke Miyazaki <miyazaki.dev@gmail.com>
 */

var cheerio = require("cheerio");
var request = require("request");

var get_entries = function (mode, url, callback) {
  var query_url;

  if (mode === 'new') {
    query_url = 'http://b.hatena.ne.jp/entrylist?layout=headline&url=';
  } else if (mode === 'hot') {
    query_url = 'http://b.hatena.ne.jp/entrylist?sort=count&layout=headline&url=';
  } else {
    return;
  }

  request({
    uri: query_url + url,
  }, function (error, response, body) {
    var $ = cheerio.load(body);
    callback($(".entrylist .entrylist-unit").map(function () {
      var $item = $(this);
      var $link = $item.find(".entry-link");
      return {
        title: $link.text(),
        url: $link.attr("href"),
        num: parseInt($item.find(".users span").text())
      }
    }));
  });
};

module.exports = function (robot) {
  robot.respond(/hateb (hot|hotentry|new|ranking) (.*)/i, function(msg) {
    // 引数のパース
    var argv = msg.match[2].trim().split(/ +/);
    if (argv[0] === "") { argv = [] };
    var argc = argv.length;

    // 引数のデフォルト値
    var mode = 'hot';
    var query = ''
    var num = 5;

    if (argc === 0) { return }

    // 第1引数: モード
    if (msg.match[1] === 'new') {
      mode = 'new';
    }

    // 第2引数: クエリ
    if (1 <= argc) {
      query = argv[0];
    }

    // 第3引数: 件数 (optional)
    if (2 <= argc) {
      num = parseInt(argv[1], 10) || num;
    }

    get_entries(mode, query, function (results) {
      var message = ''
      for (var i = 0; i < Math.min(results.length, num); i++) {
        var result = results[i];
        message += "#" + (i + 1) + " / " + result.num + " Users\n";
        message += result.title + "\n";
        message += result.url + "\n\n";
      }
      msg.send(message);
    });
  });
};
