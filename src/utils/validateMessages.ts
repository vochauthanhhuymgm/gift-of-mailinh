/**
 * Message validation utilities
 * Ensures all 365 messages meet quality requirements
 */

import type { Message, MessageValidationResult } from '~/types';
import { appConfig } from '~/config';

/**
 * Validate a single message object
 */
export function validateMessage(message: any, index: number): string[] {
  const errors: string[] = [];

  if (!message) {
    errors.push(`Message at index ${index} is null or undefined`);
    return errors;
  }

  // Validate id
  if (message.id !== index) {
    errors.push(`Message at index ${index} has id ${message.id}, expected ${index}`);
  }

  // Validate content
  if (!message.content) {
    errors.push(`Message ${index} has empty or missing content`);
  } else if (typeof message.content !== 'string') {
    errors.push(`Message ${index} content is not a string`);
  } else if (message.content.trim().length < appConfig.MESSAGE_MIN_LENGTH) {
    errors.push(
      `Message ${index} content too short (${message.content.length} < ${appConfig.MESSAGE_MIN_LENGTH})`
    );
  } else if (message.content.length > appConfig.MESSAGE_MAX_LENGTH) {
    errors.push(
      `Message ${index} content too long (${message.content.length} > ${appConfig.MESSAGE_MAX_LENGTH})`
    );
  }

  // Validate author if present
  if (message.author && typeof message.author !== 'string') {
    errors.push(`Message ${index} author must be a string`);
  } else if (message.author && message.author.length > 100) {
    errors.push(`Message ${index} author too long (max 100 chars)`);
  }

  // Validate theme if present
  if (message.theme) {
    if (typeof message.theme !== 'string') {
      errors.push(`Message ${index} theme must be a string`);
    } else if (!appConfig.MESSAGE_THEMES.includes(message.theme)) {
      errors.push(
        `Message ${index} has invalid theme: ${message.theme}. Valid themes: ${appConfig.MESSAGE_THEMES.join(', ')}`
      );
    }
  }

  // Validate createdAt if present
  if (message.createdAt) {
    if (typeof message.createdAt !== 'string') {
      errors.push(`Message ${index} createdAt must be a string`);
    } else {
      const date = new Date(message.createdAt);
      if (isNaN(date.getTime())) {
        errors.push(`Message ${index} createdAt is not a valid date: ${message.createdAt}`);
      }
    }
  }

  return errors;
}

/**
 * Validate all messages
 */
export function validateAllMessages(messages: any[]): MessageValidationResult {
  const errors: string[] = [];

  // Validate count
  if (!Array.isArray(messages)) {
    return {
      isValid: false,
      errors: ['Messages is not an array'],
      totalMessages: 0,
    };
  }

  if (messages.length !== appConfig.TOTAL_MESSAGES) {
    errors.push(
      `Expected ${appConfig.TOTAL_MESSAGES} messages, found ${messages.length}`
    );
  }

  // Validate each message
  for (let i = 0; i < messages.length; i++) {
    const messageErrors = validateMessage(messages[i], i);
    errors.push(...messageErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    totalMessages: messages.length,
  };
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(result: MessageValidationResult): string {
  if (result.isValid) {
    return `✅ All ${result.totalMessages} messages are valid`;
  }

  return `❌ Validation failed with ${result.errors.length} errors:\n${result.errors.slice(0, 5).join('\n')}${result.errors.length > 5 ? `\n... and ${result.errors.length - 5} more errors` : ''}`;
}
