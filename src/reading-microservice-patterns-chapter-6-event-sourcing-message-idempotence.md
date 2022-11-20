# マイクロサービスパターンの読書　第 6 章

## イベントソーシングを利用したイベントパブリッシュ

ポーリング

```SQL

SELECT * FROM EVENTS WHERE PUBLICSHED = 0 ORDER BY event_id ASC;

UPDATE EVENTS SET PUBLISHED = 1 WHERE EVENT_ID IN (<イベントブローカーにパブリッシュ済みのEVENT_ID>);
```

トランザクションログから EVENTS テーブルに挿入したイベントを取得する手法もある。トランザクションログテーリングと呼ばれる。

## スナップショットを使ってパフォーマンスを向上させる

```
EVENTS
    - event_id
    - event_type
    - entity_type
    - entity_id
    - event_data
```

```
SNAPSHOTS
    - event_id
    - entity_type
    - entity_id
    - snapshot_data
```

## 冪等なメッセージ処理

メッセージコンシューマは同じメッセージを複数回呼び出されても結果が同じであること。RDBMS なら、EVENTS テーブルにイベントを挿入するトランザクション内で、PROCESSED_MESSAGES テーブルにメッセージ ID を挿入する。NOSQL なら、メッセージング処理の過程で生成されるイベントにメッセージ ID を格納する。イベントを生成しない場合に、メッセージ ID を記録した擬似イベントを保存する。
