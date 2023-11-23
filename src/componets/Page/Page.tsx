import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { GenerateButton } from '../GenerateButton/GenetareButton'
import InfoIcon from '@mui/icons-material/Info'

interface PageProps {
  handleGenerate: (value: string, iterations: number, errors: number) => void
  hash: boolean
  iterations?: string
  setIterations?: React.Dispatch<React.SetStateAction<string>>
  children?: React.ReactElement
}

const Page = ({
  handleGenerate,
  children,
  hash,
  iterations,
  setIterations,
}: PageProps) => {
  const [textValue, setText] = useState<string>('')

  const [fileName, setFileName] = useState<string>('')
  const [errors, setErrors] = useState<string>('')

  const handleText = () => {
    handleGenerate(
      textValue,
      parseInt(iterations ?? '0'),
      parseInt(errors ?? '0')
    )
  }

  const onClear = (e: any) => {
    setText('')
    setFileName('')
  }

  const handleChange = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.abort()
    reader.onload = async (e: any) => {
      const text = e.target.result
      setText(text)
      console.log(textValue.length)
    }
    reader.readAsText(e.target.files[0])

    setFileName(e.target.files[0].name)
  }

  const handleSelect = (e: any) => {
    setErrors(e.target.value)
  }

  return (
    <Background>
      <InputBlock>
        <TextField
          required
          id="outlined-basic"
          label="Input"
          size="small"
          multiline
          disabled={fileName !== ''}
          rows={5}
          fullWidth
          variant="outlined"
          onChange={(e) => {
            setText(e.currentTarget.value)
          }}
        />

        <Box sx={{ width: '20%' }}>
          <Button
            disabled={textValue !== ''}
            sx={{
              position: 'fixed',
              width: '15%',
              marginTop: -2,
            }}
            variant="outlined"
            component="label"
          >
            <Typography fontSize={12}>Upload File</Typography>
            <input
              onChange={handleChange}
              id="file-upload"
              type="file"
              value=""
              autoComplete={'new-password'}
              hidden
            />
          </Button>
          <FileNameBlock>
            {fileName === '' ? null : (
              <Button
                sx={{ width: '5%' }}
                variant="text"
                component="label"
                onClick={onClear}
              >
                <Typography fontSize={9}>x</Typography>
              </Button>
            )}
            <Typography fontSize={12}>{fileName}</Typography>
          </FileNameBlock>
        </Box>
        {hash ? (
          <GenerateButton
            disabled={
              hash
                ? textValue === '' && fileName === ''
                : (textValue === '' && fileName === '') ||
                  iterations === '' ||
                  /[^0-9]+/.test(iterations!) ||
                  errors === ''
            }
            onClick={handleText}
          />
        ) : (
          <>
            <Box
              sx={{ marginTop: -2.5, marginLeft: 4, display: 'flex', gap: 1 }}
            >
              <Box>
                <Typography fontSize={12}>Iterations:</Typography>

                <TextField
                  required
                  error={/[^0-9]+/.test(iterations!)}
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
                  value={iterations}
                  onChange={(e) => {
                    setIterations && setIterations(e.currentTarget.value ?? '')
                  }}
                />
              </Box>
              <Box>
                <Typography fontSize={12}>Errors:</Typography>
                <Select
                  required
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
                  value={errors}
                  onChange={handleSelect}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <IconButton
                size="small"
                sx={{ width: '30px', height: '30px', marginBottom: '5px' }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ width: '30px', height: '30px' }}
                />
              </IconButton>
              <GenerateButton
                disabled={
                  hash
                    ? textValue === '' && fileName === ''
                    : (textValue === '' && fileName === '') ||
                      iterations === '' ||
                      /[^0-9]+/.test(iterations!) ||
                      errors === ''
                }
                onClick={handleText}
              />
            </Box>
          </>
        )}
      </InputBlock>

      <ResultBlock>{children}</ResultBlock>
    </Background>
  )
}

export const Background = styled(Box)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  width: '98.5vw',
  height: '89vh',
  padding: 8,
  borderRadius: 4,
  gap: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
})

export const InputBlock = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 50,
  padding: 8,
  width: '100%',
  height: 100,

  marginTop: 8,
})

export const ResultBlock = styled(Card)({
  width: '98%',
  height: '98%',
  padding: 16,
  marginTop: 8,
})

export const FileNameBlock = styled(Box)({
  marginTop: 15,
  position: 'fixed',
  display: 'flex',
  gap: 5,
  alignItems: 'center',
})

export default Page
