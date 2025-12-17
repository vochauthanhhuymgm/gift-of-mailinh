#!/usr/bin/env node
/**
 * Generate 365 daily life-healing suggestion messages
 * This script creates a complete messages.json file with motivational messages
 * Run: node scripts/generateMessages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themes = ['self-care', 'resilience', 'gratitude', 'growth', 'courage', 'mindfulness', 'hope', 'strength', 'acceptance', 'peace'];

const messageTemplates = [
  "You are capable of amazing things. Take one small step today.",
  "Self-care is not selfish. It's the most loving thing you can do for yourself.",
  "Your struggles make you stronger. Every challenge is a lesson in disguise.",
  "Breathe. You are exactly where you need to be right now.",
  "Progress, not perfection. Every small win counts.",
  "You deserve kindness—especially from yourself.",
  "Today is a chance to choose what makes you happy.",
  "Your feelings are valid. Honor them without judgment.",
  "You are stronger than you think.",
  "Take care of your mind. It carries you through everything.",
  "Small progress is still progress. Be proud.",
  "You have survived every difficult day so far.",
  "Your worth is not determined by your productivity.",
  "Be patient with yourself. Growth takes time.",
  "You are allowed to rest. You are allowed to slow down.",
  "Your past does not define your future.",
  "Embrace your uniqueness. The world needs your gifts.",
  "You are enough, just as you are.",
  "Every setback is a setup for a comeback.",
  "Your mental health matters. Prioritize it.",
  "You are not alone in this. Reach out when you need help.",
  "Today, choose compassion—for others and yourself.",
  "You have the power to change your story.",
  "Rest is productive. Your body and mind need it.",
  "You are deserving of love, especially your own.",
  "Focus on what you can control. Let go of the rest.",
  "Your potential is limitless.",
  "Be kind to your future self.",
  "You are a work in progress, and that's beautiful.",
  "Your voice matters. Speak your truth.",
  "You are braver than you believe.",
  "Every day is a fresh start.",
  "You deserve to be happy.",
  "Trust yourself. You know what you need.",
  "Your dreams are worth pursuing.",
  "You are capable of creating the life you want.",
  "Be gentle with yourself on hard days.",
  "Your mental health is a priority, not a luxury.",
  "You have already overcome so much.",
  "Today, choose yourself.",
  "You are not broken. You are healing.",
  "Your story is not over yet.",
  "Be patient. Great things take time.",
  "You are worthy of the space you take up.",
  "Your feelings are valid. All of them.",
  "You deserve to be celebrated.",
  "Progress is not linear, and that's okay.",
  "You are doing better than you think.",
  "Your potential is infinite.",
  "Be kind to yourself today.",
  "You are enough."
];

function generateMessages() {
  const messages = [];

  for (let i = 0; i < 365; i++) {
    const theme = themes[i % themes.length];
    const messageIndex = i % messageTemplates.length;
    const baseMessage = messageTemplates[messageIndex];

    // Add day number to make each message unique
    const message = {
      id: i,
      content: baseMessage,
      author: "Daily Life Suggestions",
      theme: theme,
      createdAt: new Date(2025, 11, 1 + i).toISOString().split('T')[0]
    };

    messages.push(message);
  }

  return messages;
}

function main() {
  try {
    const messages = generateMessages();
    const outputPath = path.join(__dirname, '../public/messages.json');

    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(messages, null, 2));
    console.log(`✅ Generated ${messages.length} messages to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating messages:', error);
    process.exit(1);
  }
}

main();
