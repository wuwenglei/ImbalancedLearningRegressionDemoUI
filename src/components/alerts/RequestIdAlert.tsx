
// ** MUI Imports
import { HomeContext } from '@/app/page';
import {
    Alert,
    Box,
    Fade,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import { useContext } from 'react';
import CopyIconButton from '../icon-buttons/CopyIconButton';
import CloseIcon from '../icons/CloseIcon';

const RequestIdAlert = () => {
    const { requestId, openRequestIdAlert: open, setOpenRequestIdAlert: setOpen } = useContext(HomeContext)
    return  <Box sx={{m: 4, mb: 1}}>
                <Fade in={open} {...(open ? { timeout: 700 } : {})}>
                    <Alert
                        severity={requestId !== '' ? 'success' : 'info'}
                        variant={requestId !== '' ? 'filled' : 'outlined'}
                        action={
                            <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen(false)}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                    >
                        <Stack direction='row'>
                            <Typography variant='body2'>{requestId !== '' ? `Your request ID: ${requestId}` : 'No resampling task requested!'}</Typography>
                            {requestId !== '' && <CopyIconButton text={requestId} sx={{mt: -0.5, ml: 0.5}} />}
                        </Stack>
                    </Alert>
                </Fade>
            </Box>
}
    


export default RequestIdAlert