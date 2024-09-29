import { Icon } from '@iconify/react'

const DownloadBoxIcon = ({fontSize='0.6rem', outlinedIcon = false}) => <Icon icon={outlinedIcon ? 'mdi:download-box-outline' : 'mdi:download-box'} fontSize={fontSize} />

export default DownloadBoxIcon