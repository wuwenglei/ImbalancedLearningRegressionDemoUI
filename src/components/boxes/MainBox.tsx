'use client'
import { getRequestRecordDefaultValues, RequestRecord } from "@/common/metadata";
import RequestIdAlert from "@/components/alerts/RequestIdAlert";
import RechartsAreaChartCard from "@/components/cards/RechartsAreaChartCard";
import Box from '@mui/material/Box';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

interface HomeContextValue {
  requestId : string,
  setRequestId : Dispatch<SetStateAction<string>>,
  openRequestIdAlert : boolean,
  setOpenRequestIdAlert : Dispatch<SetStateAction<boolean>>,
  requestRecord : RequestRecord,
  setRequestRecord : Dispatch<SetStateAction<RequestRecord>>,
}

export const HomeContext = createContext<HomeContextValue>({
  requestId: '',
  setRequestId: () => {},
  openRequestIdAlert: false,
  setOpenRequestIdAlert: () => {},
  requestRecord : getRequestRecordDefaultValues(),
  setRequestRecord: () => {}
})

const MainBox = () => {
  const [requestId, setRequestId] = useState<string>('')
  const [openRequestIdAlert, setOpenRequestIdAlert] = useState<boolean>(false)
  const [requestRecord, setRequestRecord] = useState<RequestRecord>(getRequestRecordDefaultValues())

  useEffect(() => {
    if (requestId !== '') {
      setOpenRequestIdAlert(true)
    }
  }, [requestId])

  return (
    <HomeContext.Provider value={{requestId, setRequestId, openRequestIdAlert, setOpenRequestIdAlert, requestRecord, setRequestRecord}}>
      <Box position="fixed" left={0} top={0} height="100%" width="100%" margin={0} display="flex" flexDirection="column" sx={{ bgcolor: '#f3f4f9' }}>
        <RequestIdAlert />
        <RechartsAreaChartCard />
      </Box>
    </HomeContext.Provider>
  );
}

export default MainBox
