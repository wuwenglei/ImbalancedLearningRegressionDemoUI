import {
    Alert,
    AlertTitle
} from '@mui/material';

const AcceptSubscriptionAlert = () => 
    <Alert severity='info'>
        <AlertTitle>You choose to subscribe the task notification</AlertTitle>
        Please entered your email address and click the email icon. 
        You will receive a confirmation email in your inbox. 
        Once the subscription has been confirmed, please select below &quotI have confirmed notification subscription in my inbox.&quot.
        Please do so only after you confirm the subscription in your inbox, or you will not receive any task notification.
        If you did not receive the confirmation email, please click the email icon again.
        You only need to confirm once, and you can skip this step for all subsequent resampling tasks.
    </Alert>

export default AcceptSubscriptionAlert