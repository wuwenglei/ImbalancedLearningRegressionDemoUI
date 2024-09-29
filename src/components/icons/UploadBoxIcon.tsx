import { Icon } from '@iconify/react'

const UploadBoxIcon = ({fontSize='0.6rem', outlinedIcon = false}) => <Icon icon={outlinedIcon ? 'mdi:upload-box-outline' : 'mdi:upload-box'} fontSize={fontSize} />

export default UploadBoxIcon