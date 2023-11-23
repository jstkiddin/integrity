import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  styled,
  Typography,
} from '@mui/material'
import { useCallback, useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import Page from '../componets/Page/Page'
import {
  convert,
  CRC32Function,
  generateFail,
  getProbability,
  Hamming,
  MD5Function,
  SHA256Function,
} from '../constants/calculate'
import Timestamp from 'timestamp-nano'

type CodedText = { success: number; resend: number; time: string }

const OtherPage = () => {
  const [crc32, setCRC32] = useState<CodedText>({
    success: 0,
    resend: 0,
    time: '',
  })
  const [sha256, setSHA256] = useState<CodedText>({
    success: 0,
    resend: 0,
    time: '',
  })
  const [md5, setMD5] = useState<CodedText>({
    success: 0,
    resend: 0,
    time: '',
  })
  const [hamming, setHamming] = useState<CodedText>({
    success: 0,
    resend: 0,
    time: '',
  })

  const [combined, setCombined] = useState<CodedText>({
    success: 0,
    resend: 0,
    time: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [iterations, setIterations] = useState<string>('10')

  const clearAll = useCallback(() => {
    setCRC32({ success: 0, resend: 0, time: '' })
    setSHA256({ success: 0, resend: 0, time: '' })
    setMD5({ success: 0, resend: 0, time: '' })
    setHamming({ success: 0, resend: 0, time: '' })
    setCombined({ success: 0, resend: 0, time: '' })
  }, [])

  const textError = (error: number, prob: number, text: string) => {
    switch (error) {
      case 1: {
        const newText = prob >= 50 ? generateFail(text, false, false) : text

        return newText
      }
      case 2: {
        const newText =
          prob >= 50
            ? prob < 75
              ? generateFail(text, false, false)
              : generateFail(text, true, false)
            : text

        return newText
      }
      case 3: {
        const newText =
          prob >= 50
            ? prob < 67
              ? generateFail(text, false, false)
              : prob < 83
              ? generateFail(text, true, false)
              : generateFail(text, true, true)
            : text

        return newText
      }
      default:
        return text
    }
  }

  const handleClick = useCallback(
    (text: string, int: number, errors: number) => {
      setIsLoading(true)
      clearAll()

      const ifThereLetters = text
        .split('')
        .find((char) => char !== '1' && char !== '0')

      const textFormated = ifThereLetters ? convert(text) : text
      const initCRC2 = CRC32Function(textFormated)
      const initSHA2 = SHA256Function(textFormated)
      const initMD5 = MD5Function(textFormated)
      const initHamming = Hamming(textFormated)

      let successCount = 0
      let resendCount = 0
      let startTime = performance.now()

      for (let index = 0; index < int; index++) {
        let success = false
        while (!success) {
          const prob1 = getProbability()
          const newText = textError(errors, prob1, textFormated)
          setTimeout(() => {}, 2000)
          const crc = CRC32Function(newText)
          if (initCRC2 === crc) {
            success = true
            successCount++
          } else {
            resendCount++
          }
        }
      }
      let endTime = performance.now()

      setCRC32({
        success: successCount,
        resend: resendCount,
        time: `${endTime - startTime} ms`,
      })
      successCount = 0
      resendCount = 0
      startTime = performance.now()

      for (let index = 0; index < int; index++) {
        let success = false
        do {
          const prob2 = getProbability()
          const newText = textError(errors, prob2, textFormated)

          const sha = SHA256Function(newText)
          setTimeout(() => {}, 2000)

          if (initSHA2 === sha) {
            success = true
            successCount++
          } else {
            resendCount++
          }
        } while (!success)
      }
      endTime = performance.now()

      setSHA256({
        success: successCount,
        resend: resendCount,
        time: `${endTime - startTime} ms`,
      })
      successCount = 0
      resendCount = 0

      startTime = performance.now()
      for (let index = 0; index < int; index++) {
        let success = false
        while (!success) {
          const prob2 = getProbability()
          const newText = textError(errors, prob2, textFormated)

          const md = MD5Function(newText)
          setTimeout(() => {}, 2000)

          if (initMD5 === md) {
            success = true
            successCount++
          } else {
            resendCount++
          }
        }
      }
      endTime = performance.now()
      setMD5({
        success: successCount,
        resend: resendCount,
        time: `${endTime - startTime} ms`,
      })

      successCount = 0
      resendCount = 0

      startTime = performance.now()
      for (let index = 0; index < int; index++) {
        let success = false
        while (!success) {
          const prob2 = getProbability()
          const ham = Hamming(textFormated, prob2, errors)

          setTimeout(() => {}, 2000)
          if (errors !== 3) {
            if (initHamming.decodedData === ham.decodedData) {
              success = true
              successCount++
            }
            if (errors === 2 && prob2 >= 75) {
              resendCount++
            }
          }
          if (errors === 3) {
            if (prob2 >= 67 && prob2 < 83) {
              resendCount++
            } else if (prob2 >= 83) {
              success = true
            } else {
              if (initHamming.decodedData === ham.decodedData) {
                success = true
                successCount++
              }
            }
          }
        }
      }
      endTime = performance.now()
      setHamming({
        success: successCount,
        resend: resendCount,
        time: `${endTime - startTime} ms`,
      })
      successCount = 0
      resendCount = 0
      startTime = performance.now()
      //combined
      for (let index = 0; index < int; index++) {
        let success = false
        while (!success) {
          const prob2 = getProbability()

          const ham = Hamming(textFormated, prob2, errors)
          const md = MD5Function(ham.decodedData)
          if (errors !== 3) {
            if (initMD5 === md) {
              success = true
              successCount++
            }
            if (errors === 2 && prob2 >= 75) {
              resendCount++
            }
          }
          if (errors === 3) {
            if (prob2 >= 67 && prob2 < 83) {
              resendCount++
            } else if (prob2 >= 83) {
              resendCount++
            } else {
              if (initMD5 === md) {
                success = true
                successCount++
              }
            }
          }
        }
      }
      endTime = performance.now()
      setCombined({
        success: successCount,
        resend: resendCount,
        time: `${endTime - startTime} ms`,
      })

      setIsLoading(false)
    },
    []
  )

  const loader = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  )

  return (
    <Page
      handleGenerate={handleClick}
      hash={false}
      iterations={iterations}
      setIterations={setIterations}
    >
      <Box>
        <ResultTypography>Results:</ResultTypography>
        <ResultBox>
          <ResBlock>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <ResultTypography>MD5</ResultTypography>
              <IconButton
                size="small"
                sx={{ width: '20px', height: '20px', marginBottom: '5px' }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ width: '15px', height: '15px' }}
                />
              </IconButton>
            </Box>
            <StyledCard>
              <ResultTypography>
                Success: {md5.success}/
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}
              </ResultTypography>
              <ResultTypography>Resend: {md5.resend}</ResultTypography>
              <ResultTypography>
                Avarage Resend: {md5.resend / parseInt(iterations)}
              </ResultTypography>
              <ResultTypography>
                Time for{' '}
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}{' '}
                iterations: {md5.time}
              </ResultTypography>
            </StyledCard>
          </ResBlock>
          <ResBlock>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <ResultTypography>SHA2</ResultTypography>
              <IconButton
                size="small"
                sx={{ width: '20px', height: '20px', marginBottom: '5px' }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ width: '15px', height: '15px' }}
                />
              </IconButton>
            </Box>
            <StyledCard>
              <ResultTypography>
                Success: {sha256.success}/
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}
              </ResultTypography>
              <ResultTypography>Resend: {sha256.resend}</ResultTypography>
              <ResultTypography>
                Avarage Resend: {sha256.resend / parseInt(iterations)}
              </ResultTypography>
              <ResultTypography>
                Time for{' '}
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}{' '}
                iterations: {sha256.time}
              </ResultTypography>
            </StyledCard>
          </ResBlock>

          <ResBlock>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <ResultTypography>CRC</ResultTypography>
              <IconButton
                size="small"
                sx={{ width: '20px', height: '20px', marginBottom: '5px' }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ width: '15px', height: '15px' }}
                />
              </IconButton>
            </Box>
            <StyledCard>
              <ResultTypography>
                Success:
                {crc32.success}/
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}
              </ResultTypography>
              <ResultTypography>Resend: {crc32.resend}</ResultTypography>
              <ResultTypography>
                Avarage Resend: {crc32.resend / parseInt(iterations)}
              </ResultTypography>
              <ResultTypography>
                Time for{' '}
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}{' '}
                iterations: {crc32.time}
              </ResultTypography>
            </StyledCard>
          </ResBlock>

          <ResBlock>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <ResultTypography>Hamming</ResultTypography>
              <IconButton
                size="small"
                sx={{ width: '20px', height: '20px', marginBottom: '5px' }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ width: '15px', height: '15px' }}
                />
              </IconButton>
            </Box>
            <StyledCard>
              <ResultTypography>
                Success:{hamming.success}/
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}
              </ResultTypography>
              <ResultTypography>Resend: {hamming.resend} </ResultTypography>
              <ResultTypography>
                Avarage Resend: {hamming.resend / parseInt(iterations)}
              </ResultTypography>
              <ResultTypography>
                Time for{' '}
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}{' '}
                iterations: {hamming.time}
              </ResultTypography>
            </StyledCard>
          </ResBlock>

          <ResBlock>
            <ResultTypography>Combined</ResultTypography>
            <StyledCard>
              <ResultTypography>
                Success:{combined.success}/
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}
              </ResultTypography>
              <ResultTypography>Resend: {combined.resend}</ResultTypography>
              <ResultTypography>
                Avarage Resend: {combined.resend / parseInt(iterations)}
              </ResultTypography>
              <ResultTypography>
                Time for{' '}
                {iterations === '' || /[^0-9]+/.test(iterations)
                  ? '10'
                  : iterations}{' '}
                iterations: {combined.time}
              </ResultTypography>
            </StyledCard>
          </ResBlock>
        </ResultBox>
      </Box>
    </Page>
  )
}

const ResultTypography = styled(Typography)({
  fontSize: 14,
})

const ResultBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '450px 450px 450px',
  width: '100%',
  height: '100%',
  gap: 16,
  marginTop: 16,
})
const ResBlock = styled(Box)({
  width: '100%',
})

const StyledCard = styled(Card)({
  padding: 8,
})
export default OtherPage
