'use client'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import FileIcon from '../icons/UploadIcon';

const readFileData = (file : File | null, setter : Dispatch<SetStateAction<string | null>>) => {
  if (file == null) {
    setter(null)
    return
  }
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    setter(reader.result as string)
  }
  reader.onerror = error => {
    console.log(`Error when reading file ${file?.name || 'unknown'} at readFileData(): `, error)
  }
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

interface ReadFileButtonProps {
  file : File | null,
  setFile : Dispatch<SetStateAction<File | null>>,
  fileData : string | null,
  setFileData : Dispatch<SetStateAction<string | null>>,
  disabled : boolean
}

const ReadFileButton = ({file, setFile, fileData, setFileData, disabled} : ReadFileButtonProps) => {

  const onFileSelected = (event : ChangeEvent) => {
    const selectedFiles : FileList | null = (event.target as HTMLInputElement)?.files
    const selectedFile : File | null = selectedFiles !== null && selectedFiles.length > 0 ? selectedFiles[0] : null
    setFile(selectedFile)
    readFileData(selectedFile, setFileData)
  }

  return (
    <Button
      component='label'
      role={undefined}
      variant={file?.name ? 'contained' : 'outlined'}
      tabIndex={-1}
      startIcon={<FileIcon type='csv' />}
      size='large'
      fullWidth
      disabled={disabled}
    >
      {file?.name || 'Select File'}
      <VisuallyHiddenInput
        type="file"
        accept='.csv'
        onChange={onFileSelected}
      />
    </Button>
  );
}

export default ReadFileButton