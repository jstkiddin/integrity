import { Md5 } from 'ts-md5'
import CryptoES from 'crypto-es'
import { CRC32 } from '../constants/CRC32'

export function getTime() {
  return Math.floor(Math.random() * (1000 - 100) + 100)
}

export function getProbability() {
  return Math.floor(Math.random() * (100 - 0) + 0)
}

export function getRandomPlacement(max: number) {
  return Math.floor(Math.random() * (max - 1 - 0) + 0)
}

export function MD5Function(text: string) {
  return new Md5().start().appendStr(text).end() as string
}

export function SHA256Function(text: string) {
  return CryptoES.SHA256(text).toString()
}

export function CRC32Function(text: string) {
  return new CRC32().calculate(text).toString()
}

export function Hamming(text: string, prob?: number, error?: number) {
  let encodedData: string = encodeHamming(text as string)
  if (prob) {
    switch (error) {
      case 1: {
        const newText =
          prob >= 50 ? generateFail(encodedData, false, false) : encodedData
        const decodedData = decodeHamming(newText)

        return { text, encodedData, decodedData }
      }
      case 2: {
        const newText =
          prob >= 50
            ? prob < 75
              ? generateFail(encodedData, false, false)
              : generateFail(encodedData, true, false)
            : encodedData
        const decodedData = decodeHamming(newText)

        return { text, encodedData, decodedData }
      }
      case 3: {
        const newText =
          prob >= 50
            ? prob < 67
              ? generateFail(encodedData, false, false)
              : prob < 83
              ? generateFail(encodedData, true, false)
              : generateFail(encodedData, true, true)
            : encodedData

        const decodedData = decodeHamming(newText)

        return { text, encodedData, decodedData }
      }
      default: {
        const decodedData = decodeHamming(encodedData)
        return { text, encodedData, decodedData }
      }
    }
  } else {
    const decodedData = decodeHamming(encodedData)
    return { text, encodedData, decodedData }
  }
}

function encodeHamming(data: string): string {
  let parityBits = 0
  while (2 ** parityBits <= data.length + parityBits) {
    parityBits++
  }

  const encodedData = new Array(data.length + parityBits)
  let dataIndex = 0
  let encodedIndex = 0

  for (let i = 0; i < encodedData.length; i++) {
    if (i === 2 ** encodedIndex - 1) {
      // Додаткові біти на парність
      encodedData[i] = '0'
      encodedIndex++
    } else {
      // Дані біти
      encodedData[i] = data[dataIndex]
      dataIndex++
    }
  }

  for (let i = 0; i < parityBits; i++) {
    const mask = 2 ** i
    let parity = 0

    for (let j = mask - 1; j < encodedData.length; j += mask * 2) {
      for (let k = 0; k < mask && j + k < encodedData.length; k++) {
        parity ^= parseInt(encodedData[j + k])
      }
    }

    encodedData[mask - 1] = parity.toString()
  }

  return encodedData.join('')
}

function decodeHamming(encodedData: string): string {
  let parityBits = 0
  while (2 ** parityBits <= encodedData.length) {
    parityBits++
  }

  const decodedData = new Array(encodedData.length - parityBits)
  let dataIndex = 0
  let encodedIndex = 0

  for (let i = 0; i < encodedData.length; i++) {
    if (i === 2 ** encodedIndex - 1) {
      // Пропустити додаткові біти на парність
      encodedIndex++
    } else {
      // Декодовані біти
      decodedData[dataIndex] = encodedData[i]
      dataIndex++
    }
  }

  return decodedData.join('')
}

export function convert(text: string) {
  let output = ''
  for (var i = 0; i < text.length; i++) {
    output += text[i].charCodeAt(0).toString(2)
  }

  return output
}

export function generateFail(text: string, hamming: boolean, three: boolean) {
  const indexToChange = getRandomPlacement(text.length)
  let output = ''

  for (var i = 0; i < text.length; i++) {
    if (indexToChange === i) {
      output += text[i] === '0' ? '1' : '0'
    } else if (hamming) {
      if (!three && indexToChange + 1 === i) {
        output += text[i] === '0' ? '1' : '0'
      }
      if (three) {
        if (indexToChange + 1 === i || indexToChange + 2 === i) {
          output += text[i] === '0' ? '1' : '0'
        }
      }
    } else {
      output += text[i]
    }
  }

  return output
}
