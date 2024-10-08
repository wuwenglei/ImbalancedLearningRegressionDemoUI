'use client'
// ** React Imports
import { Fragment, useContext, useState } from 'react';

// ** MUI Imports
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RequestRecord } from '@/common/metadata';
import { HomeContext } from '@/components/boxes/MainBox';
import DownloadBoxIcon from '@/components/icons/DownloadBoxIcon';

const DialogRetrieveResamplingTaskForm = () => {
  const { setRequestRecord } = useContext(HomeContext)

  // ** State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  interface FormValue {
    requestId : string
    email : string
  }

  const defaultValues : FormValue = {
    requestId: '',
    email: ''
  }

  const {
    control,
    setValue,
    handleSubmit,
    trigger,
    reset,
    formState: { isValid, errors }
  } = useForm({ defaultValues })

  const resetValues = () => {
    reset(defaultValues)
  }

  const onFormSubmit = async (data : FormValue) => {
    setIsSubmitting(true)
    try {
        const response = await fetch('api/task-retrieve', {
            method: "PUT",
            body: JSON.stringify({
              ...data
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const responseObj = await response.json()
        if (!response.ok) {
          throw new Error(responseObj)
        }
        setRequestRecord(responseObj as RequestRecord)
        toast.success('Resampling result retrieved!', {duration: 5000})
        resetValues()
        handleClose()
    } catch (err) {
      console.log(err)
      toast.error('Failed to retrieve resampling result!', {duration: 10000})
    }
    setIsSubmitting(false)
  }

  return (
    <Fragment>
      <Tooltip title = "Retrieve Resampling Result" placement='top'>
        <span>
            <IconButton onClick={handleClickOpen}>
              <DownloadBoxIcon fontSize='inherit' outlinedIcon={!open} />
            </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' scroll='paper' fullWidth>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogTitle id='form-dialog-title'>{'Retrieve Resampling Result'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={5} sx={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Grid size={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  1. Enter your email address
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
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  2. Enter your request ID
                </Typography>
              </Grid>
              <Grid size={12}>
                <FormControl fullWidth>
                  <Controller
                    name='requestId'
                    control={control}
                    rules={{
                      required: true,
                      minLength: 32,
                      maxLength: 32
                    }}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value}
                        fullWidth
                        type='text'
                        placeholder=''
                        label='Request ID'
                        onChange={event => {
                          if (value.length < 32 || value.length >= 32 && event.target.value.length <= value.length)
                            setValue('requestId', event.target.value.trim(), {shouldDirty: true, shouldTouch: true, shouldValidate: true})
                        }}
                        onBlur={() => trigger('requestId')}
                        disabled={isSubmitting}
                        error={Boolean(errors.requestId)}
                        aria-describedby='validation-request-id'
                      />
                    )}
                  />
                  {errors.requestId && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-request-id'>
                      Please enter a correct request ID with length equal to 32!
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>Close</Button>
            <LoadingButton loading={isSubmitting} type='submit' color='success' variant='contained' disabled={isSubmitting || !isValid}>
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default DialogRetrieveResamplingTaskForm