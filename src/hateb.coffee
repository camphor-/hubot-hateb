# Description
#   A Hubot script for searching Hatena Bookmark
#
# Commands:
#   hubot hateb hot <query> - Search hot Hatena bookmark entries
#   hubot hateb new <query> - Search new Hatena bookmark entries
#
# Author:
#   Yusuke Miyazaki <miyazaki.dev@gmail.com>

cheerio = require("cheerio")

module.exports = (robot) ->
  robot.respond /hateb (hot|new) (.*)/, (msg) ->
    mode = msg.match[1]
    query = msg.match[2].trim()

    if query == ""
      msg.send("Query is empty.")
      return

    get_entries(mode, query, (err, results) ->
      if err
        msg.send("Error: hubot-hateb")
        msg.send(err)
        return

      if results.length == 0
        msg.send("No results")
        return

      response =
        results
        .slice(0, 5)
        .map (result, i) ->
          "##{i + 1} / #{result.num} Users\n#{result.title}\n#{result.url}"
        .join "\n\n"
      msg.send response)

  get_entries = (mode, query, callback) ->
    switch mode
      when "hot" then url = "http://b.hatena.ne.jp/entrylist?sort=count&layout=headline&url="
      when "new" then url = "http://b.hatena.ne.jp/entrylist?layout=headline&url="
      else
        callback("unknown mode", null)
        return

    robot
      .http(url + encodeURIComponent(query))
      .get() (err, res, body) ->
        if err
          callback(err, null)
          return

        $ = cheerio.load(body)
        results =
          $("[data-track-section='default'] .entrylist-unit")
          .map () ->
            $item = $(this)
            $link = $item.find(".entry-link")
            title: $link.text()
            url: $link.attr("href")
            num: parseInt($item.find(".users span").text())
          .toArray()
        callback(null, results)
