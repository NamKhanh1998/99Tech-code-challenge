import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import styled from "styled-components";
import Flex from "@/components/ui/Flex";
import Text from "@/components/ui/Text";
import SettingModal from "./SettingModal";

const IconWrap = styled(Flex)`
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
  transition: all 0.2s;
  padding: 3px;
  border-radius: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecond};
    transform: scale(1.1);
  }
`;

const Settings = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flex style={{ gap: "4px" }}>
        <IconWrap onClick={() => setOpen(true)}>
          <SettingsIcon
            sx={{
              width: 16,
              height: 16,
            }}
          />
        </IconWrap>
      </Flex>

      <SettingModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Settings;
