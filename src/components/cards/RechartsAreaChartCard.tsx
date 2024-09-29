'use client'
// ** MUI Imports
import { Tooltip as MUITooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { Icon } from '@iconify/react'
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { HomeContext } from '@/app/page'
import { getResamplingMethodName } from '@/common/metadata'
import { useContext } from 'react'
import DialogRequestResamplingTaskForm from '../dialogs/forms/DialogRequestResamplingTaskForm'
import DialogRetrieveResamplingTaskForm from '../dialogs/forms/DialogRetrieveResamplingTaskForm'
import BalanceIcon from '../icons/BalanceIcon'
import ImbalanceIcon from '../icons/ImbalanceIcon'
import StickerAlertIcon from '../icons/StickerAlertIcon'

const CustomTooltip = data => {
  const { active, payload } = data
  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Card variant="outlined">
          <Box sx={{m: 2}}>
            <Typography>{data.label}</Typography>
            <Divider />
            {data &&
              data.payload &&
              data.payload.map(i => {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: i.fill, mr: 1.5 } }} key={i.dataKey}>
                    <Icon icon='mdi:circle' fontSize='0.6rem' />
                    <Typography variant='body2'>{`${i.dataKey} : ${i.payload[i.dataKey]}`}</Typography>
                  </Box>
                )
              })}
          </Box>
        </Card>
      </div>
    )
  }

  return null
}

const CardHeaderTitle = () => {
  const { requestRecord } = useContext(HomeContext)
  return <Stack direction={'column'} spacing={0.5}>
    <Stack direction={'row'} spacing={1}>
      <Typography variant='h6' sx={{ fontWeight: 600 }}>{`File: ${requestRecord.originalFileName || 'None'}`}</Typography>
      <MUITooltip title = "Download Raw File" placement='top'>
        <span>
          <IconButton disabled={!requestRecord || !requestRecord.getPresignedUrlRaw} onClick={() => {
            if (requestRecord && requestRecord.getPresignedUrlRaw) {
              window.open(requestRecord?.getPresignedUrlRaw, '_blank');
            }
          }}>
            <ImbalanceIcon fontSize='20' />
          </IconButton>
        </span>
      </MUITooltip>
      <MUITooltip title = "Download Resampled File" placement='top'>
        <span>
          <IconButton disabled={!requestRecord || !requestRecord.getPresignedUrlResampled} onClick={() => {
            if (requestRecord && requestRecord.getPresignedUrlResampled) {
              window.open(requestRecord?.getPresignedUrlResampled, '_blank');
            }
          }}>
            <BalanceIcon fontSize='20' />
          </IconButton>
        </span>
      </MUITooltip>
    </Stack>
    <Typography variant='body2' sx={{ fontWeight: 500 }}>{`Target variable: ${requestRecord.y || 'None'}`}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 500 }}>{`Method: ${getResamplingMethodName(requestRecord.method) || 'None'}`}</Typography>
  </Stack>
}

const CardHeaderAction = () => {
  const { openRequestIdAlert, setOpenRequestIdAlert } = useContext(HomeContext)
  return  <Stack direction='row' spacing={1}>
            <DialogRequestResamplingTaskForm />
            <MUITooltip title = "Show Request ID" placement='top'>
              <span>
                <IconButton onClick={() => setOpenRequestIdAlert(prev => !prev)}>
                  <StickerAlertIcon fontSize='22' outlinedIcon={!openRequestIdAlert} />
                </IconButton>
              </span>
            </MUITooltip>
            <DialogRetrieveResamplingTaskForm />
          </Stack>
}

const RechartsAreaChartCard = ({ direction = 'normal' }) => {
  const { requestRecord } = useContext(HomeContext)
  const colorRaw = 'rgba(115, 103, 240, .5)'
  const colorResampled = 'rgba(115, 103, 240, 1)'

  return (
    <Card sx={{
        m: 4, 
        minWidth: '90%',
        minHeight: '70%', 
        display: "flex",
        flexDirection: "column",
        overflow: "scroll"
      }}
    >
      <Box>
        <CardHeader
          title={<CardHeaderTitle />}
          sx={{m: 4}}
          action={<CardHeaderAction />}
        />
        <CardContent sx={{m: 4}}>
          <Box sx={{ display: 'flex', mb: 4 }}>
            <Box sx={{ mr: 6, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: colorRaw } }}>
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography variant='body2'>Raw</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: colorResampled } }}>
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography variant='body2'>Resampled</Typography>
            </Box>
          </Box>
          <Box sx={{ height: 500 }}>
            <ResponsiveContainer>
              <AreaChart height={350} data={requestRecord?.chartDataPoints || []} style={{ direction }} margin={{ left: 20 }}>
                <CartesianGrid />
                <XAxis dataKey='Target Variable' reversed={direction === 'reversed'} />
                <YAxis orientation={direction === 'reversed' ? 'right' : 'left'} />
                <RechartsTooltip content={CustomTooltip} />
                <Area type="monotone" dataKey='Raw Density' stackId='Raw Density' stroke='0' fill={colorRaw} />
                <Area type="monotone" dataKey='Resampled Density' stackId='Resampled Density' stroke='0' fill={colorResampled} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Box>
    </Card>
  )
}

export default RechartsAreaChartCard
