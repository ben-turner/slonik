// @flow

import test from 'ava';
import createSqlTag from '../../../../src/factories/createSqlTag';
import {
  SqlToken,
} from '../../../../src/tokens';

const sql = createSqlTag();

test('binds an empty array', (t) => {
  const query = sql`SELECT ${sql.array([], 'int4')}`;

  t.deepEqual(query, {
    sql: 'SELECT $1::"int4"[]',
    type: SqlToken,
    values: [
      [],
    ],
  });
});

test('binds an array with multiple values', (t) => {
  const query = sql`SELECT ${sql.array([1, 2, 3], 'int4')}`;

  t.deepEqual(query, {
    sql: 'SELECT $1::"int4"[]',
    type: SqlToken,
    values: [
      [
        1,
        2,
        3,
      ],
    ],
  });
});

test('offsets positional parameter indexes', (t) => {
  const query = sql`SELECT ${1}, ${sql.array([1, 2, 3], 'int4')}, ${3}`;

  t.deepEqual(query, {
    sql: 'SELECT $1, $2::"int4"[], $3',
    type: SqlToken,
    values: [
      1,
      [
        1,
        2,
        3,
      ],
      3,
    ],
  });
});

test('binds a SQL token', (t) => {
  const query = sql`SELECT ${sql.array([1, 2, 3], sql`int[]`)}`;

  t.deepEqual(query, {
    sql: 'SELECT $1::int[]',
    type: SqlToken,
    values: [
      [
        1,
        2,
        3,
      ],
    ],
  });
});

test('throws if memberType is not a string or SqlToken of different type than "SLONIK_TOKEN_RAW"', (t) => {
  t.throws(() => {
    // $FlowFixMe
    sql`SELECT ${sql.array([1, 2, 3], sql.identifier(['int']))}`;
  }, 'Unsupported `memberType`. `memberType` must be a string or SqlToken of "SLONIK_TOKEN_RAW" type.');
});

test('the resulting object is immutable', (t) => {
  const token = sql.array([1, 2, 3], 'int4');

  t.throws(() => {
    // $FlowFixMe
    token.foo = 'bar';
  });
});
