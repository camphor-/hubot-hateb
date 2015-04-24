# Description
#   A Hubot script for searching Hatena Bookmark
#
# Commands:
#   hubot hateb hot <query> - Search hot Hatena bookmark entries
#   hubot hateb new <query> - Search new Hatena bookmark entries
#
# Author:
#   Yusuke Miyazaki <miyazaki.dev@gmail.com>

cheerio = require "cheerio"

module.exports = (robot) ->
  robot.respond /hateb (hot|new) (.*)/, (msg) ->
    query = msg.match[2].trim()
    if query == ""
      msg.send "Query is empty."
    else
      get_entries msg, msg.match[1], query, (err, results) ->
        if err
          msg.send "Error: hubot-hateb"
          msg.send err
        else
          if results.length == 0
            msg.send "No results"
          else
            results = results
              .slice 0, 5
              .map (result, i) ->
                "##{i + 1} / #{result.num} Users\n#{result.title}\n#{result.url}"
            msg.send results.join "\n\n"


get_entries = (msg, mode, query, callback) ->
  switch mode
    when "hot" then url = "http://b.hatena.ne.jp/entrylist?sort=count&layout=headline&url="
    when "new" then url = "http://b.hatena.ne.jp/entrylist?layout=headline&url="
    else return

  msg
    .http(url + encodeURIComponent(query))
    .get() (err, res, body) ->
      if err
        callback err, null
      else
        $ = cheerio.load body
        results = $ ".entrylist .entrylist-unit"
          .map ->
            $item = $ this
            $link = $item.find ".entry-link"

            title: $link.text()
            url: $link.attr "href"
            num: parseInt($item.find(".users span").text())
          .toArray()
        callback null, results
