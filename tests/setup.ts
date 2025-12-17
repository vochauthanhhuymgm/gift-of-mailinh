import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock modules globally
vi.mock('~/utils/dateCalculation', () => ({
  calculateDayIndex: vi.fn((start, current) => {
    const diff = current.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }),
  isMessageUnlockedAtTime: vi.fn((hour, minute, currentTime) => {
    const current = new Date(currentTime);
    const unlock = new Date(currentTime);
    unlock.setHours(hour, minute, 0, 0);
    return current >= unlock;
  }),
  getMillisUntilNextUnlock: vi.fn((hour, minute) => {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);

    // If time has passed today, return time until tomorrow
    if (now > next) {
      next.setDate(next.getDate() + 1);
    }

    return next.getTime() - now.getTime();
  }),
  formatDateISO: vi.fn((date) => date.toISOString().split('T')[0]),
  parseISODate: vi.fn((dateStr) => new Date(dateStr)),
}));

// Configure Vue Test Utils
config.global.stubs = {
  NuxtLink: true,
  NuxtPage: true,
  ClientOnly: true,
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia for prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console warnings in tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Not implemented: HTMLFormElement.prototype.submit')) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Test utilities for date/time mocking
export function mockDate(dateStr: string) {
  const mockDate = new Date(dateStr);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
  return mockDate;
}

export function restoreMockDate() {
  vi.useRealTimers();
}

// Test utilities for message service
export function createMockMessage(overrides = {}) {
  return {
    id: 0,
    content: 'Test message content',
    author: 'Test Author',
    theme: 'self-care',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockMessages(count: number) {
  return Array.from({ length: count }, (_, i) => createMockMessage({ id: i }));
}
