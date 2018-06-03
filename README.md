# matrix-simple

Simple operations with matrix

## Installation

`$ npm install --save matrix-simple`

## Usage

### As an ES module

```js
import Matrix from 'matrix-simple';

const matrix = Matrix(5, 5);
```

### As a CommonJS module

```js
const { Matrix } = require('matrix-simple');

const matrix = Matrix(5, 5);
```

## Examples

### Standard operations

```js
import Matrix from 'matrix-simple';

var A = Matrix([[0, 1, 2], [3, 4, 5]]);

// ============================
// Manipulation of the matrix :
// =============================

var firstRow = A.getRow(0); // firstRow = Array [0, 1, 2]
var firstCol = A.getColumn(0); // firstCol = Array [0, 3]
var firstValue = A.position(0, 0); // position(row, column) firstValue = 0
var value = A.position(1, 2); // value = 5
var size = A.size(); // size = Object {rows: 2, columns: 3}
var transpose = A.transpose(); // tranpose = Matrix [[0, 3 ], [1, 4], [2, 5]]
A.loop((row, column, value) => console.log(`value = ${value} (column: ${column}, row: ${column})`));
    // value = 0 (column: 0, row: 0)
    // value = 1 (column: 1, row: 1)
    // value = 2 (column: 2, row: 2)
    // value = 3 (column: 0, row: 0)
    // value = 4 (column: 1, row: 1)
    // value = 5 (column: 2, row: 2)
var reverse = A.reverse(); // reverse = Matrix [[2, 1, 0], [5, 4, 3]]
var rotate = A.rotate(); // rotate = Matrix [[5, 2], [4, 1], [3, 0]]
var array2d = A.toArray(); // array2d = Array [[0, 1, 2], [3, 4, 5]]
A.position(0, 1, 10); // Mutation Matrix, A = Matrix [[0, 10, 2], [3, 4, 5]]. 
                      // We have change the first row and the second column.

```

## License

[MIT](./LICENSE)