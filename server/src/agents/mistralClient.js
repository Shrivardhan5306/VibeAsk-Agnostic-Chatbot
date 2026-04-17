/**
 * AI Client
 * Supports Mistral (primary), Groq (fallback), and Google Gemini
 * Falls back to mock responses when no API key works
 */

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Call Mistral API (primary LLM)
 */
async function callMistralAPI(messages, options = {}) {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'mistral-small-latest',
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 4096,
      }),
    })

    if (!response.ok) {
      console.error('Mistral API error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (err) {
    console.error('Mistral API call failed:', err.message)
    return null
  }
}

/**
 * Call Groq API (fallback LLM — very fast)
 */
async function callGroqAPI(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.3-70b-versatile',
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 4096,
      }),
    })

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (err) {
    console.error('Groq API call failed:', err.message)
    return null
  }
}

/**
 * Main AI call — tries Mistral → Groq → returns null for mock
 */
export async function callAI(messages, options = {}) {
  // Try Mistral first
  let result = await callMistralAPI(messages, options)
  if (result) return result

  // Fallback to Groq
  result = await callGroqAPI(messages, options)
  if (result) return result

  // No AI available
  return null
}

/**
 * Call Mistral Vision API for OCR
 */
export async function callMistralVision(imageBase64, prompt) {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'pixtral-12b-2409',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ],
        }],
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      console.error('Mistral Vision error:', response.status)
      return null
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (err) {
    console.error('Mistral Vision call failed:', err.message)
    return null
  }
}
