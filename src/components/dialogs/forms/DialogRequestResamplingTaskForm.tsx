'use client'
// ** React Imports
import { Fragment, useContext, useEffect, useState } from 'react';

// ** MUI Imports
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// ** Third Party Imports
import { Icon } from '@iconify/react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { getResamplingMethodKeys, getResamplingMethodName, getTaskStatusSnsTopicSubscriptionOptionKeys, getTaskStatusSnsTopicSubscriptionOptionName } from '@/common/metadata';
import { HomeContext } from '@/components/boxes/MainBox';
import AcceptSubscriptionAlert from '../../alerts/AcceptSubscriptionAlert';
import RejectSubscriptionAlert from '../../alerts/RejectSubscriptionAlert';
import SubscribedSubscriptionAlert from '../../alerts/SubscribedSubscriptionAlert';
import ReadFileButton from '../../buttons/ReadFileButton';
import UploadBoxIcon from '../../icons/UploadBoxIcon';

const FREEZE_SENDING_SUBSCRIPTION_EMAIL_BUTTON_TOTAL_SECONDS : number = 15

const DialogRequestResamplingTaskForm = () => {
  const { setRequestId } = useContext(HomeContext)

  // ** State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)
  const [targetVariableOptions, setTargetVariableOptions] = useState<Array<string>>([])
  const [freezeSendingSubscriptionEmailButton, setFreezeSendingSubscriptionEmailButton] = useState<boolean>(false)
  const [freezeSendingSubscriptionEmailButtonRemainingSeconds, setFreezeSendingSubscriptionEmailButtonRemainingSeconds] = useState<number>(FREEZE_SENDING_SUBSCRIPTION_EMAIL_BUTTON_TOTAL_SECONDS)
  const [subscriptionSent, setSubscriptionSent] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  interface FormValue {
    email : string,
    method : string,
    y : string,
    chartDataSize : number,
    chartLabelCount : number,
    taskStatusSnsTopicSubscriptionOption : string,
    taskStatusSnsTopicSubscriptionArn : string,
    confirmedSubscription : string
  }

  const defaultValues : FormValue = {
    email: '',
    method: '',
    y: '',
    chartDataSize: 200,
    chartLabelCount: 5,
    taskStatusSnsTopicSubscriptionOption: '',
    taskStatusSnsTopicSubscriptionArn: '',
    confirmedSubscription: ''
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    getFieldState,
    trigger,
    reset,
    formState: { isValid, errors }
  } = useForm({ defaultValues })

  const resetValues = () => {
    reset(defaultValues)
    setFile(null)
    setFileData(null)
  }

  const onFormSubmit = async (data : FormValue) => {
    if (! fileData) {
      alert("Please select a file!")
      return
    }
    setIsSubmitting(true)
    try {
        const response = await fetch('api/task-request', {
            method: "PUT",
            body: JSON.stringify({
              ...data, 
              fileName: file?.name, 
              fileType: file?.type,
              fileData
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const responseObj = await response.json()
        if (!response.ok) {
          throw new Error(responseObj)
        }
        const requestId : string = responseObj['requestId']
        if (!requestId) {
          throw new Error("Request was successful, but requestId was empty.")
        }
        setRequestId(requestId)
        toast.success('Resampling task requested!', {duration: 5000})
        resetValues()
        handleClose()
    } catch (err) {
      console.log(err)
      toast.error('Failed to request resampling task!', {duration: 10000})
    }
    setIsSubmitting(false)
  }

  const handleSendingSubscriptionEmailButtonClick = async () => {
    setFreezeSendingSubscriptionEmailButton(true)
    const intervalSecondsCountDown = setInterval(() => {
      setFreezeSendingSubscriptionEmailButtonRemainingSeconds(prev => prev - 1)
    }, 1000)
    setTimeout(() => {
      clearInterval(intervalSecondsCountDown)
      setFreezeSendingSubscriptionEmailButton(false)
      setFreezeSendingSubscriptionEmailButtonRemainingSeconds(FREEZE_SENDING_SUBSCRIPTION_EMAIL_BUTTON_TOTAL_SECONDS)
    }, FREEZE_SENDING_SUBSCRIPTION_EMAIL_BUTTON_TOTAL_SECONDS * 1000)
    try {
      const response = await fetch('api/subscribe-sns-notification', {
          method: "PUT",
          body: JSON.stringify({
            email: getValues('email')
          }),
          headers: {
              'Content-type': 'application/json'
          }
      })
      const responseObj = await response.json()
      if (!response.ok) {
        throw new Error(responseObj)
      }
      const taskStatusSnsTopicSubscriptionArn : string = responseObj['taskStatusSnsTopicSubscriptionArn']
      setValue('taskStatusSnsTopicSubscriptionArn', taskStatusSnsTopicSubscriptionArn)
      setSubscriptionSent(true)
      toast.success('Subscription requested! Please check your email account!', {duration: 5000})
    } catch (err) {
      console.log(err)
      toast.error('Failed to request subscription!', {duration: 10000})
    }
  }

  useEffect(() => {
    if (!fileData) {
      setTargetVariableOptions([])
      return
    }
    const separationSign : string = ','
    const nextLineIndex : number = fileData?.indexOf('\n')
    if (nextLineIndex === -1) {
      setTargetVariableOptions(fileData.split(separationSign).sort())
    } else {
      const firstLine = fileData.substring(0, nextLineIndex)
      setTargetVariableOptions(firstLine?.split(separationSign).sort())
    }
  }, [fileData])

  return (
    <Fragment>
      <Tooltip title = "Create Resampling Task" placement='top'>
        <span>
            <IconButton onClick={handleClickOpen}>
              <UploadBoxIcon fontSize='inherit' outlinedIcon={!open} />
            </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' scroll='paper' fullWidth>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogTitle id='form-dialog-title'>{'Create Resampling Task'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={5} sx={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Grid size={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  1. Data Information
                </Typography>
              </Grid>
              <Grid size={12}>
                  <ReadFileButton file={file} setFile={setFile} setFileData={setFileData} disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='method'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <InputLabel
                            id='method-select-label'
                            sx={{ ...(errors.method && { color: 'red' }) }}
                          >
                            Resampling Method
                          </InputLabel>
                          <Select
                            label='Resampling Method'
                            value={value}
                            onChange={onChange}
                            id='method-select'
                            labelId='method-select-label'
                            disabled={isSubmitting}
                            error={Boolean(errors.method)}
                            aria-describedby='validation-select-method'
                          >
                            <MenuItem key='' value=''>
                              <em>--- please select ---</em>
                            </MenuItem>
                            <ListSubheader sx={{fontSize: 16}}><em>Oversampling Methods</em></ListSubheader>
                            {getResamplingMethodKeys(true).map(key => (
                              <MenuItem key={key} value={key}>
                                {getResamplingMethodName(key)}
                              </MenuItem>
                            ))}
                            <ListSubheader >----------------------------------------</ListSubheader>
                            <ListSubheader sx={{fontSize: 16}}><em>Undersampling Methods</em></ListSubheader>
                            {getResamplingMethodKeys(false).map(key => (
                              <MenuItem key={key} value={key}>
                                {getResamplingMethodName(key)}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    />
                    {errors.method && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-select-method'>
                        Please select resampling method!
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={6}>
              <FormControl fullWidth>
                <Controller
                  name='y'
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      freeSolo
                      id='autocomplete-target-variable'
                      options={targetVariableOptions}
                      value={value}
                      onChange={(event, value) => setValue('y', value || '', {shouldDirty: true, shouldTouch: true, shouldValidate: true})}
                      groupBy={(option) => option.charAt(0).toUpperCase()}
                      fullWidth
                      disabled={isSubmitting}
                      aria-describedby='validation-target-variable'
                      renderInput={(params) => 
                        <TextField
                          {...params}
                          value={value}
                          onChange={onChange}
                          label='Target Variable'
                          type='text'
                          placeholder=''
                          error={Boolean(errors.y)}
                        />
                      }
                    />
                  )}
                />
                {errors.y && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-target-variable'>
                    Please enter the column name of the target variable!
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
                  <Divider />
                </Grid>
                <Grid size={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                2. Email Notification
              </Typography>
            </Grid>
                <Grid size={12}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                  }}
                  render={({ field: { value } }) => (
                    <TextField
                      value={value}
                      fullWidth
                      type='text'
                      placeholder='resampling@iblr.com'
                      label='Email'
                      onChange={event => setValue('email', event.target.value.trim(), {shouldDirty: true, shouldTouch: true, shouldValidate: true})}
                      onBlur={() => trigger('email')}
                      disabled={isSubmitting}
                      error={Boolean(errors.email)}
                      aria-describedby='validation-email'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-email'>
                    Please enter a correct email address!
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
                <Grid size={12}>
                  <Stack direction="row" spacing={1.5}>
                  <FormControl fullWidth>
                    <Controller
                      name='taskStatusSnsTopicSubscriptionOption'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <InputLabel
                            id='task-status-sns-topic-subscription-option-select-label'
                            sx={{ ...(errors.taskStatusSnsTopicSubscriptionOption && { color: 'red' }) }}
                          >
                            Subscription Option
                          </InputLabel>
                          <Select
                            label='Subscription Option'
                            value={value}
                            onChange={onChange}
                            id='task-status-sns-topic-subscription-option-select'
                            labelId='task-status-sns-topic-subscription-option-select-label'
                            disabled={isSubmitting}
                            error={Boolean(errors.taskStatusSnsTopicSubscriptionOption)}
                            aria-describedby='validation-select-task-status-sns-topic-subscription-option'
                          >
                            <MenuItem key='' value=''>
                              <em>--- please select ---</em>
                            </MenuItem>
                            {getTaskStatusSnsTopicSubscriptionOptionKeys().map(key => (
                              <MenuItem key={key} value={key}>
                                {getTaskStatusSnsTopicSubscriptionOptionName(key)}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    />
                    {errors.taskStatusSnsTopicSubscriptionOption && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-select-task-status-sns-topic-subscription-option'>
                        Please select subscription option!
                      </FormHelperText>
                    )}
                  </FormControl>
                  {watch('taskStatusSnsTopicSubscriptionOption') === 'accept' ? 
                  <Tooltip title={`${subscriptionSent ? 'Resend' : 'Send'} subscription confirmation email. ${freezeSendingSubscriptionEmailButton ? `(${freezeSendingSubscriptionEmailButtonRemainingSeconds}s)` : ''}`} placement='right'>
                <span>
                  <IconButton
                    onClick={handleSendingSubscriptionEmailButtonClick}
                    disabled={isSubmitting || freezeSendingSubscriptionEmailButton || !getFieldState('email').isDirty || errors.email && true}
                    color='primary'
                  >
                    <Icon icon={subscriptionSent ? 'mdi:email-resend' : 'mdi:email-send'} fontSize={40}/>
                  </IconButton>
                </span>
              </Tooltip> : <IconButton
                    onClick={handleSendingSubscriptionEmailButtonClick}
                    disabled={true}
                    color='primary'
                  >
                    <Icon icon={subscriptionSent ? 'mdi:email-resend' : 'mdi:email-send'} fontSize={40}/>
                  </IconButton>}
                  </Stack>
                  
                </Grid>
                {watch('taskStatusSnsTopicSubscriptionOption') === 'accept' && <Grid size={12}>
                  <AcceptSubscriptionAlert />
                </Grid>}
                {watch('taskStatusSnsTopicSubscriptionOption') === 'accept' && <Grid size={12}>
                <FormControl fullWidth>
                    <Controller
                      name='confirmedSubscription'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <InputLabel
                      id='confirm-subscription-select-label'
                    >
                      Confirm Subscription
                  </InputLabel>
                  <Select
                    label='Confirm Subscription'
                    value={value}
                    onChange={onChange}
                    id='confirm-subscription-select'
                    labelId='confirm-subscription-select-label'
                    disabled={isSubmitting || !subscriptionSent}
                    error={Boolean(errors.confirmedSubscription)}
                    aria-describedby='validation-confirm-subscription'
                    fullWidth
                  >
                    <MenuItem key='' value=''>
                      ------
                    </MenuItem>
                    <MenuItem key='1' value='1'>
                      I have confirmed notification subscription in my inbox.
                    </MenuItem>
                    </Select>
                        </>
                      )}
                    />
                    {errors.confirmedSubscription && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-confirm-subscription'>
                        Please confirm subscription!
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>}
                {watch('taskStatusSnsTopicSubscriptionOption') === 'subscribed' && <Grid size={12}>
                  <SubscribedSubscriptionAlert />
                </Grid>}
                {watch('taskStatusSnsTopicSubscriptionOption') === 'reject' && <Grid size={12}>
                  <RejectSubscriptionAlert />
                </Grid>}
            </Grid>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>Close</Button>
            <LoadingButton loading={isSubmitting} type='submit' color='success' variant='contained' disabled={isSubmitting || !file?.name || !isValid}>
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default DialogRequestResamplingTaskForm