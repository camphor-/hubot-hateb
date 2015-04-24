# hubot-hateb

A Hubot script for searching Hatena Bookmark

See [`src/hateb.coffee`](src/hateb.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-hateb --save`

Then add **hubot-hateb** to your `external-scripts.json`:

```json
[
  "hubot-hateb"
]
```

## Sample Interaction

```
user1>> hubot hateb hot camph.net
hubot>> #1 / 588 Users
ノンデザイナーでもできる！写真を使ったイケてるメイン画像の作り方 - CAMPHOR- Tech Blog
http://tech.camph.net/mainimage-designing/

#2 / 559 Users
幻のホットケーキ『BLUE FIR　TREE』131軒目 | 京都カフェランチ日和
http://cafe-kyoto.camph.net/?p=8690

#3 / 528 Users
作って学ぶSwift/iOSアプリ入門Camphor- Tech Blog | Camphor- Tech Blog
http://tech.camph.net/?p=363

#4 / 466 Users
ノンデザイナーがそれっぽいWebデザインを作る話 - CAMPHOR- Blog
http://blog.camph.net/news/non-designer/

#5 / 89 Users
iOS 初心者が Swift を使って3日でゲームを作った話 - CAMPHOR- Tech Blog
http://tech.camph.net/an-ios-beginner-made-a-game-app-with-swift-in-3-days/
```
