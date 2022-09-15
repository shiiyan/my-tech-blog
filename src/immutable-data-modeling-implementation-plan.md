# イミュータブルデータモデリングを実装したい

要求

- イベントソーシングを実現しやすいステート管理ライブラリー
- 言語はJavaScript(TS)
- インフラ構築いらないSPA

ステート管理ライブラリー候補

- Redux
- XState
- useReducer
- Recoil
- Vuex Store

## Redux

ReduxでUndoとRedo

https://redux.js.org/usage/implementing-undo-history

#next

Command PatternでUndoとRedo

https://en.wikipedia.org/wiki/Command_pattern

#designpattern
#commandpattern
#todo

> Multi-level undo

> If all user actions in a program are implemented as command objects,
the program can keep a stack of the most recently executed commands.
When the user wants to undo a command,
the program simply pops the most recent command object and executes its undo() method.

> Progress bars

> Suppose a program has a sequence of commands that it executes in order.
If each command object has a getEstimatedDuration() method,
the program can easily estimate the total duration.
It can show a progress bar that meaningfully reflects
how close the program is to completing all the tasks.

#implement
#immutabledatamodeling
#javascript
