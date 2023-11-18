import { Box, Divider, styled, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import Page from '../componets/Page/Page'
import {
  CRC32Function,
  getTime,
  MD5Function,
  SHA256Function,
} from '../constants/calculate'

import Timestamp from 'timestamp-nano'
type CodedText = {
  crc32: string
  sha256: string
  md5: string
}

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

  const handleClick = (text: string) => {
    let times = {
      crc32: '',
      sha256: '',
      md5: '',
    }

    let startTime = Timestamp.fromString(new Date().toString()).getNano()

    for (let i = 0; i > 10000000; i++) {
      MD5Function(text)
    }

    let endTime = Timestamp.fromString(new Date().toString()).getNano()
    times.md5 = `${endTime - startTime} ns`

    startTime = Timestamp.fromString(new Date().toString()).getNano()
    for (let i = 0; i > 10000000; i++) {
      SHA256Function(text)
    }
    endTime = Timestamp.fromString(new Date().toString()).getNano()
    times.sha256 = `${endTime - startTime} ns`

    startTime = Timestamp.fromString(new Date().toString()).getNano()

    for (let i = 0; i > 10000000; i++) {
      CRC32Function(text)
    }

    endTime = Timestamp.fromString(new Date().toString()).getNano()
    times.crc32 = `${endTime - startTime} ns`

    setCodedText({
      crc32: CRC32Function(text),
      sha256: SHA256Function(text),
      md5: MD5Function(text),
    })

    setTime(times)
  }

  return (
    <Page handleGenerate={handleClick} hash={true}>
      <Box>
        <ResultTypography>Results:</ResultTypography>
        <ResultBox>
          <ResBlock>
            <ResultTypography>MD5</ResultTypography>
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
            <ResultTypography>SHA2</ResultTypography>
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
            <ResultTypography>CRC</ResultTypography>
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

        {time.md5 === '' ? null : (
          <TimeBox>
            <Divider />
            <Box>
              <ResultTypography marginTop={2}>
                Time for 10000000 iterations:
              </ResultTypography>

              <ResultTypography>MD5: {time.md5}</ResultTypography>
              <ResultTypography>SHA2: {time.sha256}</ResultTypography>
              <ResultTypography>CRC: {time.crc32}</ResultTypography>
            </Box>
          </TimeBox>
        )}
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
