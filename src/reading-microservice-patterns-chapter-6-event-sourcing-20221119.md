# マイクロサービスパターンの読書　第 6 章

作者の Chris Richardson さんが用意したイベントソーシングパターンを紹介するページはこちら。
https://microservices.io/patterns/data/event-sourcing.html

## クイックメモ

イベントソーシングは永続化する手段のひとつ。状態変更を表すドメインイベントのシーケンスという形でアグリゲートを永続化する。従来の永続化はアグリゲートをテーブルにィールドを列にンスタンスを行にマッピングしていた。アグリゲートをロードする時にはータベースから読み取った一連のイベントを順番に適用する。

```
Event
    - event_id
    - event_type
    - entity_type
    - entity_id
    - event_data
```

ドメインイベントはブスクライバにアグリゲートの状態の変化を通知するメカニズム。イベントをパブリッシュするかういう情報を入れるかはコンシューマのニーズによって決まる。イベントソーシングを使うとグリゲートの状態の全ての変化はドメインイベントによって表現する。
イベントソーシングフレームワークに Eventuate Client フレームワークがある。
Order エンティティの実例。`createOrder()` は `process(CreateOrderCommand)` と `apply(OrderCreateEvent)` に変わる。`reviseOrder()` は `process(ReviseOrderCommand)` と `apply(OrderRevisedEvent)` に変わる。`process()` は新しいイベントを生成apply()` はアグリゲートを更新。実例は冒頭のリンクを参照。

イベントストアも同時更新の処理のために楽観ロックが必要。アグリゲートにバージョン情報を持っていてベント挿入時にイベントストアはバージョンが変わっていないことをチェックする。一番シンプルなバーションはイベント数を使うこと。

```SQL
UPDATE AGGREGATE_ROOT_TABLE
SET VERSION = VERSION + 1
WHERE VERSION = <元のバージョン>
```

楽観ロックと悲観ロックを比較するわかりやすい参考資料
https://qiita.com/NagaokaKenichi/items/73040df85b7bd4e9ecfc

#reading
#microservicepattern
#weekend
