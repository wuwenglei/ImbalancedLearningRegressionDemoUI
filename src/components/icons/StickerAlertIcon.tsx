import { Icon } from '@iconify/react'

const StickerAlertIcon = ({fontSize='0.6rem', outlinedIcon = false}) => <Icon icon={outlinedIcon ? 'mdi:sticker-alert-outline' : 'mdi:sticker-alert'} fontSize={fontSize} />

export default StickerAlertIcon