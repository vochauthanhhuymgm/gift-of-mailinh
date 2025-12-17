/**
 * Message Service
 * Loads and provides access to the 365 messages from messages.json
 * Based on contracts/openapi.yaml specifications
 */

import type { Message, MessageValidationResult } from '~/types';
import { appConfig } from '~/config';

class MessageServiceClass {
  private messages: Message[] = [];
  private isLoaded = false;
  private loadPromise: Promise<Message[]> | null = null;

  /**
   * Load all 365 messages from messages.json (called once at app startup)
   * Implements lazy loading with caching
   */
  async loadMessages(): Promise<Message[]> {
    if (this.isLoaded) {
      return this.messages;
    }

    // If already loading, return the pending promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._performLoad();
    return this.loadPromise;
  }

  private async _performLoad(): Promise<Message[]> {
    try {
      const response = await fetch(appConfig.MESSAGES_JSON_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.status} ${response.statusText}`);
      }

      this.messages = await response.json();
      this.isLoaded = true;

      // Validate on load
      const validation = this.validateMessages();
      if (!validation.isValid) {
        console.warn('Message validation warnings:', validation.errors);
      }

      return this.messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      throw new Error(`Failed to load messages: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a single message by index (0-364)
   * Returns undefined if index is out of bounds
   */
  getMessageByIndex(index: number): Message | undefined {
    if (!this.isLoaded) {
      console.warn('Messages not yet loaded. Call loadMessages() first.');
      return undefined;
    }

    if (index < 0 || index > appConfig.LAST_DAY_INDEX) {
      return undefined;
    }

    return this.messages[index];
  }

  /**
   * Get total count of messages (should always be 365)
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * Check if all 365 messages are present and valid
   * Returns validation result with any errors found
   */
  validateMessages(): MessageValidationResult {
    const errors: string[] = [];

    // Check total count
    if (this.messages.length !== appConfig.TOTAL_MESSAGES) {
      errors.push(
        `Expected ${appConfig.TOTAL_MESSAGES} messages, found ${this.messages.length}`
      );
    }

    // Check each message
    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];

      // Validate id matches position
      if (msg.id !== i) {
        errors.push(`Message at index ${i} has id ${msg.id}, expected ${i}`);
      }

      // Validate content is not empty
      if (!msg.content || msg.content.trim().length === 0) {
        errors.push(`Message ${i} has empty content`);
      }

      // Validate content length
      if (msg.content && msg.content.length > appConfig.MESSAGE_MAX_LENGTH) {
        errors.push(`Message ${i} exceeds max length (${msg.content.length} > ${appConfig.MESSAGE_MAX_LENGTH})`);
      }

      // Validate theme if present
      if (msg.theme && !appConfig.MESSAGE_THEMES.includes(msg.theme as any)) {
        errors.push(`Message ${i} has invalid theme: ${msg.theme}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalMessages: this.messages.length,
    };
  }

  /**
   * Reset loaded state (useful for testing)
   */
  reset(): void {
    this.messages = [];
    this.isLoaded = false;
    this.loadPromise = null;
  }
}

// Singleton instance
export const messageService = new MessageServiceClass();

/**
 * Composable hook for using the message service in Vue components
 */
export function useMessageService() {
  return {
    loadMessages: () => messageService.loadMessages(),
    getMessageByIndex: (index: number) => messageService.getMessageByIndex(index),
    getMessageCount: () => messageService.getMessageCount(),
    validateMessages: () => messageService.validateMessages(),
  };
}
