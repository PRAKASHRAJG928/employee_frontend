import { build } from 'vite'

async function buildApp() {
  try {
    await build()
    process.exit(0)
  } catch (e) {
    console.error('Build failed:', e)
    process.exit(1)
  }
}

buildApp()