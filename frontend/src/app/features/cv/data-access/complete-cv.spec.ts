import { isCompleteCv } from './complete-cv';

describe('isCompleteCv', () => {
  it.each([
    ['localhost', '?complet=1', true],
    ['127.0.0.1', '?complet=1', true],
    ['localhost', '?lang=fr&complet=1', true],
    ['localhost', '', false],
    ['127.0.0.1', '', false],
    ['localhost', '?complet=0', false],
    ['127.0.0.1', '?complet=0', false],
    ['localhost', '?complet=true', false],
    ['127.0.0.1', '?complet=true', false],
    ['localhost', '?complet=01', false],
    ['localhost', '?Complet=1', false],
    ['luchrist.example.com', '?complet=1', false],
    ['192.168.1.20', '?complet=1', false],
    ['localhost.example.com', '?complet=1', false],
    ['127.0.0.1.example.com', '?complet=1', false],
    ['::1', '?complet=1', false],
  ])('should evaluate host %s with query %s as %s', (hostname, search, expected) => {
    expect(isCompleteCv({ hostname, search })).toBe(expected);
  });
});
