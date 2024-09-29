import {
    Alert,
    AlertTitle
} from '@mui/material';

const SubscribedSubscriptionAlert = () => 
    <Alert severity='info'>
        <AlertTitle>You state that the email has subscribed before</AlertTitle>
        You will not receive the subscription confirmation email. 
        If you have confirmed the subscription and never unsubscribed, you will automatically receive status update about the task.
    </Alert>

export default SubscribedSubscriptionAlert