/**
 * @fileOverview Simple operations with matrix
 * @module matrix-simple
 * @author Evgeniy Shavrov <shavrov.ep@gmail.com>
 * @version 0.0.1
 * @license MIT
 */

/**
 * Coordinate x or y of the matrix. Value >= 0
 * @typedef {number} MatrixCoordinate
 */

/**
* The value of the matrix element
* @typedef {*} MatrixValue
*/

/**
 * Real matrix
 * @class Matrix
 * @classdesc Class `Matrix` - Simple operations with matrix
 */
var Matrix = (function () {
    'use strict';

    /**
     * Container
     * @private
     * @param {*} target 2D array containing the data
     * @returns {Matrix} The new matrix
     */
    const container = target => {
        for (let prop in Matrix.prototype) {
            target[prop] = Matrix.prototype[prop];
        }
        return target;
    };
    /**
     * Copy Array
     * @private
     * @param {array} array 
     * returns {array}
     */
    const copyArray = array => {
        return array.map(function(arr) {
            return arr.slice();
        });
    }

    /**
     * @constructor
     * @param {array|number} obj|rows 
     * @param {number} [columns] 
     * @param {MatrixValue} [value] 
     * @returns {Matrix} The new identity matrix
     */
    const Matrix = function (obj) {
        // If an array is passed, then convert it to a matrix
        if (obj && Array.isArray(obj)) return container([...obj]);

        // Creates an identity matrix with the given dimension (rows, columns, value = 0)
        if (arguments.length > 1) return Matrix.prototype.create.apply(this, arguments);
    };

    // setup prototype chain to inherit `Array`
    let F = function () { };
    F.prototype = Array.prototype;
    Matrix.prototype = new F();


    /**
     * Creates an identity matrix with the given dimension.
     * @param {number} rows - Number of rows
     * @param {number} [columns=rows] - Number of columns
     * @param {*} [value=0] - All elements will be set to this value.
     * @returns {Matrix} - The new identity matrix
     * @example
     * // retrun [[ 4, 4, 4, 4, 4 ], 
     * //         [ 4, 4, 4, 4, 4 ]]
     * 
     * var matrix = Matrix(3, 3, 2).create(2, 5, 4);
     */
    Matrix.prototype.create = function (rows, columns, value = 0) {
        if (columns === undefined) columns = rows;
        let matrix = Array.from(Array(rows),
            () => Array.from(Array(columns),
                () => value
            ));
        return container(matrix);
    };

    /**
     * Returns a new array from the given row index
     * @param {number} index - Row index
     * @returns {array}
     */
    Matrix.prototype.getRow = function (index) {
        return this[index];
    };

    /**
     * Returns a new array from the given column index
     * @param {number} index - Column index 
     * @returns {array}
     */
    Matrix.prototype.getColumn = function (index) {
        return this.map(row => row[index]);
    };

    /**
     * Returns the given element of the matrix. `matrix.position(3, 4)` is equivalent to `matrix[3][4]`. 
     * 
     * Sets a given element of the matrix. `matrix.position(3, 4, 10)` is equivalent to `matrix[3][4] = 10`
     * @param {MatrixCoordinate} rowIndex - Index of the row
     *  @param {MatrixCoordinate} columnIndex - Index of the column
     * @param {MatrixValue} [value] - The new value for the element 
     * @returns {MatrixValue} - The new matrix
     * 
     * @example <caption>Use getter</caption>
     * // return  5
     * var matrix = [[0, 1, 2],
     *               [3, 4, 5]];
     * var value = Matrix(matrix).position(1, 2);
     *
     * @example <caption>Use setter</caption>
     * // return  10
     * var matrix = Matrix([[0, 1, 2], 
     *                      [3, 4, 5]]);
     * matrix.position(1, 2, 10);
     * var value = matrix.position(1, 2);
    */
    Matrix.prototype.position = function (rowIndex, columnIndex, value) {
        // setter
        if (arguments.length === 3) {
            this[rowIndex][columnIndex] = value;
            return this;
        } else {
            // getter
            return this[rowIndex][columnIndex];
        }
    };

    /**
     * Size Matrix
     * @example
     * // return  { rows: 2, columns: 3 }
     * var matrix = [[0, 1, 2], 
     *               [3, 4, 5]];
     * var size = Matrix(matrix).size();
     * @returns {Object}
     */
    Matrix.prototype.size = function () {
        let rows = this.getColumn(0).length,
            columns = this.getRow(0).length;
        return { rows, columns };
    };

    /**
     * Callback in method loop
     * @callback itemCallback
     * @param {int} rowIndex
     * @param {int} columnIndex
     * @param {*} value
     */

    /**
     * Callback for each element of the matrix
     * @param {itemCallback} callback - Function that will be called with three parameters : rowIndex, columnIndex and value
     * @return {Matrix} - this
     */
    Matrix.prototype.loop = function (callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        var that = this;
        this.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                callback.call(that, rowIndex, columnIndex, value);
            });
        });
        return this;
    };

    /**
     * Transposes the matrix and returns a new one containing the result
     * @example
     * // return  [[ 0, 3 ],
     * //          [ 1, 4 ],  
     * //          [ 2, 5 ]]
     * 
     * var matrix = [[0, 1, 2], 
     *               [3, 4, 5]];
     * var newMatrix = Matrix(matrix).transpose();
     * @returns {Matrix} - The new matrix
     */
    Matrix.prototype.transpose = function () {
        let matrix = copyArray(this);
        const { rows, columns } = this.size();
        let newMatrix = Array.from(Array(columns), () => Array.from(Array(rows), () => 0));
        for (let i = columns; i--;)
            for (let j = rows; j--;) {
                newMatrix[i][j] = matrix[j][i];
            }
        return container(newMatrix);
    }

    /**
     * Reverse matrix. Returns a view of the matrix flipped in the row or column axis
     * @param {number} [direction=1] - Direction `1`- row axis, `-1` - column axis
     * @returns {Matrix} - The new matrix
     */
    Matrix.prototype.reverse = function (direction = 1) {
        let matrix = copyArray(this);
        if (direction > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
        return container(matrix);
    }

    /**
     * Function of rotation of the matrix. The default rotation is clockwise. if `directiom <= 0`, then rotate counterclockwise.
     * @param {number} [direction=1] - Direction rotate (1, -1)
     * @param {number} [cycle=1] - Number cycle rotate
     * @returns {Matrix} - The new matrix
     */
    Matrix.prototype.rotate = function (direction = 1, cycle = 1) {
        let matrix = container(copyArray(this));
        for (let i = cycle; i--;) {
            matrix = matrix.transpose().reverse(direction);
        }
        return matrix;
    }

    /**
     * Returns a 2D array containing a copy of the data
     * @returns {array}
     */
    Matrix.prototype.toArray = function () {
        return copyArray(this);
    }

    return Matrix;
}());

module.exports = Matrix;