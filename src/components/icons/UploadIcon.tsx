import { Icon } from '@iconify/react'

interface FileIconsString {
    default : string
    csv : string
}

const fileIcons : FileIconsString = {
    default: 'ph:file',
    csv: 'ph:file-csv'
}

const FileIcon = ({type = 'default'}) => {return <Icon icon={fileIcons[type as keyof FileIconsString]} fontSize='0.6rem' />}

export default FileIcon