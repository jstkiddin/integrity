import {
  Box,
  Divider,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import Page from '../componets/Page/Page'
import {
  CRC32Function,
  getTime,
  MD5Function,
  SHA256Function,
} from '../constants/calculate'
import InfoIcon from '@mui/icons-material/Info'

import Timestamp from 'timestamp-nano'
type CodedText = {
  crc32: string
  sha256: string
  md5: string
}

const iter = 10000000000000

const HashPage = () => {
  const [codedText, setCodedText] = useState<CodedText>({
    crc32: '',
    sha256: '',
    md5: '',
  })
  const [time, setTime] = useState<CodedText>({
    crc32: '',
    sha256: '',
    md5: '',
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const MD5Func = (text: string) => {
    for (let i = 0; i > iter; i++) {
      MD5Function(text)
    }
  }

  const SHAFunc = (text: string) => {
    for (let i = 0; i > iter; i++) {
      SHA256Function(text)
    }
  }

  const CRCFunc = (text: string) => {
    for (let i = 0; i > iter; i++) {
      CRC32Function(text)
    }
  }
  const handleClick = (text: string) => {
    setIsLoading(true)
    let times = {
      crc32: '',
      sha256: '',
      md5: '',
    }

    let startTime = performance.now()
    MD5Func(text)
    let endTime = performance.now()
    times.md5 = `${endTime - startTime} ms`

    startTime = performance.now()
    SHAFunc(text)
    endTime = performance.now()
    times.sha256 = `${endTime - startTime} ms`

    startTime = performance.now()

    CRCFunc(text)

    endTime = performance.now()
    times.crc32 = `${endTime - startTime} ms`

    setCodedText({
      crc32: CRC32Function(text),
      sha256: SHA256Function(text),
      md5: MD5Function(text),
    })

    setTime(times)
    // setIsLoading(false)
  }

  return (
    <Page handleGenerate={handleClick} hash={true}>
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
            <TextField
              multiline
              disabled
              fullWidth
              variant="outlined"
              placeholder="Your generated hash will be put here"
              value={codedText.md5}
            />
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
            <TextField
              multiline
              disabled
              fullWidth
              variant="outlined"
              placeholder="Your generated hash will be put here"
              value={codedText.sha256}
            />
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
            <TextField
              multiline
              disabled
              fullWidth
              variant="outlined"
              placeholder="Your generated hash will be put here"
              value={codedText.crc32}
            />
          </ResBlock>
        </ResultBox>

        {/* {time.md5 === '' ? null : (
          <TimeBox>
            <Divider />
            <Box>
              <ResultTypography marginTop={2}>
                Time for {iter} iterations:
              </ResultTypography>

              <ResultTypography>MD5: {time.md5}</ResultTypography>
              <ResultTypography>SHA2: {time.sha256}</ResultTypography>
              <ResultTypography>CRC: {time.crc32}</ResultTypography>
            </Box>
          </TimeBox>
        )} */}
      </Box>
    </Page>
  )
}

const ResultTypography = styled(Typography)({
  fontSize: 14,
})

const ResultBox = styled(Box)({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 16,
})
const ResBlock = styled(Box)({
  width: '100%',
})

const TimeBox = styled(Box)({
  marginTop: 24,
})
export default HashPage
