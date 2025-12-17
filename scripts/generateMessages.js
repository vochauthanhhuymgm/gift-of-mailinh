#!/usr/bin/env node
/**
 * Generate 365 daily life-healing suggestion messages
 * This script creates a complete messages.json file with actionable suggestions.
 * Run: node scripts/generateMessages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suggestionsByCategory = {
  'Mindfulness & Presence': [
    'Take five deep, slow breaths. Focus only on your breath.',
    'Notice three things in your room you haven\'t noticed before.',
    'Sip your morning coffee or tea without any distractions.',
    'Listen to a song with your eyes closed. Try to hear each instrument.',
    'Walk outside for five minutes and just observe your surroundings.',
    'Eat one meal without your phone or TV. Just focus on the food.',
    'Feel the sensation of water on your hands the next time you wash them.',
    'Look out a window and find something beautiful.',
    'Stretch your body for three minutes. Notice how your muscles feel.',
    'Say "I am here, now" to ground yourself in the present moment.',
  ],
  'Creativity & Play': [
    'Doodle on a piece of paper for five minutes with no goal in mind.',
    'Write down a single sentence of a story.',
    'Put on your favorite upbeat song and dance for its entire length.',
    'Try a new, simple recipe for a snack or drink.',
    'Take a photo of something that catches your eye today.',
    'Spend 10 minutes with a coloring book or app.',
    'Hum a tune you love.',
    'Think of a silly joke to tell a friend.',
    'Build something small with LEGOs or blocks if you have them.',
    'Rearrange a small corner of your room to make it feel fresh.',
  ],
  'Gratitude & Joy': [
    'Write down one thing you are grateful for today, no matter how small.',
    'Think of a person who has helped you and send them a thank you message.',
    'Look in the mirror and say one kind thing to yourself.',
    'Savor a piece of your favorite chocolate or fruit.',
    'Recall a happy memory and allow yourself to smile.',
    'Step outside and feel the sun or breeze on your face.',
    'Compliment the next person you interact with.',
    'Think of a skill you have that you are proud of.',
    'Appreciate the comfort of your bed before you get up or go to sleep.',
    'Acknowledge a small win from your day.',
  ],
  'Self-Care & Compassion': [
    'Drink a full glass of water right now.',
    'Forgive yourself for a small mistake you made recently.',
    'Place a hand on your heart and say, "You are doing your best."',
    'Allow yourself a 10-minute break to do absolutely nothing.',
    'Tidy up one small area of your space, like a tabletop or drawer.',
    'Choose an outfit that makes you feel comfortable and confident.',
    'Gently massage your own hands or neck for a minute.',
    'Plan a simple, healthy meal for yourself.',
    'Unfollow a social media account that makes you feel bad.',
    'Give yourself permission to say "no" to something you don\'t want to do.',
  ],
  'Connection & Relationships': [
    'Send a "thinking of you" text to a friend or family member.',
    'Ask someone how their day is and truly listen to the answer.',
    'Share a funny meme or video with someone.',
    'Make a plan to see a friend, even if it\'s just for a quick coffee.',
    'Tell someone you appreciate them.',
    'Smile at a stranger.',
    'Write a short, positive comment on a friend\'s social media post.',
    'Offer to help someone with a small task.',
    'Think about what makes a person you love special.',
    'Practice active listening in your next conversation.',
  ],
  'Growth & Resilience': [
    'Acknowledge one challenge you overcame recently.',
    'Read one page of a book or an interesting article.',
    'Identify one small thing you can do today to move toward a goal.',
    'Remind yourself: "This feeling is temporary."',
    'Learn a new word and try to use it today.',
    'When you feel overwhelmed, break a task into tiny, manageable steps.',
    'Think of a piece of advice you would give to a friend in your situation.',
    'Celebrate a small piece of progress you\'ve made.',
    'Remind yourself that it\'s okay to not have all the answers.',
    'Do one thing that feels slightly outside your comfort zone.',
  ],
};

function generateMessages() {
  const messages = [];
  const categories = Object.keys(suggestionsByCategory);
  let suggestionPool = [];

  // Create a flat pool of all suggestions with their category
  categories.forEach(category => {
    suggestionsByCategory[category].forEach(content => {
      suggestionPool.push({ content, theme: category });
    });
  });

  // Shuffle the pool to ensure variety
  for (let i = suggestionPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [suggestionPool[i], suggestionPool[j]] = [suggestionPool[j], suggestionPool[i]];
  }

  for (let i = 0; i < 365; i++) {
    // Loop through the shuffled pool
    const suggestion = suggestionPool[i % suggestionPool.length];

    const message = {
      id: i,
      content: suggestion.content,
      author: "Daily Life Suggestions",
      theme: suggestion.theme,
      createdAt: new Date(new Date().getFullYear(), 0, 1 + i).toISOString().split('T')[0]
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
    console.log(`Successfully generated 365 messages in ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate messages:', error);
    process.exit(1);
  }
}

main();
