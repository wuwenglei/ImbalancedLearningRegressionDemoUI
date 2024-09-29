// ** MUI Imports
import {
    ButtonProps,
    IconButton,
    Tooltip
} from '@mui/material';
import CopyIcon from '../icons/CopyIcon';

interface CopyIconButtonProps extends ButtonProps {
    text : string
}

const CopyIconButton = ({size = 'small', color = 'inherit', text, sx = {}} : CopyIconButtonProps) => 
    <Tooltip title = "copy" placement='top'>
        <span>
            <IconButton size={size} color={color} sx={sx} aria-label='copy' onClick={() => navigator.clipboard.writeText(text)}>
                <CopyIcon fontSize='inherit' />
            </IconButton>
        </span>
    </Tooltip>
    
export default CopyIconButton