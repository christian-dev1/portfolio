import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, defer, of, throwError } from 'rxjs';
import { failingOnce } from '../../../../testing/failing-once';
import { ContentRetry, loadable } from './loadable';

function createHost<T>(source: Observable<T>) {
  @Component({ template: '' })
  class Host {
    readonly content = loadable(source);
  }

  return TestBed.createComponent(Host).componentInstance.content;
}

describe('loadable', () => {
  it('should expose the loaded value', () => {
    const content = createHost(of('data'));

    expect(content.value()).toBe('data');
    expect(content.failed()).toBe(false);
  });

  it('should flag the failure without throwing when the value is read', () => {
    const content = createHost(throwError(() => new Error('down')));

    expect(content.failed()).toBe(true);
    expect(content.value()).toBeUndefined();
  });

  it('should subscribe again and expose the value when a retry is requested', () => {
    const { source, calls } = failingOnce('data');
    const content = createHost(source);

    TestBed.inject(ContentRetry).retry();

    expect(calls()).toBe(2);
    expect(content.failed()).toBe(false);
    expect(content.value()).toBe('data');
  });

  it('should not subscribe again on retry when the load succeeded', () => {
    let calls = 0;
    createHost(defer(() => of(++calls)));

    TestBed.inject(ContentRetry).retry();

    expect(calls).toBe(1);
  });
});
