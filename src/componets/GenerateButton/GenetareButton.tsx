import { Button, Typography } from '@mui/material'

export const GenerateButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick?: any
}) => {
  return (
    <Button
      disabled={disabled}
      variant="contained"
      onClick={onClick}
      sx={{ height: 30, width: 100 }}
    >
      <Typography fontSize={14}>Begin</Typography>
    </Button>
  )
}
