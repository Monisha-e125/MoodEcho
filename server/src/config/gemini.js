const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI = null;
let model = null;

const initGemini = () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      logger.warn('⚠️ GEMINI_API_KEY not set — AI features disabled');
      return null;
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    logger.info('✅ Gemini AI initialized');
    return model;
  } catch (error) {
    logger.warn(`⚠️ Gemini init failed: ${error.message}`);
    return null;
  }
};

const getModel = () => {
  if (!model) initGemini();
  return model;
};

module.exports = { initGemini, getModel };