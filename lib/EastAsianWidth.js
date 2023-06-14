import { Buffer } from 'buffer';
import { UnicodeTrie } from '@cto.af/unicode-trie';

export const version = '15.0.0';
export const inputFileDate = new Date('2022-05-24T17:40:20.000Z');
export const generatedDate = new Date('2023-06-14T14:07:59.917Z');
export const EastAsianWidth = new UnicodeTrie(Buffer.from(
  `AAAEAAAAAABPAgAAG89JEB6Jsa2CPeYryr0OxuXdT0yAE0A16OLHb1tbIxAAMNnQpkD9li0V
   j0sn5LgrwK0iYMBqEv7c+Al3LTjcCowJIDept2+UxkJIqYCwmHlRNvGfzhQeioWDQCFQKAQO
   CguBh1c0mGBhHHQ0MT/XWfiXX0NJsG0CCfZwmo5wnS/CAz5A+FNsckIQIpCCEjSgm0pDTxOK
   Y0dslODi0PMx38ODXZ6paBNTl5dp4UXLy57Yr5TawXjTF8IjmaLjheTyzEW3JfO7ExlWr1B9
   QlcHtHC8y4nzX8AzpOlIYTIhwDR1fiwZK0HbUSj+9kwnnHqLFv+vD7D1kxpbEjV86TmXOLhy
   b2w7vSZUaMnZJN5Qnq/nQLqTzxONhmNu6Q/VqVZFRUtqS7qW4fx7wj7zGngaGrDiZIR5vg5R
   wb8l2FO8rTQgnFhYtuTSKJWCjdJJvwYyNS9ike2Qh8Jv/GnBeOjEvk9kZzFASt8hFn3PAQsH
   56SUjeM/qqTKqI3W6E1uEH7smifrje50t7oayYhsQRTasH2NRBkkoACMxhnDhXqem7ipAyIJ
   NwKuEp9KwiBeBABXBRkZjQmwJL0oLgSaDomvGiEUw/O/zVXiSgnYSQVO+IGRNSx3JhWN34k5
   kGPANEEeOoYnaIgPy7CGIYYRMEdWWCc6+vEIchkYmkWgIQ31GxjBBv0pgJqiJxjBI6L7oCW5
   ti4j4BDhffHlztDoWgiSgbjGYSmwn9FJcRv+6iG4QqYKZmpGxecTDJOCRgPFaOqNn/u63SFj
   Jw6qfgSzPNwHCwSAWyJOIiwiWSJdAw==`,
  'base64'
));
/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const values = EastAsianWidth.values;
