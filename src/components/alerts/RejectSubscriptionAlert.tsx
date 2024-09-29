import {
    Alert,
    AlertTitle
} from '@mui/material';

const RejectSubscriptionAlert = () => 
    <Alert severity='warning'>
        <AlertTitle>You are denying notification subscription</AlertTitle>
        You will not receive any status update about the task. 
        Your request ID will be displayed on screen once your request has been sent. 
        Please safely store the request ID, or you will not be able to retrieve the resampling results.
    </Alert>

export default RejectSubscriptionAlert