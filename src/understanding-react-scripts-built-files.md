# 静的ホスティングのためにreact-scripts buildが生成したファイルを理解する

Github pagesなどのホスティングサービスにデプロイするために、
reactで書いたソースコードを配信用に最適化したプロダクションコードにビルドする必要がある。そのために`react-scripts build`というコマンドがある。

https://create-react-app.dev/docs/getting-started/#npm-run-build-or-yarn-build

react公式チュートリアルの三目並べ（[Tic-tac-toe](https://reactjs.org/tutorial/tutorial.html)）をビルドした結果、以下のようなファイル群が生成される。

```console
root
├── static
│   ├── css
│   │   ├── main.22941023.css
│   │   └── main.22941023.css.map
│   └── js
│       ├── main.1f868033.js
│       ├── main.1f868033.js.LICENSE.txt
│       └── main.1f868033.js.map
├── asset-manifest.json
├── favicon.ico
├── index.html
├── logo192.png
├── logo512.png
├── manifest.json
└── robots.txt
```

https://github.com/shiiyan/my-first-react-game/tree/gh-pages

ここでは、これらはどういう内容が入り、どういう用途があるかをまとめる。

## static

cssとjsという2つのサブディレクトリーがある。

### main.22941023.css

CSSを定義したソースファイルindex.cssから空白と空行をすべて取り除いた一行コード（One Liner）
ファイル名のハッシュ値（数字部分）はソースコードの内容と直接に関係している。同じ内容で何度ビルドしても、同じファイル名となる。

### main.22941023.css.map

CSSのソースファイルと圧縮した(minified)ファイルをマッピングするファイル。
特に、SassなどのCSSプリプロセッサ（CSS proprocessor）で書いたソースファイルをブラウザでデバッグするために使われるらしい。
https://stackoverflow.com/a/54071735

今回ビルドしたファイルは以下の特徴がある。

* 空白と空行をすべて取り除いた1行ファイル（ワンライナー・One Liner)
* 中身はJSONファイルと同じ構成
  * fileはビルドしたファイルパスを文字列として保持
  * sourcesはソースファイルパスを配列として保持
  * sourcesContentはソースファイルの中身を配列として保持。空白はそのまま、改行は\nの形式で記録されている

### main.1f868033.js

ソースファイルindex.jsからwebpackを利用してコンパイルした1行ファイル。

Reactコンポーネント内で定義したメソッド名を検索するとソースコードの痕跡がわかるが、クラスなどの構成要素はすでにコンパイルされていて認識できない。

react-scriptsにおけるwebpackのコンフィグは以下のように。
https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js

react-scripts buildのソースコードは以下のように。

https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/build.js#L146

```javascript
function build(previousFileSizes) { 
    console.log('Creating an optimized production build...');
    const compiler = webpack(config);
    return new Promise((resolve, reject) => {...}
};
```

### main.1f868033.js.LICENSE.txt

jsファイルのライセンス情報を保持する。

今回の場合に以下のものがある。

* react-dom.production.min.js
* react-jsx-runtime.production.min.js
* react.production.min.js
* scheduler.production.min.js

https://github.com/shiiyan/my-first-react-game/blob/gh-pages/static/js/main.1f868033.js.LICENSE.txt

### main.1f868033.js.map

ソースファイル（index.js）とコンパイルしたファイル（main.1f868033.js）をマッピングするファイル。

構造と用途はCSSマッピングファイルと同じらしい。

https://stackoverflow.com/a/21719713

## asset-manifest.json

マニフェストはwebpackのランタイムが依存解決する時に必要なモジュールの詳細情報をまとめたファイルらしい。

https://webpack.js.org/concepts/manifest/

今回では、以下のようにfilesとentrypointsを定義している。

```json
{
 "files": {
    "main.css": "/my-first-react-game/static/css/main.00c26109.css",
    "main.js": "/my-first-react-game/static/js/main.1f868033.js",
    "index.html": "/my-first-react-game/index.html",
    "main.00c26109.css.map": "/my-first-react-game/static/css/main.00c26109.css.map",
    "main.1f868033.js.map": "/my-first-react-game/static/js/main.1f868033.js.map"
  },
  "entrypoints": [
    "static/css/main.00c26109.css",
    "static/js/main.1f868033.js"
  ]
}
```

## favicon.ico

ファビコンのファイル。

ファビコンが誕生した初期、IE(Internet Explorer )がウェブサイトをブックマークする時にファビコンをURLの隣に表示するため、ファビコンへのリクエスト数を利用してブックマーク数が分かることがあった。

https://en.wikipedia.org/wiki/Favicon

## index.html

エントリーポイントのHTML。1行に圧縮されている。`<head>`の中に、main.jsやmain.cssなどに対する参照を持つ。`<body>`の中に、rootというidを持つdivがある。

## logo192.png

アップルタッチアイコンとして使われるログ画像。サイズは192×192。

アップルタッチアイコンはiPhoneやiPadなどでWebページをホームスクリーンに追加する時に使用されるアイコンらしい。

https://www.computerhope.com/jargon/a/appletou.htm#:~:text=Similar%20to%20the%20Favicon%2C%20the,screen%2C%20this%20icon%20is%20used

index.htmlでは以下のようにアップルタッチアイコンを定義している。

```html
<link rel="apple-touch-icon" href="/my-first-react-game/logo192.png"/>
```

## logo512.png

ログ画像。サイズは512×512。

デフォルトでは、index.htmlから直接利用していないが、後から説明するmainifest.json内でアイコンの1つとして登録されている。

## manifest.json

asset-manifest.jsonとは違い、webpackコンパイルする前に存在するファイル。create-react-appsで生成できる。

htmlのmetaタグのようにウェブアプリケーション全体のメタ情報を定義するファイルらしい。

https://www.w3.org/TR/appmanifest/#web-application-manifest

デフォルトでは、以下のような情報がある。

```json
{
 "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

displayは表示モード（display mode）を指定するオプション。standaloneはネーティブアプリような見た目を意味する。

https://www.w3.org/TR/mediaqueries-5/#display-mode

start_urlはウェブアプリを起動した後に最初にアクセスしてほしいURLを宣言するオプション。相対パスでも指定可能。

https://www.w3.org/TR/appmanifest/#start_url-member

## robots.txt

検索エンジンなどのクローラーに対して、アクセス可能はパスと不可なパスを定義するファイル。

robots.txtを作成時に有用な情報はこちら。
https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ja

デフォルトではアクセスルールが以下のように定義されているため、全てのクローラーに対してサイトを全開放している。

```txt
User-agent: *
Disallow:
```
