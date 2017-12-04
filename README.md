# ambient-lib Ambientのnode.jsライブラリー

## Ambient
[Ambient](https://ambidata.io)はIoTクラウドサービスで、センサーデーターを受信し、蓄積し、可視化(グラフ化)します。

![Ambient structure](https://ambidata.io/wp/wp-content/uploads/2016/09/AmbientStructure.jpg)

Ambientにユーザー登録(無料)し、マイコンからデーターを送ると、こんな感じでグラフ表示させることができます。

![Ambient chart](https://ambidata.io/wp/wp-content/uploads/2016/09/fig3-1024x651.jpg)

ambient-libはAmbientのnode.jsライブラリーです。

## インストール

```sh
$ npm install ambient-lib
```

## モジュールの読み込み

```javascript
var ambient = require('ambient-lib');
```
## Ambientへの接続

```javascript
ambient.connect(チャネルId, ライトキー[, リードキー[, ユーザーキー]]);
```
Ambientにデーターを送信するときは、チャネルIdとライトキーを指定してAmbientに接続します。

## Ambientへのデーター送信

```javascript
ambient.send(data, callback(err, res, body));
```

* パラメーター
 * ```data```: 次のようなJSON形式で、キーは```d1```から```d8```のいずれかを指定します。
```javascript
var data = {d1: 1.1, d2: 2.2};
```
 * ```callback```: データー送信後に呼ばれるコールバック関数。パラメーターは```request```モジュールのコールバック関数のパラメーターと同じです。

こんな風に使います。

```javascript
ambient.send({d1: 1.1, d2: 2.2}, function(err, res, body) {
    if (err) {
        console.log(err);
    }
    console.log(res.statusCode);
});
```

この形式でデーターを送信した場合、Ambientはデーターを受信した時刻を合わせて記録します。
次のようにデーターを測定した時刻を指定することもできます。
```javascript
var data = {created: 'YYYY-MM-DD HH:mm:ss.sss', d1: 1.1, d2: 2.2};
```

また、次のように複数のデーターを一括で送信することもできます。
```javascript
var data = [
    {created: '2017-02-18 12:00:00', d1: 1.1, d2: 2.1},
    {created: '2017-02-18 12:01:00', d1: 1.5, d2: 3.8},
    {created: '2017-02-18 12:02:00', d1: 1.0, d2: 0.8}
];
```

以前は複数データーの一括送信はbulk_send()という関数を提供していましたが、send()で1データーでも複数データーでも送信できるように拡張しました。
bulk_send()は互換性のために残してあります。

## Ambientへの複数データー一括送信

複数データー一括送信も用意しました。

```javascript
ambient.bulk_send(dataarray, callback(err, res, body));
```

* パラメーター
 * ```dataarray```: 次のような形式の配列です。
 ```created```はデーターの生成時刻で、値は“YYYY-MM-DD HH:mm:ss.sss”という形式か、 数値を渡します。
 数値を渡した場合は1970年1月1日00:00:00からのミリ秒と解釈されます。

```javascript
var dataarray = [
    {created: '2016-07-07 12:00:00', d1: 1.1, d2: 2.1},
    {created: '2016-07-07 12:01:00', d1: 1.5, d2: 3.8},
    {created: '2016-07-07 12:02:00', d1: 1.0, d2: 0.8}
];
```

## Ambientからのデーター読み込み

データー送信と同様に最初にチャネルIdとライトキー、リードキーを指定してAmbientに接続します。
読み込みしかしない場合、ライトキーは”を指定しても大丈夫です。

```javascript
ambient.connect(チャネルId, ライトキー[, リードキー[, ユーザーキー]]);
```

データーの読み込みにはデーター件数を指定する方法、日付を指定する方法、期間を指定する方法があります。

### 件数を指定してデーターを読み込む

```javascript
ambient.read({n: 件数[, skip: スキップ件数]}, function(err, res, data) {
    console.log({err: err, data: data});
});
```

* パラメーター
 * ```n```: 読み込むデーター件数を指定します。最新のn件のデーターが読み込まれます。
 * ```skip```: スキップ件数。最新からスキップ件のデーターを読み飛ばし、その先n件のデーターが読み込まれます。
 * ```callback```: データー送信後に呼ばれるコールバック関数。パラメーターは```request```モジュールのコールバック関数のパラメーターと同じです。


* 戻り値

次のようなJSON形式の配列が返されます。
```javascript
[
    {created: '2017-02-25T15:01:48.000Z', d1: 数値, d2: 数値, d3: 数値},
    {created: '2017-02-25T15:06:47.000Z', d1: 数値, d2: 数値, d3: 数値},
    ...
];
```

データーの生成時刻’created’は協定世界時(UTC)で表示されます。データーは生成時刻の昇順(古いものから新しいものへ)で並びます。

### 日付を指定してデーターを読み込む

```javascript
ambient.read({date: 'YYYY-mm-dd'}, function(err, res, data) {
    console.log({err: err, data: data});
});
```

* パラメーター
 * date: ’YYYY-mm-dd’: 指定した日付のデーターを読み込みます。

* 戻り値
 * 件数を指定した場合と同じJSON形式の配列が返されます。

### 期間を指定してデーターを読み込む

```javascript
ambient.read({start: 'YYYY-mm-dd HH:MM:SS', end: 'YYYY-mm-dd HH:MM:SS'}, function(err, res, data) {
    console.log({err: err, data: data});
});
```

* パラメーター
 * start: ’YYYY-mm-dd HH:MM:SS’:
 * end: ’YYYY-mm-dd HH:MM:SS’:
startからendまでの期間のデーターを読み込みます。

* 戻り値
 * 件数を指定した場合と同じJSON形式の配列が返されます。
